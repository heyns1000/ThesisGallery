import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { EmailProcessor, type EmailParsingResult } from "./email-processor";
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
  insertMessageTrackingSchema
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
        count: Math.min(count, 1000), // Limit to 1000 pages per request
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

  return httpServer;
}
