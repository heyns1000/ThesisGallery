import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Globe,
  Users,
  Activity,
  Server,
  Lock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Cloud
} from "lucide-react"

interface SystemSettings {
  id: string
  category: string
  name: string
  description: string
  value: boolean | string | number
  type: "boolean" | "string" | "number"
}

export function SeedwaveAdmin() {
  const [activeTab, setActiveTab] = useState("system")

  const { data: settings = [], isLoading } = useQuery<SystemSettings[]>({
    queryKey: ["/api/admin-panel/settings"]
  })

  const { data: systemHealth = {} } = useQuery<any>({
    queryKey: ["/api/system/health"],
    refetchInterval: 10000
  })

  const systemSettings = settings.filter(s => s.category === "system")
  const securitySettings = settings.filter(s => s.category === "security")
  const notificationSettings = settings.filter(s => s.category === "notifications")
  const integrationSettings = settings.filter(s => s.category === "integrations")

  const handleToggleSetting = (settingId: string) => {
    console.log("Toggle setting:", settingId)
  }

  const renderSettingControl = (setting: SystemSettings) => {
    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            checked={setting.value as boolean}
            onCheckedChange={() => handleToggleSetting(setting.id)}
            data-testid={`switch-setting-${setting.id}`}
          />
        )
      case "string":
        return (
          <Input
            value={setting.value as string}
            onChange={(e) => console.log("Update:", setting.id, e.target.value)}
            className="max-w-md"
            data-testid={`input-setting-${setting.id}`}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={setting.value as number}
            onChange={(e) => console.log("Update:", setting.id, e.target.value)}
            className="max-w-xs"
            data-testid={`input-number-setting-${setting.id}`}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="heading-seedwave-admin">
              Seedwave™ Admin Panel
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              System Configuration & Management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className={systemHealth.status === "healthy" 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
              }
              data-testid="badge-system-status"
            >
              {systemHealth.status === "healthy" ? (
                <><CheckCircle className="w-3 h-3 mr-1" />System Healthy</>
              ) : (
                <><AlertTriangle className="w-3 h-3 mr-1" />System Alert</>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold" data-testid="text-active-users">{systemHealth.activeUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">System Load</p>
                  <p className="text-2xl font-bold" data-testid="text-system-load">{systemHealth.cpuUsage || 0}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</p>
                  <p className="text-2xl font-bold" data-testid="text-memory-usage">{systemHealth.memoryUsage || 0}%</p>
                </div>
                <Server className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">API Requests</p>
                  <p className="text-2xl font-bold" data-testid="text-api-requests">{systemHealth.apiRequests || 0}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="system" className="flex items-center gap-2" data-testid="tab-system">
              <Settings className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2" data-testid="tab-security">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2" data-testid="tab-notifications">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2" data-testid="tab-integrations">
              <Cloud className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-system-settings">System Settings</CardTitle>
                <CardDescription>Configure core system parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-settings">Loading settings...</p>
                ) : systemSettings.length > 0 ? (
                  systemSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="flex-1">
                        <h3 className="font-medium" data-testid={`text-setting-name-${setting.id}`}>{setting.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                      </div>
                      <div>{renderSettingControl(setting)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-system-settings">No system settings available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-security-settings">Security Settings</CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-security">Loading security settings...</p>
                ) : securitySettings.length > 0 ? (
                  securitySettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-red-500" />
                          <h3 className="font-medium" data-testid={`text-security-name-${setting.id}`}>{setting.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{setting.description}</p>
                      </div>
                      <div>{renderSettingControl(setting)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-security-settings">No security settings available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-notification-settings">Notification Settings</CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-notifications">Loading notification settings...</p>
                ) : notificationSettings.length > 0 ? (
                  notificationSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-500" />
                          <h3 className="font-medium" data-testid={`text-notification-name-${setting.id}`}>{setting.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{setting.description}</p>
                      </div>
                      <div>{renderSettingControl(setting)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-notification-settings">No notification settings available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-integration-settings">Integration Settings</CardTitle>
                <CardDescription>Manage third-party integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-integrations">Loading integration settings...</p>
                ) : integrationSettings.length > 0 ? (
                  integrationSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-500" />
                          <h3 className="font-medium" data-testid={`text-integration-name-${setting.id}`}>{setting.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">{setting.description}</p>
                      </div>
                      <div>{renderSettingControl(setting)}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-integration-settings">No integration settings available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" data-testid="button-reset-settings">
            Reset to Defaults
          </Button>
          <Button data-testid="button-save-settings">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
