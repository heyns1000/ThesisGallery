import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SystemStatus } from "@/components/portal/system-status"
import { GlobalDashboard } from "@/components/portal/global-dashboard"
import { GlobalPulse } from "@/components/portal/global-pulse"
import { IntegrationsDashboard } from "@/components/portal/integrations-dashboard"
import { Rocket, Settings, BarChart, Zap } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

export default function PortalHome() {
  const { data: dashboardStats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  })

  const { data: systemStatus = [] } = useQuery({
    queryKey: ["/api/system-status"],
    refetchInterval: 5000,
  })

  return (
    <div className="min-h-screen bg-background" data-testid="portal-home">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent" data-testid="heading-portal">
                FruitfulPlanetChange Global Portal
              </h1>
              <p className="text-muted-foreground mt-2">
                Unified dashboard for brand management, system monitoring, and global integrations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" data-testid="badge-vaultmesh">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                VaultMesh™ Secured
              </Badge>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" data-testid="badge-live">
                Live Monitoring
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card data-testid="stat-total-elements">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Elements</p>
                    <p className="text-2xl font-bold">{((dashboardStats as any)?.totalElements || 6005).toLocaleString()}</p>
                  </div>
                  <BarChart className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="stat-core-brands">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Core Brands</p>
                    <p className="text-2xl font-bold">{((dashboardStats as any)?.coreBrands || 630).toLocaleString()}</p>
                  </div>
                  <Rocket className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="stat-sub-nodes">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sub Nodes</p>
                    <p className="text-2xl font-bold">{((dashboardStats as any)?.subNodes || 7038).toLocaleString()}</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="stat-sectors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sectors</p>
                    <p className="text-2xl font-bold">{((dashboardStats as any)?.sectors || 45).toLocaleString()}</p>
                  </div>
                  <Settings className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - System Status */}
          <div className="lg:col-span-1">
            <SystemStatus />
            
            {/* Quick Actions */}
            <Card className="mt-6" data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" data-testid="button-dashboard">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
                <Button className="w-full justify-start" variant="outline" data-testid="button-brands">
                  <Rocket className="h-4 w-4 mr-2" />
                  Manage Brands
                </Button>
                <Button className="w-full justify-start" variant="outline" data-testid="button-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Portal Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6" data-testid="tabs-portal">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="pulse" data-testid="tab-pulse">Global Pulse</TabsTrigger>
                <TabsTrigger value="integrations" data-testid="tab-integrations">Integrations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card data-testid="card-welcome">
                  <CardHeader>
                    <CardTitle className="text-2xl">Welcome to FruitfulPlanetChange Portal</CardTitle>
                    <CardDescription className="text-base">
                      Your centralized hub for managing the global Seedwave™ ecosystem
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      This portal provides comprehensive access to brand management, system monitoring, 
                      analytics, and integration tools across the entire FruitfulPlanetChange network.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card className="border-l-4 border-l-cyan-500" data-testid="feature-brand-management">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-2">Brand Management</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage {((dashboardStats as any)?.coreBrands || 630).toLocaleString()} core brands and {((dashboardStats as any)?.subNodes || 7038).toLocaleString()} sub-nodes across the ecosystem
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-green-500" data-testid="feature-system-monitoring">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-2">System Monitoring</h3>
                          <p className="text-sm text-muted-foreground">
                            Real-time status tracking for all {(systemStatus as any[]).length || 5} critical services
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-purple-500" data-testid="feature-analytics">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                          <p className="text-sm text-muted-foreground">
                            Comprehensive charts and insights across {((dashboardStats as any)?.sectors || 45).toLocaleString()} sectors
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-orange-500" data-testid="feature-integrations">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-2">Integration Hub</h3>
                          <p className="text-sm text-muted-foreground">
                            Connect with VaultMesh™, SecureSign™, and FAA.ZONE™ services
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dashboard">
                <GlobalDashboard />
              </TabsContent>

              <TabsContent value="pulse">
                <GlobalPulse />
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
