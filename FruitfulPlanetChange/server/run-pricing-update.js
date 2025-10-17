import { updatePricingStructure } from './update-pricing-structure.js';

async function main() {
  try {
    await updatePricingStructure();
    console.log('✅ Pricing update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Pricing update failed:', error);
    process.exit(1);
  }
}

main();