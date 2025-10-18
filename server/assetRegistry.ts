import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import type {
  AssetManifest,
  AssetCategory,
  AssetFile,
  RepositoryInfo,
  DistributionConfig
} from '@shared/assetManifest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AssetRegistry {
  private assetsPath = path.join(__dirname, '../attached_assets');
  private manifestPath = path.join(__dirname, '../shared/assetManifest.json');

  // Known repository names from FruitfulPlanetChange
  private knownRepositories = [
    'agriculture.seedwave',
    'ai-logic.seedwave',
    'baobab',
    'interns.seedwave',
    'legal',
    'mining.seedwave',
    'ritual.seedwave',
    'samfox',
    'toynest.seedwave',
    'vaultmesh',
    'wildlife.seedwave'
  ];

  /**
   * Calculate SHA-256 hash for a file
   */
  private async hashFile(filepath: string): Promise<string> {
    try {
      const fileBuffer = await fs.readFile(filepath);
      const hashSum = crypto.createHash('sha256');
      hashSum.update(fileBuffer);
      return hashSum.digest('hex');
    } catch (error) {
      console.error(`Error hashing file ${filepath}:`, error);
      return '';
    }
  }

  /**
   * Categorize file by extension
   */
  private categorizeFile(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    
    // Templates (HTML, PHP, etc.)
    if (['.html', '.htm', '.php', '.jsp', '.asp'].includes(ext)) {
      return 'templates';
    }
    
    // Images
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp'].includes(ext)) {
      return 'images';
    }
    
    // Archives
    if (['.zip', '.tar', '.gz', '.rar', '.7z', '.tar.gz'].includes(ext)) {
      return 'archives';
    }
    
    // Documents
    if (['.pdf', '.doc', '.docx', '.txt', '.md', '.xlsx', '.xls', '.csv', '.json', '.xml'].includes(ext)) {
      return 'documents';
    }
    
    return 'other';
  }

  /**
   * Extract repository name from zip filename
   * e.g., "samfox-main_1756074678093.zip" → "samfox"
   */
  private extractRepositoryName(filename: string): string | null {
    for (const repoName of this.knownRepositories) {
      if (filename.toLowerCase().includes(repoName.toLowerCase())) {
        return repoName;
      }
    }
    
    // Try to extract from pattern like "name-main_timestamp.zip"
    const match = filename.match(/^([a-z\-\.]+)(-main)?_\d+\.zip$/i);
    if (match) {
      return match[1];
    }
    
    return null;
  }

  /**
   * Recursively scan directory and collect file information
   */
  private async scanDirectory(dirPath: string, baseDir: string = dirPath): Promise<AssetFile[]> {
    const files: AssetFile[] = [];
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(baseDir, fullPath);
        
        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subFiles = await this.scanDirectory(fullPath, baseDir);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          try {
            const stats = await fs.stat(fullPath);
            const hash = await this.hashFile(fullPath);
            
            const assetFile: AssetFile = {
              filename: entry.name,
              path: relativePath,
              type: path.extname(entry.name).toLowerCase().slice(1) || 'unknown',
              size: stats.size,
              hash: hash,
              lastModified: stats.mtime,
              cdnEnabled: false,
            };
            
            files.push(assetFile);
          } catch (error) {
            console.error(`Error processing file ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
    
    return files;
  }

  /**
   * Identify embedded repositories (zip files)
   */
  async identifyRepositories(): Promise<RepositoryInfo[]> {
    const repositories: RepositoryInfo[] = [];
    
    try {
      const entries = await fs.readdir(this.assetsPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.toLowerCase().endsWith('.zip')) {
          const repoName = this.extractRepositoryName(entry.name);
          if (repoName) {
            const fullPath = path.join(this.assetsPath, entry.name);
            const stats = await fs.stat(fullPath);
            
            repositories.push({
              name: repoName,
              archivePath: entry.name,
              status: 'archived',
              fileCount: 0, // Would need to unzip to count
            });
          }
        }
      }
    } catch (error) {
      console.error('Error identifying repositories:', error);
    }
    
    return repositories;
  }

  /**
   * Scan all assets and return categorized results
   */
  async scanAssets(): Promise<{
    templates: AssetFile[];
    images: AssetFile[];
    archives: AssetFile[];
    documents: AssetFile[];
    other: AssetFile[];
  }> {
    console.log(`📂 Scanning directory: ${this.assetsPath}`);
    
    const allFiles = await this.scanDirectory(this.assetsPath);
    
    const categorized = {
      templates: [] as AssetFile[],
      images: [] as AssetFile[],
      archives: [] as AssetFile[],
      documents: [] as AssetFile[],
      other: [] as AssetFile[],
    };
    
    for (const file of allFiles) {
      const category = this.categorizeFile(file.filename);
      categorized[category as keyof typeof categorized].push(file);
    }
    
    console.log(`✅ Scanned ${allFiles.length} files`);
    console.log(`   Templates: ${categorized.templates.length}`);
    console.log(`   Images: ${categorized.images.length}`);
    console.log(`   Archives: ${categorized.archives.length}`);
    console.log(`   Documents: ${categorized.documents.length}`);
    console.log(`   Other: ${categorized.other.length}`);
    
    return categorized;
  }

  /**
   * Generate complete asset manifest
   */
  async generateManifest(): Promise<AssetManifest> {
    console.log('🔍 Generating asset manifest...');
    
    const categorizedFiles = await this.scanAssets();
    const repositories = await this.identifyRepositories();
    
    // Calculate totals for each category
    const createCategory = (files: AssetFile[], categoryPath: string): AssetCategory => {
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      return {
        path: categoryPath,
        count: files.length,
        totalSize,
        files,
        syncSchedule: 'daily',
      };
    };
    
    const distribution: DistributionConfig = {
      cdnEnabled: false,
      cdnBaseUrl: undefined,
      syncTargets: [],
      autoSync: false,
    };
    
    const allFiles = [
      ...categorizedFiles.templates,
      ...categorizedFiles.images,
      ...categorizedFiles.archives,
      ...categorizedFiles.documents,
      ...categorizedFiles.other,
    ];
    
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    
    const manifest: AssetManifest = {
      version: '1.0.0',
      generatedAt: new Date(),
      assets: {
        templates: createCategory(categorizedFiles.templates, 'attached_assets/templates'),
        images: createCategory(categorizedFiles.images, 'attached_assets/images'),
        archives: createCategory(categorizedFiles.archives, 'attached_assets/archives'),
        documents: createCategory(categorizedFiles.documents, 'attached_assets/documents'),
        other: createCategory(categorizedFiles.other, 'attached_assets/other'),
      },
      repositories,
      distribution,
      totalFiles: allFiles.length,
      totalSize,
    };
    
    console.log('✅ Manifest generated successfully');
    console.log(`   Total files: ${manifest.totalFiles}`);
    console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Repositories: ${repositories.length}`);
    
    return manifest;
  }

  /**
   * Save manifest to JSON file
   */
  async saveManifest(manifest: AssetManifest): Promise<void> {
    try {
      const manifestJson = JSON.stringify(manifest, null, 2);
      await fs.writeFile(this.manifestPath, manifestJson, 'utf-8');
      console.log(`💾 Manifest saved to: ${this.manifestPath}`);
    } catch (error) {
      console.error('Error saving manifest:', error);
      throw error;
    }
  }

  /**
   * Load manifest from JSON file
   */
  async loadManifest(): Promise<AssetManifest | null> {
    try {
      const manifestJson = await fs.readFile(this.manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestJson);
      
      // Convert date strings back to Date objects
      manifest.generatedAt = new Date(manifest.generatedAt);
      for (const category of Object.values(manifest.assets) as AssetCategory[]) {
        for (const file of category.files) {
          file.lastModified = new Date(file.lastModified);
        }
      }
      
      return manifest;
    } catch (error) {
      console.log('No existing manifest found');
      return null;
    }
  }

  /**
   * Get manifest stats for quick overview
   */
  async getManifestStats() {
    const manifest = await this.loadManifest();
    if (!manifest) {
      return null;
    }
    
    return {
      version: manifest.version,
      generatedAt: manifest.generatedAt,
      totalFiles: manifest.totalFiles,
      totalSize: manifest.totalSize,
      totalSizeMB: (manifest.totalSize / 1024 / 1024).toFixed(2),
      categories: {
        templates: manifest.assets.templates.count,
        images: manifest.assets.images.count,
        archives: manifest.assets.archives.count,
        documents: manifest.assets.documents.count,
        other: manifest.assets.other.count,
      },
      repositories: manifest.repositories.length,
    };
  }
}

// Export singleton instance
export const assetRegistry = new AssetRegistry();
