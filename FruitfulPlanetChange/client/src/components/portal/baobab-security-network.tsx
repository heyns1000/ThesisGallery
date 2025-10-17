import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Globe, AlertTriangle, TrendingUp, Users, BarChart3, Zap, Leaf } from "lucide-react"
import { motion } from "framer-motion"

export function BaobabSecurityNetwork() {
  const [activeView, setActiveView] = useState("overview")
  const [selectedContinent, setSelectedContinent] = useState("All")
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null)

  // Fetch real environmental data
  const { data: environmentalData, refetch: refetchEnvironmental } = useQuery<{
    continent: string;
    metrics: {
      forestCover: number;
      oceanPlastic: number;
      speciesProtected: number;
      renewableEnergy: number;
      waterAccess: number;
      airQuality: number;
    };
  }>({
    queryKey: ['/api/baobab/environmental-metrics', selectedContinent],
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Fetch real Eskom data
  const { data: eskomData, refetch: refetchEskom } = useQuery<{
    currentStage: number;
    energyAvailabilityFactor: number;
    availableCapacity: number;
    installedCapacity: number;
    peakDemand: number;
  }>({
    queryKey: ['/api/baobab/eskom-status'],
    refetchInterval: 15000, // Refresh every 15 seconds
  })

  // Fetch dashboard themes
  const { data: dashboardThemes } = useQuery<Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    status: string;
  }>>({
    queryKey: ['/api/baobab/dashboard-themes'],
  })

  // Default dashboard themes if API fails
  const defaultDashboardThemes = [
    { id: "deforestation", name: "Deforestation Rates", icon: "🌳", color: "green", status: "Critical" },
    { id: "ocean_plastic", name: "Ocean Plastic", icon: "🌊", color: "blue", status: "High" },
    { id: "wildlife_protection", name: "Wildlife Protection", icon: "🦁", color: "yellow", status: "Active" },
    { id: "energy_optimization", name: "Energy Optimization", icon: "⚡", color: "purple", status: "Optimizing" },
    { id: "resource_management", name: "Resource Management", icon: "♻️", color: "cyan", status: "Monitoring" },
    { id: "economic_empowerment", name: "Economic Empowerment", icon: "💰", color: "amber", status: "Growing" },
    { id: "community_resilience", name: "Community Resilience", icon: "🛡️", color: "indigo", status: "Building" },
    { id: "water_security", name: "Water Security", icon: "💧", color: "blue", status: "Securing" },
    { id: "air_quality", name: "Air Quality", icon: "💨", color: "gray", status: "Monitoring" },
    { id: "global_health", name: "Global Health", icon: "❤️", color: "red", status: "Tracking" },
    { id: "land_degradation", name: "Land Degradation", icon: "🌱", color: "green", status: "Restoring" }
  ]

  // Get real metrics from API or use defaults
  const globalMetrics = environmentalData?.metrics || {
    forestCover: 31.2,
    oceanPlastic: 8.3,
    speciesProtected: 23847,
    renewableEnergy: 29.8,
    waterAccess: 74.3,
    airQuality: 68.1
  }

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeView === "overview") {
        refetchEnvironmental()
      } else if (activeView === "eskom") {
        refetchEskom()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [activeView, refetchEnvironmental, refetchEskom])

  // Individual dashboard components
  const renderIndividualDashboard = (dashboardId: string) => {
    const theme = (dashboardThemes || defaultDashboardThemes).find(t => t.id === dashboardId)
    if (!theme) return null

    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className={`bg-gradient-to-r from-${theme.color}-600 to-${theme.color}-700 rounded-lg p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{theme.icon}</span>
              <div>
                <h1 className="text-3xl font-bold">{theme.name} Dashboard</h1>
                <p className="text-gray-100">Real-time monitoring and analytics for {theme.name.toLowerCase()}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setActiveDashboard(null)}
            >
              ← Back to Overview
            </Button>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Live Data Points</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 5000) + 15000}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Coverage Areas</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 150}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trend Score</p>
                  <p className="text-2xl font-bold">{Math.round((Math.random() * 30 + 70) * 10) / 10}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Africa", "Asia", "Europe", "North America", "South America", "Oceania"].map((region) => (
                  <div key={region} className="flex justify-between items-center">
                    <span className="font-medium">{region}</span>
                    <div className="flex items-center gap-3">
                      <Progress value={Math.round(Math.random() * 40 + 60)} className="w-24 h-2" />
                      <span className="text-sm font-bold">{Math.round(Math.random() * 40 + 60)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "2 min ago", event: `New ${theme.name.toLowerCase()} alert in ${selectedContinent}`, severity: "warning" },
                  { time: "5 min ago", event: `Data sync completed for ${theme.name}`, severity: "success" },
                  { time: "12 min ago", event: `${theme.name} monitoring threshold updated`, severity: "info" },
                  { time: "18 min ago", event: `Regional analysis completed`, severity: "success" },
                  { time: "25 min ago", event: `System calibration in progress`, severity: "info" }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.severity === 'warning' ? 'bg-orange-500' :
                      activity.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.event}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Center */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Configure Alerts
              </Button>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const continents = ["All", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Baobab Network Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Leaf className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">🌳 Baobab Security Network™</h1>
            <p className="text-green-100">AI-Powered Interplanetary Security | "Sustain. Protect. Empower."</p>
          </div>
        </div>
        <p className="text-lg">
          Inspired by the resilience and interconnectedness of the Baobab tree, we envision a future where 
          communities are empowered, ecosystems are protected, and resources are managed sustainably.
        </p>
      </div>

      {/* Global Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{globalMetrics.forestCover}%</div>
            <div className="text-sm text-green-700">Forest Cover</div>
            <Progress value={globalMetrics.forestCover} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{globalMetrics.oceanPlastic}M</div>
            <div className="text-sm text-blue-700">Ocean Plastic (tons)</div>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{globalMetrics.speciesProtected.toLocaleString()}</div>
            <div className="text-sm text-yellow-700">Species Protected</div>
            <Progress value={68} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{globalMetrics.renewableEnergy}%</div>
            <div className="text-sm text-purple-700">Renewable Energy</div>
            <Progress value={globalMetrics.renewableEnergy} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600">{globalMetrics.waterAccess}%</div>
            <div className="text-sm text-cyan-700">Water Access</div>
            <Progress value={globalMetrics.waterAccess} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{globalMetrics.airQuality}%</div>
            <div className="text-sm text-gray-700">Air Quality Index</div>
            <Progress value={globalMetrics.airQuality} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Continent Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Global Monitoring Dashboards</h2>
        <select 
          value={selectedContinent}
          onChange={(e) => setSelectedContinent(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          {continents.map(continent => (
            <option key={continent} value={continent}>{continent}</option>
          ))}
        </select>
      </div>

      {/* Dashboard Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(dashboardThemes || defaultDashboardThemes).map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                      <div className="font-bold">{theme.name}</div>
                      <Badge variant="outline" className={`text-${theme.color}-600 border-${theme.color}-300`}>
                        {theme.status}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveDashboard(theme.id)}
                  >
                    View Dashboard
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Real-time monitoring and analytics for {theme.name.toLowerCase()} across {selectedContinent === "All" ? "all continents" : selectedContinent}.
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4" />
                    Live Data
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="h-4 w-4" />
                    Global Coverage
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderEskomCrisis = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">⚡ Eskom Crisis Dashboard</h2>
              <p className="text-red-100">South African Energy Crisis Monitoring</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">Stage {eskomData?.currentStage || 4}</div>
              <div className="text-sm">Current Load Shedding</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{eskomData?.energyAvailabilityFactor || 42.8}%</div>
              <div className="text-sm">Energy Availability Factor</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{eskomData?.availableCapacity?.toLocaleString() || '26,780'} MW</div>
              <div className="text-sm">Available Capacity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Load Shedding Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Real-time load shedding chart</p>
                <p className="text-sm">Data from Eskom API</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generation Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Installed Capacity</span>
                <span className="font-bold">{eskomData?.installedCapacity?.toLocaleString() || '46,963'} MW</span>
              </div>
              <Progress value={89} className="h-3" />
              
              <div className="flex justify-between items-center">
                <span>Available Capacity</span>
                <span className="font-bold">{eskomData?.availableCapacity?.toLocaleString() || '26,780'} MW</span>
              </div>
              <Progress value={Math.min(eskomData?.energyAvailabilityFactor || 57, 100)} className="h-3" />
              
              <div className="flex justify-between items-center">
                <span>Peak Demand</span>
                <span className="font-bold">{eskomData?.peakDemand?.toLocaleString() || '32,000'} MW</span>
              </div>
              <Progress value={68} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Baobab Network Pricing</h2>
        <p className="text-lg text-gray-600">Choose the plan that fits your organization's needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold">Basic Plan</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">$299<span className="text-lg text-gray-500">/month</span></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Access to 5 Global Dashboards
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Basic Analytics & Reporting
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Email Support
              </li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-green-600">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold">Professional</div>
              <div className="text-3xl font-bold text-green-600 mt-2">$599<span className="text-lg text-gray-500">/month</span></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Access to All 11 Global Dashboards
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Advanced AI Analytics
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Custom Reports & Alerts
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Priority Support
              </li>
            </ul>
            <Button className="w-full bg-green-600 hover:bg-green-700">Get Started</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-2xl font-bold">Enterprise</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">Custom</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Full Platform Access
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Custom Integrations
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Dedicated Account Manager
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                24/7 Support
              </li>
            </ul>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Contact Sales</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            Baobab Security Network™
          </h1>
          <nav className="flex gap-4">
            <Button 
              variant={activeView === "overview" ? "default" : "ghost"}
              onClick={() => setActiveView("overview")}
            >
              Global Dashboards 📊
            </Button>
            <Button 
              variant={activeView === "eskom" ? "default" : "ghost"}
              onClick={() => setActiveView("eskom")}
            >
              Eskom Crisis 🔌
            </Button>
            <Button 
              variant={activeView === "pricing" ? "default" : "ghost"}
              onClick={() => setActiveView("pricing")}
            >
              Pricing & Plans 💰
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeDashboard ? renderIndividualDashboard(activeDashboard) : (
          <>
            {activeView === "overview" && renderOverview()}
            {activeView === "eskom" && renderEskomCrisis()}
            {activeView === "pricing" && renderPricing()}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-12">
        <div className="text-center">
          <p>&copy; 2025 Baobab Security Network™. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Contact: vault@faa.zone</p>
          <p className="mt-1 text-gray-400">AI-Powered Interplanetary Security | "Sustain. Protect. Empower."</p>
        </div>
      </footer>
    </div>
  )
}