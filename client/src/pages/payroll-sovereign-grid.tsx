import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const comparisonData = [
  {
    feature: "Setup Time",
    faa: "9 seconds (auto-deploy)",
    deel: "2-3 weeks manual setup",
    advantage: "faa"
  },
  {
    feature: "Human Staff Required",
    faa: "Zero humans",
    deel: "Full HR team + support",
    advantage: "faa"
  },
  {
    feature: "Global Compliance",
    faa: "Built-in sovereign grid",
    deel: "Manual per-country setup",
    advantage: "faa"
  },
  {
    feature: "Fraud Detection",
    faa: "AI-powered GhostFlag™",
    deel: "Manual review only",
    advantage: "faa"
  },
  {
    feature: "Monthly Cost (100 employees)",
    faa: "$890/mo (all-inclusive)",
    deel: "$3,200/mo + setup fees",
    advantage: "faa"
  },
  {
    feature: "Instant Payouts", 
    faa: "9-second validation",
    deel: "3-5 business days",
    advantage: "faa"
  },
  {
    feature: "API Integration",
    faa: "VaultMesh™ auto-sync",
    deel: "Complex manual APIs",
    advantage: "faa"
  }
];

const pricingTiers = [
  {
    name: "Startup Grid",
    price: "$290",
    period: "/month",
    employees: "Up to 25 employees",
    features: [
      "VaultMesh™ sync enabled",
      "Basic payroll automation",
      "Ghost detection lite",
      "Standard audit trails",
      "Email support"
    ],
    highlight: false
  },
  {
    name: "Scale Grid", 
    price: "$890",
    period: "/month",
    employees: "Up to 100 employees",
    features: [
      "Full sovereign grid access",
      "Advanced fraud detection",
      "Real-time compliance monitoring",
      "Custom integration APIs",
      "Priority support + account manager"
    ],
    highlight: true
  },
  {
    name: "Enterprise Grid",
    price: "$2,100",
    period: "/month", 
    employees: "Unlimited employees",
    features: [
      "White-label FAA deployment",
      "Custom AI modules",
      "Multi-region compliance",
      "Dedicated support team",
      "SLA guarantees"
    ],
    highlight: false
  }
];

const aiModules = [
  {
    name: "PayFlow Predictor",
    description: "Predicts cash flow needs and optimal payout timing using ML algorithms",
    status: "Active",
    accuracy: "94.2%"
  },
  {
    name: "Compliance Shield",
    description: "Real-time monitoring of global employment law changes and automatic policy updates",
    status: "Active", 
    accuracy: "99.7%"
  },
  {
    name: "Fraud Sentinel",
    description: "Advanced pattern recognition for ghost employees and time manipulation",
    status: "Active",
    accuracy: "97.8%"
  },
  {
    name: "Role Optimizer",
    description: "Analyzes role performance vs compensation to optimize team structures",
    status: "Beta",
    accuracy: "89.1%"
  }
];

const globalMetrics = [
  { label: "Active Nodes", value: "12,847", change: "+2.3%" },
  { label: "Monthly Payouts", value: "$47.2M", change: "+18.5%" },
  { label: "Fraud Prevention", value: "99.7%", change: "+0.2%" },
  { label: "Avg Processing Time", value: "8.4s", change: "-0.6s" },
  { label: "Global Compliance", value: "156 countries", change: "+3" },
  { label: "Uptime", value: "99.94%", change: "+0.02%" }
];

