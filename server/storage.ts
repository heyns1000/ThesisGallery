import { 
  type User, 
  type UpsertUser, 
  type Document, 
  type InsertDocument,
  type Gallery,
  type InsertGallery,
  type Conversation,
  type InsertConversation,
  type Brand,
  type InsertBrand,
  type ComplianceLog,
  type InsertComplianceLog,
  type ProcessingQueue,
  type InsertProcessingQueue,
  type SystemStats,
  type TeamMember,
  type InsertTeamMember,
  type TeamProject,
  type InsertTeamProject,
  type TeamTestimonial,
  type InsertTeamTestimonial,
  type OnboardingStep,
  type InsertOnboardingStep,
  type Contact,
  type InsertContact,
  type BanimalProduct,
  type InsertBanimalProduct,
  type BanimalOrder,
  type InsertBanimalOrder,
  type BanimalCustomer,
  type InsertBanimalCustomer,
  type DataImport,
  type InsertDataImport,
  type CrateDanceEvent,
  type InsertCrateDanceEvent,
  type CrateDanceContestant,
  type InsertCrateDanceContestant,
  type CrateDanceRegistration,
  type InsertCrateDanceRegistration,
  type CrateDanceJudge,
  type InsertCrateDanceJudge,
  type CrateDanceScore,
  type InsertCrateDanceScore,
  type CrateDanceSponsor,
  type InsertCrateDanceSponsor,
  type CrateDanceAudition,
  type InsertCrateDanceAudition,
  type EmailProvider,
  type InsertEmailProvider,
  type EmailTemplate,
  type InsertEmailTemplate,
  type EmailCampaign,
  type InsertEmailCampaign,
  type EmailSend,
  type InsertEmailSend,
  type EmailTracking,
  type InsertEmailTracking,
  // Multi-Channel Messaging Types
  type MessageChannel,
  type InsertMessageChannel,
  type MessageTemplate,
  type InsertMessageTemplate,
  type MessagingCampaign,
  type InsertMessagingCampaign,
  type MessageSend,
  type InsertMessageSend,
  type WhatsappConversation,
  type InsertWhatsappConversation,
  type SmsConversation,
  type InsertSmsConversation,
  type MessageTracking,
  type InsertMessageTracking
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;
  
  // Gallery methods
  getGalleryItems(): Promise<Gallery[]>;
  getGalleryItem(id: string): Promise<Gallery | undefined>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  deleteGalleryItem(id: string): Promise<boolean>;
  
  // Conversation methods
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  
  // Brand methods
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | undefined>;
  
  // Compliance methods
  getComplianceLogs(): Promise<ComplianceLog[]>;
  createComplianceLog(log: InsertComplianceLog): Promise<ComplianceLog>;
  
  // Processing queue methods
  getProcessingQueue(): Promise<ProcessingQueue[]>;
  createProcessingQueueItem(item: InsertProcessingQueue): Promise<ProcessingQueue>;
  updateProcessingQueueItem(id: string, updates: Partial<ProcessingQueue>): Promise<ProcessingQueue | undefined>;
  
  // Team management methods
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  getTeamMemberByMemberId(memberId: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: string): Promise<boolean>;
  
  // Team projects methods
  getTeamProjects(): Promise<TeamProject[]>;
  getTeamProject(id: string): Promise<TeamProject | undefined>;
  createTeamProject(project: InsertTeamProject): Promise<TeamProject>;
  updateTeamProject(id: string, updates: Partial<TeamProject>): Promise<TeamProject | undefined>;
  
  // Team testimonials methods
  getTeamTestimonials(): Promise<TeamTestimonial[]>;
  getTestimonialsForMember(memberId: string): Promise<TeamTestimonial[]>;
  createTeamTestimonial(testimonial: InsertTeamTestimonial): Promise<TeamTestimonial>;
  
  // Onboarding methods
  getOnboardingSteps(memberId: string): Promise<OnboardingStep[]>;
  createOnboardingStep(step: InsertOnboardingStep): Promise<OnboardingStep>;
  updateOnboardingStep(id: string, updates: Partial<OnboardingStep>): Promise<OnboardingStep | undefined>;
  
  // System stats
  getSystemStats(): Promise<SystemStats | undefined>;
  updateSystemStats(stats: Partial<SystemStats>): Promise<SystemStats>;

  // Contact management methods
  getContacts(filters?: { search?: string; status?: string; source?: string }): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, updates: Partial<Contact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;

  // Data import methods
  getDataImports(): Promise<DataImport[]>;
  getDataImport(id: string): Promise<DataImport | undefined>;
  createDataImport(dataImport: InsertDataImport): Promise<DataImport>;
  updateDataImport(id: string, updates: Partial<DataImport>): Promise<DataImport | undefined>;

  // Banimal e-commerce methods
  getBanimalProducts(): Promise<BanimalProduct[]>;
  getBanimalProduct(id: string): Promise<BanimalProduct | undefined>;
  createBanimalProduct(product: InsertBanimalProduct): Promise<BanimalProduct>;
  updateBanimalProduct(id: string, updates: Partial<BanimalProduct>): Promise<BanimalProduct | undefined>;

  getBanimalOrders(): Promise<BanimalOrder[]>;
  getBanimalOrder(id: string): Promise<BanimalOrder | undefined>;
  createBanimalOrder(order: InsertBanimalOrder): Promise<BanimalOrder>;
  updateBanimalOrder(id: string, updates: Partial<BanimalOrder>): Promise<BanimalOrder | undefined>;

  getBanimalCustomers(): Promise<BanimalCustomer[]>;
  getBanimalCustomer(id: string): Promise<BanimalCustomer | undefined>;
  getBanimalCustomerByEmail(email: string): Promise<BanimalCustomer | undefined>;
  createBanimalCustomer(customer: InsertBanimalCustomer): Promise<BanimalCustomer>;
  updateBanimalCustomer(id: string, updates: Partial<BanimalCustomer>): Promise<BanimalCustomer | undefined>;

  // ===============================
  // EMAIL SYSTEM METHODS
  // ===============================
  
  // Email provider methods
  getEmailProviders(): Promise<EmailProvider[]>;
  getEmailProvider(id: string): Promise<EmailProvider | undefined>;
  createEmailProvider(provider: InsertEmailProvider): Promise<EmailProvider>;
  updateEmailProvider(id: string, updates: Partial<EmailProvider>): Promise<EmailProvider | undefined>;
  deleteEmailProvider(id: string): Promise<boolean>;

  // Email template methods
  getEmailTemplates(): Promise<EmailTemplate[]>;
  getEmailTemplate(id: string): Promise<EmailTemplate | undefined>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: string): Promise<boolean>;

  // Email campaign methods
  getEmailCampaigns(): Promise<EmailCampaign[]>;
  getEmailCampaign(id: string): Promise<EmailCampaign | undefined>;
  createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign>;
  updateEmailCampaign(id: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign | undefined>;
  deleteEmailCampaign(id: string): Promise<boolean>;
  incrementCampaignOpens(campaignId: string): Promise<void>;
  incrementCampaignClicks(campaignId: string): Promise<void>;
  incrementCampaignUnsubscribes(campaignId: string): Promise<void>;

  // Email send methods
  getEmailSends(): Promise<EmailSend[]>;
  getEmailSend(id: string): Promise<EmailSend | undefined>;
  getEmailSendByTrackingId(trackingId: string): Promise<EmailSend | undefined>;
  createEmailSend(emailSend: InsertEmailSend): Promise<EmailSend>;
  updateEmailSend(id: string, updates: Partial<EmailSend>): Promise<EmailSend | undefined>;

  // Email tracking methods
  getEmailTrackings(): Promise<EmailTracking[]>;
  createEmailTracking(tracking: InsertEmailTracking): Promise<EmailTracking>;

  // Contact helper methods for email system
  getContactsByIds(contactIds: string[]): Promise<Contact[]>;

  // ===============================
  // MULTI-CHANNEL MESSAGING METHODS
  // ===============================

  // Message Channel methods
  getMessageChannels(): Promise<MessageChannel[]>;
  getMessageChannel(id: string): Promise<MessageChannel | undefined>;
  createMessageChannel(channel: InsertMessageChannel): Promise<MessageChannel>;
  updateMessageChannel(id: string, updates: Partial<MessageChannel>): Promise<MessageChannel | undefined>;

  // Message Template methods
  getMessageTemplates(): Promise<MessageTemplate[]>;
  getMessageTemplate(id: string): Promise<MessageTemplate | undefined>;
  getMessageTemplatesByChannel(channelType: string): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | undefined>;

  // Messaging Campaign methods
  getMessagingCampaigns(): Promise<MessagingCampaign[]>;
  getMessagingCampaign(id: string): Promise<MessagingCampaign | undefined>;
  getRecentMessagingCampaigns(limit: number): Promise<MessagingCampaign[]>;
  createMessagingCampaign(campaign: InsertMessagingCampaign): Promise<MessagingCampaign>;
  updateMessagingCampaign(id: string, updates: Partial<MessagingCampaign>): Promise<MessagingCampaign | undefined>;

  // Message Send methods
  getMessageSends(): Promise<MessageSend[]>;
  getMessageSend(id: string): Promise<MessageSend | undefined>;
  getMessageSendByExternalId(externalId: string): Promise<MessageSend | undefined>;
  getMessageSendByTrackingId(trackingId: string): Promise<MessageSend | undefined>;
  createMessageSend(send: InsertMessageSend): Promise<MessageSend>;
  updateMessageSend(id: string, updates: Partial<MessageSend>): Promise<MessageSend | undefined>;

  // WhatsApp Conversation methods
  getWhatsAppConversations(): Promise<WhatsappConversation[]>;
  getWhatsAppConversation(id: string): Promise<WhatsappConversation | undefined>;
  getWhatsAppConversationByNumber(whatsappNumber: string): Promise<WhatsappConversation | undefined>;
  createWhatsAppConversation(conversation: InsertWhatsappConversation): Promise<WhatsappConversation>;
  updateWhatsAppConversation(id: string, updates: Partial<WhatsappConversation>): Promise<WhatsappConversation | undefined>;

  // SMS Conversation methods
  getSMSConversations(): Promise<SmsConversation[]>;
  getSMSConversation(id: string): Promise<SmsConversation | undefined>;
  getSMSConversationByNumber(phoneNumber: string): Promise<SmsConversation | undefined>;
  createSMSConversation(conversation: InsertSmsConversation): Promise<SmsConversation>;
  updateSMSConversation(id: string, updates: Partial<SmsConversation>): Promise<SmsConversation | undefined>;

  // WhatsApp Message methods
  createWhatsAppMessage(messageData: any): Promise<any>;

  // SMS Message methods
  createSMSMessage(messageData: any): Promise<any>;

  // Message Tracking methods
  getMessageTrackings(): Promise<MessageTracking[]>;
  createMessageTracking(tracking: InsertMessageTracking): Promise<MessageTracking>;

  // Analytics methods
  getMessageAnalytics(channelType?: string, days?: number): Promise<any[]>;
  getChannelBreakdown(days: number): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private documents: Map<string, Document> = new Map();
  private galleries: Map<string, Gallery> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private brands: Map<string, Brand> = new Map();
  private complianceLogs: Map<string, ComplianceLog> = new Map();
  private processingQueue: Map<string, ProcessingQueue> = new Map();
  private teamMembers: Map<string, TeamMember> = new Map();
  private teamProjects: Map<string, TeamProject> = new Map();
  private teamTestimonials: Map<string, TeamTestimonial> = new Map();
  private onboardingSteps: Map<string, OnboardingStep> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private dataImports: Map<string, DataImport> = new Map();
  private banimalProducts: Map<string, BanimalProduct> = new Map();
  private banimalOrders: Map<string, BanimalOrder> = new Map();
  private banimalCustomers: Map<string, BanimalCustomer> = new Map();
  private emailProviders: Map<string, EmailProvider> = new Map();
  private emailTemplates: Map<string, EmailTemplate> = new Map();
  private emailCampaigns: Map<string, EmailCampaign> = new Map();
  private emailSends: Map<string, EmailSend> = new Map();
  private emailTrackings: Map<string, EmailTracking> = new Map();
  
  // Multi-Channel Messaging Storage
  private messageChannels: Map<string, MessageChannel> = new Map();
  private messageTemplates: Map<string, MessageTemplate> = new Map();
  private messagingCampaigns: Map<string, MessagingCampaign> = new Map();
  private messageSends: Map<string, MessageSend> = new Map();
  private whatsappConversations: Map<string, WhatsappConversation> = new Map();
  private smsConversations: Map<string, SmsConversation> = new Map();
  private whatsappMessages: Map<string, any> = new Map();
  private smsMessages: Map<string, any> = new Map();
  private messageTrackings: Map<string, MessageTracking> = new Map();
  
  private systemStats: SystemStats | undefined;

  constructor() {
    // Initialize with complete system stats
    this.systemStats = {
      id: randomUUID(),
      totalDocuments: 0,
      totalConversations: 0,
      totalBrands: 0,
      complianceScore: 99,
      totalWildlifeNodes: 0,
      totalAmericanStates: 0,
      totalGlobalOperations: 0,
      totalPayrollNodes: 0,
      totalAiModules: 0,
      totalMiningNodes: 0,
      totalMiningPlatforms: 0,
      totalTeamMembers: 0,
      totalProjects: 0,
      totalContacts: 0,
      totalCrateDanceEvents: 0,
      totalCrateDanceContestants: 0,
      totalCrateDanceRegistrations: 0,
      activeCrateDanceEvents: 0,
      crateDanceStatus: "active",
      vaultMeshStatus: "active",
      treatySyncStatus: "online",
      pulseGridStatus: "9s-sync",
      lastUpdated: new Date(),
    };
  }

  // User methods (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(userData.id!, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: userData.id!,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userData.id!, newUser);
      return newUser;
    }
  }

  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      uploadedAt: now,
      updatedAt: now,
      status: "processed",
      metadata: insertDocument.metadata || null,
      filePath: insertDocument.filePath || null,
    };
    this.documents.set(id, document);
    await this.updateStats();
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const deleted = this.documents.delete(id);
    if (deleted) await this.updateStats();
    return deleted;
  }

  // Gallery methods
  async getGalleryItems(): Promise<Gallery[]> {
    return Array.from(this.galleries.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getGalleryItem(id: string): Promise<Gallery | undefined> {
    return this.galleries.get(id);
  }

  async createGalleryItem(insertGallery: InsertGallery): Promise<Gallery> {
    const id = randomUUID();
    const gallery: Gallery = {
      ...insertGallery,
      id,
      uploadedAt: new Date(),
      metadata: insertGallery.metadata || null,
      description: insertGallery.description || null,
      tags: insertGallery.tags || null,
    };
    this.galleries.set(id, gallery);
    return gallery;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    return this.galleries.delete(id);
  }

  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      updatedAt: now,
      status: insertConversation.status || "active",
      messageCount: insertConversation.messageCount || null,
    };
    this.conversations.set(id, conversation);
    await this.updateStats();
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const existing = this.conversations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.conversations.set(id, updated);
    return updated;
  }

  // Brand methods
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const now = new Date();
    const brand: Brand = {
      ...insertBrand,
      id,
      createdAt: now,
      updatedAt: now,
      complianceScore: insertBrand.complianceScore || 100,
      metadata: insertBrand.metadata || null,
      valuation: insertBrand.valuation || null,
      trademarkStatus: insertBrand.trademarkStatus || null,
    };
    this.brands.set(id, brand);
    await this.updateStats();
    return brand;
  }

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | undefined> {
    const existing = this.brands.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.brands.set(id, updated);
    return updated;
  }

  // Compliance methods
  async getComplianceLogs(): Promise<ComplianceLog[]> {
    return Array.from(this.complianceLogs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createComplianceLog(insertLog: InsertComplianceLog): Promise<ComplianceLog> {
    const id = randomUUID();
    const log: ComplianceLog = {
      ...insertLog,
      id,
      createdAt: new Date(),
      brandId: insertLog.brandId || null,
      metadata: insertLog.metadata || null,
      details: insertLog.details || null,
    };
    this.complianceLogs.set(id, log);
    return log;
  }

  // Processing queue methods
  async getProcessingQueue(): Promise<ProcessingQueue[]> {
    return Array.from(this.processingQueue.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createProcessingQueueItem(insertItem: InsertProcessingQueue): Promise<ProcessingQueue> {
    const id = randomUUID();
    const now = new Date();
    const item: ProcessingQueue = {
      ...insertItem,
      id,
      createdAt: now,
      updatedAt: now,
      progress: insertItem.progress || 0,
      status: insertItem.status || "queued",
      estimatedTime: insertItem.estimatedTime || null,
      metadata: insertItem.metadata || null,
      description: insertItem.description || null,
    };
    this.processingQueue.set(id, item);
    return item;
  }

  async updateProcessingQueueItem(id: string, updates: Partial<ProcessingQueue>): Promise<ProcessingQueue | undefined> {
    const existing = this.processingQueue.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.processingQueue.set(id, updated);
    return updated;
  }

  // System stats
  async getSystemStats(): Promise<SystemStats | undefined> {
    return this.systemStats;
  }

  async updateSystemStats(updates: Partial<SystemStats>): Promise<SystemStats> {
    this.systemStats = {
      ...this.systemStats!,
      ...updates,
      lastUpdated: new Date(),
    };
    return this.systemStats;
  }

  // Team management methods
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    );
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async getTeamMemberByMemberId(memberId: string): Promise<TeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(
      (member) => member.memberId === memberId
    );
  }

  async createTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const id = randomUUID();
    const now = new Date();
    const member: TeamMember = {
      ...insertMember,
      id,
      joinDate: now,
      createdAt: now,
      updatedAt: now,
      onboardingStatus: insertMember.onboardingStatus || "pending",
      accessLevel: insertMember.accessLevel || "standard",
      status: insertMember.status || "active",
      profileImageUrl: insertMember.profileImageUrl || null,
      aboutImageUrl: insertMember.aboutImageUrl || null,
      projectImageUrl: insertMember.projectImageUrl || null,
      bio: insertMember.bio || null,
      specialization: insertMember.specialization || null,
      skills: insertMember.skills || null,
      experience: insertMember.experience || null,
      portfolioItems: insertMember.portfolioItems || null,
      socialLinks: insertMember.socialLinks || null,
      lastActive: null,
      metadata: insertMember.metadata || null,
    };
    this.teamMembers.set(id, member);
    await this.updateStats();
    return member;
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const existing = this.teamMembers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.teamMembers.set(id, updated);
    return updated;
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const deleted = this.teamMembers.delete(id);
    if (deleted) await this.updateStats();
    return deleted;
  }

  // Team projects methods
  async getTeamProjects(): Promise<TeamProject[]> {
    return Array.from(this.teamProjects.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTeamProject(id: string): Promise<TeamProject | undefined> {
    return this.teamProjects.get(id);
  }

  async createTeamProject(insertProject: InsertTeamProject): Promise<TeamProject> {
    const id = randomUUID();
    const now = new Date();
    const project: TeamProject = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
      status: insertProject.status || "active",
      priority: insertProject.priority || "normal",
      progress: insertProject.progress || 0,
      description: insertProject.description || null,
      teamMemberIds: insertProject.teamMemberIds || null,
      leadMemberId: insertProject.leadMemberId || null,
      technologies: insertProject.technologies || null,
      imageUrl: insertProject.imageUrl || null,
      demoUrl: insertProject.demoUrl || null,
      repositoryUrl: insertProject.repositoryUrl || null,
      startDate: insertProject.startDate || null,
      endDate: insertProject.endDate || null,
      metadata: insertProject.metadata || null,
    };
    this.teamProjects.set(id, project);
    await this.updateStats();
    return project;
  }

  async updateTeamProject(id: string, updates: Partial<TeamProject>): Promise<TeamProject | undefined> {
    const existing = this.teamProjects.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.teamProjects.set(id, updated);
    return updated;
  }

  // Team testimonials methods
  async getTeamTestimonials(): Promise<TeamTestimonial[]> {
    return Array.from(this.teamTestimonials.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTestimonialsForMember(memberId: string): Promise<TeamTestimonial[]> {
    return Array.from(this.teamTestimonials.values())
      .filter(testimonial => testimonial.aboutMemberId === memberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTeamTestimonial(insertTestimonial: InsertTeamTestimonial): Promise<TeamTestimonial> {
    const id = randomUUID();
    const testimonial: TeamTestimonial = {
      ...insertTestimonial,
      id,
      createdAt: new Date(),
      rating: insertTestimonial.rating || 5,
      isPublic: insertTestimonial.isPublic !== undefined ? insertTestimonial.isPublic : true,
      projectId: insertTestimonial.projectId || null,
      metadata: insertTestimonial.metadata || null,
    };
    this.teamTestimonials.set(id, testimonial);
    return testimonial;
  }

  // Onboarding methods
  async getOnboardingSteps(memberId: string): Promise<OnboardingStep[]> {
    return Array.from(this.onboardingSteps.values())
      .filter(step => step.memberId === memberId)
      .sort((a, b) => a.stepOrder - b.stepOrder);
  }

  async createOnboardingStep(insertStep: InsertOnboardingStep): Promise<OnboardingStep> {
    const id = randomUUID();
    const step: OnboardingStep = {
      ...insertStep,
      id,
      createdAt: new Date(),
      status: insertStep.status || "pending",
      isRequired: insertStep.isRequired !== undefined ? insertStep.isRequired : true,
      stepDescription: insertStep.stepDescription || null,
      completedAt: null,
      metadata: insertStep.metadata || null,
    };
    this.onboardingSteps.set(id, step);
    return step;
  }

  async updateOnboardingStep(id: string, updates: Partial<OnboardingStep>): Promise<OnboardingStep | undefined> {
    const existing = this.onboardingSteps.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    if (updates.status === "completed" && !existing.completedAt) {
      updated.completedAt = new Date();
    }
    this.onboardingSteps.set(id, updated);
    return updated;
  }

  // Contact management methods
  async getContacts(filters?: { search?: string; status?: string; source?: string }): Promise<Contact[]> {
    let contacts = Array.from(this.contacts.values());
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      contacts = contacts.filter(contact => 
        contact.fullName?.toLowerCase().includes(search) ||
        contact.email?.toLowerCase().includes(search) ||
        contact.company?.toLowerCase().includes(search) ||
        contact.firstName?.toLowerCase().includes(search) ||
        contact.lastName?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.status && filters.status !== 'all') {
      contacts = contacts.filter(contact => contact.status === filters.status);
    }
    
    if (filters?.source && filters.source !== 'all') {
      contacts = contacts.filter(contact => contact.source === filters.source);
    }
    
    return contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const now = new Date();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: now,
      updatedAt: now,
      leadScore: insertContact.leadScore || 0,
      status: insertContact.status || "active",
      socialProfiles: insertContact.socialProfiles || null,
      tags: insertContact.tags || null,
      customFields: insertContact.customFields || null,
      lastContactDate: insertContact.lastContactDate || null,
      firstName: insertContact.firstName || null,
      lastName: insertContact.lastName || null,
      fullName: insertContact.fullName || null,
      email: insertContact.email || null,
      phone: insertContact.phone || null,
      company: insertContact.company || null,
      position: insertContact.position || null,
      country: insertContact.country || null,
      city: insertContact.city || null,
      address: insertContact.address || null,
      website: insertContact.website || null,
      industry: insertContact.industry || null,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | undefined> {
    const existing = this.contacts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Data import methods
  async getDataImports(): Promise<DataImport[]> {
    return Array.from(this.dataImports.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getDataImport(id: string): Promise<DataImport | undefined> {
    return this.dataImports.get(id);
  }

  async createDataImport(insertDataImport: InsertDataImport): Promise<DataImport> {
    const id = randomUUID();
    const dataImport: DataImport = {
      ...insertDataImport,
      id,
      createdAt: new Date(),
      processedRecords: insertDataImport.processedRecords || 0,
      successfulRecords: insertDataImport.successfulRecords || 0,
      failedRecords: insertDataImport.failedRecords || 0,
      duplicateRecords: insertDataImport.duplicateRecords || 0,
      status: insertDataImport.status || "pending",
      errors: insertDataImport.errors || null,
      summary: insertDataImport.summary || null,
      startedAt: insertDataImport.startedAt || null,
      completedAt: insertDataImport.completedAt || null,
      fileSize: insertDataImport.fileSize || null,
      totalRecords: insertDataImport.totalRecords || null,
    };
    this.dataImports.set(id, dataImport);
    return dataImport;
  }

  async updateDataImport(id: string, updates: Partial<DataImport>): Promise<DataImport | undefined> {
    const existing = this.dataImports.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.dataImports.set(id, updated);
    return updated;
  }

  // Banimal e-commerce methods
  async getBanimalProducts(): Promise<BanimalProduct[]> {
    return Array.from(this.banimalProducts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBanimalProduct(id: string): Promise<BanimalProduct | undefined> {
    return this.banimalProducts.get(id);
  }

  async createBanimalProduct(insertProduct: InsertBanimalProduct): Promise<BanimalProduct> {
    const id = randomUUID();
    const now = new Date();
    const product: BanimalProduct = {
      ...insertProduct,
      id,
      createdAt: now,
      updatedAt: now,
      currency: insertProduct.currency || "ZAR",
      inventory: insertProduct.inventory || 0,
      status: insertProduct.status || "active",
      images: insertProduct.images || null,
      variants: insertProduct.variants || null,
      specifications: insertProduct.specifications || null,
      seoTitle: insertProduct.seoTitle || null,
      seoDescription: insertProduct.seoDescription || null,
      tags: insertProduct.tags || null,
      description: insertProduct.description || null,
      subcategory: insertProduct.subcategory || null,
    };
    this.banimalProducts.set(id, product);
    return product;
  }

  async updateBanimalProduct(id: string, updates: Partial<BanimalProduct>): Promise<BanimalProduct | undefined> {
    const existing = this.banimalProducts.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.banimalProducts.set(id, updated);
    return updated;
  }

  async getBanimalOrders(): Promise<BanimalOrder[]> {
    return Array.from(this.banimalOrders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBanimalOrder(id: string): Promise<BanimalOrder | undefined> {
    return this.banimalOrders.get(id);
  }

  async createBanimalOrder(insertOrder: InsertBanimalOrder): Promise<BanimalOrder> {
    const id = randomUUID();
    const now = new Date();
    const order: BanimalOrder = {
      ...insertOrder,
      id,
      createdAt: now,
      updatedAt: now,
      currency: insertOrder.currency || "ZAR",
      paymentStatus: insertOrder.paymentStatus || "pending",
      orderStatus: insertOrder.orderStatus || "pending",
      shippingCost: insertOrder.shippingCost || "0",
      taxAmount: insertOrder.taxAmount || "0",
      discountAmount: insertOrder.discountAmount || "0",
      customerPhone: insertOrder.customerPhone || null,
      billingAddress: insertOrder.billingAddress || null,
      trackingNumber: insertOrder.trackingNumber || null,
      shippingProvider: insertOrder.shippingProvider || null,
      paymentMethod: insertOrder.paymentMethod || null,
      notes: insertOrder.notes || null,
      metadata: insertOrder.metadata || null,
    };
    this.banimalOrders.set(id, order);
    return order;
  }

  async updateBanimalOrder(id: string, updates: Partial<BanimalOrder>): Promise<BanimalOrder | undefined> {
    const existing = this.banimalOrders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.banimalOrders.set(id, updated);
    return updated;
  }

  async getBanimalCustomers(): Promise<BanimalCustomer[]> {
    return Array.from(this.banimalCustomers.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBanimalCustomer(id: string): Promise<BanimalCustomer | undefined> {
    return this.banimalCustomers.get(id);
  }

  async getBanimalCustomerByEmail(email: string): Promise<BanimalCustomer | undefined> {
    return Array.from(this.banimalCustomers.values()).find(
      (customer) => customer.email === email
    );
  }

  async createBanimalCustomer(insertCustomer: InsertBanimalCustomer): Promise<BanimalCustomer> {
    const id = randomUUID();
    const now = new Date();
    const customer: BanimalCustomer = {
      ...insertCustomer,
      id,
      createdAt: now,
      updatedAt: now,
      loyaltyPoints: insertCustomer.loyaltyPoints || 0,
      totalSpent: insertCustomer.totalSpent || "0",
      orderCount: insertCustomer.orderCount || 0,
      status: insertCustomer.status || "active",
      customerSince: insertCustomer.customerSince || now,
      marketingOptIn: insertCustomer.marketingOptIn !== undefined ? insertCustomer.marketingOptIn : false,
      firstName: insertCustomer.firstName || null,
      lastName: insertCustomer.lastName || null,
      phone: insertCustomer.phone || null,
      dateOfBirth: insertCustomer.dateOfBirth || null,
      addresses: insertCustomer.addresses || null,
      preferences: insertCustomer.preferences || null,
      lastOrderDate: insertCustomer.lastOrderDate || null,
      metadata: insertCustomer.metadata || null,
    };
    this.banimalCustomers.set(id, customer);
    return customer;
  }

  async updateBanimalCustomer(id: string, updates: Partial<BanimalCustomer>): Promise<BanimalCustomer | undefined> {
    const existing = this.banimalCustomers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.banimalCustomers.set(id, updated);
    return updated;
  }

  // ===============================
  // EMAIL SYSTEM METHODS
  // ===============================

  // Email provider methods
  async getEmailProviders(): Promise<EmailProvider[]> {
    return Array.from(this.emailProviders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEmailProvider(id: string): Promise<EmailProvider | undefined> {
    return this.emailProviders.get(id);
  }

  async createEmailProvider(insertProvider: InsertEmailProvider): Promise<EmailProvider> {
    const id = randomUUID();
    const now = new Date();
    const provider: EmailProvider = {
      ...insertProvider,
      id,
      createdAt: now,
      updatedAt: now,
      isActive: insertProvider.isActive !== undefined ? insertProvider.isActive : true,
      metadata: insertProvider.metadata || null
    };
    this.emailProviders.set(id, provider);
    return provider;
  }

  async updateEmailProvider(id: string, updates: Partial<EmailProvider>): Promise<EmailProvider | undefined> {
    const existing = this.emailProviders.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.emailProviders.set(id, updated);
    return updated;
  }

  async deleteEmailProvider(id: string): Promise<boolean> {
    return this.emailProviders.delete(id);
  }

  // Email template methods
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.emailTemplates.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEmailTemplate(id: string): Promise<EmailTemplate | undefined> {
    return this.emailTemplates.get(id);
  }

  async createEmailTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    const id = randomUUID();
    const now = new Date();
    const template: EmailTemplate = {
      ...insertTemplate,
      id,
      createdAt: now,
      updatedAt: now,
      category: insertTemplate.category || "general",
      isActive: insertTemplate.isActive !== undefined ? insertTemplate.isActive : true,
      variables: insertTemplate.variables || [],
      textContent: insertTemplate.textContent || null,
      metadata: insertTemplate.metadata || null
    };
    this.emailTemplates.set(id, template);
    return template;
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const existing = this.emailTemplates.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.emailTemplates.set(id, updated);
    return updated;
  }

  async deleteEmailTemplate(id: string): Promise<boolean> {
    return this.emailTemplates.delete(id);
  }

  // Email campaign methods
  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    return Array.from(this.emailCampaigns.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEmailCampaign(id: string): Promise<EmailCampaign | undefined> {
    return this.emailCampaigns.get(id);
  }

  async createEmailCampaign(insertCampaign: InsertEmailCampaign): Promise<EmailCampaign> {
    const id = randomUUID();
    const now = new Date();
    const campaign: EmailCampaign = {
      ...insertCampaign,
      id,
      createdAt: now,
      updatedAt: now,
      status: insertCampaign.status || "draft",
      scheduleType: insertCampaign.scheduleType || "immediate",
      totalRecipients: insertCampaign.totalRecipients || 0,
      sentCount: 0,
      deliveredCount: 0,
      openCount: 0,
      clickCount: 0,
      bounceCount: 0,
      unsubscribeCount: 0,
      scheduledAt: insertCampaign.scheduledAt || null,
      sentAt: null,
      description: insertCampaign.description || null,
      targetAudience: insertCampaign.targetAudience || null,
      metadata: insertCampaign.metadata || null
    };
    this.emailCampaigns.set(id, campaign);
    return campaign;
  }

  async updateEmailCampaign(id: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign | undefined> {
    const existing = this.emailCampaigns.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.emailCampaigns.set(id, updated);
    return updated;
  }

  async deleteEmailCampaign(id: string): Promise<boolean> {
    return this.emailCampaigns.delete(id);
  }

  async incrementCampaignOpens(campaignId: string): Promise<void> {
    const campaign = this.emailCampaigns.get(campaignId);
    if (campaign) {
      campaign.openCount = (campaign.openCount || 0) + 1;
      campaign.updatedAt = new Date();
      this.emailCampaigns.set(campaignId, campaign);
    }
  }

  async incrementCampaignClicks(campaignId: string): Promise<void> {
    const campaign = this.emailCampaigns.get(campaignId);
    if (campaign) {
      campaign.clickCount = (campaign.clickCount || 0) + 1;
      campaign.updatedAt = new Date();
      this.emailCampaigns.set(campaignId, campaign);
    }
  }

  async incrementCampaignUnsubscribes(campaignId: string): Promise<void> {
    const campaign = this.emailCampaigns.get(campaignId);
    if (campaign) {
      campaign.unsubscribeCount = (campaign.unsubscribeCount || 0) + 1;
      campaign.updatedAt = new Date();
      this.emailCampaigns.set(campaignId, campaign);
    }
  }

  // Email send methods
  async getEmailSends(): Promise<EmailSend[]> {
    return Array.from(this.emailSends.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEmailSend(id: string): Promise<EmailSend | undefined> {
    return this.emailSends.get(id);
  }

  async getEmailSendByTrackingId(trackingId: string): Promise<EmailSend | undefined> {
    return Array.from(this.emailSends.values()).find(
      send => send.trackingId === trackingId
    );
  }

  async createEmailSend(insertSend: InsertEmailSend): Promise<EmailSend> {
    const id = randomUUID();
    const now = new Date();
    const send: EmailSend = {
      ...insertSend,
      id,
      createdAt: now,
      status: insertSend.status || "pending",
      sentAt: null,
      deliveredAt: null,
      openedAt: null,
      clickedAt: null,
      unsubscribedAt: null,
      bounceReason: null,
      messageId: insertSend.messageId || null,
      personalizedContent: insertSend.personalizedContent || null,
      metadata: insertSend.metadata || null
    };
    this.emailSends.set(id, send);
    return send;
  }

  async updateEmailSend(id: string, updates: Partial<EmailSend>): Promise<EmailSend | undefined> {
    const existing = this.emailSends.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.emailSends.set(id, updated);
    return updated;
  }

  // Email tracking methods
  async getEmailTrackings(): Promise<EmailTracking[]> {
    return Array.from(this.emailTrackings.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async createEmailTracking(insertTracking: InsertEmailTracking): Promise<EmailTracking> {
    const id = randomUUID();
    const tracking: EmailTracking = {
      ...insertTracking,
      id,
      timestamp: new Date(),
      userAgent: insertTracking.userAgent || null,
      ipAddress: insertTracking.ipAddress || null,
      eventData: insertTracking.eventData || null,
      metadata: insertTracking.metadata || null
    };
    this.emailTrackings.set(id, tracking);
    return tracking;
  }

  // Contact helper methods for email system
  async getContactsByIds(contactIds: string[]): Promise<Contact[]> {
    const contacts: Contact[] = [];
    for (const id of contactIds) {
      const contact = this.contacts.get(id);
      if (contact) {
        contacts.push(contact);
      }
    }
    return contacts;
  }

  // ===============================
  // MULTI-CHANNEL MESSAGING IMPLEMENTATIONS
  // ===============================

  // Message Channel methods
  async getMessageChannels(): Promise<MessageChannel[]> {
    return Array.from(this.messageChannels.values());
  }

  async getMessageChannel(id: string): Promise<MessageChannel | undefined> {
    return this.messageChannels.get(id);
  }

  async createMessageChannel(insertChannel: InsertMessageChannel): Promise<MessageChannel> {
    const id = randomUUID();
    const channel: MessageChannel = {
      ...insertChannel,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: insertChannel.isActive ?? true,
      rateLimits: insertChannel.rateLimits || null,
      metadata: insertChannel.metadata || null
    };
    this.messageChannels.set(id, channel);
    return channel;
  }

  async updateMessageChannel(id: string, updates: Partial<MessageChannel>): Promise<MessageChannel | undefined> {
    const channel = this.messageChannels.get(id);
    if (!channel) return undefined;
    
    const updated: MessageChannel = {
      ...channel,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.messageChannels.set(id, updated);
    return updated;
  }

  // Message Template methods
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values());
  }

  async getMessageTemplate(id: string): Promise<MessageTemplate | undefined> {
    return this.messageTemplates.get(id);
  }

  async getMessageTemplatesByChannel(channelType: string): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values()).filter(t => t.channelType === channelType);
  }

  async createMessageTemplate(insertTemplate: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = randomUUID();
    const template: MessageTemplate = {
      ...insertTemplate,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: insertTemplate.isActive ?? true,
      approvalStatus: insertTemplate.approvalStatus || 'approved',
      whatsappTemplateId: insertTemplate.whatsappTemplateId || null,
      metadata: insertTemplate.metadata || null
    };
    this.messageTemplates.set(id, template);
    return template;
  }

  async updateMessageTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | undefined> {
    const template = this.messageTemplates.get(id);
    if (!template) return undefined;
    
    const updated: MessageTemplate = {
      ...template,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.messageTemplates.set(id, updated);
    return updated;
  }

  // Messaging Campaign methods
  async getMessagingCampaigns(): Promise<MessagingCampaign[]> {
    return Array.from(this.messagingCampaigns.values());
  }

  async getMessagingCampaign(id: string): Promise<MessagingCampaign | undefined> {
    return this.messagingCampaigns.get(id);
  }

  async getRecentMessagingCampaigns(limit: number): Promise<MessagingCampaign[]> {
    const campaigns = Array.from(this.messagingCampaigns.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return campaigns.slice(0, limit);
  }

  async createMessagingCampaign(insertCampaign: InsertMessagingCampaign): Promise<MessagingCampaign> {
    const id = randomUUID();
    const campaign: MessagingCampaign = {
      ...insertCampaign,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertCampaign.status || 'draft',
      scheduleType: insertCampaign.scheduleType || 'immediate',
      totalRecipients: 0,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      clickCount: 0,
      responseCount: 0,
      failedCount: 0,
      sentAt: null,
      scheduledAt: insertCampaign.scheduledAt || null,
      targetAudience: insertCampaign.targetAudience || null,
      metadata: insertCampaign.metadata || null
    };
    this.messagingCampaigns.set(id, campaign);
    return campaign;
  }

  async updateMessagingCampaign(id: string, updates: Partial<MessagingCampaign>): Promise<MessagingCampaign | undefined> {
    const campaign = this.messagingCampaigns.get(id);
    if (!campaign) return undefined;
    
    const updated: MessagingCampaign = {
      ...campaign,
      ...updates,
      id,
      updatedAt: new Date()
    };
    this.messagingCampaigns.set(id, updated);
    return updated;
  }

  // Message Send methods
  async getMessageSends(): Promise<MessageSend[]> {
    return Array.from(this.messageSends.values());
  }

  async getMessageSend(id: string): Promise<MessageSend | undefined> {
    return this.messageSends.get(id);
  }

  async getMessageSendByExternalId(externalId: string): Promise<MessageSend | undefined> {
    return Array.from(this.messageSends.values()).find(s => s.externalMessageId === externalId);
  }

  async getMessageSendByTrackingId(trackingId: string): Promise<MessageSend | undefined> {
    return Array.from(this.messageSends.values()).find(s => s.trackingId === trackingId);
  }

  async createMessageSend(insertSend: InsertMessageSend): Promise<MessageSend> {
    const id = randomUUID();
    const send: MessageSend = {
      ...insertSend,
      id,
      createdAt: new Date(),
      status: insertSend.status || 'pending',
      sentAt: null,
      deliveredAt: null,
      readAt: null,
      repliedAt: null,
      failureReason: null,
      externalMessageId: null,
      whatsappMessageData: insertSend.whatsappMessageData || null,
      smsMessageData: insertSend.smsMessageData || null,
      pushMessageData: insertSend.pushMessageData || null,
      metadata: insertSend.metadata || null
    };
    this.messageSends.set(id, send);
    return send;
  }

  async updateMessageSend(id: string, updates: Partial<MessageSend>): Promise<MessageSend | undefined> {
    const send = this.messageSends.get(id);
    if (!send) return undefined;
    
    const updated: MessageSend = {
      ...send,
      ...updates,
      id
    };
    this.messageSends.set(id, updated);
    return updated;
  }

  // WhatsApp Conversation methods
  async getWhatsAppConversations(): Promise<WhatsappConversation[]> {
    return Array.from(this.whatsappConversations.values());
  }

  async getWhatsAppConversation(id: string): Promise<WhatsappConversation | undefined> {
    return this.whatsappConversations.get(id);
  }

  async getWhatsAppConversationByNumber(whatsappNumber: string): Promise<WhatsappConversation | undefined> {
    return Array.from(this.whatsappConversations.values()).find(c => c.whatsappNumber === whatsappNumber);
  }

  async createWhatsAppConversation(insertConversation: InsertWhatsappConversation): Promise<WhatsappConversation> {
    const id = randomUUID();
    const conversation: WhatsappConversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      conversationStatus: insertConversation.conversationStatus || 'active',
      lastMessageAt: null,
      messageCount: 0,
      isBusinessInitiated: insertConversation.isBusinessInitiated ?? true,
      sessionStart: new Date(),
      sessionEnd: null,
      metadata: insertConversation.metadata || null
    };
    this.whatsappConversations.set(id, conversation);
    return conversation;
  }

  async updateWhatsAppConversation(id: string, updates: Partial<WhatsappConversation>): Promise<WhatsappConversation | undefined> {
    const conversation = this.whatsappConversations.get(id);
    if (!conversation) return undefined;
    
    const updated: WhatsappConversation = {
      ...conversation,
      ...updates,
      id
    };
    this.whatsappConversations.set(id, updated);
    return updated;
  }

  // SMS Conversation methods
  async getSMSConversations(): Promise<SmsConversation[]> {
    return Array.from(this.smsConversations.values());
  }

  async getSMSConversation(id: string): Promise<SmsConversation | undefined> {
    return this.smsConversations.get(id);
  }

  async getSMSConversationByNumber(phoneNumber: string): Promise<SmsConversation | undefined> {
    return Array.from(this.smsConversations.values()).find(c => c.phoneNumber === phoneNumber);
  }

  async createSMSConversation(insertConversation: InsertSmsConversation): Promise<SmsConversation> {
    const id = randomUUID();
    const conversation: SmsConversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      conversationStatus: insertConversation.conversationStatus || 'active',
      lastMessageAt: null,
      messageCount: 0,
      twilioPhoneNumber: insertConversation.twilioPhoneNumber || null,
      metadata: insertConversation.metadata || null
    };
    this.smsConversations.set(id, conversation);
    return conversation;
  }

  async updateSMSConversation(id: string, updates: Partial<SmsConversation>): Promise<SmsConversation | undefined> {
    const conversation = this.smsConversations.get(id);
    if (!conversation) return undefined;
    
    const updated: SmsConversation = {
      ...conversation,
      ...updates,
      id
    };
    this.smsConversations.set(id, updated);
    return updated;
  }

  // WhatsApp & SMS Message methods
  async createWhatsAppMessage(messageData: any): Promise<any> {
    const id = randomUUID();
    const message = {
      ...messageData,
      id,
      timestamp: new Date()
    };
    this.whatsappMessages.set(id, message);
    return message;
  }

  async createSMSMessage(messageData: any): Promise<any> {
    const id = randomUUID();
    const message = {
      ...messageData,
      id,
      timestamp: new Date()
    };
    this.smsMessages.set(id, message);
    return message;
  }

  // Message Tracking methods
  async getMessageTrackings(): Promise<MessageTracking[]> {
    return Array.from(this.messageTrackings.values());
  }

  async createMessageTracking(insertTracking: InsertMessageTracking): Promise<MessageTracking> {
    const id = randomUUID();
    const tracking: MessageTracking = {
      ...insertTracking,
      id,
      timestamp: new Date(),
      userAgent: insertTracking.userAgent || null,
      ipAddress: insertTracking.ipAddress || null,
      eventData: insertTracking.eventData || null,
      metadata: insertTracking.metadata || null
    };
    this.messageTrackings.set(id, tracking);
    return tracking;
  }

  // Analytics methods
  async getMessageAnalytics(channelType?: string, days: number = 30): Promise<any[]> {
    // Mock analytics data - in real implementation this would aggregate actual data
    const analytics = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      analytics.push({
        channelType: channelType || 'all',
        date: date.toISOString().split('T')[0],
        totalSent: Math.floor(Math.random() * 100),
        totalDelivered: Math.floor(Math.random() * 90),
        totalRead: Math.floor(Math.random() * 70),
        totalReplied: Math.floor(Math.random() * 20),
        totalFailed: Math.floor(Math.random() * 10)
      });
    }
    
    return analytics;
  }

  async getChannelBreakdown(days: number): Promise<any[]> {
    return [
      { channelType: 'email', totalSent: 1250, deliveryRate: 98.5, responseRate: 12.3 },
      { channelType: 'whatsapp', totalSent: 890, deliveryRate: 99.2, responseRate: 35.7 },
      { channelType: 'sms', totalSent: 456, deliveryRate: 97.8, responseRate: 8.9 },
      { channelType: 'push', totalSent: 2340, deliveryRate: 94.2, responseRate: 5.1 }
    ];
  }

  private async updateStats(): Promise<void> {
    if (this.systemStats) {
      this.systemStats.totalDocuments = this.documents.size;
      this.systemStats.totalConversations = this.conversations.size;
      this.systemStats.totalBrands = this.brands.size;
      this.systemStats.totalTeamMembers = this.teamMembers.size;
      this.systemStats.totalProjects = this.teamProjects.size;
      this.systemStats.lastUpdated = new Date();
    }
  }
}

export const storage = new MemStorage();
