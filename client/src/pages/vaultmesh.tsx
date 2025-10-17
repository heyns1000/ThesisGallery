import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Shield, Lock, Globe, Zap, Database, Users, Activity, Cpu, Network, Cloud } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { VaultMeshGlobalCheckout } from "@/components/portal/vaultmesh-global-checkout"
import { VaultMeshAbout } from "@/components/portal/vaultmesh-about"
import { VaultMeshProducts } from "@/components/portal/vaultmesh-products"
import { VaultMeshBrandPackages } from "@/components/portal/vaultmesh-brand-packages"

interface VaultMeshMetrics {
  totalConnections: number
  activeNodes: number
  dataIntegrity: number
  uptime: number
  securityLevel: string
  protocolsSupported: number
}

export default function VaultMeshPage() {
  const [selectedProtocol, setSelectedProtocol] = useState("core")
  const [activeView, setActiveView] = useState("overview")
  
  const getInitialSection = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const section = urlParams.get('section')
      if (section) return section
    }
    return "dashboard"
  }
  
  const [selectedSection, setSelectedSection] = useState(getInitialSection)
  const [metrics, setMetrics] = useState<VaultMeshMetrics>({
    totalConnections: 15847,
    activeNodes: 892,
    dataIntegrity: 99.97,
    uptime: 99.99,
    securityLevel: "Enterprise+",
    protocolsSupported: 24
  })

  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ["/api/brands"],
  })

  const { data: sectors = [] } = useQuery<any[]>({
    queryKey: ["/api/sectors"],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalConnections: prev.totalConnections + Math.floor(Math.random() * 10),
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 3) - 1,
        dataIntegrity: 99.95 + Math.random() * 0.04
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const protocols = [
    {
      id: "core",
      name: "Core VaultMesh™ Protocols",
      icon: Shield,
      description: "Fundamental low-level communication and data integrity protocols",
      features: ["Immutable data records", "Tamper-proof transactions", "Distributed authentication"],
      status: "Active",
      connections: 5234
    },
    {
      id: "network",
      name: "Network Adapters",
      icon: Network,
      description: "Modules for connecting diverse data sources and legacy systems",
      features: ["Legacy system bridging", "Real-time synchronization", "Cross-protocol compatibility"],
      status: "Active", 
      connections: 3421
    },
    {
      id: "omnigrid",
      name: "Omni Grid™",
      icon: Globe,
      description: "Global distributed network layer for real-time synchronization",
      features: ["Worldwide node distribution", "Low-latency routing", "Automatic failover"],
      status: "Active",
      connections: 4892
    },
    {
      id: "security",
      name: "Security Layer",
      icon: Lock,
      description: "Enterprise-grade encryption and access control mechanisms",
      features: ["End-to-end encryption", "Zero-trust architecture", "Multi-factor authentication"],
      status: "Active",
      connections: 2300
    }
  ]

  return (
    <div className="p-8 space-y-6" data-testid="vaultmesh-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="heading-vaultmesh">
            <Shield className="h-10 w-10 text-cyan-500" />
            VaultMesh™ Control Center
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-vaultmesh-description">
            Secure data orchestration and distributed protocol management
          </p>
        </div>
        <Badge variant="outline" className="text-green-600" data-testid="badge-system-status">
          <Activity className="h-4 w-4 mr-2" />
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card data-testid="card-metric-connections">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-connections">
              <Network className="h-4 w-4 text-cyan-500" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-connections-value">{metrics.totalConnections.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-nodes">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-nodes">
              <Cpu className="h-4 w-4 text-blue-500" />
              Active Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-nodes-value">{metrics.activeNodes}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-integrity">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-integrity">
              <Database className="h-4 w-4 text-green-500" />
              Data Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-integrity-value">{metrics.dataIntegrity.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-uptime">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-uptime">
              <Zap className="h-4 w-4 text-yellow-500" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-uptime-value">{metrics.uptime}%</div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-security">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-security">
              <Shield className="h-4 w-4 text-red-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold" data-testid="text-security-value">{metrics.securityLevel}</div>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-protocols">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-protocols">
              <Globe className="h-4 w-4 text-purple-500" />
              Protocols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-protocols-value">{metrics.protocolsSupported}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="about" className="w-full" data-testid="tabs-vaultmesh">
        <TabsList data-testid="tabs-list-vaultmesh">
          <TabsTrigger value="about" data-testid="tab-about">
            <Shield className="h-4 w-4 mr-2" />
            About VaultMesh™
          </TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-products">
            <Database className="h-4 w-4 mr-2" />
            Products & Services
          </TabsTrigger>
          <TabsTrigger value="packages" data-testid="tab-packages">
            <Users className="h-4 w-4 mr-2" />
            Brand Packages
          </TabsTrigger>
          <TabsTrigger value="protocols" data-testid="tab-protocols">
            <Network className="h-4 w-4 mr-2" />
            Protocols
          </TabsTrigger>
          <TabsTrigger value="checkout" data-testid="tab-checkout">
            <Zap className="h-4 w-4 mr-2" />
            Global Checkout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" data-testid="tab-content-about">
          <VaultMeshAbout />
        </TabsContent>

        <TabsContent value="products" data-testid="tab-content-products">
          <VaultMeshProducts />
        </TabsContent>

        <TabsContent value="packages" data-testid="tab-content-packages">
          <VaultMeshBrandPackages />
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6" data-testid="tab-content-protocols">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocols.map((protocol) => (
              <Card 
                key={protocol.id}
                className={`cursor-pointer transition-all ${selectedProtocol === protocol.id ? 'border-2 border-cyan-500' : ''}`}
                onClick={() => setSelectedProtocol(protocol.id)}
                data-testid={`card-protocol-${protocol.id}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <protocol.icon className="h-5 w-5 text-cyan-500" />
                      <CardTitle data-testid={`heading-protocol-${protocol.id}`}>{protocol.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-green-600" data-testid={`badge-protocol-status-${protocol.id}`}>
                      {protocol.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-protocol-description-${protocol.id}`}>
                    {protocol.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2" data-testid={`heading-protocol-features-${protocol.id}`}>Key Features:</p>
                    <ul className="space-y-1">
                      {protocol.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center gap-2" data-testid={`feature-protocol-${protocol.id}-${index}`}>
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground" data-testid={`text-protocol-connections-label-${protocol.id}`}>Active Connections</span>
                      <span className="text-lg font-bold" data-testid={`text-protocol-connections-${protocol.id}`}>{protocol.connections.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checkout" data-testid="tab-content-checkout">
          <VaultMeshGlobalCheckout />
        </TabsContent>
      </Tabs>
    </div>
  )
}
