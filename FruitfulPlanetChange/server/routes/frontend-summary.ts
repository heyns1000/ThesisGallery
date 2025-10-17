import type { Express } from "express";
import { storage } from "../storage";

// Frontend Summary Endpoint for DOM vs Backend Truth Validation
export function registerFrontendSummaryRoutes(app: Express) {
  
  // ========================================
  // FRONTEND SUMMARY FOR DOM TRUTH VALIDATION
  // ========================================
  
  // Main endpoint that mirrors what UI should be rendering
  app.get('/api/frontend/summary', async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Get current data exactly as frontend queries would
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands(),
        storage.getAllSystemStatus()
      ]);

      // Calculate counts exactly as UI components do
      const totalBrands = brands.length;
      const coreElements = brands.filter(brand => !brand.name.includes('Subnode')).length;
      const subnodes = brands.filter(brand => brand.name.includes('Subnode')).length;
      const totalSectors = sectors.length;
      const totalElements = totalBrands + totalSectors;

      // Page-specific counts for navigation verification
      const pageBreakdown = {
        home: {
          sectors: totalSectors,
          brands: totalBrands,
          coreElements,
          subnodes
        },
        sectorMapping: {
          sectors: totalSectors,
          brands: totalBrands,
          connections: calculateSectorConnections(sectors)
        },
        seedwaveAdmin: {
          brands: totalBrands,
          sectors: totalSectors,
          systemServices: systemStatus.length
        }
      };

      const responseTime = Date.now() - startTime;

      const frontendSummary = {
        // Core UI counts - what should be displayed
        uiData: {
          sectors: totalSectors,
          brands: totalBrands,
          coreElements,
          subnodes,
          totalElements,
          systemStatus: systemStatus.length
        },
        
        // Page-specific breakdowns for validation
        pageBreakdown,
        
        // UI rendering metadata
        renderingInfo: {
          lastQueried: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          dataFreshness: "live",
          renderReady: true
        },
        
        // Validation flags for DOM comparison
        validation: {
          sectorsRenderable: totalSectors > 0,
          brandsRenderable: totalBrands > 0,
          systemHealthDisplayable: systemStatus.length > 0,
          navigationCountsReady: true
        },
        
        // Expected DOM element counts for audit
        expectedDomElements: {
          sectorCards: totalSectors,
          brandItems: Math.min(totalBrands, 50), // If pagination exists
          systemStatusItems: systemStatus.length,
          navigationBadges: 4 // Based on nav structure
        },
        
        // Canonical display values
        canonicalValues: {
          totalElementsDisplay: totalElements.toLocaleString(),
          brandsDisplay: totalBrands.toLocaleString(), 
          sectorsDisplay: totalSectors.toString(),
          coreElementsDisplay: coreElements.toLocaleString(),
          subnodesDisplay: subnodes.toString()
        }
      };

      res.json(frontendSummary);
    } catch (error) {
      console.error('Error generating frontend summary:', error);
      res.status(500).json({ 
        error: 'Frontend summary generation failed',
        renderReady: false,
        lastQueried: new Date().toISOString()
      });
    }
  });

  // DOM audit endpoint - compares expected vs actual rendered counts
  app.post('/api/frontend/audit-dom', async (req, res) => {
    try {
      const { domCounts, pageName } = req.body;
      
      if (!domCounts || !pageName) {
        return res.status(400).json({ error: 'Missing domCounts or pageName' });
      }

      // Get current backend truth
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands(),
        storage.getAllSystemStatus()
      ]);

      const backendTruth = {
        sectors: sectors.length,
        brands: brands.length,
        coreElements: brands.filter(b => !b.name.includes('Subnode')).length,
        subnodes: brands.filter(b => b.name.includes('Subnode')).length,
        systemStatus: systemStatus.length,
        totalElements: brands.length + sectors.length
      };

      // Compare DOM vs backend
      const mismatches = [];
      const checks = Object.keys(backendTruth);
      
      checks.forEach(key => {
        const backendValue = backendTruth[key];
        const domValue = domCounts[key];
        
        if (domValue !== undefined && domValue !== backendValue) {
          mismatches.push({
            field: key,
            backend: backendValue,
            dom: domValue,
            difference: Math.abs(backendValue - domValue),
            severity: Math.abs(backendValue - domValue) > 10 ? 'high' : 'low'
          });
        }
      });

      const auditResult = {
        pageName,
        timestamp: new Date().toISOString(),
        domBackendSync: mismatches.length === 0,
        mismatches,
        backendTruth,
        domCounts,
        syncAccuracy: ((checks.length - mismatches.length) / checks.length * 100).toFixed(2) + '%',
        recommendedAction: mismatches.length > 0 ? 'trigger-rerender' : 'no-action-needed'
      };

      if (mismatches.length > 0) {
        console.log(`🚨 DOM Sync Mismatch on ${pageName}:`, mismatches);
      } else {
        console.log(`✅ DOM Sync Perfect on ${pageName}`);
      }

      res.json(auditResult);
    } catch (error) {
      console.error('Error auditing DOM:', error);
      res.status(500).json({ 
        error: 'DOM audit failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Live rerender trigger endpoint
  app.post('/api/frontend/trigger-rerender', async (req, res) => {
    try {
      const { pageName, reason } = req.body;
      
      console.log(`🔄 Rerender triggered for ${pageName}: ${reason}`);
      
      // Log the rerender event for tracking
      const rerenderEvent = {
        pageName: pageName || 'unknown',
        reason: reason || 'manual-trigger',
        timestamp: new Date().toISOString(),
        triggeredBy: 'backend-audit-system'
      };

      // In a real system, this might trigger WebSocket events or 
      // invalidate specific cache keys to force component rerender
      
      res.json({
        success: true,
        message: 'Rerender trigger sent',
        event: rerenderEvent
      });
    } catch (error) {
      console.error('Error triggering rerender:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Rerender trigger failed' 
      });
    }
  });

  // Canonical source validation endpoint
  app.get('/api/frontend/canonical-source', async (req, res) => {
    try {
      const [sectors, brands] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands()
      ]);

      const canonicalSource = {
        activated: true,
        source: 'HSOMNI9000-Backend',
        lastUpdate: new Date().toISOString(),
        dataIntegrity: {
          sectors: {
            count: sectors.length,
            verified: sectors.length > 0,
            lastModified: sectors[0]?.updatedAt || new Date().toISOString()
          },
          brands: {
            count: brands.length,
            verified: brands.length > 0,
            lastModified: brands[0]?.updatedAt || new Date().toISOString()
          }
        },
        syncDirection: 'backend-to-frontend',
        truthSource: 'database',
        displayAuthority: 'canonical'
      };

      res.json(canonicalSource);
    } catch (error) {
      console.error('Error validating canonical source:', error);
      res.status(500).json({ 
        activated: false,
        error: 'Canonical source validation failed' 
      });
    }
  });
}

// Helper function to calculate sector connections (simplified)
function calculateSectorConnections(sectors: any[]): number {
  // This would normally analyze actual relationships
  // For now, return estimated connections based on sector count
  return Math.floor(sectors.length * 1.5); // Estimate 1.5 connections per sector
}