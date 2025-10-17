import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, Grid, List, Eye, EyeOff, BarChart3, Layers, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectorNavigationCard } from "@/components/portal/sector-navigation-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Sector, Brand } from "@shared/schema"

export default function SectorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showStats, setShowStats] = useState(true)
  const [expandedSector, setExpandedSector] = useState<number | null>(null)

  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  // Filter sectors based on search
  const filteredSectors = sectors.filter(sector =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate sector statistics
  const sectorStats = sectors.map(sector => {
    const sectorBrands = brands.filter(brand => brand.sectorId === sector.id)
    const activeBrands = sectorBrands.filter(brand => brand.status === "active")
    const integrations = Array.from(new Set(sectorBrands.map(brand => brand.integration)))
    
    return {
      ...sector,
      totalBrands: sectorBrands.length,
      activeBrands: activeBrands.length,
      integrations: integrations.length,
      brands: sectorBrands
    }
  })

  const totalBrands = brands.length
  const totalActiveBrands = brands.filter(b => b.status === "active").length
  const totalIntegrations = Array.from(new Set(brands.map(b => b.integration))).length

  const toggleSectorExpansion = (sectorId: number) => {
    setExpandedSector(expandedSector === sectorId ? null : sectorId)
  }

  const getSectorIcon = (sectorName: string) => {
    if (sectorName.includes('Agriculture')) return '🌱'
    if (sectorName.includes('Technology')) return '💻'
    if (sectorName.includes('Healthcare')) return '🏥'
    if (sectorName.includes('Finance')) return '💰'
    if (sectorName.includes('Education')) return '📚'
    if (sectorName.includes('Energy')) return '⚡'
    if (sectorName.includes('Transport')) return '🚗'
    if (sectorName.includes('Retail')) return '🛍️'
    if (sectorName.includes('Media')) return '📺'
    if (sectorName.includes('Construction')) return '🏗️'
    return '🏢'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sector Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Overview of {sectors.length} business sectors with {totalBrands} total brand elements
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Layers className="h-4 w-4 mr-2" />
            {sectors.length} Sectors
          </Badge>
        </div>
      </div>

      {/* Global Statistics */}
      {showStats && (
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Sectors</p>
                  <p className="text-2xl font-bold">{sectors.length}</p>
                </div>
                <Layers className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Brands</p>
                  <p className="text-2xl font-bold">{totalBrands}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Brands</p>
                  <p className="text-2xl font-bold">{totalActiveBrands}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Integrations</p>
                  <p className="text-2xl font-bold">{totalIntegrations}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & View Sectors
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Stats
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sectors by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredSectors.length} of {sectors.length} sectors
          </div>
        </CardContent>
      </Card>

      {/* Sectors Display */}
      <div className="space-y-4">
        {sectorsLoading ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSectors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Layers className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No sectors found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search terms
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredSectors.map((sector) => {
              const stats = sectorStats.find(s => s.id === sector.id)
              const completionPercentage = stats ? Math.round((stats.activeBrands / Math.max(stats.totalBrands, 1)) * 100) : 0
              
              return viewMode === "grid" ? (
                <div key={sector.id}>
                  <SectorNavigationCard 
                    sector={sector}
                    className="hover:shadow-lg transition-all"
                  />
                </div>
              ) : (
                <Card key={sector.id} className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                          {sector.emoji || getSectorIcon(sector.name)}
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {sector.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {stats?.totalBrands || 0} brands
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {stats?.integrations || 0} integrations
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSectorExpansion(sector.id)}
                      >
                        {expandedSector === sector.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {sector.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {sector.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Brand Completion</span>
                        <span className="font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{stats?.totalBrands || 0}</p>
                        <p className="text-xs text-gray-500">Total Brands</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{stats?.activeBrands || 0}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                    </div>

                    {/* Expanded Brand List */}
                    {expandedSector === sector.id && stats?.brands && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-3 text-sm">Brands in this sector:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {stats.brands.slice(0, 10).map((brand) => (
                            <div key={brand.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded text-white text-xs flex items-center justify-center">
                                  {brand.name.substring(0, 1)}
                                </div>
                                <span className="text-sm font-medium">{brand.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {brand.integration}
                                </Badge>
                                <Badge 
                                  variant={brand.status === "active" ? "default" : "secondary"} 
                                  className="text-xs capitalize"
                                >
                                  {brand.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {stats.brands.length > 10 && (
                            <p className="text-xs text-gray-500 text-center py-2">
                              +{stats.brands.length - 10} more brands
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}