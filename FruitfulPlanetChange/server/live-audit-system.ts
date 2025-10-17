// Live Audit System for DOM vs Backend Truth Validation
import { storage } from "./storage";

interface DomAuditResult {
  isSync: boolean;
  mismatches: Array<{
    field: string;
    backend: number;
    dom: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  syncAccuracy: number;
  recommendedAction: string;
}

interface CanonicalSourceState {
  activated: boolean;
  lastValidation: string;
  dataConsistency: boolean;
  syncDirection: 'backend-to-frontend' | 'frontend-to-backend' | 'bidirectional';
  truthAuthority: 'backend' | 'frontend' | 'hybrid';
}

export class LiveAuditSystem {
  private canonicalSourceState: CanonicalSourceState = {
    activated: false,
    lastValidation: new Date().toISOString(),
    dataConsistency: true,
    syncDirection: 'backend-to-frontend',
    truthAuthority: 'backend'
  };

  // Activate canonical source of display truth
  async activateCanonicalSource(): Promise<CanonicalSourceState> {
    console.log('🔒 Activating Canonical Source of Display Truth...');
    
    try {
      // Validate backend data integrity
      const dataCheck = await this.validateBackendDataIntegrity();
      
      if (dataCheck.isValid) {
        this.canonicalSourceState = {
          activated: true,
          lastValidation: new Date().toISOString(),
          dataConsistency: true,
          syncDirection: 'backend-to-frontend',
          truthAuthority: 'backend'
        };
        
        console.log('✅ Canonical Source ACTIVATED - Backend is truth authority');
      } else {
        console.log('❌ Canonical Source activation FAILED - Data integrity issues');
        throw new Error('Backend data integrity validation failed');
      }
    } catch (error) {
      console.error('Error activating canonical source:', error);
      this.canonicalSourceState.activated = false;
    }
    
    return this.canonicalSourceState;
  }

  // Validate backend data integrity
  async validateBackendDataIntegrity(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands(),
        storage.getAllSystemStatus()
      ]);

      // Check for basic data presence
      if (sectors.length === 0) {
        issues.push('No sectors found in database');
      }
      
      if (brands.length === 0) {
        issues.push('No brands found in database');
      }
      
      if (systemStatus.length === 0) {
        issues.push('No system status records found');
      }

      // Check for data consistency
      const coreElements = brands.filter(b => !b.name.includes('Subnode')).length;
      if (coreElements === 0 && brands.length > 0) {
        issues.push('All brands appear to be subnodes - no core elements');
      }

      // Check for reasonable data ranges
      if (sectors.length > 100) {
        issues.push('Unusually high sector count - possible data duplication');
      }
      
      if (brands.length > 50000) {
        issues.push('Unusually high brand count - possible data corruption');
      }

      const isValid = issues.length === 0;
      
      console.log(`📊 Backend Data Integrity: ${isValid ? 'VALID' : 'ISSUES FOUND'}`);
      if (issues.length > 0) {
        console.log('⚠️ Issues:', issues);
      }

