import type { Request, Response, NextFunction } from "express";
import { tripleSyncValidator } from "../triple-sync-validator";

// Middleware to protect sync operations with triple-sync validation
export async function requireTripleSyncLock(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('🔒 Checking triple-sync lock for protected operation...');
    
    const syncStatus = await tripleSyncValidator.getQuickSyncStatus();
    
    if (syncStatus.allowed) {
      console.log('✅ Triple-sync lock validated - operation approved');
      next();
    } else {
      console.log(`❌ Triple-sync lock denied: ${syncStatus.reason}`);
      res.status(423).json({
        error: 'Operation blocked by triple-sync lock',
        reason: syncStatus.reason,
        treatyCompliant: false,
        retryAfter: 30 // seconds
      });
    }
  } catch (error) {
    console.error('❌ Triple-sync validation error:', error);
    res.status(500).json({
      error: 'Triple-sync validation failed',
      treatyCompliant: false
    });
  }
}

// Middleware for logging cross-app operations
export function logCrossAppOperation(operationType: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`🌐 Cross-app operation initiated: ${operationType}`);
    console.log(`📊 Request from: ${req.ip} at ${new Date().toISOString()}`);
    
    // Add operation metadata to request
    (req as any).crossAppOperation = {
      type: operationType,
      timestamp: new Date().toISOString(),
      sourceApp: 'HSOMNI9000'
    };
    
    next();
  };
}

// Validation middleware for treaty compliance
export function requireTreatyCompliance(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.get('User-Agent') || '';
  const validSources = [
    'HSOMNI9000-Triple-Sync-Validator',
    'Fruitful-Planet-Change',
    'Treaty-Flame-Client',
    'Python-Backend-Sync'
  ];

  const isValidSource = validSources.some(source => userAgent.includes(source));
  
  if (!isValidSource && process.env.NODE_ENV === 'production') {
    console.log(`⚖️ Treaty compliance check failed for User-Agent: ${userAgent}`);
    res.status(403).json({
      error: 'Treaty compliance required',
      treatyCompliant: false
    });
    return;
  }

  console.log(`⚖️ Treaty compliance validated for: ${userAgent}`);
  next();
}