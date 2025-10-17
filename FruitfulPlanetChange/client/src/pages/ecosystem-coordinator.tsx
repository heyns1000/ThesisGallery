import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Activity, 
  Globe, 
  Zap, 
  Target,
  TrendingUp,
  RefreshCw,
  Settings,
  Eye,
  Database,
  Shield,
  Link2,
  Map,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CrossSectorHeatmap } from '@/components/heatmap/CrossSectorHeatmap';

interface EcosystemDashboard {
  totalSectors: number;
  activeSectors: number;
  totalRelationships: number;
  networkDensity: number;
  sectorBreakdown: Record<string, number>;
  integrationRoadmap: {
    totalApplications: number;
    connectedApps: number;
    pendingIntegrations: number;
    activeWebhooks: number;
    lastSync: string;
  };
  heatmapAnalytics: {
    strongestConnections: any[];
    influenceMap: Record<string, any>;
    dependencyChains: number;
    isolatedSectors: number;
  };
  ecosystemHealth: {
    systemStatus: string;
    dataIntegrity: number;
    syncStatus: string;
    lastHealthCheck: string;
  };
}

interface Application {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'deployed' | 'planned';
  type: string;
  sectors: string[];
  lastSync: string | null;
  features: string[];
  health: 'operational' | 'unknown' | 'not_deployed';
}

interface HeatmapData {
  matrix: Record<string, Record<string, any>>;
  sectors: Array<{
    id: number;
    name: string;
    emoji: string;
    influence: number;
  }>;
  analytics: {
    totalConnections: number;
    strongestConnection: number;
    averageStrength: number;
    mostInfluentialSector: string;
  };
}

export function EcosystemCoordinator() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const queryClient = useQueryClient();

  // Main ecosystem dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<EcosystemDashboard>({
    queryKey: ['/api/ecosystem/dashboard'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Application ecosystem data
  const { data: applicationsData, isLoading: appsLoading } = useQuery<{
    totalApplications: number;
    activeApplications: number;
    deployedApplications: number;
    plannedApplications: number;
    applications: Application[];
  }>({
    queryKey: ['/api/ecosystem/applications'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Heatmap analytics data
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery<HeatmapData>({
    queryKey: ['/api/ecosystem/heatmap'],
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  // Integration roadmap data
  const { data: roadmapData, isLoading: roadmapLoading } = useQuery({
    queryKey: ['/api/ecosystem/roadmap'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Strategic planning data
  const { data: strategicData, isLoading: strategicLoading } = useQuery({
    queryKey: ['/api/ecosystem/strategic-planning'],
    refetchInterval: 600000, // Refresh every 10 minutes
  });

  // Manual refresh function
  const refreshAllData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/'] });
    setLastRefresh(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'operational':
        return 'text-green-500';
      case 'deployed':
      case 'live':
        return 'text-blue-500';
      case 'planned':
      case 'unknown':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'operational':
        return <CheckCircle className="w-4 h-4" />;
      case 'deployed':
      case 'live':
        return <Activity className="w-4 h-4" />;
      case 'planned':
      case 'unknown':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🌐 Fruitful Planet Change
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Central Ecosystem Coordinator for 7+ Integrated Applications
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={refreshAllData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <div className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Active Sectors</p>
                    <p className="text-3xl font-bold">{dashboardData.activeSectors}</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Network Density</p>
                    <p className="text-3xl font-bold">{dashboardData.networkDensity}%</p>
                  </div>
                  <Network className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Connected Apps</p>
                    <p className="text-3xl font-bold">{dashboardData.integrationRoadmap.connectedApps}</p>
                  </div>
                  <Link2 className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Data Integrity</p>
                    <p className="text-3xl font-bold">{dashboardData.ecosystemHealth.dataIntegrity}%</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="strategic" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Strategic
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {dashboardLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading ecosystem dashboard...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sector Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Sector Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData && Object.entries(dashboardData.sectorBreakdown).map(([sector, count]) => (
                        <div key={sector} className="flex items-center justify-between">
                          <span className="capitalize font-medium">{sector}</span>
                          <Badge variant="secondary">{count} sectors</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Integration Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="w-5 h-5" />
                      Integration Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Total Applications</span>
                          <Badge>{dashboardData.integrationRoadmap.totalApplications}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Connected Apps</span>
                          <Badge variant="secondary">{dashboardData.integrationRoadmap.connectedApps}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pending Integrations</span>
                          <Badge variant="outline">{dashboardData.integrationRoadmap.pendingIntegrations}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Webhooks</span>
                          <Badge className="bg-green-500">{dashboardData.integrationRoadmap.activeWebhooks}</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ecosystem Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>System Status</span>
                          <Badge className={cn("flex items-center gap-1", getStatusColor(dashboardData.ecosystemHealth.systemStatus))}>
                            {getStatusIcon(dashboardData.ecosystemHealth.systemStatus)}
                            {dashboardData.ecosystemHealth.systemStatus}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Data Integrity</span>
                            <span className="font-medium">{dashboardData.ecosystemHealth.dataIntegrity}%</span>
                          </div>
                          <Progress value={dashboardData.ecosystemHealth.dataIntegrity} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sync Status</span>
                          <Badge className={cn("flex items-center gap-1", getStatusColor(dashboardData.ecosystemHealth.syncStatus))}>
                            {getStatusIcon(dashboardData.ecosystemHealth.syncStatus)}
                            {dashboardData.ecosystemHealth.syncStatus}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Network Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5" />
                      Network Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Total Relationships</span>
                          <Badge>{dashboardData.totalRelationships}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Dependency Chains</span>
                          <Badge variant="secondary">{dashboardData.heatmapAnalytics.dependencyChains}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Isolated Sectors</span>
                          <Badge variant="outline">{dashboardData.heatmapAnalytics.isolatedSectors}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Strongest Connections</span>
                          <Badge className="bg-purple-500">{dashboardData.heatmapAnalytics.strongestConnections.length}</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {appsLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Loading application ecosystem...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Applications Summary */}
                {applicationsData && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{applicationsData.totalApplications}</div>
                        <div className="text-sm text-gray-600">Total Applications</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{applicationsData.activeApplications}</div>
                        <div className="text-sm text-gray-600">Active</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{applicationsData.deployedApplications}</div>
                        <div className="text-sm text-gray-600">Deployed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{applicationsData.plannedApplications}</div>
                        <div className="text-sm text-gray-600">Planned</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Applications List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Ecosystem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applicationsData?.applications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{app.name}</h3>
                              <Badge className={cn("flex items-center gap-1", getStatusColor(app.status))}>
                                {getStatusIcon(app.status)}
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{app.type}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm">Sectors:</span>
                              <div className="flex gap-1">
                                {app.sectors.slice(0, 3).map((sector) => (
                                  <Badge key={sector} variant="outline" className="text-xs">
                                    {sector}
                                  </Badge>
                                ))}
                                {app.sectors.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{app.sectors.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Health: {app.health}</span>
                              {app.lastSync && (
                                <span>Last sync: {new Date(app.lastSync).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={app.url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Cross-Sector Heatmap Visualizer */}
          <TabsContent value="heatmap">
            <CrossSectorHeatmap />
          </TabsContent>

          <TabsContent value="roadmap">
            <Card>
              <CardHeader>
                <CardTitle>Integration Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Roadmap timeline coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strategic">
            <Card>
              <CardHeader>
                <CardTitle>Strategic Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Strategic analysis coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}