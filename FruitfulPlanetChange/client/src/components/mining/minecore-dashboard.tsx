import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useQuery } from "@tanstack/react-query"
import { Pickaxe, Shield, Settings, BarChart3, Users, Building } from "lucide-react"
import { motion } from "framer-motion"

interface MineCoreStats {
  totalBrands: number
  activeBrands: number
  developmentBrands: number
  integrationPercentage: number
}

interface MineCoreBrand {
  id: string
  name: string
  status: 'active' | 'development'
  description: string
  integration: string
  type: string
}

export default function MineCoreCoreDashboard() {
  const { data: minecoreBrands = [], isLoading } = useQuery({
    queryKey: ["/api/mining/minecore-brands"],
    queryFn: async () => {
      const response = await fetch("/api/mining/minecore-brands")
      if (!response.ok) throw new Error('Failed to fetch MineCore™ brands')
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const activeBrands = minecoreBrands.filter((brand: MineCoreBrand) => brand.status === 'active')
  const developmentBrands = minecoreBrands.filter((brand: MineCoreBrand) => brand.status === 'development')
  const integrationPercentage = Math.round((activeBrands.length / minecoreBrands.length) * 100)

  const stats: MineCoreStats = {
    totalBrands: minecoreBrands.length,
    activeBrands: activeBrands.length,
    developmentBrands: developmentBrands.length,
    integrationPercentage
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalBrands}</div>
            <div className="text-gray-400 text-sm">Total Brands</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activeBrands}</div>
            <div className="text-gray-400 text-sm">Active Brands</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">14</div>
            <div className="text-gray-400 text-sm">Core Systems</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.integrationPercentage}%</div>
            <div className="text-gray-400 text-sm">Integration</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <Button className="bg-green-600 text-white px-6">Overview</Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white">Brand Management</Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white">Analytics</Button>
        <Button variant="ghost" className="text-gray-400 hover:text-white">Settings</Button>
      </div>

      {/* Brand Portfolio Grid */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Pickaxe className="h-6 w-6 text-orange-500" />
            Brand Portfolio
          </CardTitle>
          <div className="text-gray-400 text-sm">
            Manage all brands in ⛏️ Mining & Resources
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {minecoreBrands.map((brand: MineCoreBrand, index: number) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-orange-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white font-semibold">{brand.name}</h4>
                  <Badge className={`${
                    brand.status === 'active' ? 'bg-green-500' :
                    'bg-yellow-500'
                  } text-white text-xs`}>
                    {brand.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="text-gray-300 text-sm">
                    {brand.description}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Shield className="h-4 w-4" />
                    {brand.integration}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{brand.type}</span>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1">
                      Core
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Portfolio Actions */}
          <div className="flex gap-4 mt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
              Add New Brand
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1">
              Import Brands
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1">
              Export Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}