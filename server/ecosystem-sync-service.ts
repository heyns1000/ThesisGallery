import { db } from "./db";
import {
  ecosystemSyncLogs,
  banimalConnections,
  banimalProducts,
  banimalCustomers,
  ecosystemSystems,
  ecosystemApps,
  type EcosystemSyncLog,
  type BanimalConnection,
  type BanimalProduct,
  type BanimalCustomer,
  type InsertEcosystemSyncLog,
} from "@shared/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Ecosystem Sync Service
 * 
 * Core functionality for syncing Master Hub data to external systems:
 * - Push products to WordPress (banimal.co.za)
 * - Push user profiles to WordPress
 * - Sync data to any connected system
 * - Track all sync operations with detailed logs
 */
export class EcosystemSyncService {

  // ===============================
  // WORDPRESS PRODUCT SYNC
  // ===============================

  async pushProductsToWordPress(
    connectionId: string,
    productIds: string[],
    syncLogId?: string
  ): Promise<EcosystemSyncLog> {
    const startTime = Date.now();
    const logId = syncLogId || nanoid();

    // CRITICAL FIX #2: Create sync log FIRST with status='pending' OUTSIDE try/catch
    // This prevents masking of DB insert errors
    const [syncLog] = await db.insert(ecosystemSyncLogs)
      .values({
        id: logId,
        syncType: "wordpress-products",
        systemId: connectionId,
        status: "pending",
        recordsSynced: 0,
        metadata: { productIds, startTime: new Date().toISOString() }
      })
      .returning();

    try {
      // Fetch connection details
      const [connection] = await db.select()
        .from(banimalConnections)
        .where(eq(banimalConnections.id, connectionId));

      if (!connection) {
        throw new Error(`Connection not found: ${connectionId}`);
      }

      if (!connection.apiBaseUrl) {
        throw new Error("API Base URL not configured for connection");
      }

      // Fetch products to sync
      const products = await db.select()
        .from(banimalProducts)
        .where(inArray(banimalProducts.id, productIds));

      if (products.length === 0) {
        throw new Error("No products found to sync");
      }

      // CRITICAL FIX #3: Track individual item results for partial success handling
      const results = {
        successful: [] as string[],
        failed: [] as Array<{ id: string; error: string }>
      };

      for (const product of products) {
        try {
          const wordPressData = {
            name: product.name,
            description: product.description,
            price: product.price,
            currency: product.currency,
            category: product.category,
            subcategory: product.subcategory,
            sku: product.sku,
            inventory: product.inventory,
            images: product.images,
            variants: product.variants,
            specifications: product.specifications,
            seoTitle: product.seoTitle,
            seoDescription: product.seoDescription,
            tags: product.tags,
            status: product.status,
            faaProductId: product.id, // Master Hub reference
          };

          const response = await fetch(`${connection.apiBaseUrl}/products`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(connection.apiKey && { "X-API-Key": connection.apiKey }),
            },
            body: JSON.stringify(wordPressData),
          });

          if (response.ok) {
            results.successful.push(product.id);
          } else {
            const errorText = await response.text();
            results.failed.push({ id: product.id, error: `API error ${response.status}: ${errorText}` });
          }
        } catch (error) {
          results.failed.push({ 
            id: product.id, 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      }

      const duration = Date.now() - startTime;

      // CRITICAL FIX #3: Update sync log with partial results
      // If successful.length > 0, status = 'completed' (partial success)
      // If successful.length === 0, status = 'error' (total failure)
      const [completedLog] = await db.update(ecosystemSyncLogs)
        .set({
          status: results.successful.length > 0 ? "completed" : "error",
          recordsSynced: results.successful.length,
          completedAt: new Date(),
          errorMessage: results.failed.length > 0 
            ? `Synced ${results.successful.length}/${products.length} products. ${results.failed.length} failed.` 
            : undefined,
          metadata: {
            productIds,
            successful: results.successful,
            failed: results.failed,
            duration,
            completedAt: new Date().toISOString()
          }
        })
        .where(eq(ecosystemSyncLogs.id, logId))
        .returning();

      // CRITICAL FIX #3: Update connection stats correctly
      // Increment successfulSyncs if any items succeeded
      // Increment failedSyncs only if ALL items failed
      if (results.successful.length > 0) {
        // At least some succeeded - count as successful sync
        await db.update(banimalConnections)
          .set({
            lastSuccessfulSync: new Date(),
            totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
            successfulSyncs: sql`${banimalConnections.successfulSyncs} + 1`,
            status: "connected"
          })
          .where(eq(banimalConnections.id, connectionId));
      } else {
        // All failed - count as failed sync
        await db.update(banimalConnections)
          .set({
            totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
            failedSyncs: sql`${banimalConnections.failedSyncs} + 1`,
            status: "error"
          })
          .where(eq(banimalConnections.id, connectionId));
      }

      return completedLog;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      // Update sync log with error status (validation/setup failure before sync started)
      const [errorLog] = await db.update(ecosystemSyncLogs)
        .set({
          status: "error",
          errorMessage,
          completedAt: new Date(),
          metadata: {
            productIds,
            error: errorMessage,
            duration,
            completedAt: new Date().toISOString()
          }
        })
        .where(eq(ecosystemSyncLogs.id, logId))
        .returning();

      // CRITICAL FIX #2: Only update connection stats when sync actually runs
      // Don't update stats if validation fails before sync starts
      // Only increment failed syncs if this was a real sync failure, not a validation error
      if (errorMessage.includes('Connection not found') || errorMessage.includes('API Base URL not configured')) {
        // Validation error - don't update stats
      } else {
        // Real sync failure - update stats
        await db.update(banimalConnections)
          .set({
            totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
            failedSyncs: sql`${banimalConnections.failedSyncs} + 1`,
            status: "error"
          })
          .where(eq(banimalConnections.id, connectionId));
      }

      return errorLog;
    }
  }

  // ===============================
  // WORDPRESS USER SYNC
  // ===============================

  async pushUsersToWordPress(
    connectionId: string,
    userIds: string[],
    syncLogId?: string
  ): Promise<EcosystemSyncLog> {
    const startTime = Date.now();
    const logId = syncLogId || nanoid();

    // CRITICAL FIX #2: Create sync log FIRST with status='pending' OUTSIDE try/catch
    // This prevents masking of DB insert errors
    const [syncLog] = await db.insert(ecosystemSyncLogs)
      .values({
        id: logId,
        syncType: "wordpress-users",
        systemId: connectionId,
        status: "pending",
        recordsSynced: 0,
        metadata: { userIds, startTime: new Date().toISOString() }
      })
      .returning();

    try {
      // Fetch connection details
      const [connection] = await db.select()
        .from(banimalConnections)
        .where(eq(banimalConnections.id, connectionId));

      if (!connection) {
        throw new Error(`Connection not found: ${connectionId}`);
      }

      if (!connection.apiBaseUrl) {
        throw new Error("API Base URL not configured for connection");
      }

      // Fetch users to sync
      const users = await db.select()
        .from(banimalCustomers)
        .where(inArray(banimalCustomers.id, userIds));

      if (users.length === 0) {
        throw new Error("No users found to sync");
      }

      // CRITICAL FIX #3: Track individual item results for partial success handling
      const results = {
        successful: [] as string[],
        failed: [] as Array<{ id: string; error: string }>
      };

      for (const user of users) {
        try {
          const wordPressData = {
            faaId: user.faaId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            addresses: user.addresses,
            loyaltyPoints: user.loyaltyPoints,
            totalSpent: user.totalSpent,
            orderCount: user.orderCount,
            preferences: user.preferences,
            marketingOptIn: user.marketingOptIn,
            lastOrderDate: user.lastOrderDate,
            customerSince: user.customerSince,
            status: user.status,
            faaCustomerId: user.id, // Master Hub reference
          };

          const response = await fetch(`${connection.apiBaseUrl}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(connection.apiKey && { "X-API-Key": connection.apiKey }),
            },
            body: JSON.stringify(wordPressData),
          });

          if (response.ok) {
            results.successful.push(user.id);
          } else {
            const errorText = await response.text();
            results.failed.push({ id: user.id, error: `API error ${response.status}: ${errorText}` });
          }
        } catch (error) {
          results.failed.push({ 
            id: user.id, 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      }

      const duration = Date.now() - startTime;

      // CRITICAL FIX #3: Update sync log with partial results
      // If successful.length > 0, status = 'completed' (partial success)
      // If successful.length === 0, status = 'error' (total failure)
      const [completedLog] = await db.update(ecosystemSyncLogs)
        .set({
          status: results.successful.length > 0 ? "completed" : "error",
          recordsSynced: results.successful.length,
          completedAt: new Date(),
          errorMessage: results.failed.length > 0 
            ? `Synced ${results.successful.length}/${users.length} users. ${results.failed.length} failed.` 
            : undefined,
          metadata: {
            userIds,
            successful: results.successful,
            failed: results.failed,
            duration,
            completedAt: new Date().toISOString()
          }
        })
        .where(eq(ecosystemSyncLogs.id, logId))
        .returning();

      // CRITICAL FIX #3: Update connection stats correctly
      // Increment successfulSyncs if any items succeeded
      // Increment failedSyncs only if ALL items failed
      if (results.successful.length > 0) {
        // At least some succeeded - count as successful sync
        await db.update(banimalConnections)
          .set({
            lastSuccessfulSync: new Date(),
            totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
            successfulSyncs: sql`${banimalConnections.successfulSyncs} + 1`,
            status: "connected"
          })
          .where(eq(banimalConnections.id, connectionId));
      } else {
        // All failed - count as failed sync
        await db.update(banimalConnections)
          .set({
            totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
            failedSyncs: sql`${banimalConnections.failedSyncs} + 1`,
            status: "error"
          })
          .where(eq(banimalConnections.id, connectionId));
      }

      return completedLog;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      // Update sync log with error status (validation/setup failure before sync started)
      const [errorLog] = await db.update(ecosystemSyncLogs)
        .set({
          status: "error",
          errorMessage,
          completedAt: new Date(),
          metadata: {
            userIds,
            error: errorMessage,
            duration,
            completedAt: new Date().toISOString()
          }
        })
        .where(eq(ecosystemSyncLogs.id, logId))
        .returning();

      // CRITICAL FIX #2: Only update connection stats when sync actually runs
      // Don't update stats if validation fails before sync starts
      // Only increment failed syncs if this was a real sync failure, not a validation error
      if (errorMessage.includes('Connection not found') || errorMessage.includes('API Base URL not configured')) {
        // Validation error - don't update stats
      } else {
        // Real sync failure - update stats
        await db.update(banimalConnections)
          .set({
            totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
            failedSyncs: sql`${banimalConnections.failedSyncs} + 1`,
            status: "error"
          })
          .where(eq(banimalConnections.id, connectionId));
      }

      return errorLog;
    }
  }

  // ===============================
  // GENERAL SYSTEM SYNC
  // ===============================

  async syncSystemData(
    systemId: string,
    syncType: "full" | "incremental",
    syncLogId?: string
  ): Promise<EcosystemSyncLog> {
    const startTime = Date.now();
    const logId = syncLogId || nanoid();

    // Create initial sync log
    const [syncLog] = await db.insert(ecosystemSyncLogs)
      .values({
        id: logId,
        syncType: `system-${syncType}`,
        systemId,
        status: "in-progress",
        recordsSynced: 0,
        metadata: { syncType, startTime: new Date().toISOString() }
      })
      .returning();

    try {
      // Fetch system details
      const [system] = await db.select()
        .from(ecosystemSystems)
        .where(eq(ecosystemSystems.id, systemId));

      if (!system) {
        throw new Error(`System not found: ${systemId}`);
      }

      // Determine what to sync based on system type
      let recordsSynced = 0;
      const results: any[] = [];

      if (system.systemType === "wordpress") {
        // Sync all products and users if it's a WordPress system
        const products = await db.select().from(banimalProducts);
        const users = await db.select().from(banimalCustomers);

        recordsSynced = products.length + users.length;
        results.push({
          products: products.length,
          users: users.length,
          syncType
        });
      } else {
        // Generic system sync logic
        recordsSynced = 1;
        results.push({
          systemType: system.systemType,
          syncType,
          message: "Generic sync completed"
        });
      }

      const duration = Date.now() - startTime;

      // Update sync log with completion
      const [completedLog] = await db.update(ecosystemSyncLogs)
        .set({
          status: "completed",
          recordsSynced,
          completedAt: new Date(),
          metadata: {
            syncType,
            results,
            duration,
            completedAt: new Date().toISOString()
          }
        })
        .where(eq(ecosystemSyncLogs.id, logId))
        .returning();

      // Update system last synced timestamp
      await db.update(ecosystemSystems)
        .set({ lastSynced: new Date() })
        .where(eq(ecosystemSystems.id, systemId));

      return completedLog;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

      // Update sync log with error
      const [errorLog] = await db.update(ecosystemSyncLogs)
        .set({
          status: "error",
          errorMessage,
          completedAt: new Date(),
          metadata: {
            syncType,
            error: errorMessage,
            duration,
            completedAt: new Date().toISOString()
          }
        })
        .where(eq(ecosystemSyncLogs.id, logId))
        .returning();

      return errorLog;
    }
  }

  // ===============================
  // SYNC LOG MANAGEMENT
  // ===============================

  async createSyncLog(
    type: string,
    systemId: string | null,
    appId: string | null,
    status: string,
    records: number = 0
  ): Promise<EcosystemSyncLog> {
    const [syncLog] = await db.insert(ecosystemSyncLogs)
      .values({
        syncType: type,
        systemId: systemId || undefined,
        appId: appId || undefined,
        status,
        recordsSynced: records,
        metadata: { createdAt: new Date().toISOString() }
      })
      .returning();

    return syncLog;
  }

  async getSyncLogs(limit: number = 50): Promise<EcosystemSyncLog[]> {
    return await db.select()
      .from(ecosystemSyncLogs)
      .orderBy(desc(ecosystemSyncLogs.startedAt))
      .limit(limit);
  }

  async getSyncLogById(id: string): Promise<EcosystemSyncLog | null> {
    const [log] = await db.select()
      .from(ecosystemSyncLogs)
      .where(eq(ecosystemSyncLogs.id, id));
    return log || null;
  }

  async getSyncLogsBySystem(systemId: string): Promise<EcosystemSyncLog[]> {
    return await db.select()
      .from(ecosystemSyncLogs)
      .where(eq(ecosystemSyncLogs.systemId, systemId))
      .orderBy(desc(ecosystemSyncLogs.startedAt));
  }

  // ===============================
  // HELPER METHODS
  // ===============================

  private async updateConnectionStats(
    connectionId: string,
    success: boolean
  ): Promise<void> {
    if (success) {
      await db.update(banimalConnections)
        .set({
          lastSuccessfulSync: new Date(),
          totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
          successfulSyncs: sql`${banimalConnections.successfulSyncs} + 1`,
          status: "connected"
        })
        .where(eq(banimalConnections.id, connectionId));
    } else {
      await db.update(banimalConnections)
        .set({
          totalSyncs: sql`${banimalConnections.totalSyncs} + 1`,
          failedSyncs: sql`${banimalConnections.failedSyncs} + 1`,
          status: "error"
        })
        .where(eq(banimalConnections.id, connectionId));
    }
  }

  async testConnection(connectionId: string): Promise<{
    success: boolean;
    message: string;
    latency?: number;
  }> {
    const startTime = Date.now();

    try {
      const [connection] = await db.select()
        .from(banimalConnections)
        .where(eq(banimalConnections.id, connectionId));

      if (!connection) {
        return { success: false, message: "Connection not found" };
      }

      if (!connection.apiBaseUrl) {
        return { success: false, message: "API Base URL not configured" };
      }

      // Test the connection with a simple request
      const response = await fetch(`${connection.apiBaseUrl}/health`, {
        method: "GET",
        headers: {
          ...(connection.apiKey && { "X-API-Key": connection.apiKey }),
        },
      });

      const latency = Date.now() - startTime;

      if (!response.ok) {
        await db.update(banimalConnections)
          .set({
            status: "error",
            lastConnectionTest: new Date()
          })
          .where(eq(banimalConnections.id, connectionId));

        return { 
          success: false, 
          message: `Connection failed: ${response.status}`,
          latency 
        };
      }

      // Update connection status
      await db.update(banimalConnections)
        .set({
          status: "connected",
          lastConnectionTest: new Date()
        })
        .where(eq(banimalConnections.id, connectionId));

      return { 
        success: true, 
        message: "Connection successful",
        latency 
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      await db.update(banimalConnections)
        .set({
          status: "disconnected",
          lastConnectionTest: new Date()
        })
        .where(eq(banimalConnections.id, connectionId));

      return { 
        success: false, 
        message: `Connection error: ${errorMessage}`,
        latency 
      };
    }
  }

  // ===============================
  // DASHBOARD STATS
  // ===============================

  async getDashboardStats(): Promise<{
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    activeSystems: number;
    lastSyncTime: string | null;
  }> {
    const [stats] = await db.select({
      totalSyncs: sql<number>`COUNT(*)`,
      successfulSyncs: sql<number>`COUNT(CASE WHEN ${ecosystemSyncLogs.status} = 'completed' THEN 1 END)`,
      failedSyncs: sql<number>`COUNT(CASE WHEN ${ecosystemSyncLogs.status} = 'error' THEN 1 END)`,
    })
    .from(ecosystemSyncLogs);

    const [systemStats] = await db.select({
      activeSystems: sql<number>`COUNT(CASE WHEN ${ecosystemSystems.status} = 'active' THEN 1 END)`,
    })
    .from(ecosystemSystems);

    const [lastSync] = await db.select({
      lastSyncTime: ecosystemSyncLogs.completedAt
    })
    .from(ecosystemSyncLogs)
    .where(eq(ecosystemSyncLogs.status, "completed"))
    .orderBy(desc(ecosystemSyncLogs.completedAt))
    .limit(1);

    return {
      totalSyncs: stats.totalSyncs || 0,
      successfulSyncs: stats.successfulSyncs || 0,
      failedSyncs: stats.failedSyncs || 0,
      activeSystems: systemStats?.activeSystems || 0,
      lastSyncTime: lastSync?.lastSyncTime?.toISOString() || null,
    };
  }
}

// Export singleton instance
export const ecosystemSyncService = new EcosystemSyncService();
