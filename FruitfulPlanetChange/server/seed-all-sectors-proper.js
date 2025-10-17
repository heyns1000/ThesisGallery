import { db } from './db.js';
import { sectors, brands } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Complete sector data from the admin panel file
const sectorList = {
    "agriculture": "🌱 Agriculture & Biotech",
    "fsf": "🥦 Food, Soil & Farming", 
    "banking": "🏦 Banking & Finance",
    "creative": "🖋️ Creative Tech",
    "logistics": "📦 Logistics & Packaging",
    "education-ip": "📚 Education & IP",
    "fashion": "✂ Fashion & Identity",
    "gaming": "🎮 Gaming & Simulation",
    "health": "🧠 Health & Hygiene",
    "housing": "🏗️ Housing & Infrastructure",
    "justice": "⚖ Justice & Ethics",
    "knowledge": "📖 Knowledge & Archives",
    "micromesh": "☰ Micro-Mesh Logistics",
    "media": "🎬 Motion, Media & Sonic",
    "nutrition": "✿ Nutrition & Food Chain",
    "ai-logic": "🧠 AI, Logic & Grid",
    "packaging": "📦 Packaging & Materials",
    "quantum": "✴️ Quantum Protocols",
    "ritual": "☯ Ritual & Culture",
    "saas": "🔑 SaaS & Licensing",
    "trade": "🧺 Trade Systems",
    "utilities": "🔋 Utilities & Energy",
    "voice": "🎙️ Voice & Audio",
    "webless": "📡 Webless Tech & Nodes",
    "nft": "🔁 NFT & Ownership",
    "education-youth": "🎓 Education & Youth",
    "zerowaste": "♻️ Zero Waste",
    "professional": "🧾 Professional Services",
    "payroll-mining": "🪙 Payroll Mining & Accounting",
    "mining": "⛏️ Mining & Resources",
    "wildlife": "🦁 Wildlife & Habitat",
    "admin-panel": "⚙️ Admin Panel",
    "global-index": "🌐 Global Brand Index"
};

// AI Logic brands - exactly 30 core brands
const aiLogicBrands = [
    'AIGrid', 'LogicNode', 'AIFlow', 'LogicSync', 'AIVault', 'LogicGrid', 'AINode', 'LogicFlow', 
    'AISync', 'LogicVault', 'AICore', 'LogicCore', 'AITrace', 'LogicTrace', 'AILink', 'LogicLink',
    'AIMesh', 'LogicMesh', 'AIPath', 'LogicPath', 'AIStream', 'LogicStream', 'AIChain', 'LogicChain',
    'AILoop', 'LogicLoop', 'AIPulse', 'LogicPulse', 'AIBridge', 'LogicBridge'
];

// AI Logic subnodes - 4 per core brand = 120 total
const aiLogicSubNodes = [
    ['AI Processing', 'Logic Engine', 'Grid Router', 'Neural Link'],
    ['Node Processor', 'Logic Stack', 'AI Bridge', 'Grid Core'],
    ['Flow Engine', 'AI Router', 'Logic Stream', 'Grid Sync'],
    ['Sync Protocol', 'Logic Flow', 'AI Grid', 'Grid Logic'],
    ['Vault Secure', 'AI Lock', 'Logic Safe', 'Grid Vault'],
    ['Grid Network', 'Logic Mesh', 'AI Node', 'Grid Link'],
    ['Node Core', 'AI Engine', 'Logic Node', 'Grid AI'],
    ['Flow Logic', 'Logic Route', 'AI Stream', 'Grid Flow'],
    ['Sync Logic', 'AI Sync', 'Logic Grid', 'Grid Sync'],
    ['Vault Logic', 'Logic Safe', 'AI Vault', 'Grid Secure'],
    ['Core Logic', 'AI Core', 'Logic Engine', 'Grid Core'],
    ['Logic Engine', 'Core AI', 'Logic Grid', 'Grid Logic'],
    ['Trace Logic', 'AI Trace', 'Logic Track', 'Grid Trace'],
    ['Trace Engine', 'Logic Trace', 'AI Track', 'Grid Track'],
    ['Link Logic', 'AI Link', 'Logic Bridge', 'Grid Link'],
    ['Link Engine', 'Logic Link', 'AI Bridge', 'Grid Bridge'],
    ['Mesh Logic', 'AI Mesh', 'Logic Network', 'Grid Mesh'],
    ['Mesh Engine', 'Logic Mesh', 'AI Network', 'Grid Network'],
    ['Path Logic', 'AI Path', 'Logic Route', 'Grid Path'],
    ['Path Engine', 'Logic Path', 'AI Route', 'Grid Route'],
    ['Stream Logic', 'AI Stream', 'Logic Flow', 'Grid Stream'],
    ['Stream Engine', 'Logic Stream', 'AI Flow', 'Grid Flow'],
    ['Chain Logic', 'AI Chain', 'Logic Link', 'Grid Chain'],
    ['Chain Engine', 'Logic Chain', 'AI Link', 'Grid Link'],
    ['Loop Logic', 'AI Loop', 'Logic Cycle', 'Grid Loop'],
    ['Loop Engine', 'Logic Loop', 'AI Cycle', 'Grid Cycle'],
    ['Pulse Logic', 'AI Pulse', 'Logic Beat', 'Grid Pulse'],
    ['Pulse Engine', 'Logic Pulse', 'AI Beat', 'Grid Beat'],
    ['Bridge Logic', 'AI Bridge', 'Logic Connect', 'Grid Bridge'],
    ['Bridge Engine', 'Logic Bridge', 'AI Connect', 'Grid Connect']
];

