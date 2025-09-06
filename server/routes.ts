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
  insertOnboardingStepSchema
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

  return httpServer;
}
