import { 
  type User, 
  type InsertUser, 
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
  type InsertOnboardingStep
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
      vaultMeshStatus: "active",
      treatySyncStatus: "online",
      pulseGridStatus: "9s-sync",
      lastUpdated: new Date(),
    };
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
