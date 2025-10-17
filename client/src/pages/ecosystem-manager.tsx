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
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'not deployed':
      case 'inactive':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'suspended':
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'syncing':
      case 'in-progress':
      case 'pending':
        return <Badge className="bg-blue-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="text-page-title">
              Ecosystem Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2" data-testid="text-page-description">
              Global FAA™ Ecosystem Intelligence Hub
            </p>
          </div>
          <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Replit Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold" data-testid="text-total-apps">{stats.totalApps}</div>
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold" data-testid="text-total-systems">{stats.totalSystems}</div>
                <Server className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Syncs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold" data-testid="text-recent-syncs">{stats.recentSyncs}</div>
                <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1" data-testid="text-category-breakdown">
                {Object.entries(stats.categoryBreakdown).slice(0, 3).map(([category, count]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{category}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="apps" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="apps" data-testid="tab-apps">
                  <Package className="w-4 h-4 mr-2" />
                  Replit Apps
                </TabsTrigger>
                <TabsTrigger value="systems" data-testid="tab-systems">
                  <Server className="w-4 h-4 mr-2" />
                  Connected Systems
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

              {/* Tab 3: Sync Logs */}
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
                          <TableHead>Records</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.slice(0, 50).map((log) => (
                          <TableRow key={log.id} data-testid={`row-sync-log-${log.id}`}>
                            <TableCell>
                              <Badge variant="outline">{log.syncType}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {log.appId && apps.find(a => a.id === log.appId)?.appName}
                              {log.systemId && systems.find(s => s.id === log.systemId)?.name}
                              {!log.appId && !log.systemId && '-'}
                            </TableCell>
                            <TableCell>{getStatusBadge(log.status)}</TableCell>
                            <TableCell>{log.recordsSynced}</TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(log.startedAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {log.completedAt 
                                ? `${Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 1000)}s`
                                : '-'
                              }
                            </TableCell>
                            <TableCell className="text-sm text-red-600">
                              {log.errorMessage || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
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
