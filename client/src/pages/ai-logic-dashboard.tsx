import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect } from "react";

const aiGridSystems = [
  {
    id: "codenest-ai",
    name: "CodeNest™ AI",
    description: "CodeLogic Binders, ScrollLexer Threads, VaultCode Tokens, GPTRuntime Scrolls",
    category: "Web Development",
    status: "Treaty Active",
    color: "yellow"
  },
  {
    id: "gridnest-ai",
    name: "GridNest AI",
    description: "DataMesh Visualizers, LogicSync Pads, GridPoint Cores, NestLogic Routers",
    category: "Data Systems",
    status: "Treaty Active",
    color: "blue"
  },
  {
    id: "signalcore-gpt",
    name: "SignalCore GPT",
    description: "EchoLayer Nodes, LivePath Predictors, ScrollLogic Index, GPT Pulse Handlers",
    category: "AI Engine",
    status: "Treaty Active",
    color: "green"
  },
  {
    id: "omnithread-os",
    name: "OmniThread OS",
    description: "SequenceMuxers, ThreadIQ Logs, AsyncGrid Panels, OmniWeave Threads",
    category: "Operating System",
    status: "Treaty Active",
    color: "purple"
  },
  {
    id: "vaultneuronx",
    name: "VaultNeuronX",
    description: "Neuron Maps, API Key Binders, LogicScroll Monitors, VaultGPT Processors",
    category: "Neural Networks",
    status: "Treaty Active",
    color: "red"
  },
  {
    id: "pathlink-index",
    name: "PathLink Index",
    description: "ScrollPath AI, Connective Threads, OmniLogic Tunnels, RouteEcho Engines",
    category: "Network Logic",
    status: "Treaty Active",
    color: "cyan"
  },
  {
    id: "aiverse-signal",
    name: "AIverse Signal",
    description: "GridPulse Nodes, LayerLock Systems, GPT Interlinks, Protocol Metrics",
    category: "Signal Processing",
    status: "Treaty Active",
    color: "orange"
  },
  {
    id: "logicmirror-co",
    name: "LogicMirror Co.",
    description: "DecisionMesh Scrolls, Reflex Mapping Units, ThoughtLayer Logs, AILog Indexers",
    category: "Decision Systems",
    status: "Treaty Active",
    color: "indigo"
  },
  {
    id: "threadaxis-hub",
    name: "ThreadAxis Hub",
    description: "AxisChain Scrolls, LogicLink Binders, ScrollCompression Nodes, AxisMux Arrays",
    category: "Thread Management",
    status: "Treaty Active",
    color: "pink"
  }
];

const codeNestFeatures = [
  {
    id: "scroll-builder",
    title: "Scroll Builder",
    description: "Deploy Your CodeNest™ Scroll with HTML/CSS/JS compilation",
    icon: "🛠️",
    features: ["HTML Code Editor", "CSS Styling", "JavaScript Integration", "ClaimRoot™ Licensing"]
  },
  {
    id: "templates",
    title: "Scroll Templates",
    description: "Pre-built templates for Landing, Checkout, Blog, and Microsite scrolls",
    icon: "🎨",
    features: ["Landing Scroll", "Checkout Scroll", "ScrollBlog", "Vault Microsite"]
  },
  {
    id: "license-management",
    title: "License Management",
    description: "Track your scroll licenses with ClaimRoot™ verification",
    icon: "📜",
    features: ["License Tracking", "ClaimRoot™ Status", "Royalty Sync", "Regional Control"]
  },
  {
    id: "project-workspace",
    title: "Project Workspace",
    description: "Manage active scroll projects with branded site deployment",
    icon: "💼",
    features: ["Active Projects", "Branded Sites", "Scroll ID Tracking", "Auto-Deploy"]
  }
];

const ecosystemStats = [
  { label: "FAA-Certified Brands", value: "188", trend: "active" },
  { label: "AI Grid Systems", value: "9", trend: "operational" },
  { label: "Sector Pulse", value: "9s", trend: "synced" },
  { label: "Scroll Economy", value: "∞", trend: "growing" }
];

