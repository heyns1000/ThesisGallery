import { db } from "./db";
import { hotstackWorkers, hotstackDeployments, hotstackR2Storage, hotstackStations, systemSettings } from "@shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

interface CloudflareWorker {
  id: string;
  name: string;
  script_name: string;
  created_on: string;
  modified_on: string;
  routes?: any[];
  environment?: string;
}

interface CloudflareDeployment {
  id: string;
  created_on: string;
  version?: string;
}

interface CloudflareR2Bucket {
  name: string;
  creation_date: string;
  location?: string;
}

interface CloudflareR2BucketStats {
  objectCount: number;
  payloadSize: number;
}

export class CloudflareService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://api.cloudflare.com/client/v4';
  }

  private async getApiToken(): Promise<string> {
    try {
      const settings = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, 'CLOUDFLARE_API_TOKEN'))
        .limit(1);

      if (settings.length > 0 && settings[0].value) {
        return settings[0].value;
      }
    } catch (error) {
      console.error('Error fetching API token from database:', error);
    }

    return process.env.CLOUDFLARE_API_TOKEN || '';
  }

  private async getAccountId(): Promise<string> {
    try {
      const settings = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, 'CLOUDFLARE_ACCOUNT_ID'))
        .limit(1);

      if (settings.length > 0 && settings[0].value) {
        return settings[0].value;
      }
    } catch (error) {
      console.error('Error fetching account ID from database:', error);
    }

    return process.env.CLOUDFLARE_ACCOUNT_ID || '';
  }

  private async getR2AccessKeyId(): Promise<string> {
    try {
      const settings = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, 'CLOUDFLARE_R2_ACCESS_KEY_ID'))
        .limit(1);

      if (settings.length > 0 && settings[0].value) {
        return settings[0].value;
      }
    } catch (error) {
      console.error('Error fetching R2 access key ID from database:', error);
    }

    return process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
  }

  private async getR2SecretAccessKey(): Promise<string> {
    try {
      const settings = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, 'CLOUDFLARE_R2_SECRET_ACCESS_KEY'))
        .limit(1);

      if (settings.length > 0 && settings[0].value) {
        return settings[0].value;
      }
    } catch (error) {
      console.error('Error fetching R2 secret access key from database:', error);
    }

    return process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
  }

  // AWS Signature V4 signing for R2 S3-compatible API
  private async signR2Request(
    method: string,
    url: string,
    headers: Record<string, string>,
    payload: Buffer | string = ''
  ): Promise<Record<string, string>> {
    const accessKeyId = await this.getR2AccessKeyId();
    const secretAccessKey = await this.getR2SecretAccessKey();

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('R2 credentials (CLOUDFLARE_R2_ACCESS_KEY_ID and CLOUDFLARE_R2_SECRET_ACCESS_KEY) are not configured');
    }

    const urlObj = new URL(url);
    const host = urlObj.hostname;
    const canonicalUri = urlObj.pathname;
    
    // Build canonical query string from URL search params
    let canonicalQueryString = '';
    if (urlObj.search) {
      const params = new URLSearchParams(urlObj.search);
      const sortedParams: [string, string][] = [];
      
      params.forEach((value, key) => {
        sortedParams.push([key, value]);
      });
      
      // Sort alphabetically by parameter name
      sortedParams.sort((a, b) => a[0].localeCompare(b[0]));
      
      // Build canonical query string with URI encoding
      canonicalQueryString = sortedParams
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    }
    
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);
    
    const region = 'auto'; // R2 uses 'auto' as the region
    const service = 's3';
    
    // Add required headers
    const signedHeaders: Record<string, string> = {
      ...headers,
      'host': host,
      'x-amz-date': amzDate,
    };

    // Calculate payload hash
    const payloadHash = crypto
      .createHash('sha256')
      .update(payload)
      .digest('hex');
    
    signedHeaders['x-amz-content-sha256'] = payloadHash;

    // Create canonical headers string
    const headerKeys = Object.keys(signedHeaders).sort();
    const canonicalHeaders = headerKeys
      .map(key => `${key.toLowerCase()}:${signedHeaders[key].trim()}\n`)
      .join('');
    
    const signedHeadersList = headerKeys.map(key => key.toLowerCase()).join(';');

    // Create canonical request (AWS SigV4 format)
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeadersList,
      payloadHash
    ].join('\n');

    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = crypto
      .createHash('sha256')
      .update(canonicalRequest)
      .digest('hex');
    
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash
    ].join('\n');

    // Calculate signature
    const getSignatureKey = (key: string, dateStamp: string, region: string, service: string) => {
      const kDate = crypto.createHmac('sha256', `AWS4${key}`).update(dateStamp).digest();
      const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
      const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
      const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
      return kSigning;
    };

    const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex');

    // Create authorization header
    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersList}, Signature=${signature}`;
    
    signedHeaders['Authorization'] = authorizationHeader;
    
    return signedHeaders;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const apiToken = await this.getApiToken();
    
    if (!apiToken) {
      throw new Error('CLOUDFLARE_API_TOKEN is not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  async getWorkers(): Promise<CloudflareWorker[]> {
    try {
      const accountId = await this.getAccountId();
      const data = await this.makeRequest(`/accounts/${accountId}/workers/scripts`);
      return data.result || [];
    } catch (error) {
      console.error('Error fetching workers:', error);
      return [];
    }
  }

  async getWorkerDetails(scriptName: string): Promise<CloudflareWorker | null> {
    try {
      const accountId = await this.getAccountId();
      const data = await this.makeRequest(`/accounts/${accountId}/workers/scripts/${scriptName}`);
      return data.result || null;
    } catch (error) {
      console.error(`Error fetching worker ${scriptName}:`, error);
      return null;
    }
  }

  async getWorkerDeployments(scriptName: string): Promise<CloudflareDeployment[]> {
    try {
      const accountId = await this.getAccountId();
      const data = await this.makeRequest(`/accounts/${accountId}/workers/scripts/${scriptName}/deployments`);
      return data.result?.items || [];
    } catch (error) {
      console.error(`Error fetching deployments for ${scriptName}:`, error);
      return [];
    }
  }

  async getR2Buckets(): Promise<CloudflareR2Bucket[]> {
    try {
      const accountId = await this.getAccountId();
      const data = await this.makeRequest(`/accounts/${accountId}/r2/buckets`);
      return data.result?.buckets || [];
    } catch (error) {
      console.error('Error fetching R2 buckets:', error);
      return [];
    }
  }

  async getR2BucketStats(bucketName: string): Promise<CloudflareR2BucketStats | null> {
    try {
      const accountId = await this.getAccountId();
      const data = await this.makeRequest(`/accounts/${accountId}/r2/buckets/${bucketName}/stats`);
      return data.result || null;
    } catch (error) {
      console.error(`Error fetching stats for bucket ${bucketName}:`, error);
      return null;
    }
  }

  async syncWorkersToDb(): Promise<{ synced: number; errors: number }> {
    const workers = await this.getWorkers();
    const accountId = await this.getAccountId();
    let synced = 0;
    let errors = 0;

    for (const worker of workers) {
      try {
        const existing = await db.select().from(hotstackWorkers).where(eq(hotstackWorkers.workerId, worker.id));

        if (existing.length > 0) {
          await db.update(hotstackWorkers)
            .set({
              name: worker.name,
              scriptName: worker.script_name,
              modifiedOn: new Date(worker.modified_on),
              routes: worker.routes || null,
              environment: worker.environment || 'production',
              updatedAt: new Date(),
            })
            .where(eq(hotstackWorkers.workerId, worker.id));
        } else {
          await db.insert(hotstackWorkers).values({
            workerId: worker.id,
            name: worker.name,
            scriptName: worker.script_name,
            accountId: accountId,
            status: 'active',
            routes: worker.routes || null,
            environment: worker.environment || 'production',
            createdOn: new Date(worker.created_on),
            modifiedOn: new Date(worker.modified_on),
          });
        }
        synced++;
      } catch (error) {
        console.error(`Error syncing worker ${worker.name}:`, error);
        errors++;
      }
    }

    return { synced, errors };
  }

  async syncR2BucketsToDb(): Promise<{ synced: number; errors: number }> {
    const buckets = await this.getR2Buckets();
    const accountId = await this.getAccountId();
    let synced = 0;
    let errors = 0;

    for (const bucket of buckets) {
      try {
        const stats = await this.getR2BucketStats(bucket.name);
        const existing = await db.select().from(hotstackR2Storage).where(eq(hotstackR2Storage.bucketName, bucket.name));

        if (existing.length > 0) {
          await db.update(hotstackR2Storage)
            .set({
              objectCount: stats?.objectCount || 0,
              storageSize: stats?.payloadSize || 0,
              lastSyncedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(hotstackR2Storage.bucketName, bucket.name));
        } else {
          await db.insert(hotstackR2Storage).values({
            bucketName: bucket.name,
            accountId: accountId,
            objectCount: stats?.objectCount || 0,
            storageSize: stats?.payloadSize || 0,
            status: 'active',
            lastSyncedAt: new Date(),
          });
        }
        synced++;
      } catch (error) {
        console.error(`Error syncing R2 bucket ${bucket.name}:`, error);
        errors++;
      }
    }

    return { synced, errors };
  }

  async trackDeployment(workerId: string, deploymentData: {
    deploymentId: string;
    version?: string;
    status: string;
    triggeredBy?: string;
    commitHash?: string;
    buildLogs?: string;
    duration?: number;
  }): Promise<void> {
    try {
      await db.insert(hotstackDeployments).values({
        workerId,
        deploymentId: deploymentData.deploymentId,
        version: deploymentData.version,
        status: deploymentData.status,
        triggeredBy: deploymentData.triggeredBy,
        commitHash: deploymentData.commitHash,
        buildLogs: deploymentData.buildLogs,
        duration: deploymentData.duration,
      });

      await db.update(hotstackWorkers)
        .set({
          lastDeployedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(hotstackWorkers.id, workerId));
    } catch (error) {
      console.error('Error tracking deployment:', error);
      throw error;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      const apiToken = await this.getApiToken();
      const accountId = await this.getAccountId();
      
      if (!apiToken) {
        return {
          success: false,
          message: 'CLOUDFLARE_API_TOKEN not configured',
        };
      }

      if (!accountId) {
        return {
          success: false,
          message: 'CLOUDFLARE_ACCOUNT_ID not configured',
        };
      }

      const data = await this.makeRequest(`/accounts/${accountId}/workers/scripts`);
      const latency = Date.now() - startTime;

      return {
        success: true,
        message: 'Successfully connected to Cloudflare API',
        latency,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to connect to Cloudflare API',
        latency: Date.now() - startTime,
      };
    }
  }

  // ===============================
  // R2 FILE OPERATIONS
  // ===============================

  private async getR2Endpoint(): Promise<string> {
    const accountId = await this.getAccountId();
    return `https://${accountId}.r2.cloudflarestorage.com`;
  }

  async uploadFileToR2(
    bucketName: string, 
    objectKey: string, 
    fileContent: Buffer, 
    contentType?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const r2Endpoint = await this.getR2Endpoint();
      const url = `${r2Endpoint}/${bucketName}/${objectKey}`;

      const headers: Record<string, string> = {};

      if (contentType) {
        headers['Content-Type'] = contentType;
      }

      // Sign the request with AWS Signature V4
      const signedHeaders = await this.signR2Request('PUT', url, headers, fileContent);

      const response = await fetch(url, {
        method: 'PUT',
        headers: signedHeaders,
        body: fileContent,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `R2 upload failed: ${response.status} - ${errorText}`,
        };
      }

      return {
        success: true,
        url: `${bucketName}/${objectKey}`,
      };
    } catch (error: any) {
      console.error('Error uploading to R2:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file to R2',
      };
    }
  }

  async downloadFileFromR2(
    bucketName: string, 
    objectKey: string
  ): Promise<{ success: boolean; data?: Buffer; error?: string }> {
    try {
      const r2Endpoint = await this.getR2Endpoint();
      const url = `${r2Endpoint}/${bucketName}/${objectKey}`;

      // Sign the request with AWS Signature V4
      const signedHeaders = await this.signR2Request('GET', url, {}, '');

      const response = await fetch(url, {
        method: 'GET',
        headers: signedHeaders,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `R2 download failed: ${response.status} - ${errorText}`,
        };
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        success: true,
        data: buffer,
      };
    } catch (error: any) {
      console.error('Error downloading from R2:', error);
      return {
        success: false,
        error: error.message || 'Failed to download file from R2',
      };
    }
  }

  async listR2Files(
    bucketName: string, 
    prefix?: string, 
    limit?: number
  ): Promise<{ success: boolean; files?: Array<{ key: string; size: number; lastModified: string }>; error?: string }> {
    try {
      const r2Endpoint = await this.getR2Endpoint();
      
      let url = `${r2Endpoint}/${bucketName}?list-type=2`;
      if (prefix) {
        url += `&prefix=${encodeURIComponent(prefix)}`;
      }
      if (limit) {
        url += `&max-keys=${limit}`;
      }

      // Sign the request with AWS Signature V4
      const signedHeaders = await this.signR2Request('GET', url, {}, '');

      const response = await fetch(url, {
        method: 'GET',
        headers: signedHeaders,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `R2 list failed: ${response.status} - ${errorText}`,
        };
      }

      const xmlText = await response.text();
      
      // Parse XML response (basic parsing for S3 ListObjectsV2)
      const files: Array<{ key: string; size: number; lastModified: string }> = [];
      const contentRegex = /<Contents>(.*?)<\/Contents>/gs;
      const matches = xmlText.matchAll(contentRegex);

      for (const match of matches) {
        const content = match[1];
        const keyMatch = content.match(/<Key>(.*?)<\/Key>/);
        const sizeMatch = content.match(/<Size>(.*?)<\/Size>/);
        const lastModifiedMatch = content.match(/<LastModified>(.*?)<\/LastModified>/);

        if (keyMatch && sizeMatch && lastModifiedMatch) {
          files.push({
            key: keyMatch[1],
            size: parseInt(sizeMatch[1], 10),
            lastModified: lastModifiedMatch[1],
          });
        }
      }

      return {
        success: true,
        files,
      };
    } catch (error: any) {
      console.error('Error listing R2 files:', error);
      return {
        success: false,
        error: error.message || 'Failed to list R2 files',
      };
    }
  }

  async deleteFileFromR2(
    bucketName: string, 
    objectKey: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const r2Endpoint = await this.getR2Endpoint();
      const url = `${r2Endpoint}/${bucketName}/${objectKey}`;

      // Sign the request with AWS Signature V4
      const signedHeaders = await this.signR2Request('DELETE', url, {}, '');

      const response = await fetch(url, {
        method: 'DELETE',
        headers: signedHeaders,
      });

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        return {
          success: false,
          error: `R2 delete failed: ${response.status} - ${errorText}`,
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Error deleting from R2:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file from R2',
      };
    }
  }

  async getFileMetadata(
    bucketName: string, 
    objectKey: string
  ): Promise<{ success: boolean; metadata?: any; error?: string }> {
    try {
      const r2Endpoint = await this.getR2Endpoint();
      const url = `${r2Endpoint}/${bucketName}/${objectKey}`;

      // Sign the request with AWS Signature V4
      const signedHeaders = await this.signR2Request('HEAD', url, {}, '');

      const response = await fetch(url, {
        method: 'HEAD',
        headers: signedHeaders,
      });

      if (!response.ok) {
        return {
          success: false,
          error: `R2 metadata failed: ${response.status} - ${response.statusText}`,
        };
      }

      const metadata = {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag'),
        customMetadata: {} as Record<string, string>,
      };

      // Extract custom metadata (x-amz-meta-* headers)
      response.headers.forEach((value, key) => {
        if (key.startsWith('x-amz-meta-')) {
          const metaKey = key.substring(11); // Remove 'x-amz-meta-' prefix
          metadata.customMetadata[metaKey] = value;
        }
      });

      return {
        success: true,
        metadata,
      };
    } catch (error: any) {
      console.error('Error getting R2 metadata:', error);
      return {
        success: false,
        error: error.message || 'Failed to get file metadata',
      };
    }
  }
}
