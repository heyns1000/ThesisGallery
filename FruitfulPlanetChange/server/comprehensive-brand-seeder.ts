import { db } from "./db";
import { sectors, brands, type InsertBrand } from "@shared/schema";
import { eq } from "drizzle-orm";

// Comprehensive brand data from HTML file with complete sector coverage
const sectorBrandsData = {
  banking: {
    name: "🏦 Banking & Finance",
    brands: ['FinGrid','TradeAmp','LoopPay','TaxNova','VaultMaster','Gridwise','CrateDance','CashGlyph','Foresync','OmniRank','ZenoBank','CruxSpend','PulseHive','WireVault','BitTrust','MeshCredit','NovaScore','ZentryPay','FlowDrift','AlphaClearing','LumenBank','DeltaCustody','FractalFund','TorusFinance','VectorMint','RapidTally','FathomBank','KiteYield','BondRhythm','EchoTrust','QuantArk','NodeCapital','VeritasPay','TrustCage','CoreLedge','SkyFin','MintFuse','OrbitBank','HashVault','MicroDelta','AnchorPrime','FleetGrid','ZoomLedge','BeaconBank','CrateTeller','NumenYield','SparkScore','MetaBank','AetherTrust','TrueCustody','NeutronMint','SiloCash','JetReconcile','PulseClearing','SyncTeller','TangentBank','NovaLedger','GlideBank','TraceFin','RootBank','BankSingularity','PillarTrust','AxonFin','MonetGrid','LayerBank','VergePay','StackCash','CrownBank','PrismScore','HaloMint','CentraClear','TrustForge','OmniBank','NanoPay','LatticeScore','NobleCredit','ChainBank','PulseMint','BridgeLedger','ChronoBank','UnityFin','GridTrust','SparkVault','LucidBank','RiverMint','FlightClearing','NetTeller','PeakCustody','FlarePay','DarkBank','OriginTrust','ShardLedger','IndexPay','AltimeterFin','EchoClearing','FrameCustody','ZenithGrid','AtomScore','CoreMeta','CruxFin','PulseMatrix','BalanceGrid','GoldMint','ClearStack','QuantumBank','ScriptScore','SyncVault','FolioTrust','HyperFin','ToneLedger','IndexGrid','LineBank','CoreAlpha','LogicPay','NodeYield','RatioMint','LockLedger','PrimeGrid','TrustAmp','FundLattice','CreditHelix','AuraVault','DataBank','RingMint','GlyphTrust','NebulaBank','ZenScore','LoopTrust','AxialFin','OmniLoop','AlphaPulse','NexusBank','VaultHelix','ScriptTeller','TallyCore','FuseMint'],
    subnodes: [['Ledger Mesh','Arbitrage Core','Token Router','Tax Engine','Vault Lock','Compliance Matrix','Logistics Fin','Currency Glyph','Forecast Engine','Signal Tracker'],['Zeno Mesh','Crux Bridge','Hive Monitor','Wire Reconciler','Bit Locker','Credit Splice','Score Vector','Zentry Core','Drift Trace','Alpha Ledger']]
  },
  agriculture: {
    name: "🌱 Agriculture & Biotech", 
    brands: ['CropLink','SoilPulse','RootYield','AquaFarm','AgriMesh','GrowNode','GrainCast','SoilBank','CropID','AgriVault','PulseHarvest','MarketSoil','DroneFarm','RuralOps','SeedGrid','FarmChain','AgriScore','SoilNet','CropDoc','TerraVault','AgriID','SproutFlow','GrainSafe','FieldSync','AgriDepot','DroneCrop','CropTrace','PulseSoil','SeedRoot','RuralFlow','MarketGrow','AgriRank','SoilLogic','AgriSync','NutrientGrid','FieldCast','CropSource','YieldStack','FarmPulse','SoilTech','GreenTrace','CropVault','AgriCast','TerraPulse','SoilTrace','PulseAg','GrowVault','FieldNet','DroneSoil','SoilGrid','HarvestLoop','RuralMesh','FarmFlag','AgriFlow','SoilVault','FieldProof','DroneTrace','MarketRoots','NutrientPath','CropPulse','AgriPulse','EcoSeed','AgriMetrics','DroneGrid','GreenNode','RootVault','FieldToken','AgriPlan','SoilYield','SeedVault','MarketLink','CropFlow','RuralCast','AgriSyncPro','SoilLine','EcoAgri','HarvestNode','TerraSoil','CropMesh','AgriSignal','RuralVault','PulseGrow','MarketSoilX','AgriOmni'],
    subnodes: []
  },
  creative: {
    name: "🖋️ Creative Tech",
    brands: ['MediaGrid', 'StudioPath', 'SoundReel', 'EditFrame', 'MotionKit','GhostTrace', 'TalentMap', 'SignalVerse', 'ScrollPlay', 'FXStream'],
    subnodes: []
  },
  professional: {
    name: "🧾 Professional Services",
    brands: ['LedgerNest™', 'OmniBooks™', 'QCalcX™', 'SiteProof™', 'LawTrace™','ContractCast™', 'Enginuity™', 'StructVault™', 'RegiSync™', 'ScrollAudit™','ClaimDocX™', 'PlanDrop™', 'SurveyGrid™', 'VaultJudge™', 'LoopInspect™','BuildNode™', 'ComplyTrack™', 'LegalSync™', 'BudgetCast™', 'VaultPlans™','FormCert™', 'ProofLayer™', 'ZoneMap™', 'TrackSeal™', 'DocLoop™','AuditCrate™', 'VerifyLine™', 'PlanMesh™', 'FrameBook™', 'LogicPermit™','OmniBrief™', 'ClauseCraft™', 'FormLogic™', 'CheckNode™', 'AssetTrace™','LawPathX™', 'LedgerFlow™', 'BudgetSync™', 'CrateJudge™', 'SpecAudit™','LoopCheck™', 'OmniTender™', 'SignalCompliance™', 'BuildCast™', 'NodeClause™','PermitDrop™', 'AuditMatrix™', 'StructPlan™', 'ClaimBoard™', 'FormDrop™'],
    subnodes: []
  },
  saas: {
    name: "🔑 SaaS & Licensing",
    brands: ['SaaSChain™', 'LicenseGrid™', 'TokenSaaS™', 'VaultKey™', 'OmniLicense™','ScrollSync™', 'PulseSaaS™', 'ClaimSuite™', 'YieldKey™', 'SaaSBoard™','KeyLoop™', 'VaultPanel™', 'LicenseMap™', 'TokenSync™', 'OmniClaim™','SuiteTrack™', 'LicenseBeam™', 'VaultSync™', 'ClaimEcho™', 'PanelGrid™'],
    subnodes: []
  },
  nft: {
    name: "🔁 NFT & Ownership",
    brands: ['ClaimGrid™', 'TokenSync™', 'VaultMint™', 'NFTLoop™', 'ScrollProof™','IPTrace™', 'MintEcho™', 'VaultSeal™', 'ChainLock™', 'PulseDrop™','AssetNest™', 'MintTrack™', 'TokenClaim™', 'ProofMap™', 'ScrollVault™','ClaimPanel™', 'YieldChain™', 'LedgerDrop™', 'NFTBoard™', 'ScrollNest™'],
    subnodes: []
  },
  quantum: {
    name: "✴️ Quantum Protocols",
    brands: ['QuantumMesh™', 'PulseQ™', 'EntanglePath™', 'QubitNest™', 'LogicSpin™','VaultQuantum™', 'WaveSignal™', 'PhaseClaim™', 'GridState™', 'QuantumDrop™','SyncQ™', 'PulseField™', 'QLogic™', 'EntangleProof™', 'SuperposVault™','ClaimLoopQ™', 'QuantumTrace™', 'QubitEcho™', 'ZeroNode™', 'PhaseGrid™'],
    subnodes: []
  },
  ritual: {
    name: "☯ Ritual & Culture",
    brands: ['RiteNest™', 'PulseSpirit™', 'ClanScroll™', 'CultureGrid™', 'MythLoop™','AuraDrop™', 'CeremPath™', 'EchoGlyph™', 'TradVault™', 'LineageClaim™','SymbolMap™', 'AncestorSync™', 'SoulPanel™', 'ClanRoot™', 'EchoRitual™','TotemCast™', 'RiteClaim™', 'GlyphVault™', 'CultureNest™', 'SpiritBeam™'],
    subnodes: []
  },
  nutrition: {
    name: "✿ Nutrition & Food Chain",
    brands: ['AgriNest™', 'FreshSync™', 'CropLoop™', 'SoilGrid™', 'FarmDrop™','GrainVault™', 'HarvestClaim™', 'PulseCrop™', 'YieldField™', 'RootMap™','FoodProof™', 'AquaNest™', 'SeedCycle™', 'PlantTrack™', 'CropVault™','SoilEcho™', 'NutritionClaim™', 'LoopFarm™', 'PulseGrain™', 'FieldNest™'],
    subnodes: []
  },
  zerowaste: {
    name: "♻️ Zero Waste",
    brands: ['EcoNest™', 'GreenLoop™', 'CycleSync™', 'ZeroCrate™', 'WasteGrid™','BioDrop™', 'SustainClaim™', 'LoopSort™', 'PulseGreen™', 'YieldTrash™','RecycleMap™', 'CleanTrack™', 'EcoVault™', 'ClaimClean™', 'CompostGrid™','GreenBeam™', 'LoopNest™', 'TrashEcho™', 'SortClaim™', 'VaultCycle™'],
    subnodes: []
  },
  mining: {
    name: "⛏️ Mining & Resources",
    brands: ['MineNest™', 'DrillCoreX™', 'OreSync™', 'VaultRock™', 'ClaimMine™','TrackShaft™', 'PulseMine™', 'CoreBeam™', 'DigEcho™', 'RockPath™','YieldDrill™', 'MineProof™', 'OreLine™', 'DrillLink™', 'VaultTunnel™','GeoGrid™', 'SeamSync™', 'ClaimOre™', 'PulseBlast™', 'OreEcho™','DeepCrate™', 'RockLogic™', 'CoreDrill™', 'MineCast™', 'DrillMark™','SignalOre™', 'YieldTrack™', 'VaultSeam™', 'ShaftDrop™', 'GeoNode™'],
    subnodes: []
  }
};

