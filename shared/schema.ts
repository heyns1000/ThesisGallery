import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// Insert schemas
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

export type SystemStats = typeof systemStats.$inferSelect;
