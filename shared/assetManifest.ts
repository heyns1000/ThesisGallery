import { z } from "zod";

export interface AssetFile {
  filename: string;
  path: string;
  type: string;
  size: number;
  hash: string;
  lastModified: Date;
  cdnEnabled?: boolean;
}

export interface AssetCategory {
  path: string;
  count: number;
  totalSize: number;
  files: AssetFile[];
  syncSchedule?: 'realtime' | 'hourly' | 'daily';
}

export interface RepositoryInfo {
  name: string;
  archivePath: string;
  extractedPath?: string;
  status: 'archived' | 'extracted' | 'indexed';
  fileCount?: number;
}

export interface DistributionConfig {
  cdnEnabled: boolean;
  cdnBaseUrl?: string;
  syncTargets: string[];
  autoSync: boolean;
}

export interface AssetManifest {
  version: string;
  generatedAt: Date;
  assets: {
    templates: AssetCategory;
    images: AssetCategory;
    archives: AssetCategory;
    documents: AssetCategory;
    other: AssetCategory;
  };
  repositories: RepositoryInfo[];
  distribution: DistributionConfig;
  totalFiles: number;
  totalSize: number;
}

export const assetFileSchema = z.object({
  filename: z.string(),
  path: z.string(),
  type: z.string(),
  size: z.number(),
  hash: z.string(),
  lastModified: z.date(),
  cdnEnabled: z.boolean().optional(),
});

export const assetCategorySchema = z.object({
  path: z.string(),
  count: z.number(),
  totalSize: z.number(),
  files: z.array(assetFileSchema),
  syncSchedule: z.enum(['realtime', 'hourly', 'daily']).optional(),
});

export const repositoryInfoSchema = z.object({
  name: z.string(),
  archivePath: z.string(),
  extractedPath: z.string().optional(),
  status: z.enum(['archived', 'extracted', 'indexed']),
  fileCount: z.number().optional(),
});

export const distributionConfigSchema = z.object({
  cdnEnabled: z.boolean(),
  cdnBaseUrl: z.string().optional(),
  syncTargets: z.array(z.string()),
  autoSync: z.boolean(),
});

export const assetManifestSchema = z.object({
  version: z.string(),
  generatedAt: z.date(),
  assets: z.object({
    templates: assetCategorySchema,
    images: assetCategorySchema,
    archives: assetCategorySchema,
    documents: assetCategorySchema,
    other: assetCategorySchema,
  }),
  repositories: z.array(repositoryInfoSchema),
  distribution: distributionConfigSchema,
  totalFiles: z.number(),
  totalSize: z.number(),
});

export type AssetFileType = z.infer<typeof assetFileSchema>;
export type AssetCategoryType = z.infer<typeof assetCategorySchema>;
export type RepositoryInfoType = z.infer<typeof repositoryInfoSchema>;
export type DistributionConfigType = z.infer<typeof distributionConfigSchema>;
export type AssetManifestType = z.infer<typeof assetManifestSchema>;
