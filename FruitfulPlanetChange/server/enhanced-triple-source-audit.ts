
import { db } from "./db";
import { 
  sectors, brands, adminPanelBrands, legalDocuments, repositories, 
  systemStatus, mediaProjects, processingEngines, interstellarNodes,
  banimalTransactions, artworks, portfolioProjects 
} from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';

interface SourceMetrics {
  sectors: number;
  brands: number;
  subnodes: number;
  totalElements: number;
  lastVerified: string;
  sourceType: 'treaty_flame' | 'fruitful_backend' | 'python_dashboard';
  verificationHash: string;
}

interface SyncLockStatus {
  isLocked: boolean;
  allSourcesMatching: boolean;
  sources: {
    treatyFlame: SourceMetrics | null;
    fruitfulBackend: SourceMetrics | null;
    pythonDashboard: SourceMetrics | null;
  };
  discrepancies: string[];
  syncAllowed: boolean;
  lastAuditTimestamp: string;
}

class EnhancedTripleSourceAudit {
  private syncLockStatus: SyncLockStatus = {
    isLocked: true,
    allSourcesMatching: false,
    sources: {
      treatyFlame: null,
      fruitfulBackend: null,
      pythonDashboard: null
    },
    discrepancies: [],
    syncAllowed: false,
    lastAuditTimestamp: new Date().toISOString()
  };

