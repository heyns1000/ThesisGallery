import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Activity, Layers, Database } from "lucide-react";
import type { Brand, Sector } from "@shared/schema";

interface SectorZone {
  key: string;
  name: string;
  emoji: string;
  subdomain: string;
  totalBrands: number;
  activeBrands: number;
  repositories: string[];
  description: string;
  integrations: number;
  status: "active" | "maintenance" | "development";
}

export default function EcosystemExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  });
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const sectorZones: SectorZone[] = [
    {
      key: "agriculture",
      name: "Agriculture & Biotech",
      emoji: "🌱",
      subdomain: "agriculture.seedwave.faa.zone",
      totalBrands: 84,
      activeBrands: 56,
      repositories: ["agriculture-seedwave-admin", "biotech-core", "crop-analytics"],
      description: "Agriculture & Biotech solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "banking",
      name: "Banking & Finance",
      emoji: "🏦",
      subdomain: "banking.seedwave.faa.zone",
      totalBrands: 60,
      activeBrands: 40,
      repositories: ["banking-seedwave-admin", "finance-core", "payment-systems"],
      description: "Banking & Finance solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "logistics",
      name: "Logistics & Packaging",
      emoji: "📦",
      subdomain: "logistics.seedwave.faa.zone",
      totalBrands: 30,
      activeBrands: 20,
      repositories: ["logistics-seedwave-admin", "packaging-core", "supply-chain"],
      description: "Logistics & Packaging solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "professional",
      name: "Professional Services",
      emoji: "💼",
      subdomain: "professional.seedwave.faa.zone",
      totalBrands: 30,
      activeBrands: 20,
      repositories: ["professional-seedwave-admin", "services-core", "consulting"],
      description: "Professional Services solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "saas",
      name: "SaaS & Licensing",
      emoji: "💻",
      subdomain: "saas.seedwave.faa.zone",
      totalBrands: 20,
      activeBrands: 13,
      repositories: ["saas-seedwave-admin", "licensing-core", "software-platforms"],
      description: "SaaS & Licensing solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "nft",
      name: "NFT & Ownership",
      emoji: "🎨",
      subdomain: "nft.seedwave.faa.zone",
      totalBrands: 20,
      activeBrands: 13,
      repositories: ["nft-seedwave-admin", "ownership-core", "blockchain-assets"],
      description: "NFT & Ownership solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "quantum",
      name: "Quantum Protocols",
      emoji: "⚛️",
      subdomain: "quantum.seedwave.faa.zone",
      totalBrands: 20,
      activeBrands: 13,
      repositories: ["quantum-seedwave-admin", "protocols-core", "quantum-systems"],
      description: "Quantum Protocols solutions and infrastructure",
      integrations: 3,
      status: "development"
    },
    {
      key: "ritual",
      name: "Ritual & Culture",
      emoji: "🎭",
      subdomain: "ritual.seedwave.faa.zone",
      totalBrands: 20,
      activeBrands: 13,
      repositories: ["ritual-seedwave-admin", "culture-core", "tradition-systems"],
      description: "Ritual & Culture solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "nutrition",
      name: "Nutrition & Food Chain",
      emoji: "🍎",
      subdomain: "nutrition.seedwave.faa.zone",
      totalBrands: 20,
      activeBrands: 13,
      repositories: ["nutrition-seedwave-admin", "food-chain-core", "health-systems"],
      description: "Nutrition & Food Chain solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "zerowaste",
      name: "Zero Waste",
      emoji: "♻️",
      subdomain: "zerowaste.seedwave.faa.zone",
      totalBrands: 20,
      activeBrands: 13,
      repositories: ["zerowaste-seedwave-admin", "sustainability-core", "waste-systems"],
      description: "Zero Waste solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "voice",
      name: "Voice & Audio",
      emoji: "🎤",
      subdomain: "voice.seedwave.faa.zone",
      totalBrands: 12,
      activeBrands: 8,
      repositories: ["voice-seedwave-admin", "audio-core", "sound-systems"],
      description: "Voice & Audio solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "wellness",
      name: "Wellness Tech & Nodes",
      emoji: "🧘",
      subdomain: "wellness.seedwave.faa.zone",
      totalBrands: 12,
      activeBrands: 8,
      repositories: ["wellness-seedwave-admin", "health-tech-core", "node-systems"],
      description: "Wellness Tech & Nodes solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "utilities",
      name: "Utilities & Energy",
      emoji: "⚡",
      subdomain: "utilities.seedwave.faa.zone",
      totalBrands: 12,
      activeBrands: 8,
      repositories: ["utilities-seedwave-admin", "energy-core", "power-systems"],
      description: "Utilities & Energy solutions and infrastructure",
      integrations: 3,
      status: "active"
    },
    {
      key: "creative",
      name: "Creative Tech",
      emoji: "🎨",
      subdomain: "creative.seedwave.faa.zone",
      totalBrands: 10,
      activeBrands: 7,
      repositories: ["creative-seedwave-admin", "tech-core", "innovation-systems"],
      description: "Creative Tech solutions and infrastructure",
      integrations: 3,
      status: "active"
    }
  ];

  const filteredZones = sectorZones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBrands = brands.length;
  const totalActive = brands.filter(b => b.status === "active").length;
  const totalNodes = sectors.reduce((sum, s) => sum + (s.subnodeCount || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "maintenance": return "bg-yellow-500";
      case "development": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const handleZoneAccess = (subdomain: string) => {
    window.open(`https://${subdomain}`, '_blank');
  };

  return (
    <div className="space-y-6" data-testid="ecosystem-explorer">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2" data-testid="title-ecosystem">🌐 Fruitful Global Ecosystem Explorer</h1>
        <p className="text-blue-100">Complete omnilevel integration: 7,038 brands across 33 sectors</p>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-200">🌱 FAA.ZONE™</span>
            <span className="text-blue-200">🌊 Seedwave™</span>
            <span className="text-blue-200">🍊 Fruitful</span>
            <span className="text-blue-200">🔒 VaultMesh™</span>
            <span className="text-blue-200">⚠️ HotStack</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500" data-testid="card-total-brands">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Brands</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="stat-total-brands">{totalBrands}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500" data-testid="card-core-brands">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Core Brands</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="stat-core-brands">{totalActive}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500" data-testid="card-sub-nodes">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sub Nodes</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400" data-testid="stat-sub-nodes">{totalNodes}</p>
              </div>
              <Layers className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500" data-testid="card-total-sectors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sectors</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400" data-testid="stat-total-sectors">{sectors.length}</p>
              </div>
              <Layers className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search sectors by name or subdomain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => (
          <Card key={zone.key} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500" data-testid={`zone-card-${zone.key}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" data-testid={`zone-emoji-${zone.key}`}>{zone.emoji}</span>
                  <div>
                    <CardTitle className="text-sm font-semibold dark:text-white" data-testid={`zone-name-${zone.key}`}>{zone.name}</CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400" data-testid={`zone-subdomain-${zone.key}`}>{zone.subdomain}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(zone.status)}`} data-testid={`zone-status-${zone.key}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between" data-testid={`zone-total-${zone.key}`}>
                    <span className="text-gray-600 dark:text-gray-400">Total Brands</span>
                    <span className="font-bold">{zone.totalBrands}</span>
                  </div>
                  <div className="flex justify-between" data-testid={`zone-active-${zone.key}`}>
                    <span className="text-gray-600 dark:text-gray-400">Active</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{zone.activeBrands}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${(zone.activeBrands / zone.totalBrands) * 100}%` }}
                    data-testid={`zone-progress-${zone.key}`}
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {zone.repositories.slice(0, 2).map((repo, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs" data-testid={`zone-repo-${zone.key}-${idx}`}>{repo}</Badge>
                  ))}
                  {zone.repositories.length > 2 && (
                    <Badge variant="secondary" className="text-xs">+{zone.repositories.length - 2}</Badge>
                  )}
                </div>

                <Button 
                  size="sm" 
                  className="w-full" 
                  onClick={() => handleZoneAccess(zone.subdomain)}
                  data-testid={`button-access-zone-${zone.key}`}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Access Zone
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card data-testid="integration-status">
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Omnilevel integration across all platforms
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1" data-testid="integration-vaultmesh">VaultMesh™</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              <Badge className="bg-green-500 text-white mt-1">Core 44%</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1" data-testid="integration-hotstack">HotStack</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              <Badge className="bg-blue-500 text-white mt-1">Deploy 33%</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1" data-testid="integration-faa">FAA.ZONE™</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              <Badge className="bg-orange-500 text-white mt-1">Hub 23%</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1" data-testid="integration-seedwave">Seedwave™</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              <Badge className="bg-purple-500 text-white mt-1">Admin</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
