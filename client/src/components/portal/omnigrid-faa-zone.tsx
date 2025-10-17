import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, Edit } from "lucide-react";
import { 
  Activity, 
  Globe, 
  Shield, 
  Zap, 
  Database, 
  Settings, 
  BarChart3,
  Download,
  Upload,
  Server,
  Monitor,
  Cpu,
  Network,
  Lock,
  Unlock,
  Power,
  Activity as Pulse
} from "lucide-react";

// OmniGrid FAA.zone Data Structures
const pulseTradeSectors = [
  { 
    glyph: "🧺", 
    name: "Retail, Vendor & Trade", 
    brands: 183, 
    nodes: 1098, 
    monthlyFee: 88, 
    annualFee: 888, 
    tier: "A+", 
    region: "Div A-F",
    description: "Comprehensive retail and vendor ecosystem management"
  },
  { 
    glyph: "🧠", 
    name: "AI, Logic & Grid Systems", 
    brands: 188, 
    nodes: 752, 
    monthlyFee: 104, 
    annualFee: 1050, 
    tier: "A+", 
    region: "Global",
    description: "Advanced AI systems and intelligent grid infrastructure"
  },
  { 
    glyph: "🖋️", 
    name: "Creative & Design Systems", 
    brands: 142, 
    nodes: 710, 
    monthlyFee: 67, 
    annualFee: 720, 
    tier: "A", 
    region: "Div E",
    description: "Creative technology and design automation platforms"
  },
  { 
    glyph: "₿", 
    name: "Finance & Token Yield", 
    brands: 136, 
    nodes: 680, 
    monthlyFee: 125, 
    annualFee: 1250, 
    tier: "A+", 
    region: "Div A-E",
    description: "Blockchain finance and decentralized token ecosystems"
  },
  { 
    glyph: "📴", 
    name: "Webless Tech & Nodes", 
    brands: 103, 
    nodes: 515, 
    monthlyFee: 76, 
    annualFee: 770, 
    tier: "A", 
    region: "Div D-G",
    description: "Offline-first technology and distributed node networks"
  },
  { 
    glyph: "📦", 
    name: "Logistics & Packaging", 
    brands: 111, 
    nodes: 444, 
    monthlyFee: 58, 
    annualFee: 595, 
    tier: "B+", 
    region: "Div B-F",
    description: "Supply chain optimization and smart packaging solutions"
  },
  { 
    glyph: "✿", 
    name: "Food, Soil & Farming", 
    brands: 83, 
    nodes: 332, 
    monthlyFee: 46, 
    annualFee: 480, 
    tier: "B+", 
    region: "Rural",
    description: "Agricultural technology and sustainable farming systems"
  },
  { 
    glyph: "🧒", 
    name: "Youth & Education", 
    brands: 66, 
    nodes: 330, 
    monthlyFee: 39, 
    annualFee: 420, 
    tier: "A", 
    region: "Tribal",
    description: "Educational platforms and youth development technologies"
  },
  { 
    glyph: "⚗", 
    name: "Health & Hygiene", 
    brands: 93, 
    nodes: 372, 
    monthlyFee: 52, 
    annualFee: 550, 
    tier: "B", 
    region: "Div F",
    description: "Healthcare technology and hygiene monitoring systems"
  },
  { 
    glyph: "☯", 
    name: "Aura, Ritual & Culture", 
    brands: 74, 
    nodes: 296, 
    monthlyFee: 68, 
    annualFee: 725, 
    tier: "A", 
    region: "Div C",
    description: "Cultural technology and spiritual practice platforms"
  },
  { 
    glyph: "🏗️", 
    name: "Housing & Infrastructure", 
    brands: 91, 
    nodes: 364, 
    monthlyFee: 59, 
    annualFee: 610, 
    tier: "B+", 
    region: "Div A-F",
    description: "Smart infrastructure and residential technology systems"
  },
  { 
    glyph: "🔁", 
    name: "NFT, IP, Ownership Grid", 
    brands: 58, 
    nodes: 232, 
    monthlyFee: 120, 
    annualFee: 1200, 
    tier: "A", 
    region: "FAA IP",
    description: "Intellectual property and digital ownership management"
  },
  { 
    glyph: "🌀", 
    name: "Motion, Media, Sonic", 
    brands: 78, 
    nodes: 312, 
    monthlyFee: 72, 
    annualFee: 740, 
    tier: "A", 
    region: "Creative",
    description: "Multimedia production and sonic experience platforms"
  }
];

