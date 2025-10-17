import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Shield, Activity, Database, Zap, Download, ExternalLink, CheckCircle, ArrowRight } from "lucide-react"

// Wildlife products data extracted from uploaded HTML
const wildlifeProducts = [
  {
    id: "guardeco",
    name: "GuardEco™",
    description: "Advanced data sync protocol for wildlife conservation",
    category: "Conservation",
    status: "Active",
    nodes: "2,856",
    pulseActivity: "98,839 pulses/sec",
    dataVolume: "98.71 TB",
    securityRating: "AAA+",
    vaultId: "VLT-WLD-001",
    integration: "FAA.Zone™",
    features: [
      "Real-time habitat monitoring",
      "Species tracking algorithms",
      "Conservation data analysis",
      "Emergency alert system"
    ],
    pricing: {
      starter: "$299/month",
      professional: "$899/month", 
      enterprise: "Custom"
    },
    deployment: "Global Cloud Infrastructure",
    protocols: ["HTTPS/2", "WebRTC", "MQTT", "LoRaWAN"]
  },
  {
    id: "linkhabitat",
    name: "LinkHabitat™",
    description: "Real-time habitat monitoring and protection system",
    category: "Monitoring",
    status: "Active",
    nodes: "1,947",
    pulseActivity: "67,234 pulses/sec",
    dataVolume: "45.32 TB",
    securityRating: "AA+",
    vaultId: "VLT-WLD-002",
    integration: "PulseGrid™",
    features: [
      "Habitat health metrics",
      "Environmental sensors",
      "Biodiversity tracking",
      "Climate data integration"
    ],
    pricing: {
      starter: "$199/month",
      professional: "$599/month",
      enterprise: "Custom"
    },
    deployment: "Edge Computing Network",
    protocols: ["MQTT", "CoAP", "6LoWPAN", "Zigbee"]
  },
  {
    id: "tracewild",
    name: "TraceWild™", 
    description: "Wildlife tracking and movement analysis platform",
    category: "Analytics",
    status: "Active",
    nodes: "3,142",
    pulseActivity: "134,567 pulses/sec",
    dataVolume: "156.89 TB",
    securityRating: "AAA",
    vaultId: "VLT-WLD-003",
    integration: "VaultMesh™",
    features: [
      "GPS tracking integration",
      "Migration pattern analysis",
      "Behavioral insights",
      "Population dynamics"
    ],
    pricing: {
      starter: "$399/month",
      professional: "$1,199/month",
      enterprise: "Custom"
    },
    deployment: "Hybrid Cloud-Edge",
    protocols: ["5G NR", "LTE-M", "NB-IoT", "LoRaWAN"]
  },
  {
    id: "nodebio",
    name: "NodeBio™",
    description: "Biological sensor network for ecosystem monitoring",
    category: "Sensors",
    status: "Active", 
    nodes: "4,621",
    pulseActivity: "203,445 pulses/sec",
    dataVolume: "289.14 TB",
    securityRating: "AAA+",
    vaultId: "VLT-WLD-004",
    integration: "FAA.Zone™",
    features: [
      "Multi-species monitoring",
      "Soil health analysis",
      "Water quality tracking",
      "Air quality sensors"
    ],
    pricing: {
      starter: "$499/month",
      professional: "$1,499/month",
      enterprise: "Custom"
    },
    deployment: "Distributed IoT Network",
    protocols: ["Thread", "Matter", "Zigbee", "WiFi 6E"]
  },
  {
    id: "meshconserv",
    name: "MeshConserv™",
    description: "Conservation mesh network for habitat protection",
    category: "Network",
    status: "Active",
    nodes: "2,387",
    pulseActivity: "89,123 pulses/sec", 
    dataVolume: "67.45 TB",
    securityRating: "AA",
    vaultId: "VLT-WLD-005",
    integration: "PulseGrid™",
    features: [
      "Mesh networking protocols",
      "Self-healing networks",
      "Edge processing",
      "Offline capabilities"
    ],
    pricing: {
      starter: "$349/month",
      professional: "$1,049/month",
      enterprise: "Custom"
    },
    deployment: "Mesh Network Infrastructure",
    protocols: ["802.11s", "Batman-adv", "OLSR", "AODV"]
  }
]

export function WildlifeProductModal({ trigger }: { trigger: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePurchase = (productId: string, plan: string) => {
    toast({
      title: "Purchase Processing",
      description: `Processing ${plan} plan for ${wildlifeProducts.find(p => p.id === productId)?.name}...`,
    })
    console.log(`🛒 Purchase: ${productId} - ${plan} plan`)
  }

  const handleDeployment = (productId: string) => {
    toast({
      title: "Deployment Started",
      description: `Deploying ${wildlifeProducts.find(p => p.id === productId)?.name} to production environment...`,
    })
    console.log(`🚀 Deploying: ${productId}`)
  }

  const selectedProductData = selectedProduct ? wildlifeProducts.find(p => p.id === selectedProduct) : null

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-500" />
            Wildlife & Habitat Protection Systems
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Production-ready conservation technology from uploaded Wildlife HTML protocols
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
              Available Products
            </h3>
            {wildlifeProducts.map((product) => (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-all ${selectedProduct === product.id ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:shadow-md'}`}
                onClick={() => setSelectedProduct(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <Badge variant={product.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-blue-500" />
                      <span>{product.nodes} nodes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-purple-500" />
                      <span>{product.securityRating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2">
            {selectedProductData ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {selectedProductData.name}
                      </h2>
                      <p className="text-green-600 dark:text-green-300">
                        {selectedProductData.description}
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {selectedProductData.category}
                    </Badge>
                  </div>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedProductData.nodes}</div>
                      <div className="text-sm text-green-600">Active Nodes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedProductData.pulseActivity}</div>
                      <div className="text-sm text-blue-600">Pulse Activity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedProductData.dataVolume}</div>
                      <div className="text-sm text-purple-600">Data Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedProductData.securityRating}</div>
                      <div className="text-sm text-orange-600">Security Rating</div>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="deploy">Deploy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Core Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedProductData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(selectedProductData.pricing).map(([plan, price]) => (
                        <Card key={plan} className="text-center">
                          <CardHeader>
                            <CardTitle className="capitalize">{plan}</CardTitle>
                            <div className="text-2xl font-bold text-green-600">{price}</div>
                          </CardHeader>
                          <CardContent>
                            <Button 
                              onClick={() => handlePurchase(selectedProductData.id, plan)}
                              className="w-full"
                            >
                              Purchase {plan}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Integration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Platform:</span>
                              <Badge>{selectedProductData.integration}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Vault ID:</span>
                              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {selectedProductData.vaultId}
                              </code>
                            </div>
                            <div className="flex justify-between">
                              <span>Deployment:</span>
                              <span className="text-sm">{selectedProductData.deployment}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Protocols</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedProductData.protocols.map((protocol) => (
                              <Badge key={protocol} variant="outline" className="text-xs">
                                {protocol}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="deploy" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Production Deployment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Zap className="h-8 w-8 text-blue-500" />
                            <div className="flex-1">
                              <h4 className="font-semibold">Ready for Deployment</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedProductData.name} is configured and ready for production deployment
                              </p>
                            </div>
                            <Button onClick={() => handleDeployment(selectedProductData.id)}>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Deploy Now
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Download SDK
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              View Documentation
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a wildlife protection product to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}