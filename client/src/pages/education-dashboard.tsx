import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const smartToysModules = [
  {
    id: "learning-companions",
    name: "🤖 Smart Learning Companions",
    description: "AI that grows with child's intelligence map",
    status: "active",
    type: "AI Engine"
  },
  {
    id: "speech-recognition",
    name: "🗣️ Speech Recognition Engine", 
    description: "Real-time language processing and feedback",
    status: "active",
    type: "AI Engine"
  },
  {
    id: "core-subjects",
    name: "📚 Core Subjects: Math, Science, Literacy",
    description: "Education foundation powered by AI",
    status: "active",
    type: "Learning Module"
  },
  {
    id: "emotional-intelligence",
    name: "🧠 Emotional Intelligence & Storytelling",
    description: "Building empathy, creativity, emotional literacy",
    status: "active",
    type: "Development"
  },
  {
    id: "holographic-stories",
    name: "🌈 Interactive Holographic Story Units",
    description: "3D storytelling projection for immersive learning",
    status: "active",
    type: "Immersive Tech"
  },
  {
    id: "smart-pens",
    name: "✍️ Smart Pens with Adaptive AI Feedback",
    description: "Real-time handwriting, motor skills tracking",
    status: "active",
    type: "Hardware"
  },
  {
    id: "ar-books",
    name: "📖 AR-Enhanced Interactive Books",
    description: "Books that react to child's reading and voice",
    status: "active",
    type: "AR Technology"
  },
  {
    id: "gamified-apps",
    name: "🎮 Gamified Educational Apps",
    description: "Learning layered into fun adventure missions",
    status: "active",
    type: "Gaming"
  },
  {
    id: "multilingual",
    name: "🈚 Multilingual Framework",
    description: "EN, ES, FR, 中文 — Expandable Global Packs",
    status: "active",
    type: "Language"
  },
  {
    id: "parental-dashboard",
    name: "📊 AI Parental Dashboard",
    description: "Real-time emotional, academic progress reports",
    status: "active",
    type: "Analytics"
  },
  {
    id: "vaultmint-certified",
    name: "🔐 FAA VaultMint™ Certified",
    description: "Seedwave compliance. FAA Infinite Ledger ready",
    status: "active",
    type: "Security"
  },
  {
    id: "omniscroll-ledger",
    name: "🚀 OmniScroll + Infinite Ledger Ready",
    description: "Immutable proof of cognitive growth for life",
    status: "active",
    type: "Blockchain"
  }
];

const modularViewFeatures = [
  {
    id: "learning-progress",
    title: "Learning Progress",
    description: "Track your child's progress across different subjects and activities",
    status: "Level 3: Science Master",
    color: "indigo"
  },
  {
    id: "toy-settings",
    title: "Toy Settings",
    description: "Modify interactive settings, volume controls, and more for each toy",
    status: "5 Toys Connected",
    color: "green"
  },
  {
    id: "learning-modules",
    title: "Learning Modules",
    description: "Explore various learning modules for your child to start engaging with",
    status: "12 Modules Active",
    color: "purple"
  },
  {
    id: "parental-dashboard",
    title: "Parental Dashboard",
    description: "View your child's overall performance, activity logs, and more",
    status: "Weekly Report Ready",
    color: "blue"
  },
  {
    id: "ai-feedback",
    title: "Interactive AI Feedback",
    description: "Receive AI-driven feedback on your child's performance and learning habits",
    status: "3 New Insights",
    color: "red"
  },
  {
    id: "notifications",
    title: "Recent Updates & Alerts",
    description: "Stay updated with latest features and your child's milestones",
    status: "2 New Updates",
    color: "teal"
  },
  {
    id: "family-learning",
    title: "Family Learning Experience",
    description: "Incorporate family interactions into learning with group activities",
    status: "Family Mode Available",
    color: "yellow"
  }
];

const ecosystemStats = [
  { label: "Treaty-Class Modules", value: "12", trend: "active" },
  { label: "Education Brands", value: "66+", trend: "expanding" },
  { label: "VaultMint™ Certified", value: "100%", trend: "secure" },
  { label: "OmniScroll Ready", value: "∞", trend: "infinite" }
];

const getColorClasses = (color: string) => {
  const colors = {
    indigo: "border-indigo-500 bg-indigo-900/10",
    green: "border-green-500 bg-green-900/10",
    purple: "border-purple-500 bg-purple-900/10",
    blue: "border-blue-500 bg-blue-900/10",
    red: "border-red-500 bg-red-900/10",
    teal: "border-teal-500 bg-teal-900/10",
    yellow: "border-yellow-500 bg-yellow-900/10"
  };
  return colors[color as keyof typeof colors] || colors.indigo;
};

