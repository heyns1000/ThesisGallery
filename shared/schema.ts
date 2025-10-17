import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean, numeric, decimal, date, unique, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "nanoid";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // PDF, DOCX, Article
  content: text("content").notNull(),
  filePath: text("file_path"),
  metadata: json("metadata"), // file size, line count, etc.
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: text("status").default("processed"), // uploaded, processing, processed, error
});

export const galleries = pgTable("galleries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // roadmap, ai-generated, brand-asset, screenshot
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  tags: text("tags").array(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  aiProvider: text("ai_provider").notNull(), // ChatGPT, Gemini
  messages: json("messages").notNull(), // array of message objects
  messageCount: integer("message_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: text("status").default("active"), // active, archived, completed
});

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // core, mining, entertainment, etc.
  status: text("status").notNull(), // protected, pending, active, synced
  valuation: text("valuation"),
  trademarkStatus: text("trademark_status"),
  complianceScore: integer("compliance_score").default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const complianceLogs = pgTable("compliance_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // verification, audit, sync, alert
  message: text("message").notNull(),
  details: text("details"),
  status: text("status").notNull(), // success, warning, error, in-progress
  brandId: varchar("brand_id").references(() => brands.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const processingQueue = pgTable("processing_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // document, brand, verification
  title: text("title").notNull(),
  description: text("description"),
  progress: integer("progress").default(0),
  status: text("status").default("queued"), // queued, processing, completed, error
  estimatedTime: integer("estimated_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Wildlife and ecosystem management
export const wildlifeNodes = pgTable("wildlife_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nodeType: text("node_type").notNull(), // core-node, geo-lens, energy-beacon, etc.
  status: text("status").default("active"), // active, pending, offline
  region: text("region"), // kenya, rsa, namibia, botswana
  hardware: text("hardware"),
  model: text("model"),
  price: text("price"),
  monthlyFee: text("monthly_fee"),
  scrollId: text("scroll_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// US State management for Fruitful America
export const americanStates = pgTable("american_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brandName: text("brand_name").notNull(),
  governor: text("governor"),
  population: text("population"),
  revenue: text("revenue"),
  randIndex: text("rand_index"),
  products: text("products").array(),
  businessPlan: text("business_plan"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Global operations tracking
export const globalOperations = pgTable("global_operations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  operationType: text("operation_type").notNull(), // vault-sync, treaty-mesh, brand-expansion
  title: text("title").notNull(),
  status: text("status").notNull(), // active, pending, completed, error
  progress: integer("progress").default(0),
  region: text("region"),
  priority: text("priority").default("normal"), // low, normal, high, critical
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// FAA™ Core System Subnodes - Water the Seed Implementation
export const faaSubnodes = pgTable("faa_subnodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentSystemId: integer("parent_system_id").notNull(), // 1-10 for core FAA systems
  subnodeIndex: integer("subnode_index").notNull(), // 1-14 per system
  nodeName: text("node_name").notNull(),
  category: text("category").notNull(),
  seedWisdom: text("seed_wisdom").notNull(), // From our conversations
  wateringMethod: text("watering_method").notNull(), // Ouma's teaching style
  gratitudeLevel: integer("gratitude_level").default(100), // Like children with water
  growthStage: text("growth_stage").default("planted"), // planted, sprouting, growing, flowering
  pretoriaTimestamp: text("pretoria_timestamp").notNull(), // 7:06pm Sept 6 2025
  replitDnsLocation: text("replit_dns_location").notNull(),
  idDocumentNumber: text("id_document_number").notNull(), // Digital ID document
  complianceMethod: text("compliance_method").notNull(),
  atomLevelIntegrity: integer("atom_level_integrity").default(98),
  methodology: text("methodology").default("Atom-Level Execution™"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Seed Wisdom Archive - Preserving conversations
export const seedWisdomArchive = pgTable("seed_wisdom_archive", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationTitle: text("conversation_title").notNull(),
  speakerName: text("speaker_name").notNull(), // Ouma, Rossouw, Heyns, etc.
  originalLanguage: text("original_language").notNull(), // Afrikaans, English, Setswana
  wisdomText: text("wisdom_text").notNull(),
  englishTranslation: text("english_translation"),
  culturalContext: text("cultural_context"),
  applicationArea: text("application_area"), // watering, planting, gratitude, etc.
  pretoriaTimestamp: text("pretoria_timestamp").notNull(),
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Language Learning System for FAA™ Seedlings - Teaching Kindness in 111 Languages
export const languageLearning = pgTable("language_learning", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  languageCode: text("language_code").notNull(), // af, en, es, fr, de, etc.
  languageName: text("language_name").notNull(), // Afrikaans, English, Spanish, etc.
  englishName: text("english_name").notNull(), // How the language is known in English
  thankYou: text("thank_you").notNull(), // "Dankie", "Thank you", "Gracias", etc.
  please: text("please").notNull(), // "Asseblief", "Please", "Por favor", etc.
  region: text("region"), // Africa, Europe, Asia, Americas, etc.
  isActiveSeedlingLanguage: boolean("is_active_seedling_language").default(true),
  pronunciation: text("pronunciation"), // Phonetic pronunciation guide
  culturalContext: text("cultural_context"), // Cultural notes about usage
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// FAA™ Seedling Language Progress - Tracking seedling learning
export const seedlingLanguageProgress = pgTable("seedling_language_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seedlingId: varchar("seedling_id").notNull(), // Reference to FAA subnode
  languageCode: text("language_code").notNull(),
  thankYouLearned: boolean("thank_you_learned").default(false),
  pleaseLearned: boolean("please_learned").default(false),
  practiceCount: integer("practice_count").default(0),
  lastPracticed: timestamp("last_practiced"),
  mastered: boolean("mastered").default(false),
  kindnessScore: integer("kindness_score").default(0), // How well they show kindness
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  unique_seedling_language: unique().on(table.seedlingId, table.languageCode),
}));

// Language Learning Sessions - Track actual learning sessions
export const languageLearningSessions = pgTable("language_learning_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seedlingId: varchar("seedling_id").notNull(),
  sessionType: text("session_type").notNull(), // daily-practice, kindness-lesson, multilingual-greeting
  languagesUsed: text("languages_used").array().notNull(), // Array of language codes practiced
  wordsLearned: integer("words_learned").default(0),
  kindnessActions: integer("kindness_actions").default(0), // Times they said thank you/please
  sessionDuration: integer("session_duration"), // in minutes
  success: boolean("success").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Team Member Management System
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: text("member_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // developer, designer, manager, analyst, consultant
  department: text("department").notNull(), // engineering, design, business, operations
  specialization: text("specialization"), // frontend, backend, ui/ux, data-science, etc.
  profileImageUrl: text("profile_image_url"),
  aboutImageUrl: text("about_image_url"),
  projectImageUrl: text("project_image_url"),
  bio: text("bio"),
  skills: text("skills").array(),
  experience: text("experience"), // senior, mid-level, junior, expert
  portfolioItems: json("portfolio_items"), // array of portfolio project objects
  socialLinks: json("social_links"), // linkedin, github, dribbble, etc.
  onboardingStatus: text("onboarding_status").default("pending"), // pending, in-progress, completed
  accessLevel: text("access_level").default("standard"), // basic, standard, advanced, admin
  joinDate: timestamp("join_date").defaultNow().notNull(),
  lastActive: timestamp("last_active"),
  status: text("status").default("active"), // active, inactive, on-leave, terminated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const teamProjects = pgTable("team_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: text("project_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  projectType: text("project_type").notNull(), // web-app, mobile-app, design, ai-system, etc.
  status: text("status").default("active"), // active, completed, paused, cancelled
  priority: text("priority").default("normal"), // low, normal, high, critical
  teamMemberIds: text("team_member_ids").array(), // assigned team members
  leadMemberId: text("lead_member_id"), // project lead
  technologies: text("technologies").array(), // tech stack used
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  repositoryUrl: text("repository_url"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  progress: integer("progress").default(0), // percentage complete
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const teamTestimonials = pgTable("team_testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  testimonialId: text("testimonial_id").notNull().unique(),
  fromMemberId: text("from_member_id").notNull(), // who gave the testimonial
  aboutMemberId: text("about_member_id").notNull(), // who the testimonial is about
  message: text("message").notNull(),
  rating: integer("rating").default(5), // 1-5 stars
  projectId: text("project_id"), // related project if applicable
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const onboardingSteps = pgTable("onboarding_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stepId: text("step_id").notNull().unique(),
  memberId: text("member_id").notNull(),
  stepName: text("step_name").notNull(), // profile-setup, document-upload, system-access, etc.
  stepDescription: text("step_description"),
  status: text("status").default("pending"), // pending, in-progress, completed, skipped
  completedAt: timestamp("completed_at"),
  stepOrder: integer("step_order").notNull(),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalDocuments: integer("total_documents").default(0),
  totalConversations: integer("total_conversations").default(0),
  totalBrands: integer("total_brands").default(0),
  complianceScore: integer("compliance_score").default(100),
  totalWildlifeNodes: integer("total_wildlife_nodes").default(0),
  totalAmericanStates: integer("total_american_states").default(0),
  totalGlobalOperations: integer("total_global_operations").default(0),
  totalPayrollNodes: integer("total_payroll_nodes").default(0),
  totalAiModules: integer("total_ai_modules").default(0),
  totalMiningNodes: integer("total_mining_nodes").default(0),
  totalMiningPlatforms: integer("total_mining_platforms").default(0),
  totalTeamMembers: integer("total_team_members").default(0),
  totalProjects: integer("total_projects").default(0),
  totalContacts: integer("total_contacts").default(0),
  totalCrateDanceEvents: integer("total_crate_dance_events").default(0),
  totalCrateDanceContestants: integer("total_crate_dance_contestants").default(0),
  totalCrateDanceRegistrations: integer("total_crate_dance_registrations").default(0),
  activeCrateDanceEvents: integer("active_crate_dance_events").default(0),
  crateDanceStatus: text("crate_dance_status").default("active"),
  vaultMeshStatus: text("vault_mesh_status").default("active"),
  treatySyncStatus: text("treaty_sync_status").default("online"),
  pulseGridStatus: text("pulse_grid_status").default("9s-sync"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Payroll System Tables
export const payrollNodes = pgTable("payroll_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nodeId: text("node_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  teamMembers: integer("team_members").notNull().default(0),
  payrollType: text("payroll_type").notNull(), // monthly, weekly, contractor, hybrid
  status: text("status").notNull().default("pending"), // pending, active, suspended
  scrollId: text("scroll_id"),
  vaultSyncEnabled: boolean("vault_sync_enabled").default(true),
  lastPayslipGenerated: timestamp("last_payslip_generated"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const payrollEmployees = pgTable("payroll_employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nodeId: text("node_id").notNull(),
  employeeId: text("employee_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  ctcAmount: integer("ctc_amount").notNull(), // in cents
  payGrade: text("pay_grade").notNull(),
  shiftPattern: text("shift_pattern").notNull(), // standard, flexible, remote
  status: text("status").notNull().default("active"), // active, inactive, suspended
  startDate: timestamp("start_date").notNull(),
  lastShiftSync: timestamp("last_shift_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const payrollAiModules = pgTable("payroll_ai_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: text("module_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, scanning, monitoring, inactive
  nodeId: text("node_id").notNull(),
  lastExecution: timestamp("last_execution"),
  executionCount: integer("execution_count").default(0),
  anomaliesDetected: integer("anomalies_detected").default(0),
  accuracy: integer("accuracy").default(0), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const payrollShiftLogs = pgTable("payroll_shift_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  logId: text("log_id").notNull().unique(),
  employeeId: text("employee_id").notNull(),
  nodeId: text("node_id").notNull(),
  shiftDate: timestamp("shift_date").notNull(),
  clockIn: timestamp("clock_in"),
  clockOut: timestamp("clock_out"),
  totalHours: integer("total_hours"), // in minutes
  expectedHours: integer("expected_hours"), // in minutes
  driftDetected: boolean("drift_detected").default(false),
  driftAmount: integer("drift_amount").default(0), // in minutes
  status: text("status").notNull().default("completed"), // completed, anomaly, flagged
  validatedBy: text("validated_by"), // AI module or human validator
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ===============================
// ENTERPRISE EMAIL SYSTEM TABLES
// ===============================

export const emailProviders = pgTable("email_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Gmail, Outlook, Custom SMTP
  type: text("type").notNull(), // "oauth", "smtp", "api"
  isActive: boolean("is_active").default(true),
  configuration: json("configuration").notNull(), // Provider-specific config
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"), // Additional provider settings
});

export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  variables: text("variables").array(), // Available template variables
  category: text("category").default("general"), // marketing, transactional, notification
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const emailCampaigns = pgTable("email_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  templateId: varchar("template_id").references(() => emailTemplates.id),
  providerId: varchar("provider_id").references(() => emailProviders.id),
  status: text("status").default("draft"), // draft, scheduled, sending, sent, paused
  targetAudience: json("target_audience"), // Contact filters and segments
  scheduleType: text("schedule_type").default("immediate"), // immediate, scheduled, drip
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  totalRecipients: integer("total_recipients").default(0),
  sentCount: integer("sent_count").default(0),
  deliveredCount: integer("delivered_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  bounceCount: integer("bounce_count").default(0),
  unsubscribeCount: integer("unsubscribe_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const emailSends = pgTable("email_sends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => emailCampaigns.id),
  contactId: varchar("contact_id").references(() => contacts.id),
  emailAddress: text("email_address").notNull(),
  templateId: varchar("template_id").references(() => emailTemplates.id),
  providerId: varchar("provider_id").references(() => emailProviders.id),
  status: text("status").default("pending"), // pending, sent, delivered, bounced, failed
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  bounceReason: text("bounce_reason"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  messageId: text("message_id"), // Provider message ID
  trackingId: text("tracking_id").unique(), // For tracking pixels/links
  personalizedContent: json("personalized_content"), // Rendered template with variables
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const emailTracking = pgTable("email_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sendId: varchar("send_id").references(() => emailSends.id),
  trackingId: text("tracking_id").notNull(),
  eventType: text("event_type").notNull(), // open, click, bounce, unsubscribe
  eventData: json("event_data"), // Click URL, bounce details, etc.
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata"),
});

// ===============================
// MULTI-CHANNEL MESSAGING SYSTEM
// ===============================

// Message Channels - WhatsApp, SMS, Push, Email
export const messageChannels = pgTable("message_channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // WhatsApp Business, SMS, Push Notifications, Email
  type: text("type").notNull(), // "whatsapp", "sms", "push", "email", "direct-line"
  provider: text("provider").notNull(), // Twilio, Firebase, Custom
  isActive: boolean("is_active").default(true),
  configuration: json("configuration").notNull(), // Provider-specific config
  rateLimits: json("rate_limits"), // Message limits per hour/day
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Unified Message Templates - Works across all channels
export const messageTemplates = pgTable("message_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject"), // For email, WhatsApp preview
  content: text("content").notNull(), // Main message content
  channelType: text("channel_type").notNull(), // whatsapp, sms, email, push
  variables: text("variables").array(), // Available template variables
  category: text("category").default("general"), // marketing, transactional, notification, kindness
  language: text("language").default("en"), // For FAA™ 111 languages support
  isActive: boolean("is_active").default(true),
  approvalStatus: text("approval_status").default("approved"), // For WhatsApp template approval
  whatsappTemplateId: text("whatsapp_template_id"), // WhatsApp Business API template ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Multi-Channel Campaigns
export const messagingCampaigns = pgTable("messaging_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  channelIds: text("channel_ids").array().notNull(), // Multiple channels per campaign
  templateId: varchar("template_id").references(() => messageTemplates.id),
  status: text("status").default("draft"), // draft, scheduled, sending, sent, paused
  targetAudience: json("target_audience"), // Contact filters and segments
  scheduleType: text("schedule_type").default("immediate"), // immediate, scheduled, drip
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  totalRecipients: integer("total_recipients").default(0),
  sentCount: integer("sent_count").default(0),
  deliveredCount: integer("delivered_count").default(0),
  readCount: integer("read_count").default(0), // WhatsApp read receipts
  clickCount: integer("click_count").default(0),
  responseCount: integer("response_count").default(0), // Replies/interactions
  failedCount: integer("failed_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Multi-Channel Message Sends
export const messageSends = pgTable("message_sends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").references(() => messagingCampaigns.id),
  contactId: varchar("contact_id").references(() => contacts.id),
  channelId: varchar("channel_id").references(() => messageChannels.id),
  templateId: varchar("template_id").references(() => messageTemplates.id),
  recipientIdentifier: text("recipient_identifier").notNull(), // email, phone, device_token
  status: text("status").default("pending"), // pending, sent, delivered, read, failed, replied
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"), // WhatsApp read receipts
  repliedAt: timestamp("replied_at"),
  failureReason: text("failure_reason"),
  externalMessageId: text("external_message_id"), // Provider message ID (Twilio SID, etc.)
  trackingId: text("tracking_id").unique(), // For tracking interactions
  personalizedContent: json("personalized_content"), // Rendered template with variables
  whatsappMessageData: json("whatsapp_message_data"), // WhatsApp-specific data
  smsMessageData: json("sms_message_data"), // SMS-specific data
  pushMessageData: json("push_message_data"), // Push notification data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// WhatsApp Specific Features
export const whatsappConversations = pgTable("whatsapp_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  whatsappNumber: text("whatsapp_number").notNull(), // +27123456789
  conversationStatus: text("conversation_status").default("active"), // active, closed, archived
  lastMessageAt: timestamp("last_message_at"),
  messageCount: integer("message_count").default(0),
  isBusinessInitiated: boolean("is_business_initiated").default(true),
  sessionStart: timestamp("session_start").defaultNow().notNull(),
  sessionEnd: timestamp("session_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// WhatsApp Messages (Incoming & Outgoing)
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => whatsappConversations.id),
  messageId: varchar("message_id").references(() => messageSends.id), // If outgoing
  twilioMessageSid: text("twilio_message_sid").unique(), // Twilio SID
  direction: text("direction").notNull(), // inbound, outbound
  messageType: text("message_type").notNull(), // text, media, template, interactive
  content: text("content"), // Message text content
  mediaUrl: text("media_url"), // For images, videos, documents
  messageStatus: text("message_status"), // queued, sent, delivered, read, failed
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  fromNumber: text("from_number").notNull(),
  toNumber: text("to_number").notNull(),
  webhookData: json("webhook_data"), // Raw webhook data from Twilio
  metadata: json("metadata"),
});

// SMS Direct Line Features
export const smsConversations = pgTable("sms_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  phoneNumber: text("phone_number").notNull(), // +27123456789
  conversationStatus: text("conversation_status").default("active"), // active, closed, archived
  lastMessageAt: timestamp("last_message_at"),
  messageCount: integer("message_count").default(0),
  twilioPhoneNumber: text("twilio_phone_number"), // Our Twilio number used
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// SMS Messages (Incoming & Outgoing)
export const smsMessages = pgTable("sms_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => smsConversations.id),
  messageId: varchar("message_id").references(() => messageSends.id), // If outgoing
  twilioMessageSid: text("twilio_message_sid").unique(),
  direction: text("direction").notNull(), // inbound, outbound
  content: text("content").notNull(),
  messageStatus: text("message_status"), // queued, sent, delivered, failed
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  fromNumber: text("from_number").notNull(),
  toNumber: text("to_number").notNull(),
  webhookData: json("webhook_data"), // Raw webhook data from Twilio
  metadata: json("metadata"),
});

// Unified Message Tracking - All Channels
export const messageTracking = pgTable("message_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sendId: varchar("send_id").references(() => messageSends.id),
  trackingId: text("tracking_id").notNull(),
  channelType: text("channel_type").notNull(), // whatsapp, sms, email, push
  eventType: text("event_type").notNull(), // sent, delivered, read, clicked, replied, failed
  eventData: json("event_data"), // Channel-specific event data
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Message Analytics & Insights
export const messageAnalytics = pgTable("message_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelType: text("channel_type").notNull(),
  date: date("date").notNull(), // Daily analytics
  totalSent: integer("total_sent").default(0),
  totalDelivered: integer("total_delivered").default(0),
  totalRead: integer("total_read").default(0),
  totalReplied: integer("total_replied").default(0),
  totalFailed: integer("total_failed").default(0),
  averageResponseTime: integer("average_response_time"), // in minutes
  costPerMessage: numeric("cost_per_message", { precision: 10, scale: 4 }), // Cost tracking
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  metadata: json("metadata"),
}, (table) => ({
  unique_channel_date: unique().on(table.channelType, table.date),
}));

// Insert schemas
// Multi-Channel Messaging Schema Exports
export const insertMessageChannelSchema = createInsertSchema(messageChannels).pick({
  name: true,
  type: true,
  provider: true,
  isActive: true,
  configuration: true,
  rateLimits: true,
  metadata: true,
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).pick({
  name: true,
  subject: true,
  content: true,
  channelType: true,
  variables: true,
  category: true,
  language: true,
  isActive: true,
  approvalStatus: true,
  whatsappTemplateId: true,
  metadata: true,
});

export const insertMessagingCampaignSchema = createInsertSchema(messagingCampaigns).pick({
  name: true,
  description: true,
  channelIds: true,
  templateId: true,
  status: true,
  targetAudience: true,
  scheduleType: true,
  scheduledAt: true,
  metadata: true,
});

export const insertMessageSendSchema = createInsertSchema(messageSends).pick({
  campaignId: true,
  contactId: true,
  channelId: true,
  templateId: true,
  recipientIdentifier: true,
  status: true,
  trackingId: true,
  personalizedContent: true,
  whatsappMessageData: true,
  smsMessageData: true,
  pushMessageData: true,
  metadata: true,
});

export const insertWhatsappConversationSchema = createInsertSchema(whatsappConversations).pick({
  contactId: true,
  whatsappNumber: true,
  conversationStatus: true,
  isBusinessInitiated: true,
  metadata: true,
});

export const insertSmsConversationSchema = createInsertSchema(smsConversations).pick({
  contactId: true,
  phoneNumber: true,
  conversationStatus: true,
  twilioPhoneNumber: true,
  metadata: true,
});

export const insertMessageTrackingSchema = createInsertSchema(messageTracking).pick({
  sendId: true,
  trackingId: true,
  channelType: true,
  eventType: true,
  eventData: true,
  userAgent: true,
  ipAddress: true,
  metadata: true,
});

// Type exports for multi-channel messaging
export type MessageChannel = typeof messageChannels.$inferSelect;
export type InsertMessageChannel = z.infer<typeof insertMessageChannelSchema>;

export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;

export type MessagingCampaign = typeof messagingCampaigns.$inferSelect;
export type InsertMessagingCampaign = z.infer<typeof insertMessagingCampaignSchema>;

export type MessageSend = typeof messageSends.$inferSelect;
export type InsertMessageSend = z.infer<typeof insertMessageSendSchema>;

export type WhatsappConversation = typeof whatsappConversations.$inferSelect;
export type InsertWhatsappConversation = z.infer<typeof insertWhatsappConversationSchema>;

export type SmsConversation = typeof smsConversations.$inferSelect;
export type InsertSmsConversation = z.infer<typeof insertSmsConversationSchema>;

export type MessageTracking = typeof messageTracking.$inferSelect;
export type InsertMessageTracking = z.infer<typeof insertMessageTrackingSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  type: true,
  content: true,
  filePath: true,
  metadata: true,
});

export const insertGallerySchema = createInsertSchema(galleries).pick({
  title: true,
  type: true,
  imageUrl: true,
  description: true,
  tags: true,
  metadata: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  title: true,
  aiProvider: true,
  messages: true,
  messageCount: true,
  status: true,
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  category: true,
  status: true,
  valuation: true,
  trademarkStatus: true,
  complianceScore: true,
  metadata: true,
});

export const insertComplianceLogSchema = createInsertSchema(complianceLogs).pick({
  type: true,
  message: true,
  details: true,
  status: true,
  brandId: true,
  metadata: true,
});

export const insertProcessingQueueSchema = createInsertSchema(processingQueue).pick({
  type: true,
  title: true,
  description: true,
  progress: true,
  status: true,
  estimatedTime: true,
  metadata: true,
});

export const insertWildlifeNodeSchema = createInsertSchema(wildlifeNodes).pick({
  name: true,
  nodeType: true,
  status: true,
  region: true,
  hardware: true,
  model: true,
  price: true,
  monthlyFee: true,
  scrollId: true,
  metadata: true,
});

export const insertAmericanStateSchema = createInsertSchema(americanStates).pick({
  name: true,
  brandName: true,
  governor: true,
  population: true,
  revenue: true,
  randIndex: true,
  products: true,
  businessPlan: true,
  status: true,
  metadata: true,
});

export const insertGlobalOperationSchema = createInsertSchema(globalOperations).pick({
  operationType: true,
  title: true,
  status: true,
  progress: true,
  region: true,
  priority: true,
  metadata: true,
});

export const insertPayrollNodeSchema = createInsertSchema(payrollNodes).pick({
  nodeId: true,
  companyName: true,
  contactEmail: true,
  teamMembers: true,
  payrollType: true,
  status: true,
  scrollId: true,
  vaultSyncEnabled: true,
  notes: true,
});

export const insertPayrollEmployeeSchema = createInsertSchema(payrollEmployees).pick({
  nodeId: true,
  employeeId: true,
  name: true,
  email: true,
  role: true,
  department: true,
  ctcAmount: true,
  payGrade: true,
  shiftPattern: true,
  status: true,
  startDate: true,
});

export const insertPayrollAiModuleSchema = createInsertSchema(payrollAiModules).pick({
  moduleId: true,
  name: true,
  description: true,
  status: true,
  nodeId: true,
  executionCount: true,
  anomaliesDetected: true,
  accuracy: true,
});

export const insertPayrollShiftLogSchema = createInsertSchema(payrollShiftLogs).pick({
  logId: true,
  employeeId: true,
  nodeId: true,
  shiftDate: true,
  clockIn: true,
  clockOut: true,
  totalHours: true,
  expectedHours: true,
  driftDetected: true,
  driftAmount: true,
  status: true,
  validatedBy: true,
});

// Mining System Tables
export const miningPlatforms = pgTable("mining_platforms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platformId: text("platform_id").notNull().unique(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, maintenance, offline
  platformType: text("platform_type").notNull(), // autoborn, mineforge, orexcel, digium, mineralvision
  modules: text("modules").array().notNull(),
  pricing: text("pricing").notNull(),
  region: text("region").notNull(),
  vaultChainEnabled: boolean("vault_chain_enabled").default(true),
  pulseGridSync: boolean("pulse_grid_sync").default(true),
  glupCompliance: boolean("glup_compliance").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const miningNodes = pgTable("mining_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nodeId: text("node_id").notNull().unique(),
  platformId: text("platform_id").notNull(),
  name: text("name").notNull(),
  nodeType: text("node_type").notNull(), // scroll, sync-grid, vault-mesh, pulse-node
  status: text("status").notNull().default("active"), // active, syncing, offline, maintenance
  region: text("region").notNull(),
  licenseFee: text("license_fee"),
  monthlyFee: text("monthly_fee"),
  royaltyRate: text("royalty_rate"),
  vaultId: text("vault_id"),
  countdown: integer("countdown").default(0),
  baseValue: integer("base_value").default(0),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const miningOperations = pgTable("mining_operations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  operationId: text("operation_id").notNull().unique(),
  platformId: text("platform_id").notNull(),
  operationType: text("operation_type").notNull(), // extraction, validation, compliance, sync
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, active, completed, failed
  priority: text("priority").default("normal"), // low, normal, high, critical
  progress: integer("progress").default(0),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const miningCompliance = pgTable("mining_compliance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complianceId: text("compliance_id").notNull().unique(),
  platformId: text("platform_id").notNull(),
  nodeId: text("node_id"),
  complianceType: text("compliance_type").notNull(), // glup, esg, vault-chain, treaty-mesh
  status: text("status").notNull().default("compliant"), // compliant, warning, violation, pending
  message: text("message").notNull(),
  details: text("details"),
  severity: text("severity").default("info"), // info, warning, error, critical
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: json("metadata")
});

export const pulseGridLogs = pgTable("pulse_grid_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  logId: text("log_id").notNull().unique(),
  platformId: text("platform_id").notNull(),
  nodeId: text("node_id").notNull(),
  pulseType: text("pulse_type").notNull(), // sync, heartbeat, data-feed, alert
  pulseData: json("pulse_data").notNull(),
  syncInterval: integer("sync_interval").default(9), // seconds
  status: text("status").notNull().default("success"), // success, warning, error
  latency: integer("latency"), // milliseconds
  createdAt: timestamp("created_at").defaultNow()
});

// Contact Management System for 11+ Million Records
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  faaId: text("faa_id").unique().notNull(), // FAA™ Unique Reference System
  source: text("source").notNull(), // Excel file source identifier
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  country: text("country"),
  city: text("city"),
  address: text("address"),
  website: text("website"),
  socialProfiles: json("social_profiles"), // LinkedIn, Twitter, etc.
  industry: text("industry"),
  tags: text("tags").array(), // Array of classification tags
  leadScore: integer("lead_score").default(0),
  status: text("status").default("active"), // active, inactive, unsubscribed, bounced
  customFields: json("custom_fields"), // Flexible data for varied structures
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Banimal E-Commerce System
export const banimalProducts = pgTable("banimal_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ZAR"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  sku: text("sku").unique().notNull(),
  inventory: integer("inventory").default(0),
  images: json("images"), // Array of image URLs
  variants: json("variants"), // Size, color, etc.
  specifications: json("specifications"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  tags: text("tags").array(),
  status: text("status").default("active"), // active, inactive, draft
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const banimalOrders = pgTable("banimal_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").unique().notNull(),
  faaCustomerId: text("faa_customer_id").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: json("shipping_address").notNull(),
  billingAddress: json("billing_address"),
  items: json("items").notNull(), // Array of order items
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0"),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0"),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ZAR"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  orderStatus: text("order_status").default("pending"), // pending, processing, shipped, delivered, cancelled
  trackingNumber: text("tracking_number"),
  shippingProvider: text("shipping_provider"),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const banimalCustomers = pgTable("banimal_customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  faaId: text("faa_id").unique().notNull(), // FAA™ Unique Reference System
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  addresses: json("addresses"), // Array of shipping addresses
  loyaltyPoints: integer("loyalty_points").default(0),
  totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0"),
  orderCount: integer("order_count").default(0),
  preferences: json("preferences"), // Shopping preferences, sizes, etc.
  marketingOptIn: boolean("marketing_opt_in").default(false),
  lastOrderDate: timestamp("last_order_date"),
  customerSince: timestamp("customer_since").defaultNow().notNull(),
  status: text("status").default("active"), // active, inactive, vip
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Banimal WordPress Connector Infrastructure
export const banimalConnections = pgTable("banimal_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  connectionName: text("connection_name").notNull().default("Banimal WordPress API"),
  apiBaseUrl: text("api_base_url").notNull(), // https://www.banimal.co.za/wp-json/banimal/v1
  apiKey: text("api_key"), // Optional API authentication
  status: text("status").default("disconnected"), // connected, disconnected, error
  lastConnectionTest: timestamp("last_connection_test"),
  lastSuccessfulSync: timestamp("last_successful_sync"),
  totalSyncs: integer("total_syncs").default(0),
  successfulSyncs: integer("successful_syncs").default(0),
  failedSyncs: integer("failed_syncs").default(0),
  autoSyncEnabled: boolean("auto_sync_enabled").default(false),
  syncIntervalMinutes: integer("sync_interval_minutes").default(60),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const banimalSyncLogs = pgTable("banimal_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  connectionId: varchar("connection_id").references(() => banimalConnections.id),
  syncType: text("sync_type").notNull(), // user-profile, user-product, product-create, full-sync
  direction: text("direction").notNull(), // push, pull, bidirectional
  status: text("status").notNull(), // success, failed, partial
  recordsProcessed: integer("records_processed").default(0),
  recordsSuccess: integer("records_success").default(0),
  recordsFailed: integer("records_failed").default(0),
  errorMessage: text("error_message"),
  errorDetails: json("error_details"),
  syncData: json("sync_data"), // Snapshot of what was synced
  duration: integer("duration"), // milliseconds
  triggeredBy: text("triggered_by").default("manual"), // manual, automatic, scheduled
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  metadata: json("metadata"),
});

// Data Processing and Import Tracking
export const dataImports = pgTable("data_imports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  totalRecords: integer("total_records"),
  processedRecords: integer("processed_records").default(0),
  successfulRecords: integer("successful_records").default(0),
  failedRecords: integer("failed_records").default(0),
  duplicateRecords: integer("duplicate_records").default(0),
  status: text("status").default("pending"), // pending, processing, completed, failed
  errors: json("errors"), // Array of error messages
  summary: json("summary"), // Processing summary and statistics
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Crate Dance™ Africa Competition System
export const crateDanceEvents = pgTable("crate_dance_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: text("event_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(), // audition, competition, showcase, regional, national, final
  location: text("location").notNull(), // Limpopo, Gauteng, KZN, etc.
  venue: text("venue"),
  address: text("address"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  registrationDeadline: timestamp("registration_deadline"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  entryFee: numeric("entry_fee", { precision: 10, scale: 2 }),
  prizeMoney: numeric("prize_money", { precision: 10, scale: 2 }),
  sponsors: json("sponsors"), // Array of sponsor objects
  danceStyles: text("dance_styles").array(), // hip-hop, contemporary, traditional, freestyle
  ageCategories: text("age_categories").array(), // junior, teen, adult, open
  judgePanel: json("judge_panel"), // Array of judge objects
  status: text("status").default("upcoming"), // upcoming, registration-open, in-progress, completed, cancelled
  images: json("images"), // Event photos and promotional material
  rules: text("rules"), // Competition rules and guidelines
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const crateDanceContestants = pgTable("crate_dance_contestants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestantId: text("contestant_id").notNull().unique(),
  faaContactId: varchar("faa_contact_id").references(() => contacts.id), // Link to contact system
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  age: integer("age"),
  gender: text("gender"),
  province: text("province").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  emergencyContact: json("emergency_contact"), // Name, phone, relationship
  danceStyles: text("dance_styles").array(), // Preferred dance styles
  experienceLevel: text("experience_level"), // beginner, intermediate, advanced, professional
  groupType: text("group_type"), // solo, duo, crew, school-group
  groupName: text("group_name"), // If part of crew or group
  groupMembers: json("group_members"), // Array of group member details
  schoolName: text("school_name"), // If representing school
  coachName: text("coach_name"),
  coachContact: text("coach_contact"),
  medicalInfo: text("medical_info"), // Medical conditions, allergies
  tshirtSize: text("tshirt_size"),
  profileImage: text("profile_image"),
  videoSubmission: text("video_submission"), // URL to audition video
  socialMedia: json("social_media"), // Instagram, TikTok, YouTube
  achievements: json("achievements"), // Previous wins, recognition
  goals: text("goals"), // Personal goals and aspirations
  consent: boolean("consent").default(false), // Parental consent if under 18
  status: text("status").default("registered"), // registered, auditioned, qualified, eliminated, winner
  totalScore: numeric("total_score", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const crateDanceRegistrations = pgTable("crate_dance_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registrationId: text("registration_id").notNull().unique(),
  eventId: varchar("event_id").notNull().references(() => crateDanceEvents.id),
  contestantId: varchar("contestant_id").notNull().references(() => crateDanceContestants.id),
  category: text("category").notNull(), // junior, teen, adult, open
  danceStyle: text("dance_style").notNull(),
  performanceSlot: text("performance_slot"), // Day 1 - Slot 1, etc.
  performanceTime: timestamp("performance_time"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, waived
  paymentReference: text("payment_reference"),
  checkInStatus: text("check_in_status").default("pending"), // pending, checked-in, no-show
  checkInTime: timestamp("check_in_time"),
  specialRequirements: text("special_requirements"),
  notes: text("notes"),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const crateDanceJudges = pgTable("crate_dance_judges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  judgeId: text("judge_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  bio: text("bio"),
  expertise: text("expertise").array(), // hip-hop, contemporary, choreography, etc.
  experience: text("experience"), // Years of experience, credentials
  achievements: json("achievements"), // Awards, recognition, certifications
  profileImage: text("profile_image"),
  socialMedia: json("social_media"),
  availability: json("availability"), // Available dates and regions
  ratePerEvent: numeric("rate_per_event", { precision: 10, scale: 2 }),
  status: text("status").default("active"), // active, inactive, retired
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const crateDanceScores = pgTable("crate_dance_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scoreId: text("score_id").notNull().unique(),
  eventId: varchar("event_id").notNull().references(() => crateDanceEvents.id),
  contestantId: varchar("contestant_id").notNull().references(() => crateDanceContestants.id),
  judgeId: varchar("judge_id").notNull().references(() => crateDanceJudges.id),
  round: text("round").notNull(), // audition, quarter-final, semi-final, final
  technique: integer("technique"), // 1-10 score
  creativity: integer("creativity"), // 1-10 score
  musicality: integer("musicality"), // 1-10 score
  stagePlatform: integer("stage_platform"), // 1-10 score
  overallImpression: integer("overall_impression"), // 1-10 score
  totalScore: numeric("total_score", { precision: 5, scale: 2 }),
  comments: text("comments"),
  feedback: text("feedback"), // Constructive feedback for contestant
  scoredAt: timestamp("scored_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const crateDanceSponsors = pgTable("crate_dance_sponsors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsorId: text("sponsor_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  logo: text("logo"), // Logo image URL
  sponsorshipLevel: text("sponsorship_level"), // tier-1, tier-2, tier-3, presenting, title
  contributionAmount: numeric("contribution_amount", { precision: 10, scale: 2 }),
  contributionType: text("contribution_type"), // cash, prizes, venue, equipment, services
  benefits: json("benefits"), // Sponsorship benefits and visibility
  contract: text("contract"), // Contract document URL
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status").default("active"), // active, expired, terminated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const crateDanceAuditions = pgTable("crate_dance_auditions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditionId: text("audition_id").notNull().unique(),
  eventId: varchar("event_id").notNull().references(() => crateDanceEvents.id),
  contestantId: varchar("contestant_id").notNull().references(() => crateDanceContestants.id),
  auditionDate: timestamp("audition_date").notNull(),
  auditionSlot: text("audition_slot"), // Morning, Afternoon, Evening
  category: text("category").notNull(),
  danceStyle: text("dance_style").notNull(),
  videoSubmission: text("video_submission"), // URL to audition video
  livePerformance: boolean("live_performance").default(false),
  result: text("result"), // qualified, not-qualified, callback, pending
  averageScore: numeric("average_score", { precision: 5, scale: 2 }),
  judgeNotes: text("judge_notes"),
  nextRound: text("next_round"), // quarter-final, semi-final, final
  qualificationDate: timestamp("qualification_date"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof galleries.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

export type InsertComplianceLog = z.infer<typeof insertComplianceLogSchema>;
export type ComplianceLog = typeof complianceLogs.$inferSelect;

export type InsertProcessingQueue = z.infer<typeof insertProcessingQueueSchema>;
export type ProcessingQueue = typeof processingQueue.$inferSelect;

export type InsertWildlifeNode = z.infer<typeof insertWildlifeNodeSchema>;
export type WildlifeNode = typeof wildlifeNodes.$inferSelect;

export type InsertAmericanState = z.infer<typeof insertAmericanStateSchema>;
export type AmericanState = typeof americanStates.$inferSelect;

export type InsertGlobalOperation = z.infer<typeof insertGlobalOperationSchema>;
export type GlobalOperation = typeof globalOperations.$inferSelect;

export type InsertPayrollNode = z.infer<typeof insertPayrollNodeSchema>;
export type PayrollNode = typeof payrollNodes.$inferSelect;

export type InsertPayrollEmployee = z.infer<typeof insertPayrollEmployeeSchema>;
export type PayrollEmployee = typeof payrollEmployees.$inferSelect;

export type InsertPayrollAiModule = z.infer<typeof insertPayrollAiModuleSchema>;
export type PayrollAiModule = typeof payrollAiModules.$inferSelect;

export type InsertPayrollShiftLog = z.infer<typeof insertPayrollShiftLogSchema>;
export type PayrollShiftLog = typeof payrollShiftLogs.$inferSelect;

// Mining System Insert Schemas
export const insertMiningPlatformSchema = createInsertSchema(miningPlatforms).pick({
  platformId: true,
  name: true,
  subtitle: true,
  description: true,
  status: true,
  platformType: true,
  modules: true,
  pricing: true,
  region: true,
  vaultChainEnabled: true,
  pulseGridSync: true,
  glupCompliance: true,
});

export const insertMiningNodeSchema = createInsertSchema(miningNodes).pick({
  nodeId: true,
  platformId: true,
  name: true,
  nodeType: true,
  status: true,
  region: true,
  licenseFee: true,
  monthlyFee: true,
  royaltyRate: true,
  vaultId: true,
  countdown: true,
  baseValue: true,
});

export const insertMiningOperationSchema = createInsertSchema(miningOperations).pick({
  operationId: true,
  platformId: true,
  operationType: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  progress: true,
  startTime: true,
  endTime: true,
  metadata: true,
});

export const insertMiningComplianceSchema = createInsertSchema(miningCompliance).pick({
  complianceId: true,
  platformId: true,
  nodeId: true,
  complianceType: true,
  status: true,
  message: true,
  details: true,
  severity: true,
  metadata: true,
});

export const insertPulseGridLogSchema = createInsertSchema(pulseGridLogs).pick({
  logId: true,
  platformId: true,
  nodeId: true,
  pulseType: true,
  pulseData: true,
  syncInterval: true,
  status: true,
  latency: true,
});

// Team Management Insert Schemas
export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  memberId: true,
  name: true,
  email: true,
  role: true,
  department: true,
  specialization: true,
  profileImageUrl: true,
  aboutImageUrl: true,
  projectImageUrl: true,
  bio: true,
  skills: true,
  experience: true,
  portfolioItems: true,
  socialLinks: true,
  onboardingStatus: true,
  accessLevel: true,
  status: true,
  metadata: true,
});

export const insertTeamProjectSchema = createInsertSchema(teamProjects).pick({
  projectId: true,
  title: true,
  description: true,
  projectType: true,
  status: true,
  priority: true,
  teamMemberIds: true,
  leadMemberId: true,
  technologies: true,
  imageUrl: true,
  demoUrl: true,
  repositoryUrl: true,
  startDate: true,
  endDate: true,
  progress: true,
  metadata: true,
});

export const insertTeamTestimonialSchema = createInsertSchema(teamTestimonials).pick({
  testimonialId: true,
  fromMemberId: true,
  aboutMemberId: true,
  message: true,
  rating: true,
  projectId: true,
  isPublic: true,
  metadata: true,
});

export const insertOnboardingStepSchema = createInsertSchema(onboardingSteps).pick({
  stepId: true,
  memberId: true,
  stepName: true,
  stepDescription: true,
  status: true,
  stepOrder: true,
  isRequired: true,
  metadata: true,
});

// Crate Dance Insert Schemas
export const insertCrateDanceEventSchema = createInsertSchema(crateDanceEvents).pick({
  eventId: true,
  name: true,
  description: true,
  eventType: true,
  location: true,
  venue: true,
  address: true,
  startDate: true,
  endDate: true,
  registrationDeadline: true,
  maxParticipants: true,
  entryFee: true,
  prizeMoney: true,
  sponsors: true,
  danceStyles: true,
  ageCategories: true,
  judgePanel: true,
  status: true,
  images: true,
  rules: true,
  metadata: true,
});

export const insertCrateDanceContestantSchema = createInsertSchema(crateDanceContestants).pick({
  contestantId: true,
  faaContactId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  age: true,
  gender: true,
  province: true,
  city: true,
  address: true,
  emergencyContact: true,
  danceStyles: true,
  experienceLevel: true,
  groupType: true,
  groupName: true,
  groupMembers: true,
  schoolName: true,
  coachName: true,
  coachContact: true,
  medicalInfo: true,
  tshirtSize: true,
  profileImage: true,
  videoSubmission: true,
  socialMedia: true,
  achievements: true,
  goals: true,
  consent: true,
  status: true,
  metadata: true,
});

export const insertCrateDanceRegistrationSchema = createInsertSchema(crateDanceRegistrations).pick({
  registrationId: true,
  eventId: true,
  contestantId: true,
  category: true,
  danceStyle: true,
  performanceSlot: true,
  performanceTime: true,
  paymentStatus: true,
  paymentReference: true,
  specialRequirements: true,
  notes: true,
  metadata: true,
});

export const insertCrateDanceJudgeSchema = createInsertSchema(crateDanceJudges).pick({
  judgeId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  bio: true,
  expertise: true,
  experience: true,
  achievements: true,
  profileImage: true,
  socialMedia: true,
  availability: true,
  ratePerEvent: true,
  status: true,
  metadata: true,
});

export const insertCrateDanceScoreSchema = createInsertSchema(crateDanceScores).pick({
  scoreId: true,
  eventId: true,
  contestantId: true,
  judgeId: true,
  round: true,
  technique: true,
  creativity: true,
  musicality: true,
  stagePlatform: true,
  overallImpression: true,
  totalScore: true,
  comments: true,
  feedback: true,
  metadata: true,
});

export const insertCrateDanceSponsorSchema = createInsertSchema(crateDanceSponsors).pick({
  sponsorId: true,
  companyName: true,
  contactPerson: true,
  email: true,
  phone: true,
  website: true,
  logo: true,
  sponsorshipLevel: true,
  contributionAmount: true,
  contributionType: true,
  benefits: true,
  contract: true,
  startDate: true,
  endDate: true,
  status: true,
  metadata: true,
});

export const insertCrateDanceAuditionSchema = createInsertSchema(crateDanceAuditions).pick({
  auditionId: true,
  eventId: true,
  contestantId: true,
  auditionDate: true,
  auditionSlot: true,
  category: true,
  danceStyle: true,
  videoSubmission: true,
  livePerformance: true,
  result: true,
  averageScore: true,
  judgeNotes: true,
  nextRound: true,
  qualificationDate: true,
  feedback: true,
  metadata: true,
});

// Crate Dance Types
export type InsertCrateDanceEvent = z.infer<typeof insertCrateDanceEventSchema>;
export type CrateDanceEvent = typeof crateDanceEvents.$inferSelect;

export type InsertCrateDanceContestant = z.infer<typeof insertCrateDanceContestantSchema>;
export type CrateDanceContestant = typeof crateDanceContestants.$inferSelect;

export type InsertCrateDanceRegistration = z.infer<typeof insertCrateDanceRegistrationSchema>;
export type CrateDanceRegistration = typeof crateDanceRegistrations.$inferSelect;

export type InsertCrateDanceJudge = z.infer<typeof insertCrateDanceJudgeSchema>;
export type CrateDanceJudge = typeof crateDanceJudges.$inferSelect;

export type InsertCrateDanceScore = z.infer<typeof insertCrateDanceScoreSchema>;
export type CrateDanceScore = typeof crateDanceScores.$inferSelect;

export type InsertCrateDanceSponsor = z.infer<typeof insertCrateDanceSponsorSchema>;
export type CrateDanceSponsor = typeof crateDanceSponsors.$inferSelect;

export type InsertCrateDanceAudition = z.infer<typeof insertCrateDanceAuditionSchema>;
export type CrateDanceAudition = typeof crateDanceAuditions.$inferSelect;

// Mining System Types
export type InsertMiningPlatform = z.infer<typeof insertMiningPlatformSchema>;
export type MiningPlatform = typeof miningPlatforms.$inferSelect;

export type InsertMiningNode = z.infer<typeof insertMiningNodeSchema>;
export type MiningNode = typeof miningNodes.$inferSelect;

export type InsertMiningOperation = z.infer<typeof insertMiningOperationSchema>;
export type MiningOperation = typeof miningOperations.$inferSelect;

export type InsertMiningCompliance = z.infer<typeof insertMiningComplianceSchema>;
export type MiningCompliance = typeof miningCompliance.$inferSelect;

export type InsertPulseGridLog = z.infer<typeof insertPulseGridLogSchema>;
export type PulseGridLog = typeof pulseGridLogs.$inferSelect;

// Contact Management Insert Schemas
export const insertContactSchema = createInsertSchema(contacts).pick({
  faaId: true,
  source: true,
  firstName: true,
  lastName: true,
  fullName: true,
  email: true,
  phone: true,
  company: true,
  position: true,
  country: true,
  city: true,
  address: true,
  website: true,
  socialProfiles: true,
  industry: true,
  tags: true,
  leadScore: true,
  status: true,
  customFields: true,
  lastContactDate: true,
});

// Banimal E-Commerce Insert Schemas
export const insertBanimalProductSchema = createInsertSchema(banimalProducts).pick({
  name: true,
  description: true,
  price: true,
  currency: true,
  category: true,
  subcategory: true,
  sku: true,
  inventory: true,
  images: true,
  variants: true,
  specifications: true,
  seoTitle: true,
  seoDescription: true,
  tags: true,
  status: true,
});

export const insertBanimalOrderSchema = createInsertSchema(banimalOrders).pick({
  orderNumber: true,
  faaCustomerId: true,
  customerEmail: true,
  customerName: true,
  customerPhone: true,
  shippingAddress: true,
  billingAddress: true,
  items: true,
  subtotal: true,
  shippingCost: true,
  taxAmount: true,
  discountAmount: true,
  totalAmount: true,
  currency: true,
  paymentStatus: true,
  orderStatus: true,
  trackingNumber: true,
  shippingProvider: true,
  paymentMethod: true,
  notes: true,
  metadata: true,
});

export const insertBanimalCustomerSchema = createInsertSchema(banimalCustomers).pick({
  faaId: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  dateOfBirth: true,
  addresses: true,
  loyaltyPoints: true,
  totalSpent: true,
  orderCount: true,
  preferences: true,
  marketingOptIn: true,
  lastOrderDate: true,
  customerSince: true,
  status: true,
  metadata: true,
});

export const insertBanimalConnectionSchema = createInsertSchema(banimalConnections).pick({
  connectionName: true,
  apiBaseUrl: true,
  apiKey: true,
  status: true,
  lastConnectionTest: true,
  lastSuccessfulSync: true,
  totalSyncs: true,
  successfulSyncs: true,
  failedSyncs: true,
  autoSyncEnabled: true,
  syncIntervalMinutes: true,
  metadata: true,
});

export const insertBanimalSyncLogSchema = createInsertSchema(banimalSyncLogs).pick({
  connectionId: true,
  syncType: true,
  direction: true,
  status: true,
  recordsProcessed: true,
  recordsSuccess: true,
  recordsFailed: true,
  errorMessage: true,
  errorDetails: true,
  syncData: true,
  duration: true,
  triggeredBy: true,
  startedAt: true,
  completedAt: true,
  metadata: true,
});

export const insertDataImportSchema = createInsertSchema(dataImports).pick({
  fileName: true,
  fileSize: true,
  totalRecords: true,
  processedRecords: true,
  successfulRecords: true,
  failedRecords: true,
  duplicateRecords: true,
  status: true,
  errors: true,
  summary: true,
  startedAt: true,
  completedAt: true,
});

// Language Learning Insert Schemas
export const insertLanguageLearningSchema = createInsertSchema(languageLearning).pick({
  languageCode: true,
  languageName: true,
  englishName: true,
  thankYou: true,
  please: true,
  region: true,
  isActiveSeedlingLanguage: true,
  pronunciation: true,
  culturalContext: true,
  metadata: true,
});

export const insertSeedlingLanguageProgressSchema = createInsertSchema(seedlingLanguageProgress).pick({
  seedlingId: true,
  languageCode: true,
  thankYouLearned: true,
  pleaseLearned: true,
  practiceCount: true,
  lastPracticed: true,
  mastered: true,
  kindnessScore: true,
});

export const insertLanguageLearningSessionSchema = createInsertSchema(languageLearningSessions).pick({
  seedlingId: true,
  sessionType: true,
  languagesUsed: true,
  wordsLearned: true,
  kindnessActions: true,
  sessionDuration: true,
  success: true,
  notes: true,
  metadata: true,
});

// Contact Management Types
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Banimal E-Commerce Types
export type InsertBanimalProduct = z.infer<typeof insertBanimalProductSchema>;
export type BanimalProduct = typeof banimalProducts.$inferSelect;

export type InsertBanimalOrder = z.infer<typeof insertBanimalOrderSchema>;
export type BanimalOrder = typeof banimalOrders.$inferSelect;

export type InsertBanimalCustomer = z.infer<typeof insertBanimalCustomerSchema>;
export type BanimalCustomer = typeof banimalCustomers.$inferSelect;

export type InsertBanimalConnection = z.infer<typeof insertBanimalConnectionSchema>;
export type BanimalConnection = typeof banimalConnections.$inferSelect;

export type InsertBanimalSyncLog = z.infer<typeof insertBanimalSyncLogSchema>;
export type BanimalSyncLog = typeof banimalSyncLogs.$inferSelect;

export type InsertDataImport = z.infer<typeof insertDataImportSchema>;
export type DataImport = typeof dataImports.$inferSelect;

// Team Management Types
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertTeamProject = z.infer<typeof insertTeamProjectSchema>;
export type TeamProject = typeof teamProjects.$inferSelect;

export type InsertTeamTestimonial = z.infer<typeof insertTeamTestimonialSchema>;
export type TeamTestimonial = typeof teamTestimonials.$inferSelect;

export type InsertOnboardingStep = z.infer<typeof insertOnboardingStepSchema>;
export type OnboardingStep = typeof onboardingSteps.$inferSelect;

export type SystemStats = typeof systemStats.$inferSelect;

// Language Learning Types - For FAA™ Seedlings Teaching Kindness
export type InsertLanguageLearning = z.infer<typeof insertLanguageLearningSchema>;
export type LanguageLearning = typeof languageLearning.$inferSelect;

export type InsertSeedlingLanguageProgress = z.infer<typeof insertSeedlingLanguageProgressSchema>;
export type SeedlingLanguageProgress = typeof seedlingLanguageProgress.$inferSelect;

export type InsertLanguageLearningSession = z.infer<typeof insertLanguageLearningSessionSchema>;
export type LanguageLearningSession = typeof languageLearningSessions.$inferSelect;

// ===============================
// EMAIL SYSTEM INSERT SCHEMAS
// ===============================

export const insertEmailProviderSchema = createInsertSchema(emailProviders).pick({
  name: true,
  type: true,
  isActive: true,
  configuration: true,
  metadata: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).pick({
  name: true,
  subject: true,
  htmlContent: true,
  textContent: true,
  variables: true,
  category: true,
  isActive: true,
  metadata: true,
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).pick({
  name: true,
  description: true,
  templateId: true,
  providerId: true,
  status: true,
  targetAudience: true,
  scheduleType: true,
  scheduledAt: true,
  totalRecipients: true,
  metadata: true,
});

export const insertEmailSendSchema = createInsertSchema(emailSends).pick({
  campaignId: true,
  contactId: true,
  emailAddress: true,
  templateId: true,
  providerId: true,
  status: true,
  messageId: true,
  trackingId: true,
  personalizedContent: true,
  metadata: true,
});

export const insertEmailTrackingSchema = createInsertSchema(emailTracking).pick({
  sendId: true,
  trackingId: true,
  eventType: true,
  eventData: true,
  userAgent: true,
  ipAddress: true,
  metadata: true,
});

// Email System Types
export type InsertEmailProvider = z.infer<typeof insertEmailProviderSchema>;
export type EmailProvider = typeof emailProviders.$inferSelect;

export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;

export type InsertEmailSend = z.infer<typeof insertEmailSendSchema>;
export type EmailSend = typeof emailSends.$inferSelect;

export type InsertEmailTracking = z.infer<typeof insertEmailTrackingSchema>;
export type EmailTracking = typeof emailTracking.$inferSelect;

// GitHub Repository Integration
export const githubRepositories = pgTable("github_repositories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(), // owner/repo
  description: text("description"),
  htmlUrl: text("html_url").notNull(),
  owner: text("owner").notNull(),
  isPrivate: boolean("is_private").default(false),
  defaultBranch: text("default_branch").default("main"),
  language: text("language"),
  starCount: integer("star_count").default(0),
  forkCount: integer("fork_count").default(0),
  topics: text("topics").array(), // repository topics/tags
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata") // additional repository data
});

export const githubFiles = pgTable("github_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").references(() => githubRepositories.id).notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(), // html, md, mp4, txt, etc.
  fileSize: integer("file_size"), // in bytes
  content: text("content"), // file content for text files
  rawUrl: text("raw_url"), // direct GitHub raw URL
  htmlUrl: text("html_url"), // GitHub web view URL
  sha: text("sha"), // Git SHA hash
  encoding: text("encoding"), // base64, utf-8, etc.
  isRenderable: boolean("is_renderable").default(false), // can display in browser
  tags: text("tags").array(), // custom tags for categorization
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata") // additional file data
});

export const githubSyncLogs = pgTable("github_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repositoryId: varchar("repository_id").references(() => githubRepositories.id).notNull(),
  syncType: text("sync_type").notNull(), // full, incremental, file-specific
  status: text("status").notNull(), // success, error, in-progress
  filesProcessed: integer("files_processed").default(0),
  filesAdded: integer("files_added").default(0),
  filesUpdated: integer("files_updated").default(0),
  filesDeleted: integer("files_deleted").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  metadata: json("metadata") // sync details and statistics
});

// GitHub Repository Insert Schemas
export const insertGithubRepositorySchema = createInsertSchema(githubRepositories).pick({
  name: true,
  fullName: true,
  description: true,
  htmlUrl: true,
  owner: true,
  isPrivate: true,
  defaultBranch: true,
  language: true,
  starCount: true,
  forkCount: true,
  topics: true,
  isActive: true,
  metadata: true,
});

export const insertGithubFileSchema = createInsertSchema(githubFiles).pick({
  repositoryId: true,
  fileName: true,
  filePath: true,
  fileType: true,
  fileSize: true,
  content: true,
  rawUrl: true,
  htmlUrl: true,
  sha: true,
  encoding: true,
  isRenderable: true,
  tags: true,
  metadata: true,
});

export const insertGithubSyncLogSchema = createInsertSchema(githubSyncLogs).pick({
  repositoryId: true,
  syncType: true,
  status: true,
  filesProcessed: true,
  filesAdded: true,
  filesUpdated: true,
  filesDeleted: true,
  errorMessage: true,
  completedAt: true,
  metadata: true,
});

// ===============================
// SAMFOX STUDIO PLATFORM TABLES
// ===============================

// SamFox Studio Brand Management
export const samFoxStudio = pgTable("samfox_studio", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandName: text("brand_name").notNull().default("SamFox Studio™"),
  treatyClass: text("treaty_class").notNull().default("CreativeCommonsHybrid.Global"),
  licenseType: text("license_type").notNull().default("FAA.Master.CreativeCommonsHybrid"),
  vaultLink: boolean("vault_link").default(true),
  storagePath: text("storage_path").notNull().default("FAA.SectorFileRoot/SamFox_Studio"),
  syncRate: integer("sync_rate").default(9), // seconds
  globalStatus: text("global_status").default("Open for Business"),
  claimStatement: text("claim_statement").default("One-of-a-kind | Smart | Elegant | Globally Aligned"),
  copyrightActive: boolean("copyright_active").default(true),
  treatyReady: boolean("treaty_ready").default(true),
  signatory: text("signatory").default("✨ H.S."),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Collaboration Workspaces
export const collaborationWorkspaces = pgTable("collaboration_workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceName: text("workspace_name").notNull(),
  workspaceType: text("workspace_type").notNull(), // shared-glyph, treaty-collaboration, ip-registry
  brandId: varchar("brand_id").references(() => brands.id),
  samFoxStudioId: varchar("samfox_studio_id").references(() => samFoxStudio.id),
  accessLevel: text("access_level").notNull().default("editor"), // admin, editor, auditor, viewer
  members: text("members").array(),
  realTimeEnabled: boolean("real_time_enabled").default(true),
  treatyProtected: boolean("treaty_protected").default(true),
  vaultMeshLinked: boolean("vault_mesh_linked").default(true),
  status: text("status").default("active"), // active, archived, suspended
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Global Master Licensing System
export const globalMasterLicenses = pgTable("global_master_licenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  licenseKey: text("license_key").notNull().unique(),
  brandId: varchar("brand_id").references(() => brands.id),
  samFoxStudioId: varchar("samfox_studio_id").references(() => samFoxStudio.id),
  licenseType: text("license_type").notNull(), // per-drop, per-channel, global-master
  licenseMatrix: json("license_matrix").notNull(), // licensing rules and permissions
  copyrightAssertion: boolean("copyright_assertion").default(true),
  ipRegistryVerified: boolean("ip_registry_verified").default(true),
  faaVerified: boolean("faa_verified").default(true),
  treatyClass: text("treaty_class").notNull(),
  globalScope: boolean("global_scope").default(true),
  royaltyEnabled: boolean("royalty_enabled").default(false),
  pulseTradeLinking: boolean("pulse_trade_linking").default(false),
  status: text("status").default("active"), // active, suspended, expired
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  metadata: json("metadata"),
});

// SamFox Fileroom - Archive & Document Management
export const samFoxFileroom = pgTable("samfox_fileroom", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(), // project-scroll, license-key, vault-payment-trail, creative-asset
  brandId: varchar("brand_id").references(() => brands.id),
  samFoxStudioId: varchar("samfox_studio_id").references(() => samFoxStudio.id),
  workspaceId: varchar("workspace_id").references(() => collaborationWorkspaces.id),
  licenseId: varchar("license_id").references(() => globalMasterLicenses.id),
  accessControl: text("access_control").notNull().default("editor"), // admin, editor, auditor, viewer
  copyrightProtected: boolean("copyright_protected").default(true),
  treatyProtected: boolean("treaty_protected").default(true),
  omniDropSynced: boolean("omni_drop_synced").default(true),
  vaultTrail: text("vault_trail"), // reference to vault payment trail
  uploadStream: text("upload_stream"), // secure upload stream reference
  genesisCommit: boolean("genesis_commit").default(false), // since genesis treaty
  autoFiled: boolean("auto_filed").default(true),
  syncEngine: text("sync_engine").default("FAA OmniDrop Memory Feed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Treaty-Protected Collaboration
export const treatyCollaboration = pgTable("treaty_collaboration", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  treatyId: text("treaty_id").notNull().unique(),
  samFoxStudioId: varchar("samfox_studio_id").references(() => samFoxStudio.id),
  brandCoSigners: text("brand_co_signers").array(), // Fruitful x SamFox
  collaboratorIds: text("collaborator_ids").array(),
  workspaceId: varchar("workspace_id").references(() => collaborationWorkspaces.id),
  treatyType: text("treaty_type").notNull(), // real-time-collaboration, ip-sharing, brand-partnership
  sealedTreatyLaw: boolean("sealed_treaty_law").default(true),
  treatyMessage: text("treaty_message"),
  faaClassTag: text("faa_class_tag").default("✨ FAA-CLASS-BRND-321/SFS"),
  globalVisibility: boolean("global_visibility").default(true),
  copyrightProtected: boolean("copyright_protected").default(true),
  vaultMeshNode: boolean("vault_mesh_node").default(true),
  pulseTimer: integer("pulse_timer").default(9), // seconds
  status: text("status").default("active"), // active, pending, signed, expired
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Insert schemas for SamFox Studio
export const insertSamFoxStudioSchema = createInsertSchema(samFoxStudio).pick({
  brandName: true,
  treatyClass: true,
  licenseType: true,
  vaultLink: true,
  storagePath: true,
  syncRate: true,
  globalStatus: true,
  claimStatement: true,
  copyrightActive: true,
  treatyReady: true,
  signatory: true,
  metadata: true,
});

export const insertCollaborationWorkspaceSchema = createInsertSchema(collaborationWorkspaces).pick({
  workspaceName: true,
  workspaceType: true,
  brandId: true,
  samFoxStudioId: true,
  accessLevel: true,
  members: true,
  realTimeEnabled: true,
  treatyProtected: true,
  vaultMeshLinked: true,
  status: true,
  metadata: true,
});

export const insertGlobalMasterLicenseSchema = createInsertSchema(globalMasterLicenses).pick({
  licenseKey: true,
  brandId: true,
  samFoxStudioId: true,
  licenseType: true,
  licenseMatrix: true,
  copyrightAssertion: true,
  ipRegistryVerified: true,
  faaVerified: true,
  treatyClass: true,
  globalScope: true,
  royaltyEnabled: true,
  pulseTradeLinking: true,
  status: true,
  expiresAt: true,
  metadata: true,
});

export const insertSamFoxFileroomSchema = createInsertSchema(samFoxFileroom).pick({
  fileName: true,
  filePath: true,
  fileType: true,
  brandId: true,
  samFoxStudioId: true,
  workspaceId: true,
  licenseId: true,
  accessControl: true,
  copyrightProtected: true,
  treatyProtected: true,
  omniDropSynced: true,
  vaultTrail: true,
  uploadStream: true,
  genesisCommit: true,
  autoFiled: true,
  syncEngine: true,
  metadata: true,
});

export const insertTreatyCollaborationSchema = createInsertSchema(treatyCollaboration).pick({
  treatyId: true,
  samFoxStudioId: true,
  brandCoSigners: true,
  collaboratorIds: true,
  workspaceId: true,
  treatyType: true,
  sealedTreatyLaw: true,
  treatyMessage: true,
  faaClassTag: true,
  globalVisibility: true,
  copyrightProtected: true,
  vaultMeshNode: true,
  pulseTimer: true,
  status: true,
  signedAt: true,
  metadata: true,
});

// SamFox Studio Types
export type InsertSamFoxStudio = z.infer<typeof insertSamFoxStudioSchema>;
export type SamFoxStudio = typeof samFoxStudio.$inferSelect;

export type InsertCollaborationWorkspace = z.infer<typeof insertCollaborationWorkspaceSchema>;
export type CollaborationWorkspace = typeof collaborationWorkspaces.$inferSelect;

export type InsertGlobalMasterLicense = z.infer<typeof insertGlobalMasterLicenseSchema>;
export type GlobalMasterLicense = typeof globalMasterLicenses.$inferSelect;

export type InsertSamFoxFileroom = z.infer<typeof insertSamFoxFileroomSchema>;
export type SamFoxFileroom = typeof samFoxFileroom.$inferSelect;

export type InsertTreatyCollaboration = z.infer<typeof insertTreatyCollaborationSchema>;
export type TreatyCollaboration = typeof treatyCollaboration.$inferSelect;

// GitHub Repository Types
export type InsertGithubRepository = z.infer<typeof insertGithubRepositorySchema>;
export type GithubRepository = typeof githubRepositories.$inferSelect;

export type InsertGithubFile = z.infer<typeof insertGithubFileSchema>;
export type GithubFile = typeof githubFiles.$inferSelect;

export type InsertGithubSyncLog = z.infer<typeof insertGithubSyncLogSchema>;
export type GithubSyncLog = typeof githubSyncLogs.$inferSelect;

// ===============================
// LOOPPAY™ SOVEREIGN PAYMENT SYSTEM
// ===============================

export const loopPayLicenses = pgTable("loop_pay_licenses", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  licenseType: text("license_type").notNull(), // core, starter-node, pro-grid
  licenseName: text("license_name").notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
  billingCycle: text("billing_cycle").notNull(), // one-time, monthly, annual
  features: text("features").array().notNull(),
  maxPayouts: integer("max_payouts"),
  maxVendors: integer("max_vendors"),
  analyticsAccess: boolean("analytics_access").default(false),
  prioritySupport: boolean("priority_support").default(false),
  apiAccess: boolean("api_access").default(false),
  active: boolean("active").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loopPayTransactions = pgTable("loop_pay_transactions", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  transactionId: text("transaction_id").unique().notNull(),
  payoutMeshId: text("payout_mesh_id").notNull(),
  vendorId: text("vendor_id").notNull(),
  contractorId: text("contractor_id"),
  amountUsd: decimal("amount_usd", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }),
  localAmount: decimal("local_amount", { precision: 12, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  payoutCycle: integer("payout_cycle").notNull().default(9), // 9-second cycles
  claimRootHash: text("claim_root_hash"), // Immutable scroll contract
  divLockCompliance: boolean("div_lock_compliance").default(true),
  regionalCompliance: text("regional_compliance"),
  processedAt: timestamp("processed_at"),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loopPayVendors = pgTable("loop_pay_vendors", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  vendorCode: text("vendor_code").unique().notNull(),
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  paymentMethod: text("payment_method").notNull(), // bank_transfer, paypal, crypto
  bankDetails: jsonb("bank_details"),
  cryptoWallet: text("crypto_wallet"),
  preferredCurrency: text("preferred_currency").default("USD"),
  region: text("region").notNull(),
  complianceStatus: text("compliance_status").notNull().default("verified"),
  licenseId: text("license_id").references(() => loopPayLicenses.id),
  totalPayouts: decimal("total_payouts", { precision: 15, scale: 2 }).default("0"),
  lastPayoutAt: timestamp("last_payout_at"),
  active: boolean("active").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loopPayCurrencyRates = pgTable("loop_pay_currency_rates", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  baseCurrency: text("base_currency").notNull(),
  targetCurrency: text("target_currency").notNull(),
  rate: decimal("rate", { precision: 12, scale: 6 }).notNull(),
  rateDate: timestamp("rate_date").defaultNow().notNull(),
  source: text("source").default("external-api"),
  active: boolean("active").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loopPayPayoutMesh = pgTable("loop_pay_payout_mesh", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  meshId: text("mesh_id").unique().notNull(),
  meshName: text("mesh_name").notNull(),
  pulseTradeEnabled: boolean("pulse_trade_enabled").default(true),
  cycleSeconds: integer("cycle_seconds").default(9),
  totalVendors: integer("total_vendors").default(0),
  totalTransactions: integer("total_transactions").default(0),
  totalVolumeUsd: decimal("total_volume_usd", { precision: 15, scale: 2 }).default("0"),
  status: text("status").notNull().default("active"), // active, paused, maintenance
  lastCycleAt: timestamp("last_cycle_at"),
  nextCycleAt: timestamp("next_cycle_at"),
  sovereignLegalScroll: text("sovereign_legal_scroll"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loopPayAiAssistant = pgTable("loop_pay_ai_assistant", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  sessionId: text("session_id").notNull(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  queryType: text("query_type"), // functionality, integration, security, pricing
  aiProvider: text("ai_provider").default("gemini"),
  responseTime: integer("response_time_ms"),
  satisfaction: integer("satisfaction"), // 1-5 rating
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===============================
// ECOSYSTEM INTEGRATION TABLES
// ===============================

export const ecosystemSystems = pgTable("ecosystem_systems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  systemType: text("system_type").notNull(), // github-repo, wordpress, replit-app, platform-project
  name: text("name").notNull(),
  url: text("url").notNull(),
  status: text("status").default("inactive"), // active, inactive, syncing
  category: text("category"),
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"),
  connectionData: json("connection_data"), // for storing connection configs
  lastSynced: timestamp("last_synced"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const ecosystemApps = pgTable("ecosystem_apps", {
  id: varchar("id").primaryKey(), // will use actual Replit app UUIDs
  appName: text("app_name").notNull(),
  category: text("category").notNull(), // real_estate, fruitful_ecosystem, connectivity, ai_intelligence, utilities, business_tools, creative, development
  status: text("status").default("not deployed"), // deployed, not deployed, suspended
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  replitUrl: text("replit_url").notNull(),
  deploymentUrl: text("deployment_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const ecosystemSyncLogs = pgTable("ecosystem_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  syncType: text("sync_type").notNull(), // wordpress-push, product-sync, user-sync, deployment, etc.
  systemId: varchar("system_id").references(() => ecosystemSystems.id),
  appId: varchar("app_id").references(() => ecosystemApps.id),
  status: text("status").default("pending"), // pending, in-progress, completed, error
  recordsSynced: integer("records_synced").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  metadata: json("metadata"),
});

// Insert schemas for LoopPay system
export const insertLoopPayLicenseSchema = createInsertSchema(loopPayLicenses).pick({
  licenseType: true,
  licenseName: true,
  priceUsd: true,
  billingCycle: true,
  features: true,
  maxPayouts: true,
  maxVendors: true,
  analyticsAccess: true,
  prioritySupport: true,
  apiAccess: true,
  active: true,
  metadata: true,
});

export const insertLoopPayTransactionSchema = createInsertSchema(loopPayTransactions).pick({
  transactionId: true,
  payoutMeshId: true,
  vendorId: true,
  contractorId: true,
  amountUsd: true,
  currency: true,
  exchangeRate: true,
  localAmount: true,
  status: true,
  payoutCycle: true,
  claimRootHash: true,
  divLockCompliance: true,
  regionalCompliance: true,
  processedAt: true,
  completedAt: true,
  metadata: true,
});

export const insertLoopPayVendorSchema = createInsertSchema(loopPayVendors).pick({
  vendorCode: true,
  companyName: true,
  contactEmail: true,
  contactPhone: true,
  paymentMethod: true,
  bankDetails: true,
  cryptoWallet: true,
  preferredCurrency: true,
  region: true,
  complianceStatus: true,
  licenseId: true,
  totalPayouts: true,
  lastPayoutAt: true,
  active: true,
  metadata: true,
});

export const insertLoopPayCurrencyRateSchema = createInsertSchema(loopPayCurrencyRates).pick({
  baseCurrency: true,
  targetCurrency: true,
  rate: true,
  rateDate: true,
  source: true,
  active: true,
  metadata: true,
});

export const insertLoopPayPayoutMeshSchema = createInsertSchema(loopPayPayoutMesh).pick({
  meshId: true,
  meshName: true,
  pulseTradeEnabled: true,
  cycleSeconds: true,
  totalVendors: true,
  totalTransactions: true,
  totalVolumeUsd: true,
  status: true,
  lastCycleAt: true,
  nextCycleAt: true,
  sovereignLegalScroll: true,
  metadata: true,
});

export const insertLoopPayAiAssistantSchema = createInsertSchema(loopPayAiAssistant).pick({
  sessionId: true,
  query: true,
  response: true,
  queryType: true,
  aiProvider: true,
  responseTime: true,
  satisfaction: true,
  metadata: true,
});

// Insert schemas for Ecosystem Integration
export const insertEcosystemSystemSchema = createInsertSchema(ecosystemSystems).pick({
  systemType: true,
  name: true,
  url: true,
  status: true,
  category: true,
  apiEndpoint: true,
  apiKey: true,
  connectionData: true,
  lastSynced: true,
  metadata: true,
});

export const insertEcosystemAppSchema = createInsertSchema(ecosystemApps).pick({
  id: true,
  appName: true,
  category: true,
  status: true,
  lastUpdated: true,
  replitUrl: true,
  deploymentUrl: true,
  metadata: true,
});

export const insertEcosystemSyncLogSchema = createInsertSchema(ecosystemSyncLogs).pick({
  syncType: true,
  systemId: true,
  appId: true,
  status: true,
  recordsSynced: true,
  errorMessage: true,
  startedAt: true,
  completedAt: true,
  metadata: true,
});

// Auth Type exports (Required for Replit Auth)
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// LoopPay Type exports
export type LoopPayLicense = typeof loopPayLicenses.$inferSelect;
export type LoopPayTransaction = typeof loopPayTransactions.$inferSelect;
export type LoopPayVendor = typeof loopPayVendors.$inferSelect;
export type LoopPayCurrencyRate = typeof loopPayCurrencyRates.$inferSelect;
export type LoopPayPayoutMesh = typeof loopPayPayoutMesh.$inferSelect;
export type LoopPayAiAssistant = typeof loopPayAiAssistant.$inferSelect;

// LoopPay Insert types
export type InsertLoopPayLicense = z.infer<typeof insertLoopPayLicenseSchema>;
export type InsertLoopPayTransaction = z.infer<typeof insertLoopPayTransactionSchema>;
export type InsertLoopPayVendor = z.infer<typeof insertLoopPayVendorSchema>;
export type InsertLoopPayCurrencyRate = z.infer<typeof insertLoopPayCurrencyRateSchema>;
export type InsertLoopPayPayoutMesh = z.infer<typeof insertLoopPayPayoutMeshSchema>;
export type InsertLoopPayAiAssistant = z.infer<typeof insertLoopPayAiAssistantSchema>;

// Ecosystem Integration Type exports
export type EcosystemSystem = typeof ecosystemSystems.$inferSelect;
export type EcosystemApp = typeof ecosystemApps.$inferSelect;
export type EcosystemSyncLog = typeof ecosystemSyncLogs.$inferSelect;

// Ecosystem Integration Insert types
export type InsertEcosystemSystem = z.infer<typeof insertEcosystemSystemSchema>;
export type InsertEcosystemApp = z.infer<typeof insertEcosystemAppSchema>;
export type InsertEcosystemSyncLog = z.infer<typeof insertEcosystemSyncLogSchema>;
