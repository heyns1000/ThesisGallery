import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, TrendingUp, TrendingDown } from "lucide-react"

interface WildlifeData {
  continent: string
  country: string
  threatenedSpecies: number
  poachingIncidents: number
  protectedAreas: number
  conservationScore: number
}

export function WildlifeProtectionDashboard() {
  const [selectedContinent, setSelectedContinent] = useState("All")

  const { data: wildlifeData = [], isLoading } = useQuery<WildlifeData[]>({
    queryKey: ["/api/baobab/wildlife-protection"]
  })

  const filteredData = selectedContinent === "All" 
    ? wildlifeData 
    : wildlifeData.filter(d => d.continent === selectedContinent)

  const totalThreatenedSpecies = filteredData.reduce((sum, d) => sum + d.threatenedSpecies, 0)
  const totalPoachingIncidents = filteredData.reduce((sum, d) => sum + d.poachingIncidents, 0)
  const avgConservationScore = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.conservationScore, 0) / filteredData.length
    : 0
  const totalProtectedAreas = filteredData.reduce((sum, d) => sum + d.protectedAreas, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--vault-cyan)] to-[var(--energetic-green)] bg-clip-text text-transparent"
              data-testid="heading-wildlife-protection"
            >
              🦁 Wildlife Protection & Biodiversity Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Tracking endangered species, anti-poaching efforts, and habitat conservation worldwide
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
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg hover:shadow-[var(--vault-cyan)]/20 transition-shadow"
            data-testid="card-threatened-species"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Threatened Species</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-[var(--vault-cyan)]"
                    data-testid="metric-threatened-species"
                  >
                    {totalThreatenedSpecies.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Species at risk</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-red-500 shadow-lg hover:shadow-red-500/20 transition-shadow"
            data-testid="card-poaching-incidents"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Poaching Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-red-500"
                    data-testid="metric-poaching-incidents"
                  >
                    {totalPoachingIncidents.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Incidents reported</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500 shadow-lg hover:shadow-green-500/20 transition-shadow"
            data-testid="card-protected-areas"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Protected Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-green-500"
                    data-testid="metric-protected-areas"
                  >
                    {totalProtectedAreas.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hectares protected</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--energetic-green)] shadow-lg hover:shadow-[var(--energetic-green)]/20 transition-shadow"
            data-testid="card-conservation-score"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Conservation Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-[var(--energetic-green)]"
                    data-testid="metric-conservation-score"
                  >
                    {avgConservationScore.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Average score</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[var(--energetic-green)]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg" data-testid="card-data-table">
          <CardHeader>
            <CardTitle className="text-[var(--vault-cyan)]">Regional Wildlife Protection Data</CardTitle>
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
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Threatened Species</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Poaching Incidents</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Protected Areas (ha)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Conservation Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                        data-testid={`row-wildlife-${index}`}
                      >
                        <td className="py-3 px-4 text-white">{item.country}</td>
                        <td className="py-3 px-4 text-gray-400">{item.continent}</td>
                        <td className="py-3 px-4 text-right text-orange-400">{item.threatenedSpecies.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-red-400">{item.poachingIncidents.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-green-400">{item.protectedAreas.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={item.conservationScore >= 70 ? "default" : "destructive"}
                            className={item.conservationScore >= 70 ? "bg-green-500" : "bg-red-500"}
                            data-testid={`badge-conservation-score-${index}`}
                          >
                            {item.conservationScore}%
                          </Badge>
                        </td>
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
