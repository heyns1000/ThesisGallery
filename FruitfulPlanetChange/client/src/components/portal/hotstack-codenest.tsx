import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Code, 
  Flame, 
  GitBranch, 
  Terminal, 
  Zap, 
  Database, 
  Server, 
  Globe,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Activity,
  Cpu,
  HardDrive
} from 'lucide-react';
import { COMPREHENSIVE_BRAND_DATA } from '@shared/schema';

interface Repository {
  name: string;
  url: string;
  status: 'active' | 'building' | 'inactive';
  lastDeploy: string;
  framework: string;
  branch: string;
}

interface ServiceMetrics {
  uptime: string;
  requests: number;
  latency: string;
  errorRate: string;
}

export function HotStackCodeNest() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // HotStack repository data
  const hotStackRepos: Repository[] = [
    {
      name: 'hotstack-core',
      url: 'https://hotstack.dev/core',
      status: 'active',
      lastDeploy: '2 minutes ago',
      framework: 'Node.js + Express',
      branch: 'main'
    },
    {
      name: 'hotstack-api',
      url: 'https://api.hotstack.dev',
      status: 'active',
      lastDeploy: '15 minutes ago',
      framework: 'FastAPI + Python',
      branch: 'production'
    },
    {
      name: 'hotstack-infra',
      url: 'https://infra.hotstack.dev',
      status: 'building',
      lastDeploy: '1 hour ago',
      framework: 'Terraform + AWS',
      branch: 'deploy/v2.1'
    }
  ];

  // CodeNest repository data
  const codeNestRepos: Repository[] = [
    {
      name: 'codenest-platform',
      url: 'https://codenest.dev/platform',
      status: 'active',
      lastDeploy: '5 minutes ago',
      framework: 'React + TypeScript',
      branch: 'main'
    },
    {
      name: 'codenest-compiler',
      url: 'https://compiler.codenest.dev',
      status: 'active',
      lastDeploy: '30 minutes ago',
      framework: 'Go + WebAssembly',
      branch: 'feature/wasm-opt'
    },
    {
      name: 'codenest-runtime',
      url: 'https://runtime.codenest.dev',
      status: 'inactive',
      lastDeploy: '2 days ago',
      framework: 'Rust + WebSocket',
      branch: 'staging'
    }
  ];

  // Service metrics
  const hotStackMetrics: ServiceMetrics = {
    uptime: '99.98%',
    requests: 2847291,
    latency: '23ms',
    errorRate: '0.02%'
  };

  const codeNestMetrics: ServiceMetrics = {
    uptime: '99.95%',
    requests: 1456789,
    latency: '15ms',
    errorRate: '0.05%'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'building': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'building': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Flame className="h-8 w-8 text-orange-600" />
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
                  HotStack + CodeNest Integration
                </h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                LIVE: Independent Repositories
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                HotStack Portal
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                CodeNest Portal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Service Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* HotStack Overview */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Flame className="h-8 w-8 text-orange-600" />
                  <div>
                    <CardTitle className="text-xl text-orange-900 dark:text-orange-100">HotStack</CardTitle>
                    <p className="text-sm text-orange-600 dark:text-orange-300">High-Performance Infrastructure</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-300">
                  {hotStackRepos.filter(r => r.status === 'active').length}/{hotStackRepos.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Uptime</p>
                  <p className="text-2xl font-bold text-orange-600">{hotStackMetrics.uptime}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Requests/Day</p>
                  <p className="text-2xl font-bold text-orange-600">{hotStackMetrics.requests.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Avg Latency</p>
                  <p className="text-xl font-semibold text-orange-600">{hotStackMetrics.latency}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Error Rate</p>
                  <p className="text-xl font-semibold text-orange-600">{hotStackMetrics.errorRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CodeNest Overview */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-xl text-blue-900 dark:text-blue-100">CodeNest</CardTitle>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Development Platform</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-300">
                  {codeNestRepos.filter(r => r.status === 'active').length}/{codeNestRepos.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Uptime</p>
                  <p className="text-2xl font-bold text-blue-600">{codeNestMetrics.uptime}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Requests/Day</p>
                  <p className="text-2xl font-bold text-blue-600">{codeNestMetrics.requests.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Avg Latency</p>
                  <p className="text-xl font-semibold text-blue-600">{codeNestMetrics.latency}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Error Rate</p>
                  <p className="text-xl font-semibold text-blue-600">{codeNestMetrics.errorRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repository Management */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Repository Overview</TabsTrigger>
            <TabsTrigger value="hotstack">HotStack Repos</TabsTrigger>
            <TabsTrigger value="codenest">CodeNest Repos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* HotStack Repositories Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-orange-600" />
                    HotStack Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hotStackRepos.map((repo, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(repo.status)}`} />
                          <div>
                            <p className="font-medium text-sm">{repo.name}</p>
                            <p className="text-xs text-muted-foreground">{repo.framework}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusVariant(repo.status) as any} className="text-xs">
                            {repo.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{repo.lastDeploy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CodeNest Repositories Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                    CodeNest Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {codeNestRepos.map((repo, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(repo.status)}`} />
                          <div>
                            <p className="font-medium text-sm">{repo.name}</p>
                            <p className="text-xs text-muted-foreground">{repo.framework}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusVariant(repo.status) as any} className="text-xs">
                            {repo.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{repo.lastDeploy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hotstack" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-orange-600" />
                    HotStack Repository Management
                  </CardTitle>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {hotStackRepos.map((repo, idx) => (
                    <Card key={idx} className="border-orange-200 dark:border-orange-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{repo.name}</CardTitle>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(repo.status)}`} />
                        </div>
                        <Badge variant="outline" className="w-fit text-xs">
                          {repo.framework}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Branch:</span>
                            <span className="font-medium">{repo.branch}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={getStatusVariant(repo.status) as any} className="text-xs">
                              {repo.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Deploy:</span>
                            <span className="font-medium">{repo.lastDeploy}</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            <a href={repo.url} target="_blank" rel="noopener noreferrer">
                              Visit Repository
                            </a>
                          </Button>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Play className="h-3 w-3 mr-1" />
                              Deploy
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="h-3 w-3 mr-1" />
                              Config
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codenest" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                    CodeNest Repository Management
                  </CardTitle>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {codeNestRepos.map((repo, idx) => (
                    <Card key={idx} className="border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{repo.name}</CardTitle>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(repo.status)}`} />
                        </div>
                        <Badge variant="outline" className="w-fit text-xs">
                          {repo.framework}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Branch:</span>
                            <span className="font-medium">{repo.branch}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={getStatusVariant(repo.status) as any} className="text-xs">
                              {repo.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Deploy:</span>
                            <span className="font-medium">{repo.lastDeploy}</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline" className="w-full">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            <a href={repo.url} target="_blank" rel="noopener noreferrer">
                              Visit Repository
                            </a>
                          </Button>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Play className="h-3 w-3 mr-1" />
                              Deploy
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="h-3 w-3 mr-1" />
                              Config
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}