export default function PayrollSovereignGrid() {
  const [activeModule, setActiveModule] = useState("PayFlow Predictor");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="bg-white shadow p-6 flex flex-col md:flex-row md:justify-between md:items-center mb-8 rounded-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700">🛰 FAA Payroll™ – Sovereign Economic Grid</h1>
          <p className="text-sm text-gray-500">Zero-human, auto-verifying payout engine for global nodes</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">💼 Invest</Button>
          <Button className="bg-green-600 hover:bg-green-700">📊 Tiers</Button>
          <Button className="bg-gray-700 hover:bg-gray-800">🧠 Modules</Button>
        </div>
      </header>

      {/* Intro Section */}
      <section className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">FAA Payroll™: Beyond Deel. Beyond HR.</h2>
        <p className="max-w-3xl mx-auto text-gray-600">
          FAA™ is not a payroll platform. It is a sovereign, AI-controlled economic system. 
          Think: Stripe + Deel + Giving Block — but fully automated, no human staff, and built on the FAA Grid.
        </p>
      </section>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid grid-cols-5 gap-2 mb-6">
          <TabsTrigger value="comparison">🆚 vs Deel</TabsTrigger>
          <TabsTrigger value="pricing">💰 Pricing</TabsTrigger>
          <TabsTrigger value="modules">🧠 AI Modules</TabsTrigger>
          <TabsTrigger value="metrics">📊 Metrics</TabsTrigger>
          <TabsTrigger value="features">🔧 Features</TabsTrigger>
        </TabsList>

        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>🆚 FAA™ vs Deel – Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 font-semibold text-gray-700">Feature</th>
                      <th className="py-2 px-4 font-semibold text-indigo-700">FAA™ Payroll</th>
                      <th className="py-2 px-4 font-semibold text-gray-700">Deel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.feature}</td>
                        <td className={`py-3 px-4 ${row.advantage === 'faa' ? 'text-green-700 font-semibold' : ''}`}>
                          {row.faa}
                          {row.advantage === 'faa' && <span className="ml-2">✅</span>}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{row.deel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, idx) => (
              <Card key={idx} className={`${tier.highlight ? 'border-2 border-indigo-500 shadow-lg' : ''}`}>
                <CardHeader className="text-center">
                  {tier.highlight && (
                    <Badge className="mb-2 bg-indigo-100 text-indigo-800">Most Popular</Badge>
                  )}
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-indigo-600">
                    {tier.price}<span className="text-sm text-gray-500">{tier.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tier.employees}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.highlight ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    data-testid={`button-select-${tier.name}`}
                  >
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Modules Tab */}
        <TabsContent value="modules">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">🧠 AI Modules Overview</h3>
              {aiModules.map((module, idx) => (
                <Card 
                  key={idx} 
                  className={`cursor-pointer transition-all ${activeModule === module.name ? 'border-indigo-500 bg-indigo-50' : ''}`}
                  onClick={() => setActiveModule(module.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{module.name}</h4>
                      <Badge variant={module.status === 'Active' ? 'default' : 'secondary'}>
                        {module.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    <div className="text-xs">
                      <span className="font-semibold">Accuracy: </span>
                      <span className="text-green-600">{module.accuracy}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Module Details: {activeModule}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Performance Metrics</h5>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {aiModules.find(m => m.name === activeModule)?.accuracy}
                        </div>
                        <div className="text-sm text-gray-600">Current Accuracy Rate</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Integration Status</h5>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">VaultMesh™ Connected</span>
                      </div>
                    </div>
                    <Button className="w-full">Configure Module</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Global Metrics Tab */}
        <TabsContent value="metrics">
          <div>
            <h2 className="text-2xl font-bold mb-6">🌍 Global Metrics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalMetrics.map((metric, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                    <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                      {metric.change} from last month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Live Activity Feed */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>🔴 Live Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>🇺🇸 United States - Payroll processed</span>
                    <span className="text-gray-500">2 seconds ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>🇬🇧 United Kingdom - Compliance check passed</span>
                    <span className="text-gray-500">7 seconds ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>🇩🇪 Germany - Ghost shift detected & blocked</span>
                    <span className="text-gray-500">12 seconds ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>🇦🇺 Australia - CTC validation completed</span>
                    <span className="text-gray-500">18 seconds ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🛰 Sovereign Grid Technology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">VaultMesh™ 9-second validation cycles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Zero-human automation protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Global compliance grid integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Immutable audit trail generation</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🤖 AI-Powered Automation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">GhostFlag™ fraud detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">CTC Tracker AI validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">ShiftSync Grid optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Role-to-Pay real-time analysis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Deploy Sovereign Payroll?</h2>
        <p className="mb-6">Join 12,847+ companies already using FAA Payroll™ for zero-friction global payroll automation.</p>
        <div className="flex justify-center gap-4">
          <Button className="bg-white text-indigo-600 hover:bg-gray-100">
            🚀 Start Free Trial
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
            📞 Schedule Demo
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>FAA Payroll™ Sovereign Economic Grid • VaultMesh™ Certified • Zero-Human Automation</p>
        <p className="mt-1">Global compliance across 156 countries • 99.94% uptime guarantee</p>
      </div>
    </div>
  );
}