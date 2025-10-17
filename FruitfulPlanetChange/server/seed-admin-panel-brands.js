/**
 * Admin Panel Database Seeding Script
 * Integrates all comprehensive brand arrays from interns.seedwave.faa.zone
 * into PostgreSQL database via Drizzle ORM
 */

const { db } = require('./db');
const { adminPanelBrands } = require('../shared/schema');
const { ADMIN_PANEL_SECTOR_DATA, SECTOR_MAPPING } = require('./seed-admin-panel-data');

async function seedAdminPanelBrands() {
  try {
    console.log("🔥 Starting Admin Panel Brands Database Integration...");
    
    // Check if admin panel brands already exist
    const existingBrands = await db.select().from(adminPanelBrands).limit(1);
    if (existingBrands.length > 0) {
      console.log("✅ Admin panel brands already seeded, skipping...");
      return { success: true, message: "Already seeded" };
    }

    let totalBrandsInserted = 0;
    
    // Process each sector's brand arrays
    for (const [sectorKey, sectorData] of Object.entries(ADMIN_PANEL_SECTOR_DATA)) {
      const sectorInfo = SECTOR_MAPPING[sectorKey];
      if (!sectorInfo) {
        console.warn(`⚠️ No mapping found for sector: ${sectorKey}`);
        continue;
      }
      
      console.log(`📦 Processing ${sectorInfo.name} (${sectorData.brands.length} brands)`);
      
      // Insert each brand with its subnodes
      for (let i = 0; i < sectorData.brands.length; i++) {
        const brand = sectorData.brands[i];
        const subNodes = sectorData.subNodes && sectorData.subNodes[i] ? sectorData.subNodes[i] : [];
        
        const brandData = {
          sectorKey: sectorKey,
          sectorName: sectorInfo.name,
          sectorEmoji: sectorInfo.emoji,
          brandName: brand,
          subNodes: Array.isArray(subNodes) ? subNodes : [subNodes].filter(Boolean),
          isCore: true,
          status: "active",
          metadata: {
            sectorId: sectorInfo.id,
            arrayIndex: i,
            importedFrom: "interns.seedwave.faa.zone",
            importTimestamp: new Date().toISOString(),
            originalSource: "admin_panel_full_arrays.html"
          }
        };
        
        await db.insert(adminPanelBrands).values(brandData);
        totalBrandsInserted++;
      }
      
      console.log(`✅ Inserted ${sectorData.brands.length} ${sectorInfo.name} brands`);
    }
    
    console.log(`🚀 Admin Panel Integration Complete!`);
    console.log(`📊 Total brands inserted: ${totalBrandsInserted}`);
    console.log(`🎯 Sectors processed: ${Object.keys(ADMIN_PANEL_SECTOR_DATA).length}`);
    
    return { 
      success: true, 
      message: `Successfully integrated ${totalBrandsInserted} brands from ${Object.keys(ADMIN_PANEL_SECTOR_DATA).length} sectors`,
      totalBrands: totalBrandsInserted,
      totalSectors: Object.keys(ADMIN_PANEL_SECTOR_DATA).length
    };
    
  } catch (error) {
    console.error("❌ Error seeding admin panel brands:", error);
    return { 
      success: false, 
      message: `Failed to seed admin panel brands: ${error.message}`,
      error: error
    };
  }
}

// Export for use in main seeding functions
module.exports = { seedAdminPanelBrands };

// Allow running directly
if (require.main === module) {
  seedAdminPanelBrands()
    .then(result => {
      console.log("🎉 Seeding completed:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}