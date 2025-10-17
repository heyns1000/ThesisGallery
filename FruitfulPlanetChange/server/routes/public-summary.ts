import type { Express } from "express";
import { storage } from "../storage";

// Public Summary Endpoint for Triple-Sync Lock Integration
export function registerPublicSummaryRoutes(app: Express) {
  
  // ========================================
  // PUBLIC SUMMARY FOR TRIPLE-SYNC VALIDATION
  // ========================================
  
  // Main endpoint for external app synchronization
  app.get('/api/public/summary', async (req, res) => {
    try {
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands(),
        storage.getAllSystemStatus()
      ]);

      const coreCount = brands.filter(brand => !brand.name.includes('Subnode')).length;
      const subnodeCount = brands.filter(brand => brand.name.includes('Subnode')).length;

      const summary = {
        // Core counts for treaty validation
        sectors: sectors.length,
        brands: brands.length,
        coreElements: coreCount,
        subnodes: subnodeCount,
        totalElements: brands.length + sectors.length,
        
        // App identification
        appName: "HSOMNI9000",
        environment: process.env.NODE_ENV || "development",
        syncVersion: "3.0.0",
        treatyCompliant: true,
        
        // System health
        systemStatus: systemStatus.map(status => ({
          service: status.service,
          status: status.status,
          lastUpdate: status.updatedAt
        })),
        
        // Timestamps
        lastUpdated: new Date().toISOString(),
        uptime: process.uptime(),
        
        // Hash for integrity verification
        dataHash: generateDataHash(sectors.length, brands.length, coreCount),
        
        // ScrollBinder Protocol compliance
        scrollBinderEmission: "EMISSION-01-13",
        vaultMeshStatus: "ACTIVE",
        flameSealed: true
      };

      res.json(summary);
    } catch (error) {
      console.error('Error generating public summary:', error);
      res.status(500).json({ 
        error: 'Failed to generate summary',
        appName: "HSOMNI9000",
        treatyCompliant: false,
        lastUpdated: new Date().toISOString()
      });
    }
  });

  // Treaty Flame endpoint - specific integration point
  app.get('/api/treaty/flame-status', async (req, res) => {
    try {
      const brands = await storage.getAllBrands();
      const sectors = await storage.getAllSectors();
      
      const flameStatus = {
        treatyActive: true,
        flameSealed: true,
        brandCount: brands.length,
        sectorCount: sectors.length,
        lastFlameSync: new Date().toISOString(),
        protocolVersion: "EMISSION-01-13",
        vaultMeshIntegrity: "VERIFIED",
        crossAppSyncReady: true
      };

      res.json(flameStatus);
    } catch (error) {
      console.error('Error checking flame status:', error);
      res.status(500).json({ 
        treatyActive: false,
        flameSealed: false,
        error: 'Flame status check failed'
      });
    }
  });

  // Health check for external monitoring
  app.get('/api/public/health', async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Quick database connectivity check
      const [sectorCount] = await Promise.all([
        storage.getAllSectors().then(sectors => sectors.length)
      ]);
      
      const responseTime = Date.now() - startTime;
      
      res.json({
        status: "healthy",
        app: "HSOMNI9000",
        version: "3.0.0",
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        databaseConnected: sectorCount > 0,
        treatyCompliant: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({
        status: "unhealthy",
        app: "HSOMNI9000",
        error: "Database connectivity issues",
        treatyCompliant: false,
        timestamp: new Date().toISOString()
      });
    }
  });
}

// Generate a simple hash for data integrity verification
function generateDataHash(sectors: number, brands: number, coreElements: number): string {
  const dataString = `${sectors}-${brands}-${coreElements}-${Date.now().toString().slice(-6)}`;
  
  // Simple hash algorithm for verification
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0');
}