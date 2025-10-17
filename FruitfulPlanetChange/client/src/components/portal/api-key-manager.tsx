import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Database,
  CreditCard,
  Cloud,
  ExternalLink,
  RefreshCw
} from "lucide-react"

interface APIKey {
  id: string
  name: string
  service: string
  type: "public" | "secret" | "config"
  value: string
  status: "active" | "inactive" | "expired"
  environment: "production" | "sandbox" | "test"
  lastUsed: string
  expiresAt?: string
  description: string
  category: string
}

export function APIKeyManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  // Fetch live integration health status
  const { data: integrationHealth = [] } = useQuery<any[]>({
    queryKey: ["/api/integrations/health"],
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  // Fetch OAuth URLs
  const { data: oauthUrls = {} } = useQuery<Record<string, string>>({
    queryKey: ["/api/integrations/oauth-urls"]
  })

  // Fetch public configuration
  const { data: publicConfig = {} } = useQuery<any>({
    queryKey: ["/api/integrations/config"]
  })

  // Extracted API keys and configurations from legal documents
  const apiKeys: APIKey[] = [
    {
      id: "paypal-client-id",
      name: "PayPal Client ID",
      service: "PayPal",
      type: "public",
      value: "BAAGdPecRsf6dw_nIrWqUen0GdW0UsBZapp1Gn62xkPdD-Vqc-4lqWAidKK8LOObXux8pHJGjXknZoar6Q",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "PayPal SDK client identifier for Agriculture & Biotech payments",
      category: "payment"
    },
    {
      id: "firebase-api-key",
      name: "Firebase API Key",
      service: "Firebase",
      type: "public",
      value: "AIzaSyCR3mbgoiiCkRyaAm5BSWBWBFwut0MDCW8",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "Firebase project API key for FAA-Nexus authentication",
      category: "auth"
    },
    {
      id: "firebase-app-id",
      name: "Firebase App ID",
      service: "Firebase",
      type: "config",
      value: "1:459816542686:web:7fc0596fb70e2e6b753d4f",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "Firebase application identifier for web SDK initialization",
      category: "auth"
    },
    {
      id: "firebase-messaging-sender",
      name: "Firebase Messaging Sender ID",
      service: "Firebase",
      type: "config",
      value: "459816542686",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "Firebase Cloud Messaging sender identifier",
      category: "messaging"
    },
    {
      id: "firebase-measurement-id",
      name: "Firebase Measurement ID",
      service: "Firebase",
      type: "config",
      value: "G-S4ZB8QV782",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "Google Analytics measurement ID for Firebase project",
      category: "analytics"
    },
    {
      id: "firebase-project-id",
      name: "Firebase Project ID",
      service: "Firebase",
      type: "config",
      value: "faa-nexus",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "Firebase project identifier for Firestore and Auth",
      category: "database"
    },
    {
      id: "spotify-client-secret",
      name: "Spotify Client Secret",
      service: "Spotify",
      type: "secret",
      value: "[REDACTED - View in secure environment]",
      status: "active",
      environment: "production",
      lastUsed: "July 19, 2025",
      description: "Spotify OAuth 2.0 client secret for music integration",
      category: "oauth"
    },
    {
      id: "xero-oauth-token",
      name: "Xero OAuth Token",
      service: "Xero",
      type: "secret",
      value: "[REDACTED - Requires refresh]",
      status: "expired",
      environment: "production",
      lastUsed: "July 18, 2025",
      expiresAt: "July 20, 2025",
      description: "Xero API access token for accounting integration",
      category: "oauth"
    }
  ]

  const categories = [
    { id: "all", label: "All Keys", icon: Key },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "auth", label: "Authentication", icon: Shield },
    { id: "oauth", label: "OAuth", icon: Settings },
    { id: "database", label: "Database", icon: Database },
    { id: "messaging", label: "Messaging", icon: Cloud },
    { id: "analytics", label: "Analytics", icon: Database }
  ]

  const filteredKeys = apiKeys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         key.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         key.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || key.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    // In a real app, you'd show a toast notification here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "expired": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "sandbox": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "test": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "secret": return <Shield className="w-4 h-4 text-red-500" />
      case "public": return <Key className="w-4 h-4 text-green-500" />
      case "config": return <Settings className="w-4 h-4 text-blue-500" />
      default: return <Key className="w-4 h-4" />
    }
  }

  const maskKey = (value: string, keyType: string) => {
    if (keyType === "secret" && value.includes("[REDACTED")) {
      return value
    }
    if (keyType === "secret") {
      return "••••••••••••••••••••••••••••••••"
    }
    return value
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Seedwave™ Portal
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by VaultMesh™
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              VaultMesh™ Secured
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {apiKeys.filter(k => k.status === "expired").length} Expired
            </Badge>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh Status
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search API keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Keys</p>
                  <p className="text-2xl font-bold">{apiKeys.length}</p>
                </div>
                <Key className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Keys</p>
                  <p className="text-2xl font-bold">{apiKeys.filter(k => k.status === "active").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expired Keys</p>
                  <p className="text-2xl font-bold">{apiKeys.filter(k => k.status === "expired").length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Services</p>
                  <p className="text-2xl font-bold">{new Set(apiKeys.map(k => k.service)).size}</p>
                </div>
                <Cloud className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Live Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrationHealth.map((service: any) => (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{service.name}</h3>
                    {service.status === 'operational' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <Badge 
                    className={service.status === 'operational' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }
                  >
                    {service.status === 'operational' ? 'Connected' : 'Setup Needed'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">
                    Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                  </p>
                  {service.status === 'configuration_needed' && (
                    <p className="text-xs text-red-600 mt-1">{service.error}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* OAuth Integration Section */}
        {oauthUrls && Object.keys(oauthUrls).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">OAuth Integration Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(oauthUrls).map(([service, url]) => (
                <Card key={service}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold capitalize">{service} OAuth</h3>
                        <p className="text-sm text-gray-600">Connect your {service} account</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => window.open(url, '_blank')}
                        className="flex items-center gap-2"
                        disabled={!url || url.includes('client_id=&')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {!url || url.includes('client_id=&') ? 'Setup Required' : 'Connect'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* API Keys Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredKeys.map((key) => (
            <Card key={key.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(key.type)}
                    <div>
                      <CardTitle className="text-lg">{key.name}</CardTitle>
                      <CardDescription className="mt-1">{key.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(key.status)}>
                      {key.status}
                    </Badge>
                    <Badge className={getEnvironmentColor(key.environment)}>
                      {key.environment}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Service:</span>
                    <Badge variant="outline">{key.service}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                    <Badge variant="outline">{key.type}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Key Value:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(key.value)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono text-sm break-all">
                      {visibleKeys.has(key.id) ? key.value : maskKey(key.value, key.type)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Last Used: {key.lastUsed}</span>
                    {key.expiresAt && (
                      <span className="text-red-600">Expires: {key.expiresAt}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredKeys.length === 0 && (
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No API keys found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}