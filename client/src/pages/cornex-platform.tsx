import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useInteractivity } from "@/lib/useInteractivity";
import { getContent } from "@/lib/appData";

const factorySetupPhases = [
  {
    phase: "Phase 1",
    action: "First Payment + Contract Signing",
    result: "🏭 Factory Setup Initiated",
    payment: "R187,500"
  },
  {
    phase: "Phase 2", 
    action: "Second & Third Payments",
    result: "⚙️ Equipment Installation, Testing",
    payment: "R375,000 (R187,500 x 2)"
  },
  {
    phase: "Phase 3",
    action: "Final Payment",
    result: "🔑 100% Asset Ownership Transfer", 
    payment: "R187,500"
  }
];

const aiFeatures = [
  {
    icon: "📦",
    title: "AI Inventory Management",
    description: "Live stock movement, auto-replenishment, dead stock detection, zero stockouts guaranteed.",
    color: "indigo"
  },
  {
    icon: "💸",
    title: "AI Dynamic Pricing", 
    description: "Real-time margin protection, competitor analysis, and instant market corrections, province by province.",
    color: "blue"
  },
  {
    icon: "🚚",
    title: "AI Logistics Optimization",
    description: "Auto-routes trucks based on fastest delivery + lowest freight costs, real-time warehouse pulse sync.",
    color: "green"
  },
  {
    icon: "🛒",
    title: "AI Customer Loyalty Grid",
    description: "Custom loyalty triggers for contractors, architects, and end-users — fully automated by AI profiles.",
    color: "pink"
  }
];

const productPricing = [
  { size: "85mm", totalCost: "R6.90", markup: "R1.725", wholesalePrice: "R8.63" },
  { size: "110mm", totalCost: "R8.02", markup: "R2.005", wholesalePrice: "R10.03" },
  { size: "140mm", totalCost: "R9.61", markup: "R2.4025", wholesalePrice: "R12.01" },
  { size: "170mm", totalCost: "R14.86", markup: "R3.715", wholesalePrice: "R18.58" }
];

