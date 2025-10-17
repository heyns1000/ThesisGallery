import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Sector } from "@shared/schema"

interface SearchFiltersProps {
  onSearch: (query: string) => void
  onSectorFilter: (sectorId: number | null) => void
  selectedSector: number | null
}

export function SearchFilters({ onSearch, onSectorFilter, selectedSector }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllSectors, setShowAllSectors] = useState(false)

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  const { data: stats } = useQuery<{
    totalElements: number;
    coreBrands: number;
    subNodes?: number;
    subnodes?: number;
    sectors: number;
    integrationTiers?: {
      tier1: number;
      tier2: number;
      tier3: number;
    };
    globalRevenue?: number;
    activeBrands?: number;
    marketPenetration?: number;
    revenueGrowth?: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  })

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }, [onSearch])

  // Show first 6 sectors initially, then all when expanded
  const displayedSectors = showAllSectors ? sectors : sectors.slice(0, 6)
  const remainingSectors = sectors.length - 6

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-cyan-500" />
        </div>
        <Input
          type="text"
          placeholder={`Search across ${stats?.totalElements?.toLocaleString() || 610} brand elements...`}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 pr-16 py-3 border-2 border-gray-200 dark:border-gray-700 focus:border-cyan-500 rounded-lg text-lg"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            ⌘K
          </span>
        </div>
      </div>

      {/* Sector Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Filter by Sector:
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSector === null ? "default" : "outline"}
            size="sm"
            onClick={() => onSectorFilter(null)}
            className={`
              ${selectedSector === null 
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                : 'border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            All Sectors
          </Button>
          {displayedSectors.map((sector) => (
            <Button
              key={sector.id}
              variant={selectedSector === sector.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSectorFilter(sector.id)}
              className={`
                ${selectedSector === sector.id
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  : 'border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              {sector.emoji} {sector.name}
            </Button>
          ))}
          {sectors.length > 6 && !showAllSectors && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllSectors(true)}
              className="border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              +{remainingSectors} more
            </Button>
          )}
          {showAllSectors && sectors.length > 6 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllSectors(false)}
              className="border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Show Less
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{stats.totalElements.toLocaleString()}</div>
            <div className="text-sm opacity-80">Total Elements</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{stats.coreBrands.toLocaleString()}</div>
            <div className="text-sm opacity-80">Core Brands</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{(stats.subnodes || stats.subNodes || 0).toLocaleString()}</div>
            <div className="text-sm opacity-80">Subnodes</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{stats.sectors}</div>
            <div className="text-sm opacity-80">Sectors</div>
          </div>
        </div>
      )}
    </div>
  )
}
