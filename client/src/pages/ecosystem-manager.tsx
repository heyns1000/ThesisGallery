import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Server,
  Database,
  Cloud,
  Activity,
  RefreshCw,
  Plus,
  ExternalLink,
  Trash2,
  Edit,
  Search,
  Filter,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  PlayCircle,
  Package
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Types from schema
type EcosystemApp = {
  id: string;
  appName: string;
  category: string;
  status: string;
  lastUpdated: string;
  replitUrl: string;
  deploymentUrl?: string;
  metadata?: any;
};

type EcosystemSystem = {
  id: string;
  systemType: string;
  name: string;
  url: string;
  status: string;
  category?: string;
  apiEndpoint?: string;
  lastSynced?: string;
  metadata?: any;
};

type EcosystemSyncLog = {
  id: string;
  syncType: string;
  systemId?: string;
  appId?: string;
  status: string;
  recordsSynced: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  metadata?: any;
};

type BanimalConnection = {
  id: string;
  connectionName: string;
  apiBaseUrl: string;
  status: string;
  lastConnectionTest?: string;
  lastSuccessfulSync?: string;
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
};

type HotstackWorker = {
  id: string;
  workerId: string;
  name: string;
  scriptName: string;
  status: string;
  accountId: string;
  deploymentUrl?: string;
  lastDeployedAt?: string;
  createdAt: string;
};

type HotstackDeployment = {
  id: string;
  workerId?: string;
  deploymentId: string;
  version?: string;
  status: string;
  duration?: number;
  deployedAt: string;
};

type HotstackR2Storage = {
  id: string;
  bucketName: string;
  objectCount: number;
  storageSize: number;
  publicUrl?: string;
  status: string;
  lastSyncedAt?: string;
};

type HotstackStation = {
  id: string;
  stationName: string;
  location: string;
  region: string;
  status: string;
  workersCount: number;
  deploymentUrl?: string;
};

type HotstackStats = {
  totalWorkers: number;
  totalDeployments: number;
  totalR2Buckets: number;
  totalStations: number;
  totalStorageBytes: number;
  recentDeployments: HotstackDeployment[];
};

// Add system schema
const addSystemSchema = z.object({
  systemType: z.string().min(1, 'System type is required'),
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL'),
  category: z.string().optional(),
  apiEndpoint: z.string().optional(),
  connectionData: z.string().optional(),
});

