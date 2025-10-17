import { db } from "./db";
import { brands, sectors } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Extract and parse the complete sector brand data from the uploaded comprehensive file
async function extractComprehensiveBrandData() {
  const fs = await import('fs');
  const path = await import('path');
  
  try {
    const filePath = path.join(process.cwd(), 'attached_assets', 'Pasted--Global-Data-Definitions-const-sectorList-agriculture-Agric-1753254259598_1753254259600.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    console.log("📁 Extracting comprehensive brand data from uploaded file...");
    
    // Parse the JavaScript object from the file content
    const match = fileContent.match(/const\s+sectorList\s*=\s*(\{[\s\S]*\});?\s*$/m);
    if (!match) {
      throw new Error("Could not find sectorList object in file");
    }
    
    const sectorListStr = match[1];
    
    // Parse the comprehensive data structure from the file
    const lines = fileContent.split('\n');
    const sectors: any = {};
    
    // Extract sector mappings
    const sectorMappings: any = {};
    let inSectorList = false;
    
    for (const line of lines) {
      if (line.includes('const sectorList = {')) {
        inSectorList = true;
        continue;
      }
      if (inSectorList && line.includes('};')) {
        inSectorList = false;
        continue;
      }
      if (inSectorList && line.includes(':')) {
        const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
        if (match) {
          sectorMappings[match[1]] = match[2];
        }
      }
    }
    
    // Extract brand arrays and subnodes
    const brandArrayMatches = fileContent.match(/const\s+(\w+)Brands\s*=\s*\[(.*?)\];/gs);
    const subNodeMatches = fileContent.match(/const\s+(\w+)SubNodes\s*=\s*\[(.*?)\];/gs);
    
    if (brandArrayMatches) {
      for (const match of brandArrayMatches) {
        const nameMatch = match.match(/const\s+(\w+)Brands/);
        if (nameMatch) {
          const sectorKey = nameMatch[1];
          const sectorName = sectorMappings[sectorKey] || sectorKey;
          
          // Extract brand names
          const brandMatch = match.match(/\[(.*?)\]/s);
          if (brandMatch) {
            const brandNames = brandMatch[1]
              .split(',')
              .map(b => b.trim().replace(/['"]/g, ''))
              .filter(b => b.length > 0);
            
            sectors[sectorKey] = {
              name: sectorName,
              coreBrands: brandNames,
              subNodeArrays: []
            };
          }
        }
      }
    }
    
    // Add subnodes
    if (subNodeMatches) {
      for (const match of subNodeMatches) {
        const nameMatch = match.match(/const\s+(\w+)SubNodes/);
        if (nameMatch) {
          const sectorKey = nameMatch[1];
          if (sectors[sectorKey]) {
            const subNodeContent = match.match(/\[(.*?)\]/s);
            if (subNodeContent) {
              // Parse nested arrays
              const subArrays = subNodeContent[1]
                .split(/\],\s*\[/)
                .map(arr => arr.replace(/[\[\]]/g, ''))
                .map(arr => arr.split(',').map(s => s.trim().replace(/['"]/g, '')).filter(s => s.length > 0))
                .filter(arr => arr.length > 0);
              
              sectors[sectorKey].subNodeArrays = subArrays;
            }
          }
        }
      }
    }
    
    console.log(`📊 Found ${Object.keys(sectors).length} sectors in comprehensive data`);
    
    return sectors;
    
  } catch (error) {
    console.error("❌ Error extracting brand data:", error);
    return null;
  }
}

async function syncAllComprehensiveBrands() {
  console.log("🚀 Starting COMPLETE comprehensive brand data synchronization...");
  
  try {
    // Extract the comprehensive brand data
    const comprehensiveData = await extractComprehensiveBrandData();
    if (!comprehensiveData) {
      throw new Error("Failed to extract comprehensive brand data");
    }
    
    let totalCoreAdded = 0;
    let totalSubnodesAdded = 0;
    let sectorsProcessed = 0;
    
    for (const [sectorKey, sectorData] of Object.entries(comprehensiveData)) {
      if (!sectorData || typeof sectorData !== 'object') continue;
      
      console.log(`\n📂 Processing sector: ${sectorKey}`);
      
      // Find matching sector in database by key or similar name
      const possibleNames = [
        sectorData.name,
        sectorKey,
        sectorKey.charAt(0).toUpperCase() + sectorKey.slice(1),
        `🌱 ${sectorKey}`,
        `🏦 ${sectorKey}`,
        `📦 ${sectorKey}`,
        `🖋️ ${sectorKey}`,
        `⛏️ ${sectorKey}`,
        `🥦 ${sectorKey}`
      ];
      
      let sector = null;
      for (const name of possibleNames) {
        const result = await db
          .select()
          .from(sectors)
          .where(eq(sectors.name, name))
          .limit(1);
        
        if (result.length > 0) {
          sector = result[0];
          break;
        }
      }
      
      // If no sector found, create it
      if (!sector) {
        const newSector = await db.insert(sectors).values({
          name: sectorData.name || sectorKey,
          emoji: sectorData.emoji || "🔧",
          description: `${sectorData.name || sectorKey} solutions and infrastructure`,
          price: "79.99",
          currency: "USD",
          metadata: {
            tier: "Standard",
            priceUpdated: new Date().toISOString()
          }
        }).returning();
        
        sector = newSector[0];
        console.log(`✅ Created new sector: ${sector.name}`);
      }
      
      const sectorId = sector.id;
      console.log(`✅ Found/Created sector ${sector.name} with ID: ${sectorId}`);
      
      // Get existing brands for this sector
      const existingBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.sectorId, sectorId));
      
      console.log(`📊 Existing brands in ${sector.name}: ${existingBrands.length}`);
      
      // Process core brands
      const coreBrands = sectorData.coreBrands || sectorData.brands || [];
      let coreAdded = 0;
      
      if (Array.isArray(coreBrands) && coreBrands.length > 0) {
        console.log(`📦 Processing ${coreBrands.length} core brands for ${sector.name}`);
        
        for (const brandName of coreBrands) {
          if (!brandName || typeof brandName !== 'string') continue;
          
          // Check if brand already exists
          const existingBrand = existingBrands.find(b => b.name === brandName);
          if (existingBrand) {
            continue;
          }
          
          // Add core brand
          await db.insert(brands).values({
            name: brandName,
            description: `Advanced ${brandName} solution with comprehensive VaultMesh™ integration for the Fruitful Global ${sectorKey} ecosystem.`,
            sectorId: sectorId,
            integration: "VaultMesh™",
            status: "active",
            isCore: true,
            parentId: null,
            metadata: {
              sector: sectorKey,
              tier: "enterprise",
              featured: true,
              pricing: {
                monthly: 299.99,
                annual: 2999.99,
                currency: "USD"
              }
            }
          });
          
          coreAdded++;
          totalCoreAdded++;
        }
        
        console.log(`✅ Added ${coreAdded} core brands to ${sector.name}`);
      }
      
      // Process subnodes
      const subNodeArrays = sectorData.subNodeArrays || sectorData.subnodes || [];
      let subnodesAdded = 0;
      
      if (Array.isArray(subNodeArrays) && subNodeArrays.length > 0) {
        console.log(`🔗 Processing subnodes for ${sector.name}`);
        
        // Get the core parent brands we just added/exist
        const coreParentBrands = await db
          .select()
          .from(brands)
          .where(and(
            eq(brands.sectorId, sectorId),
            eq(brands.isCore, true)
          ));
        
        // Add subnodes for each parent brand
        for (let parentIdx = 0; parentIdx < Math.min(coreParentBrands.length, subNodeArrays.length); parentIdx++) {
          const parentBrand = coreParentBrands[parentIdx];
          const subnodeArray = subNodeArrays[parentIdx];
          
          if (!Array.isArray(subnodeArray) || subnodeArray.length === 0) continue;
          
          for (const subnodeName of subnodeArray) {
            if (!subnodeName || typeof subnodeName !== 'string') continue;
            
            // Check if subnode already exists
            const existingSubnode = existingBrands.find(b => 
              b.name === subnodeName && b.parentId === parentBrand.id
            );
            if (existingSubnode) {
              continue;
            }
            
            // Add subnode
            await db.insert(brands).values({
              name: subnodeName,
              description: `Enhanced ${subnodeName} subnode component with integrated VaultMesh™ functionality for comprehensive ${sectorKey} ecosystem operations.`,
              sectorId: sectorId,
              integration: "VaultMesh™",
              status: "active",
              isCore: false,
              parentId: parentBrand.id,
              metadata: {
                sector: sectorKey,
                tier: "premium",
                subnode: true,
                parentBrand: parentBrand.name,
                pricing: {
                  monthly: 99.99,
                  annual: 999.99,
                  currency: "USD"
                }
              }
            });
            
            subnodesAdded++;
            totalSubnodesAdded++;
          }
        }
        
        console.log(`🔗 Added ${subnodesAdded} subnodes to ${sector.name}`);
      }
      
      sectorsProcessed++;
    }
    
    console.log(`\n🎉 COMPLETE comprehensive brand synchronization finished!`);
    console.log(`📊 Total core brands added: ${totalCoreAdded}`);
    console.log(`🔗 Total subnodes added: ${totalSubnodesAdded}`);
    console.log(`📈 Grand total: ${totalCoreAdded + totalSubnodesAdded} brand elements integrated`);
    console.log(`🏭 Sectors processed: ${sectorsProcessed}`);
    
    return {
      success: true,
      totalCoreAdded,
      totalSubnodesAdded,
      totalAdded: totalCoreAdded + totalSubnodesAdded,
      sectorsProcessed,
      message: `Successfully synchronized ${totalCoreAdded + totalSubnodesAdded} brand elements across ${sectorsProcessed} sectors from comprehensive data file`
    };
    
  } catch (error: any) {
    console.error("❌ Error during complete comprehensive brand synchronization:", error);
    return {
      success: false,
      error: error.message,
      totalCoreAdded: 0,
      totalSubnodesAdded: 0,
      totalAdded: 0,
      sectorsProcessed: 0
    };
  }
}

// Export the complete sync function
export { syncAllComprehensiveBrands };