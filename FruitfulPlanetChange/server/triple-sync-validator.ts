// Triple-Sync Lock Validator for Cross-App Integration
// Validates data consistency across Fruitful Planet Change, Python Backend, and Treaty Flame

interface AppSummary {
  sectors: number;
  brands: number;
  totalElements: number;
  appName: string;
  lastUpdated: string;
  dataHash: string;
  treatyCompliant: boolean;
}

interface SyncValidationResult {
  isValid: boolean;
  allAppsOnline: boolean;
  dataConsistent: boolean;
  discrepancies: string[];
  appStatuses: {
    hsomni9000: AppSummary | null;
    fruitfulPlanetChange: AppSummary | null;
    pythonBackend: AppSummary | null;
  };
  syncAllowed: boolean;
  lastValidation: string;
}

export class TripleSyncValidator {
  private appUrls = {
    fruitfulPlanetChange: 'https://fruitful-planet-change.replit.app/api/public/summary',
    pythonBackend: 'https://fruitful-phyton-backend.replit.app/api/internal/summary',
    treatyFlame: 'https://flametreaty.replit.app/api/treaty/status'
  };

  async validateTripleSync(): Promise<SyncValidationResult> {
    console.log('🔒 Initiating Triple-Sync Lock validation...');
    
    const result: SyncValidationResult = {
      isValid: false,
      allAppsOnline: false,
      dataConsistent: false,
      discrepancies: [],
      appStatuses: {
        hsomni9000: null,
        fruitfulPlanetChange: null,
        pythonBackend: null
      },
      syncAllowed: false,
      lastValidation: new Date().toISOString()
    };

    try {
      // Fetch local HSOMNI9000 summary
      const localSummary = await this.getLocalSummary();
      result.appStatuses.hsomni9000 = localSummary;

      // Fetch external app summaries with timeout
      const [fruitfulSummary, pythonSummary] = await Promise.allSettled([
        this.fetchWithTimeout(this.appUrls.fruitfulPlanetChange, 10000),
        this.fetchWithTimeout(this.appUrls.pythonBackend, 10000)
      ]);

      // Process Fruitful Planet Change response
      if (fruitfulSummary.status === 'fulfilled') {
        result.appStatuses.fruitfulPlanetChange = await fruitfulSummary.value.json();
      } else {
        result.discrepancies.push('Fruitful Planet Change app offline or unreachable');
      }

      // Process Python Backend response
      if (pythonSummary.status === 'fulfilled') {
        result.appStatuses.pythonBackend = await pythonSummary.value.json();
      } else {
        result.discrepancies.push('Python Backend app offline or unreachable');
      }

      // Check if all apps are responding
      const onlineApps = Object.values(result.appStatuses).filter(app => app !== null);
      result.allAppsOnline = onlineApps.length === 3;

      if (!result.allAppsOnline) {
        result.discrepancies.push(`Only ${onlineApps.length}/3 apps are online`);
      }

      // Validate data consistency across online apps
      if (onlineApps.length >= 2) {
        result.dataConsistent = this.validateDataConsistency(onlineApps);
        
        if (!result.dataConsistent) {
          result.discrepancies.push('Data counts do not match across apps');
          this.logDataDiscrepancies(onlineApps);
        }
      }

      // Check treaty compliance
      const allTreatyCompliant = onlineApps.every(app => app.treatyCompliant === true);
      if (!allTreatyCompliant) {
        result.discrepancies.push('Not all apps are treaty compliant');
      }

      // Final validation
      result.isValid = result.allAppsOnline && result.dataConsistent && allTreatyCompliant;
      result.syncAllowed = result.isValid && result.discrepancies.length === 0;

      console.log(`🔒 Triple-Sync validation ${result.isValid ? 'PASSED' : 'FAILED'}`);
      console.log(`📊 Apps online: ${onlineApps.length}/3`);
      console.log(`📈 Data consistent: ${result.dataConsistent}`);
      console.log(`⚖️ Sync allowed: ${result.syncAllowed}`);

      if (result.discrepancies.length > 0) {
        console.log('⚠️ Discrepancies found:', result.discrepancies);
      }

      return result;

    } catch (error) {
      console.error('❌ Triple-Sync validation error:', error);
      result.discrepancies.push(`Validation error: ${error.message}`);
      return result;
    }
  }

  private async getLocalSummary(): Promise<AppSummary> {
    // Import storage here to avoid circular dependencies
    const { storage } = await import('./storage');
    
    const [sectors, brands] = await Promise.all([
      storage.getAllSectors(),
      storage.getAllBrands()
    ]);

    return {
      sectors: sectors.length,
      brands: brands.length,
      totalElements: sectors.length + brands.length,
      appName: "HSOMNI9000",
      lastUpdated: new Date().toISOString(),
      dataHash: this.generateSimpleHash(sectors.length + brands.length),
      treatyCompliant: true
    };
  }

  private async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HSOMNI9000-Triple-Sync-Validator'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private validateDataConsistency(apps: AppSummary[]): boolean {
    if (apps.length < 2) return true;

    const firstApp = apps[0];
    return apps.every(app => 
      app.sectors === firstApp.sectors &&
      app.brands === firstApp.brands &&
      app.totalElements === firstApp.totalElements
    );
  }

  private logDataDiscrepancies(apps: AppSummary[]): void {
    console.log('📊 Data comparison across apps:');
    apps.forEach(app => {
      console.log(`  ${app.appName}: Sectors=${app.sectors}, Brands=${app.brands}, Total=${app.totalElements}`);
    });
  }

  private generateSimpleHash(value: number): string {
    return Math.abs(value * 31 + Date.now()).toString(16).padStart(8, '0');
  }

  // Check if sync operations are currently allowed
  async isSyncAllowed(): Promise<boolean> {
    const validation = await this.validateTripleSync();
    return validation.syncAllowed;
  }

  // Get current sync status without full validation
  async getQuickSyncStatus(): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Quick local check first
      const localSummary = await this.getLocalSummary();
      
      // If local app is not treaty compliant, deny immediately
      if (!localSummary.treatyCompliant) {
        return { 
          allowed: false, 
          reason: 'Local app not treaty compliant' 
        };
      }

      // Quick ping to other services (shorter timeout)
      const quickChecks = await Promise.allSettled([
        this.fetchWithTimeout(this.appUrls.fruitfulPlanetChange + '?quick=true', 3000),
        this.fetchWithTimeout(this.appUrls.pythonBackend + '?quick=true', 3000)
      ]);

      const onlineCount = quickChecks.filter(check => check.status === 'fulfilled').length;
      
      if (onlineCount < 2) {
        return { 
          allowed: false, 
          reason: `Only ${onlineCount + 1}/3 apps responding` 
        };
      }

      return { allowed: true };

    } catch (error) {
      return { 
        allowed: false, 
        reason: `Quick status check failed: ${error.message}` 
      };
    }
  }
}

export const tripleSyncValidator = new TripleSyncValidator();