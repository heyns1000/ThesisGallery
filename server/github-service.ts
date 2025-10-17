import { eq, desc, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  githubRepositories, 
  githubFiles, 
  githubSyncLogs,
  type InsertGithubRepository,
  type InsertGithubFile,
  type InsertGithubSyncLog
} from "@shared/schema";
import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

export interface GitHubRepositoryInfo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
  };
  private: boolean;
  default_branch: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  size: number;
  updated_at: string;
  created_at: string;
}

export interface GitHubFileInfo {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

export interface GitHubFileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  sha?: string;
  children?: GitHubFileTreeItem[];
}

let connectionSettings: any;

export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';

  private async getAccessToken(): Promise<string> {
    if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
      return connectionSettings.settings.access_token;
    }
    
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY 
      ? 'repl ' + process.env.REPL_IDENTITY 
      : process.env.WEB_REPL_RENEWAL 
      ? 'depl ' + process.env.WEB_REPL_RENEWAL 
      : null;

    if (!xReplitToken) {
      throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }

    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

    if (!connectionSettings || !accessToken) {
      throw new Error('GitHub not connected');
    }
    return accessToken;
  }

  private async getGitHubClient(): Promise<Octokit> {
    const accessToken = await this.getAccessToken();
    return new Octokit({ auth: accessToken });
  }

  async fetchAllUserRepositories(username: string): Promise<GitHubRepositoryInfo[]> {
    try {
      const octokit = await this.getGitHubClient();
      const response = await octokit.repos.listForUser({
        username,
        per_page: 100,
        sort: 'updated',
        direction: 'desc'
      });

      console.log(`📦 Fetched ${response.data.length} repositories for ${username}`);
      return response.data as GitHubRepositoryInfo[];
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      return [];
    }
  }

  async refreshAllRepositories(username: string): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const repos = await this.fetchAllUserRepositories(username);
      let savedCount = 0;

      for (const repoInfo of repos) {
        const existingRepo = await db.select().from(githubRepositories)
          .where(eq(githubRepositories.fullName, repoInfo.full_name))
          .limit(1);

        if (existingRepo.length > 0) {
          await db.update(githubRepositories)
            .set({
              description: repoInfo.description,
              language: repoInfo.language,
              starCount: repoInfo.stargazers_count,
              forkCount: repoInfo.forks_count,
              topics: repoInfo.topics,
              updatedAt: new Date()
            })
            .where(eq(githubRepositories.id, existingRepo[0].id));
        } else {
          const newRepo: InsertGithubRepository = {
            name: repoInfo.name,
            fullName: repoInfo.full_name,
            description: repoInfo.description,
            htmlUrl: repoInfo.html_url,
            owner: repoInfo.owner.login,
            isPrivate: repoInfo.private,
            defaultBranch: repoInfo.default_branch,
            language: repoInfo.language,
            starCount: repoInfo.stargazers_count,
            forkCount: repoInfo.forks_count,
            topics: repoInfo.topics,
            isActive: true
          };

          await db.insert(githubRepositories).values(newRepo);
          savedCount++;
        }
      }

      console.log(`✅ Refreshed ${repos.length} repositories (${savedCount} new)`);
      return { success: true, count: repos.length };
    } catch (error) {
      console.error('Error refreshing repositories:', error);
      return { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getFileTree(owner: string, repo: string, path: string = ''): Promise<GitHubFileTreeItem[]> {
    try {
      const octokit = await this.getGitHubClient();
      
      const { data: repoData } = await octokit.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;

      const { data: tree } = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: 'true'
      });

      const items: GitHubFileTreeItem[] = [];
      const pathMap = new Map<string, GitHubFileTreeItem>();

      tree.tree.forEach(item => {
        if (!item.path) return;

        const treeItem: GitHubFileTreeItem = {
          name: item.path.split('/').pop() || item.path,
          path: item.path,
          type: item.type === 'blob' ? 'file' : 'dir',
          size: item.size,
          sha: item.sha
        };

        if (item.type === 'tree') {
          treeItem.children = [];
        }

        pathMap.set(item.path, treeItem);

        const parentPath = item.path.split('/').slice(0, -1).join('/');
        if (parentPath) {
          const parent = pathMap.get(parentPath);
          if (parent && parent.children) {
            parent.children.push(treeItem);
          }
        } else {
          items.push(treeItem);
        }
      });

      return items;
    } catch (error) {
      console.error('Error fetching file tree:', error);
      return [];
    }
  }

  async cloneRepository(owner: string, repo: string): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
      const octokit = await this.getGitHubClient();
      const targetDir = `/home/runner/workspace/${repo}`;

      console.log(`📦 Cloning ${owner}/${repo}...`);

      const { data: repoData } = await octokit.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;

      const { data: tree } = await octokit.git.getTree({
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: 'true'
      });

      console.log(`📁 Found ${tree.tree.length} items`);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      let downloaded = 0;
      for (const item of tree.tree) {
        if (item.type === 'blob' && item.path) {
          const filePath = path.join(targetDir, item.path);
          const dir = path.dirname(filePath);
          
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          try {
            const { data: blob } = await octokit.git.getBlob({
              owner,
              repo,
              file_sha: item.sha!
            });

            const content = Buffer.from(blob.content, blob.encoding as BufferEncoding);
            fs.writeFileSync(filePath, content);
            downloaded++;
            
            if (downloaded % 10 === 0) {
              console.log(`⬇️  Downloaded ${downloaded}/${tree.tree.filter(i => i.type === 'blob').length} files...`);
            }
          } catch (error) {
            console.error(`❌ Error downloading ${item.path}:`, error);
          }
        }
      }

      console.log(`✅ Successfully cloned ${downloaded} files to ${targetDir}`);
      
      return { success: true, path: targetDir };
    } catch (error) {
      console.error('Error cloning repository:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getRepositoryStats(): Promise<{ totalRepos: number; totalStars: number; totalForks: number; languages: Record<string, number> }> {
    try {
      const repos = await db.select().from(githubRepositories)
        .where(eq(githubRepositories.isActive, true));

      const stats = {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + (repo.starCount || 0), 0),
        totalForks: repos.reduce((sum, repo) => sum + (repo.forkCount || 0), 0),
        languages: {} as Record<string, number>
      };

      repos.forEach(repo => {
        if (repo.language) {
          stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching repository stats:', error);
      return { totalRepos: 0, totalStars: 0, totalForks: 0, languages: {} };
    }
  }

  async fetchRepositoryInfo(owner: string, repo: string): Promise<GitHubRepositoryInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`);
      if (!response.ok) {
        console.error(`Failed to fetch repository info: ${response.status} ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching repository info:', error);
      return null;
    }
  }

  async fetchRepositoryContents(owner: string, repo: string, path: string = ''): Promise<GitHubFileInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`);
      if (!response.ok) {
        console.error(`Failed to fetch repository contents: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('Error fetching repository contents:', error);
      return [];
    }
  }

  async fetchFileContent(owner: string, repo: string, path: string): Promise<string | null> {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`);
      if (!response.ok) {
        console.error(`Failed to fetch file content: ${response.status} ${response.statusText}`);
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching file content:', error);
      return null;
    }
  }

  async syncRepository(owner: string, repo: string): Promise<{ success: boolean; repositoryId?: string; error?: string }> {
    const syncLog: InsertGithubSyncLog = {
      repositoryId: '',
      syncType: 'full',
      status: 'in-progress',
      filesProcessed: 0,
      filesAdded: 0,
      filesUpdated: 0,
      filesDeleted: 0
    };

    try {
      const repoInfo = await this.fetchRepositoryInfo(owner, repo);
      if (!repoInfo) {
        return { success: false, error: 'Failed to fetch repository information' };
      }

      const existingRepo = await db.select().from(githubRepositories)
        .where(eq(githubRepositories.fullName, repoInfo.full_name))
        .limit(1);

      let repositoryId: string;

      if (existingRepo.length > 0) {
        repositoryId = existingRepo[0].id;
        await db.update(githubRepositories)
          .set({
            description: repoInfo.description,
            language: repoInfo.language,
            starCount: repoInfo.stargazers_count,
            forkCount: repoInfo.forks_count,
            topics: repoInfo.topics,
            lastSyncAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(githubRepositories.id, repositoryId));
      } else {
        const newRepo: InsertGithubRepository = {
          name: repoInfo.name,
          fullName: repoInfo.full_name,
          description: repoInfo.description,
          htmlUrl: repoInfo.html_url,
          owner: repoInfo.owner.login,
          isPrivate: repoInfo.private,
          defaultBranch: repoInfo.default_branch,
          language: repoInfo.language,
          starCount: repoInfo.stargazers_count,
          forkCount: repoInfo.forks_count,
          topics: repoInfo.topics,
          isActive: true
        };

        const [createdRepo] = await db.insert(githubRepositories)
          .values(newRepo)
          .returning();
        repositoryId = createdRepo.id;
      }

      syncLog.repositoryId = repositoryId;

      const contents = await this.fetchRepositoryContents(owner, repo);
      let filesProcessed = 0;
      let filesAdded = 0;
      let filesUpdated = 0;

      for (const item of contents) {
        if (item.type === 'file') {
          filesProcessed++;

          const fileType = this.getFileType(item.name);
          const isRenderable = this.isRenderableFile(fileType);

          let content: string | null = null;
          if (isRenderable && item.size < 1024 * 1024) {
            content = await this.fetchFileContent(owner, repo, item.path);
          }

          const existingFile = await db.select().from(githubFiles)
            .where(eq(githubFiles.filePath, item.path))
            .where(eq(githubFiles.repositoryId, repositoryId))
            .limit(1);

          const fileData: InsertGithubFile = {
            repositoryId,
            fileName: item.name,
            filePath: item.path,
            fileType,
            fileSize: item.size,
            content,
            rawUrl: item.download_url,
            htmlUrl: item.html_url,
            sha: item.sha,
            encoding: item.encoding || 'utf-8',
            isRenderable,
            tags: this.generateFileTags(item.name, fileType)
          };

          if (existingFile.length > 0) {
            await db.update(githubFiles)
              .set({ 
                ...fileData,
                updatedAt: new Date()
              })
              .where(eq(githubFiles.id, existingFile[0].id));
            filesUpdated++;
          } else {
            await db.insert(githubFiles).values(fileData);
            filesAdded++;
          }
        }
      }

      syncLog.status = 'success';
      syncLog.filesProcessed = filesProcessed;
      syncLog.filesAdded = filesAdded;
      syncLog.filesUpdated = filesUpdated;
      syncLog.completedAt = new Date();

      await db.insert(githubSyncLogs).values(syncLog);

      return { success: true, repositoryId };

    } catch (error) {
      console.error('Error syncing repository:', error);
      
      syncLog.status = 'error';
      syncLog.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      syncLog.completedAt = new Date();
      
      if (syncLog.repositoryId) {
        await db.insert(githubSyncLogs).values(syncLog);
      }

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
      case 'htm':
        return 'html';
      case 'md':
      case 'markdown':
        return 'markdown';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'txt':
        return 'text';
      case 'py':
        return 'python';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'video';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return 'image';
      case 'pdf':
        return 'pdf';
      default:
        return 'unknown';
    }
  }

  private isRenderableFile(fileType: string): boolean {
    return ['html', 'markdown', 'javascript', 'typescript', 'css', 'json', 'text', 'python'].includes(fileType);
  }

  private generateFileTags(fileName: string, fileType: string): string[] {
    const tags: string[] = [fileType];
    
    if (fileName.includes('dashboard')) {
      tags.push('dashboard');
    }
    if (fileName.includes('security')) {
      tags.push('security');
    }
    if (fileName.includes('baobab')) {
      tags.push('baobab', 'faa-zone');
    }
    if (fileName.includes('wildlife')) {
      tags.push('wildlife', 'conservation');
    }
    if (fileName.includes('energy')) {
      tags.push('energy', 'sustainability');
    }
    if (fileName.includes('water')) {
      tags.push('water', 'resources');
    }
    if (fileName.includes('ocean')) {
      tags.push('ocean', 'environmental');
    }
    if (fileName.includes('deforestation')) {
      tags.push('deforestation', 'environmental');
    }

    return tags;
  }

  async getRepositories() {
    return await db.select().from(githubRepositories)
      .where(eq(githubRepositories.isActive, true))
      .orderBy(desc(githubRepositories.createdAt));
  }

  async getRepositoryFiles(repositoryId: string) {
    return await db.select().from(githubFiles)
      .where(eq(githubFiles.repositoryId, repositoryId))
      .orderBy(githubFiles.fileName);
  }

  async getFileById(fileId: string) {
    const [file] = await db.select().from(githubFiles)
      .where(eq(githubFiles.id, fileId));
    return file || null;
  }

  async getSyncLogs(repositoryId?: string) {
    const query = db.select().from(githubSyncLogs);
    
    if (repositoryId) {
      query.where(eq(githubSyncLogs.repositoryId, repositoryId));
    }
    
    return await query.orderBy(desc(githubSyncLogs.startedAt));
  }
}

export const githubService = new GitHubService();
