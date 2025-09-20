import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";
import { getContent } from "@/lib/appData";

const sectorIndex = [
  {
    glyph: "🧺",
    sector: "Retail, Vendor & Trade",
    brands: 183,
    nodes: 1098,
    monthlyFee: "$88",
    annualFee: "$888",
    tier: "A+",
    region: "Div A-F"
  },
  {
    glyph: "🧠",
    sector: "AI, Logic & Grid Systems",
    brands: 188,
    nodes: 752,
    monthlyFee: "$104",
    annualFee: "$1,050",
    tier: "A+",
    region: "Global"
  },
  {
    glyph: "🖋️",
    sector: "Creative & Design Systems",
    brands: 142,
    nodes: 710,
    monthlyFee: "$67",
    annualFee: "$720",
    tier: "A",
    region: "Div E"
  },
  {
    glyph: "₿",
    sector: "Finance & Token Yield",
    brands: 136,
    nodes: 680,
    monthlyFee: "$125",
    annualFee: "$1,250",
    tier: "A+",
    region: "Div A-E"
  },
  {
    glyph: "📴",
    sector: "Webless Tech & Nodes",
    brands: 103,
    nodes: 515,
    monthlyFee: "$76",
    annualFee: "$770",
    tier: "A",
    region: "Div D-G"
  },
  {
    glyph: "📦",
    sector: "Logistics & Packaging",
    brands: 111,
    nodes: 444,
    monthlyFee: "$58",
    annualFee: "$595",
    tier: "B+",
    region: "Div B-F"
  },
  {
    glyph: "✿",
    sector: "Food, Soil & Farming",
    brands: 83,
    nodes: 332,
    monthlyFee: "$46",
    annualFee: "$480",
    tier: "B+",
    region: "Rural"
  },
  {
    glyph: "🧒",
    sector: "Youth & Education",
    brands: 66,
    nodes: 330,
    monthlyFee: "$39",
    annualFee: "$420",
    tier: "A",
    region: "Tribal"
  },
  {
    glyph: "⚗",
    sector: "Health & Hygiene",
    brands: 93,
    nodes: 372,
    monthlyFee: "$52",
    annualFee: "$550",
    tier: "B",
    region: "Div F"
  },
  {
    glyph: "☯",
    sector: "Aura, Ritual & Culture",
    brands: 74,
    nodes: 296,
    monthlyFee: "$68",
    annualFee: "$725",
    tier: "A",
    region: "Div C"
  },
  {
    glyph: "🏗️",
    sector: "Housing & Infrastructure",
    brands: 91,
    nodes: 364,
    monthlyFee: "$59",
    annualFee: "$610",
    tier: "B+",
    region: "Div A-F"
  },
  {
    glyph: "🔁",
    sector: "NFT, IP, Ownership Grid",
    brands: 58,
    nodes: 232,
    monthlyFee: "$120",
    annualFee: "$1,200",
    tier: "A",
    region: "FAA IP"
  },
  {
    glyph: "🌀",
    sector: "Motion, Media, Sonic",
    brands: 78,
    nodes: 312,
    monthlyFee: "$72",
    annualFee: "$740",
    tier: "A",
    region: "Creative"
  }
];

const accessTypes = [
  {
    id: "loyalty",
    name: "Loyalty Access",
    description: "Brand partners, rewards & alliance view",
    icon: "🪙",
    color: "blue"
  },
  {
    id: "shareholder",
    name: "Shareholder Access",
    description: "Governance & ecosystem metrics dashboard",
    icon: "📊",
    color: "gray"
  },
  {
    id: "service",
    name: "Service Provider",
    description: "Integration & deployment tools",
    icon: "🤝",
    color: "green"
  },
  {
    id: "family",
    name: "Family Access",
    description: "Personal vaults, archive access & memory mesh",
    icon: "👨‍👩‍👧‍👦",
    color: "purple"
  }
];

