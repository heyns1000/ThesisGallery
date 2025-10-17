#!/usr/bin/env tsx

// GLOBAL SECTOR PRICING INTEGRATION - Complete pricing from comprehensive data file
import { DatabaseStorage } from './storage';

async function globalSectorPricingIntegration() {
  console.log("💰 GLOBAL SECTOR PRICING INTEGRATION - Implementing comprehensive pricing from data file");
  
  try {
    const storage = new DatabaseStorage();
    const allSectors = await storage.getAllSectors();
    
    // COMPREHENSIVE PRICING DATA FROM USER'S FILE
    const globalSectorPricing = {
      // Core Infrastructure Sectors
      "agriculture": { monthly: 179.99, annual: 1799.99, tier: "Growth", currency: "USD" },
      "fsf": { monthly: 159.99, annual: 1599.99, tier: "Eco", currency: "USD" },
      "banking": { monthly: 299.99, annual: 2999.99, tier: "Enterprise Plus", currency: "USD" },
      "creative": { monthly: 199.99, annual: 1999.99, tier: "Creative Pro", currency: "USD" },
      "logistics": { monthly: 189.99, annual: 1899.99, tier: "Operations", currency: "USD" },
      "education-ip": { monthly: 169.99, annual: 1699.99, tier: "Education", currency: "USD" },
      "fashion": { monthly: 149.99, annual: 1499.99, tier: "Style", currency: "USD" },
      "gaming": { monthly: 229.99, annual: 2299.99, tier: "Gaming Pro", currency: "USD" },
      "health": { monthly: 219.99, annual: 2199.99, tier: "Healthcare", currency: "USD" },
      "housing": { monthly: 249.99, annual: 2499.99, tier: "Infrastructure", currency: "USD" },
      "justice": { monthly: 279.99, annual: 2799.99, tier: "Legal Pro", currency: "USD" },
      "knowledge": { monthly: 139.99, annual: 1399.99, tier: "Archive", currency: "USD" },
      "micromesh": { monthly: 119.99, annual: 1199.99, tier: "Micro", currency: "USD" },
      "media": { monthly: 209.99, annual: 2099.99, tier: "Media Pro", currency: "USD" },
      "nutrition": { monthly: 129.99, annual: 1299.99, tier: "Wellness", currency: "USD" },
      "ai-logic": { monthly: 349.99, annual: 3499.99, tier: "AI Enterprise", currency: "USD" },
      "packaging": { monthly: 159.99, annual: 1599.99, tier: "Materials", currency: "USD" },
      "quantum": { monthly: 499.99, annual: 4999.99, tier: "Quantum Elite", currency: "USD" },
      "ritual": { monthly: 109.99, annual: 1099.99, tier: "Culture", currency: "USD" },
      "saas": { monthly: 199.99, annual: 1999.99, tier: "SaaS Pro", currency: "USD" },
      "trade": { monthly: 189.99, annual: 1899.99, tier: "Trade", currency: "USD" },
      "utilities": { monthly: 159.99, annual: 1599.99, tier: "Infrastructure", currency: "USD" },
      "voice": { monthly: 179.99, annual: 1799.99, tier: "Audio Pro", currency: "USD" },
      "webless": { monthly: 169.99, annual: 1699.99, tier: "IoT", currency: "USD" },
      "nft": { monthly: 299.99, annual: 2999.99, tier: "Blockchain", currency: "USD" },
      "education-youth": { monthly: 129.99, annual: 1299.99, tier: "Youth", currency: "USD" },
      "zerowaste": { monthly: 59.99, annual: 599.99, tier: "Eco", currency: "USD" },
      "professional": { monthly: 239.99, annual: 2399.99, tier: "Professional", currency: "USD" },
      "payroll-mining": { monthly: 259.99, annual: 2599.99, tier: "FinTech", currency: "USD" },
      "mining": { monthly: 279.99, annual: 2799.99, tier: "Enterprise", currency: "USD" },
      "wildlife": { monthly: 149.99, annual: 1499.99, tier: "Conservation", currency: "USD" },
      "admin-panel": { monthly: 399.99, annual: 3999.99, tier: "Admin", currency: "USD" },
      "global-index": { monthly: 199.99, annual: 1999.99, tier: "Index", currency: "USD" },
      
      // Fruitful Crate Dance Ecosystem
      "music-sound": { monthly: 199.99, annual: 1999.99, tier: "Music Pro", currency: "USD" },
      "dance-movement": { monthly: 179.99, annual: 1799.99, tier: "Movement", currency: "USD" },
      "event-management": { monthly: 219.99, annual: 2199.99, tier: "Events", currency: "USD" },
      "content-creation": { monthly: 189.99, annual: 1899.99, tier: "Content", currency: "USD" },
      "talent-development": { monthly: 169.99, annual: 1699.99, tier: "Talent", currency: "USD" },
      "sponsorship": { monthly: 249.99, annual: 2499.99, tier: "Sponsorship", currency: "USD" },
      "analytics": { monthly: 159.99, annual: 1599.99, tier: "Analytics", currency: "USD" },
      "community": { monthly: 129.99, annual: 1299.99, tier: "Community", currency: "USD" },
      "financial": { monthly: 229.99, annual: 2299.99, tier: "Finance", currency: "USD" },
      "marketing": { monthly: 199.99, annual: 1999.99, tier: "Marketing", currency: "USD" }
    };
    
    console.log(`💰 Updating pricing for ${Object.keys(globalSectorPricing).length} sectors...`);
    
    let sectorsUpdated = 0;
    
    for (const [sectorKey, pricing] of Object.entries(globalSectorPricing)) {
      // Find sector by key or name matching
      const sector = allSectors.find(s => 
        s.name.toLowerCase().includes(sectorKey.replace('-', ' ').replace('-', ' ')) ||
        s.name.toLowerCase().includes(sectorKey.split('-')[0]) ||
        (sectorKey === 'agriculture' && s.name.includes('Agriculture')) ||
        (sectorKey === 'fsf' && s.name.includes('Food, Soil')) ||
        (sectorKey === 'banking' && s.name.includes('Banking')) ||
        (sectorKey === 'creative' && s.name.includes('Creative')) ||
        (sectorKey === 'logistics' && s.name.includes('Logistics')) ||
        (sectorKey === 'education-ip' && s.name.includes('Education') && s.name.includes('IP')) ||
        (sectorKey === 'fashion' && s.name.includes('Fashion')) ||
        (sectorKey === 'gaming' && s.name.includes('Gaming')) ||
        (sectorKey === 'health' && s.name.includes('Health')) ||
        (sectorKey === 'housing' && s.name.includes('Housing')) ||
        (sectorKey === 'justice' && s.name.includes('Justice')) ||
        (sectorKey === 'knowledge' && s.name.includes('Knowledge')) ||
        (sectorKey === 'micromesh' && s.name.includes('Micro-Mesh')) ||
        (sectorKey === 'media' && s.name.includes('Motion, Media')) ||
        (sectorKey === 'nutrition' && s.name.includes('Nutrition')) ||
        (sectorKey === 'ai-logic' && s.name.includes('AI, Logic')) ||
        (sectorKey === 'packaging' && s.name.includes('Packaging')) ||
        (sectorKey === 'quantum' && s.name.includes('Quantum')) ||
        (sectorKey === 'ritual' && s.name.includes('Ritual')) ||
        (sectorKey === 'saas' && s.name.includes('SaaS')) ||
        (sectorKey === 'trade' && s.name.includes('Trade')) ||
        (sectorKey === 'utilities' && s.name.includes('Utilities')) ||
        (sectorKey === 'voice' && s.name.includes('Voice')) ||
        (sectorKey === 'webless' && s.name.includes('Webless')) ||
        (sectorKey === 'nft' && s.name.includes('NFT')) ||
        (sectorKey === 'education-youth' && s.name.includes('Education') && s.name.includes('Youth')) ||
        (sectorKey === 'zerowaste' && s.name.includes('Zero Waste')) ||
        (sectorKey === 'professional' && s.name.includes('Professional')) ||
        (sectorKey === 'payroll-mining' && s.name.includes('Payroll')) ||
        (sectorKey === 'mining' && s.name.includes('Mining') && s.name.includes('Resources')) ||
        (sectorKey === 'wildlife' && s.name.includes('Wildlife')) ||
        (sectorKey === 'admin-panel' && s.name.includes('Admin Panel')) ||
        (sectorKey === 'global-index' && s.name.includes('Global Brand')) ||
        (sectorKey === 'music-sound' && s.name.includes('Music')) ||
        (sectorKey === 'dance-movement' && s.name.includes('Dance')) ||
        (sectorKey === 'event-management' && s.name.includes('Event')) ||
        (sectorKey === 'content-creation' && s.name.includes('Content')) ||
        (sectorKey === 'talent-development' && s.name.includes('Talent')) ||
        (sectorKey === 'sponsorship' && s.name.includes('Sponsorship')) ||
        (sectorKey === 'analytics' && s.name.includes('Analytics')) ||
        (sectorKey === 'community' && s.name.includes('Community')) ||
        (sectorKey === 'financial' && s.name.includes('Financial')) ||
        (sectorKey === 'marketing' && s.name.includes('Marketing'))
      );
      
      if (sector) {
        try {
          // Update sector metadata with comprehensive pricing
          const updatedMetadata = {
            ...sector.metadata,
            pricing: {
              monthly: pricing.monthly,
              annual: pricing.annual,
              tier: pricing.tier,
              currency: pricing.currency,
              features: [
                "VaultMesh™ Integration",
                "Real-time Analytics",
                "24/7 Support",
                "Global Deployment",
                "Enterprise Security"
              ],
              discounts: {
                annual: "Save 16.7%",
                enterprise: "Volume discounts available"
              }
            },
            tier: pricing.tier
          };
          
          await storage.updateSector(sector.id, {
            metadata: updatedMetadata
          });
          
          sectorsUpdated++;
          console.log(`   ✅ Updated ${sector.name}: $${pricing.monthly} USD (${pricing.tier})`);
          
        } catch (error) {
          console.error(`   ❌ Failed to update ${sectorKey}:`, error);
        }
      }
    }
    
    // Update all brands in updated sectors with tier-based pricing
    console.log(`\n💰 Updating brand pricing to match sector tiers...`);
    
    const allBrands = await storage.getAllBrands();
    let brandsUpdated = 0;
    
    for (const brand of allBrands) {
      const sector = allSectors.find(s => s.id === brand.sectorId);
      if (sector && sector.metadata?.pricing) {
        const sectorPricing = sector.metadata.pricing;
        
        // Calculate brand pricing based on sector tier
        let brandMonthly = sectorPricing.monthly * 0.3; // Brands are 30% of sector price
        let brandAnnual = sectorPricing.annual * 0.3;
        
        // Adjust for subnodes (20% of parent brand price)
        if (brand.parentId) {
          brandMonthly = brandMonthly * 0.2;
          brandAnnual = brandAnnual * 0.2;
        }
        
        try {
          const updatedBrandMetadata = {
            ...brand.metadata,
            pricing: {
              monthly: Math.round(brandMonthly * 100) / 100,
              annual: Math.round(brandAnnual * 100) / 100,
              currency: sectorPricing.currency,
              tier: sectorPricing.tier
            },
            sectorTier: sectorPricing.tier
          };
          
          await storage.updateBrand(brand.id, {
            metadata: updatedBrandMetadata
          });
          
          brandsUpdated++;
          
        } catch (error) {
          console.error(`   ❌ Failed to update brand ${brand.name}:`, error);
        }
      }
    }
    
    console.log(`\n🎉 GLOBAL SECTOR PRICING INTEGRATION COMPLETE!`);
    console.log(`=============================================`);
    console.log(`💰 Sectors updated: ${sectorsUpdated}`);
    console.log(`🏷️ Brands updated: ${brandsUpdated}`);
    
    // Generate pricing summary
    console.log(`\n📊 SECTOR PRICING SUMMARY:`);
    console.log(`========================`);
    
    const updatedSectors = await storage.getAllSectors();
    for (const sector of updatedSectors.filter(s => s.metadata?.pricing)) {
      const pricing = sector.metadata.pricing;
      console.log(`${sector.emoji} ${sector.name}: $${pricing.monthly}/mo | $${pricing.annual}/yr (${pricing.tier})`);
    }
    
    return {
      sectorsUpdated,
      brandsUpdated,
      totalSectors: allSectors.length,
      totalBrands: allBrands.length,
      complete: true
    };
    
  } catch (error) {
    console.error('💥 Global sector pricing integration failed:', error);
    throw error;
  }
}

// Execute global pricing integration
globalSectorPricingIntegration()
  .then((result) => {
    console.log('💰 Global sector pricing integration executed successfully!', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Global sector pricing integration failed:', error);
    process.exit(1);
  });