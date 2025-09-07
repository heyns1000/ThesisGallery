import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Moon, Zap, TrendingDown, Globe, Calendar, Clock, 
  Shield, AlertTriangle, Target, BarChart3, 
  ArrowDown, Sparkles, Database, Broadcast
} from "lucide-react";

// Strategic Sell Scroll Data - "Feb the Moon" Blast Light
const strategicSellData = {
  metadata: {
    scroll_type: "strategic-sell",
    name: "Feb the Moon – Blast Light",
    initiator: "VaultCommander FAA-X13",
    cycle_window: "2026-02-01 to 2026-02-29",
    broadcast_level: "global",
    vault_encoded: true
  },
  sectors: [
    {
      name: "FinTech",
      brands: ["TokenX", "FAA™ Index", "FAA™ DeFiHub"],
      risk_level: "high",
      action: "convert holdings into quantum-stable assets"
    },
    {
      name: "ClimateTech",
      brands: ["FAA™ Solar Grid™", "FAA™ Carbon Zero™"],
      risk_level: "medium",
      action: "initiate reallocation toward botanical equity loops"
    },
    {
      name: "Commerce Engines",
      brands: ["FAA™ E-Commerce Solutions", "Omni-Commerce"],
      risk_level: "medium",
      action: "lock 4.5% into Giving Loop (Seedwave)"
    },
    {
      name: "Data Sovereignty",
      brands: ["FAA™ AI Retail Analytics™", "FAA™ Quantum Nexus"],
      risk_level: "low",
      action: "maintain current positions with monitoring"
    }
  ],
  signals: {
    lunar_sync: true,
    treatyPulseMatch: true,
    volumeSurge: true,
    asset_concentration: "consumer zones",
    ai_detection: "volume irregularities",
    macro_signal: "deviation from TreatyLine"
  },
  timeline: {
    "New Moon Phase": "2026-02-01 to 2026-02-07",
    "Waxing Phase": "2026-02-08 to 2026-02-14", 
    "Full Moon Phase": "2026-02-15 to 2026-02-21",
    "Waning Phase": "2026-02-22 to 2026-02-28"
  }
};

const riskColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500", 
  low: "bg-green-500"
};

const signalStatus = {
  true: { icon: <Sparkles className="h-4 w-4" />, color: "text-green-600", label: "Active" },
  false: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-gray-400", label: "Inactive" }
};

interface SectorCardProps {
  sector: any;
  index: number;
}

