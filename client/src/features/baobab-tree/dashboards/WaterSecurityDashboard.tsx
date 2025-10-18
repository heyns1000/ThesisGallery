import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Droplets, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

interface WaterData {
  continent: string
  country: string
  waterStress: number
  cleanWaterAccess: number
  waterQualityIndex: number
  irrigationEfficiency: number
}

export function WaterSecurityDashboard() {
  const [selectedContinent, setSelectedContinent] = useState("All")

  const { data: waterData = [], isLoading } = useQuery<WaterData[]>({
    queryKey: ["/api/baobab/water-security"]
  })

  const filteredData = selectedContinent === "All" 
    ? waterData 
    : waterData.filter(d => d.continent === selectedContinent)

  const avgWaterStress = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.waterStress, 0) / filteredData.length
    : 0
  const avgCleanWaterAccess = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.cleanWaterAccess, 0) / filteredData.length
    : 0
  const avgWaterQuality = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.waterQualityIndex, 0) / filteredData.length
    : 0
  const avgIrrigationEfficiency = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.irrigationEfficiency, 0) / filteredData.length
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--vault-cyan)] to-blue-400 bg-clip-text text-transparent"
              data-testid="heading-water-security"
            >
              💧 Water Security & Quality Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Monitoring global water resources, access to clean water, and water quality
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
            data-testid="card-water-stress"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Water Stress Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-red-400"
                    data-testid="metric-water-stress"
                  >
                    {avgWaterStress.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Average stress</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg hover:shadow-[var(--vault-cyan)]/20 transition-shadow"
            data-testid="card-clean-water-access"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Clean Water Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-[var(--vault-cyan)]"
                    data-testid="metric-clean-water-access"
                  >
                    {avgCleanWaterAccess.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Population with access</p>
                </div>
                <CheckCircle className="w-8 h-8 text-[var(--vault-cyan)]" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500 shadow-lg hover:shadow-blue-500/20 transition-shadow"
            data-testid="card-water-quality"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Water Quality Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-blue-400"
                    data-testid="metric-water-quality"
                  >
                    {avgWaterQuality.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Average quality score</p>
                </div>
                <Droplets className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500 shadow-lg hover:shadow-green-500/20 transition-shadow"
            data-testid="card-irrigation-efficiency"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Irrigation Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-green-400"
                    data-testid="metric-irrigation-efficiency"
                  >
                    {avgIrrigationEfficiency.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Average efficiency</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg" data-testid="card-data-table">
          <CardHeader>
            <CardTitle className="text-[var(--vault-cyan)]">Regional Water Security Data</CardTitle>
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
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Water Stress (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Clean Water Access (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Quality Index</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Irrigation Efficiency (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                        data-testid={`row-water-${index}`}
                      >
                        <td className="py-3 px-4 text-white">{item.country}</td>
                        <td className="py-3 px-4 text-gray-400">{item.continent}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={item.waterStress > 60 ? "destructive" : "default"}
                            data-testid={`badge-water-stress-${index}`}
                          >
                            {item.waterStress.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-[var(--vault-cyan)]">{item.cleanWaterAccess.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-right text-blue-400">{item.waterQualityIndex.toFixed(1)}</td>
                        <td className="py-3 px-4 text-right text-green-400">{item.irrigationEfficiency.toFixed(1)}%</td>
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