  // SOURCE A: Treaty Flame Frontend Analysis
  async extractTreatyFlameMetrics(): Promise<SourceMetrics> {
    console.log("🏛️ EXTRACTING TREATY FLAME FRONTEND METRICS...");
    
    try {
      // Scan DOM-based brand counts from frontend files
      const clientPath = path.join(process.cwd(), 'client/src');
      let domIndexedBrands = 0;
      let internalIconPageCount = 0;
      let frontendSectors = 0;
      
      // Parse main app files for brand references
      const appFiles = [
        'App.tsx',
        'pages/brands.tsx',
        'pages/sectors.tsx',
        'components/portal/sector-navigation-cards.tsx',
        'components/portal/brand-identity-manager.tsx'
      ];
      
      for (const file of appFiles) {
        const filePath = path.join(clientPath, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Count brand references in React components
          const brandMatches = content.match(/brand\w*/gi) || [];
          domIndexedBrands += brandMatches.length;
          
          // Count sector references
          const sectorMatches = content.match(/sector\w*/gi) || [];
          frontendSectors += sectorMatches.length;
        }
      }
      
      // Parse HSOMNI9000 Icon Matrix
      const iconMatrixPath = path.join(process.cwd(), 'HSOMNI9000_ICON_MATRIX.html');
      if (fs.existsSync(iconMatrixPath)) {
        const iconContent = fs.readFileSync(iconMatrixPath, 'utf8');
        const iconCards = iconContent.match(/<div class="icon-card"/g) || [];
        internalIconPageCount = iconCards.length;
      }
      
      // Calculate verification hash
      const verificationHash = this.generateVerificationHash({
        domIndexedBrands,
        internalIconPageCount,
        frontendSectors,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Treaty Flame: ${domIndexedBrands} DOM brands, ${internalIconPageCount} icons, ${frontendSectors} sectors`);
      
      return {
        sectors: frontendSectors,
        brands: domIndexedBrands,
        subnodes: internalIconPageCount,
        totalElements: domIndexedBrands + internalIconPageCount + frontendSectors,
        lastVerified: new Date().toISOString(),
        sourceType: 'treaty_flame',
        verificationHash
      };
      
    } catch (error) {
      console.error("❌ Treaty Flame extraction failed:", error);
      throw error;
    }
  }

  // SOURCE B: Fruitful Backend PostgreSQL Analysis
  async extractFruitfulBackendMetrics(): Promise<SourceMetrics> {
    console.log("🌐 EXTRACTING FRUITFUL BACKEND METRICS...");
    
    try {
      // Full DB extract with foreign key verification
      const [
        sectorsCount, brandsCount, adminPanelBrandsCount, legalDocsCount,
        reposCount, systemStatusCount, mediaProjectsCount, processingEnginesCount,
        interstellarNodesCount, banimalTransactionsCount, artworksCount, portfolioProjectsCount
      ] = await Promise.all([
        db.select().from(sectors),
        db.select().from(brands),
        db.select().from(adminPanelBrands),
        db.select().from(legalDocuments),
        db.select().from(repositories),
        db.select().from(systemStatus),
        db.select().from(mediaProjects),
        db.select().from(processingEngines),
        db.select().from(interstellarNodes),
        db.select().from(banimalTransactions),
        db.select().from(artworks),
        db.select().from(portfolioProjects)
      ]);

      // Verify foreign key relationships
      const corebrands = brandsCount.filter(b => !b.parentId).length;
      const subnodes = brandsCount.filter(b => b.parentId).length;
      const totalSectors = sectorsCount.length;
      
      // Verify integrity - check for orphaned records
      let orphanedRecords = 0;
      for (const brand of brandsCount) {
        const sector = sectorsCount.find(s => s.id === brand.sectorId);
        if (!sector) orphanedRecords++;
      }
      
      if (orphanedRecords > 0) {
        console.warn(`⚠️ Found ${orphanedRecords} orphaned brand records`);
      }
      
      const totalDbRecords = sectorsCount.length + brandsCount.length + adminPanelBrandsCount.length + 
        legalDocsCount.length + reposCount.length + systemStatusCount.length + mediaProjectsCount.length +
        processingEnginesCount.length + interstellarNodesCount.length + banimalTransactionsCount.length +
        artworksCount.length + portfolioProjectsCount.length;
      
      // Calculate verification hash
      const verificationHash = this.generateVerificationHash({
        totalSectors,
        corebrands,
        subnodes,
        totalDbRecords,
        orphanedRecords,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Fruitful Backend: ${totalSectors} sectors, ${corebrands} core brands, ${subnodes} subnodes`);
      console.log(`📊 Total DB Records: ${totalDbRecords}`);
      
      return {
        sectors: totalSectors,
        brands: corebrands,
        subnodes: subnodes,
        totalElements: totalDbRecords,
        lastVerified: new Date().toISOString(),
        sourceType: 'fruitful_backend',
        verificationHash
      };
      
    } catch (error) {
      console.error("❌ Fruitful Backend extraction failed:", error);
      throw error;
    }
  }

  // SOURCE C: Python Dashboard Analysis
  async extractPythonDashboardMetrics(): Promise<SourceMetrics> {
    console.log("🐍 EXTRACTING PYTHON DASHBOARD METRICS...");
    
    try {
      // Parse attached assets for admin panel data
      const adminPanelPath = path.join(process.cwd(), 'attached_assets/interns.seedwave.faa.zone-main/public/admin-panel_full_arrays.html');
      let dashboardBrands = 0;
      let htmlJinjaMatrix = 0;
      let dashboardSectors = 0;
      
      if (fs.existsSync(adminPanelPath)) {
        const adminContent = fs.readFileSync(adminPanelPath, 'utf8');
        
        // Parse JavaScript brand arrays
        const brandArrayRegex = /const \w+Brands = \[(.*?)\];/gs;
        let match;
        while ((match = brandArrayRegex.exec(adminContent)) !== null) {
          const brandList = match[1];
          const brandCount = (brandList.match(/'/g) || []).length / 2;
          dashboardBrands += brandCount;
        }
        
        // Parse sector links
        const sectorLinks = adminContent.match(/data-sector="[^"]+"/g) || [];
        dashboardSectors = sectorLinks.length;
        
        // Parse matrix elements
        const matrixElements = adminContent.match(/<div class="[^"]*matrix[^"]*"/g) || [];
        htmlJinjaMatrix = matrixElements.length;
      }
      
      // Parse other attached assets for additional data
      const attachedAssetsPath = path.join(process.cwd(), 'attached_assets');
      const assetDirs = fs.readdirSync(attachedAssetsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      let additionalAssetData = 0;
      for (const dir of assetDirs) {
        const dirPath = path.join(attachedAssetsPath, dir);
        try {
          const files = fs.readdirSync(dirPath, { recursive: true });
          additionalAssetData += files.length;
        } catch (error) {
          // Skip inaccessible directories
        }
      }
      
      // Calculate verification hash
      const verificationHash = this.generateVerificationHash({
        dashboardBrands,
        htmlJinjaMatrix,
        dashboardSectors,
        additionalAssetData,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Python Dashboard: ${dashboardSectors} sectors, ${dashboardBrands} brands, ${htmlJinjaMatrix} matrix elements`);
      
      return {
        sectors: dashboardSectors,
        brands: dashboardBrands,
        subnodes: htmlJinjaMatrix,
        totalElements: dashboardBrands + htmlJinjaMatrix + dashboardSectors + additionalAssetData,
        lastVerified: new Date().toISOString(),
        sourceType: 'python_dashboard',
        verificationHash
      };
      
    } catch (error) {
      console.error("❌ Python Dashboard extraction failed:", error);
      throw error;
    }
  }

  // Triple-Source Verification and Sync Lock Logic
  async performTripleSourceAudit(): Promise<SyncLockStatus> {
    console.log("🔐 PERFORMING ENHANCED TRIPLE-SOURCE AUDIT...");
    console.log("⚠️ SYNC LOCK ACTIVE - NO OPERATIONS UNTIL VERIFICATION COMPLETE\n");
    
    try {
      // Extract metrics from all three sources
      const [treatyFlame, fruitfulBackend, pythonDashboard] = await Promise.all([
        this.extractTreatyFlameMetrics(),
        this.extractFruitfulBackendMetrics(),
        this.extractPythonDashboardMetrics()
      ]);
      
      // Update sync lock status
      this.syncLockStatus.sources = { treatyFlame, fruitfulBackend, pythonDashboard };
      this.syncLockStatus.discrepancies = [];
      
      // Check for exact matches across all three sources
      const sectorsMatch = (
        treatyFlame.sectors === fruitfulBackend.sectors &&
        fruitfulBackend.sectors === pythonDashboard.sectors
      );
      
      const brandsMatch = (
        treatyFlame.brands === fruitfulBackend.brands &&
        fruitfulBackend.brands === pythonDashboard.brands
      );
      
      const subnodesMatch = (
        treatyFlame.subnodes === fruitfulBackend.subnodes &&
        fruitfulBackend.subnodes === pythonDashboard.subnodes
      );
      
      // Log comparison results
      console.log("📊 TRIPLE-SOURCE COMPARISON RESULTS:");
      console.log("=====================================");
      console.log(`🏛️  Treaty Flame:     ${treatyFlame.sectors} sectors, ${treatyFlame.brands} brands, ${treatyFlame.subnodes} subnodes`);
      console.log(`🌐 Fruitful Backend:  ${fruitfulBackend.sectors} sectors, ${fruitfulBackend.brands} brands, ${fruitfulBackend.subnodes} subnodes`);
      console.log(`🐍 Python Dashboard:  ${pythonDashboard.sectors} sectors, ${pythonDashboard.brands} brands, ${pythonDashboard.subnodes} subnodes`);
      console.log("");
      
      // Document discrepancies
      if (!sectorsMatch) {
        this.syncLockStatus.discrepancies.push(
          `Sector mismatch: Treaty(${treatyFlame.sectors}) vs Backend(${fruitfulBackend.sectors}) vs Dashboard(${pythonDashboard.sectors})`
        );
      }
      
      if (!brandsMatch) {
        this.syncLockStatus.discrepancies.push(
          `Brand mismatch: Treaty(${treatyFlame.brands}) vs Backend(${fruitfulBackend.brands}) vs Dashboard(${pythonDashboard.brands})`
        );
      }
      
      if (!subnodesMatch) {
        this.syncLockStatus.discrepancies.push(
          `Subnode mismatch: Treaty(${treatyFlame.subnodes}) vs Backend(${fruitfulBackend.subnodes}) vs Dashboard(${pythonDashboard.subnodes})`
        );
      }
      
      // Apply sync lock logic
      this.syncLockStatus.allSourcesMatching = sectorsMatch && brandsMatch && subnodesMatch;
      this.syncLockStatus.syncAllowed = this.syncLockStatus.allSourcesMatching;
      this.syncLockStatus.isLocked = !this.syncLockStatus.syncAllowed;
      this.syncLockStatus.lastAuditTimestamp = new Date().toISOString();
      
      // Final determination
      if (this.syncLockStatus.syncAllowed) {
        console.log("✅ SYNC LOCK RELEASED - ALL SOURCES VERIFIED AND MATCHING");
        console.log("🔓 Safe to proceed with DB writes, migrations, and vault operations");
      } else {
        console.log("🔐 SYNC LOCK MAINTAINED - DISCREPANCIES DETECTED");
        console.log("❌ Operations blocked until all sources provide identical counts");
        console.log("\n🚨 DISCREPANCIES:");
        this.syncLockStatus.discrepancies.forEach(discrepancy => {
          console.log(`   • ${discrepancy}`);
        });
      }
      
      return this.syncLockStatus;
      
    } catch (error) {
      console.error("💥 Triple-source audit failed:", error);
      this.syncLockStatus.isLocked = true;
      this.syncLockStatus.syncAllowed = false;
      this.syncLockStatus.discrepancies.push(`Audit failure: ${error.message}`);
      throw error;
    }
  }

  // Enhanced sync operation with triple-lock verification
  async attemptSyncOperation(operationType: string): Promise<boolean> {
    console.log(`🔐 ATTEMPTING ${operationType.toUpperCase()} OPERATION...`);
    
    // Force fresh audit before any operation
    const currentStatus = await this.performTripleSourceAudit();
    
    if (!currentStatus.syncAllowed) {
      console.log(`❌ ${operationType.toUpperCase()} OPERATION REJECTED`);
      console.log("🚫 Sync lock is active - operation blocked");
      console.log("💡 Resolve all discrepancies before retrying");
      return false;
    }
    
    console.log(`✅ ${operationType.toUpperCase()} OPERATION APPROVED`);
    console.log("🔓 All sources verified - proceeding with operation");
    return true;
  }

  // Generate verification hash for data integrity
  private generateVerificationHash(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Get current sync lock status
  getSyncLockStatus(): SyncLockStatus {
    return this.syncLockStatus;
  }
}

// Export enhanced audit system
export async function executeEnhancedTripleSourceAudit(): Promise<SyncLockStatus> {
  const auditSystem = new EnhancedTripleSourceAudit();
  return await auditSystem.performTripleSourceAudit();
}

export async function verifySyncOperation(operationType: string): Promise<boolean> {
  const auditSystem = new EnhancedTripleSourceAudit();
  return await auditSystem.attemptSyncOperation(operationType);
}

// Execute audit if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeEnhancedTripleSourceAudit()
    .then((status) => {
      console.log("\n🎉 Enhanced triple-source audit completed!");
      console.log(`🔐 Sync Lock Status: ${status.isLocked ? 'LOCKED' : 'UNLOCKED'}`);
      console.log(`✅ Sync Allowed: ${status.syncAllowed}`);
      console.log(`📊 Sources Matching: ${status.allSourcesMatching}`);
      process.exit(status.syncAllowed ? 0 : 1);
    })
    .catch((error) => {
      console.error("💥 Enhanced audit failed:", error);
      process.exit(1);
    });
}