export default function CornexPlatform() {
  const content = getContent('cornex-platform');
  const { trigger } = useInteractivity();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-indigo-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-indigo-400" data-testid="text-cornex-title">
              {content.title}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              <span data-testid="text-cornex-subtitle">{content.subtitle}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/housing-dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-500" data-testid="button-housing-dashboard">
                🏛️ Housing Hub
              </Button>
            </Link>
            <Button 
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => trigger('Cornex contact sales action triggered!')}
              data-testid="button-contact-sales"
            >
              📞 Contact Sales
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-indigo-400 mb-4">
          Cornex™ AI Systems
        </h2>
        <p className="text-lg max-w-2xl mx-auto opacity-90 mb-2">
          Transforming Hardware Commerce Through Grid AI
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Complete AI-driven commercial ecosystem ready to optimize stock, pricing, delivery, and customer loyalty across 9 provinces
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* AI Features Grid */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🚀 AI Grid Transformation Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-950 border-indigo-500">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h4 className="text-xl font-bold text-indigo-300 mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Factory Setup Package */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🏭 Full Factory Setup Package
          </h3>
          <Card className="bg-gray-950 border-indigo-500">
            <CardHeader>
              <CardTitle className="text-center text-indigo-300">Complete Turnkey Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-300 mb-8">
                Cornex™ offers a complete turnkey setup solution for EPS production, inventory systems, 
                branded packaging, and logistics node activation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="text-green-400">✅ EPS Precision Cutting Machines</div>
                  <div className="text-green-400">✅ Cloud Inventory Management</div>
                  <div className="text-green-400">✅ Packaging & Box Branding Systems</div>
                  <div className="text-green-400">✅ Logistics Routing Setup</div>
                  <div className="text-green-400">✅ 300-Store Supply Scaling</div>
                  <div className="text-green-400">✅ AI-Optimized Production Schedules</div>
                </div>
                <div className="space-y-4">
                  <div className="text-blue-400">📦 Initial Raw Material (EPS Blocks)</div>
                  <div className="text-blue-400">🖥️ Factory Control Software (Cloud Ready)</div>
                  <div className="text-blue-400">⚙️ Onsite Machine Installation</div>
                  <div className="text-blue-400">🔒 Contracted Ownership Transfer Timeline</div>
                  <div className="text-blue-400">📈 Immediate Production Capability</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400 mb-2">Total Investment: R750,000</div>
                <div className="text-sm text-gray-400 mb-4">4 Payments of R187,500 • Complete Asset Ownership</div>
                <Button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3">
                  📩 Activate Factory Ownership
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ownership Timeline */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🔑 Ownership Timeline Overview
          </h3>
          <Card className="bg-gray-950 border-indigo-500">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-600">
                    <tr>
                      <th className="py-3 px-6 text-left text-white">Phase</th>
                      <th className="py-3 px-6 text-left text-white">Action</th>
                      <th className="py-3 px-6 text-left text-white">Payment</th>
                      <th className="py-3 px-6 text-left text-white">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factorySetupPhases.map((phase, index) => (
                      <tr key={index} className="border-b border-indigo-500/30">
                        <td className="py-4 px-6 font-semibold text-indigo-300">{phase.phase}</td>
                        <td className="py-4 px-6 text-gray-300">{phase.action}</td>
                        <td className="py-4 px-6 text-green-400 font-semibold">{phase.payment}</td>
                        <td className="py-4 px-6 text-blue-400">{phase.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 text-center text-gray-500 text-xs">
                Cash-on-Delivery on verified stock flow. Immediate control after each payment confirmation.
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Product Pricing */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🏷️ Atom-Level Product Pricing
          </h3>
          <Card className="bg-gray-950 border-indigo-500">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-600">
                    <tr>
                      <th className="py-3 px-6 text-center text-white">Cornice Size</th>
                      <th className="py-3 px-6 text-center text-white">Total Cost</th>
                      <th className="py-3 px-6 text-center text-white">25% Markup</th>
                      <th className="py-3 px-6 text-center text-white">Wholesale Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPricing.map((product, index) => (
                      <tr key={index} className="border-b border-indigo-500/30 hover:bg-indigo-900/20">
                        <td className="py-4 px-6 text-center font-semibold text-indigo-300">{product.size}</td>
                        <td className="py-4 px-6 text-center text-gray-300">{product.totalCost}</td>
                        <td className="py-4 px-6 text-center text-yellow-400">{product.markup}</td>
                        <td className="py-4 px-6 text-center font-bold text-green-400">{product.wholesalePrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Provincial Expansion */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-indigo-400">
            🏆 RSA Province Pulse Activation
          </h3>
          <Card className="bg-gray-950 border-indigo-500">
            <CardContent className="p-6">
              <p className="text-center text-gray-300 mb-6">
                Cornex™ will activate hardware sales nodes sequentially across all 9 provinces
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🥇</div>
                  <div className="font-semibold text-yellow-400">Gauteng</div>
                  <div className="text-sm text-gray-400">Primary hub</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🥈</div>
                  <div className="font-semibold text-gray-300">Western Cape</div>
                  <div className="text-sm text-gray-400">Secondary hub</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🥉</div>
                  <div className="font-semibold text-orange-400">KwaZulu-Natal</div>
                  <div className="text-sm text-gray-400">Coastal expansion</div>
                </div>
              </div>
              <div className="text-center mt-6 text-gray-400 text-sm">
                + Eastern Cape, Limpopo, Mpumalanga, North West, Free State, Northern Cape
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-indigo-500">
        FAA.Zone Sovereign Scrolls • VaultMesh • TreatyMesh Validated • Cornex™ Private Label Manufacturing
      </footer>
    </div>
  );
}