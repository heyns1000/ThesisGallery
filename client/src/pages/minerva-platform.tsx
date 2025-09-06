import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const pricingTiers = [
  {
    name: "Basic",
    price: "$499",
    period: "/month",
    description: "Batch drill scoring + standard compliance report",
    features: [
      "Manual batch zones",
      "Local terrain scans", 
      "Dashboard view",
      "1-node limit"
    ],
    color: "blue"
  },
  {
    name: "Standard", 
    price: "$899",
    period: "/month",
    description: "ESG overlay + 9s refresh terrain analysis",
    features: [
      "Live FAA AI zone overlays",
      "QA metrics",
      "GlowFlow™ + forecasting",
      "ESG export"
    ],
    color: "blue"
  },
  {
    name: "Premium",
    price: "$1,599", 
    period: "/month",
    description: "TreatyMesh™ activated + Smart QA sync",
    features: [
      "9s AI loop refresh",
      "ClauseIndex™ insights",
      "PulseGrid™ metrics",
      "TreatyMesh™ triggers"
    ],
    color: "blue",
    highlighted: true
  },
  {
    name: "Master License",
    price: "$22,000",
    period: "/year per jurisdiction",
    description: "Regional override + FAA audit entry",
    features: [
      "Full FAA node override",
      "Cross-region sync",
      "Public FAA API access",
      "Export triggers"
    ],
    color: "blue"
  }
];

const activeTerritories = [
  {
    country: "🇦🇺 Australia",
    description: "Remote drill zones + full PulseGrid™ access",
    status: "active",
    nodes: 12
  },
  {
    country: "🇦🇴 Angola", 
    description: "Mineral corridors flagged for smart valuation",
    status: "active",
    nodes: 8
  },
  {
    country: "🇲🇼 Malawi",
    description: "Real-time yield predictions + audit sync", 
    status: "active",
    nodes: 6
  }
];

export default function MinervaplatForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-blue-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-blue-400">
              🧠 Minerva™ Geological Forecasting AI
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              FAA Vault-Synced Brand • Geological Forecasting AI • PulseGrid™ Native
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/mining-dashboard">
              <Button className="bg-blue-600 hover:bg-blue-500" data-testid="button-mining-dashboard">
                ⛏️ Mining Hub
              </Button>
            </Link>
            <Button className="bg-white text-black hover:bg-gray-200">
              📞 Book Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-blue-400 mb-4">
          Minerva™
        </h2>
        <p className="text-lg text-white/70 mb-2">Geological Forecasting AI | FAA Vault-Synced Brand</p>
        <p className="text-sm text-blue-300 italic">FAA-CERT-MFORGE-2025 · Pulse-Tracked · Node-Verified</p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Product Summary */}
        <section className="max-w-5xl mx-auto">
          <Card className="bg-slate-900 border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-300">Product Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-sm">
                Minerva™ is an FAA-certified geological AI engine that forecasts mineral yield, grade probability, 
                and terrain safety using real-time drill data. Activated in Australia, Angola, and Malawi, it operates 
                as a sovereign-grade extraction layer under FAA VaultChain™. Integrated with PulseGrid™, it enables 
                compliant forecasting, export scoring, and ESG-tethered analysis.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* SaaS Licensing & Active Territories */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-blue-500">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">SaaS Licensing Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span className="font-semibold">Basic:</span>
                    <span>$499/month</span>
                  </div>
                  <p className="text-xs">Batch drill scoring + standard compliance report</p>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Standard:</span>
                    <span>$899/month</span>
                  </div>
                  <p className="text-xs">ESG overlay + 9s refresh terrain analysis</p>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Premium:</span>
                    <span>$1,599/month</span>
                  </div>
                  <p className="text-xs">TreatyMesh™ activated + Smart QA sync</p>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Master License:</span>
                    <span>$22,000/year</span>
                  </div>
                  <p className="text-xs">Regional override + FAA audit entry</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-blue-500">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">Active Territories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-white/70">
                  {activeTerritories.map((territory, index) => (
                    <div key={index} className="border-b border-gray-600 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-200">{territory.country}</span>
                        <Badge className="bg-green-100 text-green-800">
                          {territory.nodes} nodes
                        </Badge>
                      </div>
                      <p className="text-xs mt-1">{territory.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PulseGrid Integration */}
        <section className="max-w-5xl mx-auto">
          <Card className="bg-blue-900/20 border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg text-blue-300">PulseGrid™ Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">
                Minerva™ is PulseGrid™ native. It performs a 9-second forecasting loop across yield clusters, 
                geo-risk bands, and slope prediction zones. Data is hash-synced into FAA LedgerMesh™ and 
                authenticated under FAA Trace Protocols. GlowFlow™ enforces regulatory-grade continuity.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Table */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-blue-400">
            💰 Licensing Structure
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`bg-slate-900 ${tier.highlighted ? 'border-blue-400 border-4' : 'border-blue-600'}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-300">
                    {tier.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-blue-400">{tier.price}</span>
                    <span className="text-sm opacity-70"> {tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.highlighted ? 'bg-blue-400 text-black hover:bg-blue-300' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAA Smart Compliance Layer */}
        <section className="max-w-5xl mx-auto">
          <Card className="bg-slate-900 border-blue-400">
            <CardHeader>
              <CardTitle className="text-xl text-blue-200">FAA Smart Compliance Layer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">
                All licensing tiers operate within the FAA ClauseIndex™ compliance engine. Signals are governed 
                via GLUP Logic™ and routed to public dashboards through TreatyMesh™ observability. Every zone 
                forecast is trace-locked with zero-orphan state enforcement.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-blue-400 font-bold">GLUP Enforced</div>
                  <div className="text-gray-400">Lifecycle expiry + revocation triggers</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">AuditTrack™</div>
                  <div className="text-gray-400">PulseGrid logs injected into LedgerMesh™</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">TreatyMesh™ Active</div>
                  <div className="text-gray-400">Global public zone monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-blue-500">
        FAA VaultChain Protocol · Trace-Locked · ClauseIndex Synced · OmniSynced · PulseGrid Ready · EthicsLocked · FAA.Zone Sovereign Grid
      </footer>
    </div>
  );
}