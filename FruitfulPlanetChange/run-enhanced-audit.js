
#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🔐 ENHANCED TRIPLE-SOURCE AUDIT SYSTEM');
console.log('=====================================');
console.log('🏛️  Source A: Treaty Flame Frontend Analysis');
console.log('🌐 Source B: Fruitful Backend PostgreSQL Analysis');
console.log('🐍 Source C: Python Dashboard HTML/Asset Analysis');
console.log('');
console.log('⚠️  SYNC LOCK ACTIVE - Verifying all sources...\n');

// Execute the enhanced audit
const auditPath = path.join(__dirname, 'server', 'enhanced-triple-source-audit.ts');
const command = `npx tsx ${auditPath}`;

exec(command, (error, stdout, stderr) => {
  if (stdout) {
    console.log(stdout);
  }
  
  if (stderr) {
    console.error('Stderr:', stderr);
  }
  
  if (error) {
    console.error('❌ Audit execution failed:', error.message);
    console.log('\n🔐 SYNC LOCK MAINTAINED - Audit failed to complete');
    process.exit(1);
  } else {
    console.log('\n✅ Enhanced audit execution completed');
    process.exit(0);
  }
});
