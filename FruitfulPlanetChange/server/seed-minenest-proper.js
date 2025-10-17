import { db } from "./db.ts";
import { brands, sectors } from "../shared/schema.ts";
import { eq } from "drizzle-orm";

const mineNestBrands = [
  // 30 Core Mining & Resources Brands (exactly as specified)
  "MineNest™", "NestTrack™", "VaultDrill™", "OreCore™", "GlamOrb™", 
  "DrillCore™", "CoreDigs™", "PowePush™", "DrilTrek™", "DrigVan™", 
  "DreSynk™", "SyncBlock™", "MineCore™", "DrillNest™", "CoreVault™",
  "OreTrack™", "VaultCore™", "DrillSync™", "MineVault™", "CoreDrill™",
  "OreNest™", "VaultTrack™", "DrillOrb™", "CoreSync™", "MineOrb™",
  "OreVault™", "DrillCore™", "VaultOrb™", "CoreTrack™", "MineSync™"
];

const subNodes = [
  "Mining Operations", "Resource Management", "Equipment Tracking", "Safety Protocols",
  "Environmental Compliance", "Supply Chain", "Quality Control", "Data Analytics",
  "Maintenance Systems", "Inventory Management", "Cost Analysis", "Production Planning",
  "Worker Safety", "Equipment Optimization", "Resource Planning", "Site Management",
  "Geological Analysis", "Extraction Methods", "Processing Systems", "Transportation",
  "Storage Solutions", "Market Analysis", "Financial Planning", "Risk Management",
  "Sustainability", "Community Relations", "Regulatory Compliance", "Technology Integration"
];

async function seedMineNestProper() {
  console.log("⛏️ Seeding MineNest with EXACT specifications: 30 core brands + 120 subnodes...");

  try {
    // Get Mining & Resources sector ID
    const sector = await db
      .select()
      .from(sectors)
      .where(eq(sectors.name, "⛏️ Mining & Resources"))
      .limit(1);

    if (sector.length === 0) {
      console.log("❌ Mining & Resources sector not found");
      return;
    }

    const sectorId = sector[0].id;
    console.log(`🎯 Found Mining sector with ID: ${sectorId}`);

    // Add 30 core brands
    for (let i = 0; i < 30; i++) {
      const brandName = mineNestBrands[i];
      
      await db.insert(brands).values({
        name: brandName,
        description: `Advanced ${brandName} mining & resources management solution with comprehensive VaultMesh™ integration, real-time ore tracking, and Baobab legal compliance for secure mining operations across the Fruitful Global ecosystem.`,
        sectorId: sectorId,
        integration: "VaultMesh™",
        status: "active",
        isCore: true,
        price: 199.99 + (i * 10),
        metadata: {
          sector: "mining",
          featured: true,
          activeRigs: 12 + i,
          monthlyYield: 500 + (i * 25),
          subnodeCount: 4,
          totalProjects: 20 + i
        }
      });
      
      console.log(`✅ Added core brand: ${brandName}`);
    }

    // Add 120 subnodes (4 subnodes per core brand = 30 x 4 = 120)
    let subnodeCount = 0;
    for (let brandIndex = 0; brandIndex < 30; brandIndex++) {
      const parentBrand = mineNestBrands[brandIndex];
      
      // Get parent brand ID
      const parentBrandRecord = await db
        .select()
        .from(brands)
        .where(eq(brands.name, parentBrand))
        .limit(1);
      
      if (parentBrandRecord.length > 0) {
        const parentId = parentBrandRecord[0].id;
        
        // Add 4 subnodes per brand
        for (let subIndex = 0; subIndex < 4; subIndex++) {
          const subnodeName = `${parentBrand} ${subNodes[subnodeCount % subNodes.length]}`;
          
          await db.insert(brands).values({
            name: subnodeName,
            description: `Specialized ${subNodes[subnodeCount % subNodes.length]} system integrated with ${parentBrand}`,
            sectorId: sectorId,
            integration: "VaultMesh™",
            status: "active",
            isCore: false,
            parentId: parentId,
            price: 29.99 + (subnodeCount * 2),
            metadata: {
              sector: "mining",
              subnodeType: subNodes[subnodeCount % subNodes.length],
              parentBrand: parentBrand,
              level: "subnode"
            }
          });
          
          subnodeCount++;
        }
      }
    }

    console.log(`✅ Added ${subnodeCount} subnodes (4 per core brand)`);

    // Verify final counts
    const totalBrands = await db
      .select()
      .from(brands)
      .where(eq(brands.sectorId, sectorId));
    
    const coreBrands = totalBrands.filter(b => b.isCore);
    const subnodeBrands = totalBrands.filter(b => !b.isCore);

    console.log(`🎯 FINAL MINING SECTOR STATS:`);
    console.log(`   Core Brands: ${coreBrands.length}`);
    console.log(`   Subnodes: ${subnodeBrands.length}`);
    console.log(`   Total: ${totalBrands.length}`);

    return {
      total: totalBrands.length,
      core: coreBrands.length,
      subnodes: subnodeBrands.length
    };

  } catch (error) {
    console.error("❌ Error seeding MineNest:", error.message);
    throw error;
  }
}

seedMineNestProper().then((stats) => {
  console.log(`✅ MineNest seeding completed!`);
  console.log(`   Total brands: ${stats.total}`);
  console.log(`   Core brands: ${stats.core}`);
  console.log(`   Subnodes: ${stats.subnodes}`);
}).catch(console.error);