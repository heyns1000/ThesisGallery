import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  BarChart3, 
  CreditCard, 
  Shield, 
  Globe,
  Zap,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
  Eye,
  Rocket,
  Building,
  PanelRight,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CurrencyConverter } from '@/components/ui/currency-converter';
import { EnhancedSidepanel } from '@/components/enhanced-sidepanel';

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  monthlyRevenue: number;
  totalProducts: number;
}

interface XeroIntegration {
  connected: boolean;
  tenantId?: string;
  connectionStatus: string;
}

// Seedwave™ Admin Portal - Comprehensive admin interface with PayPal & Xero integration
export function SeedwaveAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 1234,
    totalOrders: 567,
    monthlyRevenue: 12345,
    totalProducts: 89
  });

  // Fetch admin panel data from backend APIs
  const { data: adminPanelStats } = useQuery({
    queryKey: ['/api/admin-panel/stats'],
    refetchInterval: 30000
  });

  const { data: adminPanelBrands } = useQuery({
    queryKey: ['/api/admin-panel/brands'],
    refetchInterval: 30000
  });
  
  // Enhanced data synchronization with comprehensive backend mirroring
  const { data: sectorBreakdown = [], refetch: refetchSectorBreakdown, isLoading: isLoadingSectorBreakdown } = useQuery({
    queryKey: ['/api/admin-panel/sector-breakdown'],
    staleTime: 0, // Real-time data sync
    gcTime: 0, // Force fresh data on every request
    refetchInterval: 5000, // Enhanced refresh every 5 seconds for real-time sync
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Enhanced real-time stats synchronization
  const { data: enhancedStats, refetch: refetchStats } = useQuery({
    queryKey: ['/api/admin-panel/enhanced-stats'],
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000,
  });

  // Complete sector data with deep integration
  const { data: allSectorsData, refetch: refetchAllSectors } = useQuery({
    queryKey: ['/api/sectors'],
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 10000,
  });

  // Comprehensive brand data with full metadata
  const { data: completeBrandsData, refetch: refetchBrands } = useQuery({
    queryKey: ['/api/brands'],
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 15000,
  });
  const [xeroIntegration, setXeroIntegration] = useState<XeroIntegration>({
    connected: false,
    connectionStatus: 'Disconnected'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [sidepanelVisible, setSidepanelVisible] = useState(false);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Fetch admin panel brands data
  const { data: adminPanelData, isLoading: isLoadingAdminData } = useQuery({
    queryKey: ['/api/admin-panel/brands'],
    refetchInterval: 30000,
  });

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      const authUser = localStorage.getItem('seedwave_admin_user');
      if (authUser) {
        setIsAuthenticated(true);
        setCurrentUser(authUser);
      }
    };

    checkAuth();
    initializeCharts();
  }, []);

  const initializeCharts = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Simple chart visualization
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(147, 197, 253, 0.8)');
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, chartRef.current.width, chartRef.current.height);
      }
    }
  };

  const handleLogin = (provider: string) => {
    // Simulate login process
    toast({
      title: `Logging in with ${provider}`,
      description: "Redirecting to authentication provider...",
    });
    
    // In real implementation, this would redirect to OAuth provider
    setTimeout(() => {
      setIsAuthenticated(true);
      setCurrentUser('admin@seedwave.com');
      localStorage.setItem('seedwave_admin_user', 'admin@seedwave.com');
      toast({
        title: "Login successful",
        description: "Welcome to Seedwave™ Admin Portal",
      });
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('seedwave_admin_user');
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of the admin portal",
    });
  };

  const connectXero = () => {
    toast({
      title: "Connecting to Xero",
      description: "Initiating OAuth flow...",
    });
    
    // Simulate Xero connection
    setTimeout(() => {
      setXeroIntegration({
        connected: true,
        tenantId: 'seedwave-tenant-123',
        connectionStatus: 'Connected'
      });
      toast({
        title: "Xero connected successfully",
        description: "Integration is now active",
      });
    }, 1500);
  };

  const fetchXeroData = async (dataType: string) => {
    if (!xeroIntegration.connected) {
      toast({
        title: "Not connected to Xero",
        description: "Please connect to Xero first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Fetching ${dataType}`,
      description: "Retrieving data from Xero API...",
    });

    // Simulate API call
    setTimeout(() => {
      toast({
        title: `${dataType} retrieved`,
        description: `Successfully fetched ${dataType} from Xero`,
      });
    }, 1000);
  };

  // Handler functions for sector actions
  const handleViewSector = (sector: any) => {
    console.log(`🔍 Viewing sector details for: ${sector.sector}`);
    toast({
      title: `Viewing ${sector.sector}`,
      description: `Core Brands: ${sector.coreBrands} | Nodes: ${sector.totalNodes} | Fee: $${sector.monthlyFee} | Tier: ${sector.tier}`,
    });
  };

  const handleDeploySector = (sector: any) => {
    console.log(`🚀 Deploying sector: ${sector.sector}`);
    toast({
      title: `Deploying ${sector.sector}`,
      description: `Initializing deployment for ${sector.totalNodes} nodes in ${sector.tier} tier`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">🦁</div>
            <CardTitle className="text-2xl font-bold">Seedwave™ Admin Portal</CardTitle>
            <CardDescription>
              Please log in with your account to access the portal.<br/>
              <span className="text-sm text-muted-foreground">✿Corebrands management & AI logic deployment center</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => handleLogin('FAA™ | Zoho')} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Building className="w-4 h-4 mr-2" />
              Login with 🦍 FAA™ | Zoho
            </Button>
            <Button 
              onClick={() => handleLogin('Google')} 
              variant="outline" 
              className="w-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              Login with Google
            </Button>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => handleLogin('Register')}>
                Sign Up
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🦁 Seedwave™ Admin Portal
              </CardTitle>
              <CardDescription className="text-lg">
                Comprehensive admin dashboard with PayPal & Xero integration
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-100 text-green-700">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">Welcome, Admin!</p>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="xero" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Xero
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Content - Integrated with Admin Panel Backend Data */}
        <TabsContent value="dashboard" className="space-y-6">
          
          {/* Admin Portal Section - 4 Access Control Buttons */}
          <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
            <CardHeader>
              <CardTitle className="text-xl font-bold">🛠️ Seedwave™ Admin Portal</CardTitle>
              <CardDescription>Core brand management & AI logic deployment center with comprehensive access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold">🔒 Loyalty Access</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold">🫂 Shareholder Access</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold">🛡️ Service Provider</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold">👥 Family Access</h4>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Brand & Subnodes */}
          <Card>
            <CardHeader>
              <CardTitle>Add Brand & Subnodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sector-select">📍 Sector</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select sector..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banking">🏦 Banking & Finance</SelectItem>
                      <SelectItem value="agriculture">🌱 Agriculture & Biotech</SelectItem>
                      <SelectItem value="creative">🖋️ Creative Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand-name">🏷️ Brand Name</Label>
                  <Input id="brand-name" placeholder="e.g. OmniCore™" className="bg-gray-700 border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="subnodes">✨ Subnodes</Label>
                  <Input id="subnodes" placeholder="e.g. VaultSync, OmniClaim" className="bg-gray-700 border-gray-600" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  ➕ Add Brand
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAA.ZONE INDEX — Expanded Table Structure with Backend Data */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>FAA.ZONE INDEX — Expanded Table Structure ({sectorBreakdown?.length || 0} sectors)</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => setSidepanelVisible(!sidepanelVisible)} variant="outline" size="sm">
                  <PanelRight className="w-4 h-4 mr-2" />
                  Database Sync Panel
                </Button>
                <Button onClick={() => refetchSectorBreakdown()} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Sector</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Brand Name</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Sub Nodes</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Monthly Fee</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Tier</th>
                      <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectorBreakdown && Array.isArray(sectorBreakdown) && sectorBreakdown.length > 0 ? sectorBreakdown.map((sector: any, index: number) => (
                      <tr key={sector.sector || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-700 p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{sector.sector}</span>
                          </div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-center">
                          <Badge variant="outline">{sector.coreBrands}</Badge>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-center">
                          <Badge variant="outline">{sector.totalNodes}</Badge>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-center">
                          <CurrencyConverter usdAmount={sector.monthlyFee} />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-center">
                          <Badge variant="default" className={
                            sector.tier === 'A++' ? "bg-purple-600" :
                            sector.tier === 'A+' ? "bg-blue-600" :
                            sector.tier === 'A' ? "bg-green-600" : "bg-gray-600"
                          }>
                            {sector.tier}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewSector(sector)}
                              data-testid={`button-view-sector-${index}`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeploySector(sector)}
                              data-testid={`button-deploy-sector-${index}`}
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Deploy
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="border border-gray-300 dark:border-gray-700 p-3 text-center text-muted-foreground">
                          {isLoadingSectorBreakdown ? (
                            <>Loading all 48 sectors from database...</>
                          ) : (
                            <>No sector data available. API Response: {JSON.stringify(sectorBreakdown)}</>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search users..." className="flex-1 bg-gray-700 border-gray-600" />
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">heynsschoeman</td>
                        <td className="p-3">heynsschoeman@gmail.com</td>
                        <td className="p-3">
                          <Badge variant="default">Owner</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Status */}
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                ⚡ Admin Status: Ready to receive input. System operational with 0.0% uptime.
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Search users..." className="flex-1" />
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'John Doe', email: 'john@seedwave.com', role: 'Admin', status: 'Active' },
                        { name: 'Jane Smith', email: 'jane@seedwave.com', role: 'Manager', status: 'Active' },
                        { name: 'Mike Johnson', email: 'mike@seedwave.com', role: 'User', status: 'Pending' },
                      ].map((user, index) => (
                        <tr key={index} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Management */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and process customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Order Processing Center</h3>
                <p className="text-muted-foreground">Advanced order management and fulfillment system</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Management */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Manage your product inventory and catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Product Management</h3>
                <p className="text-muted-foreground">Comprehensive product catalog and inventory system</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports & Analytics */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Generate various business reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Business Intelligence</h3>
                <p className="text-muted-foreground">Advanced analytics and reporting dashboard</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Xero Integration */}
        <TabsContent value="xero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xero Integration</CardTitle>
              <CardDescription>Connect and manage Xero accounting integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    xeroIntegration.connected ? "bg-green-500" : "bg-red-500"
                  )} />
                  <div>
                    <p className="font-medium">
                      {xeroIntegration.connected ? "✅ Connected to Xero!" : "❌ Not connected to Xero"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {xeroIntegration.connectionStatus}
                    </p>
                  </div>
                </div>
                {!xeroIntegration.connected && (
                  <Button onClick={connectXero} className="bg-indigo-600 hover:bg-indigo-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Connect to Xero
                  </Button>
                )}
              </div>

              {xeroIntegration.connected && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={() => fetchXeroData('Invoices')} variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Fetch Recent Invoices
                    </Button>
                    <Button onClick={() => fetchXeroData('Contacts')} variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Fetch Recent Contacts
                    </Button>
                    <Button onClick={() => fetchXeroData('Payments')} variant="outline">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Fetch Payments
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Xero Data Display</h4>
                      <p className="text-muted-foreground">
                        Click a button above to fetch Xero data. Results will appear here.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>



        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure application settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Seedwave™ Technologies" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@seedwave.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                      <SelectItem value="cet">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline">
                    Reset Settings
                  </Button>
                  <Button>
                    <Shield className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Enhanced Sidepanel for Database Synchronization */}
      <EnhancedSidepanel 
        isVisible={sidepanelVisible} 
        onToggle={() => setSidepanelVisible(!sidepanelVisible)} 
      />
    </div>
  );
}