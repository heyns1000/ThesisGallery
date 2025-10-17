/**
 * Admin Panel API Routes
 * Serves comprehensive brand arrays from interns.seedwave.faa.zone
 * Integrated into OmniGrid FAA.zone Admin Portal
 */

import type { Express } from "express";
import { z } from "zod";
import { insertAdminPanelBrandSchema } from "@shared/schema";
import type { IStorage } from "./storage";

export function registerAdminPanelRoutes(app: Express, storage: IStorage) {
  
  // Get all admin panel brands
  app.get('/api/admin-panel/brands', async (req, res) => {
    try {
      const brands = await storage.getAdminPanelBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching admin panel brands:", error);
      res.status(500).json({ message: "Failed to fetch admin panel brands" });
    }
  });

  // Get admin panel brands by sector
  app.get('/api/admin-panel/brands/:sectorKey', async (req, res) => {
    try {
      const { sectorKey } = req.params;
      const brands = await storage.getAdminPanelBrandsBySector(sectorKey);
      res.json(brands);
    } catch (error) {
      console.error("Error fetching sector brands:", error);
      res.status(500).json({ message: "Failed to fetch sector brands" });
    }
  });

  // Get admin panel summary statistics
  app.get('/api/admin-panel/stats', async (req, res) => {
    try {
      const allBrands = await storage.getAdminPanelBrands();
      
      // Calculate comprehensive statistics
      const sectorStats: Record<string, any> = allBrands.reduce((acc: Record<string, any>, brand: any) => {
        if (!acc[brand.sectorKey]) {
          acc[brand.sectorKey] = {
            sectorName: brand.sectorName,
            sectorEmoji: brand.sectorEmoji,
            brandCount: 0,
            subNodeCount: 0,
            activeBrands: 0
          };
        }
        
        acc[brand.sectorKey].brandCount++;
        acc[brand.sectorKey].subNodeCount += brand.subNodes?.length || 0;
        if (brand.status === 'active') acc[brand.sectorKey].activeBrands++;
        
        return acc;
      }, {} as Record<string, any>);

      const stats = {
        totalBrands: allBrands.length,
        totalSectors: Object.keys(sectorStats).length,
        activeBrands: allBrands.filter(b => b.status === 'active').length,
        totalSubNodes: allBrands.reduce((sum, b) => sum + (b.subNodes?.length || 0), 0),
        sectorBreakdown: sectorStats,
        lastUpdate: new Date().toISOString(),
        dataSource: "interns.seedwave.faa.zone",
        integrationStatus: "fully_synchronized"
      };

      res.json(stats);
    } catch (error) {
      console.error("Error calculating admin panel stats:", error);
      res.status(500).json({ message: "Failed to calculate stats" });
    }
  });

  // Create new admin panel brand
  app.post('/api/admin-panel/brands', async (req, res) => {
    try {
      const brandData = insertAdminPanelBrandSchema.parse(req.body);
      const newBrand = await storage.createAdminPanelBrand(brandData);
      res.status(201).json(newBrand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand data", errors: error.errors });
      }
      console.error("Error creating admin panel brand:", error);
      res.status(500).json({ message: "Failed to create brand" });
    }
  });

  // Seed admin panel brands from comprehensive arrays
  app.post('/api/admin-panel/seed', async (req, res) => {
    try {
      const result = await storage.seedAdminPanelBrands();
      
      if (result.success) {
        res.json({
          message: result.message,
          timestamp: new Date().toISOString(),
          source: "interns.seedwave.faa.zone",
          integration: "OmniGrid FAA.zone Admin Portal"
        });
      } else {
        res.status(500).json({
          message: result.message,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error seeding admin panel brands:", error);
      res.status(500).json({ message: "Failed to seed admin panel brands" });
    }
  });

  // Get brand search with admin panel data
  app.get('/api/admin-panel/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }

      const allBrands = await storage.getAdminPanelBrands();
      const filteredBrands = allBrands.filter(brand => 
        brand.brandName.toLowerCase().includes(query.toLowerCase()) ||
        brand.sectorName.toLowerCase().includes(query.toLowerCase()) ||
        brand.subNodes?.some(node => 
          node.toLowerCase().includes(query.toLowerCase())
        )
      );

      res.json({
        query,
        results: filteredBrands,
        totalResults: filteredBrands.length,
        searchType: "admin_panel_brands"
      });
    } catch (error) {
      console.error("Error searching admin panel brands:", error);
      res.status(500).json({ message: "Failed to search brands" });
    }
  });

  // Export admin panel data for OmniGrid integration
  app.get('/api/admin-panel/export', async (req, res) => {
    try {
      const allBrands = await storage.getAdminPanelBrands();
      
      // Structure data for OmniGrid FAA.zone Admin Portal
      const exportData = {
        adminPanelData: {
          metadata: {
            exportedAt: new Date().toISOString(),
            totalBrands: allBrands.length,
            dataSource: "interns.seedwave.faa.zone",
            integration: "OmniGrid FAA.zone Admin Portal"
          },
          sectors: {} as Record<string, any>
        }
      };

      // Group brands by sector for admin panel display
      allBrands.forEach(brand => {
        if (!exportData.adminPanelData.sectors[brand.sectorKey]) {
          exportData.adminPanelData.sectors[brand.sectorKey] = {
            sectorName: brand.sectorName,
            sectorEmoji: brand.sectorEmoji,
            brands: [],
            nodes: []
          };
        }
        
        exportData.adminPanelData.sectors[brand.sectorKey].brands.push(brand.brandName);
        if (brand.subNodes && brand.subNodes.length > 0) {
          exportData.adminPanelData.sectors[brand.sectorKey].nodes.push(brand.subNodes);
        }
      });

      res.json(exportData);
    } catch (error) {
      console.error("Error exporting admin panel data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });
}