export async function seedComprehensiveBrands() {
  console.log("🌐 Seeding comprehensive brand ecosystem from authentic HTML data...");

  try {
    // Get all sectors from database
    const allSectors = await db.select().from(sectors);
    
    let totalBrandsSeeded = 0;
    let totalSubnodesSeeded = 0;

    for (const [sectorKey, sectorData] of Object.entries(sectorBrandsData)) {
      // Find matching sector by name
      const sector = allSectors.find(s => s.name?.includes(sectorData.name.split(' ')[1]) || s.emoji === sectorData.name.split(' ')[0]);
      
      if (!sector) {
        console.log(`❌ Sector not found: ${sectorData.name}`);
        continue;
      }

      console.log(`🔄 Seeding ${sectorData.name} (${sectorData.brands.length} brands)...`);

      // Check if brands already exist for this sector
      const existingBrands = await db.select().from(brands).where(eq(brands.sectorId, sector.id));
      if (existingBrands.length > 0) {
        console.log(`⚠️  Brands already exist for ${sectorData.name}, skipping...`);
        continue;
      }

      // Seed parent brands
      for (let i = 0; i < sectorData.brands.length; i++) {
        const brandName = sectorData.brands[i];
        
        const brandData: InsertBrand = {
          name: brandName,
          description: `${brandName} - Advanced ${sectorData.name.split(' ')[1]} solution providing enterprise-grade infrastructure and analytics`,
          sectorId: sector.id,
          status: i < 20 ? "active" : "development", // First 20 are active
          integration: i < 10 ? "VaultMesh™" : i < 30 ? "GridCore™" : "Standard",
          metadata: {
            tier: i < 5 ? "A+" : i < 15 ? "A" : i < 35 ? "B+" : "B",
            category: "Core",
            source: "HTML_DATA",
            pricing: sector.price || "79.99",
            features: [`${brandName} Analytics`, `${brandName} Integration`, `${brandName} Security`],
            version: "2.0",
            deploymentDate: new Date().toISOString(),
            performance: Math.floor(Math.random() * 20) + 80, // 80-99%
          }
        };

        const [parentBrand] = await db.insert(brands).values(brandData).returning();
        totalBrandsSeeded++;

        // Add subnodes for each parent brand (4 subnodes per parent)
        for (let j = 0; j < 4; j++) {
          const subnodeData: InsertBrand = {
            name: `${brandName} ${j === 0 ? 'Core' : j === 1 ? 'Engine' : j === 2 ? 'Gateway' : 'Protocol'}`,
            description: `${brandName} specialized ${j === 0 ? 'core processing' : j === 1 ? 'engine module' : j === 2 ? 'gateway interface' : 'protocol handler'} component`,
            sectorId: sector.id,
            parentId: parentBrand.id,
            status: "active",
            integration: "SubNode™",
            metadata: {
              tier: "Subnode",
              category: "Component",
              source: "HTML_SUBNODE",
              parentName: brandName,
              component: j === 0 ? 'Core' : j === 1 ? 'Engine' : j === 2 ? 'Gateway' : 'Protocol',
              performance: Math.floor(Math.random() * 15) + 85, // 85-99%
            }
          };

          await db.insert(brands).values(subnodeData);
          totalSubnodesSeeded++;
        }
      }

      console.log(`✅ Seeded ${sectorData.brands.length} brands for ${sectorData.name}`);
    }

    console.log(`🎉 Comprehensive brand seeding completed!`);
    console.log(`📊 Total parent brands seeded: ${totalBrandsSeeded}`);
    console.log(`📊 Total subnodes seeded: ${totalSubnodesSeeded}`);
    console.log(`📊 Total brands in ecosystem: ${totalBrandsSeeded + totalSubnodesSeeded}`);

  } catch (error) {
    console.error("❌ Error seeding comprehensive brands:", error);
    throw error;
  }
}

// Export the seeder function
export { sectorBrandsData };