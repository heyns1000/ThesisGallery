import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Globe, Leaf, ShieldCheck, ShoppingCart, Palette, Baby,
  BarChart, FlaskConical, MountainSnow, Users, Smartphone
} from "lucide-react";

const scrollBrands = [
  {
    name: "CodeNest™",
    icon: <Smartphone className="mb-2" />, 
    atomIntro: `CodeNest™ is a web dev scroll suite optimized for freelancers, solo builders and claim-first digital studios. It's equipped with mini-site creators, a fast glyph deployer and auto-claim triggers synced to DeployNow™.`,
    license: "$3,200",
    monthly: "$45 / $80 / $175",
    royalty: "6%",
    includes: ['Mini-scroll builder', 'Site glyphs', 'Client claim tokens'],
    features: ['Pulse-ready claim zones', 'DeployNow™ integrated', 'Client-signed ledger links'],
    metrics: {
      scrollsIssued: 412,
      avgYield: "$3,840/mo",
      timeToPayout: "9.4s",
      coverage: "87%"
    }
  },
  {
    name: "PayLine™",
    icon: <ShieldCheck className="mb-2" />, 
    atomIntro: `PayLine™ delivers sovereign payroll via FAA payout mesh. Engineered for instant wages, it links TaxTrace™, VaultPay™, and contract workers via fast invoice scroll syncs.`,
    license: "$4,100",
    monthly: "$58 / $110 / $250",
    royalty: "9%",
    includes: ['Employee vaults', 'Payflow node', 'Invoice scroll generator'],
    features: ['SME compliance ready', 'Realtime TaxTrace™', 'VaultPay™ secure relay'],
    metrics: {
      scrollsIssued: 591,
      avgYield: "$4,900/mo",
      timeToPayout: "6.2s",
      coverage: "82%"
    }
  },
  {
    name: "HotStack™",
    icon: <FlaskConical className="mb-2" />, 
    atomIntro: `HotStack™ generates websites in minutes. Perfect for brands, events, and creators needing quick, branded, payout-connected sites deployed via VaultDNS™.`,
    license: "$3,600",
    monthly: "$49 / $95 / $200",
    royalty: "7%",
    includes: ['Deployment token', 'Template scrolls', 'DNS auto-binder'],
    features: ['3-min site deploy', 'ScrollStack™ core', 'VaultDNS™ confirmed zone'],
    metrics: {
      scrollsIssued: 612,
      avgYield: "$3,760/mo",
      timeToPayout: "7.1s",
      coverage: "91%"
    }
  },
  {
    name: "QuickClaim™",
    icon: <ShoppingCart className="mb-2" />, 
    atomIntro: `QuickClaim™ is a scroll checkout engine built for creators, vendors, and instant commerce drops. Use one link, one product, one payout — every scroll verified.`,
    license: "$2,800",
    monthly: "$42 / $78 / $160",
    royalty: "6%",
    includes: ['Checkout scroll', 'Sigil hook', 'Receipt module'],
    features: ['ScrollCart™ ready', 'Mobile optimized', 'AutoClaim™ verified'],
    metrics: {
      scrollsIssued: 722,
      avgYield: "$3,120/mo",
      timeToPayout: "9.5s",
      coverage: "88%"
    }
  },
  {
    name: "FirstMover™",
    icon: <Globe className="mb-2" />, 
    atomIntro: `FirstMover™ offers 1st-use scroll logic for claimers and innovation brands. Once used, the scroll NFT triggers exclusivity locking via VaultScan™.`,
    license: "$5,900",
    monthly: "$72 / $140 / $300",
    royalty: "12%",
    includes: ['Exclusive badge', 'NFT wrapper', 'Claim scroll'],
    features: ['GhostTrace™ audit', 'VaultScan™ confirm', 'First-to-Use logic'],
    metrics: {
      scrollsIssued: 109,
      avgYield: "$6,920/mo",
      timeToPayout: "8.4s",
      coverage: "64%"
    }
  }
];

const moduleTypes = [
  {
    type: "Deployment Modules",
    icon: <Globe className="w-6 h-6" />,
    count: 12,
    description: "Instant site deployment with VaultDNS™ integration"
  },
  {
    type: "Payment Modules",
    icon: <ShieldCheck className="w-6 h-6" />,
    count: 8,
    description: "Secure payment processing with VaultPay™ relay"
  },
  {
    type: "Claim Modules",
    icon: <ShoppingCart className="w-6 h-6" />,
    count: 15,
    description: "NFT and ownership verification systems"
  },
  {
    type: "Analytics Modules",
    icon: <BarChart className="w-6 h-6" />,
    count: 6,
    description: "Real-time metrics and performance tracking"
  }
];

