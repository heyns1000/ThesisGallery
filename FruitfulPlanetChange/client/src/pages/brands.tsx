import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, Filter, Grid, List, ChevronDown, Eye, EyeOff, Layers, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BrandCard } from "@/components/portal/brand-card"
import type { Brand, Sector } from "@shared/schema"

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("name")

  // Build query parameters
  const queryParams = new URLSearchParams()
  if (searchQuery) queryParams.set("search", searchQuery)
  if (selectedSector) queryParams.set("sectorId", selectedSector.toString())

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands", queryParams.toString()],
  })

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  // Create sector lookup map
  const sectorMap = sectors.reduce((map, sector) => {
    map[sector.id] = sector
    return map
  }, {} as Record<number, Sector>)

  // Filter brands based on additional criteria
  const filteredBrands = brands.filter(brand => {
    if (selectedIntegrations.length > 0 && !selectedIntegrations.includes(brand.integration)) {
      return false
    }
    if (selectedStatus.length > 0 && !selectedStatus.includes(brand.status)) {
      return false
    }
    return true
  })

  // Sort brands
  const sortedBrands = [...filteredBrands].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "sector":
        const sectorA = a.sectorId ? sectorMap[a.sectorId]?.name || "" : ""
        const sectorB = b.sectorId ? sectorMap[b.sectorId]?.name || "" : ""
        return sectorA.localeCompare(sectorB)
      case "integration":
        return a.integration.localeCompare(b.integration)
      case "created":
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      default:
        return 0
    }
  })

  // Get unique integrations and statuses for filters
  const uniqueIntegrations = Array.from(new Set(brands.map(brand => brand.integration)))
  const uniqueStatuses = Array.from(new Set(brands.map(brand => brand.status)))

  const handleIntegrationToggle = (integration: string, checked: boolean) => {
    if (checked) {
      setSelectedIntegrations(prev => [...prev, integration])
    } else {
      setSelectedIntegrations(prev => prev.filter(i => i !== integration))
    }
  }

  const handleStatusToggle = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus(prev => [...prev, status])
    } else {
      setSelectedStatus(prev => prev.filter(s => s !== status))
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedSector(null)
    setSelectedIntegrations([])
    setSelectedStatus([])
    setSortBy("name")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Brand Elements
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
            Comprehensive management of {brands.length} brand elements across all sectors
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Package className="h-4 w-4 mr-2" />
            {brands.length} Total Brands
          </Badge>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Brands
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Filters
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
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search brands by name, description, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sector:</label>
              <Select value={selectedSector?.toString() || "all"} onValueChange={(value) => setSelectedSector(value === "all" ? null : parseInt(value))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id.toString()}>
                      {sector.emoji} {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="sector">Sector</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="created">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>

          {/* Advanced Filters (Collapsible) */}
          {showFilters && (
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Integration Filters */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Integration Platforms
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uniqueIntegrations.map((integration) => (
                        <div key={integration} className="flex items-center space-x-2">
                          <Checkbox
                            id={`integration-${integration}`}
                            checked={selectedIntegrations.includes(integration)}
                            onCheckedChange={(checked) => handleIntegrationToggle(integration, checked as boolean)}
                          />
                          <label htmlFor={`integration-${integration}`} className="text-sm">
                            {integration}
                            <span className="text-gray-500 ml-2">
                              ({brands.filter(b => b.integration === integration).length})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Badge className="h-4 w-4" />
                      Status
                    </h4>
                    <div className="space-y-2">
                      {uniqueStatuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatus.includes(status)}
                            onCheckedChange={(checked) => handleStatusToggle(status, checked as boolean)}
                          />
                          <label htmlFor={`status-${status}`} className="text-sm capitalize">
                            {status}
                            <span className="text-gray-500 ml-2">
                              ({brands.filter(b => b.status === status).length})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {sortedBrands.length} of {brands.length} brands
              {selectedSector && ` in ${sectorMap[selectedSector]?.name}`}
            </span>
            {(selectedIntegrations.length > 0 || selectedStatus.length > 0 || searchQuery) && (
              <span className="text-blue-600 dark:text-blue-400">
                Filters active
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Brands Display */}
      <div className="space-y-4">
        {isLoading ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {Array.from({ length: 12 }).map((_, i) => (
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
        ) : sortedBrands.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No brands found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {sortedBrands.map((brand) => (
              viewMode === "grid" ? (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  sector={brand.sectorId ? sectorMap[brand.sectorId] : undefined}
                  onClick={() => console.log('Brand clicked:', brand.name)}
                />
              ) : (
                <Card key={brand.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{brand.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                            {brand.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {brand.sectorId && sectorMap[brand.sectorId] && (
                              <Badge variant="secondary" className="text-xs">
                                {sectorMap[brand.sectorId].emoji} {sectorMap[brand.sectorId].name}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {brand.integration}
                            </Badge>
                            <Badge variant={brand.status === "active" ? "default" : "secondary"} className="text-xs capitalize">
                              {brand.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}