import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Activity, Shield, TrendingUp } from "lucide-react"

interface GlobalHealthData {
  continent: string
  country: string
  lifeExpectancy: number
  vaccinationCoverage: number
  healthcareAccess: number
  diseaseOutbreaks: number
}

export function GlobalHealthDashboard() {
  const [selectedContinent, setSelectedContinent] = useState("All")

  const { data: healthData = [], isLoading } = useQuery<GlobalHealthData[]>({
    queryKey: ["/api/baobab/global-health"]
  })

  const filteredData = selectedContinent === "All" 
    ? healthData 
    : healthData.filter(d => d.continent === selectedContinent)

  const avgLifeExpectancy = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.lifeExpectancy, 0) / filteredData.length
    : 0
  const avgVaccinationCoverage = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.vaccinationCoverage, 0) / filteredData.length
    : 0
  const avgHealthcareAccess = filteredData.length > 0
    ? filteredData.reduce((sum, d) => sum + d.healthcareAccess, 0) / filteredData.length
    : 0
  const totalDiseaseOutbreaks = filteredData.reduce((sum, d) => sum + d.diseaseOutbreaks, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold bg-gradient-to-r from-[var(--vault-cyan)] to-red-400 bg-clip-text text-transparent"
              data-testid="heading-global-health"
            >
              ❤️ Global Health Metrics & Disease Outbreaks Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Monitoring public health indicators, disease prevalence, and outbreak response
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
            data-testid="card-life-expectancy"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Life Expectancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-[var(--vault-cyan)]"
                    data-testid="metric-life-expectancy"
                  >
                    {avgLifeExpectancy.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Years (average)</p>
                </div>
                <Heart className="w-8 h-8 text-[var(--vault-cyan)]" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-green-500 shadow-lg hover:shadow-green-500/20 transition-shadow"
            data-testid="card-vaccination-coverage"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Vaccination Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-green-400"
                    data-testid="metric-vaccination-coverage"
                  >
                    {avgVaccinationCoverage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Population coverage</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500 shadow-lg hover:shadow-blue-500/20 transition-shadow"
            data-testid="card-healthcare-access"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Healthcare Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-blue-400"
                    data-testid="metric-healthcare-access"
                  >
                    {avgHealthcareAccess.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Population access</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-red-500 shadow-lg hover:shadow-red-500/20 transition-shadow"
            data-testid="card-disease-outbreaks"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Disease Outbreaks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p 
                    className="text-3xl font-bold text-red-400"
                    data-testid="metric-disease-outbreaks"
                  >
                    {totalDiseaseOutbreaks}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Active outbreaks</p>
                </div>
                <Activity className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)] shadow-lg" data-testid="card-data-table">
          <CardHeader>
            <CardTitle className="text-[var(--vault-cyan)]">Regional Global Health Data</CardTitle>
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
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Life Expectancy (yrs)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Vaccination Coverage (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Healthcare Access (%)</th>
                      <th className="text-right py-3 px-4 text-gray-300 font-semibold">Disease Outbreaks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors"
                        data-testid={`row-global-health-${index}`}
                      >
                        <td className="py-3 px-4 text-white">{item.country}</td>
                        <td className="py-3 px-4 text-gray-400">{item.continent}</td>
                        <td className="py-3 px-4 text-right text-[var(--vault-cyan)]">{item.lifeExpectancy.toFixed(1)}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={item.vaccinationCoverage >= 70 ? "default" : "destructive"}
                            data-testid={`badge-vaccination-coverage-${index}`}
                          >
                            {item.vaccinationCoverage.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-blue-400">{item.healthcareAccess.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            variant={item.diseaseOutbreaks > 5 ? "destructive" : "default"}
                            data-testid={`badge-disease-outbreaks-${index}`}
                          >
                            {item.diseaseOutbreaks}
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
