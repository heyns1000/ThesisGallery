import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Waves, Trash2, Recycle, TrendingUp } from "lucide-react"

interface OceanPlasticData {
  continent: string
  country: string
  plasticWaste: number
  recyclingRate: number
  oceanContribution: number
  cleanupEfforts: number
}

export function OceanPlasticDashboard() {
  const [selectedContinent, setSelectedContinent] = useState("All")

  const { data: plasticData = [], isLoading } = useQuery<OceanPlasticData[]>({
    queryKey: ["/api/baobab/ocean-plastic"]
  })

  const filteredData = selectedContinent === "All" 
    ? plasticData 
    : plasticData.filter(d => d.continent === selectedContinent)

  const totalPlasticWaste = filteredData.reduce((sum, d) => sum + d.plasticWaste, 0)
  const avgRecyclingRate = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.recyclingRate, 0) / filteredData.length
    : 0
  const totalOceanContribution = filteredData.reduce((sum, d) => sum + d.oceanContribution, 0)
  const totalCleanupEfforts = filteredData.reduce((sum, d) => sum + d.cleanupEfforts, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--vault-cyan)] to-blue-400 bg-clip-text text-transparent"
              data-testid="heading-ocean-plastic"
            >
              🌊 Global Ocean Plastic Concentration Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Monitoring plastic pollution hotspots and cleanup progress worldwide
            </p>
          </div>
          <Select value={selectedContinent} onValueChange={setSelectedContinent}>
            <SelectTrigger 
              className="w-48 bg-gray-800 border-[var(--vault-cyan)] text-white"
              data-testid="select-continent-filter"
            >
              <SelectValue placeholder="Filter by Continent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" data-testid="select-option-all">All Continents</SelectItem>
              <SelectItem value="Africa" data-testid="select-option-africa">Africa</SelectItem>
              <SelectItem value="Asia" data-testid="select-option-asia">Asia</SelectItem>
              <SelectItem value="Europe" data-testid="select-option-europe">Europe</SelectItem>
              <SelectItem value="North America" data-testid="select-option-north-america">North America</SelectItem>
              <SelectItem value="South America" data-testid="select-option-south-america">South America</SelectItem>
              <SelectItem value="Oceania" data-testid="select-option-oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-red-500 shadow-lg hover:shadow-red-500/20 transition-shadow"
            data-testid="card-plastic-waste"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Total Plastic Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-red-400"
                    data-testid="metric-plastic-waste"
                  >
                    {(totalPlasticWaste / 1000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tons annually</p>
                </div>
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500 shadow-lg hover:shadow-green-500/20 transition-shadow"
            data-testid="card-recycling-rate"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Recycling Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-green-400"
                    data-testid="metric-recycling-rate"
                  >
                    {avgRecyclingRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Average rate</p>
                </div>
                <Recycle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500 shadow-lg hover:shadow-blue-500/20 transition-shadow"
            data-testid="card-ocean-contribution"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Ocean Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-blue-400"
                    data-testid="metric-ocean-contribution"
                  >
                    {(totalOceanContribution / 1000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tons in oceans</p>
                </div>
                <Waves className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg hover:shadow-[var(--vault-cyan)]/20 transition-shadow"
            data-testid="card-cleanup-efforts"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Cleanup Efforts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-[var(--vault-cyan)]"
                    data-testid="metric-cleanup-efforts"
                  >
                    {totalCleanupEfforts.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tons removed</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[var(--vault-cyan)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg" data-testid="card-data-table">
          <CardHeader>
            <CardTitle className="text-[var(--vault-cyan)]">Regional Ocean Plastic Data</CardTitle>
            <CardDescription className="text-gray-400">
              Detailed breakdown by country and region
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--vault-cyan)]"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Country</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">Continent</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Plastic Waste (tons)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Recycling Rate (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Ocean Contribution (tons)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Cleanup Efforts (tons)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                        data-testid={`row-ocean-plastic-${index}`}
                      >
                        <td className="py-3 px-4 text-white">{item.country}</td>
                        <td className="py-3 px-4 text-gray-400">{item.continent}</td>
                        <td className="py-3 px-4 text-right text-red-400">{item.plasticWaste.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={item.recyclingRate >= 30 ? "default" : "destructive"}
                            data-testid={`badge-recycling-rate-${index}`}
                          >
                            {item.recyclingRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-blue-400">{item.oceanContribution.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-[var(--vault-cyan)]">{item.cleanupEfforts.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
