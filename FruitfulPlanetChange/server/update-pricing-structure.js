import { db } from './db.js';
import { brands, sectors } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Comprehensive pricing structure for all sectors
const sectorPricingTiers = {
  // Enterprise Tiers (High-value business solutions)
  'enterprise': {
    monthly: 299.99,
    annual: 2999.99,
    savings: '16% off annual',
    sectors: ['🏦 Banking & Finance', '⛏️ Mining & Resources', '🏗️ Housing & Infrastructure']
  },
  
  // Professional Tiers (Mid-tier business solutions)
  'professional': {
    monthly: 159.99,
    annual: 1599.99,
    savings: '16% off annual',
    sectors: ['🔋 Utilities & Energy', '📦 Logistics & Packaging', '🧾 Professional Services', '🪙 Payroll Mining & Accounting']
  },
  
  // Growth Tiers (Growing business solutions)
  'growth': {
    monthly: 89.99,
    annual: 899.99,
    savings: '16% off annual', 
    sectors: ['🌱 Agriculture & Biotech', '🧠 AI, Logic & Grid', '📚 Education & IP', '🎬 Motion, Media & Sonic']
  },
  
  // Standard Tiers (Core business solutions)
  'standard': {
    monthly: 79.99,
    annual: 799.99,
    savings: '16% off annual',
    sectors: ['🖋️ Creative Tech', '🎮 Gaming & Simulation', '🧠 Health & Hygiene', '⚖ Justice & Ethics', '📖 Knowledge & Archives', '☰ Micro-Mesh Logistics', '✿ Nutrition & Food Chain', '📦 Packaging & Materials', '✴️ Quantum Protocols', '☯ Ritual & Culture', '🔑 SaaS & Licensing', '🧺 Trade Systems', '🎙️ Voice & Audio', '📡 Webless Tech & Nodes', '🔁 NFT & Ownership', '🎓 Education & Youth', '🦁 Wildlife & Habitat', '⚙️ Admin Panel', '🌐 Global Brand Index']
  },
  
  // Eco Tiers (Environmental and sustainability focused)
  'eco': {
    monthly: 59.99,
    annual: 599.99,
    savings: '16% off annual',
    sectors: ['♻️ Zero Waste', '🥦 Food, Soil & Farming']
  },
  
  // Premium Tiers (Fashion and Identity focused)
  'premium': {
    monthly: 199.99,
    annual: 1999.99,
    savings: '16% off annual',
    sectors: ['✂ Fashion & Identity']
  },
  
  // Fruitful Crate Dance Ecosystem (Special pricing for entertainment sectors)
  'entertainment': {
    monthly: 99.99,
    annual: 999.99,
    savings: '16% off annual',
    sectors: ['🎵 Music & Sound Design', '🕺 Dance & Movement', '🌟 Talent Development', '🤝 Sponsorship Management', '🎪 Event Management', '🎬 Content Creation', '🎨 Marketing & Branding', '🤝 Partnership & Collaboration', '📊 Analytics & Insights', '🌱 Sustainability & Impact', '🏘️ Community Engagement', '⚙️ Tech Infrastructure', '📦 Logistics & Operations', '💰 Financial Management']
  }
};

// Special brand-specific pricing overrides
const brandPricingOverrides = {
  // Mining sector premium brands
  'OreVault™': { monthly: 349.99, annual: 3499.99, tier: 'enterprise-plus' },
  'DrillCore™': { monthly: 329.99, annual: 3299.99, tier: 'enterprise-plus' },
  'VaultOrb™': { monthly: 309.99, annual: 3099.99, tier: 'enterprise-plus' },
  
  // Banking sector premium brands  
  'FinGrid™': { monthly: 399.99, annual: 3999.99, tier: 'enterprise-plus' },
  'TradeAmp™': { monthly: 379.99, annual: 3799.99, tier: 'enterprise-plus' },
  'VaultMaster™': { monthly: 359.99, annual: 3599.99, tier: 'enterprise-plus' },
  
  // AI Logic premium brands
  'AIGrid™': { monthly: 129.99, annual: 1299.99, tier: 'growth-plus' },
  'LogicNode™': { monthly: 119.99, annual: 1199.99, tier: 'growth-plus' },
  'AIVault™': { monthly: 109.99, annual: 1099.99, tier: 'growth-plus' }
};

