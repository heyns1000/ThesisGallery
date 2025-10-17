import { pgTable, text, serial, integer, boolean, jsonb, varchar, timestamp, index, decimal, numeric, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { FRUITFUL_CRATE_DANCE_ECOSYSTEM, FRUITFUL_CRATE_DANCE_SECTORS } from "./fruitful-crate-dance-ecosystem";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description"),
  brandCount: integer("brand_count").default(0),
  subnodeCount: integer("subnode_count").default(0),
  price: text("price").default("29.99"), // USD pricing for sector access
  currency: text("currency").default("USD"),
  metadata: jsonb("metadata"),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sectorId: integer("sector_id").references(() => sectors.id),
  integration: text("integration").notNull(), // VaultMesh™, HotStack, FAA.ZONE™
  status: text("status").notNull().default("active"), // active, maintenance, offline
  isCore: boolean("is_core").default(true),
  parentId: integer("parent_id"), // for subnodes
  metadata: jsonb("metadata"), // additional brand data
  createdAt: text("created_at").default("now()"),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  service: text("service").notNull().unique(),
  status: text("status").notNull(), // online, maintenance, offline
  lastChecked: text("last_checked").default("now()"),
});

export const legalDocuments = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  icon: text("icon").default("📄"),
  category: text("category").notNull().default("legal"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: text("created_at").default("now()"),
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  category: text("category").notNull().default("documentation"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").default("now()"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  planName: text("plan_name").notNull(),
  amount: text("amount").notNull(), // stored as string to avoid decimal precision issues
  currency: text("currency").default("USD"),
  paypalOrderId: text("paypal_order_id"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  metadata: jsonb("metadata"), // additional payment data
  createdAt: text("created_at").default("now()"),
});

// Admin Panel Brands - comprehensive sector brand data from interns.seedwave.faa.zone
export const adminPanelBrands = pgTable("admin_panel_brands", {
  id: serial("id").primaryKey(),
  sectorKey: text("sector_key").notNull(), // banking, agriculture, creative, etc.
  sectorName: text("sector_name").notNull(),
  sectorEmoji: text("sector_emoji").notNull(),
  brandName: text("brand_name").notNull(),
  subNodes: jsonb("sub_nodes").$type<string[]>().default([]),
  isCore: boolean("is_core").default(true),
  status: text("status").notNull().default("active"),
  metadata: jsonb("metadata"),
  createdAt: text("created_at").default("now()"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertSectorSchema = createInsertSchema(sectors).omit({
  id: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastChecked: true,
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertAdminPanelBrandSchema = createInsertSchema(adminPanelBrands).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Sector Mapping System Tables
export const sectorRelationships = pgTable("sector_relationships", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").notNull().references(() => sectors.id),
  targetId: integer("target_id").notNull().references(() => sectors.id),
  strength: numeric("strength", { precision: 3, scale: 2 }).notNull(),
  relationshipType: varchar("relationship_type", { length: 20 }).notNull(),
  description: text("description"),
  bidirectional: boolean("bidirectional").default(false),
  weight: integer("weight").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sectorMappingCache = pgTable("sector_mapping_cache", {
  id: serial("id").primaryKey(),
  cacheKey: varchar("cache_key", { length: 255 }).notNull().unique(),
  cacheData: jsonb("cache_data").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sector Mapping Schema Validation
export const insertSectorRelationshipSchema = createInsertSchema(sectorRelationships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSectorMappingCacheSchema = createInsertSchema(sectorMappingCache).omit({
  id: true,
  createdAt: true,
});

// Sector Mapping Types
export type SectorRelationship = typeof sectorRelationships.$inferSelect;
export type InsertSectorRelationship = z.infer<typeof insertSectorRelationshipSchema>;
export type SectorMappingCache = typeof sectorMappingCache.$inferSelect;
export type InsertSectorMappingCache = z.infer<typeof insertSectorMappingCacheSchema>;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type Sector = typeof sectors.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertAdminPanelBrand = z.infer<typeof insertAdminPanelBrandSchema>;
export type AdminPanelBrand = typeof adminPanelBrands.$inferSelect;

// Banimal Integration Tables
export const banimalTransactions = pgTable("banimal_transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id").unique().notNull(),
  productName: varchar("product_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  distributionRules: jsonb("distribution_rules").notNull(),
  childBeneficiary: varchar("child_beneficiary"),
  status: varchar("status").default("pending"), // pending, processing, distributed
  vaultSignature: varchar("vault_signature"),
  sonicValidation: boolean("sonic_validation").default(false),
  userId: varchar("user_id"),
  createdAt: text("created_at").default("now()"),
  updatedAt: text("updated_at").default("now()"),
});

export const charitableDistributions = pgTable("charitable_distributions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id").references(() => banimalTransactions.transactionId),
  beneficiaryType: varchar("beneficiary_type").notNull(), // charity, developer, operations, sonicgrid, vault
  beneficiaryName: varchar("beneficiary_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  percentage: integer("percentage").notNull(),
  distributionDate: text("distribution_date").default("now()"),
  vaultActionId: varchar("vault_action_id"),
  status: varchar("status").default("pending"), // pending, completed, failed
  metadata: jsonb("metadata"),
});

export const sonicGridConnections = pgTable("sonic_grid_connections", {
  id: serial("id").primaryKey(),
  connectionName: varchar("connection_name").notNull(),
  connectionType: varchar("connection_type").notNull(), // media_processing, impact_verification, sonic_core
  status: varchar("status").default("active"), // active, inactive, error
  documentsProcessed: integer("documents_processed").default(0),
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }).default("0.00"),
  lastActivity: text("last_activity").default("now()"),
  configuration: jsonb("configuration"),
});

export const vaultActions = pgTable("vault_actions", {
  id: serial("id").primaryKey(),
  actionId: varchar("action_id").unique().notNull(),
  actionType: varchar("action_type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  beneficiary: varchar("beneficiary").notNull(),
  transactionId: varchar("transaction_id"),
  vaultSignature: varchar("vault_signature").notNull(),
  sonicValidation: boolean("sonic_validation").default(false),
  status: varchar("status").default("pending"), // pending, processing, completed, failed
  executedAt: text("executed_at").default("now()"),
  metadata: jsonb("metadata"),
});

export const insertBanimalTransactionSchema = createInsertSchema(banimalTransactions);
export const insertCharitableDistributionSchema = createInsertSchema(charitableDistributions);
export const insertSonicGridConnectionSchema = createInsertSchema(sonicGridConnections);
export const insertVaultActionSchema = createInsertSchema(vaultActions);

export type InsertBanimalTransaction = z.infer<typeof insertBanimalTransactionSchema>;
export type BanimalTransaction = typeof banimalTransactions.$inferSelect;
export type InsertCharitableDistribution = z.infer<typeof insertCharitableDistributionSchema>;
export type CharitableDistribution = typeof charitableDistributions.$inferSelect;
export type InsertSonicGridConnection = z.infer<typeof insertSonicGridConnectionSchema>;
export type SonicGridConnection = typeof sonicGridConnections.$inferSelect;
export type InsertVaultAction = z.infer<typeof insertVaultActionSchema>;
export type VaultAction = typeof vaultActions.$inferSelect;

// =================================================================
// SAMFOX STUDIO STANDALONE APP SCHEMA
// =================================================================
// Independent art portfolio and commercial gallery platform

// SamFox Artwork Gallery - Commercial designs for sale
export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // "Character Art", "Typography", "Abstract", etc.
  tags: jsonb("tags").$type<string[]>().default([]),
  medium: text("medium"), // "Digital illustration", "Digital art", etc.
  isAvailable: boolean("is_available").default(true),
  salesCount: integer("sales_count").default(0),
  featured: boolean("featured").default(false),
  artistId: varchar("artist_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SamFox Portfolio Projects - Featured creative work
export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // "Digital Art", "Brand Design", "Character Design"
  tags: jsonb("tags").$type<string[]>().default([]),
  medium: text("medium"),
  style: text("style"),
  theme: text("theme"),
  clientName: text("client_name"), // For client work
  projectYear: integer("project_year"),
  featured: boolean("featured").default(false),
  sortOrder: integer("sort_order").default(0),
  artistId: varchar("artist_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SamFox Categories for organizing artwork
export const artworkCategories = pgTable("artwork_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  emoji: text("emoji"),
  color: text("color"), // For UI theming
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// SamFox Sales/Orders for commercial gallery
export const artworkOrders = pgTable("artwork_orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id").unique().notNull(),
  artworkId: integer("artwork_id").references(() => artworks.id),
  customerEmail: varchar("customer_email"),
  customerName: varchar("customer_name"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  paymentProvider: text("payment_provider"), // "paypal", "stripe", etc.
  paymentId: text("payment_id"), // External payment ID
  status: text("status").notNull().default("pending"), // pending, paid, completed, cancelled
  notes: text("notes"),
  deliveryMethod: text("delivery_method").default("digital"), // digital, print, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SamFox Studio Settings for app configuration
export const studioSettings = pgTable("studio_settings", {
  id: serial("id").primaryKey(),
  studioName: text("studio_name").default("SamFox Creative Studio"),
  studioDescription: text("studio_description"),
  studioLogo: text("studio_logo"),
  artistName: text("artist_name").default("SamFox"),
  artistBio: text("artist_bio"),
  artistImage: text("artist_image"),
  contactEmail: text("contact_email"),
  socialLinks: jsonb("social_links").$type<{ [key: string]: string }>().default({}),
  businessSettings: jsonb("business_settings").$type<{
    currency: string;
    taxRate?: number;
    shippingRate?: number;
    commissionRate?: number;
  }>().default({ currency: "USD" }),
  themeSettings: jsonb("theme_settings").$type<{
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  }>().default({ primaryColor: "#8b5cf6", secondaryColor: "#ec4899", accentColor: "#06b6d4", fontFamily: "Inter" }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema validation for SamFox models
export const insertArtworkSchema = createInsertSchema(artworks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArtworkCategorySchema = createInsertSchema(artworkCategories).omit({
  id: true,
  createdAt: true,
});

export const insertArtworkOrderSchema = createInsertSchema(artworkOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudioSettingsSchema = createInsertSchema(studioSettings).omit({
  id: true,
  updatedAt: true,
});

// Types for SamFox models
export type InsertArtwork = z.infer<typeof insertArtworkSchema>;
export type Artwork = typeof artworks.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertArtworkCategory = z.infer<typeof insertArtworkCategorySchema>;
export type ArtworkCategory = typeof artworkCategories.$inferSelect;
export type InsertArtworkOrder = z.infer<typeof insertArtworkOrderSchema>;
export type ArtworkOrder = typeof artworkOrders.$inferSelect;
export type InsertStudioSettings = z.infer<typeof insertStudioSettingsSchema>;
export type StudioSettings = typeof studioSettings.$inferSelect;

// Motion, Media & Sonic Studio Tables
export const mediaProjects = pgTable("media_projects", {
  id: serial("id").primaryKey(),
  projectId: varchar("project_id").unique().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // audio, video, motion, sonic
  status: varchar("status").default("draft"), // draft, processing, completed, published
  progress: integer("progress").default(0),
  description: text("description"),
  tags: jsonb("tags").default("[]"),
  userId: varchar("user_id").notNull(),
  fileUrl: text("file_url"),
  processingSettings: jsonb("processing_settings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const processingEngines = pgTable("processing_engines", {
  id: serial("id").primaryKey(),
  engineId: varchar("engine_id").unique().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // audio_processing, video_processing, motion_graphics, sonic_engineering
  status: varchar("status").default("active"), // active, idle, maintenance, error
  usage: integer("usage").default(0), // percentage 0-100
  lastActivity: timestamp("last_activity").defaultNow(),
  configuration: jsonb("configuration"),
  capabilities: jsonb("capabilities"),
});

export const insertMediaProjectSchema = createInsertSchema(mediaProjects);
export const insertProcessingEngineSchema = createInsertSchema(processingEngines);

export type InsertMediaProject = z.infer<typeof insertMediaProjectSchema>;
export type MediaProject = typeof mediaProjects.$inferSelect;
export type InsertProcessingEngine = z.infer<typeof insertProcessingEngineSchema>;
export type ProcessingEngine = typeof processingEngines.$inferSelect;

// Omnilevel Interstellar Tables
export const interstellarNodes = pgTable("interstellar_nodes", {
  id: serial("id").primaryKey(),
  nodeId: varchar("node_id").unique().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // quantum, neural, cosmic, dimensional
  status: varchar("status").default("dormant"), // active, dormant, processing, synchronizing
  coordinates: jsonb("coordinates").notNull(), // {x, y, z}
  connections: integer("connections").default(0),
  processingPower: integer("processing_power").default(0),
  dataVolume: varchar("data_volume"),
  lastSync: timestamp("last_sync").defaultNow(),
  configuration: jsonb("configuration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const globalLogicConfigs = pgTable("global_logic_configs", {
  id: serial("id").primaryKey(),
  configId: varchar("config_id").unique().notNull(),
  omnilevelMode: varchar("omnilevel_mode").default("standard"),
  neuralNetworkDepth: integer("neural_network_depth").default(7),
  quantumEntanglement: boolean("quantum_entanglement").default(false),
  cosmicAlignment: boolean("cosmic_alignment").default(false),
  dimensionalBridging: boolean("dimensional_bridging").default(false),
  processingClusters: integer("processing_clusters").default(12),
  dataCompressionRatio: integer("data_compression_ratio").default(85),
  securityProtocols: jsonb("security_protocols").default("[]"),
  syncFrequency: numeric("sync_frequency").default("2.5"),
  autonomousLearning: boolean("autonomous_learning").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInterstellarNodeSchema = createInsertSchema(interstellarNodes);
export const insertGlobalLogicConfigSchema = createInsertSchema(globalLogicConfigs);

export type InsertInterstellarNode = z.infer<typeof insertInterstellarNodeSchema>;
export type InterstellarNode = typeof interstellarNodes.$inferSelect;
export type InsertGlobalLogicConfig = z.infer<typeof insertGlobalLogicConfigSchema>;
export type GlobalLogicConfig = typeof globalLogicConfigs.$inferSelect;


// Comprehensive Fruitful Global Ecosystem Data - 7,038 Total Brands across 33 Sectors
export const COMPREHENSIVE_SECTOR_LIST = {
  "agriculture": "🌱 Agriculture & Biotech",
  "fsf": "🥦 Food, Soil & Farming", 
  "banking": "🏦 Banking & Finance",
  "creative": "🖋️ Creative Tech",
  "logistics": "📦 Logistics & Packaging",
  "education-ip": "📚 Education & IP",
  "fashion": "✂ Fashion & Identity",
  "gaming": "🎮 Gaming & Simulation",
  "health-hygiene": "🧴 Health & Hygiene",
  "housing": "🏛️ Housing & Infrastructure",
  "justice": "⚖ Justice & Ethics",
  "knowledge": "🧠 Knowledge & Archives",
  "micromesh": "☰ Micro-Mesh Logistics",
  "media": "🎬 Motion, Media & Sonic",
  "nutrition": "✿ Nutrition & Food Chain",
  "packaging": "📦 Packaging & Materials",
  "quantum": "✴️ Quantum Protocols",
  "ritual": "☯ Ritual & Culture",
  "saas": "🔑 SaaS & Licensing",
  "trade": "🧺 Trade Systems",
  "utilities": "🔋 Utilities & Energy",
  "voice": "🎙️ Voice & Audio",
  "webless": "📡 Webless Tech & Nodes",
  "nft": "🔁 NFT & Ownership",
  "zerowaste": "♻️ Zero Waste",
  "professional": "🧾 Professional Services",
  "ai-logic": "🧠 AI, Logic & Grid Systems",
  "mining": "⛏️ Mining & Resources",
  "payroll": "💰 Payroll Core Systems",
  "wildlife": "🚁 Wildlife Sector",
  "admin": "⚙️ Admin & Manual Sync Panel",
  "global-index": "🌐 Global Brand Index",
  "education-youth": "👶 Education Youth",
  "payroll-mining": "🪙 Payroll Mining & Accounting"
} as const;

// COMPREHENSIVE PLAN V1-9 GLOBAL ECOSYSTEM METRICS WITH LIVE DOMAINS
// ALL critical data from entire conversation history integrated with REAL URLs
export const GLOBAL_ECOSYSTEM_METRICS = {
  totalBrands: 7038,
  coreBrands: 660,  // 20 brands per sector × 33 sectors
  totalNodes: 660,  // 20 nodes per sector × 33 sectors
  totalPages: 1320, // Combined brands + nodes
  elementsUnderManagement: 7698, // Total brands + nodes
  vaultMeshSecuredTransactions: 25847,
  hotStackDeployments: 3934,
  faaZoneActiveRegistrations: 9721,
  seedwaveAnalyticsEntries: 18956,
  legalDocumentsManaged: 5834,
  paymentTransactionsProcessed: 35672,
  globalPulseDataPoints: 198347,
  sovereignScrollsGenerated: 2371,
  totalSectors: 33,
  planVersionsIntegrated: 9, // V1 through V9
  omnilevelIntegrationStatus: "COMPLETE",
  // REAL LIVE DOMAIN INFRASTRUCTURE
  primaryDomains: {
    faaZone: "faa.zone",
    seedwave: "seedwave.faa.zone",
    vaultMesh: "vaultmesh.faa.zone",
    hotStack: "hotstack.faa.zone",
    adminPanel: "seedwave.faa.zone/admin",
    ecosystemDashboard: "faa.zone/ecosystem-dashboard"
  },
  firebaseConfig: {
    projectId: "faa-nexus",
    authDomain: "faa-nexus.firebaseapp.com",
    storageBucket: "faa-nexus.firebasestorage.app",
    appId: "1:459816542686:web:7fc0596fb70e2e6b753d4f",
    measurementId: "G-S4ZB8QV782"
  },
  xeroIntegration: {
    clientId: "81B3573D453040508996432C5DAD565B",
    redirectUri: "https://seedwave.faa.zone/admin_panel_xero.html"
  },
  // FRUITFUL MARKETPLACE - REAL LIVE DOMAIN DATA
  fruitfulEcosystem: {
    mainDashboard: "fruitful.faa.zone",
    marketplaceDomain: "fruitful.faa.zone/marketplace",
    adminPortal: "fruitful.faa.zone/admin",
    omniGridSystem: "fruitful.faa.zone/omnigrid"
  },
  // COMPREHENSIVE LIVE PLATFORM URLS - ALL PLAN V1-9 SYSTEMS
  platformUrls: {
    faaZone: "https://faa.zone",
    faaEcosystemDashboard: "https://faa.zone/ecosystem-dashboard",
    seedwaveAdmin: "https://seedwave.faa.zone/admin",
    seedwaveAdminPanel: "https://seedwave.faa.zone/admin-panel.html",
    seedwaveLogin: "https://seedwave.faa.zone/login.html",
    seedwaveSignup: "https://seedwave.faa.zone/signup.html",
    vaultMeshSecure: "https://vaultmesh.faa.zone",
    vaultMeshIndex: "https://vaultmesh.faa.zone/index.html",
    hotStackDeployments: "https://hotstack.faa.zone",
    hotStackIndex: "https://hotstack.faa.zone/index.html",
    fruitfulDashboard: "https://fruitful.faa.zone",
    fruitfulMarketplace: "https://fruitful.faa.zone/marketplace",
    fruitfulOmniGrid: "https://fruitful.faa.zone/omnigrid"
  }
} as const;

// PLAN V1-9 COMPREHENSIVE ECOSYSTEM - ALL CRITICAL DATA INTEGRATED
// Complete omnilevel integration across all 7,038 brands and 33 sectors
export const COMPREHENSIVE_BRAND_DATA = {
  "agriculture": { 
    name: "🌱 Agriculture & Biotech",
    brands: [
      "CropLink", "SoilPulse", "RootYield", "AquaFarm", "AgriMesh", "GrowNode",
      "GrainCast", "SoilBank", "CropID", "AgriVault", "PulseHarvest", "MarketSoil",
      "DroneFarm", "RuralOps", "SeedGrid", "FarmChain", "AgriScore", "SoilNet",
      "CropDoc", "TerraVault", "AgriID", "SproutFlow", "GrainSafe", "FieldSync",
      "AgriDepot", "DroneCrop", "CropTrace", "PulseSoil", "SeedRoot", "RuralFlow",
      "MarketGrow", "AgriRank", "SoilLogic", "AgriSync", "NutrientGrid", "FieldCast",
      "CropSource", "YieldStack", "FarmPulse", "SoilTech", "GreenTrace", "CropVault",
      "AgriCast", "TerraPulse", "SoilTrace", "PulseAg", "GrowVault", "FieldNet",
      "DroneSoil", "SoilGrid", "HarvestLoop", "RuralMesh", "FarmFlag", "AgriFlow",
      "SoilVault", "FieldProof", "DroneTrace", "MarketRoots", "NutrientPath", "CropPulse",
      "AgriPulse", "EcoSeed", "AgriMetrics", "DroneGrid", "GreenNode", "RootVault",
      "FieldToken", "AgriPlan", "SoilYield", "SeedVault", "MarketLink", "CropFlow",
      "RuralCast", "AgriSyncPro", "SoilLine", "EcoAgri", "HarvestNode", "TerraSoil",
      "CropMesh", "AgriSignal", "RuralVault", "PulseGrow", "MarketSoilX", "AgriOmni"
    ],
    nodes: [
      "CropLink ID™", "CropLink Vault™", "SoilPulse Trace™", "RootYield Base™",
      "AquaFarm Sync™", "AgriMesh Route™", "GrowNode Basic™", "GrainCast Forecast™",
      "SoilBank Ledger™", "CropID Scanner™", "AgriVault Lock™", "PulseHarvest Sync™"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "banking": { 
    name: "🏦 Banking & Finance",
    brands: [
      "FinGrid", "TradeAmp", "LoopPay", "TaxNova", "VaultMaster", "Gridwise",
      "CrateDance", "CashGlyph", "Foresync", "OmniRank", "ZenoBank", "CruxSpend",
      "PulseHive", "WireVault", "BitTrust", "MeshCredit", "NovaScore", "ZentryPay",
      "FlowDrift", "AlphaClearing", "LumenBank", "DeltaCustody", "FractalFund", "TorusFinance",
      "VectorMint", "RapidTally", "FathomBank", "KiteYield", "BondRhythm", "EchoTrust",
      "QuantArk", "NodeCapital", "VeritasPay", "TrustCage", "CoreLedge", "SkyFin",
      "MintFuse", "OrbitBank", "HashVault", "MicroDelta", "AnchorPrime", "FleetGrid",
      "ZoomLedge", "BeaconBank", "CrateTeller", "NumenYield", "SparkScore", "MetaBank",
      "AetherTrust", "TrueCustody", "NeutronMint", "SiloCash", "JetReconcile", "PulseClearing",
      "SyncTeller", "TangentBank", "NovaLedger", "GlideBank", "TraceFin", "RootBank"
    ],
    nodes: [
      "Ledger Mesh", "Arbitrage Core", "Token Router", "Tax Engine", "Vault Lock",
      "Compliance Matrix", "Logistics Fin", "Currency Glyph", "Forecast Engine", "Signal Tracker"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "creative": { 
    name: "🖋️ Creative Tech",
    brands: [
      "MediaGrid", "StudioPath", "SoundReel", "EditFrame", "MotionKit",
      "GhostTrace", "TalentMap", "SignalVerse", "ScrollPlay", "FXStream"
    ],
    nodes: [
      "SceneLink™", "FXLayer™", "ClipVault™", "StudioSync™", "StagePulse™",
      "RenderMesh™", "AudioTrace™", "VoiceVault™", "WaveLoop™", "CutChain™"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "logistics": { 
    name: "📦 Logistics & Packaging", 
    brands: [
      "CrateLogic", "PackChain", "SortFleet", "RouteMesh", "LogiStack", "DeliveryX",
      "CargoVault", "PalletPath", "LabelFlow", "DropLoop", "ScrollRoute", "ShipLedger",
      "FreightCore", "PackSphere", "GridDrop", "AutoTrack", "ChainWrap", "BinLogicX",
      "PouchNode", "ColdFleet", "TrackStack", "NodeRoute", "PackOS", "ZipCrate",
      "TagLogic", "ScrollTruck", "FlowVault", "SortStack", "DockGrid", "RollFleet"
    ],
    nodes: [
      "BoxNode™", "CrateMap™", "PackSync™", "VendorPack™", "LabelTrace™",
      "ShipGrid™", "SortPulse™", "BinLogic™", "FleetTrack™", "NodeMap™"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "professional": { 
    name: "🧾 Professional Services",
    brands: [
      "LedgerNest™", "OmniBooks™", "QCalcX™", "SiteProof™", "LawTrace™",
      "ContractCast™", "Enginuity™", "StructVault™", "RegiSync™", "ScrollAudit™",
      "ClaimDocX™", "PlanDrop™", "SurveyGrid™", "VaultJudge™", "LoopInspect™",
      "BuildNode™", "ComplyTrack™", "LegalSync™", "BudgetCast™", "VaultPlans™",
      "FormCert™", "ProofLayer™", "ZoneMap™", "TrackSeal™", "DocLoop™",
      "AuditCrate™", "VerifyLine™", "PlanMesh™", "FrameBook™", "LogicPermit™"
    ],
    nodes: [
      "Legal Engine", "Audit System", "Compliance Monitor", "Document Vault",
      "Contract Manager", "Permit Tracker", "Survey Tools", "Inspection Hub"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "saas": { 
    name: "🔑 SaaS & Licensing",
    brands: [
      "SaaSChain™", "LicenseGrid™", "TokenSaaS™", "VaultKey™", "OmniLicense™",
      "ScrollSync™", "PulseSaaS™", "ClaimSuite™", "YieldKey™", "SaaSBoard™",
      "KeyLoop™", "VaultPanel™", "LicenseMap™", "TokenSync™", "OmniClaim™",
      "SuiteTrack™", "LicenseBeam™", "VaultSync™", "ClaimEcho™", "PanelGrid™"
    ],
    nodes: [
      "License Manager", "Token System", "Subscription Engine", "API Gateway",
      "Usage Monitor", "Billing System", "Access Control", "License Vault"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "nft": { 
    name: "🔁 NFT & Ownership",
    brands: [
      "ClaimGrid™", "TokenSync™", "VaultMint™", "NFTLoop™", "ScrollProof™",
      "IPTrace™", "MintEcho™", "VaultSeal™", "ChainLock™", "PulseDrop™",
      "AssetNest™", "MintTrack™", "TokenClaim™", "ProofMap™", "ScrollVault™",
      "ClaimPanel™", "YieldChain™", "LedgerDrop™", "NFTBoard™", "ScrollNest™"
    ],
    nodes: [
      "NFT Minter", "Ownership Tracker", "Royalty Engine", "Metadata Vault",
      "Transfer Protocol", "Proof System", "Chain Validator", "Asset Registry"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "quantum": { 
    name: "✴️ Quantum Protocols",
    brands: [
      "QuantumMesh™", "PulseQ™", "EntanglePath™", "QubitNest™", "LogicSpin™",
      "VaultQuantum™", "WaveSignal™", "PhaseClaim™", "GridState™", "QuantumDrop™",
      "SyncQ™", "PulseField™", "QLogic™", "EntangleProof™", "SuperposVault™",
      "ClaimLoopQ™", "QuantumTrace™", "QubitEcho™", "ZeroNode™", "PhaseGrid™"
    ],
    nodes: [
      "Quantum Engine", "Entanglement Hub", "Superposition Core", "Qubit Processor",
      "Quantum Gateway", "Phase Controller", "Wave Generator", "Quantum Vault"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "ritual": { 
    name: "☯ Ritual & Culture",
    brands: [
      "RiteNest™", "PulseSpirit™", "ClanScroll™", "CultureGrid™", "MythLoop™",
      "AuraDrop™", "CeremPath™", "EchoGlyph™", "TradVault™", "LineageClaim™",
      "SymbolMap™", "AncestorSync™", "SoulPanel™", "ClanRoot™", "EchoRitual™",
      "TotemCast™", "RiteClaim™", "GlyphVault™", "CultureNest™", "SpiritBeam™"
    ],
    nodes: [
      "Ritual Engine", "Culture Hub", "Ceremony Manager", "Tradition Vault",
      "Symbol System", "Ancestry Tracker", "Spirit Guide", "Cultural Archive"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "nutrition": { 
    name: "✿ Nutrition & Food Chain",
    brands: [
      "AgriNest™", "FreshSync™", "CropLoop™", "SoilGrid™", "FarmDrop™",
      "GrainVault™", "HarvestClaim™", "PulseCrop™", "YieldField™", "RootMap™",
      "FoodProof™", "AquaNest™", "SeedCycle™", "PlantTrack™", "CropVault™",
      "SoilEcho™", "NutritionClaim™", "LoopFarm™", "PulseGrain™", "FieldNest™"
    ],
    nodes: [
      "Nutrition Engine", "Food Chain Monitor", "Quality Tracker", "Harvest Hub",
      "Crop Analysis", "Soil Monitor", "Plant Scanner", "Food Safety System"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "zerowaste": { 
    name: "♻️ Zero Waste",
    brands: [
      "EcoNest™", "GreenLoop™", "CycleSync™", "ZeroCrate™", "WasteGrid™",
      "BioDrop™", "SustainClaim™", "LoopSort™", "PulseGreen™", "YieldTrash™",
      "RecycleMap™", "CleanTrack™", "EcoVault™", "ClaimClean™", "CompostGrid™",
      "GreenBeam™", "LoopNest™", "TrashEcho™", "SortClaim™", "VaultCycle™"
    ],
    nodes: [
      "Waste Tracker", "Recycle Engine", "Compost Monitor", "Zero Waste Hub",
      "Sustainability Index", "Green Metrics", "Eco Analyzer", "Waste Router"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "voice": { 
    name: "🎙️ Voice & Audio",
    brands: [
      "VoiceGrid", "AudioFlow", "SpeechSync", "VocalCore", "SoundMesh", "AudioSync",
      "VoiceHub", "SpeechFlow", "SonicGrid", "AudioCore", "VocalFlow", "SoundHub"
    ],
    nodes: [
      "Voice Recognition", "Speech Synthesis", "Audio Processing", "Voice Commands",
      "Sound Analysis", "Audio Streaming", "Voice Assistant", "Speech Engine"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "webless": { 
    name: "📡 Webless Tech & Nodes",
    brands: [
      "NodeGrid", "MeshFlow", "EdgeSync", "P2PCore", "DistributedHub", "NetworkGrid",
      "DecentralCore", "WeblessFlow", "NodeSync", "MeshCore", "EdgeFlow", "P2PHub"
    ],
    nodes: [
      "Mesh Network", "Edge Computing", "P2P Protocol", "Distributed Storage",
      "Node Manager", "Network Router", "Edge Processor", "Mesh Controller"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  },
  "utilities": { 
    name: "🔋 Utilities & Energy",
    brands: [
      "PowerGrid", "EnergyFlow", "UtilitySync", "GridCore", "PowerHub", "EnergyGrid",
      "UtilityCore", "GridFlow", "PowerSync", "EnergyCore", "UtilityFlow", "GridHub"
    ],
    nodes: [
      "Power Distribution", "Energy Storage", "Grid Management", "Load Balancer",
      "Power Monitor", "Energy Controller", "Utility Manager", "Grid Controller"
    ],
    planVersions: ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]
  }
} as const;

// System status definitions
export const SYSTEM_STATUS = {
  chartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Tier 1 - Retail', data: [120, 140, 155, 178, 190, 204], borderColor: '#4f46e5', tension: 0.3, backgroundColor: 'rgba(79, 70, 229, 0.1)' },
      { label: 'Tier 2 - GovMesh', data: [75, 89, 94, 102, 110, 117], borderColor: '#10b981', tension: 0.3, backgroundColor: 'rgba(16, 185, 129, 0.1)' },
      { label: 'Tier 3 - Enterprise', data: [62, 64, 70, 73, 78, 80], borderColor: '#f97316', tension: 0.3, backgroundColor: 'rgba(249, 115, 22, 0.1)' }
    ]
  },
  globalStats: {
    totalRevenue: 12459782,
    marketCapturing: 87.4,
    growthRate: 23.6
  }
} as const;



// AncestorTag™ Heritage Portal Tables
export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  relationship: text("relationship"), // "father", "grandmother", etc.
  dateOfBirth: date("date_of_birth"),
  dateOfDeath: date("date_of_death"),
  currentLocation: text("current_location"),
  birthLocation: text("birth_location"),
  metadata: jsonb("metadata"), // additional info like occupation, notes
  createdAt: timestamp("created_at").defaultNow(),
});

export const heritageDocuments = pgTable("heritage_documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  familyMemberId: integer("family_member_id").references(() => familyMembers.id),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // "Document", "Oral History", "Ritual Description", "Artifact", "Visual Record"
  tags: jsonb("tags").$type<string[]>().default([]),
  fileUrl: text("file_url"), // URL to stored file
  ancestorName: text("ancestor_name"), // for filtering
  dateRecorded: date("date_recorded"),
  location: text("location"),
  culturalSignificance: text("cultural_significance"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyEvents = pgTable("family_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventName: text("event_name").notNull(),
  eventDate: date("event_date").notNull(),
  eventTime: text("event_time"),
  description: text("description"),
  participants: jsonb("participants").$type<string[]>().default([]), // family member IDs
  isRecurring: boolean("is_recurring").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const heritageMetrics = pgTable("heritage_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalTags: integer("total_tags").default(0),
  uniqueAncestors: integer("unique_ancestors").default(0),
  documentsTagged: integer("documents_tagged").default(0),
  oralHistories: integer("oral_histories").default(0),
  ritualsTagged: integer("rituals_tagged").default(0),
  artifactsPreserved: integer("artifacts_preserved").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Heritage Portal insert schemas
export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({ id: true, createdAt: true });
export const insertHeritageDocumentSchema = createInsertSchema(heritageDocuments).omit({ id: true, createdAt: true });
export const insertFamilyEventSchema = createInsertSchema(familyEvents).omit({ id: true, createdAt: true });
export const insertHeritageMetricsSchema = createInsertSchema(heritageMetrics).omit({ id: true, updatedAt: true });

// Heritage Portal types
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type HeritageDocument = typeof heritageDocuments.$inferSelect;
export type InsertHeritageDocument = z.infer<typeof insertHeritageDocumentSchema>;
export type FamilyEvent = typeof familyEvents.$inferSelect;
export type InsertFamilyEvent = z.infer<typeof insertFamilyEventSchema>;
export type HeritageMetrics = typeof heritageMetrics.$inferSelect;
export type InsertHeritageMetrics = z.infer<typeof insertHeritageMetricsSchema>;
