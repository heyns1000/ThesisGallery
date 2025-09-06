// Import script for FAA Global Industry Index brands
import fetch from 'node-fetch';

const faaGlobalBrands = [
  // Core FAA Brands (Heyns Schoeman Level - Atom-Level Verification)
  {
    name: "FAA™",
    category: "core",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 100,
    valuation: "R2.1B+"
  },
  {
    name: "FAA Compliance Systems™",
    category: "core",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 99,
    valuation: "R800M"
  },
  {
    name: "FAA Atom-Level Verification™",
    category: "core",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 100,
    valuation: "R1.2B"
  },
  {
    name: "FAA Cloud™",
    category: "technology",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 96,
    valuation: "R750M"
  },
  {
    name: "FAA AI™",
    category: "technology",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 95,
    valuation: "R850M"
  },
  {
    name: "FAA Commerce™",
    category: "ecommerce",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 97,
    valuation: "R1.1B"
  },
  {
    name: "Fruitful Global™",
    category: "ecommerce",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 100,
    valuation: "R2.5B"
  },
  {
    name: "FAA Index™",
    category: "fintech",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 98,
    valuation: "R950M"
  },
  {
    name: "FAA Pay™",
    category: "fintech",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 99,
    valuation: "R800M"
  },
  {
    name: "FAA AgriTech™",
    category: "agriculture",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 95,
    valuation: "R550M"
  },
  {
    name: "FAA AutoTech™",
    category: "automotive",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 94,
    valuation: "R750M"
  },
  {
    name: "FAA MedTech™",
    category: "healthcare",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 98,
    valuation: "R900M"
  },
  {
    name: "FAA FusionBeat™",
    category: "entertainment",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 96,
    valuation: "R750M"
  },
  {
    name: "FAA E-Store™",
    category: "ecommerce",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 97,
    valuation: "R1.2B"
  },
  {
    name: "FAA DataSecurity™",
    category: "technology",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 99,
    valuation: "R950M"
  },
  {
    name: "FAA Delyvr™",
    category: "delivery",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 98,
    valuation: "R1.5B"
  },
  {
    name: "Baobab Security Network™",
    category: "security",
    status: "protected",
    trademarkStatus: "registered",
    complianceScore: 100,
    valuation: "R1.8B"
  }
];

async function importBrands() {
  try {
    const response = await fetch('http://localhost:5000/api/brands/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brands: faaGlobalBrands })
    });
    
    const result = await response.json();
    console.log('✅ FAA Brand Import Result:', result.message);
    console.log('📊 Imported:', result.imported, 'of', result.total, 'brands');
    
    if (result.imported > 0) {
      console.log('🚀 Your authentic FAA Global Industry Index brands are now loaded!');
    }
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

importBrands();