import { storage } from "../storage";

// Real-time application discovery and health monitoring service
export class ApplicationDiscoveryService {
  private knownApplications = [
    {
      id: "hsomni9000",
      name: "HSOMNI9000",
      baseUrl: process.env.REPLIT_DOMAINS?.split(',')[0] || "localhost:5000",
      endpoints: [
        "/api/ecosystem/dashboard",
        "/api/sectors",
        "/api/dashboard/stats"
      ],
      type: "primary_coordinator",
      sectors: ["all"],
      features: ["sector_management", "heatmap_analytics", "integration_roadmap"]
    },
    {
      id: "flametreaty",
      name: "FlameTreaty",
      baseUrl: "flametreaty.replit.app",
      endpoints: [
        "/api/treaties",
        "/api/status"
      ],
      type: "specialized_application",
      sectors: ["creative", "legal"],
      features: ["treaty_management", "legal_workflows"]
    },
    {
      id: "securesign-nda",
      name: "Fruitful Global SecureSign NDA Portal",
      baseUrl: "securesign-nda.replit.app",
      endpoints: [
        "/api/documents",
        "/api/nda",
        "/api/health"
      ],
      type: "legal_portal",
      sectors: ["legal", "finance"],
      features: ["nda_management", "legal_documents"]
    },
    {
      id: "samfox-studio",
      name: "SamFox Creative Studio",
      baseUrl: "samfox-studio.replit.app",
      endpoints: [
        "/api/artworks",
        "/api/portfolio",
        "/api/status"
      ],
      type: "creative_platform",
      sectors: ["creative", "media"],
      features: ["artwork_gallery", "portfolio_management"]
    },
    {
      id: "vaultmesh-core",
      name: "VaultMesh Infrastructure",
      baseUrl: "vaultmesh-core.replit.app",
      endpoints: [
        "/api/vault",
        "/api/security",
        "/api/monitoring"
      ],
      type: "infrastructure",
      sectors: ["technology", "finance", "security"],
      features: ["vault_management", "security_protocols"]
    },
    {
      id: "fruitful-global",
      name: "Fruitful Global Portal",
      baseUrl: "fruitful-global.replit.app",
      endpoints: [
        "/api/ecosystem",
        "/api/brands",
        "/api/overview"
      ],
      type: "ecosystem_portal",
      sectors: ["all"],
      features: ["ecosystem_overview", "brand_management"]
    },
    {
      id: "omnilevel-interstellar",
      name: "Omnilevel Interstellar",
      baseUrl: "omnilevel-interstellar.replit.app",
      endpoints: [
        "/api/nodes",
        "/api/quantum",
        "/api/sync"
      ],
      type: "advanced_operations",
      sectors: ["technology", "operations"],
      features: ["interstellar_operations", "quantum_management"]
    }
  ];

  // Discover live applications by health checking URLs
  async discoverApplications() {
    const discoveries = [];
    
    for (const app of this.knownApplications) {
      try {
        const healthStatus = await this.checkApplicationHealth(app);
        discoveries.push({
          ...app,
          ...healthStatus,
          lastDiscovered: new Date().toISOString()
        });
      } catch (error) {
        console.warn(`Failed to discover ${app.name}:`, error.message);
        discoveries.push({
          ...app,
          status: 'unreachable',
          health: 'not_deployed',
          responseTime: null,
          lastSync: null,
          lastDiscovered: new Date().toISOString()
        });
      }
    }

    return discoveries;
  }

  // Check health of individual application
  async checkApplicationHealth(app: any) {
    const startTime = Date.now();
    
    try {
      // Try HTTPS first, then HTTP as fallback
      const protocols = ['https', 'http'];
      let response = null;
      let actualUrl = '';

      for (const protocol of protocols) {
        try {
          actualUrl = `${protocol}://${app.baseUrl}`;
          
          // Try a simple health check endpoint first
          const healthEndpoints = ['/api/health', '/api/status', '/health', '/'];
          
          for (const endpoint of healthEndpoints) {
            try {
              response = await fetch(`${actualUrl}${endpoint}`, {
                method: 'HEAD',
                timeout: 5000, // 5 second timeout
                headers: {
                  'User-Agent': 'HSOMNI9000-Discovery-Service'
                }
              });
              
              if (response.ok) {
                break; // Found a working endpoint
              }
            } catch (endpointError) {
              // Try next endpoint
              continue;
            }
          }
          
          if (response && response.ok) {
            break; // Found working protocol
          }
        } catch (protocolError) {
          // Try next protocol
          continue;
        }
      }

      const responseTime = Date.now() - startTime;

      if (response && response.ok) {
        return {
          status: 'active',
          health: 'operational',
          responseTime,
          lastSync: new Date().toISOString(),
          url: actualUrl,
          discoveredEndpoints: await this.discoverEndpoints(actualUrl, app.endpoints)
        };
      } else {
        return {
          status: 'deployed',
          health: 'unknown',
          responseTime,
          lastSync: null,
          url: actualUrl,
          discoveredEndpoints: []
        };
      }
    } catch (error) {
      return {
        status: 'planned',
        health: 'not_deployed',
        responseTime: null,
        lastSync: null,
        url: `https://${app.baseUrl}`,
        discoveredEndpoints: [],
        error: error.message
      };
    }
  }

