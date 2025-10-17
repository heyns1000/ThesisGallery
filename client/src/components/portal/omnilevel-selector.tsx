import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, CheckCircle, Brain, Sparkles } from 'lucide-react';

export const sectorList = {
  "agriculture": { name: "🌱 Agriculture & Biotech" },
  "fsf": { name: "🥦 Food, Soil & Farming" },
  "banking": { name: "🏦 Banking & Finance" },
  "creative": { name: "🖋️ Creative Tech" },
  "logistics": { name: "📦 Logistics & Packaging" },
  "education-ip": { name: "📚 Education & IP" },
  "fashion": { name: "✂ Fashion & Identity" },
  "gaming": { name: "🎮 Gaming & Simulation" },
  "health": { name: "🧠 Health & Hygiene" },
  "housing": { name: "🏗️ Housing & Infrastructure" },
  "justice": { name: "⚖ Justice & Ethics" },
  "knowledge": { name: "📖 Knowledge & Archives" },
  "micromesh": { name: "☰ Micro-Mesh Logistics" },
  "media": { name: "🎬 Motion, Media & Sonic" },
  "nutrition": { name: "✿ Nutrition & Food Chain" },
  "ai-logic": { name: "🧠 AI, Logic & Grid" },
  "packaging": { name: "📦 Packaging & Materials" },
  "quantum": { name: "✴️ Quantum Protocols" },
  "ritual": { name: "☯ Ritual & Culture" },
  "saas": { name: "🔑 SaaS & Licensing" },
  "trade": { name: "🧺 Trade Systems" },
  "utilities": { name: "🔋 Utilities & Energy" },
  "voice": { name: "🎙️ Voice & Audio" },
  "webless": { name: "📡 Webless Tech & Nodes" },
  "nft": { name: "🔁 NFT & Ownership" },
  "education-youth": { name: "🎓 Education & Youth" },
  "zerowaste": { name: "♻️ Zero Waste" },
  "professional": { name: "🧾 Professional Services" },
  "payroll-mining": { name: "🪙 Payroll Mining & Accounting" },
  "mining": { name: "⛏️ Mining & Resources" },
  "wildlife": { name: "🦁 Wildlife & Habitat" },
  "admin-panel": { name: "⚙️ Admin Panel" }
};