export default function EducationDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/system/stats"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-yellow-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 flex items-center gap-2">
              🧸 Education Sector Intelligence Hub 🌈
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Treaty-Class Cognitive Engines • OmniScroll Systems • VaultMint™ Certified • FAA Infinite Ledger
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
          <a href="#smart-toys" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🧸 Smart Toys™
          </a>
          <a href="#modular-view" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            📱 ModularView
          </a>
          <a href="#ai-modules" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🤖 AI Modules
          </a>
          <a href="#brand-portfolio" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🎯 Brand Portfolio
          </a>
          <Link href="/smart-toys-platform">
            <a className="px-4 py-2 border border-cyan-600 rounded hover:bg-cyan-600 transition">
              🚀 Platform
            </a>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-yellow-400 mb-4 flex justify-center items-center gap-4">
          🧸 Fruitful Smart Toys™ 🌈
        </h2>
        <p className="text-lg max-w-3xl mx-auto opacity-90 mb-2">
          Treaty-Class Cognitive Engines for Next-Generation Learning
        </p>
        <p className="text-sm text-gray-400 mb-10">
          OmniTreaty sector for Smart Toys™ now activated across the FAA OmniGrid. VaultMint™ secured. SaaS Licensing unlocked globally.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Ecosystem Statistics */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            📊 Education Ecosystem Overview
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
                      stat.trend === 'expanding' ? 'bg-blue-100 text-blue-800' :
                      stat.trend === 'secure' ? 'bg-purple-100 text-purple-800' :
                      stat.trend === 'infinite' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {stat.trend === 'active' ? '✓' : 
                       stat.trend === 'expanding' ? '📈' : 
                       stat.trend === 'secure' ? '🔒' : 
                       stat.trend === 'infinite' ? '∞' : '→'} {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Smart Toys Treaty Modules */}
        <section id="smart-toys">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🧸 Smart Toys™ Treaty Activation Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartToysModules.map((module) => (
              <Card key={module.id} className="bg-gray-950 border-yellow-500 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-yellow-300">{module.name}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {module.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{module.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {module.type}
                    </Badge>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-500">
                      Activate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ModularView Interface */}
        <section id="modular-view" className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            📱 ModularView: Central Learning Hub
          </h3>
          <p className="text-center text-gray-300 mb-8">
            Your central hub for managing child learning, toys, and activities with real-time AI feedback
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modularViewFeatures.map((feature) => (
              <Card key={feature.id} className={`bg-gray-800/50 ${getColorClasses(feature.color)} hover:scale-105 transition-transform`}>
                <CardContent className="p-6">
                  <h4 className="font-bold text-yellow-300 mb-2 text-lg">{feature.title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{feature.description}</p>
                  <div className="text-xs text-gray-400 mb-3">
                    <strong>Status:</strong> {feature.status}
                  </div>
                  <Button size="sm" className="w-full bg-gray-700 hover:bg-gray-600">
                    Access Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/modular-view">
              <Button className="bg-yellow-600 hover:bg-yellow-500 px-8 py-3">
                🚀 Launch ModularView Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* SaaS Licensing & Treaty Activation */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🛰️ SaaS Licensing Treaty Active
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📜</div>
                <div className="font-bold text-green-400">Treaty Confirmed</div>
                <div className="text-sm text-gray-400">OmniTreaty sector activated</div>
                <div className="text-xs text-gray-500 mt-2">Globally licensed</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🔐</div>
                <div className="font-bold text-purple-400">VaultMint™ Secured</div>
                <div className="text-sm text-gray-400">Seedwave compliance</div>
                <div className="text-xs text-gray-500 mt-2">FAA Infinite Ledger ready</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🌍</div>
                <div className="font-bold text-blue-400">Global Deployment</div>
                <div className="text-sm text-gray-400">66+ Education brands</div>
                <div className="text-xs text-gray-500 mt-2">OmniSaaS ready</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education Brand Portfolio Preview */}
        <section id="brand-portfolio">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🎯 Education Brand Portfolio (66+ Brands)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "BrightMinds Institute™",
              "NextWave Learning™", 
              "Elevate Academy™",
              "NovaEdge Schools™",
              "YouthQuest Alliance™",
              "EduSphere Global™",
              "OpenFuture Campus™",
              "KinderNest Systems™",
              "TalentBloom Initiative™",
              "LearnLoop Foundation™",
              "SkillSpring Academies™",
              "GrowGrid Labs™"
            ].map((brand, index) => (
              <Card key={index} className="bg-gray-800/30 border-yellow-500/50">
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold text-yellow-300">{brand}</div>
                  <div className="text-xs text-gray-400 mt-1">Treaty Active</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-6">
            <div className="text-gray-400 text-sm mb-4">+ 54 additional education brands in full ecosystem</div>
            <Button className="bg-yellow-600 hover:bg-yellow-500">
              🌍 Explore Full Brand Grid (66+ Brands)
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-yellow-500">
        FAA.Zone Sovereign Scrolls • Treaty-Class Cognitive Engines • VaultMint™ Certified • OmniScroll Infinite Ledger • Education Sector Active
      </footer>
    </div>
  );
}