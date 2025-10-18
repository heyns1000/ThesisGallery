import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wind, AlertTriangle, Activity, TrendingDown } from "lucide-react"

interface AirQualityData {
  continent: string
  country: string
  aqi: number
  pm25: number
  no2: number
  healthImpact: number
}

export function AirQualityDashboard() {
  const [selectedContinent, setSelectedContinent] = useState("All")

  const { data: airData = [], isLoading } = useQuery<AirQualityData[]>({
    queryKey: ["/api/baobab/air-quality"]
  })

  const filteredData = selectedContinent === "All" 
    ? airData 
    : airData.filter(d => d.continent === selectedContinent)

  const avgAQI = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.aqi, 0) / filteredData.length
    : 0
  const avgPM25 = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.pm25, 0) / filteredData.length
    : 0
  const avgNO2 = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.no2, 0) / filteredData.length
    : 0
  const totalHealthImpact = filteredData.reduce((sum, d) => sum + d.healthImpact, 0)

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-green-500", bg: "bg-green-500" }
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500" }
    if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "text-orange-500", bg: "bg-orange-500" }
    return { label: "Unhealthy", color: "text-red-500", bg: "bg-red-500" }
  }

  const status = getAQIStatus(avgAQI)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--vault-cyan)] to-purple-400 bg-clip-text text-transparent"
              data-testid="heading-air-quality"
            >
              💨 Air Quality & Pollution Levels Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Tracking air pollution, its sources, and health impacts worldwide
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
            className={`bg-gradient-to-br from-gray-800 to-gray-900 border-${status.bg.replace('bg-', '')} shadow-lg hover:shadow-${status.bg.replace('bg-', '')}/20 transition-shadow`}
            data-testid="card-air-quality-index"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Air Quality Index (AQI)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className={`text-3xl font-bold ${status.color}`}
                    data-testid="metric-aqi"
                  >
                    {avgAQI.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{status.label}</p>
                </div>
                <Wind className={`w-8 h-8 ${status.color}`} />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500 shadow-lg hover:shadow-purple-500/20 transition-shadow"
            data-testid="card-pm25"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">PM2.5 Concentration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-purple-400"
                    data-testid="metric-pm25"
                  >
                    {avgPM25.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">μg/m³</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-orange-500 shadow-lg hover:shadow-orange-500/20 transition-shadow"
            data-testid="card-no2"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">NO₂ Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-orange-400"
                    data-testid="metric-no2"
                  >
                    {avgNO2.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ppb</p>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-red-500 shadow-lg hover:shadow-red-500/20 transition-shadow"
            data-testid="card-health-impact"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Health Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-red-400"
                    data-testid="metric-health-impact"
                  >
                    {totalHealthImpact.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Affected individuals</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg" data-testid="card-data-table">
          <CardHeader>
            <CardTitle className="text-[var(--vault-cyan)]">Regional Air Quality Data</CardTitle>
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
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">AQI</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">PM2.5 (μg/m³)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">NO₂ (ppb)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Health Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => {
                      const itemStatus = getAQIStatus(item.aqi)
                      return (
                        <tr 
                          key={index} 
                          className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                          data-testid={`row-air-quality-${index}`}
                        >
                          <td className="py-3 px-4 text-white">{item.country}</td>
                          <td className="py-3 px-4 text-gray-400">{item.continent}</td>
                          <td className="py-3 px-4 text-right">
                            <Badge 
                              className={itemStatus.bg}
                              data-testid={`badge-aqi-${index}`}
                            >
                              {item.aqi}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right text-purple-400">{item.pm25.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right text-orange-400">{item.no2.toFixed(1)}</td>
                          <td className="py-3 px-4 text-right text-red-400">{item.healthImpact.toLocaleString()}</td>
                        </tr>
                      )
                    })}
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
