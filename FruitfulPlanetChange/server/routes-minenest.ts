import type { Express } from "express";
import { storage } from "./storage";

export function registerMineNestRoutes(app: Express) {
  // MineNest comprehensive mining dashboard API
  app.get("/api/mining/dashboard", async (req, res) => {
    try {
      // Get mining sector
      const sectors = await storage.getAllSectors();
      const miningSector = sectors.find(s => s.emoji === "⛏️" || s.name?.includes("Mining"));
      
      if (!miningSector) {
        return res.status(404).json({ message: "Mining sector not found" });
      }

      // Get mining brands only - should be exactly 30 brands from HTML
      const miningBrands = await storage.getBrandsBySector(miningSector.id);
      const parentBrands = miningBrands.filter(brand => brand.isCore);
      const subnodes = miningBrands.filter(brand => !brand.isCore);

      // Calculate mining-specific metrics
      const totalActiveRigs = parentBrands.reduce((sum, brand) => 
        sum + (brand.metadata?.activeRigs || 0), 0
      );
      
      const totalMonthlyYield = parentBrands.reduce((sum, brand) => 
        sum + (brand.metadata?.monthlyYield || 0), 0
      );

      const avgPerformance = Math.round(
        parentBrands.reduce((sum, brand) => sum + (brand.metadata?.performance || 90), 0) / parentBrands.length
      );

      // Core systems count (A+ and A tier brands)
      const coreSystems = parentBrands.filter(brand => 
        brand.metadata?.tier === "A+" || brand.metadata?.tier === "A"
      ).length;

      const dashboardData = {
        sector: miningSector,
        totalBrands: parentBrands.length,
        totalSubnodes: subnodes.length,
        totalElements: miningBrands.length,
        parentBrands,
        subnodes,
        metrics: {
          totalActiveRigs,
          totalMonthlyYield,
          avgPerformance,
          coreSystems,
          integrationTier: "100%", // All mining brands have integration
          activeBrands: parentBrands.filter(b => b.status === "active").length
        },
        recentActivities: [
          { action: "Ore Extraction", brand: "MineNest™", timestamp: "2 min ago", status: "active" },
          { action: "Quality Control", brand: "DrillCoreX™", timestamp: "5 min ago", status: "completed" },
          { action: "Vault Sync", brand: "VaultRock™", timestamp: "8 min ago", status: "active" },
          { action: "Performance Check", brand: "OreSync™", timestamp: "12 min ago", status: "completed" }
        ]
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching mining dashboard:", error);
      res.status(500).json({ message: "Failed to fetch mining dashboard data" });
    }
  });

  // MineCore™ brands API - authentic brands from HTML
  app.get("/api/mining/minecore-brands", async (req, res) => {
    try {
      const sectors = await storage.getAllSectors();
      const miningSector = sectors.find(s => s.emoji === "⛏️" || s.name?.includes("Mining"));
      
      if (!miningSector) {
        return res.status(404).json({ message: "Mining sector not found" });
      }

      const miningBrands = await storage.getBrandsBySector(miningSector.id);
      const minecoreBrands = miningBrands.filter(brand => 
        brand.integration === "MineCore™"
      );

      // Return structured data matching HTML layout
      const brandPortfolio = minecoreBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        description: brand.description,
        status: brand.status,
        integration: brand.integration,
        metadata: brand.metadata,
        actions: ["Core", "Manage", "Analytics"]
      }));

      res.json({
        totalBrands: miningBrands.length,
        activeBrands: miningBrands.filter(b => b.status === "active").length,
        coreSystems: minecoreBrands.length,
        integration: "100%",
        portfolio: brandPortfolio,
        categories: {
          "VaultMesh™": miningBrands.filter(b => b.integration === "VaultMesh™").length,
          "GridCore™": miningBrands.filter(b => b.integration === "GridCore™").length,
          "MineCore™": minecoreBrands.length,
          "SubNode™": miningBrands.filter(b => b.integration === "SubNode™").length
        }
      });
    } catch (error) {
      console.error("Error fetching MineCore brands:", error);
      res.status(500).json({ message: "Failed to fetch MineCore brands" });
    }
  });

  // MineNest Settings API - from HTML functionality
  app.get("/api/mining/settings", async (req, res) => {
    try {
      const settings = {
        miningConfiguration: {
          realTimeMonitoring: { enabled: true, description: "Live ore tracking and performance monitoring" },
          vaultMeshSecurity: { enabled: true, description: "Advanced encryption and secure data transmission" },
          baobabCompliance: { enabled: true, description: "Environmental and regulatory compliance monitoring" },
          automaticBackup: { enabled: true, description: "Automatic data backup every 6 hours" },
          alertSystem: { enabled: true, description: "Real-time alerts for critical mining operations" }
        },
        integrations: {
          paypal: { status: "Active", description: "PayPal payment processing for mining licenses" },
          vaultMesh: { status: "Active", description: "VaultMesh™ security infrastructure" },
          baobabLegal: { status: "Active", description: "Baobab legal compliance monitoring" },
          gridCore: { status: "Active", description: "GridCore™ processing infrastructure" }
        },
        performanceMetrics: {
          systemHealth: 94,
          dataAccuracy: 98.7,
          uptime: 99.9,
          responseTime: "< 2ms"
        },
        licenses: [
          {
            id: "claimroot-001",
            name: "MineNest™ Enterprise License",
            status: "Active",
            validUntil: "2025-12-31",
            price: "$19,999.00",
            features: ["Full access to all 30 mining brands", "VaultMesh™ security", "24/7 support"]
          }
        ]
      };

      res.json(settings);
    } catch (error) {
      console.error("Error fetching mining settings:", error);
      res.status(500).json({ message: "Failed to fetch mining settings" });
    }
  });

  // Mining performance metrics API
  app.get("/api/mining/metrics", async (req, res) => {
    try {
      const sectors = await storage.getAllSectors();
      const miningSector = sectors.find(s => s.emoji === "⛏️" || s.name?.includes("Mining"));
      
      if (!miningSector) {
        return res.status(404).json({ message: "Mining sector not found" });
      }

      const miningBrands = await storage.getBrandsBySector(miningSector.id);
      const parentBrands = miningBrands.filter(brand => !brand.parentId);

      // Generate performance trends (6 months)
      const performanceTrends = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      let baseValue = 4000;
      
      for (let i = 0; i < months.length; i++) {
        baseValue += Math.floor(Math.random() * 800) + 200;
        performanceTrends.push({
          month: months[i],
          value: baseValue
        });
      }

      // Brand status distribution
      const activeCount = parentBrands.filter(b => b.status === "active").length;
      const developmentCount = parentBrands.filter(b => b.status === "development").length;
      const coreCount = parentBrands.filter(b => b.metadata?.tier === "A+" || b.metadata?.tier === "A").length;

      const metricsData = {
        performanceTrends,
        statusDistribution: {
          active: Math.round((activeCount / parentBrands.length) * 100),
          core: Math.round((coreCount / parentBrands.length) * 100),
          development: Math.round((developmentCount / parentBrands.length) * 100)
        },
        realTimeStats: {
          totalElements: miningBrands.length,
          activeBrands: activeCount,
          coreSystems: coreCount,
          integration: "100%"
        }
      };

      res.json(metricsData);
    } catch (error) {
      console.error("Error fetching mining metrics:", error);
      res.status(500).json({ message: "Failed to fetch mining metrics" });
    }
  });
}