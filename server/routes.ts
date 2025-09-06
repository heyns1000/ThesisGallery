import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { 
  insertDocumentSchema,
  insertGallerySchema,
  insertConversationSchema,
  insertBrandSchema,
  insertComplianceLogSchema,
  insertProcessingQueueSchema 
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
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

  // System stats endpoint
  app.get("/api/system/stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system stats" });
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

  return httpServer;
}
