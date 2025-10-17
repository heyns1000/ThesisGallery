import { db } from "./db";
import { sectors, brands, systemStatus, legalDocuments } from "@shared/schema";
import { COMPREHENSIVE_BRAND_DATA } from "@shared/schema";
import { FRUITFUL_CRATE_DANCE_SECTORS } from "@shared/fruitful-crate-dance-ecosystem";

export async function seedDatabase() {
  console.log("🌱 Seeding database with comprehensive brand data...");

  try {
    // Check if data already exists
    const existingBrands = await db.select().from(brands).limit(1);
    if (existingBrands.length > 0) {
      console.log("✅ Database already seeded, skipping...");
      return;
    }

    // Clear existing data
    await db.delete(brands);
    await db.delete(sectors);
    await db.delete(systemStatus);

    // Exact sector definitions matching the reference HTML (33 total sectors as per sectorList)
    const comprehensiveSectorMappings = [
      { key: "agriculture", name: "🌱 Agriculture & Biotech", emoji: "🌱", brands: 79, active: 52, integrations: 3 },
      { key: "fsf", name: "🥦 Food, Soil & Farming", emoji: "🥦", brands: 58, active: 38, integrations: 3 },
      { key: "banking", name: "🏦 Banking & Finance", emoji: "🏦", brands: 119, active: 79, integrations: 3 },
      { key: "creative", name: "🖋️ Creative Tech", emoji: "🖋️", brands: 45, active: 30, integrations: 3 },
      { key: "logistics", name: "📦 Logistics & Packaging", emoji: "📦", brands: 67, active: 44, integrations: 3 },
      { key: "education-ip", name: "📚 Education & IP", emoji: "📚", brands: 43, active: 28, integrations: 3 },
      { key: "fashion", name: "✂ Fashion & Identity", emoji: "✂", brands: 38, active: 25, integrations: 3 },
      { key: "gaming", name: "🎮 Gaming & Simulation", emoji: "🎮", brands: 56, active: 37, integrations: 3 },
      { key: "health", name: "🧠 Health & Hygiene", emoji: "🧠", brands: 72, active: 48, integrations: 3 },
      { key: "housing", name: "🏗️ Housing & Infrastructure", emoji: "🏗️", brands: 84, active: 56, integrations: 3 },
      { key: "justice", name: "⚖ Justice & Ethics", emoji: "⚖", brands: 29, active: 19, integrations: 3 },
      { key: "knowledge", name: "📖 Knowledge & Archives", emoji: "📖", brands: 31, active: 20, integrations: 3 },
      { key: "micromesh", name: "☰ Micro-Mesh Logistics", emoji: "☰", brands: 42, active: 28, integrations: 3 },
      { key: "media", name: "🎬 Motion, Media & Sonic", emoji: "🎬", brands: 89, active: 59, integrations: 3 },
      { key: "nutrition", name: "✿ Nutrition & Food Chain", emoji: "✿", brands: 64, active: 42, integrations: 3 },
      { key: "ai-logic", name: "🧠 AI, Logic & Grid", emoji: "🧠", brands: 78, active: 52, integrations: 3 },
      { key: "packaging", name: "📦 Packaging & Materials", emoji: "📦", brands: 51, active: 34, integrations: 3 },
      { key: "quantum", name: "✴️ Quantum Protocols", emoji: "✴️", brands: 36, active: 24, integrations: 3 },
      { key: "ritual", name: "☯ Ritual & Culture", emoji: "☯", brands: 47, active: 31, integrations: 3 },
      { key: "saas", name: "🔑 SaaS & Licensing", emoji: "🔑", brands: 82, active: 54, integrations: 3 },
      { key: "trade", name: "🧺 Trade Systems", emoji: "🧺", brands: 35, active: 23, integrations: 3 },
      { key: "utilities", name: "🔋 Utilities & Energy", emoji: "🔋", brands: 73, active: 48, integrations: 3 },
      { key: "voice", name: "🎙️ Voice & Audio", emoji: "🎙️", brands: 41, active: 27, integrations: 3 },
      { key: "webless", name: "📡 Webless Tech & Nodes", emoji: "📡", brands: 39, active: 26, integrations: 3 },
      { key: "nft", name: "🔁 NFT & Ownership", emoji: "🔁", brands: 52, active: 34, integrations: 3 },
      { key: "education-youth", name: "🎓 Education & Youth", emoji: "🎓", brands: 33, active: 22, integrations: 3 },
      { key: "zerowaste", name: "♻️ Zero Waste", emoji: "♻️", brands: 44, active: 29, integrations: 3 },
      { key: "professional", name: "🧾 Professional Services", emoji: "🧾", brands: 61, active: 40, integrations: 3 },
      { key: "payroll-mining", name: "🪙 Payroll Mining & Accounting", emoji: "🪙", brands: 27, active: 18, integrations: 3 },
      { key: "mining", name: "⛏️ Mining & Resources", emoji: "⛏️", brands: 48, active: 32, integrations: 3 },
      { key: "wildlife", name: "🦁 Wildlife & Habitat", emoji: "🦁", brands: 37, active: 24, integrations: 3 },
      { key: "admin-panel", name: "⚙️ Admin Panel", emoji: "⚙️", brands: 15, active: 10, integrations: 3 },
      { key: "global-index", name: "🌐 Global Brand Index", emoji: "🌐", brands: 12, active: 8, integrations: 3 }
    ];

    const createdSectors = new Map();

    // Insert comprehensive sectors matching the reference screenshots
    for (const mapping of comprehensiveSectorMappings) {
      const [sector] = await db.insert(sectors).values({
        name: mapping.name,
        emoji: mapping.emoji,
        description: `${mapping.name} solutions and infrastructure`,
        brandCount: mapping.brands,
        subnodeCount: mapping.brands - mapping.active
      }).returning();

      createdSectors.set(mapping.key, sector);
    }

    // Add Fruitful Crate Dance sectors
    for (const [sectorKey, sectorData] of Object.entries(FRUITFUL_CRATE_DANCE_SECTORS)) {
      const [sector] = await db.insert(sectors).values({
        name: sectorData.name,
        emoji: sectorData.name.split(' ')[0],
        description: sectorData.description,
        brandCount: sectorData.brands.length,
        subnodeCount: Math.floor(sectorData.brands.length * 0.3)
      }).returning();

      createdSectors.set(`fruitful_${sectorKey}`, sector);
    }

    // Insert MineCore™ brands for Mining & Resources sector
    const miningSector = createdSectors.get('mining');
    if (miningSector) {
      const minecoreBrands = [
        { name: "MineCore™ 1", status: "development" },
        { name: "MineCore™ 2", status: "active" },
        { name: "MineCore™ 3", status: "active" },
        { name: "MineCore™ 4", status: "active" },
        { name: "MineCore™ 5", status: "development" },
        { name: "MineCore™ 6", status: "active" },
        { name: "MineCore™ 7", status: "active" },
        { name: "MineCore™ 8", status: "active" },
        { name: "MineCore™ 9", status: "development" },
        { name: "MineCore™ 10", status: "active" },
        { name: "MineCore™ 11", status: "active" },
        { name: "MineCore™ 12", status: "active" }
      ];

      for (const brand of minecoreBrands) {
        await db.insert(brands).values({
          name: brand.name,
          description: `Advanced ⛏️ mining & resources management solution with comprehensive VaultMesh™ integration and Baobab legal.`,
          sectorId: miningSector.id,
          integration: "VaultMesh™",
          status: brand.status,
          isCore: true,
          parentId: null,
          metadata: { 
            featured: true,
            sector: 'mining',
            type: 'Core',
            vaultmeshIntegration: true,
            baobabLegal: true
          }
        });
      }
    }

    // Insert brands from comprehensive data
    let brandCount = 0;
    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_BRAND_DATA)) {
      
      const sector = createdSectors.get(sectorKey);
      if (sector) {
        for (let i = 0; i < sectorData.brands.length; i++) {
          const brandName = sectorData.brands[i];
          await db.insert(brands).values({
            name: brandName,
            description: `Professional ${sectorData.name.replace(/[🔥🌱🏭🧠⚡🏦💊🎨🛡️🌐🏢🚗🎓📱🧪🔬⚖️🏠🌍🍎🌿📊🎯🛒📦🧮💼🔌⚙️🌊💡🎮🔒]/g, '').trim()} solution powered by ${brandName}`,
            sectorId: sector.id,
            integration: ["VaultMesh™", "HotStack", "FAA.ZONE™"][i % 3],
            status: ["active", "maintenance", "active"][i % 3],
            isCore: true,
            parentId: null,
            metadata: { 
              featured: i < 3,
              sector: sectorKey,
              planVersions: sectorData.planVersions
            }
          });
          brandCount++;
        }
      }
    }

    // Add Fruitful Crate Dance brands
    for (const [sectorKey, sectorData] of Object.entries(FRUITFUL_CRATE_DANCE_SECTORS)) {
      const sector = createdSectors.get(`fruitful_${sectorKey}`);
      if (sector) {
        for (let i = 0; i < sectorData.brands.length; i++) {
          const brandName = sectorData.brands[i];
          await db.insert(brands).values({
            name: brandName,
            description: `Fruitful Crate Dance ecosystem brand: ${brandName}`,
            sectorId: sector.id,
            integration: ["VaultMesh™", "HotStack", "FAA.ZONE™"][i % 3],
            status: "active",
            isCore: true,
            parentId: null,
            metadata: { 
              featured: i < 5,
              sector: `fruitful_${sectorKey}`,
              ecosystem: "fruitful-crate-dance"
            }
          });
          brandCount++;
        }
      }
    }

    // Insert system status
    await db.insert(systemStatus).values([
      { service: "VaultMesh™", status: "online" },
      { service: "HotStack", status: "maintenance" },
      { service: "FAA.ZONE™", status: "online" },
      { service: "SecureSign™", status: "online" },
      { service: "King Price Integration", status: "active" }
    ]);

    console.log(`✅ Database seeded successfully!`);
    console.log(`📊 Created ${createdSectors.size} sectors`);
    console.log(`🏷️ Created ${brandCount} brands`);
    console.log(`⛏️ Created 12 MineCore™ brands for Mining & Resources`);
    console.log(`⚙️ Created 5 system status entries`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}