const atomLevelEngines = [
  {
    name: "Corethink™",
    description: "Strategic intelligence core processing engine",
    capabilities: ["Deep Logic Analysis", "Strategic Decision Trees", "Core Intelligence Processing"],
    metrics: { performance: 95, reliability: 98, efficiency: 92 }
  },
  {
    name: "TruthWeight™",
    description: "Data verification and truth analysis system",
    capabilities: ["Truth Verification", "Data Integrity Checks", "Reality Mapping"],
    metrics: { performance: 97, reliability: 99, efficiency: 94 }
  },
  {
    name: "EchoSynth™",
    description: "Echo generation and synthesis engine",
    capabilities: ["Audio Synthesis", "Echo Processing", "Harmonic Generation"],
    metrics: { performance: 89, reliability: 96, efficiency: 91 }
  },
  {
    name: "AutoSigil™",
    description: "Automated signature and authentication system",
    capabilities: ["Digital Signatures", "Authentication", "Identity Verification"],
    metrics: { performance: 93, reliability: 97, efficiency: 95 }
  },
  {
    name: "PulseIndex™",
    description: "Real-time pulse monitoring and indexing",
    capabilities: ["Pulse Monitoring", "Real-time Indexing", "Performance Tracking"],
    metrics: { performance: 91, reliability: 95, efficiency: 88 }
  },
  {
    name: "OmniTrace™",
    description: "Universal tracking and trace analysis",
    capabilities: ["Universal Tracking", "Trace Analysis", "Path Optimization"],
    metrics: { performance: 96, reliability: 98, efficiency: 93 }
  },
  {
    name: "LiftHalo™",
    description: "Elevation and halo effect processing",
    capabilities: ["Performance Lifting", "Halo Effects", "Efficiency Boosting"],
    metrics: { performance: 88, reliability: 94, efficiency: 97 }
  },
  {
    name: "MirrorLoop™",
    description: "Recursive mirror processing system",
    capabilities: ["Mirror Processing", "Loop Optimization", "Recursive Analysis"],
    metrics: { performance: 90, reliability: 92, efficiency: 89 }
  },
  {
    name: "FireRatio™",
    description: "High-performance ratio calculation engine",
    capabilities: ["Ratio Calculations", "Performance Metrics", "Optimization Algorithms"],
    metrics: { performance: 94, reliability: 96, efficiency: 98 }
  }
];

const vaultTerminals = [
  { id: "vault-master", name: "🦍 VaultMaster Terminal", description: "Primary vault management interface" },
  { id: "cube-lattice", name: "🧱 Cube Lattice GPT", description: "3D structural analysis and modeling" },
  { id: "global-view", name: "🌍 Global View GPT", description: "Worldwide ecosystem monitoring" },
  { id: "freight-ops", name: "🚚 Freight Ops GPT", description: "Logistics and freight optimization" },
  { id: "loop-watch", name: "♻️ Loop Watch GPT", description: "Circular economy monitoring" },
  { id: "seedwave", name: "🌱 Seedwave GPT", description: "Agricultural and seed technology" },
  { id: "distribution", name: "📦 Distribution GPT", description: "Distribution network management" },
  { id: "signal", name: "🔐 Signal GPT", description: "Secure communications hub" },
  { id: "faa-brands", name: "📦 7038 FAA Brands", description: "Complete brand ecosystem access" }
];

interface OmniGridFAAZoneProps {
  className?: string;
}

