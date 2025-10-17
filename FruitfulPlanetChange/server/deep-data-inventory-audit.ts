
#!/usr/bin/env tsx

import { db } from "./db";
import { 
  sectors, brands, adminPanelBrands, legalDocuments, repositories, 
  systemStatus, mediaProjects, processingEngines, interstellarNodes,
  banimalTransactions, artworks, portfolioProjects 
} from "@shared/schema";
import { COMPREHENSIVE_BRAND_DATA } from "@shared/schema";
import { FRUITFUL_CRATE_DANCE_SECTORS } from "@shared/fruitful-crate-dance-ecosystem";
import { COMPREHENSIVE_SECTOR_BRAND_DATA } from "./comprehensive-brand-sync-clean";
import { COMPLETE_COMPREHENSIVE_DATA } from "./execute-complete-comprehensive-sync";
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  source: string;
  type: 'database' | 'typescript' | 'html' | 'json';
  totalRecords: number;
  sectors?: number;
  brands?: number;
  subnodes?: number;
  icons?: number;
  details: any;
  syncVersion?: string;
  lastSeen: string;
}

interface DiscrepancyReport {
  totalTargetRecords: 9000;
  currentDatabaseCount: number;
  totalSourceRecords: number;
  gapToTarget: number;
  auditResults: AuditResult[];
  conflicts: Array<{
    type: 'naming_collision' | 'schema_mismatch' | 'orphaned_record' | 'duplicate_entry';
    description: string;
    affectedRecords: number;
    sourceFiles: string[];
  }>;
  recommendations: string[];
  integrityIssues: Array<{
    issue: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    affectedTables: string[];
    estimatedFixEffort: string;
  }>;
}

