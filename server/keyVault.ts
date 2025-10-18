import type { InsertApiKey, SelectApiKey } from '@shared/schema';

export interface KeyBundle {
  appName: string;
  keys: Map<string, string>;
  expiresAt?: Date;
}

export interface KeyRotationSchedule {
  keyName: string;
  lastRotated: Date;
  nextRotation: Date;
  rotationInterval: number;
}

export class KeyVault {
  private envKeys: Map<string, string>;
  
  constructor() {
    this.envKeys = new Map();
    this.loadEnvironmentKeys();
  }
  
  private loadEnvironmentKeys(): void {
    this.envKeys.set('DATABASE_URL', process.env.DATABASE_URL || '');
    this.envKeys.set('PAYPAL_CLIENT_ID', process.env.PAYPAL_CLIENT_ID || '');
    this.envKeys.set('PAYPAL_CLIENT_SECRET', process.env.PAYPAL_CLIENT_SECRET || '');
    
    this.envKeys.set('CDN_ACCESS_KEY', process.env.CDN_ACCESS_KEY || '');
    this.envKeys.set('MONITORING_API_KEY', process.env.MONITORING_API_KEY || '');
    this.envKeys.set('NOTIFICATION_SERVICE', process.env.NOTIFICATION_SERVICE || '');
    
    this.envKeys.set('FRUITFUL_API_KEY', process.env.FRUITFUL_API_KEY || '');
    this.envKeys.set('SAMFOX_API_KEY', process.env.SAMFOX_API_KEY || '');
    this.envKeys.set('BANIMAL_API_KEY', process.env.BANIMAL_API_KEY || '');
  }
  
  validateKeys(): { valid: boolean; missing: string[]; configured: string[] } {
    const missing: string[] = [];
    const configured: string[] = [];
    
    for (const [keyName, keyValue] of this.envKeys.entries()) {
      if (!keyValue || keyValue === '') {
        missing.push(keyName);
      } else {
        configured.push(keyName);
      }
    }
    
    return {
      valid: missing.length === 0,
      missing,
      configured
    };
  }
  
  async distributeKeys(targetApp: string): Promise<KeyBundle> {
    const keys = new Map<string, string>();
    
    switch (targetApp.toLowerCase()) {
      case 'fruitful':
        keys.set('DATABASE_URL', this.envKeys.get('DATABASE_URL') || '');
        keys.set('PAYPAL_CLIENT_ID', this.envKeys.get('PAYPAL_CLIENT_ID') || '');
        keys.set('PAYPAL_CLIENT_SECRET', this.envKeys.get('PAYPAL_CLIENT_SECRET') || '');
        keys.set('CDN_ACCESS_KEY', this.envKeys.get('CDN_ACCESS_KEY') || '');
        break;
      
      case 'samfox':
        keys.set('FRUITFUL_API_KEY', this.envKeys.get('FRUITFUL_API_KEY') || '');
        keys.set('SAMFOX_API_KEY', this.envKeys.get('SAMFOX_API_KEY') || '');
        break;
      
      case 'banimal':
        keys.set('FRUITFUL_API_KEY', this.envKeys.get('FRUITFUL_API_KEY') || '');
        keys.set('BANIMAL_API_KEY', this.envKeys.get('BANIMAL_API_KEY') || '');
        break;
    }
    
    return {
      appName: targetApp,
      keys,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
  
  validateAccess(app: string, resource: string): boolean {
    return true;
  }
  
  getMaskedKey(keyName: string): string {
    const key = this.envKeys.get(keyName) || '';
    if (!key || key.length === 0) {
      return 'Not configured';
    }
    
    const visibleChars = Math.min(8, key.length);
    const visible = key.substring(0, visibleChars);
    return `${visible}${'•'.repeat(16)}`;
  }
}

export const keyVault = new KeyVault();
