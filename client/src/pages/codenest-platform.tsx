import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";

const activeProjects = [
  {
    id: "CN-1023",
    name: "🌀 Brand Landing Page",
    type: "Landing Scroll",
    status: "Active",
    lastModified: "2 hours ago",
    claimStatus: "Verified"
  },
  {
    id: "CN-1028", 
    name: "🛒 ScrollCart Checkout",
    type: "Checkout Scroll",
    status: "Active",
    lastModified: "1 day ago",
    claimStatus: "Verified"
  },
  {
    id: "CN-1031",
    name: "🌐 VaultDNS Microsite",
    type: "Microsite",
    status: "Active", 
    lastModified: "3 days ago",
    claimStatus: "Verified"
  }
];

const activeScrolls = [
  {
    id: "CN-0401",
    name: "CodeNest™ – Web Dev Scroll Studio",
    region: "Global",
    royalty: "6%",
    activationDate: "2025-04-01",
    claimStatus: "Enabled",
    status: "Active"
  },
  {
    id: "QC-1079",
    name: "QuickClaim™ – Checkout Scroll",
    region: "Local",
    royalty: "6%",
    activationDate: "2025-03-21", 
    claimStatus: "Enabled",
    status: "Active"
  },
  {
    id: "VD-2201",
    name: "VaultDNS™ – Micro Scroll Node",
    region: "Regional",
    royalty: "5%",
    activationDate: "2025-04-10",
    claimStatus: "Pending Sync",
    status: "Pending"
  }
];

const scrollTemplates = [
  {
    id: "landing-scroll",
    name: "Landing Scroll",
    description: "Perfect for product launches and branded homepage scrolls. ClaimRoot-ready with starter scroll pack.",
    icon: "🎯",
    features: ["Product Launch Ready", "Branded Homepage", "ClaimRoot Integration", "Starter Pack"]
  },
  {
    id: "checkout-scroll",
    name: "Checkout Scroll", 
    description: "Designed for single-item sales and embedded payment logic. ScrollCart + AutoClaim enabled.",
    icon: "🛒",
    features: ["Single-Item Sales", "Payment Logic", "ScrollCart Integration", "AutoClaim"]
  },
  {
    id: "scrollblog",
    name: "ScrollBlog",
    description: "A content-first template with VaultDNS structure for newsletters, updates, or creative serials.",
    icon: "📝",
    features: ["Content-First", "Newsletter Ready", "VaultDNS Structure", "Creative Serials"]
  },
  {
    id: "vault-microsite",
    name: "Vault Microsite",
    description: "Multi-page scroll micro-infrastructure. Great for portfolios, micro-brand kits, or client claim hubs.",
    icon: "🌐",
    features: ["Multi-Page", "Portfolio Ready", "Micro-Brand Kits", "Client Hubs"]
  }
];

const scrollBuilderFeatures = [
  "HTML Code Editor with syntax highlighting",
  "CSS Styling with scroll-specific themes",
  "JavaScript Integration for interactive features",
  "ClaimRoot™ Auto-Licensing on save",
  "VaultPay™ Royalty Integration",
  "ScrollStack™ Component Library",
  "DeployNow™ Instant Activation",
  "FAA.Zone Vault Sync"
];

