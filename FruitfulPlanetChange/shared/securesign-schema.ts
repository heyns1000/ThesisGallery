// SecureSign™ VIP API Schema - Fruitful Global Legal Infrastructure
// Complete legal document management and NDA processing system

import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Legal Documents Management
export const legalDocuments = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  documentType: text("document_type").notNull(), // NDA, Contract, Agreement, etc.
  documentTitle: text("document_title").notNull(),
  documentContent: text("document_content"), // Full document text
  documentHash: text("document_hash").notNull(), // SHA-256 hash for integrity
  status: text("status").notNull().default("draft"), // draft, active, signed, expired
  createdAt: timestamp("created_at").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  metadata: jsonb("metadata"), // Additional document properties
});

// NDA Management
export const ndaRecords = pgTable("nda_records", {
  id: serial("id").primaryKey(),
  participantName: text("participant_name").notNull(),
  participantEmail: text("participant_email").notNull(),
  participantCompany: text("participant_company"),
  participantRole: text("participant_role"),
  documentId: integer("document_id").references(() => legalDocuments.id),
  signatureData: text("signature_data"), // Base64 encoded signature
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  signedAt: timestamp("signed_at"),
  status: text("status").notNull().default("pending"), // pending, signed, expired
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// API Keys Management for SecureSign
export const secureSignApiKeys = pgTable("securesign_api_keys", {
  id: serial("id").primaryKey(),
  keyName: text("key_name").notNull(),
  keyValue: text("key_value").notNull(),
  keyType: text("key_type").notNull(), // primary, secondary, development, production
  permissions: text("permissions").array(), // Array of permissions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsed: timestamp("last_used"),
  expiryDate: timestamp("expiry_date"),
  metadata: jsonb("metadata"),
});

// Document Templates
export const documentTemplates = pgTable("document_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  templateType: text("template_type").notNull(), // NDA, Contract, Agreement
  templateContent: text("template_content").notNull(),
  version: text("version").notNull().default("1.0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: jsonb("metadata"),
});

// Audit Trail
export const auditTrail = pgTable("audit_trail", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(), // document_created, document_signed, api_key_used
  entityType: text("entity_type").notNull(), // document, nda, api_key
  entityId: integer("entity_id").notNull(),
  userId: text("user_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Type definitions
export type LegalDocument = typeof legalDocuments.$inferSelect;
export type InsertLegalDocument = typeof legalDocuments.$inferInsert;

export type NDARecord = typeof ndaRecords.$inferSelect;
export type InsertNDARecord = typeof ndaRecords.$inferInsert;

export type SecureSignApiKey = typeof secureSignApiKeys.$inferSelect;
export type InsertSecureSignApiKey = typeof secureSignApiKeys.$inferInsert;

export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = typeof documentTemplates.$inferInsert;

export type AuditTrailEntry = typeof auditTrail.$inferSelect;
export type InsertAuditTrailEntry = typeof auditTrail.$inferInsert;

// Zod schemas for validation
export const insertLegalDocumentSchema = createInsertSchema(legalDocuments);
export const insertNDARecordSchema = createInsertSchema(ndaRecords);
export const insertSecureSignApiKeySchema = createInsertSchema(secureSignApiKeys);
export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates);
export const insertAuditTrailEntrySchema = createInsertSchema(auditTrail);

// API Key data structure from the provided HTML
export const SECURESIGN_API_KEYS = {
  primary: {
    keyName: "Fruitful Global Primary SecureSign API",
    keyValue: "fsg_live_pk_7f8e9d2c1b4a6e5f3g8h9i2j1k4l6m7n8o9p1q2r3s4t5u6v7w8x9y1z2a3b4c5d6e7f8g9h1i2j3k4l5m6n7o8p9q",
    keyType: "production",
    permissions: ["document.create", "document.sign", "nda.manage", "audit.read"],
    description: "Primary production key for SecureSign API operations"
  },
  secondary: {
    keyName: "Fruitful Global Secondary SecureSign API",
    keyValue: "fsg_live_sk_2a3b4c5d6e7f8g9h1i2j3k4l5m6n7o8p9q1r2s3t4u5v6w7x8y9z1a2b3c4d5e6f7g8h9i1j2k3l4m5n6o7p8q9r",
    keyType: "production",
    permissions: ["document.read", "nda.read", "template.manage"],
    description: "Secondary key for read operations and template management"
  },
  development: {
    keyName: "Fruitful Global Development SecureSign API",
    keyValue: "fsg_test_pk_dev_1a2b3c4d5e6f7g8h9i1j2k3l4m5n6o7p8q9r1s2t3u4v5w6x7y8z9a1b2c3d4e5f6g7h8i9j1k2l3m4n5o6p7q8r9s",
    keyType: "development",
    permissions: ["*"],
    description: "Development key with full access for testing"
  },
  webhook: {
    keyName: "Fruitful Global Webhook SecureSign API",
    keyValue: "fsg_webhook_wh_9z8y7x6w5v4u3t2s1r9q8p7o6n5m4l3k2j1i9h8g7f6e5d4c3b2a1z9y8x7w6v5u4t3s2r1q9p8o7n6m5l4k3j2i1h9g",
    keyType: "webhook",
    permissions: ["webhook.receive", "audit.create"],
    description: "Webhook endpoint key for receiving external notifications"
  }
} as const;

// Document templates for NDA and legal documents
export const DOCUMENT_TEMPLATES = {
  standard_nda: {
    templateName: "Standard Non-Disclosure Agreement",
    templateType: "NDA",
    templateContent: `FRUITFUL GLOBAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between Fruitful Global ("Disclosing Party") and [PARTICIPANT_NAME] ("Receiving Party").

1. CONFIDENTIAL INFORMATION
The Receiving Party acknowledges that all information shared by Fruitful Global, including but not limited to:
- Business strategies and plans
- Technical specifications and implementations
- Brand management systems and processes
- Client information and relationships
- Financial information and projections
- Proprietary methodologies and frameworks

2. OBLIGATIONS
The Receiving Party agrees to:
- Maintain strict confidentiality of all disclosed information
- Use the information solely for the purpose of evaluating potential business relationships
- Not disclose any confidential information to third parties
- Return or destroy all confidential materials upon request

3. TERM
This Agreement shall remain in effect for a period of [TERM] years from the date of execution.

4. GOVERNING LAW
This Agreement shall be governed by the laws of [JURISDICTION].

Participant Name: [PARTICIPANT_NAME]
Company: [PARTICIPANT_COMPANY]
Role: [PARTICIPANT_ROLE]
Email: [PARTICIPANT_EMAIL]

Signature: ______________________ Date: ______________`,
    version: "2.1",
    isActive: true
  },
  partnership_agreement: {
    templateName: "Strategic Partnership Agreement",
    templateType: "Agreement",
    templateContent: `FRUITFUL GLOBAL STRATEGIC PARTNERSHIP AGREEMENT

This Strategic Partnership Agreement is entered into between Fruitful Global and [PARTNER_NAME] for the purpose of collaborative business development and mutual growth opportunities.

Terms and conditions to be customized based on partnership scope and requirements.`,
    version: "1.0",
    isActive: true
  }
} as const;