import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User subscription table to track plan versions and access levels
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planType: text("plan_type").notNull().default("free"), // free, basic, premium, enterprise
  maxVersion: text("max_version").notNull().default("V1"), // V1, V2, V3... V9
  isActive: boolean("is_active").notNull().default(true),
  subscriptionDate: text("subscription_date").default("now()"),
  expirationDate: text("expiration_date"),
  metadata: jsonb("metadata"), // Additional subscription data
});

// Plan version access matrix
export const planVersionAccess = pgTable("plan_version_access", {
  id: serial("id").primaryKey(),
  planType: text("plan_type").notNull(),
  maxVersion: text("max_version").notNull(),
  features: jsonb("features").$type<string[]>().default([]),
  brandLimit: integer("brand_limit"), // null = unlimited
  sectorLimit: integer("sector_limit"), // null = unlimited
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  subscriptionDate: true,
});

export const insertPlanVersionAccessSchema = createInsertSchema(planVersionAccess).omit({
  id: true,
});

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertPlanVersionAccess = z.infer<typeof insertPlanVersionAccessSchema>;
export type PlanVersionAccess = typeof planVersionAccess.$inferSelect;

// Plan version mappings
export const PLAN_VERSION_MATRIX = {
  "free": {
    maxVersion: "V1",
    features: ["basic_brands", "limited_sectors"],
    brandLimit: 10,
    sectorLimit: 3,
    description: "Free access to V1 features only"
  },
  "basic": {
    maxVersion: "V3",
    features: ["basic_brands", "standard_sectors", "basic_analytics"],
    brandLimit: 100,
    sectorLimit: 10,
    description: "Access to V1-V3 features"
  },
  "premium": {
    maxVersion: "V6",
    features: ["premium_brands", "all_sectors", "advanced_analytics", "export_features"],
    brandLimit: 1000,
    sectorLimit: 25,
    description: "Access to V1-V6 features"
  },
  "enterprise": {
    maxVersion: "V9",
    features: ["unlimited_brands", "all_sectors", "advanced_analytics", "export_features", "api_access", "white_label"],
    brandLimit: null,
    sectorLimit: null,
    description: "Full access to all V1-V9 features"
  }
} as const;

// Helper function to check version access
export function hasVersionAccess(userPlan: string, requestedVersion: string): boolean {
  const planKey = userPlan as keyof typeof PLAN_VERSION_MATRIX;
  const userMaxVersion = PLAN_VERSION_MATRIX[planKey]?.maxVersion || "V1";
  const userVersionNum = parseInt(userMaxVersion.replace("V", ""));
  const requestedVersionNum = parseInt(requestedVersion.replace("V", ""));
  return requestedVersionNum <= userVersionNum;
}

// Get available versions for a user plan
export function getAvailableVersions(userPlan: string): string[] {
  const planKey = userPlan as keyof typeof PLAN_VERSION_MATRIX;
  const maxVersion = PLAN_VERSION_MATRIX[planKey]?.maxVersion || "V1";
  const maxVersionNum = parseInt(maxVersion.replace("V", ""));
  return Array.from({ length: maxVersionNum }, (_, i) => `V${i + 1}`);
}

// Check if user can access specific features
export function hasFeatureAccess(userPlan: string, feature: string): boolean {
  const planKey = userPlan as keyof typeof PLAN_VERSION_MATRIX;
  const planConfig = PLAN_VERSION_MATRIX[planKey];
  if (!planConfig) return false;
  return planConfig.features.includes(feature as any);
}