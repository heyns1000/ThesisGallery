import { db } from "./db";
import { brands, sectors } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Complete comprehensive sector and brand data from user's global definitions file
const COMPREHENSIVE_SECTOR_BRAND_DATA = {
  banking: {
    name: "🏦 Banking & Finance",
    emoji: "🏦",
    coreBrands: ['FinGrid','TradeAmp','LoopPay','TaxNova','VaultMaster','Gridwise','CrateDance','CashGlyph','Foresync','OmniRank','ZenoBank','CruxSpend','PulseHive','WireVault','BitTrust','MeshCredit','NovaScore','ZentryPay','FlowDrift','AlphaClearing','LumenBank','DeltaCustody','FractalFund','TorusFinance','VectorMint','RapidTally','FathomBank','KiteYield','BondRhythm','EchoTrust','QuantArk','NodeCapital','VeritasPay','TrustCage','CoreLedge','SkyFin','MintFuse','OrbitBank','HashVault','MicroDelta','AnchorPrime','FleetGrid','ZoomLedge','BeaconBank','CrateTeller','NumenYield','SparkScore','MetaBank','AetherTrust','TrueCustody','NeutronMint','SiloCash','JetReconcile','PulseClearing','SyncTeller','TangentBank','NovaLedger','GlideBank','TraceFin','RootBank','BankSingularity','PillarTrust','AxonFin','MonetGrid','LayerBank','VergePay','StackCash','CrownBank','PrismScore','HaloMint','CentraClear','TrustForge','OmniBank','NanoPay','LatticeScore','NobleCredit','ChainBank','PulseMint','BridgeLedger','ChronoBank','UnityFin','GridTrust','SparkVault','LucidBank','RiverMint','FlightClearing','NetTeller','PeakCustody','FlarePay','DarkBank','OriginTrust','ShardLedger','IndexPay','AltimeterFin','EchoClearing','FrameCustody','ZenithGrid','AtomScore','CoreMeta','CruxFin','PulseMatrix','BalanceGrid','GoldMint','ClearStack','QuantumBank','ScriptScore','SyncVault','FolioTrust','HyperFin','ToneLedger','IndexGrid','LineBank','CoreAlpha','LogicPay','NodeYield','RatioMint','LockLedger','PrimeGrid','TrustAmp','FundLattice','CreditHelix','AuraVault','DataBank','RingMint','GlyphTrust','NebulaBank','ZenScore','LoopTrust','AxialFin','OmniLoop','AlphaPulse','NexusBank','VaultHelix','ScriptTeller','TallyCore','FuseMint'],
    subNodeArrays: [['Ledger Mesh','Arbitrage Core','Token Router','Tax Engine','Vault Lock'],['Zeno Mesh','Crux Bridge','Hive Monitor','Wire Reconciler','Bit Locker'],['Lumen Pulse','Delta Secure','Fractal Trace','Torus Signal','Mint Bridge'],['Ark Model','Node Gate','Veritas Sync','Cage Mapper','Core Trace'],['Anchor Lock','Fleet Sync','Zoom Channel','Beacon Path','Crate Vault']]
  },
  agriculture: {
    name: "🌱 Agriculture & Biotech",
    emoji: "🌱",
    coreBrands: ['CropLink','SoilPulse','RootYield','AquaFarm','AgriMesh','GrowNode','GrainCast','SoilBank','CropID','AgriVault','PulseHarvest','MarketSoil','DroneFarm','RuralOps','SeedGrid','FarmChain','AgriScore','SoilNet','CropDoc','TerraVault','AgriID','SproutFlow','GrainSafe','FieldSync','AgriDepot','DroneCrop','CropTrace','PulseSoil','SeedRoot','RuralFlow','MarketGrow','AgriRank','SoilLogic','AgriSync','NutrientGrid','FieldCast','CropSource','YieldStack','FarmPulse','SoilTech','GreenTrace','CropVault','AgriCast','TerraPulse','SoilTrace','PulseAg','GrowVault','FieldNet','DroneSoil','SoilGrid','HarvestLoop','RuralMesh','FarmFlag','AgriFlow','SoilVault','FieldProof','DroneTrace','MarketRoots','NutrientPath','CropPulse','AgriPulse','EcoSeed','AgriMetrics','DroneGrid','GreenNode','RootVault','FieldToken','AgriPlan','SoilYield','SeedVault','MarketLink','CropFlow','RuralCast','AgriSyncPro','SoilLine','EcoAgri','HarvestNode','TerraSoil','CropMesh','AgriSignal','RuralVault','PulseGrow','MarketSoilX','AgriOmni'],
    subNodeArrays: [['CropLink ID™', 'CropLink Vault™', 'CropLink Field™', 'CropLink Yield™'],['SoilPulse Trace™', 'SoilPulse Data™', 'SoilPulse Alert™'],['RootYield Base™', 'RootYield Chain™', 'RootYield X™'],['AquaFarm Sync™', 'AquaFarm Logi™', 'AquaFarm Vault™'],['AgriMesh Route™', 'AgriMesh Pulse™', 'AgriMesh View™']]
  },
  fsf: {
    name: "🥦 Food, Soil & Farming",
    emoji: "🥦",
    coreBrands: ['AgriCore', 'SoilHealth', 'FarmFresh', 'CropCircle', 'HarvestHub', 'TerraNova', 'GreenSprout', 'AgroLife','BioFarm', 'EcoHarvest', 'SeedLink', 'SoilSmart', 'FarmWise', 'CropGuard', 'HarvestEase', 'TerraGrow','GreenField', 'AgroTech', 'BioYield', 'EcoFarm', 'AgriPulse', 'BioCrop', 'FarmLink', 'SoilGuard', 'GreenHarvest','TerraFarm', 'SeedSmart', 'CropCare', 'HarvestPro', 'SoilSense', 'FarmVision', 'AgroTech', 'BioSoil','CropTrack', 'HarvestLink', 'SoilLab'],
    subNodeArrays: [['SoilSync','CropTrack','FarmLink','HarvestNet'],['BioBoost','NutrientFlow','EarthGuard','RootMax'],['OrganicGrow','PureHarvest','GreenCycle','EcoFarm'],['YieldMap','PlantPulse','GrowthScan','FieldSense'],['GrainGate','ProducePath','MarketLink','FarmFlow']]
  },
  creative: {
    name: "🖋️ Creative Tech",
    emoji: "🖋️",
    coreBrands: ['MediaGrid', 'StudioPath', 'SoundReel', 'EditFrame', 'MotionKit','GhostTrace', 'TalentMap', 'SignalVerse', 'ScrollPlay', 'FXStream'],
    subNodeArrays: [['SceneLink™', 'FXLayer™', 'ClipVault™'],['StudioSync™', 'StagePulse™', 'RenderMesh™'],['AudioTrace™', 'VoiceVault™', 'WaveLoop™'],['CutChain™', 'TimelineScroll™', 'FXSnap™'],['VectorNode™', 'AnimCast™', 'ScrollFX™']]
  },
  logistics: {
    name: "📦 Logistics & Packaging",
    emoji: "📦",
    coreBrands: ['CrateLogic', 'PackChain', 'SortFleet', 'RouteMesh', 'LogiStack', 'DeliveryX', 'CargoVault', 'PalletPath', 'LabelFlow', 'DropLoop','ScrollRoute', 'ShipLedger', 'FreightCore', 'PackSphere', 'GridDrop', 'AutoTrack', 'ChainWrap', 'BinLogicX', 'PouchNode', 'ColdFleet','TrackStack', 'NodeRoute', 'PackOS', 'ZipCrate', 'TagLogic', 'ScrollTruck', 'FlowVault', 'SortStack', 'DockGrid', 'RollFleet','VendSort', 'GridCrate', 'LogiLift', 'CrateX', 'QuickLabel', 'DropLedger', 'FleetTrace', 'BoxSync', 'ChainGate', 'ColdRoute','PalletCore', 'FreightLine', 'PackSignal', 'ChainVault', 'CrateThread', 'ForkYield', 'DockLogic', 'LoadCast', 'TrayTrack', 'ScrollDrop'],
    subNodeArrays: [['BoxNode™', 'CrateMap™', 'PackSync™', 'CrateSync™'],['VendorPack™', 'LabelTrace™', 'ShipGrid™', 'ScrollWrap™'],['SortPulse™', 'BinLogic™', 'FleetTrack™', 'ScrollSort™'],['NodeMap™', 'GeoSignal™', 'DropLink™', 'RouteFlow™'],['ScrollStack™', 'YieldSync™', 'PayoutRoute™', 'StackNode™']]
  }
};

