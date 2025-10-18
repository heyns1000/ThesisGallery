import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TreePine, Flame, TrendingDown, TrendingUp } from "lucide-react"

interface DeforestationData {
  continent: string
  country: string
  deforestationRate: number
  forestCover: number
  reforestationRate: number
  fireIncidents: number
}

export function DeforestationDashboard() {
  const [selectedContinent, setSelectedContinent] = useState("All")

  const { data: forestData = [], isLoading } = useQuery<DeforestationData[]>({
    queryKey: ["/api/baobab/deforestation"]
  })

  const filteredData = selectedContinent === "All" 
    ? forestData 
    : forestData.filter(d => d.continent === selectedContinent)

  const avgDeforestationRate = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.deforestationRate, 0) / filteredData.length
    : 0
  const avgForestCover = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.forestCover, 0) / filteredData.length
    : 0
  const avgReforestationRate = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.reforestationRate, 0) / filteredData.length
    : 0
  const totalFireIncidents = filteredData.reduce((sum, d) => sum + d.fireIncidents, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--vault-cyan)] to-green-400 bg-clip-text text-transparent"
              data-testid="heading-deforestation"
            >
              🌳 Global Deforestation Rates Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Real-time insights into forest loss and conservation efforts across 200 countries
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
            data-testid="card-deforestation-rate"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Deforestation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-red-400"
                    data-testid="metric-deforestation-rate"
                  >
                    {avgDeforestationRate.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Annual average</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500 shadow-lg hover:shadow-green-500/20 transition-shadow"
            data-testid="card-forest-cover"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Forest Cover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-green-400"
                    data-testid="metric-forest-cover"
                  >
                    {avgForestCover.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Of land area</p>
                </div>
                <TreePine className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg hover:shadow-[var(--vault-cyan)]/20 transition-shadow"
            data-testid="card-reforestation-rate"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Reforestation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-[var(--vault-cyan)]"
                    data-testid="metric-reforestation-rate"
                  >
                    {avgReforestationRate.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Recovery efforts</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[var(--vault-cyan)]" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500 shadow-lg hover:shadow-orange-500/20 transition-shadow"
            data-testid="card-fire-incidents"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Forest Fire Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-orange-400"
                    data-testid="metric-fire-incidents"
                  >
                    {totalFireIncidents.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Reported fires</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg" data-testid="card-data-table">
          <CardHeader>
            <CardTitle className="text-[var(--vault-cyan)]">Regional Deforestation Data</CardTitle>
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
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Deforestation Rate (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Forest Cover (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Reforestation Rate (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Fire Incidents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                        data-testid={`row-deforestation-${index}`}
                      >
                        <td className="py-3 px-4 text-white">{item.country}</td>
                        <td className="py-3 px-4 text-gray-400">{item.continent}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={item.deforestationRate > 1.0 ? "destructive" : "default"}
                            data-testid={`badge-deforestation-rate-${index}`}
                          >
                            {item.deforestationRate.toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-green-400">{item.forestCover.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-right text-[var(--vault-cyan)]">{item.reforestationRate.toFixed(2)}%</td>
                        <td className="py-3 px-4 text-right text-orange-400">{item.fireIncidents.toLocaleString()}</td>
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
