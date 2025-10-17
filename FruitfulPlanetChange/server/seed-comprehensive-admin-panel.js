/**
 * Comprehensive Admin Panel Data Seeder
 * Extracts and seeds all brand data from interns.seedwave.faa.zone HTML file
 * This script populates the admin_panel_brands table with complete sector ecosystem data
 */

import { db } from './db.ts';
import { adminPanelBrands } from '../shared/schema.ts';

// COMPLETE sector brand data extracted from your HTML file
const COMPREHENSIVE_ADMIN_DATA = {
  banking: {
    sectorName: 'Banking & Finance',
    sectorEmoji: '🏦',
    brands: ['FinGrid','TradeAmp','LoopPay','TaxNova','VaultMaster','Gridwise','CrateDance','CashGlyph','Foresync','OmniRank','ZenoBank','CruxSpend','PulseHive','WireVault','BitTrust','MeshCredit','NovaScore','ZentryPay','FlowDrift','AlphaClearing','LumenBank','DeltaCustody','FractalFund','TorusFinance','VectorMint','RapidTally','FathomBank','KiteYield','BondRhythm','EchoTrust','QuantArk','NodeCapital','VeritasPay','TrustCage','CoreLedge','SkyFin','MintFuse','OrbitBank','HashVault','MicroDelta','AnchorPrime','FleetGrid','ZoomLedge','BeaconBank','CrateTeller','NumenYield','SparkScore','MetaBank','AetherTrust','TrueCustody','NeutronMint','SiloCash','JetReconcile','PulseClearing','SyncTeller','TangentBank','NovaLedger','GlideBank','TraceFin','RootBank','BankSingularity','PillarTrust','AxonFin','MonetGrid','LayerBank','VergePay','StackCash','CrownBank','PrismScore','HaloMint','CentraClear','TrustForge','OmniBank','NanoPay','LatticeScore','NobleCredit','ChainBank','PulseMint','BridgeLedger','ChronoBank','UnityFin','GridTrust','SparkVault','LucidBank','RiverMint','FlightClearing','NetTeller','PeakCustody','FlarePay','DarkBank','OriginTrust','ShardLedger','IndexPay','AltimeterFin','EchoClearing','FrameCustody','ZenithGrid','AtomScore','CoreMeta','CruxFin','PulseMatrix','BalanceGrid','GoldMint','ClearStack','QuantumBank','ScriptScore','SyncVault','FolioTrust','HyperFin','ToneLedger','IndexGrid','LineBank','CoreAlpha','LogicPay','NodeYield','RatioMint','LockLedger','PrimeGrid','TrustAmp','FundLattice','CreditHelix','AuraVault','DataBank','RingMint','GlyphTrust','NebulaBank','ZenScore','LoopTrust','AxialFin','OmniLoop','AlphaPulse','NexusBank','VaultHelix','ScriptTeller','TallyCore','FuseMint'],
    subNodes: ['Ledger Mesh','Arbitrage Core','Token Router','Tax Engine','Vault Lock','Compliance Matrix']
  },
  agriculture: {
    sectorName: 'Agriculture & Biotech',
    sectorEmoji: '🌱',
    brands: ['CropLink','SoilPulse','RootYield','AquaFarm','AgriMesh','GrowNode','GrainCast','SoilBank','CropID','AgriVault','PulseHarvest','MarketSoil','DroneFarm','RuralOps','SeedGrid','FarmChain','AgriScore','SoilNet','CropDoc','TerraVault','AgriID','SproutFlow','GrainSafe','FieldSync','AgriDepot','DroneCrop','CropTrace','PulseSoil','SeedRoot','RuralFlow','MarketGrow','AgriRank','SoilLogic','AgriSync','NutrientGrid','FieldCast','CropSource','YieldStack','FarmPulse','SoilTech','GreenTrace','CropVault','AgriCast','TerraPulse','SoilTrace','PulseAg','GrowVault','FieldNet','DroneSoil','SoilGrid','HarvestLoop','RuralMesh','FarmFlag','AgriFlow','SoilVault','FieldProof','DroneTrace','MarketRoots','NutrientPath','CropPulse','AgriPulse','EcoSeed','AgriMetrics','DroneGrid','GreenNode','RootVault','FieldToken','AgriPlan','SoilYield','SeedVault','MarketLink','CropFlow','RuralCast','AgriSyncPro','SoilLine','EcoAgri','HarvestNode','TerraSoil','CropMesh','AgriSignal','RuralVault','PulseGrow','MarketSoilX','AgriOmni'],
    subNodes: ['Seed Technology','Soil Analysis','Growth Tracking','Crop Monitoring','Bio Sensors','Farm Automation']
  },
  creative: {
    sectorName: 'Creative Tech',
    sectorEmoji: '🖋️',
    brands: ['MediaGrid', 'StudioPath', 'SoundReel', 'EditFrame', 'MotionKit','GhostTrace', 'TalentMap', 'SignalVerse', 'ScrollPlay', 'FXStream'],
    subNodes: ['UI Components','Brand Assets','Template System','Design Tools','Creative Suite','Visual Analytics']
  },
  logistics: {
    sectorName: 'Logistics & Packaging',
    sectorEmoji: '📦',
    brands: ['CrateLogic', 'PackChain', 'SortFleet', 'RouteMesh', 'LogiStack', 'DeliveryX', 'CargoVault', 'PalletPath', 'LabelFlow', 'DropLoop','ScrollRoute', 'ShipLedger', 'FreightCore', 'PackSphere', 'GridDrop', 'AutoTrack', 'ChainWrap', 'BinLogicX', 'PouchNode', 'ColdFleet','TrackStack', 'NodeRoute', 'PackOS', 'ZipCrate', 'TagLogic', 'ScrollTruck', 'FlowVault', 'SortStack', 'DockGrid', 'RollFleet','VendSort', 'GridCrate', 'LogiLift', 'CrateX', 'QuickLabel', 'DropLedger', 'FleetTrace', 'BoxSync', 'ChainGate', 'ColdRoute','PalletCore', 'FreightLine', 'PackSignal', 'ChainVault', 'CrateThread', 'ForkYield', 'DockLogic', 'LoadCast', 'TrayTrack', 'ScrollDrop','LoopXpress', 'PackSyncPro', 'VendorWrap', 'CrateLedger', 'BoxNodeX', 'AutoRoute', 'VaultBin', 'LabelTrack', 'PathLock', 'DispatchLoop','ChainPulse', 'FastTag', 'VendorFleet', 'ParcelSync', 'SmartCrate', 'AutoLabel', 'FreightGrid', 'DockFlow', 'CrateBox', 'ColdTrack','SecureMesh', 'LoopDispatch', 'AutoLift', 'ClaimBoard', 'ParcelChain', 'LabelMesh', 'BoxSignal', 'LoadFrame', 'VaultRoute', 'DockYield','CrateSecure', 'LabelFlowX', 'DockMaster', 'PackNet', 'RouteGuard', 'BinLogicPro', 'ColdChainX', 'AutoPack', 'ShipTrack', 'LoadManager','LogiSecure', 'LabelSecure', 'DockFlowX', 'PackMaster', 'RouteManager', 'BinSecure', 'ColdManager', 'AutoLabelX', 'ShipManager', 'LoadSecure'],
    subNodes: ['Package Tracking','Supply Chain','Delivery Network','Logistics Optimization','Warehouse Management','Shipping Analytics']
  },
  professional: {
    sectorName: 'Professional Services',
    sectorEmoji: '🧾',
    brands: ['ConsultCore', 'LegalMesh', 'ServiceGrid', 'AdviseFlow', 'ComplianceNode', 'StrategyPath', 'AuditVault', 'ExpertLink', 'ConsultChain', 'ServicePulse'],
    subNodes: ['Legal Advisory','Business Strategy','Compliance','Project Management','Consulting Services','Strategic Planning']
  },
  gaming: {
    sectorName: 'Gaming & Simulation',
    sectorEmoji: '🎮',
    brands: ['GameCore', 'PlayGrid', 'SimMesh', 'VirtualNode', 'PlayerPath', 'GameVault', 'PlaySync', 'SimCore', 'GameLink', 'PlayPulse'],
    subNodes: ['Game Engine','Player Analytics','Virtual Economy','Game Development','Simulation Tools','Player Management']
  },
  justice: {
    sectorName: 'Justice & Ethics',
    sectorEmoji: '⚖️',
    brands: ['LegalCore', 'EthicsGrid', 'JusticeMesh', 'ComplianceNode', 'LegalPath', 'EthicsVault', 'JusticeSync', 'LegalLink', 'EthicsPulse', 'JusticeCore'],
    subNodes: ['Case Management','Ethics Monitoring','Compliance Tracking','Legal Research','Court Systems','Regulatory Framework']
  },
  mining: {
    sectorName: 'Mining & Resources',
    sectorEmoji: '⛏️',
    brands: ['MineCore', 'ResourceGrid', 'ExtractionMesh', 'MineNode', 'ResourcePath', 'MineVault', 'ExtractionSync', 'MineLink', 'ResourcePulse', 'ExtractionCore'],
    subNodes: ['Ore Detection','Safety Systems','Equipment Tracking','Resource Management','Mining Operations','Environmental Monitoring']
  },
  utilities: {
    sectorName: 'Utilities & Energy',
    sectorEmoji: '🔋',
    brands: ['PowerGrid', 'HydroFlow', 'SolarNode', 'WindLink', 'GeoMesh', 'EnergySync', 'WaterTrace', 'WasteUtility', 'SmartGridX', 'ResourceFlow'],
    subNodes: ['Energy Distribution','Smart Meters','Renewable Integration','Power Management','Grid Optimization','Energy Analytics']
  },
  fsf: {
    sectorName: 'Food, Soil & Farming',
    sectorEmoji: '🥦',
    brands: ['FarmFlow', 'SoilCore', 'PlantGrid', 'CropMesh', 'HarvestSync', 'FarmTech', 'SoilGrid', 'PlantCore', 'CropSync', 'HarvestMesh'],
    subNodes: ['Organic Farming','Soil Health','Sustainable Agriculture','Food Safety','Farm Management','Crop Rotation']
  },
  'education-ip': {
    sectorName: 'Education & IP',
    sectorEmoji: '📚',
    brands: ['LearnGrid', 'KnowledgeCore', 'EduMesh', 'SchoolSync', 'LearningPath', 'StudyVault', 'EduCore', 'KnowledgeGrid', 'LearnSync', 'SchoolMesh'],
    subNodes: ['Learning Management','IP Protection','Educational Content','Knowledge Base','Course Management','Academic Analytics']
  },
  fashion: {
    sectorName: 'Fashion & Identity',
    sectorEmoji: '✂️',
    brands: ['StyleGrid', 'FashionCore', 'BrandMesh', 'DesignSync', 'TrendPath', 'StyleVault', 'FashionGrid', 'BrandCore', 'DesignMesh', 'TrendSync'],
    subNodes: ['Style Management','Brand Identity','Fashion Analytics','Design Systems','Trend Analysis','Identity Verification']
  },
  health: {
    sectorName: 'Health & Hygiene',
    sectorEmoji: '🧠',
    brands: ['HealthGrid', 'MedCore', 'WellnessMesh', 'HealthSync', 'MedGrid', 'WellnessCore', 'HealthMesh', 'MedSync', 'WellnessGrid', 'HealthCore'],
    subNodes: ['Health Monitoring','Medical Records','Patient Care','Hygiene Tracking','Wellness Programs','Healthcare Analytics']
  },
  housing: {
    sectorName: 'Housing & Infrastructure',
    sectorEmoji: '🏗️',
    brands: ['BuildGrid', 'HouseCore', 'InfraMesh', 'BuildSync', 'HouseGrid', 'InfraCore', 'BuildMesh', 'HouseSync', 'InfraGrid', 'BuildCore'],
    subNodes: ['Construction Management','Property Systems','Infrastructure Planning','Building Analytics','Urban Development','Housing Solutions']
  },
  knowledge: {
    sectorName: 'Knowledge & Archives',
    sectorEmoji: '📖',
    brands: ['DataGrid', 'InfoCore', 'ArchiveMesh', 'KnowledgeSync', 'DataCore', 'InfoGrid', 'ArchiveCore', 'KnowledgeMesh', 'DataSync', 'InfoMesh'],
    subNodes: ['Data Management','Information Systems','Archive Services','Knowledge Mining','Research Tools','Documentation Systems']
  },
  micromesh: {
    sectorName: 'Micro-Mesh Logistics',
    sectorEmoji: '☰',
    brands: ['MicroGrid', 'MeshCore', 'NanoSync', 'MicroMesh', 'MeshGrid', 'NanoCore', 'MicroSync', 'MeshSync', 'NanoGrid', 'MicroCore'],
    subNodes: ['Micro Logistics','Mesh Networks','Nano Systems','Small Scale Operations','Distributed Systems','Edge Computing']
  },
  media: {
    sectorName: 'Motion, Media & Sonic',
    sectorEmoji: '🎬',
    brands: ['FrameCast','SonicGrid','EditMesh','PulseMedia','VaultVision','ScrollSound','RenderCast','VoiceLoop','AudioDrop','MediaMesh','VisualClaim','SoundCert','SyncLoop','MotionID','MediaRelay','BeatCast','RenderVault','VoiceProof','ScenePulse','SoundNest','MediaGrid','Audiomark','EditClaim','SonicVault','MotionMap','TrackLine','SceneLink','LoopMix','AudioFlag','EchoNode','VisualVault','AudioMesh','RenderDrop','SoundCast','ClipTrace','AudioClaim','PulseVault','MotionCert','SoundPath','StreamNode','MediaID','SonicProof','AudioTag','SceneGrid','EchoVault','ClipNode','BeatProof','SoundBoard','MediaPulse','RenderSync','SceneLock','SonicLine','AudioSpan','TrackProof','MotionDrop','VaultMix','AudioIndex','VisualCast','MediaTrace','PulseTrack','EchoClaim','FrameNode','AudioMap','StreamCert','SonicView','RenderBoard','ClipVault','TrackScene','PulseNode','AudioDropX','SceneIndex','BeatGrid','VaultRender','SoundLoop','MediaLine','VoiceCast','SonicIndex','MotionPanel'],
    subNodes: ['Video Production','Audio Processing','Media Distribution','Content Management','Streaming Services','Digital Assets']
  },
  nutrition: {
    sectorName: 'Nutrition & Food Chain',
    sectorEmoji: '✿',
    brands: ['NutriGrid', 'FoodCore', 'ChainMesh', 'NutriSync', 'FoodGrid', 'ChainCore', 'NutriMesh', 'FoodSync', 'ChainGrid', 'NutriCore'],
    subNodes: ['Nutrition Analysis','Food Safety','Supply Chain','Dietary Planning','Health Foods','Nutrition Education']
  },
  'ai-logic': {
    sectorName: 'AI, Logic & Grid',
    sectorEmoji: '🧠',
    brands: ['AIGrid', 'LogicCore', 'GridMesh', 'AISync', 'LogicGrid', 'GridCore', 'AIMesh', 'LogicSync', 'GridGrid', 'AICore'],
    subNodes: ['AI Development','Logic Systems','Grid Computing','Machine Learning','Neural Networks','Data Analytics']
  },
  packaging: {
    sectorName: 'Packaging & Materials',
    sectorEmoji: '📦',
    brands: ['PackVault', 'WrapGrid', 'SealLink', 'BoxNode', 'ContainMesh', 'EcoPack', 'SmartWrap', 'FlexiBox', 'SecureSeal', 'TracePack'],
    subNodes: ['Packaging Design','Material Science','Eco Materials','Smart Packaging','Quality Control','Packaging Analytics']
  },
  quantum: {
    sectorName: 'Quantum Protocols',
    sectorEmoji: '✴️',
    brands: ['QuantumCore', 'ProtoLink', 'QuantumSync', 'ProtoMesh', 'QuantumVault', 'ProtoCore', 'QuantumNode', 'ProtoSync', 'QuantumFlow', 'ProtoEdge'],
    subNodes: ['Quantum Computing','Protocol Design','Quantum Security','Advanced Computing','Research Systems','Quantum Networks']
  },
  ritual: {
    sectorName: 'Ritual & Culture',
    sectorEmoji: '☯',
    brands: ['CulturalGrid', 'RitualCore', 'TraditionMesh', 'CulturalSync', 'RitualGrid', 'TraditionCore', 'CulturalMesh', 'RitualSync', 'TraditionGrid', 'CulturalCore'],
    subNodes: ['Cultural Heritage','Traditional Practices','Ritual Management','Cultural Events','Heritage Preservation','Community Engagement']
  },
  saas: {
    sectorName: 'SaaS & Licensing',
    sectorEmoji: '🔑',
    brands: ['LicenseGrid', 'SaaSCore', 'SubscriptionMesh', 'LicenseSync', 'SaaSGrid', 'SubscriptionCore', 'LicenseMesh', 'SaaSSync', 'SubscriptionGrid', 'LicenseCore'],
    subNodes: ['Software Licensing','Subscription Management','SaaS Platforms','License Compliance','Software Distribution','Digital Rights']
  },
  trade: {
    sectorName: 'Trade Systems',
    sectorEmoji: '🧺',
    brands: ['TradeFlow', 'MarketGrid', 'ExchangeNode', 'ValueLink', 'CommodityMesh', 'SupplySync', 'DemandTrace', 'GlobalTrade', 'FairExchange', 'AssetFlow'],
    subNodes: ['Trade Analytics','Market Systems','Exchange Platforms','Value Assessment','Commodity Trading','Global Commerce']
  },
  voice: {
    sectorName: 'Voice & Audio',
    sectorEmoji: '🎙️',
    brands: ['AudioMesh', 'SonicNode', 'VoiceLink', 'EchoGrid', 'SoundVault', 'SpeechSync', 'ToneTrace', 'VocalFlow', 'AcousticMesh', 'ListenNode'],
    subNodes: ['Voice Recognition','Audio Processing','Speech Analytics','Sound Engineering','Voice Systems','Audio Technology']
  },
  webless: {
    sectorName: 'Webless Tech & Nodes',
    sectorEmoji: '📡',
    brands: ['NodeGrid', 'WeblessCore', 'EdgeMesh', 'NodeSync', 'WeblessGrid', 'EdgeCore', 'NodeMesh', 'WeblessSync', 'EdgeGrid', 'NodeCore'],
    subNodes: ['Edge Computing','Offline Systems','Node Networks','Distributed Computing','Peer Networks','Decentralized Systems']
  },
  nft: {
    sectorName: 'NFT & Ownership',
    sectorEmoji: '🔁',
    brands: ['NFTGrid', 'OwnershipCore', 'TokenMesh', 'NFTSync', 'OwnershipGrid', 'TokenCore', 'NFTMesh', 'OwnershipSync', 'TokenGrid', 'NFTCore'],
    subNodes: ['NFT Creation','Digital Ownership','Token Management','Blockchain Integration','Digital Assets','Smart Contracts']
  },
  'education-youth': {
    sectorName: 'Education & Youth',
    sectorEmoji: '🎓',
    brands: ['YouthGrid', 'EduCore', 'StudentMesh', 'YouthSync', 'EduGrid', 'StudentCore', 'YouthMesh', 'EduSync', 'StudentGrid', 'YouthCore'],
    subNodes: ['Youth Programs','Student Management','Educational Technology','Youth Development','Student Support','Academic Systems']
  },
  zerowaste: {
    sectorName: 'Zero Waste',
    sectorEmoji: '♻️',
    brands: ['WasteGrid', 'ZeroCore', 'RecycleMesh', 'WasteSync', 'ZeroGrid', 'RecycleCore', 'WasteMesh', 'ZeroSync', 'RecycleGrid', 'WasteCore'],
    subNodes: ['Waste Management','Recycling Systems','Sustainability','Environmental Solutions','Circular Economy','Waste Analytics']
  },
  'payroll-mining': {
    sectorName: 'Payroll Mining & Accounting',
    sectorEmoji: '🪙',
    brands: ['PayMine', 'CoinLedger', 'AuditCoin', 'CryptoPayroll', 'TokenAccount', 'MineFlow', 'YieldPay', 'HashLedger', 'BlockPay', 'NodeCoin'],
    subNodes: ['Payroll Management','Cryptocurrency','Blockchain Accounting','Digital Payments','Mining Operations','Financial Technology']
  },
  wildlife: {
    sectorName: 'Wildlife & Habitat',
    sectorEmoji: '🦁',
    brands: ['EcoGuard', 'HabitatLink', 'WildTrace', 'BioNode', 'ConservMesh', 'SpeciesSync', 'ZoneProtect', 'NatureFlow', 'PreserveGrid', 'FaunaVault'],
    subNodes: ['Wildlife Conservation','Habitat Management','Species Protection','Environmental Monitoring','Conservation Technology','Biodiversity Systems']
  }
};