async function syncComprehensiveBrandData() {
  console.log("🔄 Starting comprehensive brand data synchronization...");
  
  try {
    let totalCoreAdded = 0;
    let totalSubnodesAdded = 0;
    
    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_SECTOR_BRAND_DATA)) {
      console.log(`\n📂 Processing sector: ${sectorData.name}`);
      
      // Get sector from database
      const sector = await db
        .select()
        .from(sectors)
        .where(eq(sectors.name, sectorData.name))
        .limit(1);
      
      if (sector.length === 0) {
        console.log(`❌ Sector ${sectorData.name} not found in database`);
        continue;
      }
      
      const sectorId = sector[0].id;
      console.log(`✅ Found sector ${sectorData.name} with ID: ${sectorId}`);
      
      // Check existing brands for this sector
      const existingBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.sectorId, sectorId));
      
      console.log(`📊 Existing brands in ${sectorData.name}: ${existingBrands.length}`);
      
      // Add core brands
      const coreBrands = sectorData.coreBrands;
      let coreAdded = 0;
      
      for (let i = 0; i < coreBrands.length; i++) {
        const brandName = coreBrands[i];
        
        // Check if brand already exists
        const existingBrand = existingBrands.find(b => b.name === brandName);
        if (existingBrand) {
          console.log(`⏭️  Core brand ${brandName} already exists`);
          continue;
        }
        
        // Add core brand
        await db.insert(brands).values({
          name: brandName,
          description: `Advanced ${brandName} ${sectorKey} solution with comprehensive VaultMesh™ integration for the Fruitful Global ecosystem.`,
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
        
        console.log(`✅ Added core brand ${brandName} to ${sectorData.name}`);
      }
      
      console.log(`📈 Added ${coreAdded} core brands to ${sectorData.name}`);
      
      // Now add subnodes for this sector's core brands
      if (sectorData.subNodeArrays && sectorData.subNodeArrays.length > 0) {
        const coreParentBrands = await db
          .select()
          .from(brands)
          .where(and(
            eq(brands.sectorId, sectorId),
            eq(brands.isCore, true)
          ));
        
        let subnodesAdded = 0;
        
        // Add subnodes for each core brand
        for (let parentIdx = 0; parentIdx < Math.min(coreParentBrands.length, sectorData.subNodeArrays.length); parentIdx++) {
          const parentBrand = coreParentBrands[parentIdx];
          const subnodeArray = sectorData.subNodeArrays[parentIdx];
          
          if (!subnodeArray || subnodeArray.length === 0) continue;
          
          for (const subnodeName of subnodeArray) {
            // Check if subnode already exists
            const existingSubnode = existingBrands.find(b => b.name === subnodeName && b.parentId === parentBrand.id);
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
        
        console.log(`🔗 Added ${subnodesAdded} subnodes to ${sectorData.name}`);
      }
    }
    
    console.log(`\n🎉 Comprehensive brand synchronization completed!`);
    console.log(`📊 Total core brands added: ${totalCoreAdded}`);
    console.log(`🔗 Total subnodes added: ${totalSubnodesAdded}`);
    console.log(`📈 Grand total: ${totalCoreAdded + totalSubnodesAdded} brand elements integrated`);
    
    return {
      success: true,
      totalCoreAdded,
      totalSubnodesAdded,
      totalAdded: totalCoreAdded + totalSubnodesAdded,
      sectorsProcessed: Object.keys(COMPREHENSIVE_SECTOR_BRAND_DATA).length,
      message: `Successfully synchronized ${totalCoreAdded + totalSubnodesAdded} brand elements across ${Object.keys(COMPREHENSIVE_SECTOR_BRAND_DATA).length} sectors`
    };
    
  } catch (error: any) {
    console.error("❌ Error during comprehensive brand synchronization:", error);
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

// Export the comprehensive sync function for use in routes
export { syncComprehensiveBrandData, COMPREHENSIVE_SECTOR_BRAND_DATA };