export default function CodeNestPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-orange-900 text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-yellow-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 flex items-center gap-2">
              💻 CodeNest™ Web Dev Scroll Studio
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Build modern sites • Claim your code • Empower your scroll economy • FAA-Certified Platform
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/ai-logic-dashboard">
              <Button className="bg-yellow-600 hover:bg-yellow-500" data-testid="button-ai-dashboard">
                🧠 AI Hub
              </Button>
            </Link>
            <Button className="bg-white text-black hover:bg-gray-200">
              📞 Get License
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-black border-b border-gray-700">
        <div className="flex justify-center">
          {[
            { id: "dashboard", label: "📊 Dashboard", icon: "dashboard" },
            { id: "new-project", label: "🆕 New Project", icon: "plus" },
            { id: "scroll-builder", label: "🛠️ Scroll Builder", icon: "build" },
            { id: "templates", label: "🎨 Templates", icon: "template" },
            { id: "licenses", label: "📜 My Licenses", icon: "license" },
            { id: "settings", label: "⚙️ Settings", icon: "settings" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-yellow-500 text-yellow-400 bg-yellow-900/20"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Panel */}
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Welcome Back</h2>
                <p className="text-gray-300 mb-6">
                  Use CodeNest™ to build, license, and deploy scroll-based web projects. Everything is royalty-synced and ClaimRoot-ready.
                </p>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-500"
                  onClick={() => setActiveTab("new-project")}
                >
                  Start New Scroll Project
                </Button>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <section>
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Your Active Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="bg-gray-950 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg text-yellow-300">{project.name}</span>
                        <Badge className="bg-green-100 text-green-800">
                          {project.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Scroll ID:</span>
                          <span className="text-yellow-400">{project.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">{project.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Modified:</span>
                          <span className="text-white">{project.lastModified}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ClaimRoot:</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {project.claimStatus}
                          </Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500">
                        Open Editor
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* New Project Tab */}
        {activeTab === "new-project" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">🧱 Start a New Scroll Project</h2>
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. UrbanNest Launch Scroll"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Choose Template</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                      <option value="blank">Blank Scroll</option>
                      <option value="landing">Landing Page</option>
                      <option value="checkout">ScrollCart Checkout</option>
                      <option value="microsite">VaultDNS Microsite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Description</label>
                    <textarea 
                      rows={4}
                      placeholder="Describe your project goals, use case, or scroll story..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deployment Region</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                      <option value="global">Global</option>
                      <option value="local">Local Only</option>
                      <option value="street">Street Scroll (Pop-up deploy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Enable ClaimRoot™ Auto-License?</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                      <option value="yes">Yes – License this scroll</option>
                      <option value="no">No – Just save it</option>
                    </select>
                  </div>

                  <Button className="w-full bg-yellow-600 hover:bg-yellow-500 py-3">
                    Create Project
                  </Button>
                  
                  <p className="text-sm text-gray-400 text-center">
                    Scrolls will be saved in your CodeNest workspace and can be synced to FAA.Zone upon deployment.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scroll Builder Tab */}
        {activeTab === "scroll-builder" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">🛠️ Scroll Builder — Deploy Your CodeNest™ Scroll</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Builder Form */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-950 border-yellow-500">
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Scroll Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. VaultIntro Scroll"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Scroll Type</label>
                        <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                          <option value="html">Basic HTML Page</option>
                          <option value="component">FAA Component (Navbar, Footer, Form)</option>
                          <option value="checkout">Single Item Checkout</option>
                          <option value="marketing">Marketing Scroll (Promo)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">HTML Code</label>
                        <textarea 
                          rows={8}
                          placeholder="Paste or write HTML code..."
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">CSS Styling</label>
                        <textarea 
                          rows={6}
                          placeholder="Add scroll styling here..."
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">JavaScript (Optional)</label>
                        <textarea 
                          rows={5}
                          placeholder="Optional scripts, claim triggers, hover FX..."
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Scroll Licensing with ClaimRoot™?</label>
                        <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                          <option value="yes">Yes — Activate scroll claim</option>
                          <option value="no">No — Build only</option>
                        </select>
                      </div>

                      <Button className="w-full bg-yellow-600 hover:bg-yellow-500 py-3">
                        Compile Scroll & Save
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Builder Features */}
              <div>
                <Card className="bg-gray-950 border-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-yellow-300">🚀 Builder Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {scrollBuilderFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">🎨 Select a Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scrollTemplates.map((template) => (
                <Card key={template.id} className="bg-gray-950 border-yellow-500 hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{template.icon}</div>
                    <h3 className="text-lg font-bold text-yellow-300 mb-2 text-center">{template.name}</h3>
                    <p className="text-sm text-gray-300 mb-4">{template.description}</p>
                    <ul className="space-y-1 mb-4">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                          <span className="text-green-400">•</span> {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-500">
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Licenses Tab */}
        {activeTab === "licenses" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">📜 My Licensed Scrolls</h2>
            <div className="space-y-6">
              {activeScrolls.map((scroll) => (
                <Card key={scroll.id} className="bg-gray-950 border-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-300">{scroll.name}</h3>
                        <div className="text-sm text-gray-400 mt-1">License ID: {scroll.id}</div>
                      </div>
                      <Badge className={scroll.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {scroll.status === 'Active' ? '✅' : '🔄'} {scroll.claimStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Region</div>
                        <div className="text-white font-semibold">{scroll.region}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Royalty</div>
                        <div className="text-white font-semibold">{scroll.royalty}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Activation</div>
                        <div className="text-white font-semibold">{scroll.activationDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">ClaimRoot</div>
                        <div className="text-white font-semibold">{scroll.claimStatus}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button className="bg-yellow-600 hover:bg-yellow-500">
                        {scroll.status === 'Active' ? 'Open in Workspace' : 'Sync License Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">⚙️ My Settings</h2>
            
            <Card className="bg-gray-950 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-300">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="ScrollUser001"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue="user@scrollmail.com"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <Button className="bg-yellow-600 hover:bg-yellow-500">Update Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-950 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-300">Scroll Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Deployment Region</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                      <option value="global">Global</option>
                      <option value="local">Local</option>
                      <option value="pop-up">Street Scroll (Pop-up)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Auto-Enable ClaimRoot™ on Save?</label>
                    <select className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <Button className="bg-yellow-600 hover:bg-yellow-500">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-400">
              All changes are synced to your FAA.Zone vault and stored with encrypted ClaimRoot credentials.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-yellow-500">
        FAA.Zone Verified • Scroll ID Linked • Royalty Synced • ClaimRoot™ Enabled • VaultPay™ Integration
      </footer>
    </div>
  );
}