export function OmniGridFAAZone({ className }: OmniGridFAAZoneProps) {
  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [selectedEngine, setSelectedEngine] = useState<string>("");
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    performance: 0,
    security: 0,
    efficiency: 0,
    uptime: 0
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const queryClient = useQueryClient();

  // Real system metrics from database monitoring
  useEffect(() => {
    if (monitoringActive) {
      // Real business monitoring - fetch actual system metrics from database
      const fetchRealMetrics = async () => {
        try {
          const response = await fetch('/api/system-metrics');
          if (response.ok) {
            const metrics = await response.json();
            setSystemMetrics({
              performance: metrics.performance || 0,
              security: metrics.security || 0,
              efficiency: metrics.efficiency || 0,
              uptime: metrics.uptime || 0
            });
          }
        } catch (error) {
          console.error('Failed to fetch real system metrics:', error);
        }
      };
      
      fetchRealMetrics(); // Initial fetch
      const interval = setInterval(fetchRealMetrics, 30000); // Real business monitoring every 30 seconds

      return () => clearInterval(interval);
    }
  }, [monitoringActive]);

  const totalBrands = pulseTradeSectors.reduce((sum, sector) => sum + sector.brands, 0);
  const totalNodes = pulseTradeSectors.reduce((sum, sector) => sum + sector.nodes, 0);
  const avgMonthlyFee = Math.round(pulseTradeSectors.reduce((sum, sector) => sum + sector.monthlyFee, 0) / pulseTradeSectors.length);

  // Handler functions for sector actions
  const handleSectorView = (sector: any) => {
    setSelectedSector(sector);
  };

  const handleSectorDeploy = (sector: any) => {
    // Real deployment logic for the sector
    deployMutation.mutate({
      sectorName: sector.name,
      brands: sector.brands,
      nodes: sector.nodes,
      tier: sector.tier,
      region: sector.region,
      monthlyFee: sector.monthlyFee
    });
  };

  // User management handlers
  const handleAddUser = () => {
    const email = prompt("Enter user email:");
    if (email) {
      const role = prompt("Enter user role (Admin/Manager/User):", "User");
      addUserMutation.mutate({ email, role: role || "User" });
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user: any) => {
    const newRole = prompt(`Edit role for ${user.email}:`, user.role || "User");
    if (newRole && newRole !== user.role) {
      updateUserMutation.mutate({ id: user.id, role: newRole });
    }
  };

  const handleActivateUser = (user: any) => {
    updateUserMutation.mutate({ 
      id: user.id, 
      status: user.status === "Active" ? "Inactive" : "Active" 
    });
  };

  // Mutations for user management
  const addUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return apiRequest(`/api/users`, {
        method: "POST",
        body: JSON.stringify(userData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      alert("User added successfully!");
    },
    onError: (error) => {
      alert(`Failed to add user: ${error}`);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return apiRequest(`/api/users/${userData.id}`, {
        method: "PATCH",
        body: JSON.stringify(userData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      alert("User updated successfully!");
    },
    onError: (error) => {
      alert(`Failed to update user: ${error}`);
    }
  });

  // Real deployment mutation
  const deployMutation = useMutation({
    mutationFn: async (deploymentData: any) => {
      return apiRequest('/api/sectors/deploy', {
        method: 'POST',
        body: JSON.stringify(deploymentData)
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sectors'] });
      setSelectedSector(null);
      // Show real deployment confirmation
      alert(`Deployment completed successfully!\n\nSector: ${result.sectorName}\nStatus: ${result.status}\nDeployment ID: ${result.deploymentId}`);
    },
    onError: (error) => {
      alert(`Deployment failed: ${error.message}`);
    }
  });

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Network className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OmniGrid™ FAA.zone™
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          The Universal Interconnected Network of FAA.zone™ - foundational, globally distributed network 
          seamlessly connecting all FAA-regulated sectors, protocols, and data streams for real-time 
          synchronization and universal access across the entire ecosystem.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-1">
            <Globe className="h-3 w-3" />
            {totalBrands.toLocaleString()} Total Brands
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Server className="h-3 w-3" />
            {totalNodes.toLocaleString()} Active Nodes
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            FAA Quantum Drop Capable
          </Badge>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              System Status & Metrics
            </CardTitle>
            <CardDescription>Real-time monitoring of OmniGrid™ infrastructure</CardDescription>
          </div>
          <Button
            variant={monitoringActive ? "destructive" : "default"}
            onClick={() => setMonitoringActive(!monitoringActive)}
            className="gap-2"
          >
            {monitoringActive ? <Power className="h-4 w-4" /> : <Pulse className="h-4 w-4" />}
            {monitoringActive ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.performance.toFixed(1)}%</span>
              </div>
              <Progress value={systemMetrics.performance} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.security.toFixed(1)}%</span>
              </div>
              <Progress value={systemMetrics.security} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Efficiency</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.efficiency.toFixed(1)}%</span>
              </div>
              <Progress value={systemMetrics.efficiency} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.uptime.toFixed(1)}%</span>
              </div>
              <Progress value={systemMetrics.uptime} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pulsetrade" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pulsetrade">PulseTrade™ Grid</TabsTrigger>
          <TabsTrigger value="engines">Atom-Level Engines</TabsTrigger>
          <TabsTrigger value="terminals">Vault Terminals</TabsTrigger>
          <TabsTrigger value="admin">Admin Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="pulsetrade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                PulseTrade™ System Override Grid
              </CardTitle>
              <CardDescription>
                MONSTER OMNI™ Node Activated · FAA Quantum Drop Capable · All Threads Sovereign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pulseTradeSectors.map((sector) => (
                  <Card key={sector.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{sector.glyph}</span>
                          <div>
                            <CardTitle className="text-base">{sector.name}</CardTitle>
                            <CardDescription className="text-xs">{sector.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={sector.tier === "A+" ? "default" : "secondary"}>
                          {sector.tier}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Brands:</span>
                          <div className="font-semibold">{sector.brands}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nodes:</span>
                          <div className="font-semibold">{sector.nodes.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly:</span>
                          <div className="font-semibold">${sector.monthlyFee}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Region:</span>
                          <div className="font-semibold text-xs">{sector.region}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleSectorView(sector)}
                        >
                          <Activity className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleSectorDeploy(sector)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                Atom-Level Engines
              </CardTitle>
              <CardDescription>
                Powered by 9 Core Atom-Level Engines with real-time performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {atomLevelEngines.map((engine) => (
                  <Card key={engine.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {engine.name}
                        <Badge variant="outline">Active</Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">{engine.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span>Performance</span>
                          <span>{engine.metrics.performance}%</span>
                        </div>
                        <Progress value={engine.metrics.performance} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Reliability</span>
                          <span>{engine.metrics.reliability}%</span>
                        </div>
                        <Progress value={engine.metrics.reliability} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Efficiency</span>
                          <span>{engine.metrics.efficiency}%</span>
                        </div>
                        <Progress value={engine.metrics.efficiency} className="h-1" />
                      </div>
                      <div className="space-y-1">
                        {engine.capabilities.map((capability, index) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terminals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-500" />
                Vault Terminal Access
              </CardTitle>
              <CardDescription>
                Secure access to specialized terminals and GPT systems across the OmniGrid™
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vaultTerminals.map((terminal) => (
                  <Card key={terminal.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {terminal.name}
                        <Unlock className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
                      </CardTitle>
                      <CardDescription className="text-xs">{terminal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Monitor className="h-3 w-3 mr-1" />
                          Access
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Launch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                Seedwave™ Admin Portal
              </CardTitle>
              <CardDescription>
                Core brands management & AI logic deployment center with comprehensive access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Access Controls */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Database className="h-6 w-6" />
                  <span className="text-xs">🪙 Loyalty Access</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-xs">📊 Shareholder Access</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Network className="h-6 w-6" />
                  <span className="text-xs">🤝 Service Provider</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-xs">👨‍👩‍👧‍👦 Family Access</span>
                </Button>
              </div>

              {/* Brand Management Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Add Brand & Subnodes</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sector-select">📂 Sector</Label>
                    <Select value={selectedSector?.name || ""} onValueChange={(value) => {
                      const sector = pulseTradeSectors.find(s => s.name === value);
                      setSelectedSector(sector || null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector..." />
                      </SelectTrigger>
                      <SelectContent>
                        {pulseTradeSectors.map((sector) => (
                          <SelectItem key={sector.name} value={sector.name}>
                            {sector.glyph} {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-input">🏷 Brand Name</Label>
                    <Input placeholder="e.g. OmniCastX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subnodes-input">📌 Subnodes</Label>
                    <Input placeholder="e.g. VaultDrop, QRClaim" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      ➕ Add Brand
                    </Button>
                  </div>
                </div>
              </div>

              {/* FAA.ZONE INDEX Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">FAA.ZONE INDEX — Expanded Table Structure</h3>
                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 text-sm font-medium">
                      <div>Sector</div>
                      <div>Core Brands</div>
                      <div>Total Nodes</div>
                      <div>Monthly Fee</div>
                      <div>Tier</div>
                      <div>Actions</div>
                    </div>
                    {pulseTradeSectors.slice(0, 5).map((sector) => (
                      <div key={sector.name} className="grid grid-cols-6 gap-4 p-4 border-t text-sm">
                        <div className="flex items-center gap-2">
                          <span>{sector.glyph}</span>
                          <span className="font-medium">{sector.name}</span>
                        </div>
                        <div>{sector.brands}</div>
                        <div>{sector.nodes.toLocaleString()}</div>
                        <div>${sector.monthlyFee}</div>
                        <div>
                          <Badge variant={sector.tier === "A+" ? "default" : "secondary"}>
                            {sector.tier}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs">View</Button>
                          <Button size="sm" className="text-xs">Deploy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real User Management Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <Button 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    onClick={() => handleAddUser()}
                  >
                    Add User
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Manage system users and permissions</p>
                
                <div className="space-y-2">
                  <Input placeholder="Search users..." className="max-w-md" />
                </div>

                <RealUserManagementTable 
                  onViewUser={handleViewUser}
                  onEditUser={handleEditUser} 
                  onActivateUser={handleActivateUser}
                />
              </div>

              {/* Admin Status */}
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  <strong>Admin Status:</strong> Ready to receive input. System operational with {systemMetrics.uptime.toFixed(1)}% uptime.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sector Detail Modal */}
      {selectedSector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSector(null)}>
          <div className="bg-background rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedSector.glyph}</span>
                <div>
                  <h3 className="text-2xl font-bold">{selectedSector.name}</h3>
                  <p className="text-muted-foreground">{selectedSector.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSector(null)} className="text-xl">×</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                  <Label className="text-sm text-muted-foreground">Core Brands</Label>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedSector.brands}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                  <Label className="text-sm text-muted-foreground">Active Nodes</Label>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{selectedSector.nodes.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                  <Label className="text-sm text-muted-foreground">Monthly Fee</Label>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">${selectedSector.monthlyFee}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
                  <Label className="text-sm text-muted-foreground">Annual Fee</Label>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">${selectedSector.annualFee}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm text-muted-foreground">Tier Classification</Label>
                <Badge variant={selectedSector.tier === "A+" ? "default" : "secondary"} className="text-lg px-3 py-1 mt-2">
                  {selectedSector.tier}
                </Badge>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm text-muted-foreground">Regional Coverage</Label>
                <p className="font-bold text-lg mt-2">{selectedSector.region}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => handleSectorDeploy(selectedSector)} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Upload className="h-4 w-4 mr-2" />
                Deploy Sector
              </Button>
              <Button variant="outline" onClick={() => setSelectedSector(null)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-background rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">User Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>×</Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>User ID</Label>
                <p className="font-semibold">{selectedUser.id}</p>
              </div>
              <div>
                <Label>Email Address</Label>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>
              <div>
                <Label>Role</Label>
                <Badge variant={selectedUser.email?.includes('admin') ? 'default' : 'secondary'}>
                  {selectedUser.email?.includes('admin') ? 'Admin' : 'User'}
                </Badge>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
              </div>
              <div>
                <Label>Last Login</Label>
                <p className="font-semibold">Recently</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => handleEditUser(selectedUser)} className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button variant="outline" onClick={() => setSelectedUser(null)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Real User Management Table Component
function RealUserManagementTable({ onViewUser, onEditUser, onActivateUser }: {
  onViewUser: (user: any) => void;
  onEditUser: (user: any) => void;
  onActivateUser: (user: any) => void;
}) {
  // Fetch real users from the database
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    select: (data) => {
      // Convert single user to array format for table display
      return data ? [data] : [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">Failed to load users: {error.message}</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No users found. Click "Add User" to create the first user.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-950">
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 font-medium text-sm border-b border-gray-200 dark:border-gray-700">
        <div>User</div>
        <div>Email</div>
        <div>Role</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      
      {/* Table Rows */}
      {users.map((user, index) => (
        <div key={user.id || index} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {user.email?.split('@')[0] || 'Unknown User'}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {user.email || 'No email'}
          </div>
          <div>
            <Badge 
              variant={user.email?.includes('admin') ? 'default' : 'secondary'}
              className={user.email?.includes('admin') ? 'bg-cyan-500 text-white' : ''}
            >
              {user.email?.includes('admin') ? 'Admin' : 'User'}
            </Badge>
          </div>
          <div>
            <Badge 
              variant="default"
              className="bg-green-500 text-white"
            >
              Active
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => onViewUser(user)}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => onEditUser(user)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}