import { db } from "./db";
import { replitApps } from "@shared/schema";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";
import { nanoid } from "nanoid";

interface CSVRow {
  "App Name": string;
  "Creator Username": string;
  "Creator Email": string;
  "Last Updated": string;
  "App Code Privacy": string;
  "Deployment Status": string;
  "Deployment Privacy": string;
  "App ID": string;
}

function categorizeApp(appName: string): string | null {
  const name = appName.toLowerCase();
  
  // Real Estate & Property
  if (name.includes('real estate') || name.includes('property')) return 'real-estate';
  
  // AI & Technology
  if (name.includes('ai') || name.includes('gpt') || name.includes('intelligence')) return 'ai-technology';
  
  // Payroll & Finance
  if (name.includes('payroll') || name.includes('loop') || name.includes('payment')) return 'finance-payroll';
  
  // Security & Legal
  if (name.includes('security') || name.includes('nda') || name.includes('sign') || name.includes('vault')) return 'security-legal';
  
  // Communication & Messaging
  if (name.includes('connect') || name.includes('mesh') || name.includes('hub')) return 'communication';
  
  // Agriculture & Food
  if (name.includes('fruitful') || name.includes('agriculture') || name.includes('coffee') || name.includes('kitchen')) return 'agriculture-food';
  
  // Mining & Resources
  if (name.includes('mining') || name.includes('mineral')) return 'mining-resources';
  
  // Entertainment & Media
  if (name.includes('playlist') || name.includes('audio') || name.includes('game')) return 'entertainment-media';
  
  // Education & Training
  if (name.includes('university') || name.includes('education') || name.includes('training')) return 'education';
  
  // Development Tools
  if (name.includes('codenest') || name.includes('builder') || name.includes('backend')) return 'development-tools';
  
  // Healthcare
  if (name.includes('health')) return 'healthcare';
  
  // Municipal & Government
  if (name.includes('municipal')) return 'municipal-government';
  
  // Heritage & Culture
  if (name.includes('heritage') || name.includes('lesotho')) return 'heritage-culture';
  
  // General Business
  if (name.includes('proposal') || name.includes('roadmap') || name.includes('workspace')) return 'business-tools';
  
  return 'general';
}

async function seedReplitApps() {
  console.log("🚀 Starting Replit Apps seed process...");
  
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'attached_assets', 'Noodle Juice Gorilla Comb-apps-2025-10-17_1760706090771.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as CSVRow[];
    
    console.log(`📊 Found ${records.length} apps in CSV`);
    
    // Filter out completely empty rows (rows with no App Name)
    const validRecords = records.filter(row => row["App Name"] && row["App Name"].trim() !== '');
    
    console.log(`✅ Processing ${validRecords.length} valid apps`);
    
    // Track generated IDs
    let generatedIdCount = 0;
    
    // Prepare data for insertion
    const appsToInsert = validRecords.map(row => {
      const appName = row["App Name"].trim();
      
      // Generate nanoid if App ID is missing
      let appId = row["App ID"]?.trim();
      if (!appId || appId === '') {
        appId = nanoid();
        generatedIdCount++;
        console.log(`  ⚡ Generated ID for "${appName}": ${appId}`);
      }
      
      const category = categorizeApp(appName);
      const replitUrl = `https://replit.com/@${row["Creator Username"]}/${appId}`;
      
      return {
        id: appId,
        appName: appName,
        creatorUsername: row["Creator Username"].trim(),
        creatorEmail: row["Creator Email"].trim(),
        lastUpdated: new Date(row["Last Updated"]),
        appCodePrivacy: row["App Code Privacy"].trim(),
        deploymentStatus: row["Deployment Status"].trim(),
        deploymentPrivacy: row["Deployment Privacy"]?.trim() || null,
        replitUrl: replitUrl,
        category: category,
        isActive: true,
        metadata: {
          importedAt: new Date().toISOString(),
          source: 'csv-import',
          originalCsvRow: row,
          generatedId: !row["App ID"] || row["App ID"].trim() === ''
        }
      };
    });
    
    // Insert apps into database
    console.log("💾 Inserting apps into database...");
    
    for (const app of appsToInsert) {
      try {
        await db.insert(replitApps).values(app).onConflictDoNothing();
        console.log(`  ✓ Imported: ${app.appName} (${app.category})`);
      } catch (error) {
        console.error(`  ✗ Failed to import ${app.appName}:`, error);
      }
    }
    
    console.log("\n📈 Import Summary:");
    console.log(`  Total apps imported: ${appsToInsert.length}`);
    console.log(`  Apps with existing IDs: ${appsToInsert.length - generatedIdCount}`);
    console.log(`  Apps with generated IDs: ${generatedIdCount}`);
    
    // Category breakdown
    const categoryCount: Record<string, number> = {};
    appsToInsert.forEach(app => {
      const cat = app.category || 'uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    console.log("\n📊 Apps by Category:");
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });
    
    console.log("\n✅ Replit Apps seed completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding Replit Apps:", error);
    throw error;
  }
}

// Run if called directly (ES module compatible)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  seedReplitApps()
    .then(() => {
      console.log("✅ Seed script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seed script failed:", error);
      process.exit(1);
    });
}

export { seedReplitApps };
