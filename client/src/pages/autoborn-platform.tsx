import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useInteractivity } from "@/lib/useInteractivity";

const scrollsData = [
  {
    id: 'scroll-9082',
    brand: 'AutoBorn™ Prime',
    icon: '🚗',
    type: 'Master Scroll',
    licenseFee: 'R12,000',
    monthly: 'R999 (Live)',
    royalty: '9.2% / Split: G',
    countdown: 42,
    vaultId: 'VAULT-092X-AUTO',
    region: 'SA | EU | APAC',
    base: 84,
    color: '#facc15',
  },
  {
    id: 'scroll-9083',
    brand: 'AutoBorn™ MinerLink',
    icon: '⛏️',
    type: 'Sub Scroll',
    licenseFee: 'R8,700',
    monthly: 'R760 (Node)',
    royalty: '6.1% / Split: L',
    countdown: 37,
    vaultId: 'VAULT-092X-MINER',
    region: 'BRZ | SA',
    base: 79,
    color: '#60a5fa',
  },
  {
    id: 'scroll-9084',
    brand: 'AutoBorn™ VaultMesh',
    icon: '📦',
    type: 'Deploy License',
    licenseFee: 'R15,400',
    monthly: 'R1,340 (HQ)',
    royalty: '10.5% / Split: R',
    countdown: 55,
    vaultId: 'VAULT-092X-MESH',
    region: 'NAM | SA | DRC',
    base: 91,
    color: '#34d399',
  },
];

const pricingPlans = [
  {
    name: "Pilot / Proof of Value",
    description: "90-day on-site trial",
    price: "$45,000",
    period: "one-off",
    features: [
      "Includes 15 mobile assets",
      "Prime-AI cloud compute",
      "1× VaultMesh rack (loan)",
      "10 days FAA field engineer"
    ],
    cta: "Start Pilot",
    highlighted: false
  },
  {
    name: "Growth",
    description: "Single-site, up to 60 assets",
    price: "$38,000",
    period: "/ yr",
    features: [
      "30 assets included",
      "24×7 NOC & 20-min SLA",
      "OTA software updates",
      "$110 / extra asset / yr"
    ],
    cta: "Book Demo",
    highlighted: false
  },
  {
    name: "Enterprise",
    description: "Multi-pit, up to 200 assets",
    price: "$78,000",
    period: "/ yr",
    features: [
      "80 assets included",
      "Redundant on-prem GPU node",
      "Dual HSM signers",
      "API access to ERP & geology tools",
      "$85 / extra asset / yr"
    ],
    cta: "Talk to Sales",
    highlighted: true
  },
  {
    name: "Enterprise Plus",
    description: "Unlimited assets, 3-year term",
    price: "$350,000",
    period: "/ 3 yr",
    features: [
      "Unlimited assets in one legal entity",
      "Dedicated CSM & quarterly ML refresh",
      "All future modules included",
      "Priority roadmap input"
    ],
    cta: "Request Proposal",
    highlighted: false
  }
];

export default function AutoBornPlatform() {
  const { trigger } = useInteractivity();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-yellow-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-yellow-400">
              🚗 AutoBorn™ Master Sync Grid
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              The Self-Driving Mining Ecosystem • Real-time AI • 9-second fleet sync
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/mining-dashboard">
              <Button className="bg-yellow-600 hover:bg-yellow-500" data-testid="button-mining-dashboard">
                ⛏️ Mining Hub
              </Button>
            </Link>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => trigger('AutoBorn book demo action triggered!')}
              data-testid="button-book-demo"
            >
              📞 Book Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-extrabold mb-4">
          <span className="text-yellow-400">AutoBorn™</span><br/>
          The Self-Driving Mining Ecosystem
        </h2>
        <p className="text-lg max-w-2xl mx-auto opacity-90 mb-10">
          Real-time AI • 9-second fleet sync • Immutable FAA VaultChain™ security.<br/>
          Mine smarter, safer and faster—without daily micromanagement.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Live Sync Grid */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            📊 Live Sync Grid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scrollsData.map((scroll) => (
              <Card key={scroll.id} className="bg-gray-950 border-yellow-500 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{scroll.icon}</span>
                      {scroll.brand}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {scroll.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p><span className="text-yellow-400">💳 License Fee:</span> {scroll.licenseFee}</p>
                    <p><span className="text-yellow-400">📦 Monthly:</span> {scroll.monthly}</p>
                    <p><span className="text-yellow-400">💰 Royalty:</span> {scroll.royalty}</p>
                    <p className="text-gray-400">⏱ {scroll.countdown}s</p>
                    <p className="text-gray-400">🌍 {scroll.region}</p>
                    <p className="text-gray-500 text-xs">Vault ID: {scroll.vaultId}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-2 w-full bg-gray-700 rounded">
                      <div 
                        className="bg-yellow-400 h-2 rounded transition-all duration-300" 
                        style={{ width: `${scroll.countdown}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full bg-black text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black">
                    Pay with VaultPay™
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Three Powerhouse Modules */}
        <section className="bg-white text-gray-900 rounded-xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8">Three Powerhouse Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">🚗 AutoBorn™ Prime</h4>
              <p className="text-sm text-gray-700 mb-4">The Master Brain</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Live Coordination Dashboard</li>
                <li>Dynamic Forecast Engine</li>
                <li>24/7 AI Field Director</li>
                <li>Full PulseGrid™ Sync (9s)</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">⛏️ AutoBorn™ MinerLink</h4>
              <p className="text-sm text-gray-700 mb-4">Node Powerhouse</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Autonomous Surface-Mesh Logic</li>
                <li>Fault-Tolerant Mining Grid</li>
                <li>GlowFlow™ Smart-Speed Balancing</li>
                <li>FAA LedgerMesh™ Audit Sync</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">📦 AutoBorn™ VaultMesh</h4>
              <p className="text-sm text-gray-700 mb-4">Deployment Command</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>AI Safety & Efficiency Scoring</li>
                <li>GeoFence™ + RouteOptimizer™</li>
                <li>FAA Zone Compliance Gateway</li>
                <li>GiftNode™ Reward Engine</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            💰 Choose Your Fleet Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-gray-950 ${plan.highlighted ? 'border-yellow-400 border-4' : 'border-gray-700'}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-yellow-400">{plan.price}</span>
                    <span className="text-sm opacity-70"> {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlighted ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="text-center py-16">
          <h3 className="text-3xl font-bold mb-8 text-yellow-400">Why miners choose AutoBorn™</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">+12%</div>
              <div className="text-sm">Average ore-grade uplift</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">–18%</div>
              <div className="text-sm">Lower fuel and maintenance</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm">AI monitoring & safety alerts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.7%</div>
              <div className="text-sm">Ledger-verified uptime</div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-yellow-500">
        © 2025 Heyns Schoeman · FAA™ Inline Compliance • AutoBorn™ VaultChain Certified
      </footer>
    </div>
  );
}