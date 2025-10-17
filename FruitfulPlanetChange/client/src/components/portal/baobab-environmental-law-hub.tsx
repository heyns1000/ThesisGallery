import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trees, 
  Droplets, 
  Wind, 
  Globe, 
  Heart, 
  Shield, 
  Scale, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Users,
  Factory,
  Leaf,
  Zap,
  Fish,
  Mountain,
  Thermometer,
  BarChart3,
  PieChart,
  Target,
  Award,
  Briefcase,
  Gavel,
  BookOpen,
  Download,
  ExternalLink,
  Search,
  Filter
} from "lucide-react"
import { motion } from "framer-motion"

interface EnvironmentalMetric {
  id: string
  title: string
  value: number
  unit: string
  change: number
  status: "critical" | "warning" | "good" | "excellent"
  icon: any
  description: string
}

interface LegalCase {
  id: string
  title: string
  status: "active" | "pending" | "resolved" | "appeal"
  priority: "high" | "medium" | "low"
  category: string
  location: string
  lastUpdate: string
  description: string
  environmentalImpact: string
}

interface BaobabEnvironmentalLawHubProps {
  sectorId?: number
  sectorName?: string
  className?: string
}

export function BaobabEnvironmentalLawHub({ sectorId, sectorName, className = "" }: BaobabEnvironmentalLawHubProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMetric, setSelectedMetric] = useState<EnvironmentalMetric | null>(null)
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Environmental metrics data
  const environmentalMetrics: EnvironmentalMetric[] = [
    {
      id: "deforestation",
      title: "Deforestation Rate",
      value: 7.2,
      unit: "million hectares/year",
      change: -12.5,
      status: "warning",
      icon: Trees,
      description: "Global forest loss monitoring and conservation legal frameworks"
    },
    {
      id: "water_security",
      title: "Water Security Index",
      value: 68,
      unit: "% secure",
      change: 3.2,
      status: "good",
      icon: Droplets,
      description: "Water rights, pollution litigation, and resource allocation law"
    },
    {
      id: "air_quality",
      title: "Air Quality Index",
      value: 142,
      unit: "AQI",
      change: -8.1,
      status: "critical",
      icon: Wind,
      description: "Air pollution regulations, emissions law, and public health litigation"
    },
    {
      id: "biodiversity",
      title: "Biodiversity Index",
      value: 73,
      unit: "% intact",
      change: -2.8,
      status: "warning",
      icon: Leaf,
      description: "Wildlife protection law, habitat conservation, and species rights"
    },
    {
      id: "climate_action",
      title: "Climate Action Score",
      value: 58,
      unit: "points",
      change: 15.7,
      status: "good",
      icon: Globe,
      description: "Climate litigation, carbon law, and environmental justice cases"
    },
    {
      id: "renewable_energy",
      title: "Renewable Energy Adoption",
      value: 31,
      unit: "% of total",
      change: 23.4,
      status: "excellent",
      icon: Zap,
      description: "Energy law, renewable contracts, and grid transition regulations"
    }
  ]

  // Legal cases data
  const legalCases: LegalCase[] = [
    {
      id: "1",
      title: "Mining Company Environmental Damage Case",
      status: "active",
      priority: "high",
      category: "Environmental Damage",
      location: "South Africa",
      lastUpdate: "2024-01-15",
      description: "Class action lawsuit against mining corporation for groundwater contamination and ecosystem destruction",
      environmentalImpact: "Severe groundwater contamination affecting 50,000+ residents and local wildlife habitats"
    },
    {
      id: "2",
      title: "Coastal Development vs Marine Conservation",
      status: "pending",
      priority: "high",
      category: "Marine Law",
      location: "Cape Town",
      lastUpdate: "2024-01-12",
      description: "Legal challenge to proposed coastal development threatening marine protected areas",
      environmentalImpact: "Potential destruction of critical penguin breeding grounds and marine ecosystems"
    },
    {
      id: "3",
      title: "Air Pollution Public Health Litigation",
      status: "appeal",
      priority: "medium",
      category: "Public Health",
      location: "Johannesburg",
      lastUpdate: "2024-01-10",
      description: "Community lawsuit against industrial polluters for health damages from air contamination",
      environmentalImpact: "Air quality violations affecting 200,000+ residents with increased respiratory illness"
    },
    {
      id: "4",
      title: "Forest Conservation vs Development Rights",
      status: "resolved",
      priority: "medium",
      category: "Forest Law",
      location: "Garden Route",
      lastUpdate: "2024-01-08",
      description: "Successfully protected indigenous forest from commercial development through conservation easement",
      environmentalImpact: "Preserved 5,000 hectares of indigenous forest and protected endemic species habitat"
    }
  ]

  useEffect(() => {
    // Simulate loading environmental data
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "warning": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "good": return "text-green-600 bg-green-50 dark:bg-green-900/20"
      case "excellent": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getCaseStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "pending": return "bg-yellow-500"
      case "resolved": return "bg-blue-500"
      case "appeal": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const filteredCases = legalCases.filter(case_ => 
    case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    case_.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    case_.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Trees className="h-8 w-8 text-green-600" />
            Baobab Environmental Law Hub
            {sectorName && <Badge variant="outline" className="ml-2">{sectorName}</Badge>}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive environmental law, social justice, and sustainability legal framework
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Environmental Metrics</TabsTrigger>
          <TabsTrigger value="cases">Legal Cases</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">142</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Legal Cases</div>
                <div className="text-xs text-green-600 mt-1">+18% this quarter</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                <div className="text-xs text-green-600 mt-1">+5% improvement</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">23</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries Served</div>
                <div className="text-xs text-blue-600 mt-1">Africa focus</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">2.3M</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lives Impacted</div>
                <div className="text-xs text-green-600 mt-1">Positive outcomes</div>
              </CardContent>
            </Card>
          </div>

          {/* Baobab Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trees className="h-5 w-5 text-green-600" />
                Baobab Security Network™ Environmental Law Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Core Legal Specializations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Environmental Impact Assessment Law
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Climate Change Litigation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Water Rights & Pollution Law
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Biodiversity & Conservation Law
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Environmental Justice & Human Rights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Renewable Energy & Sustainability Law
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Fruitful Crate Dance & Banimal Giving Loop Integration</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm mb-3">
                      Our environmental law practice directly supports the <strong>Fruitful Crate Dance</strong> ecosystem 
                      by providing legal frameworks for sustainable business practices and the <strong>Banimal Giving Loop</strong> 
                      charitable distribution network.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <Globe className="h-4 w-4" />
                      <span>Supporting www.banimal.co.za charitable initiatives</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environmental Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metrics List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Environmental Impact Metrics</h3>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {environmentalMetrics.map((metric) => (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedMetric(metric)}
                    >
                      <Card className={`transition-all hover:shadow-lg ${
                        selectedMetric?.id === metric.id ? 'ring-2 ring-green-500' : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${getStatusColor(metric.status)}`}>
                              <metric.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{metric.title}</h4>
                                <Badge variant="outline">{metric.status}</Badge>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold">{formatNumber(metric.value)}</span>
                                <span className="text-sm text-gray-600">{metric.unit}</span>
                                <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {metric.change > 0 ? '+' : ''}{metric.change}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{metric.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Metric Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Metric Details</h3>
              {selectedMetric ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <selectedMetric.icon className="h-6 w-6 text-green-600" />
                      {selectedMetric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Current Value:</span>
                        <div className="text-2xl font-bold">
                          {formatNumber(selectedMetric.value)} {selectedMetric.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Change:</span>
                        <div className={`text-2xl font-bold ${selectedMetric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedMetric.change > 0 ? '+' : ''}{selectedMetric.change}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant="outline" className={`ml-2 ${getStatusColor(selectedMetric.status)}`}>
                        {selectedMetric.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-sm font-medium">Legal Framework:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedMetric.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Related Legal Actions</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>• Environmental compliance monitoring</p>
                        <p>• Regulatory impact assessments</p>
                        <p>• Litigation support and expert testimony</p>
                        <p>• Policy development and advocacy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Select a Metric</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose an environmental metric to view detailed legal analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Legal Cases Tab */}
        <TabsContent value="cases" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search legal cases..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter by Status
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter by Category
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cases List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Environmental Law Cases ({filteredCases.length})</h3>
              <div className="space-y-3">
                {filteredCases.map((case_) => (
                  <motion.div
                    key={case_.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedCase(case_)}
                  >
                    <Card className={`transition-all hover:shadow-lg ${
                      selectedCase?.id === case_.id ? 'ring-2 ring-green-500' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{case_.title}</h4>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCaseStatusColor(case_.status)}`}></div>
                            <Badge variant="outline" className="text-xs">
                              {case_.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{case_.location}</span>
                          <span className={getPriorityColor(case_.priority)}>
                            {case_.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {case_.description}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          Updated: {case_.lastUpdate}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Case Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Case Details</h3>
              {selectedCase ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Gavel className="h-5 w-5 text-blue-600" />
                      {selectedCase.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Status:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getCaseStatusColor(selectedCase.status)}`}></div>
                          <span className="capitalize">{selectedCase.status}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Priority:</span>
                        <span className={`ml-2 ${getPriorityColor(selectedCase.priority)}`}>
                          {selectedCase.priority.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>
                        <Badge variant="outline" className="ml-2">
                          {selectedCase.category}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <span className="ml-2">{selectedCase.location}</span>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Case Description:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedCase.description}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Environmental Impact:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedCase.environmentalImpact}
                      </p>
                    </div>

                    <div className="pt-4 border-t">
                      <span className="font-medium text-sm">Last Updated:</span>
                      <span className="ml-2 text-sm">{selectedCase.lastUpdate}</span>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Court Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Select a Case</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose a legal case to view detailed information
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Compliance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Environmental compliance monitoring and legal framework analysis</p>
                <p className="text-sm">Real-time regulatory compliance tracking in development...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal Resources & Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Environmental law resources, precedents, and legal frameworks</p>
                <p className="text-sm">Comprehensive legal resource library coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}