import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Shield, Lock, Globe, Zap, Database, Users, Activity, Cpu, Network, Cloud } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { PulseIndicator, MorphingButton, SparkleEffect } from "@/components/ui/micro-interactions"
import { VaultMeshGlobalCheckout } from "@/components/portal/vaultmesh-global-checkout"
import { VaultMeshAbout } from "@/components/portal/vaultmesh-about"
import { VaultMeshProducts } from "@/components/portal/vaultmesh-products"
import { VaultMeshBrandPackages } from "@/components/portal/vaultmesh-brand-packages"
import type { Brand, Sector } from "@shared/schema"

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
  
  // Get section from the activePage in the global state or default to dashboard
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

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  // Simulate real-time metrics updates
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
      description: "Distributed network layer for real-time ecosystem synchronization",
      features: ["Global distribution", "Real-time updates", "Load balancing"],
      status: "Active",
      connections: 7192
    },
    {
      id: "securesign",
      name: "SecureSign™",
      icon: Lock,
      description: "Digital trust and verifiable identity solutions",
      features: ["Digital signatures", "Identity verification", "Legal compliance"],
      status: "Active",
      connections: 2847
    }
  ]

  if (activeView === "checkout") {
    return <VaultMeshGlobalCheckout />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              🌐 VaultMesh™
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              The Core Infrastructure for FAA.ZONE™ Ecosystem - Secure Fabric for a Regulated Future
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button 
                variant={selectedSection === "dashboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection("dashboard")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                Dashboard
              </Button>
              <Button 
                variant={selectedSection === "about" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection("about")}
              >
                About
              </Button>
              <Button 
                variant={selectedSection === "products" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection("products")}
              >
                Products
              </Button>
              <Button 
                variant={selectedSection === "fruitful-brands" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection("fruitful-brands")}
              >
                Brand Packages
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                {metrics.uptime}% Uptime
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                {metrics.securityLevel}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Section Content */}
      {selectedSection === "about" && (
        <section className="p-6">
          <VaultMeshAbout />
        </section>
      )}

      {selectedSection === "products" && (
        <section className="p-6">
          <VaultMeshProducts />
        </section>
      )}

      {selectedSection === "fruitful-brands" && (
        <section className="p-6">
          <VaultMeshBrandPackages />
        </section>
      )}

      {/* Dashboard Content */}
      {selectedSection === "dashboard" && (
        <div>
          {/* Real-time Metrics Dashboard */}
          <section className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <PulseIndicator active={true} color="blue" size="sm" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-100 text-sm">Total Connections</p>
                        <motion.p 
                          className="text-2xl font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          {metrics.totalConnections.toLocaleString()}
                        </motion.p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Database className="h-8 w-8 text-cyan-200" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <PulseIndicator active={true} color="green" size="sm" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Active Nodes</p>
                        <motion.p 
                          className="text-2xl font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          {metrics.activeNodes.toLocaleString()}
                        </motion.p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Cpu className="h-8 w-8 text-green-200" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <PulseIndicator active={true} color="purple" size="sm" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Data Integrity</p>
                        <motion.p 
                          className="text-2xl font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          {metrics.dataIntegrity.toFixed(2)}%
                        </motion.p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lock className="h-8 w-8 text-purple-200" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <PulseIndicator active={true} color="red" size="sm" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Protocols</p>
                        <motion.p 
                          className="text-2xl font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                        >
                          {metrics.protocolsSupported}
                        </motion.p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Network className="h-8 w-8 text-orange-200" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Core Protocols & Components */}
          <section className="p-6">
            <Tabs value={selectedProtocol} onValueChange={setSelectedProtocol} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {protocols.map((protocol) => (
                  <TabsTrigger key={protocol.id} value={protocol.id} className="text-xs">
                    <protocol.icon className="w-4 h-4 mr-1" />
                    {protocol.name.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {protocols.map((protocol) => (
                <TabsContent key={protocol.id} value={protocol.id} className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <protocol.icon className="h-8 w-8 text-cyan-500" />
                          <div>
                            <CardTitle className="text-xl">{protocol.name}</CardTitle>
                            <p className="text-gray-600 dark:text-gray-400">{protocol.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {protocol.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {protocol.connections.toLocaleString()} connections
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {protocol.features.map((feature, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="font-medium text-gray-900 dark:text-white">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Brand Integration Status */}
          <section className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-cyan-500" />
                  Brand Integration Status
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  VaultMesh™ integration across {brands.length} brands in {sectors.length} sectors
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-500">{brands.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Connected Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{sectors.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Integrated Sectors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500">100%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Coverage Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section className="p-6">
            <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">VaultMesh™ Administration</h2>
                    <p className="opacity-90">
                      Manage the core infrastructure and monitor ecosystem health
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      className="bg-white text-cyan-500 hover:bg-gray-100"
                      onClick={() => setActiveView("checkout")}
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      Get VaultMesh™
                    </Button>
                    <Button
                      variant="ghost"
                      className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      System Health
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </div>
  )
}