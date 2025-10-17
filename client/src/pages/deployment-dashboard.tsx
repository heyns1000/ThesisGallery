import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Activity,
  RefreshCw,
  Download,
  Trash2,
  Upload,
  ExternalLink,
  Server,
  Database,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Globe,
  Package,
  FileText
} from 'lucide-react';

// Types
type DeploymentJob = {
  id: string;
  jobType: string;
  status: string;
  payload: any;
  result: any;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  r2Url: string | null;
};

type R2File = {
  key: string;
  size: number;
  lastModified: string;
};

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

export default function DeploymentDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('jobs');
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Fetch deployment jobs with auto-refresh
  const { data: jobs = [], isLoading: loadingJobs, refetch: refetchJobs } = useQuery<DeploymentJob[]>({
    queryKey: ['/api/orchestrate/jobs'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch R2 files
  const { data: r2Files = [], isLoading: loadingR2Files, refetch: refetchR2Files } = useQuery<R2File[]>({
    queryKey: ['/api/orchestrate/r2-files'],
  });

  // Fetch ecosystem apps
  const { data: ecosystemApps = [], isLoading: loadingEcosystem } = useQuery<EcosystemApp[]>({
    queryKey: ['/api/ecosystem/apps'],
  });

  // Delete R2 file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (objectKey: string) => {
      return apiRequest(`/api/orchestrate/r2-files/${encodeURIComponent(objectKey)}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "File Deleted",
        description: "R2 file deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orchestrate/r2-files'] });
      setFileToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      // Job updates
      if (message.type === 'job_started' || 
          message.type === 'job_progress' || 
          message.type === 'job_completed' || 
          message.type === 'job_failed') {
        queryClient.invalidateQueries({ queryKey: ['/api/orchestrate/jobs'] });
        
        if (message.type === 'job_completed') {
          toast({
            title: "Job Completed",
            description: `${message.data?.jobType || 'Job'} completed successfully`,
          });
        } else if (message.type === 'job_failed') {
          toast({
            title: "Job Failed",
            description: message.data?.error || "Job execution failed",
            variant: "destructive",
          });
        }
      }
      
      // R2 file updates
      if (message.type === 'r2_file_deleted' || message.type === 'r2_file_uploaded') {
        queryClient.invalidateQueries({ queryKey: ['/api/orchestrate/r2-files'] });
        
        if (message.type === 'r2_file_uploaded') {
          toast({
            title: "File Uploaded",
            description: "R2 file uploaded successfully",
          });
        }
      }

      // Orchestration progress events
      if (message.type === 'orchestration_progress') {
        queryClient.invalidateQueries({ queryKey: ['/api/orchestrate/jobs'] });
        
        if (message.data?.progress === 100) {
          toast({
            title: "Orchestration Complete",
            description: message.data?.message || "Operation completed successfully",
          });
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [toast]);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Check if user is admin
  const isAdmin = (user as any)?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#1a202c] text-white p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-dashboard-title">
            <Server className="inline-block w-10 h-10 mr-3 text-purple-400" />
            Deployment Coordination Dashboard
          </h1>
          <p className="text-gray-400" data-testid="text-dashboard-description">
            Real-time monitoring of active jobs, R2 storage, and ecosystem status
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700" data-testid="tabs-list">
            <TabsTrigger 
              value="jobs" 
              className="data-[state=active]:bg-purple-600"
              data-testid="tab-trigger-jobs"
            >
              <Activity className="w-4 h-4 mr-2" />
              Active Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="r2" 
              className="data-[state=active]:bg-purple-600"
              data-testid="tab-trigger-r2"
            >
              <Database className="w-4 h-4 mr-2" />
              R2 Storage
            </TabsTrigger>
            <TabsTrigger 
              value="ecosystem" 
              className="data-[state=active]:bg-purple-600"
              data-testid="tab-trigger-ecosystem"
            >
              <Globe className="w-4 h-4 mr-2" />
              Ecosystem Status
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Active Jobs */}
          <TabsContent value="jobs" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700" data-testid="card-active-jobs">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Deployment Jobs
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monitor active deployment and processing jobs
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetchJobs()}
                  data-testid="button-refresh-jobs"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loadingJobs ? (
                  <div className="flex items-center justify-center py-8" data-testid="loading-jobs">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400" data-testid="text-no-jobs">
                    No deployment jobs found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Job ID</TableHead>
                          <TableHead className="text-gray-300">Type</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                          <TableHead className="text-gray-300">Progress</TableHead>
                          <TableHead className="text-gray-300">Started At</TableHead>
                          <TableHead className="text-gray-300">R2 URL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow 
                            key={job.id} 
                            className="border-gray-700"
                            data-testid={`row-job-${job.id}`}
                          >
                            <TableCell className="font-mono text-sm" data-testid={`text-job-id-${job.id}`}>
                              {job.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell data-testid={`text-job-type-${job.id}`}>
                              <Badge variant="outline" className="bg-gray-700 text-white border-gray-600">
                                {job.jobType}
                              </Badge>
                            </TableCell>
                            <TableCell data-testid={`badge-job-status-${job.id}`}>
                              <Badge className={`${getStatusColor(job.status)} text-white flex items-center gap-1 w-fit`}>
                                {getStatusIcon(job.status)}
                                {job.status}
                              </Badge>
                            </TableCell>
                            <TableCell data-testid={`progress-job-${job.id}`}>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span>{job.progress}%</span>
                                </div>
                                <Progress 
                                  value={job.progress} 
                                  className="h-2 bg-gray-700"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-sm" data-testid={`text-job-started-${job.id}`}>
                              {job.startedAt 
                                ? formatDistanceToNow(new Date(job.startedAt), { addSuffix: true })
                                : 'Not started'
                              }
                            </TableCell>
                            <TableCell data-testid={`link-job-url-${job.id}`}>
                              {job.r2Url ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  asChild
                                  data-testid={`button-view-url-${job.id}`}
                                >
                                  <a href={job.r2Url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-gray-500">-</span>
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
          </TabsContent>

          {/* Tab 2: R2 Storage */}
          <TabsContent value="r2" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700" data-testid="card-r2-storage">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    R2 Storage Files
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage files in hotstack-bucket
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetchR2Files()}
                    data-testid="button-refresh-r2"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingR2Files ? (
                  <div className="flex items-center justify-center py-8" data-testid="loading-r2-files">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : r2Files.length === 0 ? (
                  <div className="text-center py-8 text-gray-400" data-testid="text-no-r2-files">
                    No files found in R2 bucket
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Object Key</TableHead>
                          <TableHead className="text-gray-300">Size</TableHead>
                          <TableHead className="text-gray-300">Last Modified</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {r2Files.map((file) => (
                          <TableRow 
                            key={file.key} 
                            className="border-gray-700"
                            data-testid={`row-r2-file-${file.key}`}
                          >
                            <TableCell className="font-mono text-sm" data-testid={`text-r2-key-${file.key}`}>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-400" />
                                {file.key}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`text-r2-size-${file.key}`}>
                              {formatFileSize(file.size)}
                            </TableCell>
                            <TableCell className="text-sm" data-testid={`text-r2-modified-${file.key}`}>
                              {formatDistanceToNow(new Date(file.lastModified), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                  data-testid={`button-download-${file.key}`}
                                >
                                  <a 
                                    href={`/api/hotstack/r2/download/hotstack-bucket/${file.key}`}
                                    download
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                                
                                {isAdmin && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        data-testid={`button-delete-${file.key}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-400">
                                          Are you sure you want to delete "{file.key}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-gray-700 text-white border-gray-600">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deleteFileMutation.mutate(file.key)}
                                          className="bg-red-600 hover:bg-red-700"
                                          data-testid={`button-confirm-delete-${file.key}`}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
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

          {/* Tab 3: Ecosystem Status */}
          <TabsContent value="ecosystem" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700" data-testid="card-ecosystem-status">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Ecosystem Applications
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connection status for {ecosystemApps.length} Replit apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEcosystem ? (
                  <div className="flex items-center justify-center py-8" data-testid="loading-ecosystem">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : ecosystemApps.length === 0 ? (
                  <div className="text-center py-8 text-gray-400" data-testid="text-no-ecosystem-apps">
                    No ecosystem apps found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ecosystemApps.map((app) => (
                      <Card 
                        key={app.id} 
                        className="bg-gray-900 border-gray-700"
                        data-testid={`card-ecosystem-app-${app.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-purple-400" />
                              <h3 className="font-semibold" data-testid={`text-app-name-${app.id}`}>
                                {app.appName}
                              </h3>
                            </div>
                            <Badge 
                              className={`${getStatusColor(app.status)} text-white`}
                              data-testid={`badge-app-status-${app.id}`}
                            >
                              {app.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Category:</span>
                              <span data-testid={`text-app-category-${app.id}`}>{app.category}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Last Updated:</span>
                              <span data-testid={`text-app-updated-${app.id}`}>
                                {formatDistanceToNow(new Date(app.lastUpdated), { addSuffix: true })}
                              </span>
                            </div>
                          </div>

                          {app.replitUrl && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-3"
                              asChild
                              data-testid={`button-view-app-${app.id}`}
                            >
                              <a href={app.replitUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View on Replit
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
