import { db } from './db';
import { sectors, brands } from '@shared/schema';
import { count } from 'drizzle-orm';

// Cloudflare Workers Data Synchronization Service
export class CloudflareDataSync {
  private readonly cloudflareEndpoint: string;
  private readonly apiToken: string;

  constructor() {
    this.cloudflareEndpoint = process.env.CLOUDFLARE_WORKERS_ENDPOINT || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';
  }

  /**
   * Generate correct ecosystem data for Cloudflare Workers deployment
   */
  async getEcosystemData() {
    try {
      // Get real data from your HSOMNI9000 database
      const [sectorCount] = await db.select({ count: count() }).from(sectors);
      const [brandCount] = await db.select({ count: count() }).from(brands);
      
      const allSectors = await db.select().from(sectors);
      const activeSectors = allSectors.filter(sector => sector.isActive !== false);
      
      // Calculate vault levels and intake fee based on real ecosystem size
      const vaultLevel = Math.min(8, Math.ceil(brandCount.count / 500)); // Dynamic vault level
      const intakeFee = `${(brandCount.count * 0.001).toFixed(1)}%`; // 0.1% per 1000 brands
      
      return {
        activeSectors: activeSectors.length,
        connectedApps: brandCount.count,
        vaultLevel,
        intakeFee,
        systemStatus: 'OPERATIONAL',
        lastSync: new Date().toISOString(),
        realTimeData: true,
        ecosystemMetrics: {
          totalBrands: brandCount.count,
          totalSectors: sectorCount.count,
          coreApplications: 7, // Your 7 integrated applications
          vaultMeshCompliance: true,
          faaX13TreatyCompliant: true
        },
        sectorBreakdown: activeSectors.map(sector => ({
          id: sector.id,
          name: sector.name,
          brandCount: sector.brands?.length || 0,
          status: 'active'
        }))
      };
    } catch (error) {
      console.error('Error getting ecosystem data:', error);
      throw error;
    }
  }

  /**
   * Push correct data to Cloudflare Workers
   */
  async syncToCloudflareWorkers() {
    if (!this.cloudflareEndpoint || !this.apiToken) {
      throw new Error('Cloudflare Workers endpoint and API token are required');
    }

    try {
      const ecosystemData = await this.getEcosystemData();
      
      const response = await fetch(`${this.cloudflareEndpoint}/api/ecosystem/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'X-Source': 'HSOMNI9000-Main-Portal'
        },
        body: JSON.stringify({
          ...ecosystemData,
          syncTimestamp: Date.now(),
          dataSource: 'replit-hsomni9000',
          validationHash: this.generateValidationHash(ecosystemData)
        })
      });

      if (!response.ok) {
        throw new Error(`Cloudflare sync failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Successfully synced data to Cloudflare Workers:', result);
      
      return {
        success: true,
        syncedData: ecosystemData,
        cloudflareResponse: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Cloudflare sync failed:', error);
      throw error;
    }
  }

  /**
   * Generate validation hash for data integrity
   */
  private generateValidationHash(data: any): string {
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Force update Cloudflare Workers with current ecosystem state
   */
  async forceDataAlignment() {
    try {
      console.log('🔄 Forcing Cloudflare Workers data alignment...');
      
      const ecosystemData = await this.getEcosystemData();
      
      console.log('📊 Current HSOMNI9000 Ecosystem Data:', {
        sectors: ecosystemData.activeSectors,
        apps: ecosystemData.connectedApps,
        vaultLevel: ecosystemData.vaultLevel,
        intakeFee: ecosystemData.intakeFee
      });

      // Multiple sync attempts to ensure data alignment
      const syncResults = [];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`📡 Sync attempt ${attempt}/3...`);
          const result = await this.syncToCloudflareWorkers();
          syncResults.push(result);
          break; // Exit loop on success
        } catch (error) {
          console.warn(`Sync attempt ${attempt} failed:`, error);
          if (attempt === 3) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
        }
      }

      return {
        success: true,
        message: 'Cloudflare Workers data alignment completed',
        ecosystemData,
        syncResults
      };
    } catch (error) {
      console.error('❌ Force data alignment failed:', error);
      return {
        success: false,
        message: `Data alignment failed: ${(error as Error).message}`,
        error: error
      };
    }
  }
}

// Export singleton instance
export const cloudflareDataSync = new CloudflareDataSync();