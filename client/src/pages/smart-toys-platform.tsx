import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const aiEngines = [
  {
    id: "learning-companions",
    name: "🤖 Smart Learning Companions",
    description: "AI that grows with child's intelligence map",
    features: ["Adaptive Intelligence", "Personality Modeling", "Growth Tracking"],
    status: "Treaty Active"
  },
  {
    id: "speech-recognition",
    name: "🗣️ Speech Recognition Engine",
    description: "Real-time language processing and feedback",
    features: ["Multilingual Support", "Accent Adaptation", "Progress Analytics"],
    status: "Treaty Active"
  },
  {
    id: "emotional-ai",
    name: "🧠 Emotional Intelligence Engine",
    description: "Building empathy, creativity, emotional literacy",
    features: ["Emotion Detection", "Empathy Building", "Creative Expression"],
    status: "Treaty Active"
  },
  {
    id: "learning-optimization",
    name: "📚 Learning Optimization AI",
    description: "Adaptive curriculum based on individual learning patterns",
    features: ["Personalized Curriculum", "Learning Speed Adjustment", "Knowledge Gaps Detection"],
    status: "Treaty Active"
  }
];

const immersiveTech = [
  {
    id: "holographic-stories",
    name: "🌈 Interactive Holographic Story Units",
    description: "3D storytelling projection for immersive learning",
    tech: "Holographic Projection",
    applications: ["Storytelling", "History Lessons", "Science Visualization"]
  },
  {
    id: "ar-books",
    name: "📖 AR-Enhanced Interactive Books",
    description: "Books that react to child's reading and voice",
    tech: "Augmented Reality",
    applications: ["Reading Comprehension", "Interactive Learning", "Voice Recognition"]
  },
  {
    id: "smart-hardware",
    name: "✍️ Smart Learning Hardware",
    description: "AI-powered pens, toys, and interactive devices",
    tech: "IoT + AI Feedback",
    applications: ["Handwriting Analysis", "Motor Skills", "Real-time Coaching"]
  },
  {
    id: "gamified-learning",
    name: "🎮 Gamified Educational Experiences",
    description: "Learning layered into fun adventure missions",
    tech: "Game Engine + AI",
    applications: ["Quest-based Learning", "Achievement Systems", "Social Learning"]
  }
];

const saasPlans = [
  {
    name: "Family Plan",
    price: "R299",
    period: "/month",
    description: "Perfect for individual families",
    features: [
      "Up to 3 children",
      "Core learning modules",
      "Basic AI feedback",
      "Progress tracking",
      "Mobile app access"
    ],
    maxChildren: 3
  },
  {
    name: "School Basic",
    price: "R899", 
    period: "/month",
    description: "Ideal for small schools and daycares",
    features: [
      "Up to 25 children",
      "All learning modules",
      "Advanced AI analytics",
      "Teacher dashboard",
      "Parent communication portal"
    ],
    maxChildren: 25,
    highlighted: true
  },
  {
    name: "Institution Pro",
    price: "R2,499",
    period: "/month",
    description: "For large schools and education groups",
    features: [
      "Up to 100 children",
      "Custom AI training",
      "White-label options",
      "API access",
      "Dedicated support"
    ],
    maxChildren: 100
  },
  {
    name: "District Enterprise",
    price: "Custom",
    period: "pricing",
    description: "District-wide deployment solutions", 
    features: [
      "Unlimited children",
      "Custom integrations",
      "On-premise deployment",
      "Treaty compliance",
      "24/7 enterprise support"
    ],
    maxChildren: "Unlimited"
  }
];

