import { db } from "./db";
import { sectors } from "@shared/schema";
import { eq } from "drizzle-orm";

// Real pricing structure based on sector complexity and value
const sectorPricing = {
  // Premium Enterprise Sectors
  "⛏️ Mining & Resources": { price: "199.99", tier: "Enterprise" },
  "🏦 Banking & Finance": { price: "299.99", tier: "Enterprise Plus" },
  "🔧 SaaS & Licensing": { price: "149.99", tier: "Professional" },
  "📊 Professional Services": { price: "179.99", tier: "Professional Plus" },
  "🔬 Quantum Protocols": { price: "249.99", tier: "Advanced" },
  
  // Mid-Tier Professional Sectors  
  "🌱 Agriculture & Biotech": { price: "89.99", tier: "Growth" },
  "📦 Logistics & Packaging": { price: "79.99", tier: "Standard Plus" },
  "🍽️ Nutrition & Food Chain": { price: "69.99", tier: "Standard" },
  "♻️ Zero Waste": { price: "59.99", tier: "Eco" },
  "🏥 Healthcare & Wellness": { price: "129.99", tier: "Professional" },
  
  // Creative & Entertainment Sectors
  "🎮 Gaming & Entertainment": { price: "99.99", tier: "Creator" },
  "🎨 Creative Tech": { price: "89.99", tier: "Creator" },
  "🎵 Voice & Audio": { price: "79.99", tier: "Creator" },
  "🎭 Ritual & Culture": { price: "49.99", tier: "Community" },
  
  // Infrastructure & Technology
  "🔋 Utilities & Energy": { price: "159.99", tier: "Infrastructure" },
  "🏠 Housing": { price: "119.99", tier: "Real Estate" },
  "🎓 Education": { price: "69.99", tier: "Academic" },
  "🔐 Wellness Tech & Nodes": { price: "109.99", tier: "Technology" },
  
  // Special Categories
  "💎 NFT & Ownership": { price: "189.99", tier: "Blockchain" },
  "⚖️ Justice & Ethics": { price: "219.99", tier: "Legal Pro" },
  "🔒 Security & Privacy": { price: "169.99", tier: "Security Pro" },
  "🌍 Environmental": { price: "79.99", tier: "Sustainability" },
  
  // Standard Access Sectors
  "📱 Mobile & Apps": { price: "59.99", tier: "Mobile" },
  "🛒 E-commerce": { price: "89.99", tier: "Commerce" },
  "📈 Marketing & Analytics": { price: "99.99", tier: "Marketing Pro" },
  "🌐 Web Development": { price: "79.99", tier: "Developer" },
  
  // Emerging Technologies
  "🤖 AI & Machine Learning": { price: "199.99", tier: "AI Pro" },
  "🚗 Automotive": { price: "139.99", tier: "Mobility" },
  "✈️ Aerospace": { price: "249.99", tier: "Aerospace Pro" },
  "🛡️ Defense & Security": { price: "299.99", tier: "Defense Pro" },
  
  // Community & Social
  "👥 Social & Community": { price: "39.99", tier: "Social" },
  "🎪 Events & Entertainment": { price: "69.99", tier: "Events" },
  "📚 Media & Publishing": { price: "79.99", tier: "Publishing" },
  "🏃 Sports & Fitness": { price: "59.99", tier: "Fitness" },
  
  // Specialized Services
  "🔧 Maintenance & Support": { price: "49.99", tier: "Support" },
  "📋 Compliance & Audit": { price: "189.99", tier: "Compliance Pro" },
  "🔄 Integration Services": { price: "129.99", tier: "Integration" },
  "📊 Business Intelligence": { price: "159.99", tier: "Analytics Pro" },
};

export async function updateSectorPricing() {
  console.log("💰 Updating sector pricing with real market values...");
  
  try {
    const allSectors = await db.select().from(sectors);
    
    for (const sector of allSectors) {
      const pricingInfo = sectorPricing[sector.name as keyof typeof sectorPricing];
      
      if (pricingInfo) {
        await db.update(sectors)
          .set({
            price: pricingInfo.price,
            currency: "USD",
            metadata: {
              ...sector.metadata as any,
              tier: pricingInfo.tier,
              priceUpdated: new Date().toISOString()
            }
          })
          .where(eq(sectors.id, sector.id));
          
        console.log(`💰 Updated ${sector.name}: $${pricingInfo.price} USD (${pricingInfo.tier})`);
      } else {
        // Default pricing for unknown sectors
        await db.update(sectors)
          .set({
            price: "79.99",
            currency: "USD",
            metadata: {
              ...sector.metadata as any,
              tier: "Standard",
              priceUpdated: new Date().toISOString()
            }
          })
          .where(eq(sectors.id, sector.id));
          
        console.log(`💰 Default pricing for ${sector.name}: $79.99 USD`);
      }
    }
    
    console.log("✅ Sector pricing update completed!");
    return true;
  } catch (error) {
    console.error("❌ Error updating sector pricing:", error);
    return false;
  }
}