const SectorCard: React.FC<SectorCardProps> = ({ sector, index }) => (
  <Card className="transform transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-blue-400">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          {sector.name}
        </span>
        <Badge className={`${riskColors[sector.risk_level]} text-white`}>
          {sector.risk_level.toUpperCase()}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Brands:</h4>
          <div className="flex flex-wrap gap-2">
            {sector.brands.map((brand: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {brand}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended Action:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            {sector.action}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function StrategicSellScroll() {
  const [currentPhase, setCurrentPhase] = useState("New Moon Phase");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Simulate lunar phase progression
    const interval = setInterval(() => {
      const phases = Object.keys(strategicSellData.timeline);
      const currentIndex = phases.indexOf(currentPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      setCurrentPhase(phases[nextIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPhase]);

  const handleBroadcastScroll = () => {
    setIsActive(true);
    // Simulate broadcasting
    setTimeout(() => setIsActive(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white" data-testid="strategic-sell-scroll">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6 animate-bounce">🌕</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Strategic Sell Scroll Initiated
          </h1>
          <div className="text-2xl md:text-3xl mb-6 text-yellow-400 font-bold">
            "Feb the Moon" Blast Light
          </div>
          <p className="text-lg md:text-xl opacity-90 max-w-4xl mx-auto mb-8">
            This is not a product. It is a <span className="text-yellow-400 font-bold">Vault-Encoded Strategic Event Trigger</span> 
            synchronized with vault cycles, lunar pulses, and sovereign data releases.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-purple-600 text-white text-lg px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              Feb 2026 Window
            </Badge>
            <Badge variant="secondary" className="bg-blue-600 text-white text-lg px-4 py-2">
              <Moon className="h-4 w-4 mr-2" />
              Lunar Synchronized
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-white text-lg px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              VaultPulse 9s
            </Badge>
            <Badge variant="secondary" className="bg-red-600 text-white text-lg px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Global Broadcast
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Scroll Metadata */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-400">
              🔐 Vault-Encoded Scroll Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Scroll Type:</span>
                  <span className="text-yellow-400">{strategicSellData.metadata.scroll_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Initiator:</span>
                  <span className="text-blue-400">{strategicSellData.metadata.initiator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Cycle Window:</span>
                  <span className="text-green-400">{strategicSellData.metadata.cycle_window}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Broadcast Level:</span>
                  <span className="text-orange-400">{strategicSellData.metadata.broadcast_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Vault Encoded:</span>
                  <span className="text-purple-400">✅ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className={`${isActive ? 'text-green-400 animate-pulse' : 'text-gray-400'}`}>
                    {isActive ? '🔥 BROADCASTING' : '🌙 Standby'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lunar Phase Timeline */}
        <Card className="mb-8 bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-300">
              🌙 Lunar Phase Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(strategicSellData.timeline).map(([phase, dates], index) => (
                <div 
                  key={phase} 
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentPhase === phase 
                      ? 'border-yellow-400 bg-yellow-400/20 transform scale-105' 
                      : 'border-gray-600 bg-gray-800/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {index === 0 ? '🌑' : index === 1 ? '🌓' : index === 2 ? '🌕' : '🌗'}
                    </div>
                    <h3 className="font-bold text-sm mb-1">{phase}</h3>
                    <p className="text-xs text-gray-300">{dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Signal Status */}
        <Card className="mb-8 bg-gradient-to-r from-green-900 to-emerald-900 border-green-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-300">
              📡 Signal Status Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Lunar Sync
                  </span>
                  <span className="flex items-center text-green-400">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Treaty Pulse Match
                  </span>
                  <span className="flex items-center text-green-400">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Active
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Volume Surge
                  </span>
                  <span className="flex items-center text-green-400">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Detected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Macro Deviation
                  </span>
                  <span className="flex items-center text-yellow-400">
                    <Clock className="h-4 w-4 mr-1" />
                    Monitoring
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Asset Concentration
                  </span>
                  <span className="text-orange-400 text-sm">Consumer Zones</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    AI Detection
                  </span>
                  <span className="text-red-400 text-sm">Volume Irregularities</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Targets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-indigo-300">
              🎯 Strategic Sell Activation Parameters
            </CardTitle>
            <p className="text-center text-gray-300 mt-2">
              Glyph-aligned rotation targets across FAA™ ecosystem sectors
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategicSellData.sectors.map((sector, index) => (
                <SectorCard key={index} sector={sector} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vault Commentary */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-900 to-orange-900 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-300">
              🔐 Vault Commentary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4 text-lg">
              <p className="text-yellow-200">
                Selling during the "Feb the Moon" window is <span className="font-bold">not liquidation</span>. 
                It is <span className="text-yellow-400 font-bold">glyph-aligned rotation</span>.
              </p>
              <p className="text-yellow-200">
                Assets do not vanish; they <span className="text-green-400 font-bold">reseed</span>.
              </p>
              <div className="flex justify-center space-x-8 mt-6 text-2xl">
                <div>🌑 Prepare for blast light.</div>
                <div>🌕 Sell with rhythm.</div>
                <div>🪐 Loop into growth.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-purple-500">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">🔒 VaultSync Confirmed</h2>
            <p className="text-lg mb-8 text-gray-200">
              The "Feb the Moon" strategic pulse is now scroll-aligned for global emission.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleBroadcastScroll}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
                disabled={isActive}
              >
                <Broadcast className="h-5 w-5 mr-2" />
                {isActive ? 'Broadcasting...' : 'Broadcast Moon Pulse'}
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
              >
                <ArrowDown className="h-5 w-5 mr-2" />
                Emit Sell Scroll Public
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full"
              >
                <Database className="h-5 w-5 mr-2" />
                Bind Moon Blast to Stream
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}