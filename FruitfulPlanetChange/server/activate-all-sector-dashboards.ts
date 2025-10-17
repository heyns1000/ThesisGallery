#!/usr/bin/env tsx

// ACTIVATE ALL SECTOR DASHBOARDS - Ensure all 57 sectors have proper dashboard activation
import { DatabaseStorage } from './storage';

async function activateAllSectorDashboards() {
  console.log("🚀 ACTIVATING ALL SECTOR DASHBOARDS - Ensuring all 57 sectors are dashboard-ready");
  
  try {
    const storage = new DatabaseStorage();
    const allSectors = await storage.getAllSectors();
    
    console.log(`📊 Found ${allSectors.length} total sectors to activate`);
    
    // Ensure all sectors have proper dashboard metadata
    for (const sector of allSectors) {
      const currentMetadata = sector.metadata as any || {};
      
      // Add dashboard activation metadata
      const dashboardMetadata = {
        ...currentMetadata,
        isDashboardActive: true,
        dashboardRoute: `/sector/${sector.id}`,
        hasAnalytics: true,
        hasBrandManagement: true,
        dashboardFeatures: [
          'Brand Overview',
          'Performance Analytics', 
          'Sales Pipeline',
          'Revenue Tracking',
          'Brand Integration',
          'Growth Metrics'
        ],
        activationTimestamp: new Date().toISOString(),
        dashboardVersion: '2.0'
      };
      
      // Update sector with dashboard metadata
      try {
        await storage.updateSector(sector.id, {
          metadata: dashboardMetadata
        });
        
        console.log(`✅ Activated dashboard for: ${sector.name} (${sector.emoji})`);
      } catch (error) {
        console.error(`❌ Failed to activate dashboard for ${sector.name}:`, error);
      }
    }
    
    console.log(`\n🎉 SECTOR DASHBOARD ACTIVATION COMPLETE!`);
    console.log(`📊 Results:`);
    console.log(`   - Total sectors activated: ${allSectors.length}`);
    console.log(`   - All sectors now have dashboard routing`);
    console.log(`   - All sectors have analytics capabilities`);
    console.log(`   - Brand management enabled for all sectors`);
    
    // Verify activation
    const verificationSectors = await storage.getAllSectors();
    const activatedCount = verificationSectors.filter(s => {
      const meta = s.metadata as any;
      return meta?.isDashboardActive === true;
    }).length;
    
    console.log(`\n✨ Verification: ${activatedCount}/${verificationSectors.length} sectors have active dashboards`);
    
    return {
      totalSectors: allSectors.length,
      activatedSectors: activatedCount,
      success: true
    };
    
  } catch (error) {
    console.error('💥 Sector dashboard activation failed:', error);
    throw error;
  }
}

// Execute activation
activateAllSectorDashboards()
  .then((result) => {
    console.log('🚀 Sector dashboard activation completed successfully!', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Sector dashboard activation failed:', error);
    process.exit(1);
  });