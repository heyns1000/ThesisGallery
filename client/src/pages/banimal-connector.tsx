import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Link2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Package,
  Activity,
  Settings,
  Play,
  Database
} from 'lucide-react';

const userProfileSyncSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const userProductSyncSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  productSku: z.string().min(1, 'Product SKU is required'),
  productName: z.string().min(1, 'Product name is required'),
});

const productSyncSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
});

export default function BanimalConnector() {
  const { toast } = useToast();

  const userProfileForm = useForm({
    resolver: zodResolver(userProfileSyncSchema),
    defaultValues: {
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
    },
  });

  const userProductForm = useForm({
    resolver: zodResolver(userProductSyncSchema),
    defaultValues: {
      userId: '',
      productSku: '',
      productName: '',
    },
  });

  const productForm = useForm({
    resolver: zodResolver(productSyncSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: '',
      category: '',
    },
  });

  // Fetch connections
  const { data: connections = [], isLoading: loadingConnections } = useQuery({
    queryKey: ['/api/banimal/connections'],
  });

  // Fetch sync logs
  const { data: syncLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['/api/banimal/sync-logs'],
  });

  // Create connection mutation
  const createConnectionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/banimal/connections', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banimal/connections'] });
      toast({
        title: "Connection Created",
        description: "Banimal WordPress API connection has been configured successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create connection. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: (connectionId: string) => apiRequest(`/api/banimal/connections/${connectionId}/test`, {
      method: 'POST'
    }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/banimal/connections'] });
      toast({
        title: data.status === 'connected' ? "Connection Successful" : "Connection Failed",
        description: data.message,
        variant: data.status === 'connected' ? "default" : "destructive"
      });
    }
  });

  // Sync user profile mutation
  const syncUserProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/banimal/sync/user-profile', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banimal/sync-logs'] });
      toast({
        title: "User Profile Synced",
        description: "User profile has been synchronized successfully."
      });
      userProfileForm.reset();
    }
  });

  // Sync user-product mutation
  const syncUserProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/banimal/sync/user-product', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banimal/sync-logs'] });
      toast({
        title: "User-Product Synced",
        description: "User-product relationship has been synchronized successfully."
      });
      userProductForm.reset();
    }
  });

  // Sync product mutation
  const syncProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/banimal/sync/product', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banimal/sync-logs'] });
      toast({
        title: "Product Synced",
        description: "Product has been synchronized successfully."
      });
      productForm.reset();
    }
  });

  const activeConnection = connections[0];

  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>;
    } else if (status === 'error') {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
    } else {
      return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Disconnected</Badge>;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    if (status === 'success') {
      return <Badge className="bg-green-500">Success</Badge>;
    } else if (status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    } else {
      return <Badge variant="outline">Partial</Badge>;
    }
  };

  const onUserProfileSubmit = (values: z.infer<typeof userProfileSyncSchema>) => {
    syncUserProfileMutation.mutate({
      connectionId: activeConnection?.id,
      userId: values.userId,
      userData: {
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName
      }
    });
  };

  const onUserProductSubmit = (values: z.infer<typeof userProductSyncSchema>) => {
    syncUserProductMutation.mutate({
      connectionId: activeConnection?.id,
      userId: values.userId,
      productSku: values.productSku,
      productName: values.productName
    });
  };

  const onProductSubmit = (values: z.infer<typeof productSyncSchema>) => {
    syncProductMutation.mutate({
      connectionId: activeConnection?.id,
      productData: {
        name: values.name,
        sku: values.sku,
        price: values.price,
        category: values.category
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="text-page-title">
              Banimal Connector
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2" data-testid="text-page-description">
              Seedwave '99 Ecosystem Integration Platform
            </p>
          </div>
          <Link2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Connection Status
            </CardTitle>
            <CardDescription>
              WordPress REST API Gateway Status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingConnections ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="mt-4 text-gray-600">Loading connection status...</p>
              </div>
            ) : activeConnection ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg" data-testid="text-connection-name">{activeConnection.connectionName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-api-url">{activeConnection.apiBaseUrl}</p>
                  </div>
                  <div data-testid="badge-connection-status">
                    {getStatusBadge(activeConnection.status)}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Syncs</p>
                    <p className="text-2xl font-bold" data-testid="text-total-syncs">{activeConnection.totalSyncs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                    <p className="text-2xl font-bold text-green-600" data-testid="text-successful-syncs">{activeConnection.successfulSyncs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                    <p className="text-2xl font-bold text-red-600" data-testid="text-failed-syncs">{activeConnection.failedSyncs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
                    <p className="text-sm font-medium" data-testid="text-last-sync">
                      {activeConnection.lastSuccessfulSync 
                        ? new Date(activeConnection.lastSuccessfulSync).toLocaleString() 
                        : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => testConnectionMutation.mutate(activeConnection.id)}
                    disabled={testConnectionMutation.isPending}
                    data-testid="button-test-connection"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${testConnectionMutation.isPending ? 'animate-spin' : ''}`} />
                    Test Connection
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No connection configured</p>
                <Button 
                  onClick={() => createConnectionMutation.mutate({
                    connectionName: 'Banimal WordPress API',
                    apiBaseUrl: 'https://www.banimal.co.za/wp-json/banimal/v1',
                    apiKey: ''
                  })}
                  disabled={createConnectionMutation.isPending}
                  data-testid="button-create-connection"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Create Connection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Operations Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Operations</CardTitle>
            <CardDescription>
              Available endpoints for ecosystem intelligence synchronization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user-profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="user-profile" data-testid="tab-user-profile">
                  <Users className="w-4 h-4 mr-2" />
                  User Profile
                </TabsTrigger>
                <TabsTrigger value="user-product" data-testid="tab-user-product">
                  <Database className="w-4 h-4 mr-2" />
                  User-Product
                </TabsTrigger>
                <TabsTrigger value="product" data-testid="tab-product">
                  <Package className="w-4 h-4 mr-2" />
                  Product
                </TabsTrigger>
              </TabsList>

              {/* User Profile Sync */}
              <TabsContent value="user-profile" className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium">Endpoint: /update-user-profile</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Synchronize user profile data with WordPress
                  </p>
                </div>
                <Form {...userProfileForm}>
                  <form onSubmit={userProfileForm.handleSubmit(onUserProfileSubmit)} className="space-y-4">
                    <FormField
                      control={userProfileForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter user ID"
                              data-testid="input-user-id"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={userProfileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="user@example.com"
                                data-testid="input-email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userProfileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                data-testid="input-first-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={userProfileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              data-testid="input-last-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={!activeConnection || syncUserProfileMutation.isPending}
                      data-testid="button-sync-user-profile"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {syncUserProfileMutation.isPending ? 'Syncing...' : 'Sync User Profile'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* User-Product Sync */}
              <TabsContent value="user-product" className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium">Endpoint: /sync-user-product</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Assign products to users for license tracking
                  </p>
                </div>
                <Form {...userProductForm}>
                  <form onSubmit={userProductForm.handleSubmit(onUserProductSubmit)} className="space-y-4">
                    <FormField
                      control={userProductForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter user ID"
                              data-testid="input-up-user-id"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={userProductForm.control}
                        name="productSku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product SKU</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="PROD-12345"
                                data-testid="input-product-sku"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userProductForm.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Premium License"
                                data-testid="input-product-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!activeConnection || syncUserProductMutation.isPending}
                      data-testid="button-sync-user-product"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {syncUserProductMutation.isPending ? 'Syncing...' : 'Sync User-Product'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Product Sync */}
              <TabsContent value="product" className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm font-medium">Endpoint: /create-or-update-product</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Create or update products in the catalog
                  </p>
                </div>
                <Form {...productForm}>
                  <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Premium Product"
                                data-testid="input-p-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="PROD-12345"
                                data-testid="input-p-sku"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={productForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="99.99"
                                data-testid="input-p-price"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Software"
                                data-testid="input-p-category"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!activeConnection || syncProductMutation.isPending}
                      data-testid="button-sync-product"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {syncProductMutation.isPending ? 'Syncing...' : 'Sync Product'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sync Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Sync History
            </CardTitle>
            <CardDescription>
              Recent synchronization operations and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="mt-4 text-gray-600">Loading sync logs...</p>
              </div>
            ) : syncLogs.length === 0 ? (
              <div className="text-center py-8">
                <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No sync operations yet</p>
                <p className="text-sm text-gray-500 mt-2">Sync operations will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.map((log: any) => (
                      <TableRow key={log.id} data-testid={`row-sync-log-${log.id}`}>
                        <TableCell>
                          <Badge variant="outline">{log.syncType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{log.direction}</Badge>
                        </TableCell>
                        <TableCell>{getSyncStatusBadge(log.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-green-600">{log.recordsSuccess}</span>
                            {' / '}
                            <span className="text-gray-600">{log.recordsProcessed}</span>
                            {log.recordsFailed > 0 && (
                              <span className="text-red-600"> ({log.recordsFailed} failed)</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {log.duration ? `${log.duration}s` : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {log.startedAt ? new Date(log.startedAt).toLocaleString() : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {log.completedAt ? new Date(log.completedAt).toLocaleString() : '-'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
