import { db } from "./db";
import { sectors, brands, type InsertBrand } from "@shared/schema";
import { eq } from "drizzle-orm";

// Complete MineNest™ mining brands from HTML file (30 parent brands + 120 subnodes)
const miningBrandsRaw = [
  'MineNest', 'DrillCoreX', 'OreSync', 'VaultRock', 'ClaimMine',
  'TrackShaft', 'PulseMine', 'CoreBeam', 'DigEcho', 'RockPath',
  'YieldDrill', 'MineProof', 'OreLine', 'DrillLink', 'VaultTunnel',
  'GeoGrid', 'SeamSync', 'ClaimOre', 'PulseBlast', 'OreEcho',
  'DeepCrate', 'RockLogic', 'CoreDrill', 'MineCast', 'DrillMark',
  'SignalOre', 'YieldTrack', 'VaultSeam', 'ShaftDrop', 'GeoNode'
];

const miningSubNodesRaw = [
  ['NestTrack', 'VaultShaft', 'QRMine', 'ClaimGrid'],
  ['CoreDrop', 'PulsePath', 'OreTrace', 'DrillYield'],
  ['SyncRock', 'VaultEcho', 'QRDrill', 'ClaimTag'],
  ['RockBeam', 'MineLoop', 'SignalTrace', 'QRClaim'],
  ['ClaimOre', 'VaultPath', 'OrePing', 'MineSignal'],
  ['ShaftMesh', 'DropMine', 'TrackSeam', 'QRTrack'],
  ['PulseCrate', 'MineEcho', 'YieldDrill', 'GridTag'],
  ['BeamPath', 'ClaimRock', 'VaultLoop', 'SeamDrop'],
  ['EchoMine', 'RockPing', 'VaultTrace', 'ClaimBeam'],
  ['PathDrop', 'GridMine', 'QRNode', 'YieldOre'],
  ['DrillGrid', 'ClaimYield', 'SyncTunnel', 'OreEcho'],
  ['ProofMine', 'SeamCast', 'VaultGrid', 'DropCrate'],
  ['OreLineX', 'VaultDrill', 'MineForm', 'TagTrace'],
  ['LinkMine', 'PulseEcho', 'GridSeam', 'YieldCast'],
  ['TunnelSync', 'ClaimLoop', 'QRDrillX', 'OreBeam'],
  ['GridGeo', 'VaultMap', 'RockForm', 'ClaimTunnel'],
  ['SeamSyncX', 'OreDrop', 'QRMineX', 'DrillMark'],
  ['ClaimOreX', 'TrackGrid', 'VaultDrop', 'PingEcho'],
  ['BlastMine', 'PulsePing', 'QRPath', 'SeamMark'],
  ['EchoRock', 'YieldTrack', 'VaultBeam', 'ClaimSync'],
  ['CrateDrop', 'SyncClaim', 'DrillForm', 'TunnelMap'],
  ['RockLogicX', 'VaultOre', 'YieldLoop', 'PingDrill'],
  ['CoreMine', 'OreTag', 'VaultPing', 'GridTrack'],
  ['MineCastX', 'ClaimNest', 'QRTrace', 'YieldEcho'],
  ['DrillMarkX', 'OreSignal', 'VaultCrate', 'PingTag'],
  ['OreSignalX', 'GridEcho', 'ClaimDrop', 'TrackTunnel'],
  ['TrackYield', 'MineFrame', 'SignalGrid', 'EchoDrill'],
  ['VaultSeamX', 'QRClaimX', 'GridOre', 'TunnelEcho'],
  ['DropShaft', 'ClaimTunnelX', 'YieldDrillX', 'VaultGrid'],
  ['GeoNodeX', 'SignalPing', 'DropEcho', 'MineLink']
];

