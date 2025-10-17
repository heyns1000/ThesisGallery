import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Eye, ArrowLeft } from "lucide-react"
import { SectorDashboardTemplate } from "@/components/portal/sector-dashboard-template"
import type { Sector, Brand } from "@shared/schema"

export default function SectorListPage() {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  
  const { data: sectors = [], isLoading } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6" data-testid="loading-sector-list">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Sectors...
            </h1>
          </div>
        </div>
      </div>
    )
  }

  // Debug state management
  console.log('🔍 SECTOR LIST STATE:', {
    selectedSector: selectedSector?.name,
    selectedSectorId: selectedSector?.id,
    sectorsCount: sectors.length,
    brandsCount: brands.length
  })

  // If a sector is selected, show the comprehensive dashboard
  if (selectedSector) {
    console.log('✅ RENDERING SECTOR DASHBOARD for:', selectedSector.name)
    const sectorBrands = brands.filter(brand => brand.sectorId === selectedSector.id)
    console.log('📊 Sector brands filtered:', sectorBrands.length, 'for sector ID:', selectedSector.id)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6" data-testid="sector-detail-view">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => {
                console.log('🔙 BACK TO SECTORS clicked')
                setSelectedSector(null)
              }}
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700"
              data-testid="button-back-to-sectors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sectors
            </Button>
          </div>
          <SectorDashboardTemplate 
            sector={selectedSector} 
            brands={sectorBrands}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6" data-testid="sector-list-page">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="title-sector-navigator">
            Sector Dashboard Navigator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Access comprehensive analytics and management for each sector
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2" data-testid="badge-sectors-available">
              {sectors.length} Sectors Available
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Schumacher Sales Focus
            </Badge>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sectors.map((sector) => (
            <Card key={sector.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-purple-500" data-testid={`sector-card-${sector.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl" data-testid={`sector-icon-${sector.id}`}>
                    {sector.emoji || "🔧"}
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`button-view-${sector.id}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" data-testid={`sector-name-${sector.id}`}>
                  {sector.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm" data-testid={`sector-description-${sector.id}`}>
                  {sector.description || "Comprehensive sector management and analytics"}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <BarChart3 className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-gray-500">Analytics</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-xs text-gray-500">Performance</p>
                  </div>
                </div>

                {/* Access Button */}
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('🎯 SECTOR DASHBOARD ACCESS:', sector.name, sector.id)
                    console.log('🔧 Setting selected sector:', sector)
                    console.log('🔧 Current selectedSector before:', selectedSector?.name)
                    setSelectedSector(sector)
                    console.log('🔧 setSelectedSector called with:', sector.name)
                    
                    // Force re-render check
                    setTimeout(() => {
                      console.log('🔧 selectedSector after timeout:', selectedSector?.name)
                    }, 100)
                  }}
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                  data-testid={`button-access-dashboard-${sector.id}`}
                >
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8 border-t" data-testid="footer-info">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Each sector dashboard includes comprehensive sales analytics, brand management, performance metrics, and Baobab legal documentation
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real-time Data
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Sales Pipeline
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              Brand Analytics
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
