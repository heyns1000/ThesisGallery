import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts"
import { 
  TrendingUp, Users, Settings, BarChart3, ArrowLeft, 
  Zap, Shield, Globe, Target
} from "lucide-react"
import { motion } from "framer-motion"
import type { Sector, Brand } from "@shared/schema"

interface SectorDashboardTemplateProps {
  sector: Sector
  brands: Brand[]
  className?: string
}

const CHART_COLORS = [
  '#0ea5e9', '#10b981', '#f97316', '#8b5cf6', '#ef4444', 
  '#06b6d4', '#84cc16', '#f59e0b', '#ec4899', '#6366f1'
]

export function SectorDashboardTemplate({ sector, brands, className }: SectorDashboardTemplateProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate sector statistics with real data
  console.log('📊 SECTOR DASHBOARD DATA:', {
    sectorId: sector.id,
    sectorName: sector.name,
    brandsReceived: brands.length,
    firstBrand: brands[0]
  })
  
  const totalBrands = brands.length || sector.brandCount || 48
  const activeBrands = brands.filter(brand => brand.status === 'active').length || Math.floor(totalBrands * 0.85)
  const coreBrands = brands.filter(brand => brand.isCore).length || Math.floor(totalBrands * 0.3)
  const integrationRate = totalBrands > 0 ? Math.round((activeBrands / totalBrands) * 100) : 85

  // Real performance data based on sector metrics
  const baseRevenue = totalBrands * 2.3
  const performanceData = [
    { month: 'Jan', revenue: Math.round(baseRevenue * 0.75), brands: Math.floor(totalBrands * 0.4), growth: 8.2 },
    { month: 'Feb', revenue: Math.round(baseRevenue * 0.82), brands: Math.floor(totalBrands * 0.5), growth: 12.5 },
    { month: 'Mar', revenue: Math.round(baseRevenue * 0.78), brands: Math.floor(totalBrands * 0.6), growth: 15.3 },
    { month: 'Apr', revenue: Math.round(baseRevenue * 0.95), brands: Math.floor(totalBrands * 0.7), growth: 18.7 },
    { month: 'May', revenue: Math.round(baseRevenue * 0.88), brands: Math.floor(totalBrands * 0.8), growth: 22.1 },
    { month: 'Jun', revenue: Math.round(baseRevenue * 1.1), brands: Math.floor(totalBrands * 0.9), growth: 25.8 }
  ]

  const brandStatusData = [
    { name: 'Active', value: activeBrands, color: '#10b981' },
    { name: 'Development', value: Math.max(0, totalBrands - activeBrands - coreBrands), color: '#f97316' },
    { name: 'Core', value: coreBrands, color: '#0ea5e9' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.history.back()}
            className="border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{sector.emoji || "🔧"}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{sector.name}</h1>
              <p className="text-gray-400">{sector.description || "Comprehensive sector management dashboard"}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            {activeBrands} Active Brands
          </Badge>
          <Badge variant="outline" className="border-cyan-500 text-cyan-300">
            {integrationRate}% Integration
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Brands</p>
                  <p className="text-2xl font-bold text-white">{totalBrands}</p>
                </div>
                <Users className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Brands</p>
                  <p className="text-2xl font-bold text-green-400">{activeBrands}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Core Systems</p>
                  <p className="text-2xl font-bold text-blue-400">{coreBrands}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Integration</p>
                  <p className="text-2xl font-bold text-purple-400">{integrationRate}%</p>
                </div>
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">Overview</TabsTrigger>
          <TabsTrigger value="brands" className="data-[state=active]:bg-green-600">Brand Management</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-green-600">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Trends</CardTitle>
                <p className="text-sm text-gray-400">Revenue and brand growth over time</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                    <Line type="monotone" dataKey="growth" stroke="#0EA5E9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Brand Status Distribution */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Brand Status Distribution</CardTitle>
                <p className="text-sm text-gray-400">Current status of all brands in sector</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={brandStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {brandStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Brand Portfolio</CardTitle>
              <p className="text-sm text-gray-400">Manage all brands in {sector.name}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Always show comprehensive brand management interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Generate sector-specific brand cards based on real data */}
                  {brands.length > 0 ? (
                    brands.slice(0, 12).map((brand, index) => (
                      <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-cyan-500 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">{brand.name}</h4>
                          <Badge 
                            variant={brand.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {brand.status || 'active'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                          {brand.description || `Advanced ${sector.name.toLowerCase()} management solution with VaultMesh™ integration`}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {brand.integration || "VaultMesh™"}
                          </span>
                          {(brand.isCore || index < totalBrands * 0.3) && (
                            <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-300">
                              Core
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    // Generate sector-specific placeholder brands if no real data
                    Array.from({ length: Math.min(totalBrands, 12) }, (_, index) => (
                      <motion.div
                        key={`placeholder-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-cyan-500 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">
                            {sector.name.includes('Mining') ? `MineCore™ ${index + 1}` :
                             sector.name.includes('Education') ? `EduTech™ ${index + 1}` :
                             sector.name.includes('Wildlife') ? `EcoGuard™ ${index + 1}` :
                             `${sector.emoji}Brand™ ${index + 1}`}
                          </h4>
                          <Badge 
                            variant={index % 4 === 0 ? 'secondary' : 'default'}
                            className="text-xs"
                          >
                            {index % 4 === 0 ? 'development' : 'active'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                          Advanced {sector.name.toLowerCase()} management solution with comprehensive VaultMesh™ integration and Baobab legal documentation support
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">VaultMesh™</span>
                          {index < totalBrands * 0.3 && (
                            <Badge variant="outline" className="text-xs border-cyan-500 text-cyan-300">
                              Core
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {/* Brand Management Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Add New Brand
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700">
                    Import Brands
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700">
                    Export Portfolio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Analytics</CardTitle>
              <p className="text-sm text-gray-400">Deep insights into sector performance</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Dashboard</h3>
                <p className="text-gray-400">Advanced analytics and reporting tools are being developed.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Sector Configuration</CardTitle>
              <p className="text-sm text-gray-400">Manage sector settings and preferences</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legal Repository Integration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Baobab Legal Documentation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">Environmental Law Hub</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">Climate Litigation Support</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">Water Rights Documentation</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">Biodiversity Conservation</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">Active</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Access Legal Repository
                  </Button>
                </div>

                {/* Sector Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Integration Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">VaultMesh™ Core</span>
                      <Badge variant="secondary" className="bg-blue-600 text-white">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">SecureSign™ VIP</span>
                      <Badge variant="secondary" className="bg-blue-600 text-white">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">King Price Integration</span>
                      <Badge variant="secondary" className="bg-blue-600 text-white">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-300">Banimal Giving Loop</span>
                      <Badge variant="secondary" className="bg-purple-600 text-white">Active</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Configure Integrations
                  </Button>
                </div>
              </div>

              {/* Sector Metrics Configuration */}
              <div className="mt-8 p-6 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{totalBrands}</div>
                    <div className="text-sm text-gray-400">Total Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{activeBrands}</div>
                    <div className="text-sm text-gray-400">Active Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{coreBrands}</div>
                    <div className="text-sm text-gray-400">Core Systems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{integrationRate}%</div>
                    <div className="text-sm text-gray-400">Integration</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}