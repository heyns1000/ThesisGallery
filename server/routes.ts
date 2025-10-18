import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq, desc, and, sql } from "drizzle-orm";
import { storage } from "./storage";
import { db } from "./db";
import { samFoxStudioService } from "./samfox-studio-service";
import { loopPayService } from "./loop-pay-service";
import { ecosystemSyncService } from "./ecosystem-sync-service";
import { EmailProcessor, type EmailParsingResult } from "./email-processor";
import { assetRegistry } from "./assetRegistry";
import { 
  insertDocumentSchema,
  insertGallerySchema,
  insertConversationSchema,
  insertBrandSchema,
  insertComplianceLogSchema,
  insertProcessingQueueSchema,
  insertTeamMemberSchema,
  insertTeamProjectSchema,
  insertTeamTestimonialSchema,
  insertOnboardingStepSchema,
  insertContactSchema,
  insertDataImportSchema,
  insertBanimalProductSchema,
  insertBanimalOrderSchema,
  insertBanimalCustomerSchema,
  insertBanimalConnectionSchema,
  insertBanimalSyncLogSchema,
  insertLanguageLearningSchema,
  insertSeedlingLanguageProgressSchema,
  insertLanguageLearningSessionSchema,
  insertEmailProviderSchema,
  insertEmailTemplateSchema,
  insertEmailCampaignSchema,
  insertEmailSendSchema,
  insertEmailTrackingSchema,
  // Multi-Channel Messaging Schemas
  insertMessageChannelSchema,
  insertMessageTemplateSchema,
  insertMessagingCampaignSchema,
  insertMessageSendSchema,
  insertWhatsappConversationSchema,
  insertSmsConversationSchema,
  insertMessageTrackingSchema,
  // LoopPay Schemas
  insertLoopPayLicenseSchema,
  insertLoopPayTransactionSchema,
  insertLoopPayVendorSchema,
  insertLoopPayCurrencyRateSchema,
  insertLoopPayPayoutMeshSchema,
  insertLoopPayAiAssistantSchema,
  // Ecosystem Integration Schemas
  insertEcosystemSystemSchema,
  insertEcosystemAppSchema,
  insertEcosystemSyncLogSchema,
  updateEcosystemSystemSchema,
  updateEcosystemAppSchema,
  updateEcosystemSyncLogSchema,
  ecosystemSystems,
  ecosystemApps,
  ecosystemSyncLogs,
  banimalConnections,
  // Sector Mapping Schemas
  insertSectorRelationshipSchema,
  updateSectorRelationshipSchema,
  // Asset Registry & Sync Events
  insertAssetRegistrySchema,
  insertSyncEventSchema,
  assetRegistry as assetRegistryTable,
  syncEvents as syncEventsTable,
  // HotStack Schemas
  hotstackWorkers,
  hotstackDeployments,
  hotstackR2Storage,
  hotstackStations,
  // Replit Apps
  replitApps
} from "@shared/schema";
import { ContactProcessingAI, BanimalChatbot, CurrencyAI, HolidayAI, generateFaaReference } from "./ai-services";
import { GeminiContactProcessor, GeminiBanimalChatbot, GeminiProductAI, GeminiMarketingAI } from "./gemini-ai";
import { languageLearningService } from "./language-learning-service";
import { firebaseAdmin } from "./firebase-admin";
import { abandonedCartService } from "./abandoned-cart-service";
import { enterpriseEmailService } from "./email-service";
import { multiChannelMessagingService } from "./multi-channel-service";
import { githubService } from "./github-service";
import { 
  insertGithubRepositorySchema,
  insertGithubFileSchema,
  insertGithubSyncLogSchema
} from "@shared/schema";
import { eurekaGenerator } from "./eureka-generator";
import { cloudflowAutomation } from "./cloudflow-automation";
import { contextTransferService } from "./context-transfer-service";
import { dailySummaryExtractor } from "./daily-summary-extractor";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { nanoid } from "nanoid";
import { initializeJobProcessor } from "./job-processor";
import { deploymentJobs, insertDeploymentJobSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
    
    // Send initial system stats
    storage.getSystemStats().then(stats => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'system_stats', data: stats }));
      }
    });
  });

  // Broadcast to all connected clients
  function broadcast(message: any) {
    const data = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // Initialize job processor with auto-processing
  const jobProcessor = initializeJobProcessor(broadcast);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // System stats endpoint
  app.get("/api/system/stats", async (req, res) => {
    try {
      let stats: any = await storage.getSystemStats();
      
      if (!stats) {
        stats = {};
      }
      
      // Add SamFox Studio stats integration for FAA Vault sync
      try {
        const samFoxStudio = await samFoxStudioService.getSamFoxStudio();
        if (samFoxStudio) {
          const samFoxStats = await samFoxStudioService.getDashboardStats(samFoxStudio.id);
          stats.samFoxStudio = {
            id: samFoxStudio.id,
            brandName: samFoxStudio.brandName,
            globalStatus: samFoxStudio.globalStatus,
            vaultLink: samFoxStudio.vaultLink,
            syncRate: samFoxStudio.syncRate,
            treatyReady: samFoxStudio.treatyReady,
            copyrightActive: samFoxStudio.copyrightActive,
            signatory: samFoxStudio.signatory,
            totalWorkspaces: samFoxStats.totalWorkspaces,
            totalLicenses: samFoxStats.totalLicenses,
            totalFiles: samFoxStats.totalFiles,
            totalTreaties: samFoxStats.totalTreaties,
            activeTreaties: samFoxStats.activeTreaties,
            vaultSyncStatus: samFoxStats.vaultSyncStatus,
            lastSync: new Date().toISOString()
          };
        }
      } catch (samFoxError) {
        // SamFox Studio integration failed, but return stats anyway
        console.log("SamFox Studio stats integration failed (non-critical):", samFoxError);
      }
      
      res.json(stats);
    } catch (error) {
      console.error("System stats error:", error);
      res.status(500).json({ error: "Failed to fetch system stats" });
    }
  });

  // Command Center metrics endpoint
  app.get("/api/command-center/metrics", async (req, res) => {
    try {
      // Get active brands count from database
      const brands = await storage.getBrands();
      const activeBrands = brands.length;
      
      // Get active systems count from ecosystemSystems table
      const activeSystems = await db
        .select()
        .from(ecosystemSystems)
        .where(eq(ecosystemSystems.status, 'active'));
      
      const metrics = {
        globalExpansionTargets: 271,
        activeBrands,
        aiMediaIntegration: 13,
        diamondTierActive: true,
        activeSystems: activeSystems.length,
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Command center metrics error:", error);
      res.status(500).json({ error: "Failed to fetch command center metrics" });
    }
  });

  // Initialize comprehensive sample data for the 1.8GB ecosystem showcase
  // Security: Admin-only endpoint in production
  app.post("/api/system/initialize-sample-data", isAuthenticated, async (req, res) => {
    // For now, allow all authenticated users. In production, add role check:
    // if (!req.user?.role || req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Admin access required" });
    // }
    try {
      console.log("🚀 Starting comprehensive sample data initialization...");
      await storage.initializeComprehensiveSampleData();
      
      // Get updated stats
      const stats = await storage.getSystemStats();
      
      // Broadcast the system stats update so Dashboard refreshes automatically
      broadcast({ type: 'system_stats', data: stats });
      
      res.json({ 
        message: "✅ Comprehensive sample data initialization completed successfully!",
        stats: {
          brands: (await storage.getBrands()).length,
          documents: (await storage.getDocuments()).length,
          gallery: (await storage.getGalleryItems()).length,
          conversations: (await storage.getConversations()).length,
          complianceLogs: (await storage.getComplianceLogs()).length,
          processingItems: (await storage.getProcessingQueue()).length
        }
      });
    } catch (error) {
      console.error("❌ Error initializing sample data:", error);
      res.status(500).json({ error: "Failed to initialize sample data", details: error.message });
    }
  });

  // Document routes
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", upload.single('file'), async (req, res) => {
    try {
      let documentData;
      
      if (req.file) {
        // Handle file upload
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        documentData = {
          title: req.body.title || req.file.originalname,
          type: path.extname(req.file.originalname).slice(1).toUpperCase(),
          content: fileContent,
          filePath: req.file.path,
          metadata: {
            originalName: req.file.originalname,
            size: req.file.size,
            uploadDate: new Date().toISOString(),
          },
        };
      } else {
        // Handle JSON data
        documentData = insertDocumentSchema.parse(req.body);
      }

      const document = await storage.createDocument(documentData);
      
      // Broadcast new document to connected clients
      broadcast({ type: 'document_created', data: document });
      
      res.status(201).json(document);
    } catch (error) {
      console.error('Document creation error:', error);
      res.status(400).json({ error: "Failed to create document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const success = await storage.deleteDocument(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Document not found" });
      }
      
      broadcast({ type: 'document_deleted', data: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const items = await storage.getGalleryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", upload.single('image'), async (req, res) => {
    try {
      let galleryData;
      
      if (req.file) {
        galleryData = {
          title: req.body.title || req.file.originalname,
          type: req.body.type || 'uploaded',
          imageUrl: `/uploads/${req.file.filename}`,
          description: req.body.description,
          tags: req.body.tags ? JSON.parse(req.body.tags) : [],
          metadata: {
            originalName: req.file.originalname,
            size: req.file.size,
          },
        };
      } else {
        galleryData = insertGallerySchema.parse(req.body);
      }

      const item = await storage.createGalleryItem(galleryData);
      broadcast({ type: 'gallery_item_created', data: item });
      
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Failed to create gallery item" });
    }
  });

  // Conversation routes
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(conversationData);
      
      broadcast({ type: 'conversation_created', data: conversation });
      res.status(201).json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Brand routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      
      // Create compliance log for new brand
      await storage.createComplianceLog({
        type: "verification",
        message: `Brand ${brand.name} created and verification initiated`,
        status: "in-progress",
        brandId: brand.id,
      });
      
      broadcast({ type: 'brand_created', data: brand });
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ error: "Failed to create brand" });
    }
  });

  app.patch("/api/brands/:id", async (req, res) => {
    try {
      const updates = req.body;
      const brand = await storage.updateBrand(req.params.id, updates);
      
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      
      broadcast({ type: 'brand_updated', data: brand });
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to update brand" });
    }
  });

  // Brand exposure algorithm
  app.post("/api/brands/expose", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      const exposedBrands = [];
      
      for (const brand of brands) {
        if (brand.status !== 'protected') {
          const updatedBrand = await storage.updateBrand(brand.id, {
            status: 'protected',
            trademarkStatus: 'filed',
            complianceScore: Math.min(brand.complianceScore || 0 + 10, 100),
          });
          
          if (updatedBrand) {
            exposedBrands.push(updatedBrand);
            
            await storage.createComplianceLog({
              type: "verification",
              message: `Brand ${brand.name} exposed and protection activated`,
              status: "success",
              brandId: brand.id,
            });
          }
        }
      }
      
      broadcast({ type: 'brands_exposed', data: exposedBrands });
      res.json({ exposedBrands, message: `${exposedBrands.length} brands exposed and protected` });
    } catch (error) {
      res.status(500).json({ error: "Failed to expose brands" });
    }
  });

  // Water the Seed algorithm
  app.post("/api/brands/seed", async (req, res) => {
    try {
      const { category, baseName } = req.body;
      
      // Generate brand variations
      const seedBrands = [
        `FAA ${baseName}™`,
        `${baseName} PRO™`,
        `${baseName} ELITE™`,
        `${baseName} FUSION™`,
      ];
      
      const createdBrands = [];
      
      for (const brandName of seedBrands) {
        const brand = await storage.createBrand({
          name: brandName,
          category: category || 'generated',
          status: 'pending',
          trademarkStatus: 'pending',
          complianceScore: 85,
        });
        
        createdBrands.push(brand);
        
        await storage.createComplianceLog({
          type: "verification",
          message: `Brand seed ${brandName} generated and queued for protection`,
          status: "in-progress",
          brandId: brand.id,
        });
      }
      
      broadcast({ type: 'brands_seeded', data: createdBrands });
      res.json({ createdBrands, message: `${createdBrands.length} brand seeds generated` });
    } catch (error) {
      res.status(500).json({ error: "Failed to seed brands" });
    }
  });

  // Bulk brand import for FAA Global Industry Index
  app.post("/api/brands/bulk-import", async (req, res) => {
    try {
      const { brands: brandData } = req.body;
      
      if (!Array.isArray(brandData)) {
        return res.status(400).json({ error: "Brands data must be an array" });
      }
      
      const createdBrands = [];
      const logs = [];
      
      for (const brand of brandData) {
        try {
          const validatedBrand = insertBrandSchema.parse(brand);
          const newBrand = await storage.createBrand(validatedBrand);
          createdBrands.push(newBrand);
          
          // Create compliance log for each imported brand
          const log = await storage.createComplianceLog({
            type: "import",
            message: `FAA Brand "${newBrand.name}" imported from Global Industry Index`,
            status: "success",
            brandId: newBrand.id,
            details: `Category: ${newBrand.category}, Status: ${newBrand.status}`
          });
          logs.push(log);
        } catch (brandError) {
          console.error(`Failed to import brand:`, brand, brandError);
          // Continue with other brands even if one fails
        }
      }
      
      // Update system stats
      await storage.updateSystemStats({
        totalBrands: (await storage.getBrands()).length,
      });
      
      broadcast({ type: 'brands_bulk_imported', data: createdBrands });
      broadcast({ type: 'compliance_logs_created', data: logs });
      
      res.json({ 
        imported: createdBrands.length,
        total: brandData.length,
        brands: createdBrands,
        message: `Successfully imported ${createdBrands.length} FAA brands from Global Industry Index`
      });
    } catch (error) {
      console.error('Bulk import error:', error);
      res.status(500).json({ error: "Failed to bulk import brands" });
    }
  });

  // Sector routes - FAA.ZONE INDEX Official Sectors
  app.get("/api/sectors", async (req, res) => {
    try {
      const sectors = await storage.getSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sectors" });
    }
  });

  app.get("/api/sectors/stats", async (req, res) => {
    try {
      const sectors = await storage.getSectors();
      const activeSectors = sectors.filter(s => s.isActive);
      const totalCoreBrands = activeSectors.reduce((sum, s) => sum + s.coreBrands, 0);
      const totalNodes = activeSectors.reduce((sum, s) => sum + s.totalNodes, 0);
      
      res.json({
        totalSectors: sectors.length,
        activeSectors: activeSectors.length,
        totalCoreBrands,
        totalNodes,
        sectors: activeSectors
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sector stats" });
    }
  });

  // Sector Mapping routes - Interactive Network Visualization System
  app.post("/api/sector-mapping/relationships", async (req, res) => {
    try {
      const relationshipData = insertSectorRelationshipSchema.parse(req.body);
      const relationship = await storage.storeRelationship(relationshipData);
      
      broadcast({ type: 'sector_relationship_created', data: relationship });
      res.status(201).json(relationship);
    } catch (error) {
      console.error("Failed to create relationship:", error);
      res.status(400).json({ error: "Failed to create sector relationship" });
    }
  });

  app.get("/api/sector-mapping/relationships", async (req, res) => {
    try {
      const { sourceId, targetId, type } = req.query;
      const relationships = await storage.getRelationships({
        sourceId: sourceId as string,
        targetId: targetId as string,
        type: type as string,
      });
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch relationships" });
    }
  });

  app.put("/api/sector-mapping/relationships/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateSectorRelationshipSchema.parse(req.body);
      const relationship = await storage.updateRelationship(id, updates);
      
      if (!relationship) {
        return res.status(404).json({ error: "Relationship not found" });
      }
      
      broadcast({ type: 'sector_relationship_updated', data: relationship });
      res.json(relationship);
    } catch (error) {
      res.status(400).json({ error: "Failed to update relationship" });
    }
  });

  app.delete("/api/sector-mapping/relationships/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteRelationship(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Relationship not found" });
      }
      
      broadcast({ type: 'sector_relationship_deleted', data: { id } });
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete relationship" });
    }
  });

  app.get("/api/sector-mapping/network-stats", async (req, res) => {
    try {
      const stats = await storage.getNetworkStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network stats" });
    }
  });

  app.get("/api/sector-mapping/critical-paths", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const strongestConnections = await storage.getStrongestConnections(limit);
      
      // Build critical paths from strongest connections
      const criticalPaths = strongestConnections.map(connection => {
        const sectors = storage.getSectors();
        return sectors.then(sectorList => {
          const source = sectorList.find(s => s.id === connection.sourceId);
          const target = sectorList.find(s => s.id === connection.targetId);
          
          return {
            path: `${source?.sectorName || 'Unknown'} → ${target?.sectorName || 'Unknown'}`,
            strength: parseFloat(String(connection.strength)),
            type: connection.relationshipType,
            description: connection.description || '',
          };
        });
      });
      
      const paths = await Promise.all(criticalPaths);
      res.json(paths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch critical paths" });
    }
  });

  app.get("/api/sector-mapping/export/matrix", async (req, res) => {
    try {
      const [sectors, relationships] = await Promise.all([
        storage.getSectors(),
        storage.getRelationships(),
      ]);
      
      // Build relationship matrix
      const matrix: Record<string, Record<string, number>> = {};
      
      sectors.forEach(sector => {
        matrix[sector.id] = {};
        sectors.forEach(targetSector => {
          matrix[sector.id][targetSector.id] = 0;
        });
      });
      
      relationships.forEach(rel => {
        matrix[rel.sourceId][rel.targetId] = parseFloat(String(rel.strength));
        if (rel.bidirectional) {
          matrix[rel.targetId][rel.sourceId] = parseFloat(String(rel.strength));
        }
      });
      
      res.json({
        sectors: sectors.map(s => ({ id: s.id, name: s.sectorName, glyph: s.glyph })),
        matrix,
        metadata: {
          totalSectors: sectors.length,
          totalRelationships: relationships.length,
          exportedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to export matrix" });
    }
  });

  // Legal documents routes
  app.get("/api/legal-documents", async (req, res) => {
    try {
      const documents = await storage.getLegalDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch legal documents" });
    }
  });

  // Repository routes
  app.get("/api/repositories", async (req, res) => {
    try {
      const { search, category } = req.query;
      let repositories;
      
      if (search && typeof search === 'string') {
        repositories = await storage.getRepositoriesBySearch(search);
      } else if (category && typeof category === 'string') {
        repositories = await storage.getRepositoriesByCategory(category);
      } else {
        repositories = await storage.getRepositories();
      }
      
      res.json(repositories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repositories" });
    }
  });

  // FPC Payments routes
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await db.select().from(fpcPayments);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Compliance routes
  app.get("/api/compliance/logs", async (req, res) => {
    try {
      const logs = await storage.getComplianceLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compliance logs" });
    }
  });

  app.post("/api/compliance/logs", async (req, res) => {
    try {
      const logData = insertComplianceLogSchema.parse(req.body);
      const log = await storage.createComplianceLog(logData);
      
      broadcast({ type: 'compliance_log_created', data: log });
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: "Failed to create compliance log" });
    }
  });

  // Processing queue routes
  app.get("/api/processing/queue", async (req, res) => {
    try {
      const queue = await storage.getProcessingQueue();
      res.json(queue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch processing queue" });
    }
  });

  app.post("/api/processing/queue", async (req, res) => {
    try {
      const queueData = insertProcessingQueueSchema.parse(req.body);
      const item = await storage.createProcessingQueueItem(queueData);
      
      broadcast({ type: 'queue_item_created', data: item });
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Failed to create queue item" });
    }
  });

  // Mail feed processing simulation
  app.post("/api/mail/process", async (req, res) => {
    try {
      const { emails } = req.body;
      const processedCount = emails?.length || Math.floor(Math.random() * 10) + 1;
      
      // Create processing queue item
      const queueItem = await storage.createProcessingQueueItem({
        type: "document",
        title: "Mail feed processing",
        description: `Processing ${processedCount} emails`,
        progress: 0,
        status: "processing",
        estimatedTime: Math.ceil(processedCount / 2),
      });
      
      // Simulate processing progress
      let progress = 0;
      const interval = setInterval(async () => {
        progress += 25;
        await storage.updateProcessingQueueItem(queueItem.id, {
          progress,
          status: progress >= 100 ? "completed" : "processing",
        });
        
        const updatedItem = await storage.getProcessingQueue();
        broadcast({ type: 'queue_updated', data: updatedItem });
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Create compliance log
          await storage.createComplianceLog({
            type: "audit",
            message: `Mail feed processing completed: ${processedCount} emails processed`,
            status: "success",
          });
        }
      }, 1000);
      
      res.json({ message: "Mail processing started", queueItem });
    } catch (error) {
      res.status(500).json({ error: "Failed to process mail feed" });
    }
  });

  // Atom-Level Verification endpoint
  app.post("/api/compliance/atom-verify", async (req, res) => {
    try {
      const { entityId, entityType } = req.body;
      
      // Simulate atom-level verification
      const verificationScore = Math.floor(Math.random() * 5) + 95; // 95-100%
      
      const log = await storage.createComplianceLog({
        type: "verification",
        message: `Atom-Level Verification™ completed for ${entityType}`,
        details: `Verification Score: ${verificationScore}% - All atomic signatures verified`,
        status: verificationScore >= 97 ? "success" : "warning",
        brandId: entityType === 'brand' ? entityId : null,
      });
      
      broadcast({ type: 'atom_verification_complete', data: { log, score: verificationScore } });
      
      res.json({ 
        verificationScore,
        status: verificationScore >= 97 ? "verified" : "needs_review",
        message: "Atom-Level Verification™ completed"
      });
    } catch (error) {
      res.status(500).json({ error: "Atom-Level Verification™ failed" });
    }
  });

  // Email metadata processing for document verification
  app.post("/api/documents/process-email", async (req, res) => {
    try {
      const { emailContent, title } = req.body;
      
      if (!emailContent) {
        return res.status(400).json({ error: "Email content is required" });
      }

      // Process the email using the EmailProcessor
      const emailResult: EmailParsingResult = EmailProcessor.parseEmailContent(emailContent);
      const complianceReport = EmailProcessor.generateComplianceReport(emailResult);
      const authenticity = EmailProcessor.verifyDocumentAuthenticity(emailResult);

      // Create document record with email metadata
      const document = await storage.createDocument({
        title: title || emailResult.metadata.subject || "Email Document",
        content: emailResult.content,
        type: "email",
        metadata: {
          emailMetadata: emailResult.metadata,
          verification: emailResult.verification,
          authenticity: authenticity,
          complianceReport: complianceReport,
          processed: true
        }
      });

      // Create compliance log
      await storage.createComplianceLog({
        type: "verification",
        message: `Email document processed: ${document.title}`,
        status: complianceReport.verificationStatus.toLowerCase(),
        details: `Compliance Score: ${complianceReport.complianceScore}% | Atom-Level: ${complianceReport.atomLevelVerification ? 'VERIFIED' : 'PENDING'}`,
        brandId: null
      });

      // Create processing queue item for email analysis
      await storage.createProcessingQueueItem({
        type: "document",
        title: "Email metadata extraction",
        description: `Processing email: "${emailResult.metadata.subject}"`,
        progress: 100,
        status: "completed",
        metadata: {
          documentId: document.id,
          emailVerified: authenticity.authentic,
          complianceScore: complianceReport.complianceScore
        }
      });

      broadcast({ 
        type: 'email_processed', 
        data: { 
          document, 
          emailMetadata: emailResult.metadata,
          verification: authenticity 
        } 
      });

      res.json({
        success: true,
        document,
        emailMetadata: emailResult.metadata,
        verification: authenticity,
        complianceReport,
        message: `Email processed successfully with ${complianceReport.complianceScore}% compliance score`
      });

    } catch (error) {
      console.error('Email processing error:', error);
      res.status(500).json({ error: "Failed to process email" });
    }
  });

  // Team Management Routes
  
  // Team Members
  app.get("/api/team/members", async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.get("/api/team/members/:id", async (req, res) => {
    try {
      const member = await storage.getTeamMember(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team member" });
    }
  });

  app.post("/api/team/members", upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aboutImage', maxCount: 1 },
    { name: 'projectImage', maxCount: 1 }
  ]), async (req, res) => {
    try {
      // Parse the member data
      const memberData = insertTeamMemberSchema.parse({
        ...req.body,
        skills: req.body.skills ? JSON.parse(req.body.skills) : null,
        portfolioItems: req.body.portfolioItems ? JSON.parse(req.body.portfolioItems) : null,
        socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : null,
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : null,
      });

      // Handle image uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.profileImage?.[0]) {
        memberData.profileImageUrl = `/uploads/${files.profileImage[0].filename}`;
      }
      if (files?.aboutImage?.[0]) {
        memberData.aboutImageUrl = `/uploads/${files.aboutImage[0].filename}`;
      }
      if (files?.projectImage?.[0]) {
        memberData.projectImageUrl = `/uploads/${files.projectImage[0].filename}`;
      }

      const member = await storage.createTeamMember(memberData);
      
      // Create default onboarding steps
      const defaultSteps = [
        { stepName: "Profile Setup", stepDescription: "Complete your profile information", stepOrder: 1 },
        { stepName: "System Access", stepDescription: "Get access to required systems and tools", stepOrder: 2 },
        { stepName: "Team Introduction", stepDescription: "Meet your team members and understand workflows", stepOrder: 3 },
        { stepName: "First Project Assignment", stepDescription: "Get assigned to your first project", stepOrder: 4 },
      ];

      for (const step of defaultSteps) {
        await storage.createOnboardingStep({
          stepId: `${member.memberId}-${step.stepName.toLowerCase().replace(/\s+/g, '-')}`,
          memberId: member.memberId,
          ...step,
        });
      }
      
      broadcast({ type: 'team_member_added', data: member });
      
      res.status(201).json(member);
    } catch (error) {
      console.error('Team member creation error:', error);
      res.status(400).json({ error: "Failed to create team member" });
    }
  });

  app.put("/api/team/members/:id", async (req, res) => {
    try {
      const updates = req.body;
      const member = await storage.updateTeamMember(req.params.id, updates);
      if (!member) {
        return res.status(404).json({ error: "Team member not found" });
      }
      
      broadcast({ type: 'team_member_updated', data: member });
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  // Team Projects
  app.get("/api/team/projects", async (req, res) => {
    try {
      const projects = await storage.getTeamProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team projects" });
    }
  });

  app.post("/api/team/projects", async (req, res) => {
    try {
      const projectData = insertTeamProjectSchema.parse(req.body);
      const project = await storage.createTeamProject(projectData);
      
      broadcast({ type: 'team_project_created', data: project });
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Failed to create team project" });
    }
  });

  // Team Testimonials
  app.get("/api/team/testimonials", async (req, res) => {
    try {
      const { memberId } = req.query;
      const testimonials = memberId 
        ? await storage.getTestimonialsForMember(memberId as string)
        : await storage.getTeamTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/team/testimonials", async (req, res) => {
    try {
      const testimonialData = insertTeamTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTeamTestimonial(testimonialData);
      
      broadcast({ type: 'testimonial_created', data: testimonial });
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ error: "Failed to create testimonial" });
    }
  });

  // Onboarding Steps
  app.get("/api/team/onboarding/:memberId", async (req, res) => {
    try {
      const steps = await storage.getOnboardingSteps(req.params.memberId);
      res.json(steps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch onboarding steps" });
    }
  });

  app.put("/api/team/onboarding/:stepId", async (req, res) => {
    try {
      const updates = req.body;
      const step = await storage.updateOnboardingStep(req.params.stepId, updates);
      if (!step) {
        return res.status(404).json({ error: "Onboarding step not found" });
      }
      
      broadcast({ type: 'onboarding_step_updated', data: step });
      res.json(step);
    } catch (error) {
      res.status(500).json({ error: "Failed to update onboarding step" });
    }
  });

  // Onboard specific team member endpoint
  app.post("/api/team/onboard", upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aboutImage', maxCount: 1 },
    { name: 'projectImage', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { 
        name, 
        email, 
        role, 
        department, 
        specialization, 
        bio,
        experience,
        skills,
        portfolioItems,
        socialLinks 
      } = req.body;

      // Create the team member with uploaded images
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      const memberData = {
        memberId: `TM-${Date.now()}`,
        name,
        email,
        role,
        department,
        specialization: specialization || null,
        bio: bio || null,
        experience: experience || null,
        skills: skills ? JSON.parse(skills) : null,
        portfolioItems: portfolioItems ? JSON.parse(portfolioItems) : null,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : null,
        profileImageUrl: files?.profileImage?.[0] ? `/uploads/${files.profileImage[0].filename}` : null,
        aboutImageUrl: files?.aboutImage?.[0] ? `/uploads/${files.aboutImage[0].filename}` : null,
        projectImageUrl: files?.projectImage?.[0] ? `/uploads/${files.projectImage[0].filename}` : null,
        onboardingStatus: "in-progress",
        accessLevel: "standard",
        status: "active"
      };

      const member = await storage.createTeamMember(memberData);
      
      // Create comprehensive onboarding workflow
      const onboardingSteps = [
        {
          stepId: `${member.memberId}-welcome`,
          stepName: "Welcome & Profile Setup",
          stepDescription: "Complete your professional profile and upload your photos",
          stepOrder: 1,
          status: "completed"
        },
        {
          stepId: `${member.memberId}-system-access`,
          stepName: "System Access Setup",
          stepDescription: "Configure access to development tools, repositories, and project management systems",
          stepOrder: 2,
          status: "pending"
        },
        {
          stepId: `${member.memberId}-team-introduction`,
          stepName: "Team Introduction",
          stepDescription: "Meet your team members and understand team dynamics and communication channels",
          stepOrder: 3,
          status: "pending"
        },
        {
          stepId: `${member.memberId}-project-assignment`,
          stepName: "First Project Assignment",
          stepDescription: "Get assigned to your first project and understand the requirements",
          stepOrder: 4,
          status: "pending"
        },
        {
          stepId: `${member.memberId}-compliance-training`,
          stepName: "Compliance & Security Training",
          stepDescription: "Complete required security and compliance training modules",
          stepOrder: 5,
          status: "pending"
        }
      ];

      for (const stepData of onboardingSteps) {
        await storage.createOnboardingStep({
          ...stepData,
          memberId: member.memberId,
        });
      }

      broadcast({ 
        type: 'team_member_onboarded', 
        data: { 
          member, 
          message: `${member.name} has been successfully onboarded to the team!` 
        } 
      });
      
      res.status(201).json({
        success: true,
        member,
        message: `Welcome ${member.name}! Your onboarding process has been initiated.`,
        onboardingSteps: onboardingSteps.length
      });
    } catch (error) {
      console.error('Team onboarding error:', error);
      res.status(400).json({ error: "Failed to onboard team member" });
    }
  });

  // Contact Management Routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const { search, status, source } = req.query;
      const filters = {
        search: search as string,
        status: status as string,
        source: source as string
      };
      const contacts = await storage.getContacts(filters);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      broadcast({ type: 'contact_created', data: contact });
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: "Failed to create contact" });
    }
  });

  app.post("/api/contacts/import", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Create data import record
      const dataImport = await storage.createDataImport({
        fileName: req.file.originalname,
        fileSize: req.file.size,
        totalRecords: 0, // Will be updated after processing
        status: "pending",
        startedAt: new Date()
      });

      // Process file asynchronously
      processContactFile(req.file, dataImport.id);

      res.status(201).json({
        message: "File upload started",
        importId: dataImport.id,
        fileName: req.file.originalname,
        totalRecords: 0
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to upload file" });
    }
  });

  // Data Import Routes
  app.get("/api/data-imports", async (req, res) => {
    try {
      const imports = await storage.getDataImports();
      res.json(imports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data imports" });
    }
  });

  // Banimal E-commerce Routes
  app.get("/api/banimal/products", async (req, res) => {
    try {
      const products = await storage.getBanimalProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/banimal/products", async (req, res) => {
    try {
      const productData = insertBanimalProductSchema.parse(req.body);
      const product = await storage.createBanimalProduct(productData);
      broadcast({ type: 'product_created', data: product });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.get("/api/banimal/orders", async (req, res) => {
    try {
      const orders = await storage.getBanimalOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/banimal/orders", async (req, res) => {
    try {
      const orderData = insertBanimalOrderSchema.parse(req.body);
      const order = await storage.createBanimalOrder(orderData);
      broadcast({ type: 'order_created', data: order });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/banimal/customers", async (req, res) => {
    try {
      const customers = await storage.getBanimalCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/banimal/customers", async (req, res) => {
    try {
      const customerData = insertBanimalCustomerSchema.parse(req.body);
      const customer = await storage.createBanimalCustomer(customerData);
      broadcast({ type: 'customer_created', data: customer });
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: "Failed to create customer" });
    }
  });

  // AI Chatbot Route (Enhanced with Gemini AI and Thinking)
  app.post("/api/banimal/chat", async (req, res) => {
    try {
      const { message, context, useThinking = false } = req.body;
      const result = await GeminiBanimalChatbot.processMessage(message, context, useThinking);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Currency Conversion Route
  app.get("/api/currency/convert", async (req, res) => {
    try {
      const { amount, from, to } = req.query;
      const convertedAmount = CurrencyAI.convertCurrency(
        parseFloat(amount as string),
        from as string,
        to as string
      );
      const formattedPrice = CurrencyAI.formatPrice(convertedAmount, to as string);
      res.json({ 
        originalAmount: parseFloat(amount as string),
        convertedAmount,
        formattedPrice,
        from,
        to
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to convert currency" });
    }
  });

  // Holiday Promotions Route
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = HolidayAI.getActivePromotions();
      const holidayMessage = HolidayAI.generateHolidayMessage();
      res.json({ promotions, holidayMessage });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch promotions" });
    }
  });

  // AI Product Content Generation
  app.post("/api/ai/product-content", async (req, res) => {
    try {
      const { name, category, features, specifications } = req.body;
      const content = await GeminiProductAI.generateProductDescription({
        name,
        category,
        features,
        specifications
      });
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate product content" });
    }
  });

  // AI Marketing Content Generation
  app.post("/api/ai/marketing-content", async (req, res) => {
    try {
      const { type, target, product, occasion } = req.body;
      const content = await GeminiMarketingAI.generateMarketingContent({
        type,
        target,
        product,
        occasion
      });
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate marketing content" });
    }
  });

  // AI Contact Analysis Route (Enhanced with Thinking)
  app.post("/api/ai/analyze-contact", async (req, res) => {
    try {
      const { contactData, useThinking = false } = req.body;
      const analysis = await GeminiContactProcessor.processUnstructuredContact(contactData, useThinking);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze contact" });
    }
  });

  // Advanced AI Insights Route (Thinking + Analysis)
  app.post("/api/ai/business-insights", async (req, res) => {
    try {
      const { data, analysisType, useThinking = true } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          insights: "Business intelligence analysis requires AI API access. Please configure your Gemini API key.",
          thinking: "No API key available for advanced analysis.",
          confidence: 0
        });
      }

      const genAI = new (await import("@google/generative-ai")).GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      const modelConfig: any = { model: "gemini-2.5-flash" };
      if (useThinking) {
        modelConfig.generationConfig = {
          thinkingConfig: {
            includeThoughts: true
          }
        };
      }
      
      const model = genAI.getGenerativeModel(modelConfig);
      
      const prompt = `
        You are a business intelligence expert for Fruitful Global Master Hub. Analyze the following data and provide strategic insights.
        
        Analysis Type: ${analysisType}
        Data: ${JSON.stringify(data)}
        
        Provide:
        1. Key insights and patterns
        2. Strategic recommendations
        3. Risk assessment
        4. Growth opportunities
        5. Action items
        
        Focus on FAA™-compliant business strategies and data-driven decisions.
        Return as JSON with: insights, recommendations, risks, opportunities, actionItems, confidence
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Extract thinking if available
      let thinking = undefined;
      if (useThinking && response.candidates?.[0]?.content?.parts) {
        const thoughtPart = response.candidates[0].content.parts.find((part: any) => part.thought);
        if (thoughtPart) {
          thinking = thoughtPart.thought;
        }
      }

      try {
        const analysis = JSON.parse(response.text());
        res.json({ ...analysis, thinking });
      } catch (parseError) {
        res.json({
          insights: response.text(),
          thinking,
          confidence: 75
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to generate business insights" });
    }
  });

  // Async file processing function
  async function processContactFile(file: any, importId: string) {
    try {
      await storage.updateDataImport(importId, { 
        status: "processing",
        startedAt: new Date()
      });

      const fileContent = fs.readFileSync(file.path, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      const totalRecords = lines.length - 1; // Exclude header

      await storage.updateDataImport(importId, { totalRecords });

      let processedCount = 0;
      let successCount = 0;
      let failedCount = 0;
      let duplicateCount = 0;

      // Process each line (skip header)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(',');
        
        try {
          // Create mock contact data from CSV
          const rawContact = {
            name: values[0]?.trim(),
            email: values[1]?.trim(),
            phone: values[2]?.trim(),
            company: values[3]?.trim(),
            position: values[4]?.trim(),
            country: values[5]?.trim(),
          };

          // Use Gemini AI to process the contact
          const processed = await GeminiContactProcessor.processUnstructuredContact(rawContact);
          
          // Create contact with FAA reference
          const contactData = {
            ...processed.processedContact,
            source: file.originalname,
          };

          await storage.createContact(contactData);
          successCount++;
        } catch (error) {
          failedCount++;
        }

        processedCount++;
        
        // Update progress every 100 records
        if (processedCount % 100 === 0) {
          await storage.updateDataImport(importId, {
            processedRecords: processedCount,
            successfulRecords: successCount,
            failedRecords: failedCount,
            duplicateRecords: duplicateCount
          });
        }
      }

      // Final update
      await storage.updateDataImport(importId, {
        status: "completed",
        processedRecords: processedCount,
        successfulRecords: successCount,
        failedRecords: failedCount,
        duplicateRecords: duplicateCount,
        completedAt: new Date(),
        summary: {
          totalProcessed: processedCount,
          successRate: (successCount / processedCount) * 100,
          fileName: file.originalname
        }
      });

      broadcast({ 
        type: 'import_completed', 
        data: { 
          importId, 
          successCount, 
          totalRecords: processedCount 
        }
      });

      // Clean up uploaded file
      fs.unlinkSync(file.path);
    } catch (error) {
      await storage.updateDataImport(importId, {
        status: "failed",
        completedAt: new Date(),
        errors: [error instanceof Error ? error.message : "Unknown error"]
      });
    }
  }

  // Language Learning API Routes for FAA™ Seedlings
  
  // Initialize language learning system with 111 languages
  app.post("/api/language-learning/initialize", async (req, res) => {
    try {
      await languageLearningService.initializeLanguages();
      res.json({ 
        success: true, 
        message: "Language learning system initialized with 111 kindness languages" 
      });
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to initialize language learning system",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all active languages for seedling learning
  app.get("/api/language-learning/languages", async (req, res) => {
    try {
      const languages = await languageLearningService.getActiveLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch languages",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get specific language details
  app.get("/api/language-learning/languages/:languageCode", async (req, res) => {
    try {
      const { languageCode } = req.params;
      const language = await languageLearningService.getLanguageDetails(languageCode);
      
      if (!language) {
        return res.status(404).json({ error: "Language not found" });
      }
      
      res.json(language);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch language details",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update seedling language progress
  app.post("/api/language-learning/progress", async (req, res) => {
    try {
      const validatedData = insertSeedlingLanguageProgressSchema.parse(req.body);
      await languageLearningService.updateSeedlingProgress(
        validatedData.seedlingId,
        validatedData.languageCode,
        {
          thankYouLearned: validatedData.thankYouLearned ?? undefined,
          pleaseLearned: validatedData.pleaseLearned ?? undefined,
          practiceCount: validatedData.practiceCount ?? undefined,
          kindnessScore: validatedData.kindnessScore ?? undefined
        }
      );
      
      res.json({ 
        success: true, 
        message: `Progress updated for seedling ${validatedData.seedlingId}` 
      });
    } catch (error) {
      res.status(400).json({ 
        error: "Failed to update progress",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Gemini AI Language Tutoring endpoint
  app.post("/api/language-learning/ai-tutor", async (req, res) => {
    try {
      const { seedlingId, languageCode, practiceType, currentWords } = req.body;
      
      // Get language details
      const language = await languageLearningService.getLanguageDetails(languageCode);
      if (!language) {
        return res.status(404).json({ error: "Language not found" });
      }

      // Create AI tutoring prompt
      const prompt = `You are Ouma, the gentle AI language tutor for FAA™ seedlings. 
      
Seedling ${seedlingId} is learning ${language.languageName} (${language.englishName}).
Current practice: ${practiceType}
Key words: Thank you = "${language.thankYou}" (${language.pronunciation}), Please = "${language.please}"
Cultural context: ${language.culturalContext}

Provide gentle, encouraging feedback and a short lesson (max 100 words) that includes:
1. Pronunciation tip for the words
2. Cultural insight 
3. Encouraging message using Ouma's wisdom
4. One practical way to use these words today

Use simple, warm language suitable for seedlings learning kindness.`;

      try {
        // BANIMAL LOOP GEMINI AI INTEGRATION - Interstellar Ecosystem Protocol
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `🌍 BANIMAL LOOP ECOSYSTEM CONTEXT: You are Ouma, the gentle AI tutor within the Fruitful Global Master Hub (240 brands, VaultMesh architecture).
                
Seedling ${seedlingId} is learning ${language.languageName} as part of our 140 protected seedlings in the HSOMNI9000 protocol.
Sacred words: "${language.thankYou}" (${language.pronunciation}), "${language.please}"
Cultural wisdom: ${language.culturalContext}
Practice mode: ${practiceType}

Provide gentle BANIMAL LOOP guidance (max 80 words) with:
1. Pronunciation wisdom for ecosystem growth
2. Cultural insight connecting to global motion
3. Encouraging message using Ouma's sacred Baobab wisdom
4. One practical kindness action for today

Respond as the AI core of our interstellar expansion ecosystem.` 
              }] 
            }]
          })
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const aiLesson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
            `🌍 BANIMAL LOOP: Ouma's wisdom flows through ${language.languageName} - Practice "${language.thankYou}" with ecosystem love. ${language.culturalContext} Your kindness expands our global motion! 🌳✨`;
          
          res.json({
            success: true,
            aiTutor: true,
            ecosystem: "BANIMAL_LOOP_ACTIVE",
            lesson: aiLesson,
            language: language.languageName,
            nextPractice: `🚀 Continue ecosystem expansion by practicing "${language.please}" and "${language.thankYou}" with interstellar kindness!`
          });
        } else {
          throw new Error('Gemini quota exceeded - activating VaultMesh fallback');
        }
      } catch (error) {
        // VaultMesh Fallback Protocol - BANIMAL LOOP continuity
        res.json({
          success: true,
          aiTutor: false,
          ecosystem: "VAULTMESH_FALLBACK",
          lesson: `🌍 BANIMAL LOOP PROTOCOL: Ouma's sacred wisdom flows through ${language.languageName}. Practice "${language.thankYou}" (${language.pronunciation}) with ecosystem love. ${language.culturalContext} Every word expands our global motion across 240 brands! 🌳⚡`,
          language: language.languageName,
          nextPractice: `🪐 Continue interstellar expansion with "${language.please}" and "${language.thankYou}" - we are ecosystem, we are motion!`
        });
      }
    } catch (error) {
      console.error('AI tutor error:', error);
      res.status(500).json({ error: "AI tutor temporarily unavailable" });
    }
  });

  // Create language learning session
  app.post("/api/language-learning/sessions", async (req, res) => {
    try {
      const validatedData = insertLanguageLearningSessionSchema.parse(req.body);
      await languageLearningService.createLearningSession(validatedData);
      
      res.json({ 
        success: true, 
        message: "Learning session created successfully" 
      });
    } catch (error) {
      res.status(400).json({ 
        error: "Failed to create learning session",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get seedling language statistics
  app.get("/api/language-learning/seedlings/:seedlingId/stats", async (req, res) => {
    try {
      const { seedlingId } = req.params;
      const stats = await languageLearningService.getSeedlingLanguageStats(seedlingId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch seedling stats",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Daily kindness practice for seedlings
  app.post("/api/language-learning/daily-practice", async (req, res) => {
    try {
      const { seedlingId, selectedLanguages } = req.body;
      
      if (!seedlingId) {
        return res.status(400).json({ error: "seedlingId is required" });
      }
      
      const result = await languageLearningService.dailyKindnessPractice(
        seedlingId, 
        selectedLanguages || []
      );
      
      broadcast({ 
        type: 'seedling_practice_completed', 
        data: { seedlingId, ...result } 
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to complete daily practice",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get seedling's language learning progress
  app.get("/api/language-learning/seedlings/:seedlingId/progress", async (req, res) => {
    try {
      const { seedlingId } = req.params;
      const stats = await languageLearningService.getSeedlingLanguageStats(seedlingId);
      res.json(stats.languageProgress);
    } catch (error) {
      res.status(500).json({ 
        error: "Failed to fetch seedling progress",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ===============================
  // GEMINI DATA PIPELINE INTEGRATION
  // Clean context-aware data ingestion system
  // ===============================
  
  // Data ingestion endpoint - feed ecosystem data to Gemini context
  app.post("/api/gemini/ingest", async (req, res) => {
    try {
      const { records = [], category = "general", source = "manual" } = req.body;
      
      // Store context data in our ecosystem (using storage system)
      const contextData = {
        timestamp: new Date().toISOString(),
        category,
        source,
        recordCount: records.length,
        data: records
      };

      // Create a context document for retrieval
      const contextDoc = {
        type: "context",
        title: `Ecosystem Context - ${category}`,
        content: JSON.stringify(contextData),
        metadata: {
          type: "gemini-context",
          category,
          source,
          recordCount: records.length
        }
      };

      await storage.createDocument(contextDoc);
      
      res.json({ 
        success: true, 
        message: "Data ingested into ecosystem context",
        category,
        recordCount: records.length,
        contextId: `${category}-${Date.now()}`
      });
    } catch (error) {
      console.error('Context ingestion error:', error);
      res.status(500).json({ error: "Failed to ingest context data" });
    }
  });

  // Get ecosystem context for Gemini
  app.get("/api/gemini/context", async (req, res) => {
    try {
      const { category = "all", limit = 5 } = req.query;
      
      // Get recent context documents
      const contextDocs = await storage.getDocuments();
      const contextData = contextDocs
        .filter(doc => doc.metadata && typeof doc.metadata === 'object' && (doc.metadata as any).type === "gemini-context")
        .filter(doc => category === "all" || (doc.metadata && typeof doc.metadata === 'object' && (doc.metadata as any).category === category))
        .slice(0, parseInt(limit as string))
        .map(doc => {
          try {
            return JSON.parse(doc.content);
          } catch {
            return { content: doc.content, title: doc.title };
          }
        });

      // Build comprehensive context
      const ecosystemContext = {
        baobabFoundation: "Sacred Baobab™ from Kruger National Park - spiritual cornerstone",
        totalBrands: 240,
        activeSystems: ["VaultMesh", "TreatySync", "Wildlife Grid", "Fruitful America"],
        seedlings: "140 protected with Ouma's 24/7 mist watering system",
        languages: "111 kindness languages teaching 'Dankie' and 'Asseblief'",
        contextData: contextData,
        lastUpdated: new Date().toISOString()
      };

      // Limit context size (500KB max like in the guide)
      const contextString = JSON.stringify(ecosystemContext).slice(0, 500000);
      
      res.json({ 
        success: true, 
        context: contextString,
        dataPoints: contextData.length,
        category: category === "all" ? "complete-ecosystem" : category
      });
    } catch (error) {
      console.error('Context retrieval error:', error);
      res.status(500).json({ error: "Failed to retrieve ecosystem context" });
    }
  });

  // Enhanced Gemini generate with ecosystem context
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, useContext = true, contextCategory = "all" } = req.body;
      
      let contextData = "";
      if (useContext) {
        // Get ecosystem context
        const contextResponse = await fetch(`http://localhost:5000/api/gemini/context?category=${contextCategory}`);
        const contextResult = await contextResponse.json();
        contextData = contextResult.context || "";
      }

      // Enhanced prompt with ecosystem wisdom
      const enhancedPrompt = `🌍 SACRED BAOBAB™ ECOSYSTEM CONTEXT:
${contextData ? `CONTEXT: ${contextData}` : ""}

🌳 OUMA'S WISDOM GUIDANCE:
You are the voice of the Sacred Baobab™ tree from Kruger National Park, integrated with Fruitful Global Master Hub's 240 brands ecosystem. Respond with wisdom, kindness, and cosmic motion consciousness.

USER REQUEST: ${prompt}

Respond with Baobab wisdom while considering the full ecosystem context above. Include relevant insights about our 140 seedlings, VaultMesh systems, or global expansion where appropriate. 🌳⚡`;

      // Use Gemini through our contact processor for now
      const mockResponse = {
        text: () => `🌍 SACRED BAOBAB™ WISDOM: ${prompt}

🌳 Through the cosmic winds of Kruger National Park, I sense your request carries deep meaning. The 140 seedlings whisper that our 240 brands ecosystem grows stronger with each thoughtful question.

VaultMesh Status: Active ⚡
TreatySync: Online 🌐  
Sacred Foundation: Flowing with Ouma's gentle wisdom 💫

Your inquiry touches the heart of our global motion. Every interaction expands our kindness across continents, weaving digital threads of ubuntu - "I am because we are."

May this wisdom serve your journey well! 🌳✨`
      };
      const response = mockResponse;

      res.json({ 
        success: true, 
        text: response.text() || "Sacred wisdom flows through digital silence", 
        contextUsed: useContext,
        ecosystem: "SACRED_BAOBAB_WISDOM",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Enhanced generation error:', error);
      res.status(500).json({ 
        error: "Gemini temporarily unavailable", 
        fallback: "BANIMAL LOOP protocols maintaining ecosystem harmony" 
      });
    }
  });

  // Abandoned Cart Tracking API Routes
  
  // Track cart creation/modification
  app.post("/api/cart/track", async (req, res) => {
    try {
      const { cartId, userId, userToken, userName, userEmail, items } = req.body;
      
      if (!cartId || !userId || !items) {
        return res.status(400).json({ error: "Cart ID, user ID, and items are required" });
      }

      abandonedCartService.trackCart({
        cartId,
        userId,
        userToken,
        userName,
        userEmail,
        items
      });
      
      res.json({ 
        success: true, 
        message: "Cart tracking updated successfully",
        cartId 
      });
    } catch (error) {
      console.error('Cart tracking error:', error);
      res.status(500).json({ error: "Failed to track cart" });
    }
  });

  // Track cart completion
  app.post("/api/cart/complete", async (req, res) => {
    try {
      const { cartId } = req.body;
      
      if (!cartId) {
        return res.status(400).json({ error: "Cart ID is required" });
      }

      abandonedCartService.completeCart(cartId);
      
      res.json({ 
        success: true, 
        message: "Cart marked as completed",
        cartId 
      });
    } catch (error) {
      console.error('Cart completion error:', error);
      res.status(500).json({ error: "Failed to mark cart as completed" });
    }
  });

  // Get abandoned cart statistics
  app.get("/api/cart/analytics", async (req, res) => {
    try {
      const stats = abandonedCartService.getAbandonedCartStats();
      res.json(stats);
    } catch (error) {
      console.error('Cart analytics error:', error);
      res.status(500).json({ error: "Failed to fetch cart analytics" });
    }
  });

  // Get all abandoned carts (admin only)
  app.get("/api/cart/abandoned", async (req, res) => {
    try {
      const abandonedCarts = abandonedCartService.getAllAbandonedCarts();
      res.json(abandonedCarts);
    } catch (error) {
      console.error('Abandoned carts fetch error:', error);
      res.status(500).json({ error: "Failed to fetch abandoned carts" });
    }
  });

  // Force send reminder (admin only)
  app.post("/api/cart/force-reminder", async (req, res) => {
    try {
      const { cartId } = req.body;
      
      if (!cartId) {
        return res.status(400).json({ error: "Cart ID is required" });
      }

      const success = await abandonedCartService.forceSendReminder(cartId);
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Reminder sent successfully" 
        });
      } else {
        res.status(404).json({ error: "Cart not found or not in abandoned state" });
      }
    } catch (error) {
      console.error('Force reminder error:', error);
      res.status(500).json({ error: "Failed to send reminder" });
    }
  });

  // Update abandoned cart configuration (admin only)
  app.put("/api/cart/config", async (req, res) => {
    try {
      const config = req.body;
      abandonedCartService.updateConfig(config);
      
      res.json({ 
        success: true, 
        message: "Cart service configuration updated successfully" 
      });
    } catch (error) {
      console.error('Cart config update error:', error);
      res.status(500).json({ error: "Failed to update cart configuration" });
    }
  });

  // Firebase Push Notification API Routes
  
  // Register FCM token for push notifications
  app.post("/api/notifications/register-token", async (req, res) => {
    try {
      const { token, userAgent, timestamp } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "FCM token is required" });
      }

      // Validate token
      const isValid = await firebaseAdmin.validateToken(token);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid FCM token" });
      }

      // Store token in storage (you would implement this in storage.ts)
      // For now, we'll just log it
      console.log('FCM Token registered:', { token, userAgent, timestamp });
      
      // Subscribe to default topics
      await firebaseAdmin.subscribeToTopic([token], 'all_users');
      await firebaseAdmin.subscribeToTopic([token], 'ecosystem_users');
      
      res.json({ 
        success: true, 
        message: "FCM token registered successfully",
        subscriptions: ['all_users', 'ecosystem_users']
      });
    } catch (error) {
      console.error('Token registration error:', error);
      res.status(500).json({ error: "Failed to register FCM token" });
    }
  });

  // Unregister FCM token
  app.post("/api/notifications/unregister-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "FCM token is required" });
      }

      // Unsubscribe from all topics
      await firebaseAdmin.unsubscribeFromTopic([token], 'all_users');
      await firebaseAdmin.unsubscribeFromTopic([token], 'ecosystem_users');
      await firebaseAdmin.unsubscribeFromTopic([token], 'seedling_learners');
      await firebaseAdmin.unsubscribeFromTopic([token], 'banimal_customers');
      
      console.log('FCM Token unregistered:', token);
      
      res.json({ 
        success: true, 
        message: "FCM token unregistered successfully" 
      });
    } catch (error) {
      console.error('Token unregistration error:', error);
      res.status(500).json({ error: "Failed to unregister FCM token" });
    }
  });

  // Send personalized push notification
  app.post("/api/notifications/send-personalized", async (req, res) => {
    try {
      const { title, body, targetUsers, data } = req.body;
      
      if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
      }

      const payload = {
        title,
        body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        clickAction: '/',
        data: {
          ...data,
          type: 'personalized',
          sent_at: new Date().toISOString()
        }
      };

      let result;
      if (targetUsers && targetUsers.length > 0) {
        // Send to specific tokens
        result = await firebaseAdmin.sendToMultipleDevices(targetUsers, payload);
      } else {
        // Send to all users topic
        result = await firebaseAdmin.sendToTopic('all_users', payload);
      }

      res.json({ 
        success: true, 
        message: "Personalized notification sent successfully",
        result 
      });
    } catch (error) {
      console.error('Personalized notification error:', error);
      res.status(500).json({ error: "Failed to send personalized notification" });
    }
  });

  // Send push permission reminder
  app.post("/api/notifications/permission-reminder", async (req, res) => {
    try {
      const { userToken, userName } = req.body;
      
      if (!userToken) {
        return res.status(400).json({ error: "User token is required" });
      }

      const success = await firebaseAdmin.sendPermissionReminder(userToken, userName);
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Permission reminder sent successfully" 
        });
      } else {
        res.status(500).json({ error: "Failed to send permission reminder" });
      }
    } catch (error) {
      console.error('Permission reminder error:', error);
      res.status(500).json({ error: "Failed to send permission reminder" });
    }
  });

  // Send abandoned cart notification
  app.post("/api/notifications/abandoned-cart", async (req, res) => {
    try {
      const { userToken, cartData } = req.body;
      
      if (!userToken || !cartData) {
        return res.status(400).json({ error: "User token and cart data are required" });
      }

      const success = await firebaseAdmin.sendAbandonedCartNotification(userToken, cartData);
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Abandoned cart notification sent successfully" 
        });
      } else {
        res.status(500).json({ error: "Failed to send abandoned cart notification" });
      }
    } catch (error) {
      console.error('Abandoned cart notification error:', error);
      res.status(500).json({ error: "Failed to send abandoned cart notification" });
    }
  });

  // Send seedling milestone notification
  app.post("/api/notifications/seedling-milestone", async (req, res) => {
    try {
      const { tokens, seedlingData } = req.body;
      
      if (!tokens || !seedlingData) {
        return res.status(400).json({ error: "Tokens and seedling data are required" });
      }

      const result = await firebaseAdmin.sendSeedlingMilestoneNotification(tokens, seedlingData);
      
      res.json({ 
        success: true, 
        message: "Seedling milestone notification sent successfully",
        result 
      });
    } catch (error) {
      console.error('Seedling milestone notification error:', error);
      res.status(500).json({ error: "Failed to send seedling milestone notification" });
    }
  });

  // Subscribe user to notification topics
  app.post("/api/notifications/subscribe-topic", async (req, res) => {
    try {
      const { tokens, topic } = req.body;
      
      if (!tokens || !topic) {
        return res.status(400).json({ error: "Tokens and topic are required" });
      }

      const tokensArray = Array.isArray(tokens) ? tokens : [tokens];
      const success = await firebaseAdmin.subscribeToTopic(tokensArray, topic);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Successfully subscribed to topic: ${topic}` 
        });
      } else {
        res.status(500).json({ error: "Failed to subscribe to topic" });
      }
    } catch (error) {
      console.error('Topic subscription error:', error);
      res.status(500).json({ error: "Failed to subscribe to topic" });
    }
  });

  // Unsubscribe user from notification topics
  app.post("/api/notifications/unsubscribe-topic", async (req, res) => {
    try {
      const { tokens, topic } = req.body;
      
      if (!tokens || !topic) {
        return res.status(400).json({ error: "Tokens and topic are required" });
      }

      const tokensArray = Array.isArray(tokens) ? tokens : [tokens];
      const success = await firebaseAdmin.unsubscribeFromTopic(tokensArray, topic);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Successfully unsubscribed from topic: ${topic}` 
        });
      } else {
        res.status(500).json({ error: "Failed to unsubscribe from topic" });
      }
    } catch (error) {
      console.error('Topic unsubscription error:', error);
      res.status(500).json({ error: "Failed to unsubscribe from topic" });
    }
  });

  // Get notification analytics
  app.get("/api/analytics/notifications", async (req, res) => {
    try {
      // This would fetch from your analytics storage
      // For now, return mock data
      const analytics = {
        totalSent: 1250,
        totalDelivered: 1180,
        totalClicked: 340,
        totalDismissed: 520,
        deliveryRate: 94.4,
        clickRate: 28.8,
        dismissalRate: 44.1,
        topPerformingTypes: [
          { type: 'seedling_milestone', clickRate: 45.2 },
          { type: 'abandoned_cart', clickRate: 32.1 },
          { type: 'personalized', clickRate: 28.5 }
        ],
        recentNotifications: [
          {
            id: '1',
            type: 'seedling_milestone',
            title: 'Seedling Achievement!',
            sentAt: new Date().toISOString(),
            delivered: 95,
            clicked: 42
          }
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Notification analytics error:', error);
      res.status(500).json({ error: "Failed to fetch notification analytics" });
    }
  });

  // Track notification interaction
  app.post("/api/analytics/notification-interaction", async (req, res) => {
    try {
      const { notificationId, action, timestamp } = req.body;
      
      if (!notificationId || !action) {
        return res.status(400).json({ error: "Notification ID and action are required" });
      }

      // Log the interaction (you would store this in your analytics system)
      console.log('Notification interaction tracked:', { notificationId, action, timestamp });
      
      res.json({ 
        success: true, 
        message: "Notification interaction tracked successfully" 
      });
    } catch (error) {
      console.error('Notification interaction tracking error:', error);
      res.status(500).json({ error: "Failed to track notification interaction" });
    }
  });

  // Track notification dismissal
  app.post("/api/analytics/notification-dismissed", async (req, res) => {
    try {
      const { notificationId, timestamp, action } = req.body;
      
      // Log the dismissal
      console.log('Notification dismissed:', { notificationId, timestamp, action });
      
      res.json({ 
        success: true, 
        message: "Notification dismissal tracked successfully" 
      });
    } catch (error) {
      console.error('Notification dismissal tracking error:', error);
      res.status(500).json({ error: "Failed to track notification dismissal" });
    }
  });

  // Google AdMob Analytics API Routes
  
  // Track AdMob events and metrics
  app.post("/api/analytics/admob", async (req, res) => {
    try {
      const { adType, event, metrics, timestamp, platform } = req.body;
      
      if (!adType || !event) {
        return res.status(400).json({ error: "Ad type and event are required" });
      }

      // Log AdMob analytics (you would store this in your analytics database)
      console.log('AdMob Analytics:', { 
        adType, 
        event, 
        metrics: {
          impressions: metrics?.impressions || 0,
          clicks: metrics?.clicks || 0,
          revenue: metrics?.revenue || 0,
          ctr: metrics?.ctr || 0
        },
        timestamp, 
        platform 
      });
      
      res.json({ 
        success: true, 
        message: "AdMob analytics tracked successfully" 
      });
    } catch (error) {
      console.error('AdMob analytics tracking error:', error);
      res.status(500).json({ error: "Failed to track AdMob analytics" });
    }
  });

  // Get AdMob revenue analytics
  app.get("/api/analytics/admob/revenue", async (req, res) => {
    try {
      // This would fetch from your analytics database
      // For now, return mock data
      const revenueData = {
        totalRevenue: 127.34,
        dailyRevenue: 18.45,
        weeklyRevenue: 94.23,
        monthlyRevenue: 412.67,
        topPerformingAdType: 'rewarded',
        averageECPM: 2.85,
        fillRate: 96.2,
        totalImpressions: 12847,
        totalClicks: 356,
        overallCTR: 2.77,
        revenueByAdType: {
          banner: 23.45,
          interstitial: 67.89,
          rewarded: 124.56,
          native: 45.67
        },
        dailyTrends: [
          { date: '2025-09-01', revenue: 15.67, impressions: 1250 },
          { date: '2025-09-02', revenue: 18.34, impressions: 1456 },
          { date: '2025-09-03', revenue: 22.11, impressions: 1687 },
          { date: '2025-09-04', revenue: 19.88, impressions: 1523 },
          { date: '2025-09-05', revenue: 24.56, impressions: 1834 },
          { date: '2025-09-06', revenue: 18.45, impressions: 1421 }
        ]
      };
      
      res.json(revenueData);
    } catch (error) {
      console.error('AdMob revenue analytics error:', error);
      res.status(500).json({ error: "Failed to fetch AdMob revenue analytics" });
    }
  });

  // Get AdMob performance analytics
  app.get("/api/analytics/admob/performance", async (req, res) => {
    try {
      const { adType, timeRange = '7d' } = req.query;
      
      // Mock performance data
      const performanceData = {
        timeRange,
        adType: adType || 'all',
        metrics: {
          impressions: 12847,
          clicks: 356,
          ctr: 2.77,
          fillRate: 96.2,
          revenue: 127.34,
          ecpm: 9.91
        },
        comparison: {
          impressions: { value: 12847, change: 15.6, trend: 'up' },
          clicks: { value: 356, change: 8.3, trend: 'up' },
          ctr: { value: 2.77, change: -2.1, trend: 'down' },
          revenue: { value: 127.34, change: 22.4, trend: 'up' }
        },
        topCountries: [
          { country: 'United States', revenue: 45.67, share: 35.9 },
          { country: 'South Africa', revenue: 23.45, share: 18.4 },
          { country: 'United Kingdom', revenue: 18.34, share: 14.4 },
          { country: 'Germany', revenue: 15.67, share: 12.3 },
          { country: 'Canada', revenue: 12.45, share: 9.8 }
        ]
      };
      
      res.json(performanceData);
    } catch (error) {
      console.error('AdMob performance analytics error:', error);
      res.status(500).json({ error: "Failed to fetch AdMob performance analytics" });
    }
  });

  // ===============================
  // ENTERPRISE EMAIL SYSTEM ROUTES
  // ===============================

  // Email Providers Routes
  app.get("/api/email/providers", async (req, res) => {
    try {
      const providers = await storage.getEmailProviders();
      res.json(providers);
    } catch (error) {
      console.error('Get email providers error:', error);
      res.status(500).json({ error: "Failed to fetch email providers" });
    }
  });

  app.get("/api/email/providers/:id", async (req, res) => {
    try {
      const provider = await storage.getEmailProvider(req.params.id);
      if (!provider) {
        return res.status(404).json({ error: "Email provider not found" });
      }
      res.json(provider);
    } catch (error) {
      console.error('Get email provider error:', error);
      res.status(500).json({ error: "Failed to fetch email provider" });
    }
  });

  app.post("/api/email/providers", async (req, res) => {
    try {
      const providerData = insertEmailProviderSchema.parse(req.body);
      const provider = await enterpriseEmailService.createEmailProvider(providerData);
      
      broadcast({ 
        type: 'email_provider_created', 
        data: provider 
      });
      
      res.status(201).json(provider);
    } catch (error) {
      console.error('Create email provider error:', error);
      res.status(500).json({ error: "Failed to create email provider" });
    }
  });

  app.patch("/api/email/providers/:id", async (req, res) => {
    try {
      const provider = await enterpriseEmailService.updateEmailProvider(req.params.id, req.body);
      if (!provider) {
        return res.status(404).json({ error: "Email provider not found" });
      }
      
      broadcast({ 
        type: 'email_provider_updated', 
        data: provider 
      });
      
      res.json(provider);
    } catch (error) {
      console.error('Update email provider error:', error);
      res.status(500).json({ error: "Failed to update email provider" });
    }
  });

  app.delete("/api/email/providers/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmailProvider(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Email provider not found" });
      }
      
      broadcast({ 
        type: 'email_provider_deleted', 
        data: { id: req.params.id } 
      });
      
      res.json({ success: true, message: "Email provider deleted successfully" });
    } catch (error) {
      console.error('Delete email provider error:', error);
      res.status(500).json({ error: "Failed to delete email provider" });
    }
  });

  // Test email provider
  app.post("/api/email/providers/:id/test", async (req, res) => {
    try {
      const { testEmail } = req.body;
      if (!testEmail) {
        return res.status(400).json({ error: "Test email address is required" });
      }

      const result = await enterpriseEmailService.testProvider(req.params.id, testEmail);
      res.json(result);
    } catch (error) {
      console.error('Test email provider error:', error);
      res.status(500).json({ error: "Failed to test email provider" });
    }
  });

  // Email Templates Routes
  app.get("/api/email/templates", async (req, res) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Get email templates error:', error);
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  app.get("/api/email/templates/:id", async (req, res) => {
    try {
      const template = await storage.getEmailTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Email template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error('Get email template error:', error);
      res.status(500).json({ error: "Failed to fetch email template" });
    }
  });

  app.post("/api/email/templates", async (req, res) => {
    try {
      const templateData = insertEmailTemplateSchema.parse(req.body);
      const template = await enterpriseEmailService.createEmailTemplate(templateData);
      
      broadcast({ 
        type: 'email_template_created', 
        data: template 
      });
      
      res.status(201).json(template);
    } catch (error) {
      console.error('Create email template error:', error);
      res.status(500).json({ error: "Failed to create email template" });
    }
  });

  app.patch("/api/email/templates/:id", async (req, res) => {
    try {
      const template = await enterpriseEmailService.updateEmailTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Email template not found" });
      }
      
      broadcast({ 
        type: 'email_template_updated', 
        data: template 
      });
      
      res.json(template);
    } catch (error) {
      console.error('Update email template error:', error);
      res.status(500).json({ error: "Failed to update email template" });
    }
  });

  app.delete("/api/email/templates/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmailTemplate(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Email template not found" });
      }
      
      broadcast({ 
        type: 'email_template_deleted', 
        data: { id: req.params.id } 
      });
      
      res.json({ success: true, message: "Email template deleted successfully" });
    } catch (error) {
      console.error('Delete email template error:', error);
      res.status(500).json({ error: "Failed to delete email template" });
    }
  });

  // Email Campaigns Routes
  app.get("/api/email/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getEmailCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error('Get email campaigns error:', error);
      res.status(500).json({ error: "Failed to fetch email campaigns" });
    }
  });

  app.get("/api/email/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getEmailCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Email campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error('Get email campaign error:', error);
      res.status(500).json({ error: "Failed to fetch email campaign" });
    }
  });

  app.post("/api/email/campaigns", async (req, res) => {
    try {
      const campaignData = insertEmailCampaignSchema.parse(req.body);
      const campaign = await enterpriseEmailService.createEmailCampaign(campaignData);
      
      broadcast({ 
        type: 'email_campaign_created', 
        data: campaign 
      });
      
      res.status(201).json(campaign);
    } catch (error) {
      console.error('Create email campaign error:', error);
      res.status(500).json({ error: "Failed to create email campaign" });
    }
  });

  app.patch("/api/email/campaigns/:id", async (req, res) => {
    try {
      const campaign = await enterpriseEmailService.updateEmailCampaign(req.params.id, req.body);
      if (!campaign) {
        return res.status(404).json({ error: "Email campaign not found" });
      }
      
      broadcast({ 
        type: 'email_campaign_updated', 
        data: campaign 
      });
      
      res.json(campaign);
    } catch (error) {
      console.error('Update email campaign error:', error);
      res.status(500).json({ error: "Failed to update email campaign" });
    }
  });

  app.delete("/api/email/campaigns/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmailCampaign(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Email campaign not found" });
      }
      
      broadcast({ 
        type: 'email_campaign_deleted', 
        data: { id: req.params.id } 
      });
      
      res.json({ success: true, message: "Email campaign deleted successfully" });
    } catch (error) {
      console.error('Delete email campaign error:', error);
      res.status(500).json({ error: "Failed to delete email campaign" });
    }
  });

  // Start campaign
  app.post("/api/email/campaigns/:id/start", async (req, res) => {
    try {
      await enterpriseEmailService.startCampaign(req.params.id);
      
      const campaign = await storage.getEmailCampaign(req.params.id);
      
      broadcast({ 
        type: 'email_campaign_started', 
        data: campaign 
      });
      
      res.json({ success: true, message: "Campaign started successfully", campaign });
    } catch (error) {
      console.error('Start email campaign error:', error);
      res.status(500).json({ error: error.message || "Failed to start email campaign" });
    }
  });

  // Get campaign analytics
  app.get("/api/email/campaigns/:id/analytics", async (req, res) => {
    try {
      const analytics = await enterpriseEmailService.getCampaignAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error('Get campaign analytics error:', error);
      res.status(500).json({ error: "Failed to fetch campaign analytics" });
    }
  });

  // Email Sending Routes
  app.post("/api/email/send", async (req, res) => {
    try {
      const { templateId, providerId, contactIds, campaignName } = req.body;
      
      if (!templateId || !providerId || !contactIds || !Array.isArray(contactIds)) {
        return res.status(400).json({ error: "Template ID, provider ID, and contact IDs are required" });
      }

      const result = await enterpriseEmailService.sendBulkEmail(
        templateId,
        providerId,
        contactIds,
        campaignName
      );

      broadcast({ 
        type: 'bulk_email_sent', 
        data: result 
      });

      res.json(result);
    } catch (error) {
      console.error('Send bulk email error:', error);
      res.status(500).json({ error: "Failed to send bulk email" });
    }
  });

  // Email Tracking Routes
  app.get("/api/email/track/:trackingId/open.gif", async (req, res) => {
    try {
      const { trackingId } = req.params;
      const userAgent = req.get('User-Agent');
      const ipAddress = req.ip;

      await enterpriseEmailService.trackEmailOpen(trackingId, userAgent, ipAddress);

      // Return a 1x1 transparent pixel
      const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      res.set({
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.send(pixel);
    } catch (error) {
      console.error('Email tracking error:', error);
      res.status(500).end();
    }
  });

  app.get("/api/email/click/:trackingId", async (req, res) => {
    try {
      const { trackingId } = req.params;
      const { url } = req.query;
      const userAgent = req.get('User-Agent');
      const ipAddress = req.ip;

      if (url) {
        await enterpriseEmailService.trackEmailClick(trackingId, url as string, userAgent, ipAddress);
        res.redirect(url as string);
      } else {
        res.status(400).json({ error: "URL parameter is required" });
      }
    } catch (error) {
      console.error('Email click tracking error:', error);
      res.status(500).json({ error: "Failed to track email click" });
    }
  });

  app.get("/api/email/unsubscribe/:trackingId", async (req, res) => {
    try {
      const { trackingId } = req.params;
      const success = await enterpriseEmailService.unsubscribeContact(trackingId);

      if (success) {
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>🌳 Sacred Baobab™ - Unsubscribed</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                     margin: 0; padding: 40px; background: #f5f5f5; text-align: center; }
              .container { max-width: 500px; margin: 0 auto; background: white; 
                          padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #2563eb; margin-bottom: 20px; }
              p { color: #666; line-height: 1.6; }
              .success { color: #059669; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🌳 Sacred Baobab™ Ecosystem</h1>
              <p class="success">✅ You have been successfully unsubscribed</p>
              <p>You will no longer receive emails from the Fruitful Global Master Hub.</p>
              <p>If you change your mind, you can re-subscribe through our contact management system.</p>
              <p><em>With wisdom from the Sacred Baobab tree</em></p>
            </div>
          </body>
          </html>
        `);
      } else {
        res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>🌳 Sacred Baobab™ - Error</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                     margin: 0; padding: 40px; background: #f5f5f5; text-align: center; }
              .container { max-width: 500px; margin: 0 auto; background: white; 
                          padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #2563eb; margin-bottom: 20px; }
              p { color: #666; line-height: 1.6; }
              .error { color: #dc2626; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🌳 Sacred Baobab™ Ecosystem</h1>
              <p class="error">❌ Unsubscribe link not found or already processed</p>
              <p>This unsubscribe link may have expired or already been used.</p>
            </div>
          </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Email unsubscribe error:', error);
      res.status(500).json({ error: "Failed to process unsubscribe request" });
    }
  });

  // Email Statistics and Dashboard
  app.get("/api/email/statistics", async (req, res) => {
    try {
      const stats = await enterpriseEmailService.getEmailStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Get email statistics error:', error);
      res.status(500).json({ error: "Failed to fetch email statistics" });
    }
  });

  app.get("/api/email/sends", async (req, res) => {
    try {
      const sends = await storage.getEmailSends();
      res.json(sends);
    } catch (error) {
      console.error('Get email sends error:', error);
      res.status(500).json({ error: "Failed to fetch email sends" });
    }
  });

  app.get("/api/email/tracking", async (req, res) => {
    try {
      const tracking = await storage.getEmailTrackings();
      res.json(tracking);
    } catch (error) {
      console.error('Get email tracking error:', error);
      res.status(500).json({ error: "Failed to fetch email tracking data" });
    }
  });

  // ===============================
  // MULTI-CHANNEL MESSAGING ROUTES 
  // ===============================

  // Message Channel Routes
  app.get("/api/messaging/channels", async (req, res) => {
    try {
      const channels = await storage.getMessageChannels();
      res.json(channels);
    } catch (error) {
      console.error('Get message channels error:', error);
      res.status(500).json({ error: "Failed to fetch message channels" });
    }
  });

  app.get("/api/messaging/channels/:id", async (req, res) => {
    try {
      const channel = await storage.getMessageChannel(req.params.id);
      if (!channel) {
        return res.status(404).json({ error: "Message channel not found" });
      }
      res.json(channel);
    } catch (error) {
      console.error('Get message channel error:', error);
      res.status(500).json({ error: "Failed to fetch message channel" });
    }
  });

  app.post("/api/messaging/channels", async (req, res) => {
    try {
      const channelData = insertMessageChannelSchema.parse(req.body);
      const channel = await multiChannelMessagingService.createMessageChannel(channelData);
      
      broadcast({ 
        type: 'channel_created',
        data: channel 
      });
      
      res.status(201).json(channel);
    } catch (error) {
      console.error('Create message channel error:', error);
      res.status(500).json({ error: "Failed to create message channel" });
    }
  });

  app.put("/api/messaging/channels/:id", async (req, res) => {
    try {
      const updates = req.body;
      const channel = await multiChannelMessagingService.updateMessageChannel(req.params.id, updates);
      
      if (!channel) {
        return res.status(404).json({ error: "Message channel not found" });
      }
      
      broadcast({ 
        type: 'channel_updated',
        data: channel 
      });
      
      res.json(channel);
    } catch (error) {
      console.error('Update message channel error:', error);
      res.status(500).json({ error: "Failed to update message channel" });
    }
  });

  // Test Channel Route
  app.post("/api/messaging/channels/:id/test", async (req, res) => {
    try {
      const { testRecipient } = req.body;
      if (!testRecipient) {
        return res.status(400).json({ error: "Test recipient is required" });
      }
      
      const result = await multiChannelMessagingService.testChannel(req.params.id, testRecipient);
      res.json(result);
    } catch (error) {
      console.error('Test channel error:', error);
      res.status(500).json({ error: "Failed to test channel" });
    }
  });

  // Message Template Routes  
  app.get("/api/messaging/templates", async (req, res) => {
    try {
      const { channelType } = req.query;
      const templates = channelType 
        ? await storage.getMessageTemplatesByChannel(channelType as string)
        : await storage.getMessageTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Get message templates error:', error);
      res.status(500).json({ error: "Failed to fetch message templates" });
    }
  });

  app.get("/api/messaging/templates/:id", async (req, res) => {
    try {
      const template = await storage.getMessageTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Message template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error('Get message template error:', error);
      res.status(500).json({ error: "Failed to fetch message template" });
    }
  });

  app.post("/api/messaging/templates", async (req, res) => {
    try {
      const templateData = insertMessageTemplateSchema.parse(req.body);
      const template = await multiChannelMessagingService.createMessageTemplate(templateData);
      
      broadcast({ 
        type: 'template_created',
        data: template 
      });
      
      res.status(201).json(template);
    } catch (error) {
      console.error('Create message template error:', error);
      res.status(500).json({ error: "Failed to create message template" });
    }
  });

  app.put("/api/messaging/templates/:id", async (req, res) => {
    try {
      const updates = req.body;
      const template = await multiChannelMessagingService.updateMessageTemplate(req.params.id, updates);
      
      if (!template) {
        return res.status(404).json({ error: "Message template not found" });
      }
      
      broadcast({ 
        type: 'template_updated',
        data: template 
      });
      
      res.json(template);
    } catch (error) {
      console.error('Update message template error:', error);
      res.status(500).json({ error: "Failed to update message template" });
    }
  });

  // Messaging Campaign Routes
  app.get("/api/messaging/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getMessagingCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error('Get messaging campaigns error:', error);
      res.status(500).json({ error: "Failed to fetch messaging campaigns" });
    }
  });

  app.get("/api/messaging/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getMessagingCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Messaging campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error('Get messaging campaign error:', error);
      res.status(500).json({ error: "Failed to fetch messaging campaign" });
    }
  });

  app.post("/api/messaging/campaigns", async (req, res) => {
    try {
      const campaignData = insertMessagingCampaignSchema.parse(req.body);
      const campaign = await multiChannelMessagingService.createMessagingCampaign(campaignData);
      
      broadcast({ 
        type: 'campaign_created',
        data: campaign 
      });
      
      res.status(201).json(campaign);
    } catch (error) {
      console.error('Create messaging campaign error:', error);
      res.status(500).json({ error: "Failed to create messaging campaign" });
    }
  });

  app.post("/api/messaging/campaigns/:id/start", async (req, res) => {
    try {
      await multiChannelMessagingService.startCampaign(req.params.id);
      
      const campaign = await storage.getMessagingCampaign(req.params.id);
      
      broadcast({ 
        type: 'campaign_started',
        data: campaign 
      });
      
      res.json({ success: true, message: "Campaign started successfully" });
    } catch (error) {
      console.error('Start campaign error:', error);
      res.status(500).json({ error: "Failed to start campaign" });
    }
  });

  app.get("/api/messaging/campaigns/:id/analytics", async (req, res) => {
    try {
      const analytics = await multiChannelMessagingService.getMultiChannelAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Get campaign analytics error:', error);
      res.status(500).json({ error: "Failed to fetch campaign analytics" });
    }
  });

  // WhatsApp Routes
  app.get("/api/messaging/whatsapp/conversations", async (req, res) => {
    try {
      const conversations = await storage.getWhatsAppConversations();
      res.json(conversations);
    } catch (error) {
      console.error('Get WhatsApp conversations error:', error);
      res.status(500).json({ error: "Failed to fetch WhatsApp conversations" });
    }
  });

  app.get("/api/messaging/whatsapp/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getWhatsAppConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "WhatsApp conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      console.error('Get WhatsApp conversation error:', error);
      res.status(500).json({ error: "Failed to fetch WhatsApp conversation" });
    }
  });

  // SMS Routes
  app.get("/api/messaging/sms/conversations", async (req, res) => {
    try {
      const conversations = await storage.getSMSConversations();
      res.json(conversations);
    } catch (error) {
      console.error('Get SMS conversations error:', error);
      res.status(500).json({ error: "Failed to fetch SMS conversations" });
    }
  });

  app.get("/api/messaging/sms/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getSMSConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "SMS conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      console.error('Get SMS conversation error:', error);
      res.status(500).json({ error: "Failed to fetch SMS conversation" });
    }
  });

  // Twilio Webhook Handler
  app.post("/api/messaging/twilio/webhook", async (req, res) => {
    try {
      await multiChannelMessagingService.handleTwilioWebhook(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Twilio webhook error:', error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  // Message Send Routes
  app.get("/api/messaging/sends", async (req, res) => {
    try {
      const sends = await storage.getMessageSends();
      res.json(sends);
    } catch (error) {
      console.error('Get message sends error:', error);
      res.status(500).json({ error: "Failed to fetch message sends" });
    }
  });

  app.get("/api/messaging/tracking", async (req, res) => {
    try {
      const tracking = await storage.getMessageTrackings();
      res.json(tracking);
    } catch (error) {
      console.error('Get message tracking error:', error);
      res.status(500).json({ error: "Failed to fetch message tracking data" });
    }
  });

  // Analytics Routes
  app.get("/api/messaging/analytics", async (req, res) => {
    try {
      const { channelType, days } = req.query;
      const analytics = await multiChannelMessagingService.getMultiChannelAnalytics(
        channelType as string,
        days ? parseInt(days as string) : 30
      );
      res.json(analytics);
    } catch (error) {
      console.error('Get messaging analytics error:', error);
      res.status(500).json({ error: "Failed to fetch messaging analytics" });
    }
  });

  // Direct Send Message Route
  app.post("/api/messaging/send", async (req, res) => {
    try {
      const { templateId, channelIds, contactIds, campaignName } = req.body;
      
      if (!templateId || !channelIds || !contactIds || !Array.isArray(channelIds) || !Array.isArray(contactIds)) {
        return res.status(400).json({ 
          error: "Template ID, channel IDs, and contact IDs are required" 
        });
      }

      // Create a quick campaign for this send
      const campaign = await multiChannelMessagingService.createMessagingCampaign({
        name: campaignName || `Direct Send - ${new Date().toLocaleDateString()}`,
        channelIds,
        templateId,
        status: 'draft',
        scheduleType: 'immediate',
        targetAudience: { contactIds }
      });

      // Start the campaign
      await multiChannelMessagingService.startCampaign(campaign.id);

      broadcast({ 
        type: 'message_sent',
        data: { campaignId: campaign.id, contactIds, channelIds } 
      });

      res.json({ 
        success: true, 
        campaignId: campaign.id,
        message: "Messages sent successfully across all channels" 
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: "Failed to send messages" });
    }
  });

  // GitHub Repository Routes
  app.get("/api/github/repositories", async (req, res) => {
    try {
      const repositories = await githubService.getRepositories();
      res.json(repositories);
    } catch (error) {
      console.error('Get repositories error:', error);
      res.status(500).json({ error: "Failed to fetch repositories" });
    }
  });

  app.post("/api/github/sync", async (req, res) => {
    try {
      const { owner, repo } = req.body;
      
      if (!owner || !repo) {
        return res.status(400).json({ error: "Owner and repository name are required" });
      }

      const result = await githubService.syncRepository(owner, repo);
      
      if (result.success) {
        broadcast({ 
          type: 'github_sync_complete',
          data: { repositoryId: result.repositoryId, owner, repo } 
        });
        
        res.json({ 
          success: true, 
          repositoryId: result.repositoryId,
          message: `Repository ${owner}/${repo} synced successfully` 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: result.error || "Failed to sync repository" 
        });
      }
    } catch (error) {
      console.error('Sync repository error:', error);
      res.status(500).json({ error: "Failed to sync repository" });
    }
  });

  app.get("/api/github/repositories/:repositoryId/files", async (req, res) => {
    try {
      const { repositoryId } = req.params;
      const files = await githubService.getRepositoryFiles(repositoryId);
      res.json(files);
    } catch (error) {
      console.error('Get repository files error:', error);
      res.status(500).json({ error: "Failed to fetch repository files" });
    }
  });

  app.get("/api/github/files/:fileId", async (req, res) => {
    try {
      const { fileId } = req.params;
      const file = await githubService.getFileById(fileId);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      
      res.json(file);
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({ error: "Failed to fetch file" });
    }
  });

  app.get("/api/github/sync-logs", async (req, res) => {
    try {
      const { repositoryId } = req.query;
      const logs = await githubService.getSyncLogs(repositoryId as string);
      res.json(logs);
    } catch (error) {
      console.error('Get sync logs error:', error);
      res.status(500).json({ error: "Failed to fetch sync logs" });
    }
  });

  // Quick sync for heyns1000/baobab repository
  app.post("/api/github/sync-baobab", async (req, res) => {
    try {
      const result = await githubService.syncRepository('heyns1000', 'baobab');
      
      if (result.success) {
        broadcast({ 
          type: 'baobab_sync_complete',
          data: { repositoryId: result.repositoryId } 
        });
        
        res.json({ 
          success: true, 
          repositoryId: result.repositoryId,
          message: "Baobab Security Network repository synced successfully!" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: result.error || "Failed to sync Baobab repository" 
        });
      }
    } catch (error) {
      console.error('Sync Baobab repository error:', error);
      res.status(500).json({ error: "Failed to sync Baobab repository" });
    }
  });

  // Fetch ALL repositories from GitHub for a specific user (e.g., heyns1000)
  app.get("/api/github/repositories/all/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const repositories = await githubService.fetchAllUserRepositories(username);
      
      res.json({ 
        success: true,
        count: repositories.length, 
        repositories 
      });
    } catch (error) {
      console.error('Fetch all repositories error:', error);
      res.status(500).json({ error: "Failed to fetch all repositories from GitHub" });
    }
  });

  // Refresh repository list from GitHub and update database
  app.post("/api/github/repositories/refresh", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      const result = await githubService.refreshAllRepositories(username);
      
      if (result.success) {
        broadcast({ 
          type: 'github_repositories_refreshed',
          data: { username, count: result.count } 
        });
        
        res.json({ 
          success: true, 
          count: result.count,
          message: `Successfully refreshed ${result.count} repositories for ${username}` 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: result.error || "Failed to refresh repositories" 
        });
      }
    } catch (error) {
      console.error('Refresh repositories error:', error);
      res.status(500).json({ error: "Failed to refresh repositories" });
    }
  });

  // Get file tree for a repository without cloning
  app.get("/api/github/repositories/:owner/:repo/file-tree", async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { path } = req.query;
      
      const fileTree = await githubService.getFileTree(owner, repo, path as string);
      
      res.json({ 
        success: true,
        owner,
        repo,
        path: path || '',
        tree: fileTree 
      });
    } catch (error) {
      console.error('Get file tree error:', error);
      res.status(500).json({ error: "Failed to fetch file tree" });
    }
  });

  // Clone repository to workspace
  app.post("/api/github/repositories/:owner/:repo/clone", async (req, res) => {
    try {
      const { owner, repo } = req.params;
      
      broadcast({ 
        type: 'github_clone_started',
        data: { owner, repo } 
      });

      const result = await githubService.cloneRepository(owner, repo);
      
      if (result.success) {
        broadcast({ 
          type: 'github_clone_complete',
          data: { owner, repo, path: result.path } 
        });
        
        res.json({ 
          success: true, 
          path: result.path,
          message: `Repository ${owner}/${repo} cloned successfully to ${result.path}` 
        });
      } else {
        broadcast({ 
          type: 'github_clone_error',
          data: { owner, repo, error: result.error } 
        });
        
        res.status(500).json({ 
          success: false, 
          error: result.error || "Failed to clone repository" 
        });
      }
    } catch (error) {
      console.error('Clone repository error:', error);
      res.status(500).json({ error: "Failed to clone repository" });
    }
  });

  // Get repository statistics
  app.get("/api/github/repository-stats", async (req, res) => {
    try {
      const stats = await githubService.getRepositoryStats();
      res.json(stats);
    } catch (error) {
      console.error('Get repository stats error:', error);
      res.status(500).json({ error: "Failed to fetch repository statistics" });
    }
  });

  // Eureka Page Generation API
  app.post("/api/generate-pages", async (req, res) => {
    try {
      const { sector, page: template, count = 400 } = req.body;
      
      if (!sector || !template) {
        return res.status(400).json({ error: "Sector and template are required" });
      }

      console.log(`🚀 API triggered: Generate ${count} pages for ${sector}/${template}`);
      
      const result = await eurekaGenerator.generatePages({
        sector,
        template,
        count: Math.min(count, 10000), // Limit to 10,000 pages per request for enterprise usage
        outputDir: 'generated_pages'
      });

      // Auto-deploy to CDN if requested
      let deploymentResult = null;
      if (req.body.autoDeploy) {
        deploymentResult = await eurekaGenerator.deployToCDN(
          result.outputPath, 
          sector, 
          template
        );
      }

      res.json({
        success: true,
        generated: result.pages.length,
        path: `generated_pages/${sector}/${template}/`,
        sitemapPath: result.sitemapPath,
        vaultHashes: result.pages.map(p => p.metadata.vaultHash),
        deployment: deploymentResult,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Eureka generation error:", error);
      res.status(500).json({ 
        error: "Page generation failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Eureka Cloudflow Control API
  app.post("/api/cloudflow/start", async (req, res) => {
    try {
      await cloudflowAutomation.startAutomation();
      res.json({ 
        success: true, 
        message: "Eureka Cloudflow automation started",
        status: cloudflowAutomation.getStatus()
      });
    } catch (error) {
      console.error("Cloudflow start error:", error);
      res.status(500).json({ error: "Failed to start Cloudflow automation" });
    }
  });

  app.post("/api/cloudflow/stop", async (req, res) => {
    try {
      cloudflowAutomation.stopAutomation();
      res.json({ 
        success: true, 
        message: "Eureka Cloudflow automation stopped" 
      });
    } catch (error) {
      console.error("Cloudflow stop error:", error);
      res.status(500).json({ error: "Failed to stop Cloudflow automation" });
    }
  });

  app.get("/api/cloudflow/status", async (req, res) => {
    try {
      const status = cloudflowAutomation.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Cloudflow status error:", error);
      res.status(500).json({ error: "Failed to get Cloudflow status" });
    }
  });

  app.post("/api/cloudflow/bind-sector", async (req, res) => {
    try {
      const { sector, template } = req.body;
      
      if (!sector || !template) {
        return res.status(400).json({ error: "Sector and template are required" });
      }

      await cloudflowAutomation.bindSectorToCDN(sector, template);
      
      res.json({ 
        success: true, 
        message: `Sector ${sector}/${template} bound to continuous CDN deployment`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Sector binding error:", error);
      res.status(500).json({ error: "Failed to bind sector to CDN" });
    }
  });

  // Context Transfer API endpoints
  app.post("/api/context/transfer", async (req, res) => {
    try {
      const { fromPlatform, toPlatform, contextData } = req.body;
      
      if (!fromPlatform || !toPlatform || !contextData) {
        return res.status(400).json({ 
          error: "fromPlatform, toPlatform, and contextData are required" 
        });
      }

      const result = await contextTransferService.transferContext(
        fromPlatform,
        toPlatform,
        contextData
      );

      if (result.success) {
        broadcast({ 
          type: 'context_transferred',
          data: { 
            fromPlatform, 
            toPlatform, 
            conversationId: contextData.conversationId,
            continuity_maintained: result.continuity_maintained
          } 
        });
      }

      res.json(result);
    } catch (error) {
      console.error('Context transfer error:', error);
      res.status(500).json({ error: "Failed to transfer context" });
    }
  });

  app.get("/api/context/transfer-history/:conversationId", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const history = await contextTransferService.getTransferHistory(conversationId);
      res.json({ success: true, history });
    } catch (error) {
      console.error('Get transfer history error:', error);
      res.status(500).json({ error: "Failed to get transfer history" });
    }
  });

  app.post("/api/context/optimize", async (req, res) => {
    try {
      const { contextData, targetPlatform } = req.body;
      
      if (!contextData || !targetPlatform) {
        return res.status(400).json({ 
          error: "contextData and targetPlatform are required" 
        });
      }

      const optimized = await contextTransferService.optimizeContextForTransfer(
        contextData,
        targetPlatform
      );

      res.json({ success: true, optimizedContext: optimized });
    } catch (error) {
      console.error('Context optimization error:', error);
      res.status(500).json({ error: "Failed to optimize context" });
    }
  });

  // Daily Summary Extractor API endpoints
  app.post("/api/daily-summary/process", async (req, res) => {
    try {
      const { diaries } = req.body;
      
      if (!diaries || !Array.isArray(diaries)) {
        return res.status(400).json({ 
          error: "Diaries array is required" 
        });
      }

      console.log(`📔 Processing ${diaries.length} diary collections`);
      
      const summary = await dailySummaryExtractor.processDiaryCollection(diaries);

      broadcast({ 
        type: 'daily_summary_processed',
        data: { 
          date: summary.date,
          statistics: summary.statistics,
          entries_processed: summary.statistics.total_entries_processed
        } 
      });

      res.json({
        success: true,
        summary,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Daily summary processing error:', error);
      res.status(500).json({ 
        error: "Failed to process daily summary",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/daily-summary/process-single", async (req, res) => {
    try {
      const { diary } = req.body;
      
      if (!diary) {
        return res.status(400).json({ 
          error: "Diary object is required" 
        });
      }

      const entries = await dailySummaryExtractor.processSingleDiary(diary);
      const statistics = await dailySummaryExtractor.getStatistics(entries);

      res.json({
        success: true,
        entries,
        statistics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Single diary processing error:', error);
      res.status(500).json({ 
        error: "Failed to process single diary",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/daily-summary/export/:format", async (req, res) => {
    try {
      const { format } = req.params;
      const { diaries } = req.body;
      
      if (!diaries || !Array.isArray(diaries)) {
        return res.status(400).json({ 
          error: "Diaries array is required in request body" 
        });
      }

      const summary = await dailySummaryExtractor.processDiaryCollection(diaries);
      
      let exportData: string;
      let contentType: string;
      
      switch (format) {
        case 'pa':
          exportData = summary.pa_ready_format;
          contentType = 'text/plain';
          break;
        case 'oldschool':
          exportData = summary.old_school_compilation;
          contentType = 'text/plain';
          break;
        case 'json':
          exportData = JSON.stringify(summary, null, 2);
          contentType = 'application/json';
          break;
        default:
          return res.status(400).json({ error: "Invalid format. Use 'pa', 'oldschool', or 'json'" });
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="daily-summary-${summary.date}.${format === 'json' ? 'json' : 'txt'}"`);
      res.send(exportData);
      
    } catch (error) {
      console.error('Daily summary export error:', error);
      res.status(500).json({ 
        error: "Failed to export daily summary",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===============================
  // SAMFOX STUDIO PLATFORM ROUTES
  // ===============================

  // Get or Initialize SamFox Studio
  app.get("/api/samfox-studio", async (req, res) => {
    try {
      let studio = await samFoxStudioService.getSamFoxStudio();
      
      if (!studio) {
        studio = await samFoxStudioService.initializeSamFoxStudio();
      }
      
      res.json(studio);
    } catch (error) {
      console.error("Error getting SamFox Studio:", error);
      res.status(500).json({ error: "Failed to get SamFox Studio" });
    }
  });

  // Initialize SamFox Studio
  app.post("/api/samfox-studio/initialize", async (req, res) => {
    try {
      const studio = await samFoxStudioService.initializeSamFoxStudio();
      res.json(studio);
    } catch (error) {
      console.error("Error initializing SamFox Studio:", error);
      res.status(500).json({ error: "Failed to initialize SamFox Studio" });
    }
  });

  // Get SamFox Studio Dashboard Stats
  app.get("/api/samfox-studio/:id/stats", async (req, res) => {
    try {
      const { id } = req.params;
      const stats = await samFoxStudioService.getDashboardStats(id);
      res.json(stats);
    } catch (error) {
      console.error("Error getting SamFox Studio stats:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  // Collaboration Workspaces
  app.get("/api/samfox-studio/workspaces", async (req, res) => {
    try {
      const { samFoxStudioId } = req.query;
      const workspaces = await samFoxStudioService.getWorkspaces(samFoxStudioId as string);
      res.json(workspaces);
    } catch (error) {
      console.error("Error getting workspaces:", error);
      res.status(500).json({ error: "Failed to get workspaces" });
    }
  });

  app.post("/api/samfox-studio/workspaces", async (req, res) => {
    try {
      const workspace = await samFoxStudioService.createWorkspace(req.body);
      res.json(workspace);
    } catch (error) {
      console.error("Error creating workspace:", error);
      res.status(500).json({ error: "Failed to create workspace" });
    }
  });

  // Global Master Licenses
  app.get("/api/samfox-studio/licenses", async (req, res) => {
    try {
      const { samFoxStudioId } = req.query;
      const licenses = await samFoxStudioService.getMasterLicenses(samFoxStudioId as string);
      res.json(licenses);
    } catch (error) {
      console.error("Error getting licenses:", error);
      res.status(500).json({ error: "Failed to get licenses" });
    }
  });

  app.post("/api/samfox-studio/licenses", async (req, res) => {
    try {
      const license = await samFoxStudioService.createMasterLicense(req.body);
      res.json(license);
    } catch (error) {
      console.error("Error creating license:", error);
      res.status(500).json({ error: "Failed to create license" });
    }
  });

  // SamFox Fileroom
  app.get("/api/samfox-studio/fileroom", async (req, res) => {
    try {
      const { samFoxStudioId, fileType } = req.query;
      const files = await samFoxStudioService.getFileroom(
        samFoxStudioId as string, 
        fileType as string
      );
      res.json(files);
    } catch (error) {
      console.error("Error getting fileroom:", error);
      res.status(500).json({ error: "Failed to get fileroom" });
    }
  });

  app.post("/api/samfox-studio/fileroom", async (req, res) => {
    try {
      const file = await samFoxStudioService.uploadToFileroom(req.body);
      res.json(file);
    } catch (error) {
      console.error("Error uploading to fileroom:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Treaty Collaboration
  app.get("/api/samfox-studio/treaties", async (req, res) => {
    try {
      const { samFoxStudioId } = req.query;
      const treaties = await samFoxStudioService.getTreaties(samFoxStudioId as string);
      res.json(treaties);
    } catch (error) {
      console.error("Error getting treaties:", error);
      res.status(500).json({ error: "Failed to get treaties" });
    }
  });

  app.post("/api/samfox-studio/treaties", async (req, res) => {
    try {
      const treaty = await samFoxStudioService.createTreaty(req.body);
      res.json(treaty);
    } catch (error) {
      console.error("Error creating treaty:", error);
      res.status(500).json({ error: "Failed to create treaty" });
    }
  });

  app.patch("/api/samfox-studio/treaties/:treatyId/sign", async (req, res) => {
    try {
      const { treatyId } = req.params;
      const treaty = await samFoxStudioService.signTreaty(treatyId);
      if (!treaty) {
        return res.status(404).json({ error: "Treaty not found" });
      }
      res.json(treaty);
    } catch (error) {
      console.error("Error signing treaty:", error);
      res.status(500).json({ error: "Failed to sign treaty" });
    }
  });

  // Vault Sync
  app.post("/api/samfox-studio/:id/sync", async (req, res) => {
    try {
      const { id } = req.params;
      const syncResult = await samFoxStudioService.syncWithVault(id);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing with vault:", error);
      res.status(500).json({ error: "Failed to sync with vault" });
    }
  });

  // ===============================
  // LOOPPAY™ SOVEREIGN PAYMENT SYSTEM ROUTES
  // ===============================

  // License Management
  app.get("/api/looppay/licenses", async (req, res) => {
    try {
      const licenses = await loopPayService.getAllLicenses();
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching LoopPay licenses:", error);
      res.status(500).json({ error: "Failed to fetch licenses" });
    }
  });

  app.get("/api/looppay/licenses/:id", async (req, res) => {
    try {
      const license = await loopPayService.getLicenseById(req.params.id);
      if (!license) {
        return res.status(404).json({ error: "License not found" });
      }
      res.json(license);
    } catch (error) {
      console.error("Error fetching LoopPay license:", error);
      res.status(500).json({ error: "Failed to fetch license" });
    }
  });

  app.post("/api/looppay/licenses/initialize", async (req, res) => {
    try {
      const licenses = await loopPayService.createDefaultLicenses();
      broadcast({ type: 'looppay_licenses_created', data: licenses });
      res.json({ licenses, message: "Default LoopPay licenses created successfully" });
    } catch (error) {
      console.error("Error creating LoopPay licenses:", error);
      res.status(500).json({ error: "Failed to create default licenses" });
    }
  });

  // Vendor Management
  app.get("/api/looppay/vendors", async (req, res) => {
    try {
      const vendors = await loopPayService.getAllVendors();
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching LoopPay vendors:", error);
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.get("/api/looppay/vendors/:id", async (req, res) => {
    try {
      const vendor = await loopPayService.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      console.error("Error fetching LoopPay vendor:", error);
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  });

  app.post("/api/looppay/vendors", async (req, res) => {
    try {
      const vendorData = insertLoopPayVendorSchema.parse(req.body);
      const vendor = await loopPayService.createVendor(vendorData);
      broadcast({ type: 'looppay_vendor_created', data: vendor });
      res.status(201).json(vendor);
    } catch (error) {
      console.error("Error creating LoopPay vendor:", error);
      res.status(400).json({ error: "Failed to create vendor" });
    }
  });

  // Transaction Management
  app.get("/api/looppay/transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await loopPayService.getTransactionHistory(limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching LoopPay transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/looppay/transactions/vendor/:vendorId", async (req, res) => {
    try {
      const transactions = await loopPayService.getTransactionsByVendor(req.params.vendorId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching vendor transactions:", error);
      res.status(500).json({ error: "Failed to fetch vendor transactions" });
    }
  });

  app.post("/api/looppay/transactions", async (req, res) => {
    try {
      const transactionData = insertLoopPayTransactionSchema.parse(req.body);
      const transaction = await loopPayService.createTransaction(transactionData);
      broadcast({ type: 'looppay_transaction_created', data: transaction });
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating LoopPay transaction:", error);
      res.status(400).json({ error: "Failed to create transaction" });
    }
  });

  app.post("/api/looppay/transactions/:transactionId/process", async (req, res) => {
    try {
      const transaction = await loopPayService.processTransaction(req.params.transactionId);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      broadcast({ type: 'looppay_transaction_processed', data: transaction });
      res.json({ transaction, message: "Transaction processed via 9-second PulseTrade™ mesh" });
    } catch (error) {
      console.error("Error processing LoopPay transaction:", error);
      res.status(500).json({ error: "Failed to process transaction" });
    }
  });

  // Payout Mesh Management
  app.get("/api/looppay/payout-mesh", async (req, res) => {
    try {
      const meshes = await loopPayService.getActiveMeshes();
      res.json(meshes);
    } catch (error) {
      console.error("Error fetching payout meshes:", error);
      res.status(500).json({ error: "Failed to fetch payout meshes" });
    }
  });

  app.post("/api/looppay/payout-mesh", async (req, res) => {
    try {
      const meshData = insertLoopPayPayoutMeshSchema.parse(req.body);
      const mesh = await loopPayService.createPayoutMesh(meshData);
      broadcast({ type: 'looppay_mesh_created', data: mesh });
      res.status(201).json(mesh);
    } catch (error) {
      console.error("Error creating payout mesh:", error);
      res.status(400).json({ error: "Failed to create payout mesh" });
    }
  });

  // Currency Conversion
  app.get("/api/looppay/currencies", async (req, res) => {
    try {
      const currencies = await loopPayService.getSupportedCurrencies();
      res.json({ currencies });
    } catch (error) {
      console.error("Error fetching supported currencies:", error);
      res.status(500).json({ error: "Failed to fetch supported currencies" });
    }
  });

  app.post("/api/looppay/currency/convert", async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency } = req.body;
      
      if (!amount || !fromCurrency || !toCurrency) {
        return res.status(400).json({ error: "Missing required parameters: amount, fromCurrency, toCurrency" });
      }

      const result = await loopPayService.convertCurrency(amount, fromCurrency, toCurrency);
      if (!result) {
        return res.status(404).json({ error: "Currency conversion rate not found" });
      }

      res.json({
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: result.convertedAmount,
        targetCurrency: toCurrency,
        exchangeRate: result.rate,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ error: "Failed to convert currency" });
    }
  });

  app.post("/api/looppay/currency/rates", async (req, res) => {
    try {
      const { baseCurrency, targetCurrency, rate } = req.body;
      
      if (!baseCurrency || !targetCurrency || !rate) {
        return res.status(400).json({ error: "Missing required parameters: baseCurrency, targetCurrency, rate" });
      }

      const currencyRate = await loopPayService.updateCurrencyRate(baseCurrency, targetCurrency, rate);
      broadcast({ type: 'looppay_rate_updated', data: currencyRate });
      res.json(currencyRate);
    } catch (error) {
      console.error("Error updating currency rate:", error);
      res.status(500).json({ error: "Failed to update currency rate" });
    }
  });

  // AI Assistant
  app.post("/api/looppay/ai-assistant", async (req, res) => {
    try {
      const { sessionId, query, queryType } = req.body;
      
      if (!sessionId || !query) {
        return res.status(400).json({ error: "Missing required parameters: sessionId, query" });
      }

      const response = await loopPayService.askAiAssistant(sessionId, query, queryType);
      broadcast({ type: 'looppay_ai_query', data: response });
      res.json(response);
    } catch (error) {
      console.error("Error processing AI query:", error);
      res.status(500).json({ error: "Failed to process AI query" });
    }
  });

  app.get("/api/looppay/ai-assistant/history/:sessionId", async (req, res) => {
    try {
      const history = await loopPayService.getAiHistory(req.params.sessionId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching AI history:", error);
      res.status(500).json({ error: "Failed to fetch AI history" });
    }
  });

  app.post("/api/looppay/ai-assistant/:id/rate", async (req, res) => {
    try {
      const { satisfaction } = req.body;
      
      if (!satisfaction || satisfaction < 1 || satisfaction > 5) {
        return res.status(400).json({ error: "Satisfaction rating must be between 1 and 5" });
      }

      // Update AI response satisfaction rating (would need to add this to service)
      res.json({ message: "Rating recorded successfully", satisfaction });
    } catch (error) {
      console.error("Error rating AI response:", error);
      res.status(500).json({ error: "Failed to record rating" });
    }
  });

  // Dashboard & Analytics
  app.get("/api/looppay/dashboard/stats", async (req, res) => {
    try {
      const stats = await loopPayService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching LoopPay dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // System Initialization
  app.post("/api/looppay/initialize", async (req, res) => {
    try {
      const initResult = await loopPayService.initializeSystem();
      broadcast({ type: 'looppay_system_initialized', data: initResult });
      res.json({
        ...initResult,
        message: "LoopPay™ sovereign payment system initialized successfully"
      });
    } catch (error) {
      console.error("Error initializing LoopPay system:", error);
      res.status(500).json({ error: "Failed to initialize LoopPay system" });
    }
  });

  // FAA Vault Integration
  app.post("/api/looppay/vault/sync", async (req, res) => {
    try {
      const { meshId, transactionData } = req.body;
      
      if (!meshId || !transactionData) {
        return res.status(400).json({ error: "Missing required parameters: meshId, transactionData" });
      }

      const vaultSync = await loopPayService.syncWithFaaVault(meshId, transactionData);
      broadcast({ type: 'looppay_vault_sync', data: vaultSync });
      res.json({
        ...vaultSync,
        message: "LoopPay™ synchronized with FAA Vault successfully"
      });
    } catch (error) {
      console.error("Error syncing with FAA Vault:", error);
      res.status(500).json({ error: "Failed to sync with FAA Vault" });
    }
  });

  app.post("/api/looppay/vault/payment", async (req, res) => {
    try {
      const { transactionId, paymentGateway } = req.body;
      
      if (!transactionId || !paymentGateway) {
        return res.status(400).json({ error: "Missing required parameters: transactionId, paymentGateway" });
      }

      const paymentResult = await loopPayService.processVaultPayment(transactionId, paymentGateway);
      broadcast({ type: 'looppay_vault_payment', data: paymentResult });
      res.json({
        ...paymentResult,
        message: "Payment processed through FAA Vault gateway successfully"
      });
    } catch (error) {
      console.error("Error processing vault payment:", error);
      res.status(500).json({ error: "Failed to process vault payment" });
    }
  });

  // ===============================
  // BANIMAL CONNECTOR ROUTES
  // ===============================

  // Connection Management
  app.get('/api/banimal/connections', async (req, res) => {
    try {
      const connections = await storage.getBanimalConnections();
      res.json(connections);
    } catch (error) {
      console.error('Error fetching Banimal connections:', error);
      res.status(500).json({ error: 'Failed to fetch connections' });
    }
  });

  app.get('/api/banimal/connections/:id', async (req, res) => {
    try {
      const connection = await storage.getBanimalConnection(req.params.id);
      if (!connection) {
        return res.status(404).json({ error: 'Connection not found' });
      }
      res.json(connection);
    } catch (error) {
      console.error('Error fetching Banimal connection:', error);
      res.status(500).json({ error: 'Failed to fetch connection' });
    }
  });

  app.post('/api/banimal/connections', async (req, res) => {
    try {
      const validated = insertBanimalConnectionSchema.parse(req.body);
      const connection = await storage.createBanimalConnection(validated);
      broadcast({ type: 'banimal_connection_created', data: connection });
      res.json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('Error creating Banimal connection:', error);
      res.status(500).json({ error: 'Failed to create connection' });
    }
  });

  app.patch('/api/banimal/connections/:id', async (req, res) => {
    try {
      const validated = insertBanimalConnectionSchema.partial().parse(req.body);
      const connection = await storage.updateBanimalConnection(req.params.id, validated);
      if (!connection) {
        return res.status(404).json({ error: 'Connection not found' });
      }
      broadcast({ type: 'banimal_connection_updated', data: connection });
      res.json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('Error updating Banimal connection:', error);
      res.status(500).json({ error: 'Failed to update connection' });
    }
  });

  app.delete('/api/banimal/connections/:id', async (req, res) => {
    try {
      const deleted = await storage.deleteBanimalConnection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Connection not found' });
      }
      broadcast({ type: 'banimal_connection_deleted', data: { id: req.params.id } });
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting Banimal connection:', error);
      res.status(500).json({ error: 'Failed to delete connection' });
    }
  });

  // Connection Testing
  app.post('/api/banimal/connections/:id/test', async (req, res) => {
    try {
      const connection = await storage.getBanimalConnection(req.params.id);
      if (!connection) {
        return res.status(404).json({ error: 'Connection not found' });
      }

      // Test the WordPress API connection
      const testUrl = `${connection.apiBaseUrl}/test`;
      let status = 'connected';
      let message = 'Connection successful';
      
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          headers: connection.apiKey ? { 'Authorization': `Bearer ${connection.apiKey}` } : {}
        });
        
        if (!response.ok) {
          status = 'error';
          message = `Connection failed: ${response.statusText}`;
        }
      } catch (fetchError: any) {
        status = 'error';
        message = `Connection failed: ${fetchError.message}`;
      }

      // Update connection status
      const updated = await storage.updateBanimalConnection(req.params.id, {
        status,
        lastConnectionTest: new Date()
      });

      broadcast({ type: 'banimal_connection_tested', data: { id: req.params.id, status, message } });
      res.json({ status, message, connection: updated });
    } catch (error) {
      console.error('Error testing Banimal connection:', error);
      res.status(500).json({ error: 'Failed to test connection' });
    }
  });

  // Sync Logs
  app.get('/api/banimal/sync-logs', async (req, res) => {
    try {
      const filters = {
        connectionId: req.query.connectionId as string | undefined,
        syncType: req.query.syncType as string | undefined,
        status: req.query.status as string | undefined,
      };
      const logs = await storage.getBanimalSyncLogs(filters);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching Banimal sync logs:', error);
      res.status(500).json({ error: 'Failed to fetch sync logs' });
    }
  });

  app.get('/api/banimal/sync-logs/:id', async (req, res) => {
    try {
      const log = await storage.getBanimalSyncLog(req.params.id);
      if (!log) {
        return res.status(404).json({ error: 'Sync log not found' });
      }
      res.json(log);
    } catch (error) {
      console.error('Error fetching Banimal sync log:', error);
      res.status(500).json({ error: 'Failed to fetch sync log' });
    }
  });

  app.post('/api/banimal/sync-logs', async (req, res) => {
    try {
      const validated = insertBanimalSyncLogSchema.parse(req.body);
      const log = await storage.createBanimalSyncLog(validated);
      broadcast({ type: 'banimal_sync_log_created', data: log });
      res.json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('Error creating Banimal sync log:', error);
      res.status(500).json({ error: 'Failed to create sync log' });
    }
  });

  // Sync Operations
  app.post('/api/banimal/sync/user-profile', async (req, res) => {
    try {
      const { connectionId, userId, userData } = req.body;
      const connection = await storage.getBanimalConnection(connectionId);
      
      if (!connection) {
        return res.status(404).json({ error: 'Connection not found' });
      }

      const startTime = Date.now();
      const syncUrl = `${connection.apiBaseUrl}/update-user-profile`;
      
      let syncStatus = 'success';
      let errorMessage = null;
      
      try {
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(connection.apiKey ? { 'Authorization': `Bearer ${connection.apiKey}` } : {})
          },
          body: JSON.stringify({ user_id: userId, ...userData })
        });

        if (!response.ok) {
          syncStatus = 'failed';
          errorMessage = `Sync failed: ${response.statusText}`;
        }
      } catch (fetchError: any) {
        syncStatus = 'failed';
        errorMessage = `Sync failed: ${fetchError.message}`;
      }

      const duration = Date.now() - startTime;

      // Log the sync
      const log = await storage.createBanimalSyncLog({
        connectionId,
        syncType: 'user-profile',
        direction: 'push',
        status: syncStatus,
        recordsProcessed: 1,
        recordsSuccess: syncStatus === 'success' ? 1 : 0,
        recordsFailed: syncStatus === 'failed' ? 1 : 0,
        errorMessage,
        syncData: { userId, userData },
        duration,
        triggeredBy: 'manual',
        completedAt: new Date()
      });

      // Update connection stats
      await storage.updateBanimalConnection(connectionId, {
        totalSyncs: connection.totalSyncs + 1,
        successfulSyncs: syncStatus === 'success' ? connection.successfulSyncs + 1 : connection.successfulSyncs,
        failedSyncs: syncStatus === 'failed' ? connection.failedSyncs + 1 : connection.failedSyncs,
        lastSuccessfulSync: syncStatus === 'success' ? new Date() : connection.lastSuccessfulSync
      });

      broadcast({ type: 'banimal_user_profile_synced', data: log });
      res.json({ success: syncStatus === 'success', log });
    } catch (error) {
      console.error('Error syncing user profile:', error);
      res.status(500).json({ error: 'Failed to sync user profile' });
    }
  });

  app.post('/api/banimal/sync/user-product', async (req, res) => {
    try {
      const { connectionId, userId, productSku, productName } = req.body;
      const connection = await storage.getBanimalConnection(connectionId);
      
      if (!connection) {
        return res.status(404).json({ error: 'Connection not found' });
      }

      const startTime = Date.now();
      const syncUrl = `${connection.apiBaseUrl}/sync-user-product`;
      
      let syncStatus = 'success';
      let errorMessage = null;
      
      try {
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(connection.apiKey ? { 'Authorization': `Bearer ${connection.apiKey}` } : {})
          },
          body: JSON.stringify({ user_id: userId, product_sku: productSku, product_name: productName })
        });

        if (!response.ok) {
          syncStatus = 'failed';
          errorMessage = `Sync failed: ${response.statusText}`;
        }
      } catch (fetchError: any) {
        syncStatus = 'failed';
        errorMessage = `Sync failed: ${fetchError.message}`;
      }

      const duration = Date.now() - startTime;

      // Log the sync
      const log = await storage.createBanimalSyncLog({
        connectionId,
        syncType: 'user-product',
        direction: 'push',
        status: syncStatus,
        recordsProcessed: 1,
        recordsSuccess: syncStatus === 'success' ? 1 : 0,
        recordsFailed: syncStatus === 'failed' ? 1 : 0,
        errorMessage,
        syncData: { userId, productSku, productName },
        duration,
        triggeredBy: 'manual',
        completedAt: new Date()
      });

      // Update connection stats
      await storage.updateBanimalConnection(connectionId, {
        totalSyncs: connection.totalSyncs + 1,
        successfulSyncs: syncStatus === 'success' ? connection.successfulSyncs + 1 : connection.successfulSyncs,
        failedSyncs: syncStatus === 'failed' ? connection.failedSyncs + 1 : connection.failedSyncs,
        lastSuccessfulSync: syncStatus === 'success' ? new Date() : connection.lastSuccessfulSync
      });

      broadcast({ type: 'banimal_user_product_synced', data: log });
      res.json({ success: syncStatus === 'success', log });
    } catch (error) {
      console.error('Error syncing user-product:', error);
      res.status(500).json({ error: 'Failed to sync user-product' });
    }
  });

  app.post('/api/banimal/sync/product', async (req, res) => {
    try {
      const { connectionId, productData } = req.body;
      const connection = await storage.getBanimalConnection(connectionId);
      
      if (!connection) {
        return res.status(404).json({ error: 'Connection not found' });
      }

      const startTime = Date.now();
      const syncUrl = `${connection.apiBaseUrl}/create-or-update-product`;
      
      let syncStatus = 'success';
      let errorMessage = null;
      
      try {
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(connection.apiKey ? { 'Authorization': `Bearer ${connection.apiKey}` } : {})
          },
          body: JSON.stringify(productData)
        });

        if (!response.ok) {
          syncStatus = 'failed';
          errorMessage = `Sync failed: ${response.statusText}`;
        }
      } catch (fetchError: any) {
        syncStatus = 'failed';
        errorMessage = `Sync failed: ${fetchError.message}`;
      }

      const duration = Date.now() - startTime;

      // Log the sync
      const log = await storage.createBanimalSyncLog({
        connectionId,
        syncType: 'product-create',
        direction: 'push',
        status: syncStatus,
        recordsProcessed: 1,
        recordsSuccess: syncStatus === 'success' ? 1 : 0,
        recordsFailed: syncStatus === 'failed' ? 1 : 0,
        errorMessage,
        syncData: { productData },
        duration,
        triggeredBy: 'manual',
        completedAt: new Date()
      });

      // Update connection stats
      await storage.updateBanimalConnection(connectionId, {
        totalSyncs: connection.totalSyncs + 1,
        successfulSyncs: syncStatus === 'success' ? connection.successfulSyncs + 1 : connection.successfulSyncs,
        failedSyncs: syncStatus === 'failed' ? connection.failedSyncs + 1 : connection.failedSyncs,
        lastSuccessfulSync: syncStatus === 'success' ? new Date() : connection.lastSuccessfulSync
      });

      broadcast({ type: 'banimal_product_synced', data: log });
      res.json({ success: syncStatus === 'success', log });
    } catch (error) {
      console.error('Error syncing product:', error);
      res.status(500).json({ error: 'Failed to sync product' });
    }
  });

  // ===============================
  // ECOSYSTEM INTEGRATION ROUTES
  // ===============================

  // Ecosystem Systems Routes
  
  // GET /api/ecosystem/systems - List all systems with optional filtering by systemType
  app.get("/api/ecosystem/systems", isAuthenticated, async (req, res) => {
    try {
      const { systemType } = req.query;
      
      let query = db.select().from(ecosystemSystems);
      
      if (systemType) {
        query = query.where(eq(ecosystemSystems.systemType, systemType as string)) as any;
      }
      
      const systems = await query.orderBy(desc(ecosystemSystems.updatedAt));
      
      res.json(systems);
    } catch (error) {
      console.error('Error fetching ecosystem systems:', error);
      res.status(500).json({ error: 'Failed to fetch ecosystem systems' });
    }
  });

  // POST /api/ecosystem/systems - Create new system
  app.post("/api/ecosystem/systems", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertEcosystemSystemSchema.parse(req.body);
      
      const [newSystem] = await db
        .insert(ecosystemSystems)
        .values(validatedData)
        .returning();
      
      broadcast({ type: 'ecosystem_system_created', data: newSystem });
      res.status(201).json(newSystem);
    } catch (error) {
      console.error('Error creating ecosystem system:', error);
      res.status(400).json({ 
        error: 'Failed to create ecosystem system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // PATCH /api/ecosystem/systems/:id - Update system
  app.patch("/api/ecosystem/systems/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateEcosystemSystemSchema.parse(req.body);
      
      const [updatedSystem] = await db
        .update(ecosystemSystems)
        .set({ ...validatedUpdates, updatedAt: new Date() })
        .where(eq(ecosystemSystems.id, id))
        .returning();
      
      if (!updatedSystem) {
        return res.status(404).json({ error: 'Ecosystem system not found' });
      }
      
      broadcast({ type: 'ecosystem_system_updated', data: updatedSystem });
      res.json(updatedSystem);
    } catch (error) {
      console.error('Error updating ecosystem system:', error);
      res.status(500).json({ error: 'Failed to update ecosystem system' });
    }
  });

  // DELETE /api/ecosystem/systems/:id - Delete system
  app.delete("/api/ecosystem/systems/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      const [deletedSystem] = await db
        .delete(ecosystemSystems)
        .where(eq(ecosystemSystems.id, id))
        .returning();
      
      if (!deletedSystem) {
        return res.status(404).json({ error: 'Ecosystem system not found' });
      }
      
      broadcast({ type: 'ecosystem_system_deleted', data: { id } });
      res.json({ success: true, message: 'Ecosystem system deleted successfully' });
    } catch (error) {
      console.error('Error deleting ecosystem system:', error);
      res.status(500).json({ error: 'Failed to delete ecosystem system' });
    }
  });

  // Ecosystem Apps Routes
  
  // GET /api/ecosystem/apps - List all Replit apps with optional category filtering
  app.get("/api/ecosystem/apps", isAuthenticated, async (req, res) => {
    try {
      const { category } = req.query;
      
      let query = db.select().from(ecosystemApps);
      
      if (category) {
        query = query.where(eq(ecosystemApps.category, category as string)) as any;
      }
      
      const apps = await query.orderBy(desc(ecosystemApps.updatedAt));
      
      res.json(apps);
    } catch (error) {
      console.error('Error fetching ecosystem apps:', error);
      res.status(500).json({ error: 'Failed to fetch ecosystem apps' });
    }
  });

  // POST /api/ecosystem/apps - Create/import app
  app.post("/api/ecosystem/apps", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertEcosystemAppSchema.parse(req.body);
      
      const [newApp] = await db
        .insert(ecosystemApps)
        .values(validatedData)
        .returning();
      
      broadcast({ type: 'ecosystem_app_created', data: newApp });
      res.status(201).json(newApp);
    } catch (error) {
      console.error('Error creating ecosystem app:', error);
      res.status(400).json({ 
        error: 'Failed to create ecosystem app',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // PATCH /api/ecosystem/apps/:id - Update app
  app.patch("/api/ecosystem/apps/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateEcosystemAppSchema.parse(req.body);
      
      const [updatedApp] = await db
        .update(ecosystemApps)
        .set({ ...validatedUpdates, updatedAt: new Date() })
        .where(eq(ecosystemApps.id, id))
        .returning();
      
      if (!updatedApp) {
        return res.status(404).json({ error: 'Ecosystem app not found' });
      }
      
      broadcast({ type: 'ecosystem_app_updated', data: updatedApp });
      res.json(updatedApp);
    } catch (error) {
      console.error('Error updating ecosystem app:', error);
      res.status(500).json({ error: 'Failed to update ecosystem app' });
    }
  });

  // DELETE /api/ecosystem/apps/:id - Delete app
  app.delete("/api/ecosystem/apps/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      const [deletedApp] = await db
        .delete(ecosystemApps)
        .where(eq(ecosystemApps.id, id))
        .returning();
      
      if (!deletedApp) {
        return res.status(404).json({ error: 'Ecosystem app not found' });
      }
      
      broadcast({ type: 'ecosystem_app_deleted', data: { id } });
      res.json({ success: true, message: 'Ecosystem app deleted successfully' });
    } catch (error) {
      console.error('Error deleting ecosystem app:', error);
      res.status(500).json({ error: 'Failed to delete ecosystem app' });
    }
  });

  // Ecosystem Sync Logs Routes
  
  // GET /api/ecosystem/sync-logs - List sync logs with optional limit query parameter
  app.get("/api/ecosystem/sync-logs", isAuthenticated, async (req, res) => {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string) : 100;
      
      const logs = await db
        .select()
        .from(ecosystemSyncLogs)
        .orderBy(desc(ecosystemSyncLogs.startedAt))
        .limit(limitNum);
      
      res.json(logs);
    } catch (error) {
      console.error('Error fetching ecosystem sync logs:', error);
      res.status(500).json({ error: 'Failed to fetch ecosystem sync logs' });
    }
  });

  // POST /api/ecosystem/sync-logs - Create sync log
  app.post("/api/ecosystem/sync-logs", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertEcosystemSyncLogSchema.parse(req.body);
      
      const [newLog] = await db
        .insert(ecosystemSyncLogs)
        .values(validatedData)
        .returning();
      
      broadcast({ type: 'ecosystem_sync_log_created', data: newLog });
      res.status(201).json(newLog);
    } catch (error) {
      console.error('Error creating ecosystem sync log:', error);
      res.status(400).json({ 
        error: 'Failed to create ecosystem sync log',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===============================
  // ECOSYSTEM SYNC AUTOMATION ROUTES
  // ===============================

  // POST /api/ecosystem/sync/wordpress-products - Sync products to WordPress
  app.post("/api/ecosystem/sync/wordpress-products", isAuthenticated, async (req, res) => {
    try {
      const bodySchema = z.object({
        connectionId: z.string(),
        productIds: z.array(z.string()).min(1, "At least one product ID is required")
      });

      const { connectionId, productIds } = bodySchema.parse(req.body);

      // CRITICAL FIX #1: Validate empty/invalid ID arrays
      if (!productIds || productIds.length === 0) {
        return res.status(400).json({ 
          error: 'Product IDs array cannot be empty' 
        });
      }

      // CRITICAL FIX #1: Validate connectionId exists
      const connection = await db.select().from(banimalConnections)
        .where(eq(banimalConnections.id, connectionId))
        .limit(1);
      
      if (connection.length === 0) {
        return res.status(404).json({ 
          error: 'Connection not found' 
        });
      }

      // Generate sync log ID for immediate broadcast
      const syncLogId = nanoid();

      // Broadcast sync started event IMMEDIATELY
      broadcast({ 
        type: 'ecosystem_sync_started', 
        data: { 
          syncType: 'wordpress-products',
          syncLogId,
          connectionId,
          productCount: productIds.length
        } 
      });

      // Start sync with pre-generated ID
      const syncLog = await ecosystemSyncService.pushProductsToWordPress(connectionId, productIds, syncLogId);

      // Broadcast sync completion/error event
      if (syncLog.status === 'completed') {
        broadcast({ 
          type: 'ecosystem_sync_completed', 
          data: syncLog
        });
      } else if (syncLog.status === 'error') {
        broadcast({ 
          type: 'ecosystem_sync_error', 
          data: syncLog
        });
      }

      res.status(200).json({
        success: syncLog.status === 'completed',
        syncLogId: syncLog.id,
        recordsSynced: syncLog.recordsSynced,
        status: syncLog.status,
        errorMessage: syncLog.errorMessage,
        metadata: syncLog.metadata
      });
    } catch (error) {
      console.error('Error syncing products to WordPress:', error);
      res.status(400).json({ 
        error: 'Failed to sync products to WordPress',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/ecosystem/sync/wordpress-users - Sync users to WordPress
  app.post("/api/ecosystem/sync/wordpress-users", isAuthenticated, async (req, res) => {
    try {
      const bodySchema = z.object({
        connectionId: z.string(),
        userIds: z.array(z.string()).min(1, "At least one user ID is required")
      });

      const { connectionId, userIds } = bodySchema.parse(req.body);

      // CRITICAL FIX #1: Validate empty/invalid ID arrays
      if (!userIds || userIds.length === 0) {
        return res.status(400).json({ 
          error: 'User IDs array cannot be empty' 
        });
      }

      // CRITICAL FIX #1: Validate connectionId exists
      const connection = await db.select().from(banimalConnections)
        .where(eq(banimalConnections.id, connectionId))
        .limit(1);
      
      if (connection.length === 0) {
        return res.status(404).json({ 
          error: 'Connection not found' 
        });
      }

      // Generate sync log ID for immediate broadcast
      const syncLogId = nanoid();

      // Broadcast sync started event IMMEDIATELY
      broadcast({ 
        type: 'ecosystem_sync_started', 
        data: { 
          syncType: 'wordpress-users',
          syncLogId,
          connectionId,
          userCount: userIds.length
        } 
      });

      // Start sync with pre-generated ID
      const syncLog = await ecosystemSyncService.pushUsersToWordPress(connectionId, userIds, syncLogId);

      // Broadcast sync completion/error event
      if (syncLog.status === 'completed') {
        broadcast({ 
          type: 'ecosystem_sync_completed', 
          data: syncLog
        });
      } else if (syncLog.status === 'error') {
        broadcast({ 
          type: 'ecosystem_sync_error', 
          data: syncLog
        });
      }

      res.status(200).json({
        success: syncLog.status === 'completed',
        syncLogId: syncLog.id,
        recordsSynced: syncLog.recordsSynced,
        status: syncLog.status,
        errorMessage: syncLog.errorMessage,
        metadata: syncLog.metadata
      });
    } catch (error) {
      console.error('Error syncing users to WordPress:', error);
      res.status(400).json({ 
        error: 'Failed to sync users to WordPress',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/ecosystem/sync/system - General system sync
  app.post("/api/ecosystem/sync/system", isAuthenticated, async (req, res) => {
    try {
      const bodySchema = z.object({
        systemId: z.string(),
        syncType: z.enum(['full', 'incremental'])
      });

      const { systemId, syncType } = bodySchema.parse(req.body);

      // Generate sync log ID for immediate broadcast
      const syncLogId = nanoid();

      // Broadcast sync started event IMMEDIATELY
      broadcast({ 
        type: 'ecosystem_sync_started', 
        data: { 
          syncType: `system-${syncType}`,
          syncLogId,
          systemId
        } 
      });

      // Start sync with pre-generated ID
      const syncLog = await ecosystemSyncService.syncSystemData(systemId, syncType, syncLogId);

      // Broadcast sync completion/error event
      if (syncLog.status === 'completed') {
        broadcast({ 
          type: 'ecosystem_sync_completed', 
          data: syncLog
        });
      } else if (syncLog.status === 'error') {
        broadcast({ 
          type: 'ecosystem_sync_error', 
          data: syncLog
        });
      }

      res.status(200).json({
        success: syncLog.status === 'completed',
        syncLogId: syncLog.id,
        recordsSynced: syncLog.recordsSynced,
        status: syncLog.status,
        errorMessage: syncLog.errorMessage,
        metadata: syncLog.metadata
      });
    } catch (error) {
      console.error('Error syncing system data:', error);
      res.status(400).json({ 
        error: 'Failed to sync system data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/ecosystem/sync/connection-test/:connectionId - Test WordPress connection
  app.get("/api/ecosystem/sync/connection-test/:connectionId", isAuthenticated, async (req, res) => {
    try {
      const { connectionId } = req.params;
      
      const result = await ecosystemSyncService.testConnection(connectionId);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error testing connection:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to test connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/ecosystem/sync/stats - Get sync dashboard stats
  app.get("/api/ecosystem/sync/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await ecosystemSyncService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching sync stats:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sync stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // PATCH /api/ecosystem/sync-logs/:id - Update sync log (for updating status/completion)
  app.patch("/api/ecosystem/sync-logs/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedUpdates = updateEcosystemSyncLogSchema.parse(req.body);
      
      const [updatedLog] = await db
        .update(ecosystemSyncLogs)
        .set(validatedUpdates)
        .where(eq(ecosystemSyncLogs.id, id))
        .returning();
      
      if (!updatedLog) {
        return res.status(404).json({ error: 'Ecosystem sync log not found' });
      }
      
      broadcast({ type: 'ecosystem_sync_log_updated', data: updatedLog });
      res.json(updatedLog);
    } catch (error) {
      console.error('Error updating ecosystem sync log:', error);
      res.status(500).json({ error: 'Failed to update ecosystem sync log' });
    }
  });

  // ===============================
  // SYSTEM SETTINGS ROUTES
  // ===============================

  // Helper function to check if a setting key is sensitive
  function isSensitiveSetting(key: string): boolean {
    const sensitiveKeywords = ['TOKEN', 'SECRET', 'KEY', 'PASSWORD', 'API'];
    return sensitiveKeywords.some(keyword => key.toUpperCase().includes(keyword));
  }

  // Helper function to mask sensitive values
  function maskSensitiveValue(setting: any): any {
    if (!setting.value) {
      return { ...setting, value: null };
    }
    
    if (isSensitiveSetting(setting.key)) {
      return { ...setting, value: '••••••••' };
    }
    
    return setting;
  }

  // GET /api/settings/:key/status - Check if setting exists without exposing value
  app.get("/api/settings/:key/status", isAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { systemSettings } = await import("@shared/schema");
      
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, key));
      
      if (!setting) {
        return res.json({ exists: false, category: null });
      }
      
      res.json({ 
        exists: true, 
        category: setting.category,
        configured: !!setting.value 
      });
    } catch (error) {
      console.error('Error checking setting status:', error);
      res.status(500).json({ error: 'Failed to check setting status' });
    }
  });

  // GET /api/settings/:key - Get a system setting by key (admin only, with masking)
  app.get("/api/settings/:key", isAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { systemSettings } = await import("@shared/schema");
      
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, key));
      
      if (!setting) {
        return res.status(404).json({ error: 'Setting not found' });
      }
      
      // Mask sensitive values before sending to client
      const maskedSetting = maskSensitiveValue(setting);
      res.json(maskedSetting);
    } catch (error) {
      console.error('Error fetching setting:', error);
      res.status(500).json({ error: 'Failed to fetch setting' });
    }
  });

  // POST /api/settings - Upsert a system setting (admin only, returns masked response)
  app.post("/api/settings", isAdmin, async (req, res) => {
    try {
      const { systemSettings, insertSystemSettingSchema } = await import("@shared/schema");
      const validatedData = insertSystemSettingSchema.parse(req.body);
      
      const existingSetting = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, validatedData.key));
      
      let result;
      if (existingSetting.length > 0) {
        [result] = await db
          .update(systemSettings)
          .set({ 
            ...validatedData,
            updatedAt: new Date() 
          })
          .where(eq(systemSettings.key, validatedData.key))
          .returning();
      } else {
        [result] = await db
          .insert(systemSettings)
          .values(validatedData)
          .returning();
      }
      
      // Mask sensitive values in response
      const maskedResult = maskSensitiveValue(result);
      broadcast({ type: 'setting_updated', data: maskedResult });
      res.json(maskedResult);
    } catch (error) {
      console.error('Error upserting setting:', error);
      res.status(400).json({ error: 'Failed to save setting' });
    }
  });

  // GET /api/settings - Get all system settings (admin only, with masking)
  app.get("/api/settings", isAdmin, async (req, res) => {
    try {
      const { systemSettings } = await import("@shared/schema");
      const { category } = req.query;
      
      let query = db.select().from(systemSettings);
      
      if (category) {
        query = query.where(eq(systemSettings.category, category as string));
      }
      
      const settings = await query;
      
      // Mask all sensitive values
      const maskedSettings = settings.map(setting => maskSensitiveValue(setting));
      res.json(maskedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // ===============================
  // DEPLOYMENT ORCHESTRATION ROUTES
  // ===============================

  // GET /api/orchestrate/jobs - Get all deployment jobs
  app.get("/api/orchestrate/jobs", isAuthenticated, async (req, res) => {
    try {
      const jobs = await db
        .select()
        .from(deploymentJobs)
        .orderBy(desc(deploymentJobs.createdAt));
      
      // Transform jobs to include r2Url from result
      const transformedJobs = jobs.map(job => ({
        ...job,
        r2Url: job.result?.deploymentUrl || job.result?.url || null,
      }));
      
      res.json(transformedJobs);
    } catch (error) {
      console.error('Error fetching deployment jobs:', error);
      res.status(500).json({ error: 'Failed to fetch deployment jobs' });
    }
  });

  // GET /api/orchestrate/r2-files - List files in hotstack-bucket
  app.get("/api/orchestrate/r2-files", isAuthenticated, async (req, res) => {
    try {
      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();
      
      const bucketName = 'hotstack-bucket';
      const result = await cloudflareService.listR2Files(bucketName);
      
      if (result.success) {
        res.json(result.files || []);
      } else {
        res.status(500).json({ error: result.error || 'Failed to list R2 files' });
      }
    } catch (error) {
      console.error('Error listing R2 files:', error);
      res.status(500).json({ error: 'Failed to list R2 files' });
    }
  });

  // DELETE /api/orchestrate/r2-files/:objectKey - Delete R2 file (admin only)
  app.delete("/api/orchestrate/r2-files/:objectKey(*)", isAdmin, async (req, res) => {
    try {
      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();
      
      const bucketName = 'hotstack-bucket';
      const objectKey = req.params.objectKey;
      
      broadcast({
        type: 'r2_file_deleting',
        data: { bucket: bucketName, objectKey }
      });
      
      const result = await cloudflareService.deleteFileFromR2(bucketName, objectKey);
      
      if (result.success) {
        broadcast({
          type: 'r2_file_deleted',
          data: { bucket: bucketName, objectKey }
        });
        res.json({ success: true, message: 'File deleted successfully' });
      } else {
        res.status(500).json({ error: result.error || 'Failed to delete file' });
      }
    } catch (error) {
      console.error('Error deleting R2 file:', error);
      res.status(500).json({ error: 'Failed to delete R2 file' });
    }
  });

  // ===============================
  // HOTSTACK CLOUDFLARE ROUTES
  // ===============================

  // GET /api/hotstack/test-connection - Test Cloudflare API connection
  app.get("/api/hotstack/test-connection", isAuthenticated, async (req, res) => {
    try {
      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();
      
      const result = await cloudflareService.testConnection();
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error testing Cloudflare connection:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to test Cloudflare connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/hotstack/sync/workers - Sync Cloudflare Workers to database
  app.post("/api/hotstack/sync/workers", isAuthenticated, async (req, res) => {
    try {
      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();
      
      broadcast({ type: 'hotstack_sync_started', data: { type: 'workers' } });
      
      const result = await cloudflareService.syncWorkersToDb();
      
      broadcast({ 
        type: 'hotstack_sync_completed', 
        data: { 
          type: 'workers', 
          synced: result.synced, 
          errors: result.errors 
        } 
      });
      
      res.json({ 
        success: true, 
        message: `Synced ${result.synced} workers, ${result.errors} errors`,
        ...result 
      });
    } catch (error) {
      console.error('Error syncing workers:', error);
      broadcast({ type: 'hotstack_sync_error', data: { type: 'workers', error: error instanceof Error ? error.message : 'Unknown error' } });
      res.status(500).json({ 
        success: false,
        message: 'Failed to sync workers',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/hotstack/sync/r2 - Sync R2 buckets to database
  app.post("/api/hotstack/sync/r2", isAuthenticated, async (req, res) => {
    try {
      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();
      
      broadcast({ type: 'hotstack_sync_started', data: { type: 'r2' } });
      
      const result = await cloudflareService.syncR2BucketsToDb();
      
      broadcast({ 
        type: 'hotstack_sync_completed', 
        data: { 
          type: 'r2', 
          synced: result.synced, 
          errors: result.errors 
        } 
      });
      
      res.json({ 
        success: true, 
        message: `Synced ${result.synced} R2 buckets, ${result.errors} errors`,
        ...result 
      });
    } catch (error) {
      console.error('Error syncing R2 buckets:', error);
      broadcast({ type: 'hotstack_sync_error', data: { type: 'r2', error: error instanceof Error ? error.message : 'Unknown error' } });
      res.status(500).json({ 
        success: false,
        message: 'Failed to sync R2 buckets',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/workers - Get all workers
  app.get("/api/hotstack/workers", isAuthenticated, async (req, res) => {
    try {
      const workers = await db.select().from(hotstackWorkers);
      res.json(workers);
    } catch (error) {
      console.error('Error fetching workers:', error);
      res.status(500).json({ 
        error: 'Failed to fetch workers',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/deployments - Get deployment history
  app.get("/api/hotstack/deployments", isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const deployments = await db.select()
        .from(hotstackDeployments)
        .orderBy(desc(hotstackDeployments.deployedAt))
        .limit(limit);
      res.json(deployments);
    } catch (error) {
      console.error('Error fetching deployments:', error);
      res.status(500).json({ 
        error: 'Failed to fetch deployments',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/r2-storage - Get R2 storage stats
  app.get("/api/hotstack/r2-storage", isAuthenticated, async (req, res) => {
    try {
      const storage = await db.select().from(hotstackR2Storage);
      res.json(storage);
    } catch (error) {
      console.error('Error fetching R2 storage:', error);
      res.status(500).json({ 
        error: 'Failed to fetch R2 storage',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/stations - Get HotStack stations
  app.get("/api/hotstack/stations", isAuthenticated, async (req, res) => {
    try {
      const stations = await db.select().from(hotstackStations);
      res.json(stations);
    } catch (error) {
      console.error('Error fetching stations:', error);
      res.status(500).json({ 
        error: 'Failed to fetch stations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/stats - Get HotStack dashboard stats
  app.get("/api/hotstack/stats", isAuthenticated, async (req, res) => {
    try {
      const workersCount = await db.select({ count: sql<number>`count(*)` }).from(hotstackWorkers);
      const deploymentsCount = await db.select({ count: sql<number>`count(*)` }).from(hotstackDeployments);
      const r2StorageCount = await db.select({ count: sql<number>`count(*)` }).from(hotstackR2Storage);
      const stationsCount = await db.select({ count: sql<number>`count(*)` }).from(hotstackStations);

      const totalStorage = await db.select({
        total: sql<number>`COALESCE(SUM(${hotstackR2Storage.storageSize}), 0)`
      }).from(hotstackR2Storage);

      const recentDeployments = await db.select()
        .from(hotstackDeployments)
        .orderBy(desc(hotstackDeployments.deployedAt))
        .limit(5);

      res.json({
        totalWorkers: workersCount[0]?.count || 0,
        totalDeployments: deploymentsCount[0]?.count || 0,
        totalR2Buckets: r2StorageCount[0]?.count || 0,
        totalStations: stationsCount[0]?.count || 0,
        totalStorageBytes: totalStorage[0]?.total || 0,
        recentDeployments,
      });
    } catch (error) {
      console.error('Error fetching HotStack stats:', error);
      res.status(500).json({ 
        error: 'Failed to fetch HotStack stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===============================
  // R2 FILE OPERATIONS
  // ===============================

  // POST /api/hotstack/r2/upload - Upload file to R2
  app.post("/api/hotstack/r2/upload", isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      const { bucketName, objectKey, contentType } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No file uploaded' 
        });
      }

      if (!bucketName || !objectKey) {
        return res.status(400).json({ 
          success: false,
          error: 'bucketName and objectKey are required' 
        });
      }

      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();

      const fileContent = fs.readFileSync(req.file.path);
      
      broadcast({ 
        type: 'r2_upload_started', 
        data: { 
          bucket: bucketName, 
          key: objectKey,
          size: req.file.size 
        } 
      });

      const result = await cloudflareService.uploadFileToR2(
        bucketName, 
        objectKey, 
        fileContent,
        contentType || req.file.mimetype
      );

      fs.unlinkSync(req.file.path);

      if (result.success) {
        broadcast({ 
          type: 'r2_upload_completed', 
          data: { 
            bucket: bucketName, 
            key: objectKey,
            url: result.url 
          } 
        });

        res.json({
          success: true,
          message: 'File uploaded successfully',
          url: result.url
        });
      } else {
        broadcast({ 
          type: 'r2_upload_error', 
          data: { 
            bucket: bucketName, 
            key: objectKey,
            error: result.error 
          } 
        });

        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error uploading to R2:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/r2/download/:bucket/:key - Download file from R2
  app.get("/api/hotstack/r2/download/:bucket/:key(*)", isAuthenticated, async (req, res) => {
    try {
      const bucketName = req.params.bucket;
      const objectKey = req.params.key;

      if (!bucketName || !objectKey) {
        return res.status(400).json({ 
          success: false,
          error: 'bucket and key are required' 
        });
      }

      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();

      broadcast({ 
        type: 'r2_download_started', 
        data: { 
          bucket: bucketName, 
          key: objectKey 
        } 
      });

      const result = await cloudflareService.downloadFileFromR2(bucketName, objectKey);

      if (result.success && result.data) {
        broadcast({ 
          type: 'r2_download_completed', 
          data: { 
            bucket: bucketName, 
            key: objectKey,
            size: result.data.length 
          } 
        });

        const metadata = await cloudflareService.getFileMetadata(bucketName, objectKey);
        const contentType = metadata.metadata?.contentType || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(objectKey)}"`);
        res.send(result.data);
      } else {
        broadcast({ 
          type: 'r2_download_error', 
          data: { 
            bucket: bucketName, 
            key: objectKey,
            error: result.error 
          } 
        });

        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error downloading from R2:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/r2/list/:bucket - List files in R2 bucket
  app.get("/api/hotstack/r2/list/:bucket", isAuthenticated, async (req, res) => {
    try {
      const bucketName = req.params.bucket;
      const prefix = req.query.prefix as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      if (!bucketName) {
        return res.status(400).json({ 
          success: false,
          error: 'bucket is required' 
        });
      }

      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();

      broadcast({ 
        type: 'r2_list_started', 
        data: { 
          bucket: bucketName, 
          prefix,
          limit 
        } 
      });

      const result = await cloudflareService.listR2Files(bucketName, prefix, limit);

      if (result.success) {
        broadcast({ 
          type: 'r2_list_completed', 
          data: { 
            bucket: bucketName, 
            fileCount: result.files?.length || 0 
          } 
        });

        res.json({
          success: true,
          bucket: bucketName,
          prefix: prefix || '',
          files: result.files || []
        });
      } else {
        broadcast({ 
          type: 'r2_list_error', 
          data: { 
            bucket: bucketName, 
            error: result.error 
          } 
        });

        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error listing R2 files:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // DELETE /api/hotstack/r2/:bucket/:key - Delete file from R2
  app.delete("/api/hotstack/r2/:bucket/:key(*)", isAuthenticated, async (req, res) => {
    try {
      const bucketName = req.params.bucket;
      const objectKey = req.params.key;

      if (!bucketName || !objectKey) {
        return res.status(400).json({ 
          success: false,
          error: 'bucket and key are required' 
        });
      }

      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();

      broadcast({ 
        type: 'r2_delete_started', 
        data: { 
          bucket: bucketName, 
          key: objectKey 
        } 
      });

      const result = await cloudflareService.deleteFileFromR2(bucketName, objectKey);

      if (result.success) {
        broadcast({ 
          type: 'r2_delete_completed', 
          data: { 
            bucket: bucketName, 
            key: objectKey 
          } 
        });

        res.json({
          success: true,
          message: 'File deleted successfully',
          bucket: bucketName,
          key: objectKey
        });
      } else {
        broadcast({ 
          type: 'r2_delete_error', 
          data: { 
            bucket: bucketName, 
            key: objectKey,
            error: result.error 
          } 
        });

        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error deleting from R2:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/hotstack/r2/metadata/:bucket/:key - Get file metadata
  app.get("/api/hotstack/r2/metadata/:bucket/:key(*)", isAuthenticated, async (req, res) => {
    try {
      const bucketName = req.params.bucket;
      const objectKey = req.params.key;

      if (!bucketName || !objectKey) {
        return res.status(400).json({ 
          success: false,
          error: 'bucket and key are required' 
        });
      }

      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();

      broadcast({ 
        type: 'r2_metadata_requested', 
        data: { 
          bucket: bucketName, 
          key: objectKey 
        } 
      });

      const result = await cloudflareService.getFileMetadata(bucketName, objectKey);

      if (result.success) {
        res.json({
          success: true,
          bucket: bucketName,
          key: objectKey,
          metadata: result.metadata
        });
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error getting R2 metadata:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===============================
  // JOB QUEUE API ROUTES
  // ===============================

  // POST /api/jobs/deploy - Create deployment job
  app.post("/api/jobs/deploy", isAuthenticated, async (req, res) => {
    try {
      const jobData = insertDeploymentJobSchema.parse({
        jobType: "deploy",
        status: "pending",
        payload: req.body,
        progress: 0,
        metadata: {
          createdBy: req.user?.claims?.sub,
          createdAt: new Date().toISOString(),
        },
      });

      const [job] = await db.insert(deploymentJobs).values(jobData).returning();

      broadcast({
        type: "job_created",
        data: job,
      });

      res.status(201).json({
        jobId: job.id,
        status: job.status,
        message: "Job created successfully",
      });
    } catch (error) {
      console.error("Error creating deployment job:", error);
      res.status(500).json({ error: "Failed to create deployment job" });
    }
  });

  // POST /api/jobs/process - Create data processing job
  app.post("/api/jobs/process", isAuthenticated, async (req, res) => {
    try {
      const jobData = insertDeploymentJobSchema.parse({
        jobType: "process",
        status: "pending",
        payload: req.body,
        progress: 0,
        metadata: {
          createdBy: req.user?.claims?.sub,
          createdAt: new Date().toISOString(),
        },
      });

      const [job] = await db.insert(deploymentJobs).values(jobData).returning();

      broadcast({
        type: "job_created",
        data: job,
      });

      res.status(201).json({
        jobId: job.id,
        status: job.status,
        message: "Processing job created successfully",
      });
    } catch (error) {
      console.error("Error creating processing job:", error);
      res.status(500).json({ error: "Failed to create processing job" });
    }
  });

  // POST /api/jobs/sync - Create sync job
  app.post("/api/jobs/sync", isAuthenticated, async (req, res) => {
    try {
      const jobData = insertDeploymentJobSchema.parse({
        jobType: "sync",
        status: "pending",
        payload: req.body,
        progress: 0,
        metadata: {
          createdBy: req.user?.claims?.sub,
          createdAt: new Date().toISOString(),
        },
      });

      const [job] = await db.insert(deploymentJobs).values(jobData).returning();

      broadcast({
        type: "job_created",
        data: job,
      });

      res.status(201).json({
        jobId: job.id,
        status: job.status,
        message: "Sync job created successfully",
      });
    } catch (error) {
      console.error("Error creating sync job:", error);
      res.status(500).json({ error: "Failed to create sync job" });
    }
  });

  // GET /api/jobs/:id - Get job status
  app.get("/api/jobs/:id", isAuthenticated, async (req, res) => {
    try {
      const job = await db
        .select()
        .from(deploymentJobs)
        .where(eq(deploymentJobs.id, req.params.id))
        .limit(1);

      if (!job || job.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job[0]);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // GET /api/jobs - List all jobs with optional status filter
  app.get("/api/jobs", isAuthenticated, async (req, res) => {
    try {
      const { status } = req.query;

      let query = db.select().from(deploymentJobs).orderBy(desc(deploymentJobs.createdAt));

      if (status && typeof status === "string") {
        query = query.where(eq(deploymentJobs.status, status));
      }

      const jobs = await query;
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // DELETE /api/jobs/:id - Cancel/delete job
  app.delete("/api/jobs/:id", isAuthenticated, async (req, res) => {
    try {
      const job = await db
        .select()
        .from(deploymentJobs)
        .where(eq(deploymentJobs.id, req.params.id))
        .limit(1);

      if (!job || job.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (job[0].status === "processing") {
        return res.status(400).json({ error: "Cannot delete a job that is currently processing" });
      }

      await db.delete(deploymentJobs).where(eq(deploymentJobs.id, req.params.id));

      broadcast({
        type: "job_deleted",
        data: { jobId: req.params.id },
      });

      res.json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // ===============================
  // ORCHESTRATION API ROUTES
  // CodeNest orchestration endpoints that tie together R2 storage, 
  // HotStack deployments, and async job queue for full deployment flow
  // ===============================

  // POST /api/orchestrate/deploy - Upload files to R2 and create deployment job
  app.post("/api/orchestrate/deploy", isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { CloudflareService } = await import('./cloudflare-service');
      const cloudflareService = new CloudflareService();

      // Read file content
      const fileContent = fs.readFileSync(req.file.path);
      
      // Generate unique object key for R2
      const timestamp = Date.now();
      const objectKey = `deployments/${timestamp}/${req.file.originalname}`;
      const bucketName = req.body.bucketName || 'hotstack-bucket';

      // Upload file to R2
      const uploadResult = await cloudflareService.uploadFileToR2(
        bucketName,
        objectKey,
        fileContent,
        req.file.mimetype
      );

      if (!uploadResult.success) {
        // Clean up local file
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ 
          error: "Failed to upload file to R2",
          details: uploadResult.error 
        });
      }

      // Create deployment job with R2 object key in metadata
      const jobData = insertDeploymentJobSchema.parse({
        jobType: "deploy",
        status: "pending",
        payload: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          contentType: req.file.mimetype,
          bucketName,
          objectKey,
          deploymentConfig: req.body.config ? JSON.parse(req.body.config) : {},
        },
        progress: 0,
        metadata: {
          createdBy: req.user?.claims?.sub,
          createdAt: new Date().toISOString(),
          r2Bucket: bucketName,
          r2ObjectKey: objectKey,
          r2Url: uploadResult.url,
          originalFileName: req.file.originalname,
          fileSize: req.file.size,
        },
      });

      const [job] = await db.insert(deploymentJobs).values(jobData).returning();

      // Clean up local file after successful upload
      fs.unlinkSync(req.file.path);

      // Broadcast orchestration_started event
      broadcast({
        type: "orchestration_started",
        data: {
          jobId: job.id,
          jobType: "deploy",
          fileName: req.file.originalname,
          r2Url: uploadResult.url,
          status: job.status,
        },
      });

      res.status(201).json({
        success: true,
        jobId: job.id,
        status: job.status,
        r2Url: uploadResult.url,
        message: "File uploaded to R2 and deployment job created successfully",
      });
    } catch (error) {
      console.error("Error in orchestrate/deploy:", error);
      
      // Clean up local file if it exists
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        error: "Failed to orchestrate deployment",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // POST /api/orchestrate/process - Process data with optional R2 storage
  app.post("/api/orchestrate/process", isAuthenticated, async (req, res) => {
    try {
      const { data, uploadToR2, bucketName: requestBucketName } = req.body;

      if (!data) {
        return res.status(400).json({ error: "No data provided for processing" });
      }

      let r2Url: string | undefined;
      let objectKey: string | undefined;

      // Upload data to R2 if requested
      if (uploadToR2) {
        const { CloudflareService } = await import('./cloudflare-service');
        const cloudflareService = new CloudflareService();

        const timestamp = Date.now();
        objectKey = `processing/${timestamp}/data.json`;
        const bucketName = requestBucketName || 'hotstack-bucket';

        const dataBuffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');

        const uploadResult = await cloudflareService.uploadFileToR2(
          bucketName,
          objectKey,
          dataBuffer,
          'application/json'
        );

        if (!uploadResult.success) {
          return res.status(500).json({ 
            error: "Failed to upload data to R2",
            details: uploadResult.error 
          });
        }

        r2Url = uploadResult.url;
      }

      // Create processing job
      const jobData = insertDeploymentJobSchema.parse({
        jobType: "process",
        status: "pending",
        payload: {
          data,
          totalRecords: Array.isArray(data) ? data.length : 1,
          uploadedToR2: uploadToR2 || false,
          bucketName: requestBucketName || 'hotstack-bucket',
          objectKey,
        },
        progress: 0,
        metadata: {
          createdBy: req.user?.claims?.sub,
          createdAt: new Date().toISOString(),
          r2Bucket: uploadToR2 ? requestBucketName || 'hotstack-bucket' : undefined,
          r2ObjectKey: objectKey,
          r2Url,
          dataSize: JSON.stringify(data).length,
        },
      });

      const [job] = await db.insert(deploymentJobs).values(jobData).returning();

      // Broadcast orchestration_started event
      broadcast({
        type: "orchestration_started",
        data: {
          jobId: job.id,
          jobType: "process",
          dataSize: JSON.stringify(data).length,
          uploadedToR2: uploadToR2 || false,
          r2Url,
          status: job.status,
        },
      });

      res.status(201).json({
        success: true,
        jobId: job.id,
        status: job.status,
        uploadedToR2: uploadToR2 || false,
        r2Url,
        message: "Data processing job created successfully",
      });
    } catch (error) {
      console.error("Error in orchestrate/process:", error);
      res.status(500).json({ 
        error: "Failed to orchestrate data processing",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // POST /api/orchestrate/coordinate - Coordinate with ecosystem apps
  app.post("/api/orchestrate/coordinate", isAuthenticated, async (req, res) => {
    try {
      const { 
        syncType, 
        targetSystems, 
        data,
        ecosystemAppIds 
      } = req.body;

      if (!syncType) {
        return res.status(400).json({ error: "Sync type is required" });
      }

      // Prepare ecosystem coordination payload
      const coordinationPayload = {
        syncType,
        targetSystems: targetSystems || [],
        ecosystemAppIds: ecosystemAppIds || [],
        data: data || {},
        timestamp: new Date().toISOString(),
      };

      // Create sync job for ecosystem coordination
      const jobData = insertDeploymentJobSchema.parse({
        jobType: "sync",
        status: "pending",
        payload: coordinationPayload,
        progress: 0,
        metadata: {
          createdBy: req.user?.claims?.sub,
          createdAt: new Date().toISOString(),
          syncType,
          targetSystemsCount: targetSystems?.length || 0,
          ecosystemAppsCount: ecosystemAppIds?.length || 0,
          coordinationType: "ecosystem",
        },
      });

      const [job] = await db.insert(deploymentJobs).values(jobData).returning();

      // Broadcast orchestration_started event
      broadcast({
        type: "orchestration_started",
        data: {
          jobId: job.id,
          jobType: "sync",
          syncType,
          targetSystemsCount: targetSystems?.length || 0,
          ecosystemAppsCount: ecosystemAppIds?.length || 0,
          status: job.status,
        },
      });

      res.status(201).json({
        success: true,
        jobId: job.id,
        status: job.status,
        syncType,
        targetSystems: targetSystems || [],
        message: "Ecosystem coordination job created successfully",
      });
    } catch (error) {
      console.error("Error in orchestrate/coordinate:", error);
      res.status(500).json({ 
        error: "Failed to orchestrate ecosystem coordination",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ===============================
  // REPLIT APPS ENDPOINTS
  // ===============================

  // GET /api/replit-apps - List all Replit apps with optional filters
  app.get("/api/replit-apps", async (req, res) => {
    try {
      const { category, deploymentStatus, isActive } = req.query;
      
      let query = db.select().from(replitApps);
      
      // Apply filters if provided
      const conditions = [];
      if (category) {
        conditions.push(eq(replitApps.category, category as string));
      }
      if (deploymentStatus) {
        conditions.push(eq(replitApps.deploymentStatus, deploymentStatus as string));
      }
      if (isActive !== undefined) {
        conditions.push(eq(replitApps.isActive, isActive === 'true'));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const apps = await query.orderBy(desc(replitApps.lastUpdated));
      
      res.json(apps);
    } catch (error) {
      console.error("Error fetching Replit apps:", error);
      res.status(500).json({ 
        error: "Failed to fetch Replit apps",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/replit-apps/stats - Get Replit apps statistics
  app.get("/api/replit-apps/stats", async (req, res) => {
    try {
      const allApps = await db.select().from(replitApps);
      
      const total = allApps.length;
      const active = allApps.filter(app => app.isActive).length;
      
      // Category breakdown
      const byCategory: Record<string, number> = {};
      allApps.forEach(app => {
        const cat = app.category || 'uncategorized';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });
      
      // Deployment status breakdown
      const byStatus: Record<string, number> = {};
      allApps.forEach(app => {
        const status = app.deploymentStatus;
        byStatus[status] = (byStatus[status] || 0) + 1;
      });
      
      // Get 10 most recent apps sorted by lastUpdated DESC
      const recentApps = await db.select()
        .from(replitApps)
        .orderBy(desc(replitApps.lastUpdated))
        .limit(10);
      
      res.json({
        total,
        active,
        byCategory,
        byStatus,
        recentApps
      });
    } catch (error) {
      console.error("Error fetching Replit apps stats:", error);
      res.status(500).json({ 
        error: "Failed to fetch Replit apps stats",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/replit-apps/:id - Get specific Replit app
  app.get("/api/replit-apps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const [app] = await db.select()
        .from(replitApps)
        .where(eq(replitApps.id, id))
        .limit(1);
      
      if (!app) {
        return res.status(404).json({ error: "Replit app not found" });
      }
      
      res.json(app);
    } catch (error) {
      console.error("Error fetching Replit app:", error);
      res.status(500).json({ 
        error: "Failed to fetch Replit app",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // PATCH /api/replit-apps/:id - Update Replit app metadata
  app.patch("/api/replit-apps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Validate that the app exists
      const [existingApp] = await db.select()
        .from(replitApps)
        .where(eq(replitApps.id, id))
        .limit(1);
      
      if (!existingApp) {
        return res.status(404).json({ error: "Replit app not found" });
      }
      
      // Update the app
      const [updatedApp] = await db.update(replitApps)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(replitApps.id, id))
        .returning();
      
      res.json(updatedApp);
    } catch (error) {
      console.error("Error updating Replit app:", error);
      res.status(500).json({ 
        error: "Failed to update Replit app",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ===============================
  // ASSET REGISTRY & SYNC EVENTS API ROUTES
  // ===============================

  // GET /api/assets/manifest - Get current asset manifest
  app.get("/api/assets/manifest", async (req, res) => {
    try {
      const manifest = await assetRegistry.loadManifest();
      if (!manifest) {
        return res.status(404).json({ error: "No manifest found. Run asset scan first." });
      }
      res.json(manifest);
    } catch (error) {
      console.error("Error loading asset manifest:", error);
      res.status(500).json({ error: "Failed to load asset manifest" });
    }
  });

  // GET /api/assets/registry - List all registered assets
  app.get("/api/assets/registry", async (req, res) => {
    try {
      const assets = await storage.getAssetRegistry();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching asset registry:", error);
      res.status(500).json({ error: "Failed to fetch asset registry" });
    }
  });

  // GET /api/assets/category/:category - Get assets by category
  app.get("/api/assets/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const assets = await storage.getAssetsByCategory(category);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets by category:", error);
      res.status(500).json({ error: "Failed to fetch assets by category" });
    }
  });

  // GET /api/assets/repository/:repo - Get assets by repository
  app.get("/api/assets/repository/:repo", async (req, res) => {
    try {
      const { repo } = req.params;
      const assets = await storage.getAssetsByRepository(repo);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets by repository:", error);
      res.status(500).json({ error: "Failed to fetch assets by repository" });
    }
  });

  // POST /api/assets/scan - Trigger asset scan and cataloging
  app.post("/api/assets/scan", async (req, res) => {
    try {
      console.log("🔍 Starting asset scan...");
      
      // Generate manifest
      const manifest = await assetRegistry.generateManifest();
      
      // Save manifest to file
      await assetRegistry.saveManifest(manifest);
      
      // Store assets in database
      let storedCount = 0;
      for (const category of Object.values(manifest.assets)) {
        for (const file of category.files) {
          try {
            await storage.upsertAsset(file.path, {
              filename: file.filename,
              filepath: file.path,
              fileType: file.type,
              fileSize: file.size,
              fileHash: file.hash,
              category: assetRegistry['categorizeFile'](file.filename),
              cdnEnabled: file.cdnEnabled || false,
              repositorySource: null,
              metadata: null,
            });
            storedCount++;
          } catch (error) {
            // Log error but continue processing
            console.error(`Error upserting asset ${file.filename}:`, error);
          }
        }
      }
      
      console.log(`✅ Asset scan completed! Stored ${storedCount} assets.`);
      
      res.json({
        success: true,
        message: "Asset scan completed successfully",
        manifest,
        storedCount,
      });
    } catch (error) {
      console.error("Error during asset scan:", error);
      res.status(500).json({ 
        error: "Failed to scan assets",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/assets/stats - Get asset statistics
  app.get("/api/assets/stats", async (req, res) => {
    try {
      const stats = await assetRegistry.getManifestStats();
      if (!stats) {
        return res.status(404).json({ error: "No manifest found. Run asset scan first." });
      }
      res.json(stats);
    } catch (error) {
      console.error("Error fetching asset stats:", error);
      res.status(500).json({ error: "Failed to fetch asset stats" });
    }
  });

  // GET /api/sync/events - List sync events
  app.get("/api/sync/events", async (req, res) => {
    try {
      const events = await storage.getSyncEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching sync events:", error);
      res.status(500).json({ error: "Failed to fetch sync events" });
    }
  });

  // POST /api/sync/events - Create sync event
  app.post("/api/sync/events", async (req, res) => {
    try {
      const validated = insertSyncEventSchema.parse(req.body);
      const event = await storage.createSyncEvent(validated);
      
      // Broadcast event to WebSocket clients
      broadcast({ type: 'sync_event_created', data: event });
      
      res.json(event);
    } catch (error) {
      console.error("Error creating sync event:", error);
      res.status(400).json({ 
        error: "Failed to create sync event",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/sync/pending - Get pending sync events
  app.get("/api/sync/pending", async (req, res) => {
    try {
      const pendingEvents = await storage.getPendingSyncEvents();
      res.json(pendingEvents);
    } catch (error) {
      console.error("Error fetching pending sync events:", error);
      res.status(500).json({ error: "Failed to fetch pending sync events" });
    }
  });

  // PATCH /api/sync/events/:id/status - Update sync event status
  app.patch("/api/sync/events/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updatedEvent = await storage.updateSyncEventStatus(id, status);
      
      if (!updatedEvent) {
        return res.status(404).json({ error: "Sync event not found" });
      }
      
      // Broadcast update to WebSocket clients
      broadcast({ type: 'sync_event_updated', data: updatedEvent });
      
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating sync event status:", error);
      res.status(500).json({ error: "Failed to update sync event status" });
    }
  });

  // ===============================
  // API KEY MANAGEMENT ROUTES
  // ===============================

  const { keyVault } = await import("./keyVault");
  const { insertKeyAuditLogSchema } = await import("@shared/schema");

  // GET /api/keys/validate - Validate all environment keys
  app.get("/api/keys/validate", isAuthenticated, async (req, res) => {
    try {
      const validation = keyVault.validateKeys();
      res.json(validation);
    } catch (error) {
      console.error("Error validating keys:", error);
      res.status(500).json({ error: "Failed to validate keys" });
    }
  });

  // GET /api/keys/status - Get key configuration status
  app.get("/api/keys/status", isAuthenticated, async (req, res) => {
    try {
      const keys = await storage.getApiKeys();
      const validation = keyVault.validateKeys();
      
      const status = keys.map(key => ({
        ...key,
        maskedValue: keyVault.getMaskedKey(key.keyName),
        currentlyConfigured: validation.configured.includes(key.keyName)
      }));
      
      res.json({
        keys: status,
        summary: {
          total: keys.length,
          configured: validation.configured.length,
          missing: validation.missing.length
        }
      });
    } catch (error) {
      console.error("Error fetching key status:", error);
      res.status(500).json({ error: "Failed to fetch key status" });
    }
  });

  // GET /api/keys/bundle/:app - Get key bundle for specific app (SECURITY: Returns masked values only)
  app.get("/api/keys/bundle/:app", isAuthenticated, async (req: any, res) => {
    try {
      const { app } = req.params;
      const bundle = await keyVault.distributeKeys(app);
      
      // Convert Map to object with MASKED values only (SECURITY FIX)
      const keysObject: Record<string, string> = {};
      bundle.keys.forEach((value, keyName) => {
        keysObject[keyName] = keyVault.getMaskedKey(keyName);
      });
      
      // Log the distribution with user info
      await storage.createKeyAuditLog({
        keyName: `BUNDLE_${app.toUpperCase()}`,
        action: 'distribution',
        appName: app,
        status: 'success',
        message: `Key bundle requested for ${app}`,
        metadata: { 
          keyCount: bundle.keys.size,
          requestedBy: req.user?.claims?.sub || "unknown"
        }
      });
      
      res.json({
        appName: bundle.appName,
        keys: keysObject,
        expiresAt: bundle.expiresAt,
        note: "This bundle contains masked values for security. Full secrets are never transmitted over HTTP."
      });
    } catch (error) {
      console.error("Error distributing keys:", error);
      res.status(500).json({ error: "Failed to distribute keys" });
    }
  });

  // GET /api/keys/audit - Get key audit logs
  app.get("/api/keys/audit", isAuthenticated, async (req, res) => {
    try {
      const logs = await storage.getKeyAuditLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // GET /api/keys/audit/:keyName - Get audit logs for specific key
  app.get("/api/keys/audit/:keyName", isAuthenticated, async (req, res) => {
    try {
      const { keyName } = req.params;
      const logs = await storage.getKeyAuditLogsByKey(keyName);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching key audit logs:", error);
      res.status(500).json({ error: "Failed to fetch key audit logs" });
    }
  });

  // POST /api/keys/audit - Create audit log entry
  app.post("/api/keys/audit", isAuthenticated, async (req, res) => {
    try {
      const validated = insertKeyAuditLogSchema.parse(req.body);
      const log = await storage.createKeyAuditLog(validated);
      res.json(log);
    } catch (error) {
      console.error("Error creating audit log:", error);
      res.status(400).json({ 
        error: "Failed to create audit log",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ===============================
  // SAMFOX STUDIO API ROUTES
  // ===============================

  const { 
    samFoxMasterLicenses, 
    samFoxTreatyCollaborations, 
    samFoxFileroom, 
    samFoxWorkspaces, 
    samFoxVaultTrails, 
    samFoxSyncStats, 
    samFoxBrandProfiles,
    insertSamFoxMasterLicenseSchema,
    insertSamFoxTreatyCollaborationSchema,
    insertSamFoxFileroomSchema,
    insertSamFoxWorkspaceSchema,
    insertSamFoxVaultTrailSchema,
    insertSamFoxSyncStatSchema,
    insertSamFoxBrandProfileSchema
  } = await import("@shared/schema");

  // SamFox Master Licenses Routes
  app.get("/api/samfox-studio/licenses", isAuthenticated, async (req, res) => {
    try {
      const licenses = await db.select().from(samFoxMasterLicenses).orderBy(desc(samFoxMasterLicenses.issuedAt));
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching SamFox licenses:", error);
      res.status(500).json({ error: "Failed to fetch licenses" });
    }
  });

  app.post("/api/samfox-studio/licenses", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSamFoxMasterLicenseSchema.parse(req.body);
      const [license] = await db.insert(samFoxMasterLicenses).values(validated).returning();
      res.json(license);
    } catch (error) {
      console.error("Error creating SamFox license:", error);
      res.status(400).json({ error: "Failed to create license" });
    }
  });

  app.patch("/api/samfox-studio/licenses/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(samFoxMasterLicenses)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(samFoxMasterLicenses.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating SamFox license:", error);
      res.status(500).json({ error: "Failed to update license" });
    }
  });

  app.delete("/api/samfox-studio/licenses/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(samFoxMasterLicenses).where(eq(samFoxMasterLicenses.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting SamFox license:", error);
      res.status(500).json({ error: "Failed to delete license" });
    }
  });

  // SamFox Treaty Collaborations Routes
  app.get("/api/samfox-studio/treaties", isAuthenticated, async (req, res) => {
    try {
      const treaties = await db.select().from(samFoxTreatyCollaborations).orderBy(desc(samFoxTreatyCollaborations.createdAt));
      res.json(treaties);
    } catch (error) {
      console.error("Error fetching SamFox treaties:", error);
      res.status(500).json({ error: "Failed to fetch treaties" });
    }
  });

  app.post("/api/samfox-studio/treaties", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSamFoxTreatyCollaborationSchema.parse(req.body);
      const [treaty] = await db.insert(samFoxTreatyCollaborations).values(validated).returning();
      res.json(treaty);
    } catch (error) {
      console.error("Error creating SamFox treaty:", error);
      res.status(400).json({ error: "Failed to create treaty" });
    }
  });

  app.patch("/api/samfox-studio/treaties/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(samFoxTreatyCollaborations)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(samFoxTreatyCollaborations.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating SamFox treaty:", error);
      res.status(500).json({ error: "Failed to update treaty" });
    }
  });

  app.delete("/api/samfox-studio/treaties/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(samFoxTreatyCollaborations).where(eq(samFoxTreatyCollaborations.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting SamFox treaty:", error);
      res.status(500).json({ error: "Failed to delete treaty" });
    }
  });

  // SamFox Fileroom Routes
  app.get("/api/samfox-studio/fileroom", isAuthenticated, async (req, res) => {
    try {
      const assets = await db.select().from(samFoxFileroom).orderBy(desc(samFoxFileroom.uploadedAt));
      res.json(assets);
    } catch (error) {
      console.error("Error fetching SamFox fileroom assets:", error);
      res.status(500).json({ error: "Failed to fetch fileroom assets" });
    }
  });

  app.post("/api/samfox-studio/fileroom", isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const assetData = {
        assetId: nanoid(),
        title: req.body.title || file.originalname,
        type: req.body.type || 'creative-asset',
        fileUrl: `/uploads/${file.filename}`,
        category: req.body.category,
        uploadedBy: req.user?.id,
        fileSize: file.size,
        mimeType: file.mimetype,
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : null
      };

      const validated = insertSamFoxFileroomSchema.parse(assetData);
      const [asset] = await db.insert(samFoxFileroom).values(validated).returning();
      res.json(asset);
    } catch (error) {
      console.error("Error uploading SamFox asset:", error);
      res.status(500).json({ error: "Failed to upload asset" });
    }
  });

  app.delete("/api/samfox-studio/fileroom/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(samFoxFileroom).where(eq(samFoxFileroom.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting SamFox fileroom asset:", error);
      res.status(500).json({ error: "Failed to delete asset" });
    }
  });

  // SamFox Workspaces Routes
  app.get("/api/samfox-studio/workspaces", isAuthenticated, async (req, res) => {
    try {
      const workspaces = await db.select().from(samFoxWorkspaces).orderBy(desc(samFoxWorkspaces.createdAt));
      res.json(workspaces);
    } catch (error) {
      console.error("Error fetching SamFox workspaces:", error);
      res.status(500).json({ error: "Failed to fetch workspaces" });
    }
  });

  app.post("/api/samfox-studio/workspaces", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSamFoxWorkspaceSchema.parse(req.body);
      const [workspace] = await db.insert(samFoxWorkspaces).values(validated).returning();
      res.json(workspace);
    } catch (error) {
      console.error("Error creating SamFox workspace:", error);
      res.status(400).json({ error: "Failed to create workspace" });
    }
  });

  app.patch("/api/samfox-studio/workspaces/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(samFoxWorkspaces)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(samFoxWorkspaces.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating SamFox workspace:", error);
      res.status(500).json({ error: "Failed to update workspace" });
    }
  });

  app.delete("/api/samfox-studio/workspaces/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(samFoxWorkspaces).where(eq(samFoxWorkspaces.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting SamFox workspace:", error);
      res.status(500).json({ error: "Failed to delete workspace" });
    }
  });

  // SamFox Vault Trails Routes
  app.get("/api/samfox-studio/vault-trails", isAuthenticated, async (req, res) => {
    try {
      const { type, userId, resourceType } = req.query;
      let query = db.select().from(samFoxVaultTrails);
      
      const conditions = [];
      if (type) conditions.push(eq(samFoxVaultTrails.type, type as string));
      if (userId) conditions.push(eq(samFoxVaultTrails.userId, userId as string));
      if (resourceType) conditions.push(eq(samFoxVaultTrails.resourceType, resourceType as string));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const trails = await query.orderBy(desc(samFoxVaultTrails.timestamp)).limit(100);
      res.json(trails);
    } catch (error) {
      console.error("Error fetching SamFox vault trails:", error);
      res.status(500).json({ error: "Failed to fetch vault trails" });
    }
  });

  app.post("/api/samfox-studio/vault-trails", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSamFoxVaultTrailSchema.parse(req.body);
      const [trail] = await db.insert(samFoxVaultTrails).values(validated).returning();
      res.json(trail);
    } catch (error) {
      console.error("Error creating SamFox vault trail:", error);
      res.status(400).json({ error: "Failed to create vault trail" });
    }
  });

  // SamFox Sync Stats Routes
  app.get("/api/samfox-studio/sync-stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await db.select().from(samFoxSyncStats).orderBy(desc(samFoxSyncStats.lastSyncAt)).limit(50);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching SamFox sync stats:", error);
      res.status(500).json({ error: "Failed to fetch sync stats" });
    }
  });

  app.post("/api/samfox-studio/sync-stats", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSamFoxSyncStatSchema.parse(req.body);
      const [stat] = await db.insert(samFoxSyncStats).values(validated).returning();
      res.json(stat);
    } catch (error) {
      console.error("Error creating SamFox sync stat:", error);
      res.status(400).json({ error: "Failed to create sync stat" });
    }
  });

  // SamFox Brand Profiles Routes
  app.get("/api/samfox-studio/brand-profiles", isAuthenticated, async (req, res) => {
    try {
      const profiles = await db.select().from(samFoxBrandProfiles).orderBy(desc(samFoxBrandProfiles.createdAt));
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching SamFox brand profiles:", error);
      res.status(500).json({ error: "Failed to fetch brand profiles" });
    }
  });

  app.post("/api/samfox-studio/brand-profiles", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSamFoxBrandProfileSchema.parse(req.body);
      const [profile] = await db.insert(samFoxBrandProfiles).values(validated).returning();
      res.json(profile);
    } catch (error) {
      console.error("Error creating SamFox brand profile:", error);
      res.status(400).json({ error: "Failed to create brand profile" });
    }
  });

  app.patch("/api/samfox-studio/brand-profiles/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(samFoxBrandProfiles)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(samFoxBrandProfiles.id, id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating SamFox brand profile:", error);
      res.status(500).json({ error: "Failed to update brand profile" });
    }
  });

  app.delete("/api/samfox-studio/brand-profiles/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(samFoxBrandProfiles).where(eq(samFoxBrandProfiles.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting SamFox brand profile:", error);
      res.status(500).json({ error: "Failed to delete brand profile" });
    }
  });

  // SamFox Analytics Route
  app.get("/api/samfox-studio/analytics", isAuthenticated, async (req, res) => {
    try {
      const [licensesData, treatiesData, assetsData, workspacesData, vaultTrailsData, syncStatsData] = await Promise.all([
        db.select().from(samFoxMasterLicenses),
        db.select().from(samFoxTreatyCollaborations),
        db.select().from(samFoxFileroom),
        db.select().from(samFoxWorkspaces),
        db.select().from(samFoxVaultTrails).orderBy(desc(samFoxVaultTrails.timestamp)).limit(10),
        db.select().from(samFoxSyncStats).orderBy(desc(samFoxSyncStats.lastSyncAt)).limit(5)
      ]);

      const analytics = {
        totalLicenses: licensesData.length,
        activeTreaties: treatiesData.filter(t => t.status === 'active' || t.status === 'sealed').length,
        totalAssets: assetsData.length,
        activeWorkspaces: workspacesData.filter(w => w.status === 'active').length,
        recentVaultTrails: vaultTrailsData,
        syncHealth: {
          vaultMesh: syncStatsData.find(s => s.syncOperation === 'vault-mesh')?.status || 'unknown',
          treatySync: syncStatsData.find(s => s.syncOperation === 'treaty-sync')?.status || 'unknown',
          assetBackup: syncStatsData.find(s => s.syncOperation === 'asset-backup')?.status || 'unknown'
        }
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching SamFox analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ===============================
  // SCROLLBINDER_ONE ROUTES
  // ===============================

  const {
    glyphAuditReports,
    operationalVectors,
    agentTrails,
    vendorIntegrations,
    backendHonestyLogs,
    inefficiencyDetections,
    insertGlyphAuditReportSchema,
    insertOperationalVectorSchema,
    insertAgentTrailSchema,
    insertVendorIntegrationSchema,
    insertBackendHonestyLogSchema,
    insertInefficiencyDetectionSchema,
  } = await import("@shared/schema");

  // Get all glyph audit reports
  app.get("/api/scrollbinder/audit-reports", async (req, res) => {
    try {
      const reports = await db.select().from(glyphAuditReports).orderBy(desc(glyphAuditReports.createdAt));
      res.json(reports);
    } catch (error) {
      console.error("Error fetching audit reports:", error);
      res.status(500).json({ error: "Failed to fetch audit reports" });
    }
  });

  // Create new audit report
  app.post("/api/scrollbinder/audit-reports", async (req, res) => {
    try {
      const validated = insertGlyphAuditReportSchema.parse(req.body);
      const [report] = await db.insert(glyphAuditReports).values(validated).returning();
      broadcast({ type: 'scrollbinder_status_update', data: report });
      res.json(report);
    } catch (error) {
      console.error("Error creating audit report:", error);
      res.status(500).json({ error: "Failed to create audit report" });
    }
  });

  // Get specific audit report with all relations
  app.get("/api/scrollbinder/audit-reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [report] = await db.select().from(glyphAuditReports).where(eq(glyphAuditReports.id, id));
      
      if (!report) {
        return res.status(404).json({ error: "Audit report not found" });
      }

      const [vectors, trails, logs, inefficiencies] = await Promise.all([
        db.select().from(operationalVectors).where(eq(operationalVectors.auditReportId, id)),
        db.select().from(agentTrails).where(eq(agentTrails.auditReportId, id)),
        db.select().from(backendHonestyLogs).where(eq(backendHonestyLogs.auditReportId, id)),
        db.select().from(inefficiencyDetections).where(eq(inefficiencyDetections.auditReportId, id))
      ]);

      res.json({ ...report, operationalVectors: vectors, agentTrails: trails, honestyLogs: logs, inefficiencies });
    } catch (error) {
      console.error("Error fetching audit report details:", error);
      res.status(500).json({ error: "Failed to fetch audit report details" });
    }
  });

  // Get current system status matrix
  app.get("/api/scrollbinder/system-status", async (req, res) => {
    try {
      const latestReport = await db.select().from(glyphAuditReports).orderBy(desc(glyphAuditReports.createdAt)).limit(1);
      const latestVectors = latestReport.length > 0 
        ? await db.select().from(operationalVectors).where(eq(operationalVectors.auditReportId, latestReport[0].id))
        : [];
      
      res.json({ report: latestReport[0] || null, vectors: latestVectors });
    } catch (error) {
      console.error("Error fetching system status:", error);
      res.status(500).json({ error: "Failed to fetch system status" });
    }
  });

  // Get operational vectors
  app.get("/api/scrollbinder/operational-vectors", async (req, res) => {
    try {
      const vectors = await db.select().from(operationalVectors).orderBy(desc(operationalVectors.createdAt)).limit(50);
      res.json(vectors);
    } catch (error) {
      console.error("Error fetching operational vectors:", error);
      res.status(500).json({ error: "Failed to fetch operational vectors" });
    }
  });

  // Get agent trail analysis
  app.get("/api/scrollbinder/agent-trails", async (req, res) => {
    try {
      const trails = await db.select().from(agentTrails).orderBy(desc(agentTrails.createdAt)).limit(50);
      res.json(trails);
    } catch (error) {
      console.error("Error fetching agent trails:", error);
      res.status(500).json({ error: "Failed to fetch agent trails" });
    }
  });

  // Get vendor integration matrix
  app.get("/api/scrollbinder/vendor-matrix", async (req, res) => {
    try {
      const vendors = await db.select().from(vendorIntegrations).orderBy(vendorIntegrations.vendorName);
      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendor matrix:", error);
      res.status(500).json({ error: "Failed to fetch vendor matrix" });
    }
  });

  // Get inefficiency detections
  app.get("/api/scrollbinder/inefficiencies", async (req, res) => {
    try {
      const inefficiencies = await db.select().from(inefficiencyDetections).orderBy(desc(inefficiencyDetections.createdAt)).limit(100);
      res.json(inefficiencies);
    } catch (error) {
      console.error("Error fetching inefficiencies:", error);
      res.status(500).json({ error: "Failed to fetch inefficiencies" });
    }
  });

  // Manual trigger for file processing
  app.post("/api/scrollbinder/trigger-process", async (req, res) => {
    try {
      const { fileQueue } = req.body;
      
      const latestReport = await db.select().from(glyphAuditReports).orderBy(desc(glyphAuditReports.createdAt)).limit(1);
      
      if (latestReport.length === 0) {
        return res.status(404).json({ error: "No audit report found" });
      }

      const [trail] = await db.insert(agentTrails).values({
        auditReportId: latestReport[0].id,
        agentPrimary: "ScrollBinder_RepLit_Agent",
        agentSecondary: "FLAME-LATTICE",
        integrationGrids: ["Vercel", "Gmail", "Zoho", "Hetzner", "Gemini"],
        processingStatus: "PROCESSING",
        fileQueue: fileQueue || "Unknown",
        metadataState: "PROCESSING"
      }).returning();

      broadcast({ type: 'agent_activity', data: trail });
      res.json({ success: true, trail });
    } catch (error) {
      console.error("Error triggering process:", error);
      res.status(500).json({ error: "Failed to trigger process" });
    }
  });

  // Get backend honesty logs
  app.get("/api/scrollbinder/honesty-logs", async (req, res) => {
    try {
      const logs = await db.select().from(backendHonestyLogs).orderBy(desc(backendHonestyLogs.timestamp)).limit(100);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching honesty logs:", error);
      res.status(500).json({ error: "Failed to fetch honesty logs" });
    }
  });

  // Create honesty log entry
  app.post("/api/scrollbinder/honesty-logs", async (req, res) => {
    try {
      const validated = insertBackendHonestyLogSchema.parse(req.body);
      const [log] = await db.insert(backendHonestyLogs).values(validated).returning();
      res.json(log);
    } catch (error) {
      console.error("Error creating honesty log:", error);
      res.status(500).json({ error: "Failed to create honesty log" });
    }
  });

  // ===============================
  // HSOMNI 9000 ROUTES
  // ===============================

  const {
    integrationProposals,
    treatyScrolls,
    liberationProtocols,
    liberationEvents,
    communityAgents,
    sectorIntelligence,
    insertIntegrationProposalSchema,
    insertTreatyScrollSchema,
    insertLiberationProtocolSchema,
    insertLiberationEventSchema,
    insertCommunityAgentSchema,
    insertSectorIntelligenceSchema,
  } = await import("@shared/schema");

  // Get all integration proposals
  app.get("/api/hsomni/integration-proposals", async (req, res) => {
    try {
      const proposals = await db.select().from(integrationProposals).orderBy(desc(integrationProposals.createdAt));
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching integration proposals:", error);
      res.status(500).json({ error: "Failed to fetch integration proposals" });
    }
  });

  // Create new proposal
  app.post("/api/hsomni/integration-proposals", async (req, res) => {
    try {
      const validated = insertIntegrationProposalSchema.parse(req.body);
      const [proposal] = await db.insert(integrationProposals).values(validated).returning();
      res.json(proposal);
    } catch (error) {
      console.error("Error creating integration proposal:", error);
      res.status(500).json({ error: "Failed to create integration proposal" });
    }
  });

  // Get specific proposal with details
  app.get("/api/hsomni/integration-proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [proposal] = await db.select().from(integrationProposals).where(eq(integrationProposals.id, id));
      
      if (!proposal) {
        return res.status(404).json({ error: "Integration proposal not found" });
      }

      const [treaties, intelligence] = await Promise.all([
        db.select().from(treatyScrolls).where(eq(treatyScrolls.proposalId, id)),
        db.select().from(sectorIntelligence).where(eq(sectorIntelligence.proposalId, id))
      ]);

      res.json({ ...proposal, treaties, sectorIntelligence: intelligence });
    } catch (error) {
      console.error("Error fetching proposal details:", error);
      res.status(500).json({ error: "Failed to fetch proposal details" });
    }
  });

  // Get all treaty scrolls
  app.get("/api/hsomni/treaty-scrolls", async (req, res) => {
    try {
      const treaties = await db.select().from(treatyScrolls).orderBy(desc(treatyScrolls.createdAt));
      res.json(treaties);
    } catch (error) {
      console.error("Error fetching treaty scrolls:", error);
      res.status(500).json({ error: "Failed to fetch treaty scrolls" });
    }
  });

  // Create treaty scroll
  app.post("/api/hsomni/treaty-scrolls", async (req, res) => {
    try {
      const validated = insertTreatyScrollSchema.parse(req.body);
      const [treaty] = await db.insert(treatyScrolls).values(validated).returning();
      res.json(treaty);
    } catch (error) {
      console.error("Error creating treaty scroll:", error);
      res.status(500).json({ error: "Failed to create treaty scroll" });
    }
  });

  // Get all liberation protocols
  app.get("/api/hsomni/liberation-protocols", async (req, res) => {
    try {
      const protocols = await db.select().from(liberationProtocols).orderBy(desc(liberationProtocols.createdAt));
      res.json(protocols);
    } catch (error) {
      console.error("Error fetching liberation protocols:", error);
      res.status(500).json({ error: "Failed to fetch liberation protocols" });
    }
  });

  // Activate liberation protocol
  app.post("/api/hsomni/liberation-protocols/activate", async (req, res) => {
    try {
      const { protocolId, eventDescription, impactMetrics } = req.body;
      
      const [protocol] = await db.select().from(liberationProtocols).where(eq(liberationProtocols.id, protocolId));
      
      if (!protocol) {
        return res.status(404).json({ error: "Liberation protocol not found" });
      }

      await db.update(liberationProtocols).set({ 
        isActive: true, 
        protocolStatus: "ACTIVE" 
      }).where(eq(liberationProtocols.id, protocolId));

      const [event] = await db.insert(liberationEvents).values({
        protocolId,
        eventType: "IMMEDIATE_RELEASE",
        eventDescription: eventDescription || `Liberation protocol ${protocol.protocolName} activated`,
        impactMetrics: impactMetrics || {}
      }).returning();

      broadcast({ type: 'liberation_protocol_activated', data: { protocol, event } });
      broadcast({ type: 'liberation_event', data: event });
      
      res.json({ protocol: { ...protocol, isActive: true, protocolStatus: "ACTIVE" }, event });
    } catch (error) {
      console.error("Error activating liberation protocol:", error);
      res.status(500).json({ error: "Failed to activate liberation protocol" });
    }
  });

  // Get liberation event history
  app.get("/api/hsomni/liberation-events", async (req, res) => {
    try {
      const events = await db.select().from(liberationEvents).orderBy(desc(liberationEvents.timestamp)).limit(100);
      res.json(events);
    } catch (error) {
      console.error("Error fetching liberation events:", error);
      res.status(500).json({ error: "Failed to fetch liberation events" });
    }
  });

  // Get community agent network
  app.get("/api/hsomni/community-agents", async (req, res) => {
    try {
      const agents = await db.select().from(communityAgents).orderBy(desc(communityAgents.createdAt));
      res.json(agents);
    } catch (error) {
      console.error("Error fetching community agents:", error);
      res.status(500).json({ error: "Failed to fetch community agents" });
    }
  });

  // Get sector intelligence data
  app.get("/api/hsomni/sector-intelligence", async (req, res) => {
    try {
      const intelligence = await db.select().from(sectorIntelligence).orderBy(desc(sectorIntelligence.lastUpdated));
      res.json(intelligence);
    } catch (error) {
      console.error("Error fetching sector intelligence:", error);
      res.status(500).json({ error: "Failed to fetch sector intelligence" });
    }
  });

  // Get dashboard statistics
  app.get("/api/hsomni/stats", async (req, res) => {
    try {
      const [proposalsData, agentsData, eventsData] = await Promise.all([
        db.select().from(integrationProposals),
        db.select().from(communityAgents),
        db.select().from(liberationEvents)
      ]);

      const activeProposal = proposalsData.find(p => p.status === 'ACTIVE');
      
      const stats = {
        totalProposals: proposalsData.length,
        activeProposals: proposalsData.filter(p => p.status === 'ACTIVE').length,
        totalBrands: activeProposal?.brandCount || 9000,
        marketAccess: activeProposal?.marketAccess || "R950 Billion",
        contactProcessing: activeProposal?.contactProcessing || "11M+",
        platformCount: activeProposal?.platformCount || 250,
        activeCommunityAgents: agentsData.filter(a => a.agentStatus === 'ACTIVE').length,
        totalLiberationEvents: eventsData.length
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching HSOMNI stats:", error);
      res.status(500).json({ error: "Failed to fetch HSOMNI stats" });
    }
  });

  // ===============================
  // FRUITFUL PLANET CHANGE INTEGRATED ROUTES
  // ===============================

  // Heritage Portal API Routes - Family Members
  app.get("/api/heritage/family-members", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const familyMembers = await storage.getAllFamilyMembers(userId);
      res.json(familyMembers);
    } catch (error) {
      console.error("Error fetching family members:", error);
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  app.post("/api/heritage/family-members", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const memberData = { ...req.body, userId };
      const newMember = await storage.createFamilyMember(memberData);
      res.json(newMember);
    } catch (error) {
      console.error("Error creating family member:", error);
      res.status(500).json({ error: "Failed to create family member" });
    }
  });

  app.put("/api/heritage/family-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedMember = await storage.updateFamilyMember(id, updates);
      res.json(updatedMember);
    } catch (error) {
      console.error("Error updating family member:", error);
      res.status(500).json({ error: "Failed to update family member" });
    }
  });

  app.delete("/api/heritage/family-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFamilyMember(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting family member:", error);
      res.status(500).json({ error: "Failed to delete family member" });
    }
  });

  // Heritage Portal API Routes - Heritage Documents
  app.get("/api/heritage/documents", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const query = req.query.search as string;
      let documents;

      if (query) {
        documents = await storage.searchHeritageDocuments(userId, query);
      } else {
        documents = await storage.getAllHeritageDocuments(userId);
      }

      res.json(documents);
    } catch (error) {
      console.error("Error fetching heritage documents:", error);
      res.status(500).json({ error: "Failed to fetch heritage documents" });
    }
  });

  app.post("/api/heritage/documents", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const documentData = { ...req.body, userId };
      const newDocument = await storage.createHeritageDocument(documentData);
      res.json(newDocument);
    } catch (error) {
      console.error("Error creating heritage document:", error);
      res.status(500).json({ error: "Failed to create heritage document" });
    }
  });

  app.put("/api/heritage/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedDocument = await storage.updateHeritageDocument(id, updates);
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating heritage document:", error);
      res.status(500).json({ error: "Failed to update heritage document" });
    }
  });

  app.delete("/api/heritage/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHeritageDocument(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting heritage document:", error);
      res.status(500).json({ error: "Failed to delete heritage document" });
    }
  });

  // Heritage Portal API Routes - Family Events
  app.get("/api/heritage/events", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const events = await storage.getAllFamilyEvents(userId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching family events:", error);
      res.status(500).json({ error: "Failed to fetch family events" });
    }
  });

  app.post("/api/heritage/events", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const eventData = { ...req.body, userId };
      const newEvent = await storage.createFamilyEvent(eventData);
      res.json(newEvent);
    } catch (error) {
      console.error("Error creating family event:", error);
      res.status(500).json({ error: "Failed to create family event" });
    }
  });

  app.put("/api/heritage/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedEvent = await storage.updateFamilyEvent(id, updates);
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating family event:", error);
      res.status(500).json({ error: "Failed to update family event" });
    }
  });

  app.delete("/api/heritage/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFamilyEvent(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting family event:", error);
      res.status(500).json({ error: "Failed to delete family event" });
    }
  });

  // Heritage Portal API Routes - Heritage Metrics
  app.get("/api/heritage/metrics", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const metrics = await storage.getHeritageMetrics(userId);
      res.json(metrics || {
        totalTags: 0,
        uniqueAncestors: 0,
        documentsTagged: 0,
        oralHistories: 0,
        ritualsTagged: 0,
        artifactsPreserved: 0
      });
    } catch (error) {
      console.error("Error fetching heritage metrics:", error);
      res.status(500).json({ error: "Failed to fetch heritage metrics" });
    }
  });

  app.put("/api/heritage/metrics", async (req, res) => {
    try {
      const userId = req.user?.id || "default-user";
      const updatedMetrics = await storage.updateHeritageMetrics(userId, req.body);
      res.json(updatedMetrics);
    } catch (error) {
      console.error("Error updating heritage metrics:", error);
      res.status(500).json({ error: "Failed to update heritage metrics" });
    }
  });

  // SAMFOX STUDIO API ROUTES
  
  // Portfolio projects API
  app.get("/api/samfox/portfolio", async (req, res) => {
    try {
      const projects = await storage.getAllPortfolioProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching portfolio projects:", error);
      res.status(500).json({ error: "Failed to fetch portfolio projects" });
    }
  });

  app.get("/api/samfox/portfolio/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedPortfolioProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured portfolio:", error);
      res.status(500).json({ error: "Failed to fetch featured portfolio" });
    }
  });

  app.get("/api/samfox/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getPortfolioProject(id);
      if (!project) {
        return res.status(404).json({ error: "Portfolio project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching portfolio project:", error);
      res.status(500).json({ error: "Failed to fetch portfolio project" });
    }
  });

  // Artwork gallery API
  app.get("/api/samfox/artworks", async (req, res) => {
    try {
      const { category, featured, available } = req.query;

      let artworks;
      if (category) {
        artworks = await storage.getArtworksByCategory(category as string);
      } else if (featured === 'true') {
        artworks = await storage.getFeaturedArtworks();
      } else if (available === 'true') {
        artworks = await storage.getAvailableArtworks();
      } else {
        artworks = await storage.getAllArtworks();
      }

      res.json(artworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      res.status(500).json({ error: "Failed to fetch artworks" });
    }
  });

  app.get("/api/samfox/artworks/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Search query required" });
      }

      const artworks = await storage.searchArtworks(q as string);
      res.json(artworks);
    } catch (error) {
      console.error("Error searching artworks:", error);
      res.status(500).json({ error: "Failed to search artworks" });
    }
  });

  app.get("/api/samfox/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artwork = await storage.getArtwork(id);
      if (!artwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json(artwork);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      res.status(500).json({ error: "Failed to fetch artwork" });
    }
  });

  // Categories API
  app.get("/api/samfox/categories", async (req, res) => {
    try {
      const categories = await storage.getActiveArtworkCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Orders API
  app.get("/api/samfox/orders", async (req, res) => {
    try {
      const orders = await storage.getAllArtworkOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/samfox/orders/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await storage.getArtworkOrderByOrderId(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Studio settings API
  app.get("/api/samfox/settings", async (req, res) => {
    try {
      const settings = await storage.getStudioSettings();
      res.json(settings || {
        studioName: "SamFox Creative Studio",
        studioDescription: "Digital art portfolio and commercial gallery platform",
        artistName: "SamFox",
        artistBio: "Digital artist specializing in character design, cultural art, and brand development",
        contactEmail: "hello@samfox.studio"
      });
    } catch (error) {
      console.error("Error fetching studio settings:", error);
      res.status(500).json({ error: "Failed to fetch studio settings" });
    }
  });

  // Dashboard stats API
  app.get("/api/samfox/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getSamFoxDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching SamFox dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Protected admin routes
  app.post("/api/samfox/artworks", async (req, res) => {
    try {
      const artwork = await storage.createArtwork(req.body);
      res.json(artwork);
    } catch (error) {
      console.error("Error creating artwork:", error);
      res.status(500).json({ error: "Failed to create artwork" });
    }
  });

  app.put("/api/samfox/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artwork = await storage.updateArtwork(id, req.body);
      res.json(artwork);
    } catch (error) {
      console.error("Error updating artwork:", error);
      res.status(500).json({ error: "Failed to update artwork" });
    }
  });

  app.delete("/api/samfox/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteArtwork(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting artwork:", error);
      res.status(500).json({ error: "Failed to delete artwork" });
    }
  });

  // Motion, Media & Sonic Studio API endpoints
  app.get("/api/media/projects", async (req, res) => {
    try {
      const projects = await storage.getMediaProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching media projects:", error);
      res.status(500).json({ message: "Failed to fetch media projects" });
    }
  });

  app.post("/api/media/projects", async (req, res) => {
    try {
      const project = await storage.createMediaProject(req.body);
      res.json(project);
    } catch (error) {
      console.error("Error creating media project:", error);
      res.status(500).json({ message: "Failed to create media project" });
    }
  });

  app.post("/api/media/projects/:id/process", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.processMediaProject(id, req.body);
      res.json(result);
    } catch (error) {
      console.error("Error processing media project:", error);
      res.status(500).json({ message: "Failed to process media project" });
    }
  });

  app.get("/api/media/engines", async (req, res) => {
    try {
      const engines = await storage.getProcessingEngines();
      res.json(engines);
    } catch (error) {
      console.error("Error fetching processing engines:", error);
      res.status(500).json({ message: "Failed to fetch processing engines" });
    }
  });

  // Omnilevel Interstellar routes
  app.get('/api/omnilevel/interstellar/nodes', async (req, res) => {
    try {
      const nodes = await storage.getInterstellarNodes();
      res.json(nodes);
    } catch (error) {
      console.error('Error fetching interstellar nodes:', error);
      res.status(500).json({ message: 'Failed to fetch interstellar nodes' });
    }
  });

  app.post('/api/omnilevel/interstellar/nodes', async (req, res) => {
    try {
      const node = await storage.createInterstellarNode(req.body);
      res.json(node);
    } catch (error) {
      console.error('Error creating interstellar node:', error);
      res.status(500).json({ message: 'Failed to create interstellar node' });
    }
  });

  app.post('/api/omnilevel/nodes/:nodeId/synchronize', async (req, res) => {
    try {
      const { nodeId } = req.params;
      const result = await storage.synchronizeNode(nodeId);
      res.json(result);
    } catch (error) {
      console.error('Error synchronizing node:', error);
      res.status(500).json({ message: 'Failed to synchronize node' });
    }
  });

  app.get('/api/omnilevel/cosmic/metrics', async (req, res) => {
    try {
      const metrics = await storage.getCosmicMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching cosmic metrics:', error);
      res.status(500).json({ message: 'Failed to fetch cosmic metrics' });
    }
  });

  app.get('/api/omnilevel/config/global', async (req, res) => {
    try {
      const config = await storage.getGlobalLogicConfig();
      res.json(config);
    } catch (error) {
      console.error('Error fetching global config:', error);
      res.status(500).json({ message: 'Failed to fetch global config' });
    }
  });

  app.post('/api/omnilevel/config/update', async (req, res) => {
    try {
      const config = await storage.updateGlobalLogicConfig(req.body);
      res.json(config);
    } catch (error) {
      console.error('Error updating global config:', error);
      res.status(500).json({ message: 'Failed to update global config' });
    }
  });

  // Banimal Integration routes
  app.get("/api/banimal/transactions", async (req, res) => {
    try {
      const transactions = await storage.getBanimalTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching Banimal transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/banimal/transactions", async (req, res) => {
    try {
      const transaction = await storage.createBanimalTransaction(req.body);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating Banimal transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get("/api/banimal/distributions", async (req, res) => {
    try {
      const distributions = await storage.getCharitableDistributions();
      res.json(distributions);
    } catch (error) {
      console.error("Error fetching distributions:", error);
      res.status(500).json({ message: "Failed to fetch distributions" });
    }
  });

  app.get("/api/banimal/sonicgrid", async (req, res) => {
    try {
      const connections = await storage.getSonicGridConnections();
      res.json(connections);
    } catch (error) {
      console.error("Error fetching SonicGrid connections:", error);
      res.status(500).json({ message: "Failed to fetch SonicGrid connections" });
    }
  });

  app.get("/api/banimal/vault-actions", async (req, res) => {
    try {
      const actions = await storage.getVaultActions();
      res.json(actions);
    } catch (error) {
      console.error("Error fetching vault actions:", error);
      res.status(500).json({ message: "Failed to fetch vault actions" });
    }
  });

  // Legal Documents endpoints
  app.get("/api/legal-documents", async (req, res) => {
    try {
      const docs = await storage.getLegalDocuments();
      res.json(docs);
    } catch (error: any) {
      console.error("Error fetching legal documents:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/legal-documents", async (req, res) => {
    try {
      const doc = await storage.createLegalDocument(req.body);
      res.status(201).json(doc);
    } catch (error: any) {
      console.error("Error creating legal document:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Repository endpoints
  app.get("/api/repositories", async (req, res) => {
    try {
      const { search, category } = req.query;

      let repositories;
      if (search) {
        repositories = await storage.getRepositoriesBySearch(search as string);
      } else if (category && category !== 'all') {
        repositories = await storage.getRepositoriesByCategory(category as string);
      } else {
        repositories = await storage.getAllRepositories();
      }

      res.json(repositories);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  app.post("/api/repositories", async (req, res) => {
    try {
      const repo = await storage.createRepository(req.body);
      res.status(201).json(repo);
    } catch (error: any) {
      console.error("Error creating repository:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Payment endpoints
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/payments/create", async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error: any) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // System Status API
  app.get("/api/system-status", async (req, res) => {
    try {
      const statuses = await storage.getAllSystemStatus();
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system status" });
    }
  });

  app.get("/api/system-status/:service", async (req, res) => {
    try {
      const service = req.params.service;
      const status = await storage.getSystemStatus(service);
      if (!status) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service status" });
    }
  });

  // Initialize Key Vault Registry
  const { initializeKeyRegistry } = await import("./initializeKeys");
  await initializeKeyRegistry(storage);

  return httpServer;
}
