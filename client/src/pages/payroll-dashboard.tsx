import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const aiModules = [
  {
    id: "paypredict",
    name: "📊 PayPredict AI",
    description: "Forecasts salary trends, seasonal bonuses, and contractual irregularities using historical FAA data and market syncs.",
    status: "active"
  },
  {
    id: "scrollsentinel", 
    name: "🔍 ScrollSentinel",
    description: "AI surveillance across payslips, ghost patterns, unauthorized overrides and noncompliant vault entries.",
    status: "scanning"
  },
  {
    id: "bonuslogic",
    name: "🤖 BonusLogic Core", 
    description: "Analyzes payout eligibility, performance triggers, threshold logic, and enforces role-specific bonus compliance grids.",
    status: "active"
  },
  {
    id: "timedrift",
    name: "📌 TimeDrift Mapper",
    description: "Visualizes anomalies in shift logs, breaks, drift accumulation and cross-role time misalignment detection.",
    status: "monitoring"
  }
];

const payrollFeatures = [
  {
    id: "payslip",
    name: "Payslip Engine",
    description: "Auto-generates gross/net, tax, ledger exports, QR signed reports.",
    icon: "📟"
  },
  {
    id: "shiftsync",
    name: "ShiftSync Grid", 
    description: "Tracks late shifts, PTO, overtime with ledger binding + drift flags.",
    icon: "⏱"
  },
  {
    id: "ctc-tracker",
    name: "CTC Tracker AI",
    description: "Validates band logic, compares regions, grades, and pay thresholds.",
    icon: "📊"
  },
  {
    id: "ghost-detection",
    name: "Drift + Ghost Detection",
    description: "Detects ghost users, shift anomalies, and under-hour fraud flags.",
    icon: "🛡️"
  },
  {
    id: "vault-sync",
    name: "VaultMesh Sync",
    description: "Scroll-level validation cycles, 9-second syncs, and immutable bindings.",
    icon: "🔐"
  },
  {
    id: "org-matrix",
    name: "Org Role Matrix",
    description: "Maps GPA zones to department shifts and bonus grid compliance.",
    icon: "📋"
  }
];

const globalMetrics = [
  { label: "Total Payslips", value: "18,392", trend: "up" },
  { label: "Vaults Active", value: "94%", trend: "stable" },
  { label: "Drift Events", value: "412", trend: "down" },
  { label: "Avg. CTC Delta", value: "+R2,081", trend: "up" }
];

export default function PayrollDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/system/stats"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-purple-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              🧬 FAA™ Quantum Payroll Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time payroll logic, shift sync, AI fraud detection & vault trace routing
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/payroll-features">
              <Button className="bg-indigo-600 hover:bg-indigo-500" data-testid="button-payroll-features">
                🔧 Features
              </Button>
            </Link>
            <Link href="/payroll-sovereign-grid">
              <Button className="bg-green-600 hover:bg-green-500" data-testid="button-sovereign-grid">
                🛰 Sovereign Grid
              </Button>
            </Link>
            <Link href="/advanced-payroll-dashboard">
              <Button className="bg-orange-600 hover:bg-orange-500" data-testid="button-advanced-dashboard">
                📊 Advanced Dashboard
              </Button>
            </Link>
            <Link href="/global-view">
              <Button className="bg-purple-600 hover:bg-purple-500" data-testid="button-global-view">
                🌍 Global View
              </Button>
            </Link>
            <Link href="/vault-payments">
              <Button className="bg-white text-black hover:bg-gray-200" data-testid="button-vault-payments">
                💳 Vault
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black border-b border-purple-900 py-4">
        <div className="flex justify-center gap-4 text-sm">
          <a href="#metrics" className="px-4 py-2 border border-purple-600 rounded hover:bg-purple-600 transition">
            📊 Scroll Metrics
          </a>
          <a href="#fraud" className="px-4 py-2 border border-purple-600 rounded hover:bg-purple-600 transition">
            🛡️ Fraud Mesh
          </a>
          <a href="#payslip" className="px-4 py-2 border border-purple-600 rounded hover:bg-purple-600 transition">
            🧾 Payslip Logs
          </a>
          <a href="#ai-modules" className="px-4 py-2 border border-purple-600 rounded hover:bg-purple-600 transition">
            🤖 AI Modules
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-800 via-indigo-900 to-black text-center py-16">
        <h2 className="text-4xl font-extrabold text-purple-400 mb-4">
          FAA™ VaultMesh Synced
        </h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-300 opacity-90">
          Scroll-bound automation, real-time fraud flags, payslip auto-gen, and CTC comparators.
        </p>
      </section>

      <div className="px-6 py-8 space-y-12">
        {/* Metrics Grid */}
        <section id="metrics">
          <h3 className="text-3xl font-bold text-center mb-8 text-purple-400">
            📊 Live Scroll Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalMetrics.map((metric, index) => (
              <Card key={index} className="bg-gray-950 border-purple-700">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-300 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                  <div className="mt-2">
                    <Badge className={
                      metric.trend === 'up' ? 'bg-green-100 text-green-800' :
                      metric.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Modules */}
        <section id="ai-modules">
          <h3 className="text-3xl font-bold text-center mb-8 text-purple-400">
            🤖 FAA AI™ Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiModules.map((module) => (
              <Card key={module.id} className="bg-gray-950 border-purple-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center justify-between">
                    {module.name}
                    <Badge className={
                      module.status === 'active' ? 'bg-green-100 text-green-800' :
                      module.status === 'scanning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {module.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">{module.description}</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-500">
                    Launch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Payroll Features */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-purple-400">
            🔧 Core Payroll Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payrollFeatures.map((feature) => (
              <Card key={feature.id} className="bg-gray-950 border-purple-700 hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <span className="text-2xl">{feature.icon}</span>
                    {feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                    View Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Intelligence Hub */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            📈 Intelligence Hub Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <Card className="bg-gray-800 border-purple-600">
              <CardContent className="p-4">
                <h4 className="font-bold text-purple-300 mb-2">CTC vs Role Index</h4>
                <p className="text-gray-300">Auto-match current salaries with dynamic role expectations and industry bands using the FAA CTC Tracker GPT.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-purple-600">
              <CardContent className="p-4">
                <h4 className="font-bold text-purple-300 mb-2">Drift Score</h4>
                <p className="text-gray-300">Calculates deviations from contractual hours, early-outs, and lateness to detect time drift anomalies in real-time.</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-purple-600">
              <CardContent className="p-4">
                <h4 className="font-bold text-purple-300 mb-2">Fraud Mesh Sync</h4>
                <p className="text-gray-300">Syncs with VaultMesh to surface duplicate time entries, under-hour red flags, and ghost shifts.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-purple-800">
        FAA™ VaultMesh | Payroll Engine | Trace ID Secure | Scroll-Grade Synced
      </footer>
    </div>
  );
}