async function updatePricingStructure() {
  console.log('💰 UPDATING COMPREHENSIVE PRICING STRUCTURE...');
  
  try {
    // Get all sectors
    const allSectors = await db.select().from(sectors);
    console.log(`📊 Found ${allSectors.length} sectors to update`);
    
    // Update each sector's pricing
    for (const sector of allSectors) {
      // Find the pricing tier for this sector
      let pricingTier = null;
      let tierInfo = null;
      
      for (const [tier, info] of Object.entries(sectorPricingTiers)) {
        if (info.sectors.includes(sector.name)) {
          pricingTier = tier;
          tierInfo = info;
          break;
        }
      }
      
      // Default to standard if no tier found
      if (!pricingTier) {
        pricingTier = 'standard';
        tierInfo = sectorPricingTiers.standard;
      }
      
      console.log(`💰 Updating ${sector.name}: ${pricingTier} tier`);
      
      // Get all brands for this sector
      const sectorBrands = await db.select().from(brands).where(eq(brands.sectorId, sector.id));
      
      for (const brand of sectorBrands) {
        let finalPricing = tierInfo;
        
        // Check for brand-specific overrides
        if (brandPricingOverrides[brand.name]) {
          finalPricing = {
            monthly: brandPricingOverrides[brand.name].monthly,
            annual: brandPricingOverrides[brand.name].annual,
            savings: '16% off annual',
            tier: brandPricingOverrides[brand.name].tier
          };
          console.log(`  ⭐ Special pricing for ${brand.name}: $${finalPricing.monthly}/mo`);
        }
        
        // Update brand metadata with comprehensive pricing
        const updatedMetadata = {
          ...brand.metadata,
          pricing: {
            monthly: finalPricing.monthly,
            annual: finalPricing.annual,
            savings: finalPricing.savings,
            tier: pricingTier,
            currency: 'USD',
            billingCycle: 'monthly',
            features: brand.isCore ? [
              'Full VaultMesh™ Integration',
              'Real-time Analytics',
              'Priority Support',
              'Advanced Security',
              'Custom Configurations'
            ] : [
              'Basic VaultMesh™ Integration',
              'Standard Analytics',
              'Community Support',
              'Essential Security'
            ]
          },
          displayPrice: `$${finalPricing.monthly}`,
          displayPricing: {
            monthly: `$${finalPricing.monthly}/month`,
            annual: `$${finalPricing.annual}/year`,
            monthlyEquivalent: `$${(finalPricing.annual / 12).toFixed(2)}/month`,
            savingsText: finalPricing.savings
          }
        };
        
        // Update the brand in database
        await db
          .update(brands)
          .set({ metadata: updatedMetadata })
          .where(eq(brands.id, brand.id));
      }
      
      console.log(`  ✅ Updated ${sectorBrands.length} brands in ${sector.name}`);
    }
    
    // Verify some updates
    console.log('\n🔍 VERIFICATION - Sample pricing:');
    const sampleBrands = await db.select().from(brands).limit(5);
    for (const brand of sampleBrands) {
      const pricing = brand.metadata?.pricing;
      if (pricing) {
        console.log(`  ${brand.name}: $${pricing.monthly}/mo, $${pricing.annual}/yr (${pricing.savings})`);
      }
    }
    
    console.log('\n✅ PRICING STRUCTURE UPDATE COMPLETED!');
    return true;
    
  } catch (error) {
    console.error('❌ Error updating pricing structure:', error);
    throw error;
  }
}

export { updatePricingStructure };