export async function executeDeepDataInventoryAudit(): Promise<DiscrepancyReport> {
  console.log("🔍 PHASE 1: DEEP DATA INVENTORY AUDIT - STARTING COMPREHENSIVE SCAN");
  console.log("⚠️  READ-ONLY MODE: No changes will be applied during this audit\n");

  const auditResults: AuditResult[] = [];
  const conflicts: DiscrepancyReport['conflicts'] = [];
  const integrityIssues: DiscrepancyReport['integrityIssues'] = [];

  try {
    // 1. QUERY ALL POSTGRESQL TABLES
    console.log("📊 1. SCANNING POSTGRESQL DATABASE TABLES...");
    
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

    const databaseTotalRecords = sectorsCount.length + brandsCount.length + adminPanelBrandsCount.length + 
      legalDocsCount.length + reposCount.length + systemStatusCount.length + mediaProjectsCount.length +
      processingEnginesCount.length + interstellarNodesCount.length + banimalTransactionsCount.length +
      artworksCount.length + portfolioProjectsCount.length;

    auditResults.push({
      source: 'PostgreSQL Database',
      type: 'database',
      totalRecords: databaseTotalRecords,
      sectors: sectorsCount.length,
      brands: brandsCount.length,
      details: {
        sectors: sectorsCount.length,
        brands: brandsCount.length,
        adminPanelBrands: adminPanelBrandsCount.length,
        legalDocuments: legalDocsCount.length,
        repositories: reposCount.length,
        systemStatus: systemStatusCount.length,
        mediaProjects: mediaProjectsCount.length,
        processingEngines: processingEnginesCount.length,
        interstellarNodes: interstellarNodesCount.length,
        banimalTransactions: banimalTransactionsCount.length,
        artworks: artworksCount.length,
        portfolioProjects: portfolioProjectsCount.length
      },
      lastSeen: new Date().toISOString()
    });

    console.log(`✅ Database scan complete: ${databaseTotalRecords} total records`);
    console.log(`   - Sectors: ${sectorsCount.length}`);
    console.log(`   - Brands: ${brandsCount.length}`);
    console.log(`   - Admin Panel Brands: ${adminPanelBrandsCount.length}`);
    console.log(`   - Other tables: ${databaseTotalRecords - sectorsCount.length - brandsCount.length - adminPanelBrandsCount.length}`);

    // 2. PARSE TYPESCRIPT/JAVASCRIPT DATA SOURCES
    console.log("\n🔍 2. PARSING TYPESCRIPT/JAVASCRIPT DATA SOURCES...");

    // Parse comprehensive-brand-sync-clean.ts
    const comprehensiveSyncData = COMPREHENSIVE_SECTOR_BRAND_DATA;
    let comprehensiveSyncTotal = 0;
    let comprehensiveSyncBrands = 0;
    let comprehensiveSyncSubnodes = 0;

    for (const [sectorKey, sectorData] of Object.entries(comprehensiveSyncData)) {
      comprehensiveSyncBrands += sectorData.coreBrands.length;
      for (const subnodeArray of sectorData.subNodeArrays) {
        comprehensiveSyncSubnodes += subnodeArray.length;
      }
    }
    comprehensiveSyncTotal = comprehensiveSyncBrands + comprehensiveSyncSubnodes;

    auditResults.push({
      source: 'server/comprehensive-brand-sync-clean.ts',
      type: 'typescript',
      totalRecords: comprehensiveSyncTotal,
      sectors: Object.keys(comprehensiveSyncData).length,
      brands: comprehensiveSyncBrands,
      subnodes: comprehensiveSyncSubnodes,
      details: {
        sectorsProcessed: Object.keys(comprehensiveSyncData).length,
        totalCoreBrands: comprehensiveSyncBrands,
        totalSubnodes: comprehensiveSyncSubnodes,
        sectorBreakdown: Object.entries(comprehensiveSyncData).map(([key, data]) => ({
          sector: key,
          coreBrands: data.coreBrands.length,
          subnodeArrays: data.subNodeArrays.length
        }))
      },
      syncVersion: 'comprehensive-v1',
      lastSeen: new Date().toISOString()
    });

    // Parse execute-complete-comprehensive-sync.ts
    const completeComprehensiveData = COMPLETE_COMPREHENSIVE_DATA;
    let completeCompTotal = 0;
    let completeCompBrands = 0;
    let completeCompSubnodes = 0;

    for (const [sectorKey, sectorData] of Object.entries(completeComprehensiveData)) {
      completeCompBrands += sectorData.brands.length;
      for (const subnodeArray of sectorData.subNodes) {
        completeCompSubnodes += subnodeArray.length;
      }
    }
    completeCompTotal = completeCompBrands + completeCompSubnodes;

    auditResults.push({
      source: 'server/execute-complete-comprehensive-sync.ts',
      type: 'typescript',
      totalRecords: completeCompTotal,
      sectors: Object.keys(completeComprehensiveData).length,
      brands: completeCompBrands,
      subnodes: completeCompSubnodes,
      details: {
        sectorsProcessed: Object.keys(completeComprehensiveData).length,
        totalBrands: completeCompBrands,
        totalSubnodes: completeCompSubnodes,
        sectorBreakdown: Object.entries(completeComprehensiveData).map(([key, data]) => ({
          sector: key,
          brands: data.brands.length,
          subNodes: data.subNodes.length
        }))
      },
      syncVersion: 'complete-comprehensive-v1',
      lastSeen: new Date().toISOString()
    });

    // Parse shared/schema.ts COMPREHENSIVE_BRAND_DATA
    let schemaBrandTotal = 0;
    let schemaBrandCount = 0;
    let schemaNodeCount = 0;

    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_BRAND_DATA)) {
      schemaBrandCount += sectorData.brands.length;
      schemaNodeCount += sectorData.nodes.length;
    }
    schemaBrandTotal = schemaBrandCount + schemaNodeCount;

    auditResults.push({
      source: 'shared/schema.ts (COMPREHENSIVE_BRAND_DATA)',
      type: 'typescript',
      totalRecords: schemaBrandTotal,
      sectors: Object.keys(COMPREHENSIVE_BRAND_DATA).length,
      brands: schemaBrandCount,
      subnodes: schemaNodeCount,
      details: {
        sectorsProcessed: Object.keys(COMPREHENSIVE_BRAND_DATA).length,
        totalBrands: schemaBrandCount,
        totalNodes: schemaNodeCount,
        planVersionsIntegrated: 9, // V1-V9
        globalMetrics: {
          totalBrands: 7038,
          coreBrands: 660,
          totalNodes: 660,
          totalPages: 1320,
          elementsUnderManagement: 7698
        }
      },
      syncVersion: 'schema-comprehensive-v9',
      lastSeen: new Date().toISOString()
    });

    // Parse FRUITFUL_CRATE_DANCE_SECTORS
    let fruitfulTotal = 0;
    let fruitfulBrands = 0;

    for (const [sectorKey, sectorData] of Object.entries(FRUITFUL_CRATE_DANCE_SECTORS)) {
      fruitfulBrands += sectorData.brands.length;
    }
    fruitfulTotal = fruitfulBrands;

    auditResults.push({
      source: 'shared/fruitful-crate-dance-ecosystem.ts',
      type: 'typescript',
      totalRecords: fruitfulTotal,
      sectors: Object.keys(FRUITFUL_CRATE_DANCE_SECTORS).length,
      brands: fruitfulBrands,
      details: {
        sectorsProcessed: Object.keys(FRUITFUL_CRATE_DANCE_SECTORS).length,
        totalBrands: fruitfulBrands,
        ecosystem: 'fruitful-crate-dance'
      },
      syncVersion: 'fruitful-v1',
      lastSeen: new Date().toISOString()
    });

    // 3. PARSE HTML SOURCES
    console.log("\n🌐 3. SCANNING HTML DATA SOURCES...");

    // Parse HSOMNI9000_ICON_MATRIX.html
    try {
      const iconMatrixPath = path.join(process.cwd(), 'HSOMNI9000_ICON_MATRIX.html');
      const iconMatrixContent = fs.readFileSync(iconMatrixPath, 'utf8');
      
      // Count sections and icons
      const sectionMatches = iconMatrixContent.match(/<div class="section">/g) || [];
      const iconCardMatches = iconMatrixContent.match(/<div class="icon-card"/g) || [];
      
      auditResults.push({
        source: 'HSOMNI9000_ICON_MATRIX.html',
        type: 'html',
        totalRecords: iconCardMatches.length,
        sectors: sectionMatches.length,
        icons: iconCardMatches.length,
        details: {
          iconSections: sectionMatches.length,
          totalIcons: iconCardMatches.length,
          categories: [
            'Core Portal & Navigation',
            'Algorithm Giants & AI Systems',
            'Business & Financial Systems',
            'Technology & Infrastructure',
            'Creative & Media Systems',
            'VaultMesh™ Infrastructure',
            'Ecosystem & Natural Systems',
            'Human Systems & Education',
            'Legal & Compliance Systems',
            'Specialized & Advanced Systems',
            'Charitable & Global Impact'
          ]
        },
        syncVersion: 'HSOMNI9000',
        lastSeen: new Date().toISOString()
      });

      console.log(`✅ Icon Matrix scan complete: ${iconCardMatches.length} icons across ${sectionMatches.length} categories`);
    } catch (error) {
      console.error("❌ Could not parse HSOMNI9000_ICON_MATRIX.html:", error);
    }

    // Parse admin-panel_full_arrays.html
    try {
      const adminPanelPath = path.join(process.cwd(), 'attached_assets/interns.seedwave.faa.zone-main/public/admin-panel_full_arrays.html');
      
      if (fs.existsSync(adminPanelPath)) {
        const adminPanelContent = fs.readFileSync(adminPanelPath, 'utf8');
        
        // Count brand arrays and sector links
        const sectorLinkMatches = adminPanelContent.match(/data-sector="[^"]+"/g) || [];
        const brandArrayMatches = adminPanelContent.match(/const \w+Brands = \[/g) || [];
        const subnodeArrayMatches = adminPanelContent.match(/const \w+SubNodes = \[/g) || [];
        
        // Estimate total brands by parsing array definitions
        let estimatedBrands = 0;
        const brandArrayRegex = /const \w+Brands = \[(.*?)\];/gs;
        let match;
        while ((match = brandArrayRegex.exec(adminPanelContent)) !== null) {
          const brandList = match[1];
          const brandCount = (brandList.match(/'/g) || []).length / 2; // Count quoted strings
          estimatedBrands += brandCount;
        }

        auditResults.push({
          source: 'attached_assets/interns.seedwave.faa.zone-main/public/admin-panel_full_arrays.html',
          type: 'html',
          totalRecords: estimatedBrands,
          sectors: sectorLinkMatches.length,
          brands: estimatedBrands,
          details: {
            sectorLinks: sectorLinkMatches.length,
            brandArrays: brandArrayMatches.length,
            subnodeArrays: subnodeArrayMatches.length,
            estimatedBrandCount: estimatedBrands,
            hasJavaScriptBrandData: true
          },
          syncVersion: 'admin-panel-v1',
          lastSeen: new Date().toISOString()
        });

        console.log(`✅ Admin Panel scan complete: ~${estimatedBrands} estimated brands across ${sectorLinkMatches.length} sectors`);
      }
    } catch (error) {
      console.error("❌ Could not parse admin-panel_full_arrays.html:", error);
    }

    // 4. CROSS-REFERENCE AND IDENTIFY CONFLICTS
    console.log("\n🔍 4. CROSS-REFERENCING DATA SOURCES FOR CONFLICTS...");

    // Check for naming collisions between data sources
    const allBrandNames = new Set<string>();
    const brandNameSources = new Map<string, string[]>();

    // Collect brand names from database
    for (const brand of brandsCount) {
      allBrandNames.add(brand.name);
      if (!brandNameSources.has(brand.name)) {
        brandNameSources.set(brand.name, []);
      }
      brandNameSources.get(brand.name)!.push('database');
    }

    // Collect brand names from typescript sources
    const typescriptSources = [
      { name: 'comprehensive-sync', data: comprehensiveSyncData },
      { name: 'complete-sync', data: completeComprehensiveData },
      { name: 'schema-data', data: COMPREHENSIVE_BRAND_DATA }
    ];

    for (const source of typescriptSources) {
      for (const [sectorKey, sectorData] of Object.entries(source.data)) {
        const brandArray = 'coreBrands' in sectorData ? sectorData.coreBrands : 
                          'brands' in sectorData ? sectorData.brands : [];
        
        for (const brandName of brandArray) {
          allBrandNames.add(brandName);
          if (!brandNameSources.has(brandName)) {
            brandNameSources.set(brandName, []);
          }
          brandNameSources.get(brandName)!.push(source.name);
        }
      }
    }

    // Identify naming collisions
    for (const [brandName, sources] of brandNameSources.entries()) {
      if (sources.length > 1 && sources.includes('database')) {
        const nonDbSources = sources.filter(s => s !== 'database');
        if (nonDbSources.length > 0) {
          conflicts.push({
            type: 'naming_collision',
            description: `Brand "${brandName}" exists in database and ${nonDbSources.length} other source(s)`,
            affectedRecords: 1,
            sourceFiles: sources
          });
        }
      }
    }

    // Check for orphaned brands (brands without valid sector references)
    const validSectorNames = new Set(sectorsCount.map(s => s.name));
    let orphanedBrands = 0;

    for (const brand of brandsCount) {
      const sector = sectorsCount.find(s => s.id === brand.sectorId);
      if (!sector) {
        orphanedBrands++;
      }
    }

    if (orphanedBrands > 0) {
      integrityIssues.push({
        issue: `${orphanedBrands} brands have invalid sector references`,
        severity: 'high',
        affectedTables: ['brands', 'sectors'],
        estimatedFixEffort: '2-4 hours'
      });
    }

    // 5. CALCULATE TOTALS AND GAPS
    console.log("\n📊 5. CALCULATING TOTALS AND IDENTIFYING GAPS...");

    const totalSourceRecords = auditResults.reduce((sum, result) => sum + result.totalRecords, 0);
    const gapToTarget = 9000 - databaseTotalRecords;

    // 6. GENERATE RECOMMENDATIONS
    const recommendations = [
      `Database currently has ${databaseTotalRecords} records vs target of 9,000 (${gapToTarget} gap)`,
      `${conflicts.length} naming conflicts detected between data sources`,
      `Comprehensive sync sources contain ${comprehensiveSyncTotal + completeCompTotal} additional records`,
      `Admin panel HTML contains estimated ${auditResults.find(r => r.source.includes('admin-panel'))?.brands || 0} brand definitions`,
      `Icon matrix provides ${auditResults.find(r => r.source.includes('ICON_MATRIX'))?.icons || 0} icon mappings for frontend integration`,
      integrityIssues.length > 0 ? `${integrityIssues.length} data integrity issues need resolution` : 'No critical integrity issues detected',
      'Priority: Sync comprehensive brand data first, then resolve naming conflicts',
      'Recommend staged migration approach to avoid disruption'
    ];

    // 7. PREPARE FINAL REPORT
    const discrepancyReport: DiscrepancyReport = {
      totalTargetRecords: 9000,
      currentDatabaseCount: databaseTotalRecords,
      totalSourceRecords,
      gapToTarget,
      auditResults,
      conflicts,
      integrityIssues,
      recommendations
    };

    // 8. OUTPUT COMPREHENSIVE REPORT
    console.log("\n" + "=".repeat(80));
    console.log("📋 DEEP DATA INVENTORY AUDIT - COMPREHENSIVE REPORT");
    console.log("=".repeat(80));
    
    console.log(`\n🎯 TARGET vs CURRENT STATUS:`);
    console.log(`   🎯 Target Records: 9,000`);
    console.log(`   📊 Current Database: ${databaseTotalRecords} records`);
    console.log(`   📈 Gap to Target: ${gapToTarget} records (${Math.round((gapToTarget/9000)*100)}% missing)`);
    console.log(`   🔍 Total Source Records: ${totalSourceRecords} across ${auditResults.length} sources`);

    console.log(`\n📊 DATA SOURCE BREAKDOWN:`);
    for (const result of auditResults) {
      console.log(`   📁 ${result.source}:`);
      console.log(`      • Records: ${result.totalRecords}`);
      console.log(`      • Sectors: ${result.sectors || 'N/A'}`);
      console.log(`      • Brands: ${result.brands || 'N/A'}`);
      console.log(`      • Subnodes/Other: ${result.subnodes || result.icons || 'N/A'}`);
      console.log(`      • Type: ${result.type}`);
      console.log(`      • Sync Version: ${result.syncVersion || 'N/A'}`);
      console.log("");
    }

    console.log(`\n⚠️  CONFLICTS DETECTED (${conflicts.length}):`);
    for (const conflict of conflicts) {
      console.log(`   ❌ ${conflict.type}: ${conflict.description}`);
      console.log(`      • Affected Records: ${conflict.affectedRecords}`);
      console.log(`      • Source Files: ${conflict.sourceFiles.join(', ')}`);
    }

    console.log(`\n🚨 INTEGRITY ISSUES (${integrityIssues.length}):`);
    for (const issue of integrityIssues) {
      console.log(`   ${issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : '🟡'} ${issue.issue}`);
      console.log(`      • Severity: ${issue.severity.toUpperCase()}`);
      console.log(`      • Affected Tables: ${issue.affectedTables.join(', ')}`);
      console.log(`      • Estimated Fix: ${issue.estimatedFixEffort}`);
    }

    console.log(`\n💡 RECOMMENDATIONS FOR PHASE 2:`);
    for (let i = 0; i < recommendations.length; i++) {
      console.log(`   ${i + 1}. ${recommendations[i]}`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ PHASE 1 AUDIT COMPLETE - READY FOR PHASE 2 PLANNING");
    console.log("=".repeat(80));

    return discrepancyReport;

  } catch (error) {
    console.error("💥 Audit failed:", error);
    throw error;
  }
}

// Execute audit if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeDeepDataInventoryAudit()
    .then((report) => {
      console.log("\n🎉 Audit completed successfully!");
      console.log(`📊 Summary: ${report.currentDatabaseCount}/${report.totalTargetRecords} records (${report.gapToTarget} gap)`);
      console.log(`🔍 Found ${report.auditResults.length} data sources with ${report.totalSourceRecords} total records`);
      console.log(`⚠️  ${report.conflicts.length} conflicts and ${report.integrityIssues.length} integrity issues detected`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Audit failed:", error);
      process.exit(1);
    });
}

export { executeDeepDataInventoryAudit };
export type { DiscrepancyReport, AuditResult };
