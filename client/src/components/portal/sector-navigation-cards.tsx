import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "wouter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, BarChart3, TrendingUp, Users, Settings } from "lucide-react"
import { motion } from "framer-motion"
import type { Sector, Brand } from "@shared/schema"

interface SectorNavigationCardsProps {
  onSectorSelect: (sectorId: string) => void
}

export function SectorNavigationCards({ onSectorSelect }: SectorNavigationCardsProps) {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null)
  const [, setLocation] = useLocation()

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  const getSectorStats = (sectorId: number) => {
    const sectorBrands = brands.filter(brand => brand.sectorId === sectorId)
    return {
      brandCount: sectorBrands.length,
      activeCount: sectorBrands.filter(brand => brand.status === 'active').length,
      coreCount: sectorBrands.filter(brand => brand.isCore).length
    }
  }

  const createSectorSlug = (sectorName: string) => {
    return sectorName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/^[⚡🌱💼🏢📦🔧🎮🎨🎭🍎♻️🎵💊⚡🏠]/g, '')
  }

  const availableSectors = sectors.filter(sector => sector.name && sector.name.trim() !== "")

  return (
    <div className="space-y-6" data-testid="sector-navigation-cards">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent" data-testid="title-sector-dashboard-access">
          Sector Dashboard Access
        </h2>
        <p className="text-gray-400 dark:text-gray-500 max-w-2xl mx-auto" data-testid="description-sector-dashboard">
          Choose a sector to access its dedicated dashboard with comprehensive analytics, brand management, and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableSectors.map((sector, index) => {
          const stats = getSectorStats(sector.id)
          const sectorSlug = createSectorSlug(sector.name)
          
          return (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredSector(sector.id.toString())}
              onHoverEnd={() => setHoveredSector(null)}
              data-testid={`sector-card-motion-${sector.id}`}
            >
              <Card className="bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600 hover:border-green-500 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer h-full" data-testid={`sector-card-${sector.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white dark:text-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" data-testid={`sector-emoji-${sector.id}`}>{sector.emoji || "🔧"}</span>
                      <div>
                        <div className="text-lg font-bold" data-testid={`sector-name-${sector.id}`}>{sector.name}</div>
                        <div className="text-sm text-gray-400 dark:text-gray-500 font-normal" data-testid={`sector-description-${sector.id}`}>
                          {sector.description || "Sector management dashboard"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {sector.price && (
                        <div className="text-amber-400 dark:text-amber-500 font-bold text-xl" data-testid={`sector-price-${sector.id}`}>
                          ${sector.price}
                        </div>
                      )}
                      {(sector.metadata as any)?.tier && (
                        <Badge variant="secondary" className="text-xs bg-purple-600 text-white border-purple-500" data-testid={`sector-tier-${sector.id}`}>
                          {(sector.metadata as any).tier}
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-700 dark:bg-gray-800 rounded-lg p-3" data-testid={`stat-total-${sector.id}`}>
                      <div className="text-lg font-bold text-white dark:text-gray-100">{stats.brandCount}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Total Brands</div>
                    </div>
                    <div className="bg-gray-700 dark:bg-gray-800 rounded-lg p-3" data-testid={`stat-active-${sector.id}`}>
                      <div className="text-lg font-bold text-green-400 dark:text-green-500">{stats.activeCount}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Active</div>
                    </div>
                    <div className="bg-gray-700 dark:bg-gray-800 rounded-lg p-3" data-testid={`stat-core-${sector.id}`}>
                      <div className="text-lg font-bold text-cyan-400 dark:text-cyan-500">{stats.coreCount}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Core</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-300 dark:text-gray-400">Dashboard Features:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400" data-testid={`feature-analytics-${sector.id}`}>
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Analytics
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400" data-testid={`feature-performance-${sector.id}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Performance
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400" data-testid={`feature-brand-mgmt-${sector.id}`}>
                        <Users className="h-3 w-3 mr-1" />
                        Brand Management
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400" data-testid={`feature-config-${sector.id}`}>
                        <Settings className="h-3 w-3 mr-1" />
                        Configuration
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold"
                    onClick={(e) => {
                      e.preventDefault()
                      console.log(`🎯 SECTOR DASHBOARD ACCESS:`, sector.name, sector.id)
                      setLocation(`/sector/${sector.id}`)
                    }}
                    data-testid={`button-access-dashboard-${sector.id}`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Access Dashboard
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        hoveredSector === sector.id.toString() ? 'translate-x-1' : ''
                      }`} />
                    </span>
                  </Button>

                  {stats.brandCount > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-600 text-center" data-testid={`last-updated-${sector.id}`}>
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {availableSectors.length === 0 && (
        <Card className="bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600" data-testid="card-no-sectors">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sectors Available</h3>
              <p>Sectors are being loaded from the database. Please check back in a moment.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
