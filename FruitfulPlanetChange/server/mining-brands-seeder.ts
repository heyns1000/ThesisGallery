import { db } from "./db";
import { brands } from "@shared/schema";
import { desc } from "drizzle-orm";

// Complete mining brands and subnodes extracted from the HTML file
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

export async function seedAllMiningBrands() {
  console.log("⛏️ Seeding ALL 30 mining brands with complete subnodes...");
  
  const miningSectorId = 297;
  const miningBrandsToInsert = [];
  
  // Get the highest existing brand ID to avoid conflicts
  const existingBrands = await db.select().from(brands).orderBy(desc(brands.id)).limit(1);
  let brandId = (existingBrands.length > 0 ? existingBrands[0].id : 2669) + 1;

  // Create all 30 parent mining brands
  for (let i = 0; i < miningBrandsRaw.length; i++) {
    const brandName = miningBrandsRaw[i];
    const subnodes = miningSubNodesRaw[i] || [];
    
    // Insert parent brand
    miningBrandsToInsert.push({
      id: brandId,
      name: `${brandName}™`,
      description: `Advanced ${brandName}™ mining & resources management solution with comprehensive VaultMesh™ integration, real-time ore tracking, and Baobab legal compliance for secure mining operations across the Fruitful Global ecosystem.`,
      sectorId: miningSectorId,
      integration: "VaultMesh™",
      status: "active",
      isCore: true,
      parentId: null,
      metadata: {
        sector: "mining",
        featured: true,
        totalProjects: Math.floor(Math.random() * 50) + 20,
        activeRigs: Math.floor(Math.random() * 20) + 5,
        monthlyYield: Math.floor(Math.random() * 1000) + 500,
        subnodeCount: subnodes.length
      }
    });

    brandId++;

    // Insert subnodes for this brand
    for (let j = 0; j < subnodes.length; j++) {
      const subnode = subnodes[j];
      miningBrandsToInsert.push({
        id: brandId,
        name: `${subnode}™`,
        description: `Specialized ${subnode}™ submodule providing targeted mining operations support with advanced analytics, real-time monitoring, and seamless integration with ${brandName}™ parent system.`,
        sectorId: miningSectorId,
        integration: "VaultMesh™",
        status: "active",
        isCore: false,
        parentId: brandId - 1, // Reference to parent brand
        metadata: {
          sector: "mining",
          parentBrand: brandName,
          submodule: true,
          operationalStatus: "active",
          performance: Math.floor(Math.random() * 100) + 85
        }
      });
      brandId++;
    }
  }

  // Batch insert all mining brands
  for (const brand of miningBrandsToInsert) {
    await db.insert(brands).values(brand);
  }

  console.log(`✅ Successfully seeded ${miningBrandsToInsert.length} total mining brands and subnodes!`);
  console.log(`📊 Parent brands: ${miningBrandsRaw.length}`);
  console.log(`📊 Total subnodes: ${miningBrandsToInsert.length - miningBrandsRaw.length}`);
  
  return miningBrandsToInsert;
}