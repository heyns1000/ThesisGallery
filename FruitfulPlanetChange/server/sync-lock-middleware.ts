
import { Request, Response, NextFunction } from 'express';
import { executeEnhancedTripleSourceAudit, verifySyncOperation } from './enhanced-triple-source-audit';

interface SyncLockMiddleware {
  requireSyncVerification: (operationType: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
  checkSyncStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const syncLockMiddleware: SyncLockMiddleware = {
  // Middleware to verify sync before allowing operations
  requireSyncVerification: (operationType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(`🔐 Checking sync verification for operation: ${operationType}`);
        
        const isAllowed = await verifySyncOperation(operationType);
        
        if (!isAllowed) {
          return res.status(423).json({
            error: 'Sync Lock Active',
            message: `Operation '${operationType}' blocked due to source discrepancies`,
            details: 'All three sources (Treaty Flame, Fruitful Backend, Python Dashboard) must provide identical counts',
            action: 'Run enhanced audit to identify and resolve discrepancies'
          });
        }
        
        console.log(`✅ Sync verification passed for: ${operationType}`);
        next();
        
      } catch (error) {
        console.error(`❌ Sync verification failed for ${operationType}:`, error);
        return res.status(500).json({
          error: 'Sync Verification Failed',
          message: 'Unable to verify sync status',
          details: error.message
        });
      }
    };
  },

  // Middleware to check general sync status
  checkSyncStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const syncStatus = await executeEnhancedTripleSourceAudit();
      
      // Add sync status to request for use in routes
      (req as any).syncStatus = syncStatus;
      
      if (!syncStatus.syncAllowed) {
        console.log('⚠️ Request processed with active sync lock');
      }
      
      next();
      
    } catch (error) {
      console.error('❌ Sync status check failed:', error);
      // Don't block request, but log the error
      (req as any).syncStatus = {
        isLocked: true,
        syncAllowed: false,
        error: error.message
      };
      next();
    }
  }
};

// Protected operations that require sync verification
export const PROTECTED_OPERATIONS = {
  DB_WRITE: 'database_write',
  MIGRATION: 'migration',
  BRAND_SYNC: 'brand_sync',
  SECTOR_SYNC: 'sector_sync',
  VAULT_FINALIZATION: 'vault_finalization',
  ADMIN_SYNC: 'admin_sync_logs',
  BULK_IMPORT: 'bulk_import',
  SCHEMA_UPDATE: 'schema_update'
} as const;

export type ProtectedOperation = typeof PROTECTED_OPERATIONS[keyof typeof PROTECTED_OPERATIONS];
