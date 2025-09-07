import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  githubRepositories, 
  githubFiles, 
  githubSyncLogs,
  type InsertGithubRepository,
  type InsertGithubFile,
  type InsertGithubSyncLog
} from "@shared/schema";

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

export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';

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
      repositoryId: '', // Will be updated after repository creation
      syncType: 'full',
      status: 'in-progress',
      filesProcessed: 0,
      filesAdded: 0,
      filesUpdated: 0,
      filesDeleted: 0
    };

    try {
      // Fetch repository information
      const repoInfo = await this.fetchRepositoryInfo(owner, repo);
      if (!repoInfo) {
        return { success: false, error: 'Failed to fetch repository information' };
      }

      // Create or update repository record
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

      // Fetch repository contents
      const contents = await this.fetchRepositoryContents(owner, repo);
      let filesProcessed = 0;
      let filesAdded = 0;
      let filesUpdated = 0;

      for (const item of contents) {
        if (item.type === 'file') {
          filesProcessed++;

          // Determine file type and if it's renderable
          const fileType = this.getFileType(item.name);
          const isRenderable = this.isRenderableFile(fileType);

          // Fetch content for text files
          let content: string | null = null;
          if (isRenderable && item.size < 1024 * 1024) { // Only fetch content for files < 1MB
            content = await this.fetchFileContent(owner, repo, item.path);
          }

          // Check if file already exists
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

      // Create sync log
      syncLog.status = 'success';
      syncLog.filesProcessed = filesProcessed;
      syncLog.filesAdded = filesAdded;
      syncLog.filesUpdated = filesUpdated;
      syncLog.completedAt = new Date();

      await db.insert(githubSyncLogs).values(syncLog);

      return { success: true, repositoryId };

    } catch (error) {
      console.error('Error syncing repository:', error);
      
      // Log the error
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
    
    // Add dashboard-specific tags
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