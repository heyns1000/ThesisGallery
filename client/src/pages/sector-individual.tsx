import { useParams } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Users, Building, Globe, Zap, Shield, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useLocation } from "wouter"
import { MineNestAuthenticDashboard } from '@/components/portal/minenest-authentic-dashboard'
import { MineNestAuthenticBrands } from '@/components/portal/minenest-authentic-brands'

export default function SectorIndividualPage() {
  const params = useParams()
  const [, setLocation] = useLocation()
  const sectorId = params.id

  // Fetch sector data
  const { data: sector, isLoading: sectorLoading } = useQuery({
    queryKey: ["/api/sectors", sectorId],
    queryFn: async () => {
      const response = await fetch(`/api/sectors/${sectorId}`)
      if (!response.ok) throw new Error('Failed to fetch sector')
      return response.json()
    }
  })

  // Fetch sector brands
  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["/api/brands", "sector", sectorId],
    queryFn: async () => {
      const response = await fetch(`/api/brands/sector/${sectorId}`)
      if (!response.ok) throw new Error('Failed to fetch brands')
      return response.json()
    },
    enabled: !!sectorId
  })

  // Fetch mining-specific dashboard data if this is the mining sector
  const { data: miningData } = useQuery({
    queryKey: ["/api/mining/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/mining/dashboard")
      if (!response.ok) throw new Error('Failed to fetch mining data')
      return response.json()
    },
    enabled: sector?.name?.includes("Mining") || sector?.emoji === "⛏️"
  })

  if (sectorLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6" data-testid="sector-individual-loading">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!sector) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center" data-testid="sector-individual-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sector Not Found</h1>
          <Button onClick={() => setLocation("/sectors")} data-testid="button-back-sectors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sectors
          </Button>
        </div>
      </div>
    )
  }

  const coreBrands = brands.filter((brand: any) => !brand.parentId)
  const subNodes = brands.filter((brand: any) => brand.parentId)
  const isMining = sector?.name?.includes("Mining") || sector?.emoji === "⛏️"

  return (
    <div className="min-h-screen bg-gray-900" data-testid="sector-individual-page">
      {/* Header */}
      <div className={`p-6 ${isMining ? 'bg-gradient-to-r from-orange-600 to-yellow-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`} data-testid="sector-header">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/sectors")}
            className="text-white border-white hover:bg-white hover:text-blue-600"
            data-testid="button-back-to-sectors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sectors
          </Button>
          <div className="text-4xl">{sector.emoji}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white" data-testid="text-sector-name">{sector.name}</h1>
            <p className="text-blue-100" data-testid="text-sector-description">{sector.description}</p>
            {isMining && (
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-orange-500 text-white">MineNest™ Integration</Badge>
                <Badge className="bg-green-500 text-white">VaultTrace™ Active</Badge>
              </div>
            )}
          </div>
        </div>
        
        {/* Sector Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="sector-stats">
          {isMining && miningData ? (
            <>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-active-sites">
                <div className="text-2xl font-bold text-white">{miningData.overview.totalActiveSites}</div>
                <div className="text-blue-100 text-sm">Active Mine Sites</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-drill-rigs">
                <div className="text-2xl font-bold text-white">{miningData.overview.activeDrillRigs}</div>
                <div className="text-blue-100 text-sm">Active Drill Rigs</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-ore-yield">
                <div className="text-2xl font-bold text-white">{miningData.overview.monthlyOreYield.toLocaleString()}</div>
                <div className="text-blue-100 text-sm">Monthly Ore Yield (Tonnes)</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-operational-health">
                <div className="text-2xl font-bold text-white">{miningData.overview.operationalHealth}%</div>
                <div className="text-blue-100 text-sm">Operational Health</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-core-brands">
                <div className="text-2xl font-bold text-white">{coreBrands.length}</div>
                <div className="text-blue-100 text-sm">Core Brands</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-sub-nodes">
                <div className="text-2xl font-bold text-white">{subNodes.length}</div>
                <div className="text-blue-100 text-sm">Sub-Nodes</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-total-elements">
                <div className="text-2xl font-bold text-white">{brands.length}</div>
                <div className="text-blue-100 text-sm">Total Elements</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center" data-testid="stat-status">
                <div className="text-2xl font-bold text-white">Active</div>
                <div className="text-blue-100 text-sm">Status</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Comprehensive MineNest™ Dashboard for Mining Sector */}
        {isMining ? (
          <MineNestAuthenticDashboard />
        ) : null}

        {/* Default Sector Analytics Dashboard */}
        {!isMining && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="default-analytics">
            <Card className="bg-gray-800 border-gray-700" data-testid="card-performance">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">96.8%</div>
                <div className="text-gray-400 text-sm">Performance</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700" data-testid="card-active-users">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700" data-testid="card-revenue">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">R2.4M</div>
                <div className="text-gray-400 text-sm">Revenue</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700" data-testid="card-security">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-gray-400 text-sm">Security</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MineNest™ Authentic Brands for Mining Sector */}
        {isMining && (
          <MineNestAuthenticBrands />
        )}

        {/* Core Brands */}
        {!isMining && coreBrands.length > 0 && (
          <div data-testid="core-brands-section">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Building className="h-6 w-6" />
              Core Brands ({coreBrands.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreBrands.map((brand: any, index: number) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  data-testid={`brand-card-${brand.id}`}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-200">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{brand.name}</CardTitle>
                      <p className="text-gray-300 text-sm">{brand.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {brand.metadata && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(brand.metadata).slice(0, 3).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="bg-blue-600 text-white text-xs">
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            Brand ID: {brand.id}
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" data-testid={`button-access-${brand.id}`}>
                            Access Dashboard
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Nodes */}
        {!isMining && subNodes.length > 0 && (
          <div data-testid="sub-nodes-section">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Sub-Nodes ({subNodes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subNodes.map((node: any, index: number) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  data-testid={`subnode-card-${node.id}`}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors duration-200">
                    <CardContent className="p-4">
                      <div className="text-white font-semibold text-sm mb-2">{node.name}</div>
                      <div className="text-gray-400 text-xs mb-3">{node.description}</div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                          Sub-Node
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-green-400 hover:text-white hover:bg-green-600 p-1" data-testid={`button-node-${node.id}`}>
                          <Zap className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isMining && brands.length === 0 && !brandsLoading && (
          <Card className="bg-gray-800 border-gray-700" data-testid="empty-state">
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Brands Yet</h3>
              <p className="text-gray-400 mb-4">This sector doesn't have any brands configured yet.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-add-first-brand">
                Add First Brand
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
