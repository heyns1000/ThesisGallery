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

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalDocuments: integer("total_documents").default(0),
  totalConversations: integer("total_conversations").default(0),
  totalBrands: integer("total_brands").default(0),
  complianceScore: integer("compliance_score").default(100),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
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

export type SystemStats = typeof systemStats.$inferSelect;
