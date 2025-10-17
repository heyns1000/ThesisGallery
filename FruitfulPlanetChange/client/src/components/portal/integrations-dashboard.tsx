import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  ExternalLink, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  Code,
  Database,
  Shield,
  Settings,
  Cloud
} from "lucide-react"
import { motion } from "framer-motion"

interface Extension {
  id: string
  name: string
  description: string
  author: string
  version: string
  downloads: number
  category: string
  tags: string[]
  status: 'active' | 'inactive' | 'error'
  icon: string
  integrationLevel: 'native' | 'api' | 'webhook' | 'manual'
}

interface IntegrationCategory {
  id: string
  name: string
  description: string
  extensions: Extension[]
  icon: string
  color: string
}

export function IntegrationsDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Fetch real installed extensions from API
  const { data: installedExtensions = [], isLoading: extensionsLoading } = useQuery<Extension[]>({
    queryKey: ["/api/extensions/installed"],
  })

  const { data: extensionStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/extensions/stats"],
  })

  // Built-in Seedwave integrations - ensure all have required properties
  const seedwaveIntegrations: Extension[] = [
    {
      id: "vaultmesh-core",
      name: "VaultMesh™ Core",
      description: "Core infrastructure and security layer powering the entire Seedwave ecosystem",
      author: "Seedwave™",
      version: "3.2.1",
      downloads: 6005,
      category: "infrastructure",
      tags: ["security", "infrastructure", "core", "vault"],
      status: "active",
      icon: "🔒",
      integrationLevel: "native"
    },
    {
      id: "faa-quantum-nexus",
      name: "FAA Quantum Nexus™",
      description: "Revolutionary AI economic expansion model with quantum processing",
      author: "FAA.ZONE™",
      version: "1.0.0",
      downloads: 1247,
      category: "ai",
      tags: ["quantum", "ai", "economic", "nexus"],
      status: "active",
      icon: "🚀",
      integrationLevel: "native"
    },
    {
      id: "omnilevel-ai",
      name: "Omnilevel AI Logic",
      description: "Advanced AI-powered sector recommendation and completion system",
      author: "Seedwave™",
      version: "2.5.0",
      downloads: 2156,
      category: "ai",
      tags: ["ai", "logic", "recommendations", "sectors"],
      status: "active",
      icon: "🧠",
      integrationLevel: "native"
    },
    {
      id: "securesign-vip",
      name: "SecureSign™ VIP",
      description: "Enterprise-grade legal document management and NDA processing",
      author: "Seedwave™",
      version: "1.8.2",
      downloads: 856,
      category: "legal",
      tags: ["legal", "documents", "nda", "security"],
      status: "active",
      icon: "📋",
      integrationLevel: "native"
    },
    {
      id: "banimal-charitable",
      name: "Banimal™ Global Giving",
      description: "Charitable giving loop integration with comprehensive impact tracking",
      author: "Banimal™",
      version: "1.4.1",
      downloads: 723,
      category: "charitable",
      tags: ["charity", "giving", "impact", "global"],
      status: "active",
      icon: "🍼",
      integrationLevel: "webhook"
    },
    {
      id: "motion-media-sonic",
      name: "Motion, Media & Sonic Studio",
      description: "Comprehensive media processing and sonic engine management",
      author: "Seedwave™",
      version: "2.0.3",
      downloads: 445,
      category: "media",
      tags: ["media", "processing", "sonic", "studio"],
      status: "active",
      icon: "🎬",
      integrationLevel: "api"
    }
  ]

  const integrationCategories: IntegrationCategory[] = [
    {
      id: "data",
      name: "Data & Analytics",
      description: "Extensions for data processing, visualization, and analytics",
      extensions: [...installedExtensions.filter(ext => ext.category === "data")],
      icon: "📊",
      color: "bg-blue-500"
    },
    {
      id: "development", 
      name: "Development Tools",
      description: "Development workflow and productivity extensions",
      extensions: [...installedExtensions.filter(ext => ext.category === "development")],
      icon: "💻",
      color: "bg-green-500"
    },
    {
      id: "infrastructure",
      name: "Infrastructure & Security",
      description: "Core infrastructure and security integrations",
      extensions: [...seedwaveIntegrations.filter(ext => ext.category === "infrastructure")],
      icon: "🔒",
      color: "bg-purple-500"
    },
    {
      id: "ai",
      name: "AI & Machine Learning", 
      description: "Artificial intelligence and machine learning capabilities",
      extensions: [...seedwaveIntegrations.filter(ext => ext.category === "ai")],
      icon: "🧠",
      color: "bg-cyan-500"
    },
    {
      id: "legal",
      name: "Legal & Compliance",
      description: "Legal document management and compliance tools",
      extensions: [...seedwaveIntegrations.filter(ext => ext.category === "legal")],
      icon: "📋",
      color: "bg-yellow-500"
    },
    {
      id: "charitable",
      name: "Charitable & Impact",
      description: "Charitable giving and social impact integrations",
      extensions: [...seedwaveIntegrations.filter(ext => ext.category === "charitable")],
      icon: "💝",
      color: "bg-pink-500"
    },
    {
      id: "media",
      name: "Media & Creative",
      description: "Media processing and creative content tools",
      extensions: [...seedwaveIntegrations.filter(ext => ext.category === "media")],
      icon: "🎨",
      color: "bg-orange-500"
    }
  ]

  // Combine all extensions - handle loading state
  const allExtensions = [...(installedExtensions || []), ...seedwaveIntegrations]

  const filteredExtensions = allExtensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (ext.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || ext.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getExtensionIcon = (extension: Extension) => {
    // Specific icons for known Replit extensions
    const specificIcons: Record<string, string> = {
      'docx-viewer': '📄',
      'csv-editor': '📊',
      'root-workbench': '🏢',
      'ui-sketcher': '✏️',
      'icon-generator': '🎨',
      'repl-tv': '📺',
      'gpt-replit': '🤖',
      'secrets-generator': '🔐',
      'api-request-tester': '🔌'
    }
    
    if (specificIcons[extension.id]) {
      return specificIcons[extension.id]
    }
    
    // Use extension.icon if available, otherwise fallback to category
    if (extension.icon) {
      return extension.icon
    }
    
    // Fallback to category icons
    const categoryIcons: Record<string, string> = {
      'data': '📊',
      'development': '💻',
      'design': '🎨',
      'ai': '🤖',
      'security': '🔒',
      'media': '📺',
      'infrastructure': '⚙️',
      'unknown': '🔧'
    }
    return categoryIcons[extension.category] || '🔧'
  }

  const getIntegrationIcon = (level: string) => {
    switch (level) {
      case 'native': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'api': return <Zap className="h-4 w-4 text-blue-500" />
      case 'webhook': return <Cloud className="h-4 w-4 text-purple-500" />
      case 'manual': return <Settings className="h-4 w-4 text-yellow-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getIntegrationLabel = (level: string) => {
    switch (level) {
      case 'native': return 'Native'
      case 'api': return 'API'
      case 'webhook': return 'Webhook'
      case 'manual': return 'Manual'
      default: return 'Unknown'
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Integrations Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Replit extensions and Seedwave integrations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {extensionsLoading ? "Loading..." : `${allExtensions.length} Total Integrations`}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {extensionsLoading ? "..." : `${(installedExtensions || []).length} Replit Extensions`}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {integrationCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="installed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Installed ({allExtensions.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories ({integrationCategories.length})</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExtensions.map((extension) => (
              <motion.div
                key={extension.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getExtensionIcon(extension)}</div>
                        <div>
                          <CardTitle className="text-lg">{extension.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            by {extension.author || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getIntegrationIcon(extension.integrationLevel || 'native')}
                        <Badge variant="outline" className="text-xs">
                          v{extension.version || '1.0.0'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {extension.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(extension.tags || []).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {(extension.tags || []).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{(extension.tags || []).length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {(extension.downloads || 0).toLocaleString()} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        {getIntegrationIcon(extension.integrationLevel || 'native')}
                        {getIntegrationLabel(extension.integrationLevel || 'native')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        variant={extension.status === 'active' ? 'default' : 'outline'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {extension.status === 'active' ? 'Active' : 'Inactive'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrationCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${category.color} text-white`}>
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.extensions.length > 0 ? (
                        category.extensions.map((ext) => (
                          <div key={ext.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{ext.icon}</span>
                              <div>
                                <p className="font-medium text-sm">{ext.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(ext.downloads || 0).toLocaleString()} downloads
                                </p>
                              </div>
                            </div>
                            {getIntegrationIcon(ext.integrationLevel)}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <p className="text-sm">No extensions in this category</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Replit Extension Marketplace</CardTitle>
              <p className="text-muted-foreground">
                Discover and install new extensions to enhance your development workflow
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold mb-2">Extension Marketplace</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Browse and install extensions from the Replit marketplace to add new capabilities to your workspace.
                </p>
                <Button>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}