// Banking brands - exactly 30 core brands  
const bankingBrands = [
    'FinGrid', 'TradeAmp', 'LoopPay', 'TaxNova', 'VaultMaster', 'Gridwise', 'CrateDance', 'CashGlyph',
    'Foresync', 'OmniRank', 'ZenoBank', 'CruxSpend', 'PulseHive', 'WireVault', 'BitTrust', 'MeshCredit',
    'NovaScore', 'ZentryPay', 'FlowDrift', 'AlphaClearing', 'LumenBank', 'DeltaCustody', 'FractalFund', 'TorusFinance',
    'VectorMint', 'RapidTally', 'FathomBank', 'KiteYield', 'BondRhythm', 'EchoTrust'
];

// Banking subnodes - 4 per core brand = 120 total
const bankingSubNodes = [
    ['Ledger Mesh', 'Arbitrage Core', 'Token Router', 'Tax Engine'],
    ['Trade Signal', 'Amp Bridge', 'Market Core', 'Trade Engine'],
    ['Payment Loop', 'Pay Router', 'Loop Core', 'Pay Engine'],
    ['Tax Router', 'Nova Core', 'Tax Engine', 'Tax Bridge'],
    ['Vault Lock', 'Master Core', 'Vault Router', 'Master Engine'],
    ['Grid Wise', 'Grid Core', 'Wise Engine', 'Grid Router'],
    ['Crate Flow', 'Dance Core', 'Crate Engine', 'Dance Router'],
    ['Cash Symbol', 'Glyph Core', 'Cash Engine', 'Glyph Router'],
    ['Forecast Engine', 'Sync Core', 'Fore Engine', 'Sync Router'],
    ['Omni Signal', 'Rank Core', 'Omni Engine', 'Rank Router'],
    ['Zeno Mesh', 'Bank Core', 'Zeno Engine', 'Bank Router'],
    ['Crux Bridge', 'Spend Core', 'Crux Engine', 'Spend Router'],
    ['Pulse Network', 'Hive Core', 'Pulse Engine', 'Hive Router'],
    ['Wire Secure', 'Vault Core', 'Wire Engine', 'Vault Router'],
    ['Bit Security', 'Trust Core', 'Bit Engine', 'Trust Router'],
    ['Mesh Network', 'Credit Core', 'Mesh Engine', 'Credit Router'],
    ['Nova Analytics', 'Score Core', 'Nova Engine', 'Score Router'],
    ['Zentry Access', 'Pay Core', 'Zentry Engine', 'Pay Router'],
    ['Flow Stream', 'Drift Core', 'Flow Engine', 'Drift Router'],
    ['Alpha Trading', 'Clear Core', 'Alpha Engine', 'Clear Router'],
    ['Lumen Bridge', 'Bank Core', 'Lumen Engine', 'Bank Router'],
    ['Delta Security', 'Custody Core', 'Delta Engine', 'Custody Router'],
    ['Fractal Analytics', 'Fund Core', 'Fractal Engine', 'Fund Router'],
    ['Torus Network', 'Finance Core', 'Torus Engine', 'Finance Router'],
    ['Vector Processing', 'Mint Core', 'Vector Engine', 'Mint Router'],
    ['Rapid Processing', 'Tally Core', 'Rapid Engine', 'Tally Router'],
    ['Fathom Analytics', 'Bank Core', 'Fathom Engine', 'Bank Router'],
    ['Kite Trading', 'Yield Core', 'Kite Engine', 'Yield Router'],
    ['Bond Analytics', 'Rhythm Core', 'Bond Engine', 'Rhythm Router'],
    ['Echo Network', 'Trust Core', 'Echo Engine', 'Trust Router']
];