const sectorList = {
  "ai-logic": "🧠 AI, Logic & Grid",
  "creative": "🖋️ Creative Tech",
  "logistics": "📦 Logistics & Packaging",
  "education-ip": "📚 Education & IP",
  "fashion": "✂ Fashion & Identity",
  "gaming": "🎮 Gaming & Simulation",
  "health": "🧠 Health & Hygiene",
  "housing": "🏗️ Housing & Infrastructure",
  "justice": "⚖ Justice & Ethics",
  "knowledge": "🧠 Knowledge & Archives",
  "micromesh": "☰ Micro-Mesh Logistics",
  "media": "🎬 Motion, Media & Sonic",
  "nutrition": "✿ Nutrition & Food Chain",
  "packaging": "📦 Packaging & Materials",
  "quantum": "✴️ Quantum Protocols",
  "ritual": "☯ Ritual & Culture",
  "saas": "🔑 SaaS & Licensing",
  "trade": "🧺 Trade Systems",
  "utilities": "🔋 Utilities & Energy",
  "voice": "🎙️ Voice & Audio",
  "webless": "📡 Webless Tech & Nodes",
  "nft": "🔁 NFT & Ownership",
  "education-youth": "🎓 Education & Youth",
  "zerowaste": "♻️ Zero Waste",
  "professional": "🧾 Professional Services"
};

