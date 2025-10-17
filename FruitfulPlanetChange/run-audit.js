
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 STARTING DEEP DATA INVENTORY AUDIT...');
console.log('⚠️  This is a READ-ONLY audit - no changes will be made\n');

try {
  execSync('npx tsx server/deep-data-inventory-audit.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('💥 Audit execution failed:', error.message);
  process.exit(1);
}
