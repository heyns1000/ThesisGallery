// DNS Integration Service for HSOMNI9000 Genesis Layer
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DNSStatus {
  status: 'active' | 'pending' | 'initializing' | 'error';
  lastChecked: string;
  isLive: boolean;
  domain: string;
  cloudflareZoneId: string;
}

export class DNSIntegrationService {
  private static instance: DNSIntegrationService;
  private currentStatus: DNSStatus;

  private constructor() {
    this.currentStatus = {
      status: 'pending',
      lastChecked: new Date().toISOString(),
      isLive: false,
      domain: 'fruitfulplanet.com',
      cloudflareZoneId: 'b3220969343cf767a56095ddbd6d91a'
    };
  }

  public static getInstance(): DNSIntegrationService {
    if (!DNSIntegrationService.instance) {
      DNSIntegrationService.instance = new DNSIntegrationService();
    }
    return DNSIntegrationService.instance;
  }

  async checkDNSStatus(): Promise<DNSStatus> {
    try {
      // Check if Cloudflare API token is available
      const apiToken = process.env.CLOUDFLARE_API_TOKEN;
      if (!apiToken || apiToken === 'your_cloudflare_api_token_here') {
        this.currentStatus = {
          ...this.currentStatus,
          status: 'error',
          lastChecked: new Date().toISOString(),
          isLive: false
        };
        return this.currentStatus;
      }

      // Make direct API call to Cloudflare
      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.currentStatus.cloudflareZoneId}`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        const status = data.result.status;
        this.currentStatus = {
          ...this.currentStatus,
          status: status === 'active' ? 'active' : 'pending',
          lastChecked: new Date().toISOString(),
          isLive: status === 'active'
        };
      } else {
        this.currentStatus = {
          ...this.currentStatus,
          status: 'error',
          lastChecked: new Date().toISOString(),
          isLive: false
        };
      }

    } catch (error) {
      console.error('DNS Status Check Error:', error);
      this.currentStatus = {
        ...this.currentStatus,
        status: 'error',
        lastChecked: new Date().toISOString(),
        isLive: false
      };
    }

    return this.currentStatus;
  }

  getCurrentStatus(): DNSStatus {
    return this.currentStatus;
  }

  async startDNSMonitoring(): Promise<void> {
    console.log('🌐 Starting DNS monitoring for fruitfulplanet.com...');
    
    // Initial check
    await this.checkDNSStatus();
    
    // Set up periodic monitoring (every 9 minutes)
    setInterval(async () => {
      const status = await this.checkDNSStatus();
      console.log(`[${status.lastChecked}] DNS Status: ${status.status} (Live: ${status.isLive})`);
      
      if (status.isLive) {
        console.log('✅ fruitfulplanet.com DNS is LIVE on Cloudflare!');
      }
    }, 540000); // 9 minutes in milliseconds
  }

  // Integration with Genesis Layer for ecosystem coordination
  async syncWithGenesisLayer(): Promise<{
    dnsStatus: DNSStatus;
    ecosystemCoordination: boolean;
    readyForDeployment: boolean;
  }> {
    const dnsStatus = await this.checkDNSStatus();
    
    return {
      dnsStatus,
      ecosystemCoordination: dnsStatus.isLive,
      readyForDeployment: dnsStatus.isLive && dnsStatus.status === 'active'
    };
  }
}

// Export singleton instance
export const dnsIntegration = DNSIntegrationService.getInstance();