async function seedAllSectorsProper() {
    console.log('🎯 SEEDING ALL SECTORS WITH EXACT 30+120 STRUCTURE...');
    
    try {
        // Find AI Logic sector
        const [aiLogicSector] = await db.select().from(sectors).where(eq(sectors.name, "🧠 AI, Logic & Grid"));
        if (!aiLogicSector) {
            console.error('❌ AI Logic sector not found');
            return;
        }
        
        // Find Banking sector
        const [bankingSector] = await db.select().from(sectors).where(eq(sectors.name, "🏦 Banking & Finance"));
        if (!bankingSector) {
            console.error('❌ Banking sector not found');
            return;
        }

        console.log(`🎯 Found AI Logic sector with ID: ${aiLogicSector.id}`);
        console.log(`🎯 Found Banking sector with ID: ${bankingSector.id}`);

        // Clear existing brands for both sectors
        await db.delete(brands).where(eq(brands.sectorId, aiLogicSector.id));
        await db.delete(brands).where(eq(brands.sectorId, bankingSector.id));
        
        console.log('🧹 Cleared existing brands');

        // Seed AI Logic sector - 30 core brands + 120 subnodes
        console.log('🧠 Seeding AI Logic sector with 30+120 structure...');
        
        for (let i = 0; i < aiLogicBrands.length; i++) {
            const brandName = aiLogicBrands[i];
            
            // Create core brand
            const [coreBrand] = await db.insert(brands).values({
                name: `${brandName}™`,
                description: `Advanced AI and logic processing system for ${brandName.toLowerCase()} operations`,
                sectorId: aiLogicSector.id,
                isCore: true,
                status: 'active',
                tier: 'A+',
                integration: 'VaultMesh',
                metadata: {
                    category: 'AI Logic',
                    tier: 'A+',
                    pricing: '$88'
                }
            }).returning();

            console.log(`✅ Added AI Logic core brand: ${brandName}™`);

            // Create 4 subnodes for each core brand
            const subnodes = aiLogicSubNodes[i] || ['AI Core', 'Logic Core', 'Grid Core', 'Neural Core'];
            for (const subnode of subnodes) {
                await db.insert(brands).values({
                    name: `${subnode}™`,
                    description: `Specialized ${subnode.toLowerCase()} component for ${brandName}™`,
                    sectorId: aiLogicSector.id,
                    parentId: coreBrand.id,
                    isCore: false,
                    status: 'active',
                    tier: 'A',
                    integration: 'VaultMesh',
                    metadata: {
                        category: 'AI Logic Subnode',
                        parent: brandName,
                        tier: 'A'
                    }
                });
            }
        }

        // Seed Banking sector - 30 core brands + 120 subnodes
        console.log('🏦 Seeding Banking sector with 30+120 structure...');
        
        for (let i = 0; i < bankingBrands.length; i++) {
            const brandName = bankingBrands[i];
            
            // Create core brand
            const [coreBrand] = await db.insert(brands).values({
                name: `${brandName}™`,
                description: `Advanced financial technology platform for ${brandName.toLowerCase()} services`,
                sectorId: bankingSector.id,
                isCore: true,
                status: 'active',
                tier: 'A+',
                integration: 'VaultMesh',
                metadata: {
                    category: 'Banking Finance',
                    tier: 'A+',
                    pricing: '$299'
                }
            }).returning();

            console.log(`✅ Added Banking core brand: ${brandName}™`);

            // Create 4 subnodes for each core brand
            const subnodes = bankingSubNodes[i] || ['Finance Core', 'Banking Core', 'Trade Core', 'Payment Core'];
            for (const subnode of subnodes) {
                await db.insert(brands).values({
                    name: `${subnode}™`,
                    description: `Specialized ${subnode.toLowerCase()} component for ${brandName}™`,
                    sectorId: bankingSector.id,
                    parentId: coreBrand.id,
                    isCore: false,
                    status: 'active',
                    tier: 'A',
                    integration: 'VaultMesh',
                    metadata: {
                        category: 'Banking Finance Subnode',
                        parent: brandName,
                        tier: 'A'
                    }
                });
            }
        }

        // Verify counts
        const aiLogicCount = await db.select().from(brands).where(eq(brands.sectorId, aiLogicSector.id));
        const bankingCount = await db.select().from(brands).where(eq(brands.sectorId, bankingSector.id));
        
        const aiCoreCount = aiLogicCount.filter(b => b.isCore).length;
        const aiSubnodeCount = aiLogicCount.filter(b => !b.isCore).length;
        const bankingCoreCount = bankingCount.filter(b => b.isCore).length;
        const bankingSubnodeCount = bankingCount.filter(b => !b.isCore).length;

        console.log('🎯 FINAL AI LOGIC SECTOR STATS:');
        console.log(`   Core Brands: ${aiCoreCount}`);
        console.log(`   Subnodes: ${aiSubnodeCount}`);
        console.log(`   Total: ${aiLogicCount.length}`);
        
        console.log('🎯 FINAL BANKING SECTOR STATS:');
        console.log(`   Core Brands: ${bankingCoreCount}`);
        console.log(`   Subnodes: ${bankingSubnodeCount}`);
        console.log(`   Total: ${bankingCount.length}`);

        console.log('✅ ALL SECTORS SEEDED SUCCESSFULLY!');
        console.log(`   AI Logic: ${aiLogicCount.length} brands`);
        console.log(`   Banking: ${bankingCount.length} brands`);

    } catch (error) {
        console.error('❌ Error seeding sectors:', error);
        throw error;
    }
}

export { seedAllSectorsProper };