export default function SmartToysPlatform() {
  const [liveMetrics, setLiveMetrics] = useState({
    activeChildren: 1247,
    learningHours: 12543,
    aiInteractions: 45289,
    treatyCompliance: 100
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeChildren: prev.activeChildren + Math.floor(Math.random() * 3),
        learningHours: prev.learningHours + Math.floor(Math.random() * 5),
        aiInteractions: prev.aiInteractions + Math.floor(Math.random() * 12),
        treatyCompliance: 100 // Always 100% treaty compliant
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-yellow-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 flex items-center gap-2">
              🧸 Fruitful Smart Toys™ Platform 🌈
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Treaty-Class Cognitive Engines • OmniScroll Adaptive Learning • VaultMint™ Certified
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/education-dashboard">
              <Button className="bg-yellow-600 hover:bg-yellow-500" data-testid="button-education-dashboard">
                🧸 Education Hub
              </Button>
            </Link>
            <Button className="bg-white text-black hover:bg-gray-200">
              📞 Book Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black border-b border-gray-700 py-4">
        <div className="flex justify-center gap-4 text-sm flex-wrap">
          <a href="#ai-engines" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🤖 AI Engines
          </a>
          <a href="#immersive-tech" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            🌈 Immersive Tech
          </a>
          <a href="#saas-plans" className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
            💳 SaaS Plans
          </a>
          <Link href="/modular-view">
            <a className="px-4 py-2 border border-cyan-600 rounded hover:bg-cyan-600 transition">
              📱 ModularView
            </a>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-yellow-400 mb-4">
          Treaty-Class Cognitive Engines
        </h2>
        <p className="text-lg max-w-3xl mx-auto opacity-90 mb-10">
          Advanced AI-powered learning ecosystem that adapts to each child's unique intelligence map, 
          providing immutable proof of cognitive growth through VaultMint™ certification.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Live Metrics Dashboard */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            📡 Live Platform Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🧸</div>
                <div className="text-2xl font-bold text-yellow-400">{liveMetrics.activeChildren.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Children</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-blue-400">{liveMetrics.learningHours.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Learning Hours Today</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-2xl font-bold text-green-400">{liveMetrics.aiInteractions.toLocaleString()}</div>
                <div className="text-sm text-gray-400">AI Interactions</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📜</div>
                <div className="text-2xl font-bold text-purple-400">{liveMetrics.treatyCompliance}%</div>
                <div className="text-sm text-gray-400">Treaty Compliance</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Engines */}
        <section id="ai-engines">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🤖 AI Cognitive Engines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiEngines.map((engine) => (
              <Card key={engine.id} className="bg-gray-950 border-yellow-500 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-yellow-300">{engine.name}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {engine.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">{engine.description}</p>
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-semibold text-gray-300">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {engine.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-500">
                    Configure Engine
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Immersive Technology */}
        <section id="immersive-tech">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🌈 Immersive Learning Technology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {immersiveTech.map((tech) => (
              <Card key={tech.id} className="bg-gray-950 border-cyan-500 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-300">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{tech.description}</p>
                  <div className="mb-3">
                    <Badge className="bg-cyan-100 text-cyan-800 mb-2">
                      {tech.tech}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300">Applications:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {tech.applications.map((app, idx) => (
                        <div key={idx} className="text-xs text-gray-400">• {app}</div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500">
                    Explore Technology
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SaaS Pricing Plans */}
        <section id="saas-plans">
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            💳 SaaS Licensing Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saasPlans.map((plan, index) => (
              <Card key={index} className={`bg-gray-950 ${plan.highlighted ? 'border-yellow-400 border-4' : 'border-yellow-600'}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-300">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-yellow-400">{plan.price}</span>
                    <span className="text-sm opacity-70"> {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm text-gray-400">Max Children: 
                      <span className="text-yellow-400 font-semibold"> {plan.maxChildren}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlighted ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    {plan.price === "Custom" ? "Contact Sales" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Treaty Compliance & VaultMint */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            🔐 VaultMint™ Treaty Compliance
          </h3>
          <Card className="bg-gray-950 border-purple-500">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-3">📜</div>
                  <h4 className="font-bold text-purple-400 mb-2">Treaty Activation</h4>
                  <p className="text-sm text-gray-400">
                    OmniTreaty sector for Smart Toys™ activated across the FAA OmniGrid with full compliance certification.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🔐</div>
                  <h4 className="font-bold text-purple-400 mb-2">VaultMint™ Secured</h4>
                  <p className="text-sm text-gray-400">
                    Seedwave compliance ensures all learning data is secured with FAA Infinite Ledger protocols.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">∞</div>
                  <h4 className="font-bold text-purple-400 mb-2">Infinite Ledger Ready</h4>
                  <p className="text-sm text-gray-400">
                    Immutable proof of cognitive growth stored permanently on OmniScroll blockchain infrastructure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <Card className="bg-yellow-900/20 border-yellow-500">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                🌍 Ready to Transform Education?
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
                Join the treaty-class cognitive revolution. Deploy Smart Toys™ across your education ecosystem 
                with VaultMint™ security and OmniScroll permanence.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-yellow-600 hover:bg-yellow-500 px-8 py-3 text-lg">
                  Request Treaty Activation
                </Button>
                <Link href="/modular-view">
                  <Button className="bg-purple-600 hover:bg-purple-500 px-8 py-3 text-lg">
                    Launch ModularView Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-yellow-500">
        © 2025 Heyns Schoeman • FAA Treaty Inline Compliance • Smart Toys™ Platform • VaultMint™ Certified
      </footer>
    </div>
  );
}