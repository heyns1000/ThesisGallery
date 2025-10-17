#!/usr/bin/env tsx

// VERIFY COMPLETE BRAND INTEGRATION - Ensure ALL core brands and subnodes are integrated
import { DatabaseStorage } from './storage';

async function verifyCompleteBrandIntegration() {
  console.log("🔍 VERIFYING COMPLETE BRAND INTEGRATION - Checking all core brands and subnodes");
  
  try {
    const storage = new DatabaseStorage();
    const allSectors = await storage.getAllSectors();
    const allBrands = await storage.getAllBrands();
    
    console.log(`📊 Database Status:`);
    console.log(`   - Total sectors: ${allSectors.length}`);
    console.log(`   - Total brands: ${allBrands.length}`);
    
    // Key sectors to verify with expected brand counts from comprehensive data
    const keyVerificationSectors = [
      { name: 'ailogic', expectedMinBrands: 150, emoji: '🧠' },
      { name: 'banking', expectedMinBrands: 300, emoji: '🏦' },
      { name: 'agriculture', expectedMinBrands: 80, emoji: '🌱' },
      { name: 'logistics', expectedMinBrands: 100, emoji: '📦' },
      { name: 'webless', expectedMinBrands: 80, emoji: '📡' },
      { name: 'media', expectedMinBrands: 80, emoji: '🎬' },
      { name: 'health', expectedMinBrands: 80, emoji: '🧠' },
      { name: 'housing', expectedMinBrands: 80, emoji: '🏗️' },
      { name: 'education-ip', expectedMinBrands: 60, emoji: '📚' },
      { name: 'education-youth', expectedMinBrands: 10, emoji: '🎓' }
    ];
    
    console.log(`\n🔍 SECTOR VERIFICATION REPORT:`);
    console.log(`===============================`);
    
    let totalVerifiedBrands = 0;
    let sectorsWithMissingData = [];
    
    for (const verifySpec of keyVerificationSectors) {
      const sector = allSectors.find(s => 
        s.name.toLowerCase().includes(verifySpec.name.toLowerCase()) || 
        s.name === verifySpec.name ||
        s.emoji === verifySpec.emoji
      );
      
      if (sector) {
        const sectorBrands = allBrands.filter(b => b.sectorId === sector.id);
        const coreBrands = sectorBrands.filter(b => !b.parentId);
        const subnodes = sectorBrands.filter(b => b.parentId);
        
        totalVerifiedBrands += sectorBrands.length;
        
        if (sectorBrands.length >= verifySpec.expectedMinBrands) {
          console.log(`✅ ${sector.emoji} ${sector.name}: ${sectorBrands.length} brands (${coreBrands.length} core + ${subnodes.length} subnodes) ✓`);
        } else {
          console.log(`⚠️  ${sector.emoji} ${sector.name}: ${sectorBrands.length} brands (Expected: ${verifySpec.expectedMinBrands}+) - NEEDS INTEGRATION`);
          sectorsWithMissingData.push({
            sector: sector.name,
            current: sectorBrands.length,
            expected: verifySpec.expectedMinBrands,
            gap: verifySpec.expectedMinBrands - sectorBrands.length
          });
        }
      } else {
        console.log(`❌ ${verifySpec.emoji} ${verifySpec.name}: SECTOR NOT FOUND - NEEDS CREATION`);
        sectorsWithMissingData.push({
          sector: verifySpec.name,
          current: 0,
          expected: verifySpec.expectedMinBrands,
          gap: verifySpec.expectedMinBrands,
          missing: true
        });
      }
    }
    
    console.log(`\n📈 INTEGRATION COMPLETENESS SUMMARY:`);
    console.log(`====================================`);
    console.log(`🔢 Total verified brands: ${totalVerifiedBrands}`);
    console.log(`🎯 Sectors fully integrated: ${keyVerificationSectors.length - sectorsWithMissingData.length}/${keyVerificationSectors.length}`);
    
    if (sectorsWithMissingData.length > 0) {
      console.log(`\n⚠️  SECTORS REQUIRING ADDITIONAL INTEGRATION:`);
      console.log(`============================================`);
      
      let totalMissingBrands = 0;
      for (const missing of sectorsWithMissingData) {
        console.log(`   - ${missing.sector}: Missing ${missing.gap} brands (${missing.current}/${missing.expected})`);
        totalMissingBrands += missing.gap;
      }
      
      console.log(`\n🚨 TOTAL MISSING BRANDS: ${totalMissingBrands}`);
      console.log(`🔧 ACTION REQUIRED: Complete integration needed for full comprehensive data coverage`);
      
      return {
        totalBrands: allBrands.length,
        verifiedBrands: totalVerifiedBrands,
        missingBrands: totalMissingBrands,
        sectorsNeedingIntegration: sectorsWithMissingData.length,
        integrationComplete: false
      };
    } else {
      console.log(`\n🎉 ALL SECTORS FULLY INTEGRATED!`);
      console.log(`✨ Complete brand and subnode coverage achieved`);
      
      return {
        totalBrands: allBrands.length,
        verifiedBrands: totalVerifiedBrands,
        missingBrands: 0,
        sectorsNeedingIntegration: 0,
        integrationComplete: true
      };
    }
    
  } catch (error) {
    console.error('💥 Brand integration verification failed:', error);
    throw error;
  }
}

// Execute verification
verifyCompleteBrandIntegration()
  .then((result) => {
    console.log('\n🔍 Brand integration verification completed!', result);
    if (!result.integrationComplete) {
      console.log('🚨 INTEGRATION INCOMPLETE - Additional brand integration required');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Brand integration verification failed:', error);
    process.exit(1);
  });