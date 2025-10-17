import { db } from "./db";
import { hotstackWorkers, hotstackDeployments, hotstackR2Storage, hotstackStations, systemSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

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
}
