import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const aiModules = [
  {
    id: "valuation-ai",
    title: "📊 Real-Time Valuation AI",
    description: "Instant property valuations with 95% predictive accuracy using machine learning",
    status: "active",
    metrics: { accuracy: "95%", speed: "Instant", volume: "1000+/day" }
  },
  {
    id: "mortgage-risk",
    title: "⚠️ Mortgage Risk Grid", 
    description: "AI-powered mortgage risk assessment and loan recovery optimization",
    status: "active",
    metrics: { riskReduction: "30%", accuracy: "92%", coverage: "SA-wide" }
  },
  {
    id: "market-forecast",
    title: "📈 Market Trend Forecasting",
    description: "Predictive analytics for property market movements and investment opportunities",
    status: "active", 
    metrics: { forecastAccuracy: "88%", horizon: "12 months", indicators: "50+" }
  },
  {
    id: "agent-insights",
    title: "🧭 Agent Intelligence Hub",
    description: "Advanced analytics for real estate agents with client prediction and deal optimization",
    status: "active",
    metrics: { dealSuccess: "+25%", clientMatch: "90%", leadQuality: "A-grade" }
  }
];

const competitiveEdge = [
  {
    feature: "Speed of Valuation",
    faa: "Instant AI-generated reports",
    traditional: "Manual process takes days/weeks"
  },
  {
    feature: "Pricing Accuracy", 
    faa: "95% predictive accuracy",
    traditional: "Often subjective and inconsistent"
  },
  {
    feature: "Buyer Prediction",
    faa: "AI-driven intent analysis", 
    traditional: "No predictive analytics"
  },
  {
    feature: "Risk Assessment",
    faa: "Real-time mortgage risk engine",
    traditional: "Manual credit scoring only"
  }
];

const pricingTiers = [
  {
    name: "Basic",
    price: "R499",
    period: "/month",
    description: "Essential valuation tools for small agencies",
    features: [
      "Up to 100 valuations/month",
      "Basic market reports", 
      "Email support",
      "Standard API access"
    ]
  },
  {
    name: "Professional",
    price: "R1,299",
    period: "/month", 
    description: "Advanced tools for growing businesses",
    features: [
      "Up to 500 valuations/month",
      "Advanced risk assessment",
      "Priority support",
      "Custom integrations"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "R2,999",
    period: "/month",
    description: "Full suite for large operations",
    features: [
      "Unlimited valuations",
      "White-label solutions",
      "Dedicated account manager",
      "Custom AI model training"
    ]
  }
];

export default function RealEstatePlatform() {
  const [liveData, setLiveData] = useState({
    valuations: 1247,
    accuracy: 95.2,
    marketTrend: 5.7,
    riskScore: 0.23
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        valuations: prev.valuations + Math.floor(Math.random() * 3),
        accuracy: 95 + Math.random() * 1,
        marketTrend: 5 + Math.random() * 2,
        riskScore: 0.2 + Math.random() * 0.1
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-green-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-green-400">
              🏡 FAA Real Estate AI™
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              AI-Powered Valuations • Mortgage Risk Engine • FAA VaultMint™ Sync Grid
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/housing-dashboard">
              <Button className="bg-green-600 hover:bg-green-500" data-testid="button-housing-dashboard">
                🏛️ Housing Hub
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
          <a href="#valuation" className="px-4 py-2 border border-green-600 rounded hover:bg-green-600 transition">
            📤 Upload Deals
          </a>
          <a href="#replay" className="px-4 py-2 border border-green-600 rounded hover:bg-green-600 transition">
            🧠 Deal Replay
          </a>
          <a href="#pricing" className="px-4 py-2 border border-green-600 rounded hover:bg-green-600 transition">
            💳 Pricing
          </a>
          <a href="#grid" className="px-4 py-2 border border-green-600 rounded hover:bg-green-600 transition">
            📍 Valuation Grid
          </a>
          <a href="#api" className="px-4 py-2 border border-green-600 rounded hover:bg-green-600 transition">
            🔑 API Access
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-green-400 mb-4">
          South Africa Valuation Sync
        </h2>
        <p className="text-lg max-w-3xl mx-auto opacity-90 mb-10">
          Leverage machine learning models trained on South African macroeconomic indicators, 
          real estate trends, and global investment signals to deliver accurate, forward-looking market insights.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Live Dashboard */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-green-400">
            📡 Live Intelligence Grid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-green-400">{liveData.valuations.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Valuations Today</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-400">{liveData.accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Prediction Accuracy</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-2xl font-bold text-yellow-400">+{liveData.marketTrend.toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Market Growth</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-red-500">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⚠️</div>
                <div className="text-2xl font-bold text-red-400">{(liveData.riskScore * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-400">Average Risk Score</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Modules */}
        <section id="valuation">
          <h3 className="text-3xl font-bold text-center mb-8 text-green-400">
            🧠 AI Intelligence Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiModules.map((module) => (
              <Card key={module.id} className="bg-gray-950 border-green-500 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg text-green-300">{module.title}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {module.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">{module.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(module.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="font-bold text-green-400">{value}</div>
                        <div className="opacity-70 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  <Link href={`/ai-module/${module.id}`}>
                    <Button 
                      className="w-full mt-4 bg-green-600 hover:bg-green-500 transition-all duration-200 transform hover:scale-105"
                      data-testid={`launch-${module.id}`}
                    >
                      🚀 Launch Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Competitive Edge */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-green-400">
            📊 Market Opportunity & Competitive Edge
          </h3>
          <Card className="bg-gray-950 border-green-500">
            <CardContent className="p-6">
              <p className="text-center text-gray-300 mb-6">
                The South African Real Estate Market, valued at R5 trillion+, remains highly fragmented with outdated manual processes. 
                FAA™ Real Estate AI™ disrupts this by offering real-time, automated valuations that reduce operational costs by 30% 
                and improve transaction speeds by 50%.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-600">
                    <tr>
                      <th className="py-3 px-4 text-left text-white">Feature</th>
                      <th className="py-3 px-4 text-left text-white">FAA™ Real Estate AI™</th>
                      <th className="py-3 px-4 text-left text-white">Traditional Methods</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitiveEdge.map((row, index) => (
                      <tr key={index} className="border-b border-green-500/30">
                        <td className="py-3 px-4 font-semibold text-green-300">{row.feature}</td>
                        <td className="py-3 px-4 text-green-400">{row.faa}</td>
                        <td className="py-3 px-4 text-red-400">{row.traditional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pricing */}
        <section id="pricing">
          <h3 className="text-3xl font-bold text-center mb-8 text-green-400">
            💳 SaaS Pricing Tiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`bg-gray-950 ${tier.highlighted ? 'border-green-400 border-4' : 'border-green-600'}`}>
                <CardHeader>
                  <CardTitle className="text-lg text-green-300">
                    {tier.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-green-400">{tier.price}</span>
                    <span className="text-sm opacity-70"> {tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.highlighted ? 'bg-green-400 text-black hover:bg-green-300' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <Card className="bg-green-900/20 border-green-500">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-green-400 mb-4">
                FAA Market Intelligence Engine™
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
                Ready to transform your real estate operations with AI-powered intelligence? 
                Join hundreds of agencies already using FAA Real Estate AI™.
              </p>
              <Button className="bg-green-600 hover:bg-green-500 px-10 py-4 text-lg">
                Request Full Market Access API License
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-green-500">
        © 2025 Heyns Schoeman • FAA™ Compliance Engine Active • Real Estate AI™ Platform
      </footer>
    </div>
  );
}