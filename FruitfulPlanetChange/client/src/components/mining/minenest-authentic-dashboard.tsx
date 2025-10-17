import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Pickaxe, 
  Activity, 
  TrendingUp, 
  Shield, 
  Zap, 
  Settings, 
  BarChart3,
  DollarSign,
  Users,
  Globe,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Database,
  MapPin,
  Wrench,
  Building,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";

interface MiningDashboardData {
  sector: {
    id: number;
    name: string;
    emoji: string;
  };
  totalBrands: number;
  totalSubnodes: number;
  totalElements: number;
  parentBrands: Array<{
    id: number;
    name: string;
    description: string;
    status: string;
    integration: string;
    metadata: {
      tier: string;
      activeRigs?: number;
      monthlyYield?: number;
      performance?: number;
      totalProjects?: number;
    };
  }>;
  subnodes: Array<{
    id: number;
    name: string;
    parentId: number;
    metadata: {
      component?: string;
      performance?: number;
    };
  }>;
  metrics: {
    totalActiveRigs: number;
    totalMonthlyYield: number;
    avgPerformance: number;
    coreSystems: number;
    integrationTier: string;
    activeBrands: number;
  };
  recentActivities: Array<{
    action: string;
    brand: string;
    timestamp: string;
    status: string;
  }>;
}

