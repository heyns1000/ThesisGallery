import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const miningPlatforms = [
  {
    id: "autoborn",
    name: "🚗 AutoBorn™",
    subtitle: "Self-Driving Mining Ecosystem",
    description: "AI-driven fleet coordination with 9-second PulseGrid™ sync and VaultChain™ security",
    status: "active",
    modules: ["Prime", "MinerLink", "VaultMesh"],
    stats: { fleets: 45, uptime: "99.7%", optimization: "+12%" },
    pricing: "From $38k/year",
    color: "yellow",
    link: "/autoborn-platform"
  },
  {
    id: "minerva",
    name: "🧠 Minerva™",
    subtitle: "Geological Forecasting AI",
    description: "FAA-certified geological AI engine for mineral yield and terrain safety forecasting",
    status: "active",
    modules: ["AI Forecasting", "Zone Analysis", "Export Scoring"],
    stats: { territories: 3, forecasts: "9s loop", accuracy: "95%" },
    pricing: "From $499/month",
    color: "blue",
    link: "/minerva-platform"
  },
  {
    id: "mineforge",
    name: "⛓️ MineForge™",
    subtitle: "AI Blockchain Validation",
    description: "Ethical yield sync with tamper-proof digital validation and fraud detection",
    status: "active",
    modules: ["VaultChain", "PulseLoop", "ClawNode"],
    stats: { validations: 18392, accuracy: "94%", compliance: "100%" },
    pricing: "From $499/month",
    color: "orange"
  },
  {
    id: "orexcel",
    name: "📊 OreXcel™",
    subtitle: "Ore Quality Grading AI",
    description: "Visual ore grading with yield optimization and FAA Grid-Certified analysis",
    status: "active",
    modules: ["GLUP Logic", "PulseGrid", "ESG Suite"],
    stats: { avgGrade: "85%", minGrade: "78%", maxGrade: "91%" },
    pricing: "From $450/month",
    color: "yellow"
  },
  {
    id: "digium",
    name: "🛠️ Digium™",
    subtitle: "Autonomous Field Operations",
    description: "Intelligent coordination engine for equipment routing and autonomous shifts",
    status: "active",
    modules: ["TaskFluid AI", "FieldMesh", "GeoZone"],
    stats: { coordination: "24/7", efficiency: "+18%", zones: 12 },
    pricing: "From $499/month",
    color: "green"
  },
  {
    id: "mineralvision",
    name: "👁️ MineralVision™",
    subtitle: "Visual Terrain Validation",
    description: "Edge-AI visual analysis for surface inspection and anomaly detection",
    status: "active",
    modules: ["VisualCert", "GeoSync", "SmartLedger"],
    stats: { surfaces: 156, accuracy: "A-Grade", alerts: 23 },
    pricing: "From $350/month",
    color: "yellow"
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    yellow: "border-yellow-500 bg-yellow-900/10 text-yellow-300",
    orange: "border-orange-500 bg-orange-900/10 text-orange-300",
    green: "border-green-500 bg-green-900/10 text-green-300",
    blue: "border-blue-500 bg-blue-900/10 text-blue-300"
  };
  return colors[color as keyof typeof colors] || colors.yellow;
};

const ecosystemStats = [
  { label: "Total Mining Nodes", value: "127", trend: "up" },
  { label: "AI Modules Active", value: "15", trend: "stable" },
  { label: "VaultChain Uptime", value: "99.9%", trend: "stable" },
  { label: "PulseGrid Sync", value: "9s", trend: "optimal" }
];

