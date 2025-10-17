#!/usr/bin/env tsx

// UPDATE BRAND PRICING - Apply sector pricing to all brands
import { DatabaseStorage } from './storage';

async function updateBrandPricing() {
  console.log("🏷️ UPDATING ALL BRAND PRICING - Applying sector pricing to 3,794 brands");
  
  try {
    const storage = new DatabaseStorage();
    const allSectors = await storage.getAllSectors();
    const allBrands = await storage.getAllBrands();
    
    let brandsUpdated = 0;
    
    console.log(`🏷️ Processing ${allBrands.length} brands across ${allSectors.length} sectors...`);
    
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
            sectorTier: sectorPricing.tier,
            updated: new Date().toISOString()
          };
          
          await storage.updateBrand(brand.id, {
            metadata: updatedBrandMetadata
          });
          
          brandsUpdated++;
          
          if (brandsUpdated % 100 === 0) {
            console.log(`   ✅ Updated ${brandsUpdated} brands...`);
          }
          
        } catch (error) {
          console.error(`   ❌ Failed to update brand ${brand.name}:`, error);
        }
      }
    }
    
    console.log(`\n🎉 BRAND PRICING UPDATE COMPLETE!`);
    console.log(`==============================`);
    console.log(`🏷️ Brands updated: ${brandsUpdated}`);
    console.log(`📊 Total brands: ${allBrands.length}`);
    console.log(`💰 Success rate: ${Math.round((brandsUpdated / allBrands.length) * 100)}%`);
    
    return {
      brandsUpdated,
      totalBrands: allBrands.length,
      successRate: Math.round((brandsUpdated / allBrands.length) * 100),
      complete: true
    };
    
  } catch (error) {
    console.error('💥 Brand pricing update failed:', error);
    throw error;
  }
}

// Execute brand pricing update
updateBrandPricing()
  .then((result) => {
    console.log('🏷️ Brand pricing update executed successfully!', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Brand pricing update failed:', error);
    process.exit(1);
  });