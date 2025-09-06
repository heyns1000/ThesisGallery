import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const housingPlatforms = [
  {
    id: "cornex",
    name: "🏗️ Cornex™",
    subtitle: "AI-Driven Manufacturing & Distribution",
    description: "Complete EPS cornice production ecosystem with 4 private label brands and provincial expansion",
    status: "active",
    modules: ["TrimStyle™", "DesignAura™", "CorniceCraft™", "CeilingTech™"],
    stats: { provinces: 9, nodes: "3000+", automation: "99%" },
    pricing: "From R750k factory setup",
    color: "indigo",
    link: "/cornex-platform"
  },
  {
    id: "realestate-ai",
    name: "🏡 FAA Real Estate AI™",
    subtitle: "Valuation Intelligence & Market Forecasting",
    description: "AI-powered property valuations, mortgage risk engine, and market trend analysis",
    status: "active",
    modules: ["Valuation AI", "Mortgage Grid", "Market Forecast", "Risk Matrix"],
    stats: { accuracy: "95%", speed: "Instant", coverage: "SA-wide" },
    pricing: "SaaS from R499/month",
    color: "green",
    link: "/realestate-platform"
  }
];

const cornexBrands = [
  {
    name: "✏️ TrimStyle™",
    description: "Premium Cornice Systems",
    focus: "High-end trims, moldings, luxury cornices for wholesale distribution",
    market: "Premium residential and commercial"
  },
  {
    name: "🔮 DesignAura™",
    description: "Virtual Interior Styling Systems",
    focus: "AI-powered virtual modeling and room design visualization",
    market: "Contractors, developers, end-buyers"
  },
  {
    name: "🧩 CorniceCraft™",
    description: "Industrial EPS Production Solutions",
    focus: "Mass-scale EPS cornice production with automated manufacturing",
    market: "Grid-scale rollouts across provinces"
  },
  {
    name: "🧱 CeilingTech™",
    description: "Lightweight Ceiling Frameworks",
    focus: "Engineered EPS ceiling grids with high load capacity",
    market: "Mass deployment under housing mandates"
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    indigo: "border-indigo-500 bg-indigo-900/10 text-indigo-300",
    green: "border-green-500 bg-green-900/10 text-green-300",
    blue: "border-blue-500 bg-blue-900/10 text-blue-300"
  };
  return colors[color as keyof typeof colors] || colors.indigo;
};

const ecosystemStats = [
  { label: "Housing Nodes Active", value: "3000+", trend: "up" },
  { label: "Private Label Brands", value: "4", trend: "stable" },
  { label: "Provincial Coverage", value: "9/9", trend: "complete" },
  { label: "AI Automation Rate", value: "99%", trend: "optimal" }
];

export default function HousingDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/system/stats"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-indigo-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              🏛️ Housing Sector Intelligence Hub
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              FAA.Zone Sovereign Scrolls • Housing Infrastructure Grid • VaultMesh Memory Certified
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/global-view">
              <Button className="bg-indigo-600 hover:bg-indigo-500" data-testid="button-global-view">
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
          <a href="#platforms" className="px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-600 transition">
            🏗️ Housing Platforms
          </a>
          <a href="#brands" className="px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-600 transition">
            🎨 Brand Portfolio
          </a>
          <a href="#analytics" className="px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-600 transition">
            📊 Market Intelligence
          </a>
          <a href="#factory" className="px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-600 transition">
            🏭 Factory Setup
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-800 via-gray-900 to-black text-center py-16">
        <h2 className="text-4xl font-extrabold text-indigo-400 mb-4">
          FAA Housing Infrastructure Grid
        </h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-300 opacity-90">
          Complete ecosystem for manufacturing automation, real estate intelligence, and provincial expansion 
          across South Africa's housing sector.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Ecosystem Statistics */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            📊 Housing Ecosystem Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemStats.map((stat, index) => (
              <Card key={index} className="bg-gray-950 border-indigo-500">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-indigo-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="mt-2">
                    <Badge className={
                      stat.trend === 'up' ? 'bg-green-100 text-green-800' :
                      stat.trend === 'complete' ? 'bg-blue-100 text-blue-800' :
                      stat.trend === 'optimal' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {stat.trend === 'up' ? '↗' : 
                       stat.trend === 'complete' ? '✓' : 
                       stat.trend === 'optimal' ? '⚡' : '→'} {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Housing Platforms Grid */}
        <section id="platforms">
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🏗️ Housing Intelligence Platforms
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {housingPlatforms.map((platform) => (
              <Card key={platform.id} className={`bg-gray-950 ${getColorClasses(platform.color)} hover:scale-105 transition-transform`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{platform.name}</div>
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
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                          Launch Platform
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                        Launch Platform
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cornex Brand Portfolio */}
        <section id="brands" className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🎨 Cornex™ Brand Portfolio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cornexBrands.map((brand, index) => (
              <Card key={index} className="bg-gray-800/50 border-indigo-500">
                <CardContent className="p-6">
                  <h4 className="font-bold text-indigo-300 mb-2 text-lg">{brand.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">{brand.description}</p>
                  <p className="text-xs text-gray-400 mb-2"><strong>Focus:</strong> {brand.focus}</p>
                  <p className="text-xs text-gray-500"><strong>Market:</strong> {brand.market}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button className="bg-indigo-600 hover:bg-indigo-500">
              🎨 Explore Brand Licensing
            </Button>
          </div>
        </section>

        {/* Factory Setup Integration */}
        <section id="factory">
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🏭 Factory Setup & Ownership
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🏭</div>
                <div className="font-bold text-green-400">Complete Setup</div>
                <div className="text-sm text-gray-400">R750,000 total investment</div>
                <div className="text-xs text-gray-500 mt-2">4 payments of R187,500</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⚙️</div>
                <div className="font-bold text-blue-400">Full Equipment</div>
                <div className="text-sm text-gray-400">EPS cutting machines</div>
                <div className="text-xs text-gray-500 mt-2">Cloud inventory systems</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🔑</div>
                <div className="font-bold text-purple-400">Asset Ownership</div>
                <div className="text-sm text-gray-400">100% ownership transfer</div>
                <div className="text-xs text-gray-500 mt-2">After final payment</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Real Estate AI Integration */}
        <section id="analytics">
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🏡 FAA Real Estate AI™ Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-bold text-green-400">Valuation AI</div>
                <div className="text-sm text-gray-400">95% accuracy</div>
                <div className="text-xs text-gray-500 mt-2">Instant reports</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="font-bold text-yellow-400">Risk Matrix</div>
                <div className="text-sm text-gray-400">Mortgage risk engine</div>
                <div className="text-xs text-gray-500 mt-2">Real-time analysis</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="font-bold text-blue-400">Market Forecast</div>
                <div className="text-sm text-gray-400">Trend analysis</div>
                <div className="text-xs text-gray-500 mt-2">Predictive insights</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🔑</div>
                <div className="font-bold text-purple-400">API Access</div>
                <div className="text-sm text-gray-400">Integration ready</div>
                <div className="text-xs text-gray-500 mt-2">Developer portal</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-indigo-500">
        FAA.Zone Sovereign Scrolls • VaultMesh Memory Certified • TreatyMesh Housing Compliance • Housing Infrastructure Grid Active
      </footer>
    </div>
  );
}