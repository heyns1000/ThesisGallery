import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Play, 
  Square, 
  RefreshCw,
  Wrench,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react"
import { apiRequest } from "@/lib/queryClient"

interface ButtonIssue {
  id: string
  element: string
  selector: string
  issue_type: 'not_clickable' | 'missing_handler' | 'broken_link' | 'css_issue' | 'accessibility_violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  detected_at: string
  page_url: string
  description: string
  suggested_fix: string
  auto_repair_available: boolean
}

interface RepairAnalytics {
  total_issues_detected: number
  total_repairs_executed: number
  success_rate: string
  active_monitors: number
  latest_scan: string | null
  issues_by_severity: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export default function ButtonRepairDashboard() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const queryClient = useQueryClient()

  // Scan for button issues
  const { data: scanResults, isLoading: scanLoading } = useQuery({
    queryKey: ['/api/button-repair/scan'],
    refetchInterval: isMonitoring ? 30000 : false, // Auto-refresh when monitoring
  })

  // Get repair analytics
  const { data: analytics } = useQuery<RepairAnalytics>({
    queryKey: ['/api/button-repair/analytics'],
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  // Start monitoring mutation
  const startMonitoringMutation = useMutation({
    mutationFn: async (interval: number) => {
      return await apiRequest('/api/button-repair/start-monitoring', {
        method: 'POST',
        body: JSON.stringify({ interval_seconds: interval })
      })
    },
    onSuccess: () => {
      setIsMonitoring(true)
      queryClient.invalidateQueries({ queryKey: ['/api/button-repair/analytics'] })
    }
  })

  // Stop monitoring mutation
  const stopMonitoringMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/button-repair/stop-monitoring', {
        method: 'POST'
      })
    },
    onSuccess: () => {
      setIsMonitoring(false)
      queryClient.invalidateQueries({ queryKey: ['/api/button-repair/analytics'] })
    }
  })

  // Execute repair mutation
  const executeRepairMutation = useMutation({
    mutationFn: async (issueId: string) => {
      return await apiRequest('/api/button-repair/execute', {
        method: 'POST',
        body: JSON.stringify({ issue_id: issueId, user_confirmed: true })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/button-repair/scan'] })
      queryClient.invalidateQueries({ queryKey: ['/api/button-repair/analytics'] })
    }
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'not_clickable': return <AlertTriangle className="w-4 h-4" />
      case 'broken_link': return <AlertTriangle className="w-4 h-4" />
      case 'accessibility_violation': return <Shield className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              🔧 Dynamic Button Repair Engine
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              AI-powered button monitoring and auto-repair system with VaultMesh integration
            </p>
          </div>
          <div className="flex gap-3">
            {!isMonitoring ? (
              <Button 
                onClick={() => startMonitoringMutation.mutate(30)}
                disabled={startMonitoringMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Monitoring
              </Button>
            ) : (
              <Button 
                onClick={() => stopMonitoringMutation.mutate()}
                disabled={stopMonitoringMutation.isPending}
                variant="destructive"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Monitoring
              </Button>
            )}
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/button-repair/scan'] })}
              disabled={scanLoading}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${scanLoading ? 'animate-spin' : ''}`} />
              Scan Now
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.total_issues_detected}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.issues_by_severity.critical} critical, {analytics.issues_by_severity.high} high
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Repairs Executed</CardTitle>
                <Wrench className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.total_repairs_executed}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.success_rate} success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monitoring Status</CardTitle>
                <Zap className={`h-4 w-4 ${isMonitoring ? 'text-green-500' : 'text-gray-400'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isMonitoring ? 'Active' : 'Inactive'}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.active_monitors} active monitors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VaultMesh Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Operational</div>
                <p className="text-xs text-muted-foreground">
                  Real-time repair suggestions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="issues" className="space-y-4">
          <TabsList>
            <TabsTrigger value="issues">Detected Issues</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Button Issues Detected
                </CardTitle>
                <CardDescription>
                  Real-time scanning results with AI-powered repair suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scanLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <p>Scanning for button issues...</p>
                  </div>
                ) : scanResults?.issues?.length > 0 ? (
                  <div className="space-y-4">
                    {scanResults.issues.map((issue: ButtonIssue) => (
                      <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getIssueIcon(issue.issue_type)}
                            <div>
                              <h4 className="font-medium">{issue.element}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{issue.page_url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity.toUpperCase()}
                            </Badge>
                            {issue.auto_repair_available && (
                              <Button
                                size="sm"
                                onClick={() => executeRepairMutation.mutate(issue.id)}
                                disabled={executeRepairMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Auto-Repair
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm">{issue.description}</p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                          <strong>Suggested Fix:</strong> {issue.suggested_fix}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="font-medium mb-2">All Buttons Operational</h3>
                    <p className="text-gray-600 dark:text-gray-400">No issues detected in the latest scan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Repair Analytics</CardTitle>
                <CardDescription>Performance metrics and monitoring insights</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{analytics.issues_by_severity.critical}</div>
                        <div className="text-sm text-gray-600">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">{analytics.issues_by_severity.high}</div>
                        <div className="text-sm text-gray-600">High</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">{analytics.issues_by_severity.medium}</div>
                        <div className="text-sm text-gray-600">Medium</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{analytics.issues_by_severity.low}</div>
                        <div className="text-sm text-gray-600">Low</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">System Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Success Rate:</span>
                          <span className="font-medium text-green-600">{analytics.success_rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Scan:</span>
                          <span>{analytics.latest_scan ? new Date(analytics.latest_scan).toLocaleString() : 'Never'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monitoring:</span>
                          <span className={`font-medium ${isMonitoring ? 'text-green-600' : 'text-gray-600'}`}>
                            {isMonitoring ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Settings</CardTitle>
                <CardDescription>Configure automatic monitoring and repair settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Continuous Monitoring</h4>
                      <p className="text-sm text-gray-600">Automatically scan for issues every 30 seconds</p>
                    </div>
                    <div className="flex gap-2">
                      {!isMonitoring ? (
                        <Button 
                          onClick={() => startMonitoringMutation.mutate(30)}
                          disabled={startMonitoringMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Enable
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => stopMonitoringMutation.mutate()}
                          disabled={stopMonitoringMutation.isPending}
                          variant="destructive"
                        >
                          Disable
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-medium mb-2">VaultMesh Integration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enterprise-grade monitoring with real-time repair suggestions and FAA-X13 treaty compliance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}