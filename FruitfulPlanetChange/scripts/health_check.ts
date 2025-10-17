// scripts/health_check.ts
import { db } from '../server/db';

async function runHealthCheck() {
  try {
    const [sectors, brands, subnodes, systems] = await Promise.all([
      db.query.sectors.findMany(),
      db.query.brands.findMany(),
      db.query.brands.findMany({ where: (brands, { like }) => like(brands.name, '%Subnode%') }),
      db.query.systemStatus.findMany(),
    ]);

    console.log('✅ HEALTH CHECK PASSED');
    console.log('Sectors:', sectors.length);
    console.log('Brands:', brands.length);
    console.log('Subnodes:', subnodes.length);
    console.log('System Status Records:', systems.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ HEALTH CHECK FAILED');
    console.error(err);
    process.exit(1);
  }
}

runHealthCheck();