export function MineNestAuthenticDashboard() {
  // Fetch authentic mining dashboard data
  const { data: miningData, isLoading } = useQuery<MiningDashboardData>({
    queryKey: ["/api/mining/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/mining/dashboard");
      if (!response.ok) throw new Error('Failed to fetch mining dashboard');
      return response.json();
    }
  });

  // Fetch mining performance metrics
  const { data: metricsData } = useQuery({
    queryKey: ["/api/mining/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/mining/metrics");
      if (!response.ok) throw new Error('Failed to fetch mining metrics');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!miningData) {
    return (
      <div className="p-6">
        <div className="text-center text-red-400">
          Failed to load MineNest™ dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* MineNest Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Pickaxe className="w-8 h-8 text-yellow-500" />
            MineNest™ Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Comprehensive mining ecosystem with exactly 30 mining brands from HTML data - {miningData.metrics.activeBrands} active brands with 100% integration
          </p>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400">
          {miningData.metrics.integrationTier} Integration
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Total Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{miningData.totalBrands}</div>
              <p className="text-xs text-gray-400">{miningData.metrics.activeBrands} active</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Active Rigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{miningData.metrics.totalActiveRigs}</div>
              <p className="text-xs text-gray-400">Across all sites</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Core Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{miningData.metrics.coreSystems}</div>
              <p className="text-xs text-gray-400">A+ & A tier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{miningData.metrics.avgPerformance}%</div>
              <p className="text-xs text-gray-400">Average system</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">Overview</TabsTrigger>
          <TabsTrigger value="brands" className="data-[state=active]:bg-green-600">Brand Management</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-green-600">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsData?.performanceTrends ? (
                  <div className="space-y-3">
                    {metricsData.performanceTrends.slice(-3).map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-400">{trend.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${(trend.value / 6000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium">{trend.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">Loading performance data...</div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {miningData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-sm">{activity.brand}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === "active" ? "default" : "secondary"}
                          className={activity.status === "active" ? "bg-green-600" : "bg-gray-600"}
                        >
                          {activity.status}
                        </Badge>
                        <div className="text-gray-400 text-xs">{activity.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          {/* Brand Portfolio - Exact HTML Layout */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Pickaxe className="w-5 h-5" />
                  Brand Portfolio
                </CardTitle>
                <div className="text-sm">
                  Manage all brands in ⛏️ Mining & Resources
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Brand Management Tabs */}
              <div className="flex border-b border-gray-700">
                <Button variant="ghost" className="px-4 py-2 bg-green-600 text-white rounded-none">
                  Brand Management
                </Button>
                <Button variant="ghost" className="px-4 py-2 text-gray-400 hover:text-white">
                  Analytics
                </Button>
                <Button variant="ghost" className="px-4 py-2 text-gray-400 hover:text-white">
                  Settings
                </Button>
              </div>

              {/* Brand Grid - Authentic HTML Layout */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {miningData.parentBrands.slice(0, 9).map((brand) => (
                    <motion.div
                      key={brand.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-green-400 transition-all"
                    >
                      {/* Brand Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold text-sm">{brand.name}</h4>
                          <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                            {brand.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Brand Description */}
                      <p className="text-gray-300 text-xs mb-4 line-clamp-2 h-8">
                        {brand.description?.includes("submodule") ? 
                          `Specialized ${brand.name} submodule providing targeted mining operations support with advanced analytics, real-time...` :
                          `Advanced ${brand.name} mining & resources management solution with comprehensive VaultMesh™ integration, real-time ore...`
                        }
                      </p>

                      {/* Integration Badge */}
                      <div className="mb-4">
                        <span className="text-gray-400 text-xs">
                          {brand.integration}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1 text-xs rounded"
                        >
                          Core
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons Row - Exactly like HTML */}
                <div className="flex gap-4 mt-8">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg flex-1">
                    Add New Brand
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-2 rounded-lg flex-1">
                    Import Brands
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8 py-2 rounded-lg flex-1">
                    Export Portfolio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand Distribution */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Brand Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {metricsData?.statusDistribution ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Brands</span>
                      <span className="text-green-400 font-bold">{metricsData.statusDistribution.active}%</span>
                    </div>
                    <Progress value={metricsData.statusDistribution.active} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Core Systems</span>
                      <span className="text-blue-400 font-bold">{metricsData.statusDistribution.core}%</span>
                    </div>
                    <Progress value={metricsData.statusDistribution.core} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Development</span>
                      <span className="text-yellow-400 font-bold">{metricsData.statusDistribution.development}%</span>
                    </div>
                    <Progress value={metricsData.statusDistribution.development} className="h-2" />
                  </div>
                ) : (
                  <div className="text-gray-400">Loading analytics...</div>
                )}
              </CardContent>
            </Card>

            {/* Integration Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Integration Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">VaultMesh™</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">GridCore™</span>
                    <Badge className="bg-blue-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">MineCore™</span>
                    <Badge className="bg-purple-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Baobab Legal</span>
                    <Badge className="bg-yellow-600">Compliance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <MineNestSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// MineNest Settings Component - From HTML File
function MineNestSettings() {
  const { data: settingsData } = useQuery({
    queryKey: ["/api/mining/settings"],
    queryFn: async () => {
      const response = await fetch("/api/mining/settings");
      if (!response.ok) throw new Error('Failed to fetch mining settings');
      return response.json();
    }
  });

  if (!settingsData) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center text-gray-400">
          Loading MineNest™ settings...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mining Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="bg-green-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            MineNest™ Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {Object.entries(settingsData.miningConfiguration).map(([key, config]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-gray-400 text-sm">{config.description}</div>
              </div>
              <Badge className={config.enabled ? "bg-green-600" : "bg-red-600"}>
                {config.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {settingsData.performanceMetrics.systemHealth}%
              </div>
              <div className="text-gray-400 text-sm">System Health</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {settingsData.performanceMetrics.dataAccuracy}%
              </div>
              <div className="text-gray-400 text-sm">Data Accuracy</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {settingsData.performanceMetrics.uptime}%
              </div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {settingsData.performanceMetrics.responseTime}
              </div>
              <div className="text-gray-400 text-sm">Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(settingsData.integrations).map(([key, integration]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div>
                <div className="text-white font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-gray-400 text-sm">{integration.description}</div>
              </div>
              <Badge className={integration.status === "Active" ? "bg-green-600" : "bg-gray-600"}>
                {integration.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* License Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            License Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settingsData.licenses.map((license: any) => (
            <div key={license.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">{license.name}</h4>
                <Badge className="bg-green-600">{license.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-green-400 font-bold">{license.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Valid Until:</span>
                  <span className="text-white">{license.validUntil}</span>
                </div>
                <div className="mt-3">
                  <div className="text-gray-400 text-xs mb-1">Features:</div>
                  {license.features.map((feature: string, index: number) => (
                    <div key={index} className="text-gray-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}