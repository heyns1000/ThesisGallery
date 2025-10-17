import { db } from "./db.ts";
import { brands, sectors } from "../shared/schema.ts";
import { eq } from "drizzle-orm";

const fruitfulBrandsData = {
  "🎵 Music & Sound Design": [
    "BeatForge™", "SoundWave™", "AudioCraft™", "MixMaster™", "SonicPulse™",
    "RhythmGrid™", "BassDrop™", "EchoBox™", "VibeSync™", "TuneForge™",
    "FrequencyFlow™", "BeatLab™", "SoundSphere™", "AudioVault™", "MixFlow™"
  ],
  "🕺 Dance & Movement": [
    "MoveFlow™", "DanceGrid™", "StepSync™", "MotionMesh™", "FlowForge™",
    "RhythmMove™", "BodyWave™", "DanceCore™", "StepCraft™", "MoveSync™",
    "FlowLab™", "MotionPulse™", "DanceVault™", "StepFlow™", "MoveGrid™"
  ],
  "🎪 Event Management": [
    "EventCore™", "ShowFlow™", "StageSync™", "VenueGrid™", "EventForge™",
    "ShowCraft™", "StageFlow™", "EventVault™", "ShowGrid™", "VenueFlow™",
    "EventLab™", "ShowSync™", "StageCore™", "VenueForge™", "EventMesh™"
  ],
  "🎬 Content Creation": [
    "ContentForge™", "MediaFlow™", "VideoGrid™", "CreativeCore™", "MediaCraft™",
    "ContentLab™", "VideoFlow™", "MediaSync™", "CreativeGrid™", "ContentVault™",
    "MediaForge™", "VideoCore™", "CreativeFlow™", "ContentSync™", "MediaMesh™"
  ],
  "🌟 Talent Development": [
    "TalentForge™", "SkillFlow™", "GrowthGrid™", "DevCore™", "TalentCraft™",
    "SkillLab™", "GrowthFlow™", "TalentSync™", "DevGrid™", "SkillForge™",
    "GrowthCore™", "TalentFlow™", "SkillGrid™", "DevFlow™", "TalentMesh™"
  ],
  "🤝 Sponsorship Management": [
    "SponsorFlow™", "PartnerGrid™", "BrandSync™", "SponsorCore™", "PartnerForge™",
    "BrandFlow™", "SponsorCraft™", "PartnerFlow™", "BrandGrid™", "SponsorLab™",
    "PartnerCore™", "BrandForge™", "SponsorSync™", "PartnerCraft™", "BrandMesh™"
  ],
  "📊 Analytics & Insights": [
    "DataForge™", "InsightFlow™", "AnalyticsCore™", "MetricsGrid™", "DataCraft™",
    "InsightLab™", "AnalyticsFlow™", "DataSync™", "MetricsFlow™", "InsightGrid™",
    "AnalyticsForge™", "DataFlow™", "MetricsCore™", "InsightForge™", "DataMesh™"
  ],
  "🏘️ Community Engagement": [
    "CommunityCore™", "SocialFlow™", "EngageGrid™", "CommunityForge™", "SocialCraft™",
    "EngageFlow™", "CommunityLab™", "SocialSync™", "EngageCore™", "CommunityFlow™",
    "SocialGrid™", "EngageForge™", "CommunityCraft™", "SocialForge™", "EngageMesh™"
  ],
  "💰 Financial Management": [
    "FinanceForge™", "MoneyFlow™", "BudgetGrid™", "FinanceCore™", "MoneyCraft™",
    "BudgetFlow™", "FinanceLab™", "MoneySync™", "BudgetCore™", "FinanceFlow™",
    "MoneyGrid™", "BudgetForge™", "FinanceCraft™", "MoneyForge™", "BudgetMesh™"
  ],
  "🎨 Marketing & Branding": [
    "BrandForge™", "MarketFlow™", "CreativeSync™", "BrandCore™", "MarketCraft™",
    "CreativeGrid™", "BrandLab™", "MarketSync™", "CreativeCore™", "BrandFlow™",
    "MarketGrid™", "CreativeForge™", "BrandCraft™", "MarketForge™", "CreativeMesh™"
  ]
};

async function seedFruitfulBrands() {
  console.log("🍎 Seeding Fruitful Crate Dance brands...");

  for (const [sectorName, brandList] of Object.entries(fruitfulBrandsData)) {
    try {
      // Get sector ID
      const sector = await db
        .select()
        .from(sectors)
        .where(eq(sectors.name, sectorName))
        .limit(1);

      if (sector.length === 0) {
        console.log(`❌ Sector not found: ${sectorName}`);
        continue;
      }

      const sectorId = sector[0].id;
      console.log(`🔄 Seeding ${sectorName} (${brandList.length} brands)...`);

      for (let i = 0; i < brandList.length; i++) {
        const brandName = brandList[i];
        
        try {
          // Check if brand exists
          const existingBrand = await db
            .select()
            .from(brands)
            .where(eq(brands.name, brandName))
            .limit(1);

          if (existingBrand.length === 0) {
            await db.insert(brands).values({
              name: brandName,
              description: `Advanced ${sectorName.replace(/[^\w\s&]/g, '')} solution with cutting-edge technology`,
              sectorId: sectorId,
              status: "active",
              isCore: i < 5, // First 5 brands are core
              price: 29.99 + (i * 2.50),
              integration: "active", // Required field
              metadata: {
                tier: i < 3 ? "A+" : i < 8 ? "A" : "B+",
                category: sectorName.toLowerCase().replace(/[^\w]/g, ''),
                features: ["Real-time Processing", "Advanced Analytics", "Scalable Architecture", "API Integration"],
                launchDate: "2025-01-01"
              }
            });
            console.log(`✅ Added: ${brandName}`);
          } else {
            console.log(`⚠️  Exists: ${brandName}`);
          }
        } catch (error) {
          if (error.code === '23505') {
            console.log(`⚠️  Brand exists: ${brandName}`);
          } else {
            console.error(`❌ Error adding ${brandName}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error processing sector ${sectorName}:`, error.message);
    }
  }

  // Final count
  const totalBrands = await db.select().from(brands);
  console.log(`🎯 Total brands in database: ${totalBrands.length}`);
  
  return totalBrands.length;
}

seedFruitfulBrands().then((count) => {
  console.log(`✅ Fruitful brands seeding completed! Total: ${count} brands`);
}).catch(console.error);