const pipelineProjects = [
  {
    name: "VaultStream™",
    progress: 85,
    category: "Media Streaming",
    expected: "Q2 2025"
  },
  {
    name: "ScrollAuth™",
    progress: 72,
    category: "Authentication",
    expected: "Q1 2025"
  },
  {
    name: "DataMesh™",
    progress: 45,
    category: "Database Management",
    expected: "Q3 2025"
  },
  {
    name: "ClaimBot™",
    progress: 28,
    category: "Automation",
    expected: "Q4 2025"
  }
];

export default function CrateDanceSmartGrid() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🍇 Fruitful™ Crate Dance™ Smart Grid</h1>
        <p className="text-gray-600">Scroll brand licensing and deployment ecosystem with VaultMesh™ integration</p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-green-100 px-3 py-1 rounded">
            <span className="text-green-800 font-semibold">✅ ScrollStack™ Active</span>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded">
            <span className="text-blue-800 font-semibold">🔄 Auto-Deploy Ready</span>
          </div>
          <div className="bg-purple-100 px-3 py-1 rounded">
            <span className="text-purple-800 font-semibold">🎯 Claim Logic Verified</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="brands" className="space-y-6">
        {/* Tabs List */}
        <TabsList className="grid grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="brands" data-testid="tab-scroll-brands">🧩 Scroll Brands</TabsTrigger>
          <TabsTrigger value="overview" data-testid="tab-overview">🌐 Overview</TabsTrigger>
          <TabsTrigger value="modules" data-testid="tab-modules">📦 Modules</TabsTrigger>
          <TabsTrigger value="pipeline" data-testid="tab-pipeline">🧪 Pipeline</TabsTrigger>
        </TabsList>

        {/* Brands Tab Content */}
        <TabsContent value="brands">
          <div className="grid md:grid-cols-2 gap-6">
            {scrollBrands.map((brand, idx) => (
              <Card key={idx} className="shadow-lg border-2 hover:shadow-xl transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {brand.icon}
                    <h2 className="text-xl font-bold text-[#38bdf8]" data-testid={`text-brand-${brand.name}`}>
                      {brand.name}
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">{brand.atomIntro}</p>
                  
                  {/* Pricing Information */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-3">
                    <div>
                      <div className="text-xs text-gray-500">LICENSE</div>
                      <div className="font-bold text-green-600">{brand.license}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">MONTHLY</div>
                      <div className="font-bold text-blue-600">{brand.monthly}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ROYALTY</div>
                      <div className="font-bold text-purple-600">{brand.royalty}</div>
                    </div>
                  </div>

                  {/* Includes */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">📦 Includes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {brand.includes.map((item, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">⚡ Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {brand.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Live Metrics */}
                  <div className="bg-black text-white rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2 text-green-400">📊 Live Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Scrolls Issued:</span>
                        <span className="text-white font-mono ml-1" data-testid={`metric-scrolls-${brand.name}`}>
                          {brand.metrics.scrollsIssued}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Yield:</span>
                        <span className="text-green-400 font-mono ml-1">{brand.metrics.avgYield}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Time to Payout:</span>
                        <span className="text-blue-400 font-mono ml-1">{brand.metrics.timeToPayout}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Coverage:</span>
                        <span className="text-yellow-400 font-mono ml-1">{brand.metrics.coverage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" data-testid={`button-deploy-${brand.name}`}>
                      🚀 Deploy Now
                    </Button>
                    <Button variant="outline" className="flex-1" data-testid={`button-license-${brand.name}`}>
                      📄 License Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-sm text-gray-600">Active Scroll Brands</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2,446</div>
                <div className="text-sm text-gray-600">Total Scrolls Issued</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$22,540</div>
                <div className="text-sm text-gray-600">Monthly Yield Average</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">🌐 Ecosystem Overview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">📊 Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Average Payout Time:</span>
                        <span className="font-mono">7.82s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage Rate:</span>
                        <span className="font-mono">82.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VaultMesh™ Uptime:</span>
                        <span className="font-mono text-green-600">99.9%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">🔧 System Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>ScrollStack™ Deployment Engine</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>VaultPay™ Processing Network</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>ClaimRoot™ Verification System</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <div className="grid md:grid-cols-2 gap-6">
            {moduleTypes.map((module, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {module.icon}
                    <h3 className="text-lg font-bold">{module.type}</h3>
                    <Badge variant="secondary">{module.count}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                  <Button className="w-full mt-4" variant="outline">
                    View Modules
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">🧪 Development Pipeline</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {pipelineProjects.map((project, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.category}</p>
                      </div>
                      <Badge variant="outline">{project.expected}</Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={project.progress > 70 ? "default" : "outline"}
                      data-testid={`button-view-${project.name}`}
                    >
                      {project.progress > 70 ? "🎯 Almost Ready" : "🔧 In Development"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Fruitful™ Crate Dance™ Smart Grid • ScrollStack™ Certified • VaultMesh™ Integration Active</p>
        <p className="mt-1">All scroll brands verified via ClaimRoot™ • Instant deployment via DeployNow™</p>
      </div>
    </div>
  );
}