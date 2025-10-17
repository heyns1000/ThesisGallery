import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Shield, Globe, Bell, Database, Key, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState({
    displayName: "Fruitful Admin",
    email: "admin@fruitfulcratedance.com",
    timezone: "Africa/Johannesburg",
    language: "en",
    notifications: true,
    darkMode: true,
    autoSave: true
  })

  const [dnsSettings, setDnsSettings] = useState({
    primaryDns: "8.8.8.8",
    secondaryDns: "8.8.4.4",
    customDomain: "www.fruitfulcratedance.com",
    sslEnabled: true,
    cdnEnabled: true
  })

  const [systemSettings, setSystemSettings] = useState({
    cacheTimeout: "300",
    maxConnections: "1000",
    debugMode: false,
    maintenanceMode: false,
    backupEnabled: true,
    compressionEnabled: true
  })

  const { toast } = useToast()

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings Updated",
      description: `${section} settings have been saved successfully.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-muted-foreground">
            Configure user preferences, DNS, system parameters, and security settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
          <TabsTrigger value="dns" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            DNS & Domain
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* User Settings */}
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={userSettings.displayName}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={userSettings.timezone} onValueChange={(value) => setUserSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={userSettings.language} onValueChange={(value) => setUserSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="af">Afrikaans</SelectItem>
                      <SelectItem value="zu">Zulu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts for system events</p>
                    </div>
                    <Switch
                      checked={userSettings.notifications}
                      onCheckedChange={(checked) => setUserSettings(prev => ({ ...prev, notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme interface</p>
                    </div>
                    <Switch
                      checked={userSettings.darkMode}
                      onCheckedChange={(checked) => setUserSettings(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto Save</Label>
                      <p className="text-sm text-muted-foreground">Automatically save changes</p>
                    </div>
                    <Switch
                      checked={userSettings.autoSave}
                      onCheckedChange={(checked) => setUserSettings(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("User")} className="w-full">
                Save User Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DNS & Domain Settings */}
        <TabsContent value="dns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                DNS & Domain Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryDns">Primary DNS Server</Label>
                  <Input
                    id="primaryDns"
                    value={dnsSettings.primaryDns}
                    onChange={(e) => setDnsSettings(prev => ({ ...prev, primaryDns: e.target.value }))}
                    placeholder="8.8.8.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryDns">Secondary DNS Server</Label>
                  <Input
                    id="secondaryDns"
                    value={dnsSettings.secondaryDns}
                    onChange={(e) => setDnsSettings(prev => ({ ...prev, secondaryDns: e.target.value }))}
                    placeholder="8.8.4.4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  value={dnsSettings.customDomain}
                  onChange={(e) => setDnsSettings(prev => ({ ...prev, customDomain: e.target.value }))}
                  placeholder="www.fruitfulcratedance.com"
                />
                <p className="text-sm text-muted-foreground">
                  Primary domain for the Fruitful Crate Dance platform
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Domain Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SSL/TLS Encryption</Label>
                      <p className="text-sm text-muted-foreground">Enable HTTPS for secure connections</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={dnsSettings.sslEnabled}
                        onCheckedChange={(checked) => setDnsSettings(prev => ({ ...prev, sslEnabled: checked }))}
                      />
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>CDN Acceleration</Label>
                      <p className="text-sm text-muted-foreground">Content delivery network optimization</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={dnsSettings.cdnEnabled}
                        onCheckedChange={(checked) => setDnsSettings(prev => ({ ...prev, cdnEnabled: checked }))}
                      />
                      <Badge variant="outline" className="text-blue-600">Global</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("DNS")} className="w-full">
                Save DNS Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
                  <Input
                    id="cacheTimeout"
                    value={systemSettings.cacheTimeout}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, cacheTimeout: e.target.value }))}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">Max Connections</Label>
                  <Input
                    id="maxConnections"
                    value={systemSettings.maxConnections}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxConnections: e.target.value }))}
                    type="number"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Toggles</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed logging and debugging</p>
                    </div>
                    <Switch
                      checked={systemSettings.debugMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, debugMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Automated Backups</Label>
                      <p className="text-sm text-muted-foreground">Enable automatic data backups</p>
                    </div>
                    <Switch
                      checked={systemSettings.backupEnabled}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, backupEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Response Compression</Label>
                      <p className="text-sm text-muted-foreground">Enable gzip compression for responses</p>
                    </div>
                    <Switch
                      checked={systemSettings.compressionEnabled}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, compressionEnabled: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("System")} className="w-full">
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & API Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">API Keys Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">PayPal API</Label>
                      <p className="text-sm text-muted-foreground">Payment processing</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Stripe API</Label>
                      <p className="text-sm text-muted-foreground">Secondary payments</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Firebase</Label>
                      <p className="text-sm text-muted-foreground">Authentication & database</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">VaultMesh™</Label>
                      <p className="text-sm text-muted-foreground">Security infrastructure</p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">Secured</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enhanced account security</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Badge variant="outline">30 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600">Configured</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => handleSaveSettings("Security")} className="flex-1">
                  Save Security Settings
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Manage API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}