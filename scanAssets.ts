#!/usr/bin/env tsx
/**
 * Asset Scanner CLI Tool
 * 
 * Scans the attached_assets directory and generates a comprehensive
 * manifest of all files including templates, images, archives, and documents.
 * 
 * Usage:
 *   npx tsx scanAssets.ts
 */

import { assetRegistry } from './server/assetRegistry';

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🔍 FruitfulPlanetChange Asset Scanner v1.0');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  
  try {
    console.log('📂 Scanning attached_assets directory...');
    console.log('   This may take a few minutes for 500+ files...');
    console.log('');
    
    // Generate manifest
    const startTime = Date.now();
    const manifest = await assetRegistry.generateManifest();
    const scanTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('');
    console.log('✅ Scan completed in ' + scanTime + 's');
    console.log('');
    
    // Save manifest to file
    await assetRegistry.saveManifest(manifest);
    
    // Display statistics
    console.log('═══════════════════════════════════════════════════════');
    console.log('  📊 Asset Statistics');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log(`   Total Files:      ${manifest.totalFiles}`);
    console.log(`   Total Size:       ${(manifest.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
    console.log('   Categories:');
    console.log(`     📄 Templates:   ${manifest.assets.templates.count} files (${(manifest.assets.templates.totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`     🖼️  Images:      ${manifest.assets.images.count} files (${(manifest.assets.images.totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`     📦 Archives:    ${manifest.assets.archives.count} files (${(manifest.assets.archives.totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`     📝 Documents:   ${manifest.assets.documents.count} files (${(manifest.assets.documents.totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`     📋 Other:       ${manifest.assets.other.count} files (${(manifest.assets.other.totalSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log('');
    console.log(`   Repositories:     ${manifest.repositories.length} embedded repos detected`);
    
    if (manifest.repositories.length > 0) {
      console.log('');
      console.log('   Detected Repositories:');
      manifest.repositories.forEach((repo, index) => {
        console.log(`     ${index + 1}. ${repo.name} (${repo.status})`);
      });
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  💾 Manifest Saved');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('   Location: shared/assetManifest.json');
    console.log('   Version:  ' + manifest.version);
    console.log('   Generated: ' + manifest.generatedAt.toISOString());
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✨ Next Steps');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('   1. Run database migration: npm run db:push');
    console.log('   2. Populate database: POST /api/assets/scan');
    console.log('   3. View manifest: GET /api/assets/manifest');
    console.log('   4. View stats: GET /api/assets/stats');
    console.log('');
    console.log('✅ Asset scan completed successfully!');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Error during asset scan:');
    console.error('');
    console.error(error);
    console.error('');
    process.exit(1);
  }
}

// Run the scanner
main();