export default function EcosystemManager() {
  const { toast } = useToast();
  const [isAddSystemOpen, setIsAddSystemOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Sync operations state
  const [wpProductConnectionId, setWpProductConnectionId] = useState('');
  const [wpProductIds, setWpProductIds] = useState('');
  const [wpUserConnectionId, setWpUserConnectionId] = useState('');
  const [wpUserIds, setWpUserIds] = useState('');
  const [systemSyncId, setSystemSyncId] = useState('');
  const [systemSyncType, setSystemSyncType] = useState<'full' | 'incremental'>('full');
  const [syncResults, setSyncResults] = useState<Record<string, any>>({});

  // Fetch apps
  const { data: apps = [], isLoading: loadingApps } = useQuery<EcosystemApp[]>({
    queryKey: ['/api/ecosystem/apps'],
  });

  // Fetch systems
  const { data: systems = [], isLoading: loadingSystems } = useQuery<EcosystemSystem[]>({
    queryKey: ['/api/ecosystem/systems'],
  });

  // Fetch sync logs with auto-refresh every 10 seconds
  const { data: syncLogs = [], isLoading: loadingLogs } = useQuery<EcosystemSyncLog[]>({
    queryKey: ['/api/ecosystem/sync-logs'],
    refetchInterval: 10000,
  });

  // Fetch banimal connections
  const { data: banimalConnections = [], isLoading: loadingConnections } = useQuery<BanimalConnection[]>({
    queryKey: ['/api/banimal/connections'],
  });

  // HotStack queries
  const { data: hotstackStats, isLoading: loadingHotstackStats } = useQuery<HotstackStats>({
    queryKey: ['/api/hotstack/stats'],
  });

  const { data: hotstackWorkers = [], isLoading: loadingWorkers } = useQuery<HotstackWorker[]>({
    queryKey: ['/api/hotstack/workers'],
  });

  const { data: hotstackDeployments = [], isLoading: loadingDeployments } = useQuery<HotstackDeployment[]>({
    queryKey: ['/api/hotstack/deployments'],
  });

  const { data: hotstackR2Storage = [], isLoading: loadingR2 } = useQuery<HotstackR2Storage[]>({
    queryKey: ['/api/hotstack/r2-storage'],
  });

  const { data: hotstackStations = [], isLoading: loadingStations } = useQuery<HotstackStation[]>({
    queryKey: ['/api/hotstack/stations'],
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'ecosystem_system_created' || 
          message.type === 'ecosystem_system_updated' || 
          message.type === 'ecosystem_system_deleted') {
        queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/systems'] });
        toast({
          title: "System Updated",
          description: "Ecosystem systems have been updated",
        });
      }
      
      if (message.type === 'ecosystem_sync_started') {
        queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
        toast({
          title: "Sync Started",
          description: message.data?.syncType || "Sync operation initiated",
        });
      }
      
      if (message.type === 'ecosystem_sync_completed') {
        queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
        const data = message.data;
        if (data?.metadata?.partialSuccess) {
          toast({
            title: "Sync Completed with Warnings",
            description: `${data.metadata.successCount}/${data.metadata.totalCount} succeeded - ${data.metadata.failureCount} failed`,
          });
        } else {
          toast({
            title: "Sync Completed",
            description: `${data?.syncType || 'Sync'} completed successfully`,
          });
        }
        if (data) {
          setSyncResults(prev => ({ ...prev, [data.id]: data }));
        }
      }
      
      if (message.type === 'ecosystem_sync_error') {
        queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
        toast({
          title: "Sync Failed",
          description: message.data?.errorMessage || "Sync operation failed",
          variant: "destructive",
        });
      }
      
      if (message.type === 'ecosystem_sync_log_created' || 
          message.type === 'ecosystem_sync_log_updated') {
        queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
        if (message.data?.status === 'completed') {
          toast({
            title: "Sync Completed",
            description: `${message.data.syncType} completed successfully`,
          });
        } else if (message.data?.status === 'error') {
          toast({
            title: "Sync Failed",
            description: message.data.errorMessage || "Sync failed",
            variant: "destructive",
          });
        }
      }

      // HotStack WebSocket events
      if (message.type === 'hotstack_sync_started') {
        queryClient.invalidateQueries({ queryKey: ['/api/hotstack/stats'] });
        toast({
          title: "HotStack Sync Started",
          description: `Syncing ${message.data?.type || 'resources'}...`,
        });
      }

      if (message.type === 'hotstack_sync_completed') {
        queryClient.invalidateQueries({ queryKey: ['/api/hotstack/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hotstack/workers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hotstack/r2-storage'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hotstack/deployments'] });
        const data = message.data;
        toast({
          title: "HotStack Sync Completed",
          description: `${data?.synced || 0} ${data?.type} synced successfully`,
        });
      }

      if (message.type === 'hotstack_sync_error') {
        queryClient.invalidateQueries({ queryKey: ['/api/hotstack/stats'] });
        toast({
          title: "HotStack Sync Failed",
          description: message.data?.error || "Sync operation failed",
          variant: "destructive",
        });
      }
    };

    return () => ws.close();
  }, [toast]);

  // Add system form
  const addSystemForm = useForm({
    resolver: zodResolver(addSystemSchema),
    defaultValues: {
      systemType: '',
      name: '',
      url: '',
      category: '',
      apiEndpoint: '',
      connectionData: '',
    },
  });

  // Add system mutation
  const addSystemMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data };
      if (data.connectionData) {
        try {
          payload.connectionData = JSON.parse(data.connectionData);
        } catch (e) {
          throw new Error('Invalid JSON in connection data');
        }
      }
      return apiRequest('/api/ecosystem/systems', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/systems'] });
      toast({
        title: "System Added",
        description: "New system has been added successfully."
      });
      setIsAddSystemOpen(false);
      addSystemForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add system",
        variant: "destructive"
      });
    }
  });

  // Delete system mutation
  const deleteSystemMutation = useMutation({
    mutationFn: (systemId: string) => apiRequest(`/api/ecosystem/systems/${systemId}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/systems'] });
      toast({
        title: "System Deleted",
        description: "System has been removed successfully."
      });
    }
  });

  // Sync app mutation
  const syncAppMutation = useMutation({
    mutationFn: (appId: string) => apiRequest('/api/ecosystem/sync-logs', {
      method: 'POST',
      body: JSON.stringify({
        syncType: 'app-sync',
        appId,
        status: 'in-progress',
        recordsSynced: 0,
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
      toast({
        title: "Sync Started",
        description: "App sync has been initiated."
      });
    }
  });

  // WordPress Product Sync mutation
  const syncWordPressProductsMutation = useMutation({
    mutationFn: (data: { connectionId: string; productIds: string[] }) => 
      apiRequest('/api/ecosystem/sync/wordpress-products', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
      const metadata = data.metadata || {};
      if (metadata.partialSuccess) {
        toast({
          title: "Partial Success",
          description: `Synced ${metadata.successCount}/${metadata.totalCount} products - ${metadata.failureCount} failed`,
        });
      } else {
        toast({
          title: "Sync Completed",
          description: `Successfully synced ${data.recordsSynced} products`,
        });
      }
      setSyncResults(prev => ({ ...prev, wpProducts: data }));
      setWpProductIds('');
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync products",
        variant: "destructive"
      });
    }
  });

  // WordPress User Sync mutation
  const syncWordPressUsersMutation = useMutation({
    mutationFn: (data: { connectionId: string; userIds: string[] }) => 
      apiRequest('/api/ecosystem/sync/wordpress-users', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
      const metadata = data.metadata || {};
      if (metadata.partialSuccess) {
        toast({
          title: "Partial Success",
          description: `Synced ${metadata.successCount}/${metadata.totalCount} users - ${metadata.failureCount} failed`,
        });
      } else {
        toast({
          title: "Sync Completed",
          description: `Successfully synced ${data.recordsSynced} users`,
        });
      }
      setSyncResults(prev => ({ ...prev, wpUsers: data }));
      setWpUserIds('');
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync users",
        variant: "destructive"
      });
    }
  });

  // System Sync mutation
  const syncSystemMutation = useMutation({
    mutationFn: (data: { systemId: string; syncType: 'full' | 'incremental' }) => 
      apiRequest('/api/ecosystem/sync/system', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem/sync-logs'] });
      toast({
        title: "Sync Completed",
        description: `System sync completed successfully`,
      });
      setSyncResults(prev => ({ ...prev, system: data }));
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync system",
        variant: "destructive"
      });
    }
  });

  // HotStack mutations
  const syncWorkersMutation = useMutation({
    mutationFn: () => apiRequest('/api/hotstack/sync/workers', { method: 'POST' }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/hotstack/workers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hotstack/stats'] });
      toast({
        title: "Workers Synced",
        description: `Successfully synced ${data.synced} Cloudflare Workers`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync workers",
        variant: "destructive"
      });
    }
  });

  const syncR2Mutation = useMutation({
    mutationFn: () => apiRequest('/api/hotstack/sync/r2', { method: 'POST' }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/hotstack/r2-storage'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hotstack/stats'] });
      toast({
        title: "R2 Buckets Synced",
        description: `Successfully synced ${data.synced} R2 buckets`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync R2 buckets",
        variant: "destructive"
      });
    }
  });

  const testCloudflareConnectionMutation = useMutation({
    mutationFn: () => apiRequest('/api/hotstack/test-connection'),
    onSuccess: (data: any) => {
      toast({
        title: data.success ? "Connection Successful" : "Connection Failed",
        description: data.message + (data.latency ? ` (${data.latency}ms)` : ''),
        variant: data.success ? "default" : "destructive"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Failed to test connection",
        variant: "destructive"
      });
    }
  });

  // Calculate stats
  const stats = useMemo(() => {
    const categoryBreakdown: Record<string, number> = {};
    apps.forEach(app => {
      categoryBreakdown[app.category] = (categoryBreakdown[app.category] || 0) + 1;
    });

    const recentSyncs = syncLogs.slice(0, 5).filter(log => log.status === 'completed').length;

    return {
      totalApps: apps.length,
      totalSystems: systems.length,
      recentSyncs,
      categoryBreakdown,
    };
  }, [apps, systems, syncLogs]);

  // Filter apps
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
      const matchesSearch = app.appName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, categoryFilter, searchQuery]);

  // Group apps by category
  const appsByCategory = useMemo(() => {
    const grouped: Record<string, EcosystemApp[]> = {};
    filteredApps.forEach(app => {
      if (!grouped[app.category]) {
        grouped[app.category] = [];
      }
      grouped[app.category].push(app);
    });
    return grouped;
  }, [filteredApps]);

  // Filter sync logs
  const filteredLogs = useMemo(() => {
    return syncLogs.filter(log => statusFilter === 'all' || log.status === statusFilter);
  }, [syncLogs, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
      case 'active':
      case 'completed':
        return <span className="status-badge-green inline-flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</span>;
      case 'not deployed':
      case 'inactive':
        return <Badge variant="outline" className="border-muted-foreground"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'suspended':
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'syncing':
      case 'in-progress':
      case 'pending':
        return <span className="status-badge-blue inline-flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" />{status}</span>;
      default:
        return <Badge variant="outline" className="border-muted-foreground">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'utilities':
        return '🔧';
      case 'development':
        return '💻';
      case 'real_estate':
        return '🏠';
      case 'ai_intelligence':
        return '🤖';
      case 'business_tools':
        return '💼';
      case 'creative':
        return '🎨';
      default:
        return '📦';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[hsl(203,93%,68%)] via-[hsl(142,76%,36%)] to-[hsl(43,96%,56%)] bg-clip-text text-transparent" data-testid="text-page-title">
              Ecosystem Manager
            </h1>
            <p className="text-muted-foreground mt-2" data-testid="text-page-description">
              Global FAA™ Ecosystem Intelligence Hub
            </p>
          </div>
          <Globe className="w-12 h-12 text-[hsl(203,93%,68%)]" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="energetic-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Replit Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-foreground" data-testid="text-total-apps">{stats.totalApps}</div>
                <div className="p-3 rounded-full bg-[hsl(203,93%,68%)]/20">
                  <Package className="w-6 h-6 text-[hsl(203,93%,68%)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="energetic-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Connected Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-foreground" data-testid="text-total-systems">{stats.totalSystems}</div>
                <div className="p-3 rounded-full bg-[hsl(142,76%,36%)]/20">
                  <Server className="w-6 h-6 text-[hsl(142,76%,36%)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="energetic-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Syncs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-foreground" data-testid="text-recent-syncs">{stats.recentSyncs}</div>
                <div className="p-3 rounded-full bg-[hsl(43,96%,56%)]/20">
                  <RefreshCw className="w-6 h-6 text-[hsl(43,96%,56%)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="energetic-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1" data-testid="text-category-breakdown">
                {Object.entries(stats.categoryBreakdown).slice(0, 3).map(([category, count]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{category}</span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Card className="energetic-card">
          <CardContent className="pt-6">
            <Tabs defaultValue="apps" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="apps" data-testid="tab-apps">
                  <Package className="w-4 h-4 mr-2" />
                  Replit Apps
                </TabsTrigger>
                <TabsTrigger value="systems" data-testid="tab-systems">
                  <Server className="w-4 h-4 mr-2" />
                  Connected Systems
                </TabsTrigger>
                <TabsTrigger value="sync" data-testid="tab-sync">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Operations
                </TabsTrigger>
                <TabsTrigger value="hotstack" data-testid="tab-hotstack">
                  <Cloud className="w-4 h-4 mr-2" />
                  HotStack™
                </TabsTrigger>
                <TabsTrigger value="logs" data-testid="tab-logs">
                  <Activity className="w-4 h-4 mr-2" />
                  Sync Logs
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Replit Apps */}
              <TabsContent value="apps" className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search apps..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-apps"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="ai_intelligence">AI Intelligence</SelectItem>
                      <SelectItem value="business_tools">Business Tools</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loadingApps ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(appsByCategory).map(([category, categoryApps]) => (
                      <Collapsible key={category} defaultOpen={true}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCategoryIcon(category)}</span>
                            <span className="font-semibold capitalize">{category.replace('_', ' ')}</span>
                            <Badge variant="outline">{categoryApps.length}</Badge>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryApps.map((app) => (
                              <Card key={app.id} data-testid={`card-replit-app-${app.id}`}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl">{getCategoryIcon(app.category)}</span>
                                      <CardTitle className="text-base">{app.appName}</CardTitle>
                                    </div>
                                    {getStatusBadge(app.status)}
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{app.category}</Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatDistanceToNow(new Date(app.lastUpdated), { addSuffix: true })}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => window.open(app.replitUrl, '_blank')}
                                      data-testid={`button-open-replit-${app.id}`}
                                    >
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Replit
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => syncAppMutation.mutate(app.id)}
                                      disabled={syncAppMutation.isPending}
                                      data-testid={`button-sync-app-${app.id}`}
                                    >
                                      <RefreshCw className={`w-3 h-3 mr-1 ${syncAppMutation.isPending ? 'animate-spin' : ''}`} />
                                      Sync
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Connected Systems */}
              <TabsContent value="systems" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Connected Systems</h3>
                  <Dialog open={isAddSystemOpen} onOpenChange={setIsAddSystemOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-system">
                        <Plus className="w-4 h-4 mr-2" />
                        Add System
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New System</DialogTitle>
                      </DialogHeader>
                      <Form {...addSystemForm}>
                        <form onSubmit={addSystemForm.handleSubmit((data) => addSystemMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={addSystemForm.control}
                            name="systemType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>System Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-system-type">
                                      <SelectValue placeholder="Select system type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="github-repo">GitHub Repository</SelectItem>
                                    <SelectItem value="wordpress">WordPress</SelectItem>
                                    <SelectItem value="platform-project">Platform Project</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addSystemForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="System name" {...field} data-testid="input-system-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addSystemForm.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com" {...field} data-testid="input-system-url" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addSystemForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Category" {...field} data-testid="input-system-category" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addSystemForm.control}
                            name="apiEndpoint"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>API Endpoint (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://api.example.com" {...field} data-testid="input-api-endpoint" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addSystemForm.control}
                            name="connectionData"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Connection Data JSON (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder='{"apiKey": "...", "config": {...}}'
                                    className="font-mono text-sm"
                                    rows={4}
                                    {...field}
                                    data-testid="input-connection-data"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsAddSystemOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={addSystemMutation.isPending} data-testid="button-submit-system">
                              {addSystemMutation.isPending ? 'Adding...' : 'Add System'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                {loadingSystems ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systems.map((system) => (
                      <Card key={system.id} data-testid={`card-system-${system.id}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{system.name}</CardTitle>
                              <CardDescription className="mt-1">{system.url}</CardDescription>
                            </div>
                            {getStatusBadge(system.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{system.systemType}</Badge>
                            {system.category && <Badge variant="outline">{system.category}</Badge>}
                          </div>
                          {system.lastSynced && (
                            <p className="text-sm text-gray-500">
                              Last synced: {formatDistanceToNow(new Date(system.lastSynced), { addSuffix: true })}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(system.url, '_blank')}
                              data-testid={`button-open-system-${system.id}`}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteSystemMutation.mutate(system.id)}
                              disabled={deleteSystemMutation.isPending}
                              data-testid={`button-delete-system-${system.id}`}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Sync Operations */}
              <TabsContent value="sync" className="space-y-6">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Sync Operations Control Center</h3>
                  
                  {/* WordPress Product Sync Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        WordPress Product Sync
                      </CardTitle>
                      <CardDescription>Sync selected products to WordPress system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Connection</label>
                        <Select value={wpProductConnectionId} onValueChange={setWpProductConnectionId}>
                          <SelectTrigger data-testid="select-wp-product-connection">
                            <SelectValue placeholder="Select WordPress connection" />
                          </SelectTrigger>
                          <SelectContent>
                            {banimalConnections.map((conn) => (
                              <SelectItem key={conn.id} value={conn.id}>
                                {conn.connectionName} - {conn.status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product IDs (comma-separated)</label>
                        <Textarea
                          placeholder="prod_123, prod_456, prod_789"
                          value={wpProductIds}
                          onChange={(e) => setWpProductIds(e.target.value)}
                          data-testid="input-wp-product-ids"
                          rows={3}
                        />
                      </div>
                      
                      <Button
                        onClick={() => {
                          const productIds = wpProductIds.split(',').map(id => id.trim()).filter(id => id);
                          if (!wpProductConnectionId) {
                            toast({ title: "Error", description: "Please select a connection", variant: "destructive" });
                            return;
                          }
                          if (productIds.length === 0) {
                            toast({ title: "Error", description: "Please enter at least one product ID", variant: "destructive" });
                            return;
                          }
                          syncWordPressProductsMutation.mutate({ connectionId: wpProductConnectionId, productIds });
                        }}
                        disabled={syncWordPressProductsMutation.isPending || !wpProductConnectionId || !wpProductIds}
                        data-testid="button-sync-wordpress-products"
                        className="w-full"
                      >
                        {syncWordPressProductsMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing Products...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Products to WordPress
                          </>
                        )}
                      </Button>
                      
                      {syncResults.wpProducts && (
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-medium text-blue-900 dark:text-blue-100">Sync Result</p>
                              {syncResults.wpProducts.metadata?.partialSuccess ? (
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Synced {syncResults.wpProducts.metadata.successCount}/{syncResults.wpProducts.metadata.totalCount} products - {syncResults.wpProducts.metadata.failureCount} failed
                                </p>
                              ) : (
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Successfully synced {syncResults.wpProducts.recordsSynced} products
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* WordPress User Sync Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="w-5 h-5" />
                        WordPress User Sync
                      </CardTitle>
                      <CardDescription>Sync selected users to WordPress system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Connection</label>
                        <Select value={wpUserConnectionId} onValueChange={setWpUserConnectionId}>
                          <SelectTrigger data-testid="select-wp-user-connection">
                            <SelectValue placeholder="Select WordPress connection" />
                          </SelectTrigger>
                          <SelectContent>
                            {banimalConnections.map((conn) => (
                              <SelectItem key={conn.id} value={conn.id}>
                                {conn.connectionName} - {conn.status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">User IDs (comma-separated)</label>
                        <Textarea
                          placeholder="user_123, user_456, user_789"
                          value={wpUserIds}
                          onChange={(e) => setWpUserIds(e.target.value)}
                          data-testid="input-wp-user-ids"
                          rows={3}
                        />
                      </div>
                      
                      <Button
                        onClick={() => {
                          const userIds = wpUserIds.split(',').map(id => id.trim()).filter(id => id);
                          if (!wpUserConnectionId) {
                            toast({ title: "Error", description: "Please select a connection", variant: "destructive" });
                            return;
                          }
                          if (userIds.length === 0) {
                            toast({ title: "Error", description: "Please enter at least one user ID", variant: "destructive" });
                            return;
                          }
                          syncWordPressUsersMutation.mutate({ connectionId: wpUserConnectionId, userIds });
                        }}
                        disabled={syncWordPressUsersMutation.isPending || !wpUserConnectionId || !wpUserIds}
                        data-testid="button-sync-wordpress-users"
                        className="w-full"
                      >
                        {syncWordPressUsersMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing Users...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Users to WordPress
                          </>
                        )}
                      </Button>
                      
                      {syncResults.wpUsers && (
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-medium text-blue-900 dark:text-blue-100">Sync Result</p>
                              {syncResults.wpUsers.metadata?.partialSuccess ? (
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Synced {syncResults.wpUsers.metadata.successCount}/{syncResults.wpUsers.metadata.totalCount} users - {syncResults.wpUsers.metadata.failureCount} failed
                                </p>
                              ) : (
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  Successfully synced {syncResults.wpUsers.recordsSynced} users
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* System Sync Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        System Sync
                      </CardTitle>
                      <CardDescription>Perform full or incremental system synchronization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">System</label>
                        <Select value={systemSyncId} onValueChange={setSystemSyncId}>
                          <SelectTrigger data-testid="select-system-sync">
                            <SelectValue placeholder="Select system to sync" />
                          </SelectTrigger>
                          <SelectContent>
                            {systems.map((system) => (
                              <SelectItem key={system.id} value={system.id}>
                                {system.name} ({system.systemType})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sync Type</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="syncType"
                              value="full"
                              checked={systemSyncType === 'full'}
                              onChange={(e) => setSystemSyncType(e.target.value as 'full')}
                              data-testid="radio-sync-type-full"
                              className="w-4 h-4"
                            />
                            <span>Full Sync</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="syncType"
                              value="incremental"
                              checked={systemSyncType === 'incremental'}
                              onChange={(e) => setSystemSyncType(e.target.value as 'incremental')}
                              data-testid="radio-sync-type-incremental"
                              className="w-4 h-4"
                            />
                            <span>Incremental Sync</span>
                          </label>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => {
                          if (!systemSyncId) {
                            toast({ title: "Error", description: "Please select a system", variant: "destructive" });
                            return;
                          }
                          syncSystemMutation.mutate({ systemId: systemSyncId, syncType: systemSyncType });
                        }}
                        disabled={syncSystemMutation.isPending || !systemSyncId}
                        data-testid="button-sync-system"
                        className="w-full"
                      >
                        {syncSystemMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing System...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Sync System
                          </>
                        )}
                      </Button>
                      
                      {syncResults.system && (
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-medium text-green-900 dark:text-green-100">Sync Completed</p>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                System {syncResults.system.syncType} sync completed successfully
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab 4: HotStack™ Cloudflare Integration */}
              <TabsContent value="hotstack" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-[hsl(203,93%,68%)] via-[hsl(142,76%,36%)] to-[hsl(43,96%,56%)] text-transparent bg-clip-text">
                    HotStack™ Cloudflare Dashboard
                  </h3>
                  <Button 
                    onClick={() => testCloudflareConnectionMutation.mutate()}
                    disabled={testCloudflareConnectionMutation.isPending}
                    size="sm"
                    data-testid="button-test-cloudflare"
                  >
                    {testCloudflareConnectionMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>

                {/* HotStack Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="energetic-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Workers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-foreground" data-testid="text-total-workers">
                          {loadingHotstackStats ? '...' : hotstackStats?.totalWorkers || 0}
                        </div>
                        <div className="p-3 rounded-full bg-[hsl(203,93%,68%)]/20">
                          <Cloud className="w-6 h-6 text-[hsl(203,93%,68%)]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="energetic-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Deployments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-foreground" data-testid="text-total-deployments">
                          {loadingHotstackStats ? '...' : hotstackStats?.totalDeployments || 0}
                        </div>
                        <div className="p-3 rounded-full bg-[hsl(142,76%,36%)]/20">
                          <PlayCircle className="w-6 h-6 text-[hsl(142,76%,36%)]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="energetic-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">R2 Buckets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-foreground" data-testid="text-total-r2-buckets">
                          {loadingHotstackStats ? '...' : hotstackStats?.totalR2Buckets || 0}
                        </div>
                        <div className="p-3 rounded-full bg-[hsl(43,96%,56%)]/20">
                          <Database className="w-6 h-6 text-[hsl(43,96%,56%)]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="energetic-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-foreground" data-testid="text-total-storage">
                          {loadingHotstackStats ? '...' : `${((hotstackStats?.totalStorageBytes || 0) / (1024 * 1024)).toFixed(1)} MB`}
                        </div>
                        <div className="p-3 rounded-full bg-[hsl(203,93%,68%)]/20">
                          <Server className="w-6 h-6 text-[hsl(203,93%,68%)]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sync Operations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="energetic-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Sync Workers</CardTitle>
                      <CardDescription>Sync Cloudflare Workers from your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => syncWorkersMutation.mutate()}
                        disabled={syncWorkersMutation.isPending}
                        className="w-full"
                        data-testid="button-sync-workers"
                      >
                        {syncWorkersMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing Workers...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Workers
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="energetic-card">
                    <CardHeader>
                      <CardTitle className="text-lg">Sync R2 Storage</CardTitle>
                      <CardDescription>Sync R2 bucket stats from Cloudflare</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => syncR2Mutation.mutate()}
                        disabled={syncR2Mutation.isPending}
                        className="w-full"
                        data-testid="button-sync-r2"
                      >
                        {syncR2Mutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing R2...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync R2 Buckets
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Workers Table */}
                <Card className="energetic-card">
                  <CardHeader>
                    <CardTitle>Cloudflare Workers</CardTitle>
                    <CardDescription>All deployed Cloudflare Workers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingWorkers ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : hotstackWorkers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No workers found. Click "Sync Workers" to fetch from Cloudflare.
                      </div>
                    ) : (
                      <div className="border rounded-lg">
                        <Table data-testid="table-workers">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Script</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Deployed</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hotstackWorkers.map((worker) => (
                              <TableRow key={worker.id} data-testid={`row-worker-${worker.id}`}>
                                <TableCell className="font-medium">{worker.name}</TableCell>
                                <TableCell className="text-muted-foreground">{worker.scriptName}</TableCell>
                                <TableCell>
                                  <Badge className={worker.status === 'active' ? 'gradient-badge-green' : 'gradient-badge-amber'}>
                                    {worker.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {worker.lastDeployedAt ? formatDistanceToNow(new Date(worker.lastDeployedAt), { addSuffix: true }) : 'Never'}
                                </TableCell>
                                <TableCell>
                                  {worker.deploymentUrl && (
                                    <a href={worker.deploymentUrl} target="_blank" rel="noopener noreferrer">
                                      <Button variant="ghost" size="sm" data-testid={`button-view-worker-${worker.id}`}>
                                        <ExternalLink className="w-4 h-4" />
                                      </Button>
                                    </a>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* R2 Storage Table */}
                <Card className="energetic-card">
                  <CardHeader>
                    <CardTitle>R2 Storage Buckets</CardTitle>
                    <CardDescription>Cloudflare R2 object storage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingR2 ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : hotstackR2Storage.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No R2 buckets found. Click "Sync R2 Buckets" to fetch from Cloudflare.
                      </div>
                    ) : (
                      <div className="border rounded-lg">
                        <Table data-testid="table-r2-storage">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Bucket Name</TableHead>
                              <TableHead>Objects</TableHead>
                              <TableHead>Size</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Synced</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {hotstackR2Storage.map((bucket) => (
                              <TableRow key={bucket.id} data-testid={`row-r2-${bucket.id}`}>
                                <TableCell className="font-medium">{bucket.bucketName}</TableCell>
                                <TableCell className="text-muted-foreground">{bucket.objectCount}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {(bucket.storageSize / (1024 * 1024)).toFixed(2)} MB
                                </TableCell>
                                <TableCell>
                                  <Badge className={bucket.status === 'active' ? 'gradient-badge-green' : 'gradient-badge-amber'}>
                                    {bucket.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {bucket.lastSyncedAt ? formatDistanceToNow(new Date(bucket.lastSyncedAt), { addSuffix: true }) : 'Never'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 5: Sync Logs */}
              <TabsContent value="logs" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Sync Logs</h3>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loadingLogs ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table data-testid="table-sync-logs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sync Type</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Records Synced</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.slice(0, 50).map((log) => {
                          const metadata = log.metadata || {};
                          const hasPartialSuccess = metadata.partialSuccess;
                          
                          return (
                            <TableRow key={log.id} data-testid={`row-sync-log-${log.id}`}>
                              <TableCell>
                                <Badge variant="outline">{log.syncType}</Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {log.appId && apps.find(a => a.id === log.appId)?.appName}
                                {log.systemId && systems.find(s => s.id === log.systemId)?.name}
                                {!log.appId && !log.systemId && '-'}
                              </TableCell>
                              <TableCell>
                                {hasPartialSuccess ? (
                                  <Badge className="bg-yellow-500">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Partial Success
                                  </Badge>
                                ) : (
                                  getStatusBadge(log.status)
                                )}
                              </TableCell>
                              <TableCell>
                                {hasPartialSuccess ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                      {metadata.successCount}
                                    </span>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {metadata.totalCount}
                                    </span>
                                  </div>
                                ) : (
                                  <span>{log.recordsSynced}</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(log.startedAt), { addSuffix: true })}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {log.completedAt 
                                  ? `${Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 1000)}s`
                                  : '-'
                                }
                              </TableCell>
                              <TableCell className="text-sm max-w-md">
                                {hasPartialSuccess ? (
                                  <span className="text-yellow-700 dark:text-yellow-400">
                                    {metadata.failureCount} failed - {metadata.successCount} succeeded
                                  </span>
                                ) : log.errorMessage ? (
                                  <span className="text-red-600 dark:text-red-400">{log.errorMessage}</span>
                                ) : log.status === 'completed' ? (
                                  <span className="text-green-600 dark:text-green-400">Success</span>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