      return { isValid, issues };
    } catch (error) {
      console.error('Error validating backend integrity:', error);
      issues.push(`Database connection error: ${error.message}`);
      return { isValid: false, issues };
    }
  }

  // Perform live audit of DOM vs backend truth
  async performLiveAudit(domCounts: Record<string, number>, pageName: string): Promise<DomAuditResult> {
    console.log(`🔍 Performing live audit for page: ${pageName}`);
    
    try {
      // Get current backend truth
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands(),
        storage.getAllSystemStatus()
      ]);

      const backendTruth = {
        sectors: sectors.length,
        brands: brands.length,
        coreElements: brands.filter(b => !b.name.includes('Subnode')).length,
        subnodes: brands.filter(b => b.name.includes('Subnode')).length,
        totalElements: brands.length + sectors.length,
        systemStatus: systemStatus.length
      };

      // Compare DOM vs backend
      const mismatches = [];
      let totalChecks = 0;
      let passedChecks = 0;

      Object.keys(backendTruth).forEach(key => {
        const backendValue = backendTruth[key];
        const domValue = domCounts[key];
        
        if (domValue !== undefined) {
          totalChecks++;
          
          if (domValue === backendValue) {
            passedChecks++;
          } else {
            const difference = Math.abs(backendValue - domValue);
            let severity: 'low' | 'medium' | 'high' = 'low';
            
            if (difference > 50) severity = 'high';
            else if (difference > 10) severity = 'medium';
            
            mismatches.push({
              field: key,
              backend: backendValue,
              dom: domValue,
              severity
            });
          }
        }
      });

      const syncAccuracy = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;
      const isSync = mismatches.length === 0;

      // Determine recommended action
      let recommendedAction = 'no-action-needed';
      if (mismatches.length > 0) {
        const hasHighSeverity = mismatches.some(m => m.severity === 'high');
        const hasMediumSeverity = mismatches.some(m => m.severity === 'medium');
        
        if (hasHighSeverity) {
          recommendedAction = 'immediate-rerender-required';
        } else if (hasMediumSeverity || mismatches.length > 3) {
          recommendedAction = 'trigger-rerender';
        } else {
          recommendedAction = 'schedule-next-update';
        }
      }

      const auditResult: DomAuditResult = {
        isSync,
        mismatches,
        syncAccuracy: Math.round(syncAccuracy * 100) / 100,
        recommendedAction
      };

      // Log results
      if (isSync) {
        console.log(`✅ DOM Sync Perfect for ${pageName} - ${syncAccuracy}% accuracy`);
      } else {
        console.log(`⚠️ DOM Sync Issues for ${pageName}:`);
        mismatches.forEach(mismatch => {
          console.log(`  ${mismatch.field}: Backend=${mismatch.backend}, DOM=${mismatch.dom} (${mismatch.severity})`);
        });
      }

      return auditResult;
    } catch (error) {
      console.error('Error performing live audit:', error);
      return {
        isSync: false,
        mismatches: [],
        syncAccuracy: 0,
        recommendedAction: 'error-recovery-needed'
      };
    }
  }

  // Get current canonical source status
  getCanonicalSourceState(): CanonicalSourceState {
    return { ...this.canonicalSourceState };
  }

  // Force sync from backend to frontend
  async forceSyncFromBackend(): Promise<{
    success: boolean;
    timestamp: string;
    dataSnapshot: Record<string, number>;
  }> {
    console.log('🔄 Forcing sync from backend to frontend...');
    
    try {
      const [sectors, brands, systemStatus] = await Promise.all([
        storage.getAllSectors(),
        storage.getAllBrands(),
        storage.getAllSystemStatus()
      ]);

      const dataSnapshot = {
        sectors: sectors.length,
        brands: brands.length,
        coreElements: brands.filter(b => !b.name.includes('Subnode')).length,
        subnodes: brands.filter(b => b.name.includes('Subnode')).length,
        totalElements: brands.length + sectors.length,
        systemStatus: systemStatus.length
      };

      console.log('📊 Backend Data Snapshot:', dataSnapshot);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        dataSnapshot
      };
    } catch (error) {
      console.error('Error forcing sync from backend:', error);
      return {
        success: false,
        timestamp: new Date().toISOString(),
        dataSnapshot: {}
      };
    }
  }

  // Check if rerender is needed based on data staleness
  async checkRerenderNeeded(): Promise<{
    rerenderNeeded: boolean;
    reason: string;
    lastDataChange: string;
  }> {
    try {
      // This would normally check timestamps of last data modifications
      // For now, we'll do a simple check
      const integrity = await this.validateBackendDataIntegrity();
      
      return {
        rerenderNeeded: !integrity.isValid,
        reason: integrity.isValid ? 'Data is current' : 'Data integrity issues detected',
        lastDataChange: new Date().toISOString()
      };
    } catch (error) {
      return {
        rerenderNeeded: true,
        reason: 'Error checking data staleness',
        lastDataChange: new Date().toISOString()
      };
    }
  }
}

export const liveAuditSystem = new LiveAuditSystem();