const getColorClasses = (color: string) => {
  const colors = {
    yellow: "border-yellow-500 bg-yellow-900/10",
    blue: "border-blue-500 bg-blue-900/10",
    green: "border-green-500 bg-green-900/10",
    purple: "border-purple-500 bg-purple-900/10",
    red: "border-red-500 bg-red-900/10",
    cyan: "border-cyan-500 bg-cyan-900/10",
    orange: "border-orange-500 bg-orange-900/10",
    indigo: "border-indigo-500 bg-indigo-900/10",
    pink: "border-pink-500 bg-pink-900/10"
  };
  return colors[color as keyof typeof colors] || colors.yellow;
};

export default function AILogicDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/system/stats"],
  });

  const [liveMetrics, setLiveMetrics] = useState({
    scrollsDeployed: 12847,
    activeLicenses: 3401,
    aiEnginesOnline: 9,
    gridPulseRate: 9
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        scrollsDeployed: prev.scrollsDeployed + Math.floor(Math.random() * 8),
        activeLicenses: prev.activeLicenses + Math.floor(Math.random() * 3),
        aiEnginesOnline: 9, // Always 9 engines online
        gridPulseRate: 9 // Always 9-second pulse
      }));
    }, 9000); // Update every 9 seconds to match sector pulse

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-yellow-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 flex items-center gap-2">
              🧠 AI, Logic & Grid Systems Hub
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              188 FAA-Certified Core Scroll Brands • Sector Pulse: Active @ 9s • SignalGPT Engine
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/global-view">
              <Button className="bg-yellow-600 hover:bg-yellow-500" data-testid="button-global-view">
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
        <div className="flex justify-center gap-4 text-sm flex-wrap">
          <a href="#ai-systems" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🧠 AI Systems
          </a>
          <a href="#codenest" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            💻 CodeNest™
          </a>
          <a href="#grid-logic" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🔗 Grid Logic
          </a>
          <a href="#scroll-economy" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            💰 Scroll Economy
          </a>
          <Link href="/codenest-platform">
            <a className="px-4 py-2 border border-cyan-600 rounded hover:bg-cyan-600 transition">
              🚀 CodeNest Platform
            </a>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-yellow-400 mb-4">
          🧠 AI, Logic & Grid Systems
        </h2>
        <p className="text-lg max-w-3xl mx-auto opacity-90 mb-2">
          188 FAA-Certified Core Scroll Brands powering the AI development ecosystem
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Sector Pulse: Active @ 9s • SignalGPT Engine • VaultCode Tokens • ClaimRoot™ Ready
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Live Ecosystem Metrics */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            📊 AI Grid Ecosystem Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemStats.map((stat, index) => (
              <Card key={index} className="bg-gray-950 border-yellow-500">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="mt-2">
                    <Badge className={
                      stat.trend === 'active' ? 'bg-green-100 text-green-800' :
                      stat.trend === 'operational' ? 'bg-blue-100 text-blue-800' :
                      stat.trend === 'synced' ? 'bg-purple-100 text-purple-800' :
                      stat.trend === 'growing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {stat.trend === 'active' ? '✓' : 
                       stat.trend === 'operational' ? '⚡' : 
                       stat.trend === 'synced' ? '🔄' : 
                       stat.trend === 'growing' ? '📈' : '→'} {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live System Metrics */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            📡 Live System Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📜</div>
                <div className="text-2xl font-bold text-green-400">{liveMetrics.scrollsDeployed.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Scrolls Deployed</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold text-blue-400">{liveMetrics.activeLicenses.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Licenses</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-2xl font-bold text-purple-400">{liveMetrics.aiEnginesOnline}</div>
                <div className="text-sm text-gray-400">AI Engines Online</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-orange-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💓</div>
                <div className="text-2xl font-bold text-orange-400">{liveMetrics.gridPulseRate}s</div>
                <div className="text-sm text-gray-400">Grid Pulse Rate</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Grid Systems */}
        <section id="ai-systems">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🧠 Core AI Grid Systems (9 Active)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiGridSystems.map((system) => (
              <Card key={system.id} className={`bg-gray-950 ${getColorClasses(system.color)} hover:scale-105 transition-transform`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-yellow-300">{system.name}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {system.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{system.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-xs">
                      {system.category}
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-500">
                    Access System
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CodeNest™ Platform Spotlight */}
        <section id="codenest" className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            💻 CodeNest™ Web Dev Scroll Studio
          </h3>
          <p className="text-center text-gray-300 mb-8">
            Build modern sites. Claim your code. Empower your scroll economy. FAA-Certified Web Development Platform.
          </p>
          
          {/* CodeNest Pricing & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="bg-gray-800/50 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-300">💰 Licensing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Master License:</span>
                    <span className="text-yellow-400 font-bold">$3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Local Plan:</span>
                    <span className="text-yellow-400 font-bold">$45/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Regional Plan:</span>
                    <span className="text-yellow-400 font-bold">$80/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Global Plan:</span>
                    <span className="text-yellow-400 font-bold">$175/month</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-600">
                    <span className="text-gray-300">Royalty:</span>
                    <span className="text-yellow-400 font-bold">6% via VaultPay™</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-300">🛠️ ScrollKit Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Mini-scroll website builder engine</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Branded site glyphs + scroll visuals</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Claim tokens for client site licensing</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Scroll-ready HTML/CSS/JS snippets</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> ClaimRoot™ traceable ownership</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> ScrollStack™ component delivery</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {codeNestFeatures.map((feature) => (
              <Card key={feature.id} className="bg-gray-800/50 border-yellow-500/50">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3 text-center">{feature.icon}</div>
                  <h4 className="font-bold text-yellow-300 mb-2 text-center">{feature.title}</h4>
                  <p className="text-sm text-gray-300 mb-3 text-center">{feature.description}</p>
                  <ul className="space-y-1 text-xs text-gray-400">
                    {feature.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="text-green-400">•</span> {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/codenest-platform">
              <Button className="bg-yellow-600 hover:bg-yellow-500 px-8 py-3 text-lg">
                🚀 Launch CodeNest™ Platform
              </Button>
            </Link>
          </div>
        </section>

        {/* Scroll Economy & Brand Portfolio */}
        <section id="scroll-economy">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            💰 Scroll Economy & Brand Portfolio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📜</div>
                <div className="font-bold text-green-400">ClaimRoot™ Ready</div>
                <div className="text-sm text-gray-400">Traceable site ownership</div>
                <div className="text-xs text-gray-500 mt-2">Auto-licensing enabled</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🏗️</div>
                <div className="font-bold text-purple-400">ScrollStack™ Deploy</div>
                <div className="text-sm text-gray-400">Component delivery system</div>
                <div className="text-xs text-gray-500 mt-2">Instant activation kit</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💳</div>
                <div className="font-bold text-blue-400">VaultPay™ Sync</div>
                <div className="text-sm text-gray-400">6% royalty processing</div>
                <div className="text-xs text-gray-500 mt-2">FAA.Zone verified</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <div className="text-gray-400 text-sm mb-4">
              Perfect for freelancers, agencies, startups, and scroll creators seeking recurring license revenue
            </div>
            <div className="text-lg font-bold text-yellow-400 mb-4">
              "Build a site. Claim your code. Cash in."
            </div>
            <Button className="bg-yellow-600 hover:bg-yellow-500">
              🌍 Explore All 188 AI Brands
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-yellow-500">
        FAA.Zone Verified • 188 Core Scroll Brands • SignalGPT Engine • ClaimRoot™ Licensed • VaultPay™ Synced • Sector Pulse: 9s
      </footer>
    </div>
  );
}