export async function seedMineNestComprehensive() {
  console.log("⛏️ Seeding comprehensive MineNest™ mining ecosystem from HTML data...");

  try {
    // Find the mining sector
    const miningSector = await db.select().from(sectors).where(eq(sectors.emoji, "⛏️"));
    
    if (!miningSector.length) {
      throw new Error("Mining sector not found in database");
    }

    const miningId = miningSector[0].id;
    console.log(`🎯 Found Mining sector ID: ${miningId}`);

    // Clear existing mining brands to avoid duplicates
    await db.delete(brands).where(eq(brands.sectorId, miningId));
    console.log("🧹 Cleared existing mining brands");

    let totalBrandsSeeded = 0;
    let totalSubnodesSeeded = 0;

    // Seed the 30 parent mining brands
    for (let i = 0; i < miningBrandsRaw.length; i++) {
      const brandName = miningBrandsRaw[i];
      const subnodes = miningSubNodesRaw[i] || [];

      // Create parent brand
      const brandData: InsertBrand = {
        name: `${brandName}™`,
        description: `Advanced ${brandName}™ mining & resources solution providing enterprise-grade ore extraction, tracking, and VaultMesh™ integration for secure mining operations across the Fruitful Global ecosystem.`,
        sectorId: miningId,
        status: i < 25 ? "active" : "development", // Most are active
        integration: i < 10 ? "VaultMesh™" : i < 20 ? "GridCore™" : "MineCore™",
        isCore: true,
        metadata: {
          tier: i < 5 ? "A+" : i < 15 ? "A" : "B+",
          category: "Core Mining",
          source: "HTML_MINENEST",
          pricing: "199.99",
          features: [`${brandName} Analytics`, `Real-time Ore Tracking`, `Baobab Legal Compliance`, `VaultMesh™ Security`],
          version: "3.2",
          deploymentDate: new Date().toISOString(),
          performance: Math.floor(Math.random() * 15) + 85, // 85-99%
          activeRigs: Math.floor(Math.random() * 20) + 5,
          monthlyYield: Math.floor(Math.random() * 1000) + 500,
          subnodeCount: subnodes.length,
          totalProjects: Math.floor(Math.random() * 50) + 20
        }
      };

      const [parentBrand] = await db.insert(brands).values(brandData).returning();
      totalBrandsSeeded++;

      // Create 4 subnodes for each parent brand
      for (let j = 0; j < subnodes.length; j++) {
        const subnodeName = subnodes[j];
        
        const subnodeData: InsertBrand = {
          name: `${subnodeName}™`,
          description: `${subnodeName}™ specialized mining component - ${j === 0 ? 'tracking' : j === 1 ? 'processing' : j === 2 ? 'quality control' : 'signal monitoring'} module for ${brandName}™ mining operations`,
          sectorId: miningId,
          parentId: parentBrand.id,
          status: "active",
          integration: "SubNode™",
          isCore: false,
          metadata: {
            tier: "Subnode",
            category: "Mining Component",
            source: "HTML_SUBNODE",
            parentName: `${brandName}™`,
            component: j === 0 ? 'Tracking' : j === 1 ? 'Processing' : j === 2 ? 'QC' : 'Monitoring',
            performance: Math.floor(Math.random() * 10) + 90, // 90-99%
            activeConnections: Math.floor(Math.random() * 50) + 10,
            dataVolume: `${Math.floor(Math.random() * 100) + 50}GB/day`
          }
        };

        await db.insert(brands).values(subnodeData);
        totalSubnodesSeeded++;
      }
    }

    console.log(`✅ MineNest™ comprehensive seeding completed!`);
    console.log(`📊 Total parent mining brands seeded: ${totalBrandsSeeded}`);
    console.log(`📊 Total mining subnodes seeded: ${totalSubnodesSeeded}`);
    console.log(`📊 Total mining ecosystem: ${totalBrandsSeeded + totalSubnodesSeeded} brands`);

    return {
      parentBrands: totalBrandsSeeded,
      subnodes: totalSubnodesSeeded,
      total: totalBrandsSeeded + totalSubnodesSeeded
    };

  } catch (error) {
    console.error("❌ Error seeding MineNest™ comprehensive data:", error);
    throw error;
  }
}