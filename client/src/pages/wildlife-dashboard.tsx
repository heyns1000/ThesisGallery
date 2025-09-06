import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const wildlifeNodes = [
  {
    id: "core-node",
    name: "Core Node™",
    description: "Root-Sync™ AI Layer",
    icon: "🌳",
    purpose: "Centralized Baobab™ Seed Logic Node",
    hardware: "16GB RAM, 256GB SSD, 8-core CPU",
    model: "Core-Node-MX12-256GB",
    price: "$85,000",
    monthly: "$1,500"
  },
  {
    id: "geo-lens", 
    name: "Geo Lens™",
    description: "Geospatial LinkVision™",
    icon: "🌍",
    purpose: "Global mapping with real-time eco-stream",
    hardware: "32GB RAM, 512GB SSD, 10-core CPU", 
    model: "GeoLens-Track-512",
    price: "$120,000",
    monthly: "$2,200"
  },
  {
    id: "energy-beacon",
    name: "Energy Beacon™", 
    description: "EcoPulse Radiants™",
    icon: "⚡",
    purpose: "AI-optimized solar + kinetic grid modules",
    hardware: "12V battery, Solar Panel 500W, Kinetic Generator",
    model: "EnergyBeam-Solar-Kinet", 
    price: "$45,000",
    monthly: "$800"
  },
  {
    id: "security-perimeter",
    name: "Security Perimeter™",
    description: "Baobab PermaFence™", 
    icon: "🛡️",
    purpose: "Wildlife + data defense shell",
    hardware: "32GB RAM, 512GB SSD, Network Antennas",
    model: "PermaFence-Guard",
    price: "$95,000", 
    monthly: "$1,800"
  },
  {
    id: "drone-sentinel",
    name: "Drone Sentinel™",
    description: "AetherNet Hawks™",
    icon: "🚁", 
    purpose: "Sky-level pattern analyzers + threat dispatch",
    hardware: "Drone Sensors, 16GB RAM, 256GB SSD",
    model: "AetherNet-Drone-X",
    price: "$180,000",
    monthly: "$3,500"
  },
  {
    id: "fauna-tag",
    name: "Fauna Tag™",
    description: "Sentinel Ring™", 
    icon: "🦁",
    purpose: "Animal-tracking energy portals",
    hardware: "Animal Tagging Devices, GPS Tracker, 16GB RAM",
    model: "FaunaTrack-TagX",
    price: "$25,000",
    monthly: "$450"
  }
];

const deploymentStats = [
  { region: "Kenya", nodes: 11, status: "Active", scroll: "KENYA-FAAZ-4312" },
  { region: "RSA", nodes: 8, status: "Active", scroll: "RSA-FAAZ-2901" }, 
  { region: "Namibia", nodes: 5, status: "Pending", scroll: "NAM-FAAZ-1847" },
  { region: "Botswana", nodes: 3, status: "Planning", scroll: "BWA-FAAZ-0956" }
];

export default function WildlifeDashboard() {
  const { data: systemStats } = useQuery({
    queryKey: ["/api/system/stats"],
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="bg-white shadow-lg p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-2">
              🌳 Wildlife Sector Dashboard
            </h1>
            <p className="text-gray-500 mt-2">FAA.Zone Sovereign Scrolls · Wildlife Grid</p>
          </div>
          <div className="flex gap-3">
            <Link href="/global-view">
              <Button className="bg-blue-500 hover:bg-blue-600" data-testid="link-global-view">
                🌍 Global View
              </Button>
            </Link>
            <Button className="bg-gray-600 hover:bg-gray-700" data-testid="button-node-setup">
              🖥️ Node Setup
            </Button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">12</div>
            <div className="text-sm text-gray-500">Active Core Nodes</div>
            <div className="text-xs text-gray-400 mt-1">99.9% uptime</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">9</div>
            <div className="text-sm text-gray-500">Geo Nodes Online</div>
            <div className="text-xs text-gray-400 mt-1">Real-time mapping</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">15</div>
            <div className="text-sm text-gray-500">Energy Nodes</div>
            <div className="text-xs text-gray-400 mt-1">780W avg yield</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">45</div>
            <div className="text-sm text-gray-500">Omnidrop Kits</div>
            <div className="text-xs text-gray-400 mt-1">Node-matched</div>
          </CardContent>
        </Card>
      </div>

      {/* Wildlife Node Products */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">📊 Wildlife Node Dashboard</CardTitle>
          <p className="text-gray-600">Explore node features and settings for optimal wildlife management.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wildlifeNodes.map((node) => (
              <Card key={node.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{node.icon}</span>
                    {node.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{node.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <strong>Purpose:</strong> {node.purpose}
                  </div>
                  <div className="text-sm">
                    <strong>Model:</strong> {node.model}
                  </div>
                  <div className="text-xs text-gray-500">
                    Hardware: {node.hardware}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <div className="font-bold text-green-600">{node.price}</div>
                      <div className="text-xs text-gray-500">{node.monthly}/month</div>
                    </div>
                    <Badge variant="outline">Available</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Regions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">🌍 Deployment Regions</CardTitle>
          <p className="text-gray-600">Current wildlife grid deployments across Africa</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {deploymentStats.map((deployment) => (
              <Card key={deployment.region} className="border-l-4 border-l-indigo-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{deployment.region}</h3>
                    <Badge className={
                      deployment.status === 'Active' ? 'bg-green-100 text-green-800' :
                      deployment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {deployment.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Nodes:</strong> {deployment.nodes}</div>
                    <div className="text-xs text-gray-500">
                      Scroll ID: {deployment.scroll}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}