export const allSectorsData = {
  "ai-logic": {
    name: "🧠 AI, Logic & Grid",
    repoName: "ai-logic-seedwave-admin",
    baseUrl: "ai-logic.seedwave.faa.zone",
    brands: [
      { name: "OmniKey", subnodes: ["TraceBeam", "VaultEcho", "QRPath", "MeshID"] },
      { name: "SignalPulse", subnodes: ["BeamNode", "VaultTrack", "QRLogic", "SignalDrop"] },
      { name: "MeshIndex", subnodes: ["YieldTrack", "VaultMap", "QRClaim", "OmniPath"] }
    ]
  },
  "agriculture": {
    name: "🌱 Agriculture & Biotech",
    repoName: "agriculture-seedwave-admin",
    baseUrl: "agriculture.seedwave.faa.zone",
    brands: [
      { name: "CropLink", subnodes: ["CropLink ID™", "CropLink Vault™", "CropLink Field™", "CropLink Yield™"] },
      { name: "SoilPulse", subnodes: ["SoilPulse Trace™", "SoilPulse Data™", "SoilPulse Alert™"] }
    ]
  },
  "fsf": {
    name: "🥦 Food, Soil & Farming",
    repoName: "fsf-seedwave-admin",
    baseUrl: "fsf.seedwave.faa.zone",
    brands: [{ name: "FarmFlow", subnodes: ["SoilScan", "WaterNet", "CropMonitor"] }]
  },
  "banking": {
    name: "🏦 Banking & Finance",
    repoName: "banking-seedwave-admin",
    baseUrl: "banking.seedwave.faa.zone",
    brands: [{ name: "CoinFlow", subnodes: ["LedgerTrack", "AssetVault"] }]
  },
  "creative": {
    name: "🖋️ Creative Tech",
    repoName: "creative-seedwave-admin",
    baseUrl: "creative.seedwave.faa.zone",
    brands: [{ name: "PixelFlow", subnodes: ["RenderEngine", "SonicWave", "VisualStory"] }]
  },
  "logistics": {
    name: "📦 Logistics & Packaging",
    repoName: "logistics-seedwave-admin",
    baseUrl: "logistics.seedwave.faa.zone",
    brands: [{ name: "CrateLogic", subnodes: ["RouteOptimize", "FleetTrack", "WarehouseSync"] }]
  },
  "education-ip": {
    name: "📚 Education & IP",
    repoName: "education-seedwave-admin",
    baseUrl: "education-ip.seedwave.faa.zone",
    brands: [{ name: "EduNest", subnodes: ["CurriculumForge", "LicenseTrack"] }]
  },
  "fashion": {
    name: "✂ Fashion & Identity",
    repoName: "fashion-seedwave-admin",
    baseUrl: "fashion.seedwave.faa.zone",
    brands: [{ name: "StyleFlow", subnodes: ["IdentityMesh", "TrendPulse"] }]
  },
  "gaming": {
    name: "🎮 Gaming & Simulation",
    repoName: "gaming-seedwave-admin",
    baseUrl: "gaming.seedwave.faa.zone",
    brands: [{ name: "GameGrid", subnodes: ["SimEngine", "RenderNode"] }]
  },
  "health": {
    name: "🧠 Health & Hygiene",
    repoName: "health-seedwave-admin",
    baseUrl: "health.seedwave.faa.zone",
    brands: [{ name: "MediVault", subnodes: ["DiagAI", "PatientLink"] }]
  },
  "housing": {
    name: "🏗️ Housing & Infrastructure",
    repoName: "housing-seedwave-admin",
    baseUrl: "housing.seedwave.faa.zone",
    brands: [{ name: "BuildFlow", subnodes: ["SmartGrid", "UrbanMesh"] }]
  },
  "justice": {
    name: "⚖ Justice & Ethics",
    repoName: "justice-seedwave-admin",
    baseUrl: "justice.seedwave.faa.zone",
    brands: [{ name: "EthiLock", subnodes: ["ComplianceScan", "VaultJustice"] }]
  },
  "knowledge": {
    name: "📖 Knowledge & Archives",
    repoName: "knowledge-seedwave-admin",
    baseUrl: "knowledge.seedwave.faa.zone",
    brands: [{ name: "LoreKeeper", subnodes: ["ArchiveSync", "MetaGrid"] }]
  },
  "micromesh": {
    name: "☰ Micro-Mesh Logistics",
    repoName: "micromesh-seedwave-admin",
    baseUrl: "micromesh.seedwave.faa.zone",
    brands: [{ name: "PicoFlow", subnodes: ["NanoTrack", "MicroRoute"] }]
  },
  "media": {
    name: "🎬 Motion, Media & Sonic",
    repoName: "media-seedwave-admin",
    baseUrl: "media.seedwave.faa.zone",
    brands: [{ name: "SoundWave", subnodes: ["VisualSync", "SonicForge"] }]
  },
  "nutrition": {
    name: "✿ Nutrition & Food Chain",
    repoName: "nutrition-seedwave-admin",
    baseUrl: "nutrition.seedwave.faa.zone",
    brands: [{ name: "NutriFlow", subnodes: ["FoodTrace", "YieldOpt"] }]
  },
  "packaging": {
    name: "📦 Packaging & Materials",
    repoName: "packaging-seedwave-admin",
    baseUrl: "packaging.seedwave.faa.zone",
    brands: [{ name: "PackOpt", subnodes: ["MaterialFlow", "SustainPack"] }]
  },
  "quantum": {
    name: "✴️ Quantum Protocols",
    repoName: "quantum-seedwave-admin",
    baseUrl: "quantum.seedwave.faa.zone",
    brands: [{ name: "QuantumMesh", subnodes: ["EntangleNet", "QuantumVault"] }]
  },
  "ritual": {
    name: "☯ Ritual & Culture",
    repoName: "ritual-seedwave-admin",
    baseUrl: "ritual.seedwave.faa.zone",
    brands: [{ name: "CultureLink", subnodes: ["RitualFlow", "TraditionKeep"] }]
  },
  "saas": {
    name: "🔑 SaaS & Licensing",
    repoName: "saas-seedwave-admin",
    baseUrl: "saas.seedwave.faa.zone",
    brands: [{ name: "LicenseFlow", subnodes: ["SaaSVault", "KeyManage"] }]
  },
  "trade": {
    name: "🧺 Trade Systems",
    repoName: "trade-seedwave-admin",
    baseUrl: "trade.seedwave.faa.zone",
    brands: [{ name: "TradeFlow", subnodes: ["MarketMesh", "ExchangeNet"] }]
  },
  "utilities": {
    name: "🔋 Utilities & Energy",
    repoName: "utilities-seedwave-admin",
    baseUrl: "utilities.seedwave.faa.zone",
    brands: [{ name: "PowerGrid", subnodes: ["EnergyFlow", "GridSync"] }]
  },
  "voice": {
    name: "🎙️ Voice & Audio",
    repoName: "voice-seedwave-admin",
    baseUrl: "voice.seedwave.faa.zone",
    brands: [{ name: "VoiceSync", subnodes: ["AudioFlow", "SpeechNet"] }]
  },
  "webless": {
    name: "📡 Webless Tech & Nodes",
    repoName: "webless-seedwave-admin",
    baseUrl: "webless.seedwave.faa.zone",
    brands: [{ name: "NodeMesh", subnodes: ["OfflineSync", "EdgeNet"] }]
  },
  "nft": {
    name: "🔁 NFT & Ownership",
    repoName: "nft-seedwave-admin",
    baseUrl: "nft.seedwave.faa.zone",
    brands: [{ name: "AssetChain", subnodes: ["OwnershipFlow", "NFTVault"] }]
  },
  "education-youth": {
    name: "🎓 Education & Youth",
    repoName: "education-youth-seedwave-admin",
    baseUrl: "education-youth.seedwave.faa.zone",
    brands: [{ name: "LearnFlow", subnodes: ["YouthNet", "SkillMesh"] }]
  },
  "zerowaste": {
    name: "♻️ Zero Waste",
    repoName: "zerowaste-seedwave-admin",
    baseUrl: "zerowaste.seedwave.faa.zone",
    brands: [{ name: "WasteFlow", subnodes: ["RecycleNet", "ZeroMesh"] }]
  },
  "professional": {
    name: "🧾 Professional Services",
    repoName: "professional-seedwave-admin",
    baseUrl: "professional.seedwave.faa.zone",
    brands: [{ name: "ProFlow", subnodes: ["ServiceMesh", "ClientNet"] }]
  },
  "payroll-mining": {
    name: "🪙 Payroll Mining & Accounting",
    repoName: "payroll-mining-seedwave-admin",
    baseUrl: "payroll-mining.seedwave.faa.zone",
    brands: [{ name: "PayrollMine", subnodes: ["AcctFlow", "WageSync"] }]
  },
  "mining": {
    name: "⛏️ Mining & Resources",
    repoName: "mining-seedwave-admin",
    baseUrl: "mining.seedwave.faa.zone",
    brands: [{ name: "ResourceFlow", subnodes: ["MineSync", "ExtractNet"] }]
  },
  "wildlife": {
    name: "🦁 Wildlife & Habitat",
    repoName: "wildlife-seedwave-admin",
    baseUrl: "wildlife.seedwave.faa.zone",
    brands: [{ name: "WildFlow", subnodes: ["HabitatNet", "ConserveSync"] }]
  },
  "admin-panel": {
    name: "⚙️ Admin Panel",
    repoName: "admin-panel-seedwave-admin",
    baseUrl: "admin-panel.seedwave.faa.zone",
    brands: [{ name: "AdminFlow", subnodes: ["ConfigMesh", "ManageNet"] }]
  }
};

