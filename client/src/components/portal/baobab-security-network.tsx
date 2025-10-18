import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Lock,
  Server,
  Globe,
  Zap,
  TrendingUp,
  AlertOctagon,
  Info,
  Bell,
  RefreshCw,
  Plus
} from "lucide-react"

interface SecurityNode {
  id: string
  name: string
  status: "active" | "warning" | "critical" | "offline"
  location: string
  threats: number
  lastCheck: string
  uptime: number
}

interface SecurityAlert {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  type: string
  message: string
  timestamp: string
  node: string
  resolved: boolean
}

export function BaobabSecurityNetwork() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const { data: securityNodes = [], isLoading } = useQuery<SecurityNode[]>({
    queryKey: ["/api/security/nodes"],
    refetchInterval: 5000
  })

  const { data: securityAlerts = [] } = useQuery<SecurityAlert[]>({
    queryKey: ["/api/security/alerts"],
    refetchInterval: 10000
  })

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "offline": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "low": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "critical": return <AlertOctagon className="w-5 h-5 text-red-500" />
      case "offline": return <Activity className="w-5 h-5 text-gray-400" />
      default: return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const activeNodes = securityNodes.filter(n => n.status === "active").length
  const warningNodes = securityNodes.filter(n => n.status === "warning").length
  const criticalNodes = securityNodes.filter(n => n.status === "critical").length
  const unresolvedAlerts = securityAlerts.filter(a => !a.resolved).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2" data-testid="heading-baobab-security">
              <Shield className="w-8 h-8 text-green-500" />
              Sacred Baobab™ Security Network
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time Security Monitoring & Threat Detection
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className={unresolvedAlerts > 0 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-green-50 text-green-700 border-green-200"
              }
              data-testid="badge-security-status"
            >
              {unresolvedAlerts > 0 ? (
                <><AlertTriangle className="w-3 h-3 mr-1" />{unresolvedAlerts} Active Threats</>
              ) : (
                <><CheckCircle className="w-3 h-3 mr-1" />All Systems Secure</>
              )}
            </Badge>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
              data-testid="button-refresh-security"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Network Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Nodes</p>
                  <p className="text-2xl font-bold" data-testid="text-active-nodes">{activeNodes}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                  <p className="text-2xl font-bold" data-testid="text-warning-nodes">{warningNodes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
                  <p className="text-2xl font-bold" data-testid="text-critical-nodes">{criticalNodes}</p>
                </div>
                <AlertOctagon className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alerts</p>
                  <p className="text-2xl font-bold" data-testid="text-unresolved-alerts">{unresolvedAlerts}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Nodes */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span data-testid="heading-security-nodes">Security Nodes</span>
                  <Button size="sm" variant="outline" data-testid="button-add-node">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                  </Button>
                </CardTitle>
                <CardDescription>Monitor security nodes across the network</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-nodes">Loading security nodes...</p>
                ) : securityNodes.length > 0 ? (
                  <div className="space-y-4">
                    {securityNodes.map((node) => (
                      <div
                        key={node.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedNode(node.id)}
                        data-testid={`card-node-${node.id}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(node.status)}
                            <div>
                              <h3 className="font-medium" data-testid={`text-node-name-${node.id}`}>{node.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {node.location}
                              </p>
                            </div>
                          </div>
                          <Badge className={getNodeStatusColor(node.status)} data-testid={`badge-node-status-${node.id}`}>
                            {node.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                            <p className="font-medium" data-testid={`text-node-uptime-${node.id}`}>{node.uptime}%</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Threats:</span>
                            <p className="font-medium" data-testid={`text-node-threats-${node.id}`}>{node.threats}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Last Check:</span>
                            <p className="font-medium text-xs" data-testid={`text-node-last-check-${node.id}`}>{node.lastCheck}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Server className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-nodes">No security nodes configured</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-active-alerts">Active Alerts</CardTitle>
                <CardDescription>Recent security notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityAlerts
                    .filter(alert => !alert.resolved)
                    .slice(0, 5)
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 border rounded-lg ${getAlertSeverityColor(alert.severity)}`}
                        data-testid={`card-alert-${alert.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs" data-testid={`badge-alert-severity-${alert.id}`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs" data-testid={`text-alert-timestamp-${alert.id}`}>
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1" data-testid={`text-alert-type-${alert.id}`}>{alert.type}</h4>
                        <p className="text-xs mb-2" data-testid={`text-alert-message-${alert.id}`}>{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400" data-testid={`text-alert-node-${alert.id}`}>
                            Node: {alert.node}
                          </span>
                          <Button size="sm" variant="ghost" className="h-6 text-xs" data-testid={`button-resolve-${alert.id}`}>
                            Resolve
                          </Button>
                        </div>
                      </div>
                    ))}
                  {securityAlerts.filter(a => !a.resolved).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-no-alerts">No active alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-network-health">Network Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Overall Status</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" data-testid="badge-overall-status">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Network Latency</span>
                    <span className="font-medium" data-testid="text-network-latency">12ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Packet Loss</span>
                    <span className="font-medium" data-testid="text-packet-loss">0.01%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Encryption</span>
                    <Badge variant="outline" data-testid="badge-encryption">AES-256</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle data-testid="heading-recent-activity">Recent Security Activity</CardTitle>
            <CardDescription>Latest security events and system actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityAlerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border-b last:border-0"
                  data-testid={`row-activity-${alert.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium" data-testid={`text-activity-type-${alert.id}`}>{alert.type}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{alert.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getAlertSeverityColor(alert.severity)} data-testid={`badge-activity-severity-${alert.id}`}>
                      {alert.severity}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1" data-testid={`text-activity-time-${alert.id}`}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