export default function MiningDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/system/stats"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-orange-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              ⛏️ FAA Mining Ecosystem Hub
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Autonomous mining intelligence powered by VaultChain™ • PulseGrid™ synced every 9 seconds
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/global-view">
              <Button className="bg-orange-600 hover:bg-orange-500" data-testid="button-global-view">
                🌍 Global View
              </Button>
            </Link>
            <Link href="/vault-payments">
              <Button className="bg-white text-black hover:bg-gray-200" data-testid="button-vault-payments">
                💳 Vault Pay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black border-b border-gray-700 py-4">
        <div className="flex justify-center gap-4 text-sm">
          <a href="#platforms" className="px-4 py-2 border border-orange-600 rounded hover:bg-orange-600 transition">
            ⛏️ Mining Platforms
          </a>
          <a href="#analytics" className="px-4 py-2 border border-orange-600 rounded hover:bg-orange-600 transition">
            📊 Analytics Hub
          </a>
          <a href="#clausevault" className="px-4 py-2 border border-orange-600 rounded hover:bg-orange-600 transition">
            🧬 ClauseVault™
          </a>
          <a href="#pulse" className="px-4 py-2 border border-orange-600 rounded hover:bg-orange-600 transition">
            📡 PulseGrid™
          </a>
          <Link href="/heartbeat-dashboard">
            <a className="px-4 py-2 border border-cyan-600 rounded hover:bg-cyan-600 transition">
              🫀 Heartbeat
            </a>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-800 via-gray-900 to-black text-center py-16">
        <h2 className="text-4xl font-extrabold text-orange-400 mb-4">
          FAA Mining Intelligence Grid
        </h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-300 opacity-90">
          Five integrated platforms delivering autonomous mining operations with blockchain validation, 
          AI-powered optimization, and real-time compliance monitoring.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Ecosystem Statistics */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-orange-400">
            📊 Ecosystem Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemStats.map((stat, index) => (
              <Card key={index} className="bg-gray-950 border-orange-500">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="mt-2">
                    <Badge className={
                      stat.trend === 'up' ? 'bg-green-100 text-green-800' :
                      stat.trend === 'optimal' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {stat.trend === 'up' ? '↗' : stat.trend === 'optimal' ? '⚡' : '→'} {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mining Platforms Grid */}
        <section id="platforms">
          <h3 className="text-3xl font-bold text-center mb-8 text-orange-400">
            ⛏️ Mining Intelligence Platforms
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {miningPlatforms.map((platform) => (
              <Card key={platform.id} className={`bg-gray-950 ${getColorClasses(platform.color)} hover:scale-105 transition-transform`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold">{platform.name}</div>
                      <div className="text-sm opacity-80">{platform.subtitle}</div>
                    </div>
                    <Badge className={
                      platform.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {platform.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">{platform.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Core Modules:</h4>
                      <div className="flex flex-wrap gap-1">
                        {platform.modules.map((module, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Key Stats:</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {Object.entries(platform.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-bold">{value}</div>
                            <div className="opacity-70 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                    <span className="text-sm font-semibold">{platform.pricing}</span>
                    {platform.link ? (
                      <Link href={platform.link}>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-500">
                          Launch Platform
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-500">
                        Launch Platform
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAA ClauseVault Integration */}
        <section id="clausevault" className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400">
            🧬 FAA ClauseVault™ Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-cyan-500">
              <CardContent className="p-6">
                <h4 className="font-bold text-cyan-400 mb-2">⛓ Verifiable by Design</h4>
                <p className="text-sm text-gray-300">
                  Each clause is versioned, GLUP-audited, and trace-tracked. No edits are lost. 
                  Everything is anchored in chain logic.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-green-500">
              <CardContent className="p-6">
                <h4 className="font-bold text-green-400 mb-2">🧠 GLUP Validation Engine</h4>
                <p className="text-sm text-gray-300">
                  Every clause runs through the GLUP model to ensure logical integrity and 
                  ethical alignment before approval.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-pink-500">
              <CardContent className="p-6">
                <h4 className="font-bold text-pink-400 mb-2">🚀 Token-Ready</h4>
                <p className="text-sm text-gray-300">
                  Push any clause to the FAA Token Grid and turn it into a notarized legal artifact. 
                  Transparent. Immutable. Cross-linked.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-6">
            <Button className="bg-cyan-600 hover:bg-cyan-500">
              🧾 Access ClauseVault™
            </Button>
          </div>
        </section>

        {/* PulseGrid Monitoring */}
        <section id="pulse">
          <h3 className="text-3xl font-bold text-center mb-8 text-orange-400">
            📡 PulseGrid™ Live Monitoring
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🟢</div>
                <div className="font-bold text-green-400">VaultChain™</div>
                <div className="text-sm text-gray-400">Online • 99.9% uptime</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-bold text-blue-400">PulseGrid™</div>
                <div className="text-sm text-gray-400">9s sync • Active</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🔐</div>
                <div className="font-bold text-purple-400">GLUP Logic</div>
                <div className="text-sm text-gray-400">Validated • Secure</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🎁</div>
                <div className="font-bold text-yellow-400">GiftNode™</div>
                <div className="text-sm text-gray-400">Rewards active</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-orange-500">
        FAA VaultChain Protocol • PulseGrid™ Synced • ClauseIndex™ Secured • Mining Intelligence Grid Active
      </footer>
    </div>
  );
}