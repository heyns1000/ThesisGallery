import { db } from "./db.ts";
import { sectors } from "../shared/schema.ts";
import { eq } from "drizzle-orm";

const completeSectorList = [
  // Existing core sectors
  { name: "⛏️ Mining & Resources", emoji: "⛏️", description: "Mining & Resources solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🌱 Agriculture & Biotech", emoji: "🌱", description: "Agriculture & Biotech solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🥦 Food, Soil & Farming", emoji: "🥦", description: "Food, Soil & Farming solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🏦 Banking & Finance", emoji: "🏦", description: "Banking & Finance solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🖋️ Creative Tech", emoji: "🖋️", description: "Creative Tech solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "📦 Logistics & Packaging", emoji: "📦", description: "Logistics & Packaging solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "📚 Education & IP", emoji: "📚", description: "Education & IP solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "✂ Fashion & Identity", emoji: "✂", description: "Fashion & Identity solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🎮 Gaming & Simulation", emoji: "🎮", description: "Gaming & Simulation solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🧠 Health & Hygiene", emoji: "🧠", description: "Health & Hygiene solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🏗️ Housing & Infrastructure", emoji: "🏗️", description: "Housing & Infrastructure solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "⚖ Justice & Ethics", emoji: "⚖", description: "Justice & Ethics solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "📖 Knowledge & Archives", emoji: "📖", description: "Knowledge & Archives solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "☰ Micro-Mesh Logistics", emoji: "☰", description: "Micro-Mesh Logistics solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🎬 Motion, Media & Sonic", emoji: "🎬", description: "Motion, Media & Sonic solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "✿ Nutrition & Food Chain", emoji: "✿", description: "Nutrition & Food Chain solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🧠 AI, Logic & Grid", emoji: "🧠", description: "AI, Logic & Grid solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "📦 Packaging & Materials", emoji: "📦", description: "Packaging & Materials solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "✴️ Quantum Protocols", emoji: "✴️", description: "Quantum Protocols solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "☯ Ritual & Culture", emoji: "☯", description: "Ritual & Culture solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🔑 SaaS & Licensing", emoji: "🔑", description: "SaaS & Licensing solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🧺 Trade Systems", emoji: "🧺", description: "Trade Systems solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🔋 Utilities & Energy", emoji: "🔋", description: "Utilities & Energy solutions and infrastructure", price: 159.99, status: "active", isCore: true },
  { name: "🎙️ Voice & Audio", emoji: "🎙️", description: "Voice & Audio solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "📡 Webless Tech & Nodes", emoji: "📡", description: "Webless Tech & Nodes solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🔁 NFT & Ownership", emoji: "🔁", description: "NFT & Ownership solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🎓 Education & Youth", emoji: "🎓", description: "Education & Youth solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "♻️ Zero Waste", emoji: "♻️", description: "Zero Waste solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🧾 Professional Services", emoji: "🧾", description: "Professional Services solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🪙 Payroll Mining & Accounting", emoji: "🪙", description: "Payroll Mining & Accounting solutions and infrastructure", price: 79.99, status: "active", isCore: true },
  { name: "🦁 Wildlife & Habitat", emoji: "🦁", description: "Wildlife & Habitat solutions and infrastructure", price: 79.99, status: "active", isCore: true },

  // Fruitful Crate Dance Ecosystem Sectors
  { name: "⚙️ Admin Panel", emoji: "⚙️", description: "Admin Panel solutions and infrastructure", price: 129.99, status: "active", isCore: true, metadata: { tier: "A+", category: "infrastructure" } },
  { name: "🌐 Global Brand Index", emoji: "🌐", description: "Global Brand Index solutions and infrastructure", price: 199.99, status: "active", isCore: true, metadata: { tier: "A+", category: "global" } },
  { name: "🤝 Sponsorship Management", emoji: "🤝", description: "Complete sponsorship lifecycle management including King Price Insurance integration", price: 149.99, status: "active", isCore: true, metadata: { tier: "A+", category: "partnerships" } },
  { name: "🎪 Event Management", emoji: "🎪", description: "End-to-end event production and management systems", price: 119.99, status: "active", isCore: true, metadata: { tier: "A", category: "events" } },
  { name: "🎬 Content Creation", emoji: "🎬", description: "Media production and content distribution platforms", price: 99.99, status: "active", isCore: true, metadata: { tier: "A", category: "media" } },
  { name: "🌟 Talent Development", emoji: "🌟", description: "Comprehensive talent nurturing and career development", price: 89.99, status: "active", isCore: true, metadata: { tier: "A", category: "development" } },
  
  // Enhanced Analytics & Management Sectors
  { name: "📊 Analytics & Insights", emoji: "📊", description: "Data-driven insights and performance analytics", price: 109.99, status: "active", isCore: true, metadata: { tier: "A+", category: "analytics" } },
  { name: "🌱 Sustainability & Impact", emoji: "🌱", description: "Environmental and social impact management", price: 79.99, status: "active", isCore: true, metadata: { tier: "A", category: "sustainability" } },
  { name: "🏘️ Community Engagement", emoji: "🏘️", description: "Community building and social impact initiatives", price: 79.99, status: "active", isCore: true, metadata: { tier: "A", category: "community" } },
  { name: "⚙️ Tech Infrastructure", emoji: "⚙️", description: "Complete technical deployment and scaling infrastructure", price: 159.99, status: "active", isCore: true, metadata: { tier: "A+", category: "infrastructure" } },
  { name: "📦 Logistics & Operations", emoji: "📦", description: "Operational excellence and logistics management", price: 99.99, status: "active", isCore: true, metadata: { tier: "A", category: "operations" } },
  { name: "💰 Financial Management", emoji: "💰", description: "Comprehensive financial planning and management", price: 129.99, status: "active", isCore: true, metadata: { tier: "A+", category: "finance" } },
  { name: "🎨 Marketing & Branding", emoji: "🎨", description: "Brand development and marketing strategy execution", price: 109.99, status: "active", isCore: true, metadata: { tier: "A", category: "marketing" } },
  { name: "🤝 Partnership & Collaboration", emoji: "🤝", description: "Strategic partnerships and collaboration management", price: 119.99, status: "active", isCore: true, metadata: { tier: "A", category: "partnerships" } },

  // Additional Fruitful Ecosystem Sectors
  { name: "🎵 Music & Sound Design", emoji: "🎵", description: "Music production and audio engineering for Crate Dance", price: 89.99, status: "active", isCore: true, metadata: { tier: "A", category: "audio" } },
  { name: "🕺 Dance & Movement", emoji: "🕺", description: "Choreography and movement instruction systems", price: 79.99, status: "active", isCore: true, metadata: { tier: "A", category: "movement" } }
];

async function seedAllSectors() {
  console.log("🌟 Seeding complete 45-sector ecosystem...");

  for (const sector of completeSectorList) {
    try {
      // Check if sector already exists by name
      const existing = await db
        .select()
        .from(sectors)
        .where(eq(sectors.name, sector.name))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(sectors).values({
          name: sector.name,
          emoji: sector.emoji,
          description: sector.description,
          price: sector.price,
          status: sector.status || "active",
          isCore: sector.isCore || true,
          metadata: sector.metadata || {}
        });
        console.log(`✅ Added sector: ${sector.name}`);
      } else {
        console.log(`⚠️  Sector exists: ${sector.name}`);
      }
    } catch (error) {
      console.error(`❌ Error adding sector ${sector.name}:`, error.message);
    }
  }

  // Verify final count
  const finalCount = await db.select().from(sectors);
  console.log(`🎯 Total sectors in database: ${finalCount.length}`);
  
  return finalCount.length;
}

// Run seeding
seedAllSectors().then((count) => {
  console.log(`✅ Sector seeding completed! Total: ${count} sectors`);
}).catch(console.error);