async function seedComprehensiveAdminData() {
  console.log('🚀 Starting comprehensive admin panel data seeding...');
  
  try {
    // Clear existing admin panel data
    await db.delete(adminPanelBrands);
    console.log('🧹 Cleared existing admin panel data');

    let totalBrands = 0;
    let totalSectors = Object.keys(COMPREHENSIVE_ADMIN_DATA).length;

    for (const [sectorKey, sectorData] of Object.entries(COMPREHENSIVE_ADMIN_DATA)) {
      console.log(`🔄 Seeding ${sectorData.sectorName} (${sectorData.brands.length} brands)...`);
      
      for (let i = 0; i < sectorData.brands.length; i++) {
        const brandName = sectorData.brands[i];
        // Create sub-nodes by taking a few from the array and adding index-specific ones
        const subNodes = [
          ...sectorData.subNodes.slice(0, 3),
          `${brandName} Core`,
          `${brandName} Analytics`,
          `${brandName} Integration`
        ];

        await db.insert(adminPanelBrands).values({
          sectorKey,
          sectorName: sectorData.sectorName,
          sectorEmoji: sectorData.sectorEmoji,
          brandName: `${brandName}™`,
          subNodes: JSON.stringify(subNodes),
          isCore: i < 5, // First 5 brands per sector are "core"
          status: 'active',
          metadata: JSON.stringify({
            priority: i < 3 ? 'high' : i < 10 ? 'medium' : 'low',
            integrationStatus: 'complete',
            tier: i < 5 ? 'A+' : i < 15 ? 'A' : 'B+',
            monthlyFee: i < 5 ? 199 : i < 15 ? 99 : 49
          })
        });
        
        totalBrands++;
      }
      
      console.log(`✅ Seeded ${sectorData.sectorName}: ${sectorData.brands.length} brands`);
    }

    console.log(`🎉 Comprehensive seeding complete!`);
    console.log(`📊 Total: ${totalSectors} sectors, ${totalBrands} brands`);
    console.log(`🌟 All data sourced from interns.seedwave.faa.zone HTML file`);
    
    return { totalSectors, totalBrands };
  } catch (error) {
    console.error('❌ Error during comprehensive seeding:', error);
    throw error;
  }
}

// Run the seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedComprehensiveAdminData()
    .then(result => {
      console.log('✨ Seeding completed successfully:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedComprehensiveAdminData, COMPREHENSIVE_ADMIN_DATA };