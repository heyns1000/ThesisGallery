/**
 * Cross-App Dependency Map
 * 
 * Defines data flow dependencies between applications in the distributed
 * FAA.zone™ ecosystem (Fruitful, Samfox, Banimal).
 */

export interface AppDependency {
  source: string;
  target: string;
  dataTypes: string[];
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  criticality: 'high' | 'medium' | 'low';
  description: string;
}

/**
 * Sync Event Types
 * 
 * All supported event types for cross-app synchronization.
 * These correspond to the eventType column in the syncEvents table.
 */
export type SyncEventType = 
  | 'asset_update'      // File changes, new uploads to attached_assets/
  | 'brand_change'      // Brand metrics, status updates (high criticality)
  | 'sector_sync'       // Sector operational changes (FAA.ZONE sectors)
  | 'treaty_binding'    // Legal/compliance updates (TreatyMesh™ protocols)
  | 'scroll_deployment' // New scroll activations (Seedwave scrolls)
  | 'system_health'     // Infrastructure status monitoring
  | 'emergency_sync';   // Critical system updates (highest priority)

/**
 * Sync Event Priority Levels
 * 
 * Determines processing order and urgency.
 * Matches the priority column in syncEvents table.
 */
export const SyncPriority = {
  HIGH: 1,        // Emergency, critical system updates
  MEDIUM: 2,      // Regular sync operations
  LOW: 3          // Background/batch operations
} as const;

/**
 * Cross-App Dependencies
 * 
 * Defines the data flow relationships between apps:
 * - Fruitful → Samfox: Asset synchronization
 * - Fruitful → Banimal: Brand data sync (realtime, high criticality)
 * - SeedwaveOmniSync → ScrollRepository: Scroll definitions (hourly, medium criticality)
 */
export const crossAppDependencies: AppDependency[] = [
  {
    source: 'Fruitful.SeedwaveAdminPortal',
    target: 'Banimal.BrandRegistry',
    dataTypes: ['brand_metrics', 'sector_status'],
    syncFrequency: 'realtime',
    criticality: 'high',
    description: 'Real-time brand metrics and sector status synchronization for 7,038+ brands'
  },
  {
    source: 'Fruitful.SeedwaveOmniSync',
    target: 'Samfox.ScrollRepository',
    dataTypes: ['scroll_definitions', 'deployment_status'],
    syncFrequency: 'hourly',
    criticality: 'medium',
    description: 'Scroll deployment tracking and repository synchronization'
  },
  {
    source: 'Fruitful.AssetRegistry',
    target: 'Samfox.RepositoryMirror',
    dataTypes: ['asset_manifest', 'file_hashes'],
    syncFrequency: 'hourly',
    criticality: 'medium',
    description: 'Asset synchronization for 1,247 files (861.42 MB)'
  },
  {
    source: 'Fruitful.TreatyMeshController',
    target: 'Banimal.ComplianceEngine',
    dataTypes: ['treaty_scrolls', 'compliance_logs'],
    syncFrequency: 'realtime',
    criticality: 'high',
    description: 'Legal compliance and treaty scroll distribution'
  },
  {
    source: 'Fruitful.FAA_ZONE_SectorGrid',
    target: 'Samfox.SectorAnalytics',
    dataTypes: ['sector_intelligence', 'brand_relationships'],
    syncFrequency: 'daily',
    criticality: 'low',
    description: 'Sector mapping intelligence for 33 sectors, 1,406 brands, 6,437 nodes'
  },
  {
    source: 'Fruitful.VaultMeshPayroll',
    target: 'Banimal.FinancialCompliance',
    dataTypes: ['payroll_data', 'financial_records'],
    syncFrequency: 'daily',
    criticality: 'high',
    description: 'Financial compliance and payroll synchronization'
  }
];

/**
 * Application Configuration
 * 
 * Defines the configuration for each application in the ecosystem.
 */
export interface AppConfig {
  name: string;
  role: 'primary' | 'mirror' | 'specialized';
  capabilities: string[];
  description: string;
}

export const appConfigurations: AppConfig[] = [
  {
    name: 'Fruitful',
    role: 'primary',
    capabilities: [
      'Master Hub',
      'Asset Registry',
      'Brand Management',
      'Sector Coordination',
      'Treaty Management',
      'Key Vault',
      'Sync Orchestration'
    ],
    description: 'Primary Hub - Central integration platform for 7,038+ brands across 48+ sectors'
  },
  {
    name: 'Samfox',
    role: 'specialized',
    capabilities: [
      'Repository Management',
      'Asset Mirroring',
      'Archive Extraction',
      'Version Control',
      'Scroll Repository',
      'Analytics'
    ],
    description: 'Specialized Repository System - Manages archives, versions, and scroll definitions'
  },
  {
    name: 'Banimal',
    role: 'specialized',
    capabilities: [
      'Brand Registry',
      'Compliance Engine',
      'Real-time Metrics',
      'Financial Compliance',
      'Payment Processing Redirect'
    ],
    description: 'Brand Management System - Real-time brand metrics and compliance monitoring'
  }
];

/**
 * Synchronization Protocol
 * 
 * TreatyMesh™ - Distributed synchronization protocol for the FAA.zone™ ecosystem.
 */
export const synchronizationProtocol = {
  name: 'TreatyMesh™',
  version: '1.0.0',
  description: 'Distributed synchronization protocol for cross-app data flow',
  conflictResolution: {
    priority: [
      'Fruitful Master - Final authority for system-wide decisions',
      'Banimal Brands - Authority for brand-specific data',
      'Samfox Repository - Authority for asset versioning',
      'Timestamp-based - Most recent update wins for equivalent priority'
    ]
  },
  recoveryProcedures: {
    automatic: [
      'Connection retry with exponential backoff',
      'Local cache utilization during outages',
      'Graceful degradation of non-critical features',
      'Queue-based sync resumption'
    ],
    manual: [
      'Full system resync procedures',
      'Data integrity verification scripts',
      'Emergency rollback protocols',
      'Cross-app consistency checks'
    ]
  }
};
