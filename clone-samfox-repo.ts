import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
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

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function downloadSamFoxRepository() {
  const octokit = await getGitHubClient();
  const owner = 'heyns1000';
  const repo = 'samfox';
  const targetDir = '/home/runner/workspace/SamFoxStudioData';

  console.log(`🦁 Downloading SamFox Studio repository: ${owner}/${repo}...`);

  try {
    // Get the default branch
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;
    console.log(`📂 Default branch: ${defaultBranch}`);

    // Get the tree
    const { data: tree } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: 'true'
    });

    console.log(`📁 Found ${tree.tree.length} items in SamFox Studio repository`);

    // Create target directory
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Download all files
    let downloaded = 0;
    const totalFiles = tree.tree.filter(i => i.type === 'blob').length;
    
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
            console.log(`⬇️  Downloaded ${downloaded}/${totalFiles} SamFox files...`);
          }
        } catch (error) {
          console.error(`❌ Error downloading ${item.path}:`, error);
        }
      }
    }

    console.log(`✅ Successfully downloaded ${downloaded} SamFox Studio files to ${targetDir}`);
    console.log(`📊 Repository structure:`);
    
    // Show directory structure
    const files = fs.readdirSync(targetDir);
    console.log(files.join(', '));
    
    // Create index of downloaded files
    const fileIndex = {
      repository: `${owner}/${repo}`,
      downloadedAt: new Date().toISOString(),
      totalFiles: downloaded,
      structure: tree.tree.filter(i => i.type === 'blob').map(i => ({
        path: i.path,
        size: i.size,
        sha: i.sha
      }))
    };
    
    fs.writeFileSync(
      path.join(targetDir, 'SAMFOX_REPOSITORY_INDEX.json'),
      JSON.stringify(fileIndex, null, 2)
    );
    
    console.log(`📋 Created repository index at ${targetDir}/SAMFOX_REPOSITORY_INDEX.json`);
    
  } catch (error: any) {
    console.error(`❌ Error cloning SamFox repository:`, error.message);
    console.log(`ℹ️  Repository may be private or unavailable. Using existing data from ecosystem files.`);
  }
}

downloadSamFoxRepository().catch(console.error);
