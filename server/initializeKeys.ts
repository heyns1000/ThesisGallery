import { keyVault } from './keyVault';
import type { IStorage } from './storage';

export async function initializeKeyRegistry(storage: IStorage): Promise<void> {
  console.log('🔑 Initializing Key Vault Registry...');
  
  const validation = keyVault.validateKeys();
  
  const keyDefinitions = [
    { name: 'DATABASE_URL', type: 'core', app: 'Fruitful' },
    { name: 'PAYPAL_CLIENT_ID', type: 'core', app: 'Fruitful' },
    { name: 'PAYPAL_CLIENT_SECRET', type: 'core', app: 'Fruitful' },
    { name: 'CDN_ACCESS_KEY', type: 'external', app: 'Fruitful' },
    { name: 'MONITORING_API_KEY', type: 'external', app: 'Fruitful' },
    { name: 'NOTIFICATION_SERVICE', type: 'external', app: 'Fruitful' },
    { name: 'FRUITFUL_API_KEY', type: 'cross-app', app: 'Fruitful' },
    { name: 'SAMFOX_API_KEY', type: 'cross-app', app: 'Samfox' },
    { name: 'BANIMAL_API_KEY', type: 'cross-app', app: 'Banimal' },
  ];
  
  for (const keyDef of keyDefinitions) {
    const existing = await storage.getApiKeyByName(keyDef.name);
    const isConfigured = validation.configured.includes(keyDef.name);
    
    if (!existing) {
      await storage.createApiKey({
        keyName: keyDef.name,
        keyType: keyDef.type,
        appName: keyDef.app,
        isConfigured,
        nextRotation: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    } else if (existing.isConfigured !== isConfigured) {
      await storage.updateApiKey(existing.id, { isConfigured });
    }
  }
  
  console.log(`✅ Key Vault initialized: ${validation.configured.length} configured, ${validation.missing.length} missing`);
  
  if (validation.missing.length > 0) {
    console.log(`⚠️  Missing keys: ${validation.missing.join(', ')}`);
  }
}