  // Discover available API endpoints
  async discoverEndpoints(baseUrl: string, expectedEndpoints: string[]) {
    const discovered = [];
    
    for (const endpoint of expectedEndpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'HEAD',
          timeout: 3000,
          headers: {
            'User-Agent': 'HSOMNI9000-Discovery-Service'
          }
        });
        
        if (response.ok) {
          discovered.push({
            path: endpoint,
            status: response.status,
            available: true
          });
        } else {
          discovered.push({
            path: endpoint,
            status: response.status,
            available: false
          });
        }
      } catch (error) {
        discovered.push({
          path: endpoint,
          status: null,
          available: false,
          error: error.message
        });
      }
    }

    return discovered;
  }

  // Set up webhook connections for real-time updates
  async setupWebhookConnections(applications: any[]) {
    const webhookSetup = [];
    
    for (const app of applications) {
      if (app.status === 'active' && app.health === 'operational') {
        try {
          // Register this coordinator as a webhook endpoint with the application
          const webhookUrl = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/ecosystem/webhook/${app.id}`;
          
          const setupResponse = await fetch(`${app.url}/api/webhooks/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'HSOMNI9000-Coordinator'
            },
            body: JSON.stringify({
              coordinatorId: 'hsomni9000',
              webhookUrl,
              events: ['status_change', 'data_update', 'health_check'],
              secret: process.env.WEBHOOK_SECRET || 'default-secret'
            }),
            timeout: 5000
          });

          if (setupResponse.ok) {
            const result = await setupResponse.json();
            webhookSetup.push({
              applicationId: app.id,
              status: 'connected',
              webhookId: result.webhookId,
              registeredAt: new Date().toISOString()
            });
          } else {
            webhookSetup.push({
              applicationId: app.id,
              status: 'failed',
              error: `HTTP ${setupResponse.status}`,
              attemptedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          webhookSetup.push({
            applicationId: app.id,
            status: 'error',
            error: error.message,
            attemptedAt: new Date().toISOString()
          });
        }
      } else {
        webhookSetup.push({
          applicationId: app.id,
          status: 'skipped',
          reason: 'Application not operational',
          skippedAt: new Date().toISOString()
        });
      }
    }

    return webhookSetup;
  }

  // Sync data from all connected applications
  async syncApplicationData() {
    const applications = await this.discoverApplications();
    const syncResults = [];

    for (const app of applications) {
      if (app.status === 'active' && app.discoveredEndpoints) {
        try {
          const appData = await this.fetchApplicationData(app);
          
          // Store synchronized data in database for central coordination
          await this.storeApplicationData(app.id, appData);
          
          syncResults.push({
            applicationId: app.id,
            status: 'synced',
            dataPoints: Object.keys(appData).length,
            lastSync: new Date().toISOString()
          });
        } catch (error) {
          syncResults.push({
            applicationId: app.id,
            status: 'failed',
            error: error.message,
            attemptedAt: new Date().toISOString()
          });
        }
      }
    }

    return {
      totalApplications: applications.length,
      syncedApplications: syncResults.filter(r => r.status === 'synced').length,
      failedApplications: syncResults.filter(r => r.status === 'failed').length,
      results: syncResults,
      syncedAt: new Date().toISOString()
    };
  }

  // Fetch data from individual application
  async fetchApplicationData(app: any) {
    const data = {};
    
    for (const endpoint of app.discoveredEndpoints) {
      if (endpoint.available && endpoint.path !== '/api/health') {
        try {
          const response = await fetch(`${app.url}${endpoint.path}`, {
            timeout: 10000,
            headers: {
              'User-Agent': 'HSOMNI9000-Coordinator'
            }
          });
          
          if (response.ok) {
            const endpointData = await response.json();
            data[endpoint.path] = endpointData;
          }
        } catch (error) {
          data[endpoint.path] = { error: error.message };
        }
      }
    }

    return data;
  }

  // Store application data in central database
  async storeApplicationData(applicationId: string, data: any) {
    try {
      // Store in a dedicated application sync table or update metadata
      // For now, we'll store in system status or create a new table if needed
      await storage.updateSystemStatus(applicationId, {
        service: applicationId,
        status: 'synced',
        lastChecked: new Date().toISOString(),
        // Store the data in a metadata field if the table supports it
        metadata: data
      } as any);
    } catch (error) {
      console.warn(`Failed to store data for ${applicationId}:`, error);
    }
  }

  // Get comprehensive ecosystem status
  async getEcosystemStatus() {
    const applications = await this.discoverApplications();
    const syncStatus = await this.syncApplicationData();
    
    return {
      discovery: {
        totalApplications: applications.length,
        activeApplications: applications.filter(app => app.status === 'active').length,
        deployedApplications: applications.filter(app => app.status === 'deployed').length,
        plannedApplications: applications.filter(app => app.status === 'planned').length,
        operationalApplications: applications.filter(app => app.health === 'operational').length,
        lastDiscovery: new Date().toISOString()
      },
      synchronization: syncStatus,
      applications,
      ecosystemHealth: {
        overall: applications.filter(app => app.health === 'operational').length >= 3 ? 'healthy' : 'degraded',
        connectivity: (applications.filter(app => app.status === 'active').length / applications.length) * 100,
        dataConsistency: (syncStatus.syncedApplications / Math.max(syncStatus.totalApplications, 1)) * 100,
        lastHealthCheck: new Date().toISOString()
      }
    };
  }
}

// Create singleton instance
export const applicationDiscovery = new ApplicationDiscoveryService();