export default function AdminPortal() {
  const content = getContent('admin-portal');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSector, setSelectedSector] = useState("ai-logic");
  const [brandName, setBrandName] = useState("");
  const [subnodes, setSubnodes] = useState("");
  const [adminStatus, setAdminStatus] = useState("Ready to receive input.");

  const handleAddBrand = () => {
    if (!brandName || !subnodes) {
      setAdminStatus("⚠️ Please fill in both fields.");
      return;
    }
    
    const nodeCount = subnodes.split(",").length;
    setAdminStatus(`✅ Added ${brandName} to ${sectorList[selectedSector as keyof typeof sectorList]} (${nodeCount} nodes)`);
    setBrandName("");
    setSubnodes("");
  };

  const getTierColor = (tier: string) => {
    if (tier === "A+") return "bg-green-100 text-green-800";
    if (tier === "A") return "bg-blue-100 text-blue-800";
    if (tier === "B+") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-6 shadow">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-admin-title">{content.sections.header.title}</h1>
            <p className="text-sm opacity-80 mt-2" data-testid="text-admin-subtitle">{content.sections.header.description}</p>
          </div>
          
          {/* Access Control Buttons */}
          <div className="flex space-x-2">
            {accessTypes.map((access) => (
              <Link key={access.id} href="/admin-access-portal">
                <Button 
                  className={`text-sm font-semibold px-4 py-1 ${
                    access.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                    access.color === 'gray' ? 'bg-gray-800 hover:bg-gray-900' :
                    access.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {access.icon} {access.name.split(' ')[0]} Access
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "📊 Dashboard", icon: "dashboard" },
              { id: "brand-management", label: "🏷️ Brand Management", icon: "brands" },
              { id: "sector-index", label: "📋 Sector Index", icon: "sectors" },
              { id: "deployment", label: "🚀 Deployment", icon: "deploy" },
              { id: "access-control", label: "🔐 Access Control", icon: "access" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-dashboard-pulse-title">{content.sections.dashboard.title}</CardTitle>
                <p className="text-sm text-gray-500">VaultMesh Actuarial Grid · Real-Time Scroll Activity</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      {sectorIndex.reduce((sum, sector) => sum + sector.brands, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Core Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {sectorIndex.reduce((sum, sector) => sum + sector.nodes, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Nodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {sectorIndex.length}
                    </div>
                    <div className="text-sm text-gray-500">Active Sectors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌍 Global Ecosystem Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/ai-logic-dashboard">
                    <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer">
                      <div className="text-2xl mb-2">🧠</div>
                      <div className="font-semibold">AI & Logic Grid</div>
                      <div className="text-sm text-gray-500">188 brands active</div>
                    </div>
                  </Link>
                  <Link href="/education-dashboard">
                    <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition cursor-pointer">
                      <div className="text-2xl mb-2">🧸</div>
                      <div className="font-semibold">Education Sector</div>
                      <div className="text-sm text-gray-500">66+ brands active</div>
                    </div>
                  </Link>
                  <Link href="/housing-dashboard">
                    <div className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition cursor-pointer">
                      <div className="text-2xl mb-2">🏛️</div>
                      <div className="font-semibold">Housing Sector</div>
                      <div className="text-sm text-gray-500">91 brands active</div>
                    </div>
                  </Link>
                  <Link href="/mining-dashboard">
                    <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition cursor-pointer">
                      <div className="text-2xl mb-2">⛏️</div>
                      <div className="font-semibold">Mining Ecosystem</div>
                      <div className="text-sm text-gray-500">6 platforms</div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Brand Management Tab */}
        {activeTab === "brand-management" && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Admin Panel — Add Brand & Subnodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm block font-medium mb-1">📂 Sector</label>
                    <select 
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="w-full border rounded p-2 bg-gray-50"
                    >
                      {Object.entries(sectorList).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm block font-medium mb-1">🏷 Brand Name</label>
                    <input 
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full border rounded p-2" 
                      placeholder="e.g. OmniCastX"
                    />
                  </div>
                  <div>
                    <label className="text-sm block font-medium mb-1">📌 Subnodes</label>
                    <input 
                      value={subnodes}
                      onChange={(e) => setSubnodes(e.target.value)}
                      className="w-full border rounded p-2" 
                      placeholder="e.g. VaultDrop, QRClaim"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAddBrand}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
                    >
                      ➕ Add Brand
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Deployment Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm block font-medium mb-1">🏷️ Sector Name</label>
                    <input className="w-full border rounded p-2" placeholder="e.g. AI Logic" />
                  </div>
                  <div>
                    <label className="text-sm block font-medium mb-1">📁 Sector File Path</label>
                    <input className="w-full border rounded p-2" placeholder="e.g. faa.zone/public/sectors/ai-logic/" />
                  </div>
                  <div>
                    <label className="text-sm block font-medium mb-1">🚀 Deploy To</label>
                    <select className="w-full border rounded p-2 bg-gray-50">
                      <option>Cloudware Worker 1</option>
                      <option>Cloudware Worker 2</option>
                      <option>Cloudware Worker 3</option>
                      <option>OpenAI Assistant</option>
                      <option>Vector Store</option>
                      <option>Local Folders</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ℹ️ Admin Status Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 italic">{adminStatus}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sector Index Tab */}
        {activeTab === "sector-index" && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>⦿ FAA.ZONE INDEX — Expanded Table Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                      <tr>
                        <th className="px-4 py-2">Glyph</th>
                        <th className="px-4 py-2">Sector</th>
                        <th className="px-4 py-2">Core Brands</th>
                        <th className="px-4 py-2">Total Nodes</th>
                        <th className="px-4 py-2">Monthly Fee</th>
                        <th className="px-4 py-2">Annual Fee</th>
                        <th className="px-4 py-2">Payout Tier</th>
                        <th className="px-4 py-2">Region</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {sectorIndex.map((sector, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 text-xl">{sector.glyph}</td>
                          <td className="px-4 py-2 font-medium">{sector.sector}</td>
                          <td className="px-4 py-2">{sector.brands}</td>
                          <td className="px-4 py-2">{sector.nodes.toLocaleString()}</td>
                          <td className="px-4 py-2">{sector.monthlyFee}</td>
                          <td className="px-4 py-2">{sector.annualFee}</td>
                          <td className="px-4 py-2">
                            <Badge className={getTierColor(sector.tier)}>
                              {sector.tier}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">{sector.region}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800">
                                Deploy
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Access Control Tab */}
        {activeTab === "access-control" && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Seedwave™ Access Management</CardTitle>
                <p className="text-sm text-gray-500">Manage access permissions for different user types</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {accessTypes.map((access) => (
                    <div key={access.id} className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                      access.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                      access.color === 'gray' ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' :
                      access.color === 'green' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                      'bg-purple-50 border-purple-200 hover:bg-purple-100'
                    }`}>
                      <div className="text-center">
                        <div className="text-3xl mb-2">{access.icon}</div>
                        <div className="text-xl font-semibold">{access.name}</div>
                        <p className="text-sm mt-1 text-gray-600">{access.description}</p>
                        <Link href="/admin-access-portal">
                          <Button className="mt-4" variant="outline">
                            Manage Access
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-16 py-8 bg-gray-100">
        FAA.Zone Mesh • TreatyMesh Certified • All roles encrypted & routed via ⛓️ SecureScroll✂
      </footer>
    </div>
  );
}