interface OmnilevelSelectorProps {
  onSectorSelect?: (sectorKey: string, sectorData: any) => void;
  selectedSectors?: string[];
  multiSelect?: boolean;
  showBrands?: boolean;
}

export function OmnilevelSelector({ 
  onSectorSelect, 
  selectedSectors = [], 
  multiSelect = false,
  showBrands = true 
}: OmnilevelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);
  const [selectedSectorsList, setSelectedSectorsList] = useState<string[]>(selectedSectors);
  const [aiMode, setAiMode] = useState(false);

  const getAIRecommendations = (query: string): Array<{key: string, sector: any, relevanceScore: number}> => {
    if (!query) return [];
    
    const queryLower = query.toLowerCase();
    const recommendations: Array<{key: string, sector: any, relevanceScore: number}> = [];
    
    Object.entries(allSectorsData).forEach(([key, sector]) => {
      const sectorName = sector.name.toLowerCase();
      const keywords = [
        ...sector.brands.map((b: any) => b.name.toLowerCase()),
        ...sector.brands.flatMap((b: any) => b.subnodes.map((s: string) => s.toLowerCase())),
        sector.repoName.toLowerCase(),
        sector.baseUrl.toLowerCase()
      ];
      
      const relevanceScore = keywords.filter((k: string) => k.includes(queryLower)).length;
      if (sectorName.includes(queryLower) || relevanceScore > 0) {
        recommendations.push({ key, sector, relevanceScore });
      }
    });
    
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 8);
  };

  const filteredSectors = searchQuery 
    ? getAIRecommendations(searchQuery).map(r => ({ key: r.key, ...r.sector }))
    : Object.entries(allSectorsData).map(([key, data]) => ({ key, ...data }));

  const toggleSectorExpansion = (sectorKey: string) => {
    setExpandedSectors(prev => 
      prev.includes(sectorKey) 
        ? prev.filter(s => s !== sectorKey)
        : [...prev, sectorKey]
    );
  };

  const handleSectorSelect = (sectorKey: string, sectorData: any) => {
    if (multiSelect) {
      const newSelection = selectedSectorsList.includes(sectorKey)
        ? selectedSectorsList.filter(s => s !== sectorKey)
        : [...selectedSectorsList, sectorKey];
      setSelectedSectorsList(newSelection);
    } else {
      setSelectedSectorsList([sectorKey]);
    }
    
    onSectorSelect?.(sectorKey, sectorData);
  };

  const completeSelection = () => {
    const completedSectors = [...selectedSectorsList];
    
    selectedSectorsList.forEach(sectorKey => {
      const sector = allSectorsData[sectorKey as keyof typeof allSectorsData];
      if (sector) {
        Object.entries(allSectorsData).forEach(([key, data]) => {
          if (!completedSectors.includes(key)) {
            const hasSharedKeywords = sector.brands.some((brand: any) =>
              data.brands.some((otherBrand: any) => 
                brand.subnodes.some((node: string) => 
                  otherBrand.subnodes.some((otherNode: string) => 
                    node.toLowerCase().includes('vault') && otherNode.toLowerCase().includes('vault')
                  )
                )
              )
            );
            
            if (hasSharedKeywords && completedSectors.length < 8) {
              completedSectors.push(key);
            }
          }
        });
      }
    });
    
    setSelectedSectorsList(completedSectors);
  };

  return (
    <div className="space-y-6" data-testid="omnilevel-selector">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="title-omnilevel">
            🧠 Omnilevel Sector Selection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete sector selection powered by AI logic from seedwave.faa.zone
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAiMode(!aiMode)}
            variant={aiMode ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2"
            data-testid="button-ai-mode"
          >
            <Brain className="w-4 h-4" />
            AI Mode
          </Button>
          {selectedSectorsList.length > 0 && (
            <Button
              onClick={completeSelection}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              size="sm"
              data-testid="button-complete-selection"
            >
              <Sparkles className="w-4 h-4" />
              Complete Selection
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search sectors, brands, or capabilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-sectors"
        />
      </div>

      {selectedSectorsList.length > 0 && (
        <Card data-testid="selected-sectors-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Selected Sectors ({selectedSectorsList.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSectorsList.map(sectorKey => (
                <Badge 
                  key={sectorKey}
                  variant="default"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  data-testid={`selected-sector-badge-${sectorKey}`}
                >
                  {sectorList[sectorKey as keyof typeof sectorList]?.name || sectorKey}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sector) => {
          const isSelected = selectedSectorsList.includes(sector.key);
          const isExpanded = expandedSectors.includes(sector.key);
          
          return (
            <Card 
              key={sector.key}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSectorSelect(sector.key, sector)}
              data-testid={`sector-card-${sector.key}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold dark:text-white">
                    {sector.name}
                  </CardTitle>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-green-500" data-testid={`selected-icon-${sector.key}`} />
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {sector.baseUrl}
                </div>
              </CardHeader>
              
              {showBrands && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {sector.brands.slice(0, isExpanded ? sector.brands.length : 1).map((brand: any, idx: number) => (
                      <div key={idx} className="text-sm" data-testid={`brand-${sector.key}-${idx}`}>
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {brand.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1 mt-1">
                          {brand.subnodes.slice(0, 3).map((node: string, nodeIdx: number) => (
                            <Badge key={nodeIdx} variant="outline" className="text-xs px-1 py-0">
                              {node}
                            </Badge>
                          ))}
                          {brand.subnodes.length > 3 && (
                            <span className="text-xs">+{brand.subnodes.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {sector.brands.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectorExpansion(sector.key);
                        }}
                        className="text-xs h-6 p-1"
                        data-testid={`button-expand-${sector.key}`}
                      >
                        <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        {isExpanded ? 'Show Less' : `Show ${sector.brands.length - 1} More`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {aiMode && searchQuery && (
        <Card data-testid="ai-recommendations">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Based on your search "{searchQuery}", these sectors show high relevance:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              {getAIRecommendations(searchQuery).slice(0, 4).map(({ key, sector, relevanceScore }) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSectorSelect(key, sector)}
                  className="text-xs h-auto p-2 flex flex-col items-start"
                  data-testid={`ai-recommendation-${key}`}
                >
                  <div className="font-medium">{sector.name}</div>
                  <div className="text-xs text-gray-500">Score: {relevanceScore}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
