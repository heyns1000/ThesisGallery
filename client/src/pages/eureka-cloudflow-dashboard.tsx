import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Cloud, Zap, Play, Square, Settings, Globe, 
  BarChart3, Clock, CheckCircle, AlertCircle,
  Rocket, Database, Link, RefreshCw
} from "lucide-react";

interface CloudflowStatus {
  isRunning: boolean;
  config: {
    sectors: string[];
    templates: string[];
    autoDeployToCDN: boolean;
  };
}

interface GenerationResult {
  success: boolean;
  generated: number;
  path: string;
  sitemapPath: string;
  vaultHashes: string[];
  deployment?: {
    success: boolean;
    deployUrl?: string;
    error?: string;
  };
  timestamp: string;
}

export default function EurekaCloudflowDashboard() {
  const [status, setStatus] = useState<CloudflowStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sector, setSector] = useState('agriculture');
  const [template, setTemplate] = useState('croplink');
  const [count, setCount] = useState(400);
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [lastGeneration, setLastGeneration] = useState<GenerationResult | null>(null);

  const sectors = ['agriculture', 'education', 'housing', 'wildlife', 'fintech', 'healthcare', 'energy'];
  const templates = ['croplink', 'smart-toys', 'real-estate', 'grid-nodes', 'payment-hub', 'medical-ai', 'solar-grid'];

  useEffect(() => {
    fetchCloudflowStatus();
  }, []);

  const fetchCloudflowStatus = async () => {
    try {
      const response = await fetch('/api/cloudflow/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch Cloudflow status:', error);
    }
  };

  const startCloudflow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cloudflow/start', { method: 'POST' });
      if (response.ok) {
        await fetchCloudflowStatus();
      }
    } catch (error) {
      console.error('Failed to start Cloudflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCloudflow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cloudflow/stop', { method: 'POST' });
      if (response.ok) {
        await fetchCloudflowStatus();
      }
    } catch (error) {
      console.error('Failed to stop Cloudflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sector, 
          page: template, 
          count: Math.min(count, 1000),
          autoDeploy 
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setLastGeneration(result);
      }
    } catch (error) {
      console.error('Failed to generate pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const bindSectorToCDN = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cloudflow/bind-sector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, template })
      });
      
      if (response.ok) {
        await fetchCloudflowStatus();
      }
    } catch (error) {
      console.error('Failed to bind sector to CDN:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900" data-testid="eureka-cloudflow-dashboard">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🌊⚡</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Eureka Cloudflow Dashboard
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            High-speed page generation engine with automated CDN deployment and 
            continuous sector synchronization across the FAA™ ecosystem.
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Cloud className="h-6 w-6 mr-3" />
              Cloudflow Status
              <Button 
                onClick={fetchCloudflowStatus} 
                variant="outline" 
                size="sm" 
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${status?.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                  {status?.isRunning ? <CheckCircle className="h-12 w-12 mx-auto" /> : <AlertCircle className="h-12 w-12 mx-auto" />}
                </div>
                <p className="text-lg font-semibold mt-2">
                  {status?.isRunning ? 'Running' : 'Stopped'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {status?.config?.sectors?.length || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Sectors</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {status?.config?.autoDeployToCDN ? 'Enabled' : 'Disabled'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto-Deploy CDN</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
              {!status?.isRunning ? (
                <Button 
                  onClick={startCloudflow} 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Cloudflow
                </Button>
              ) : (
                <Button 
                  onClick={stopCloudflow} 
                  disabled={isLoading}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Cloudflow
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Page Generation Control */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Rocket className="h-6 w-6 mr-3" />
              Eureka Page Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Sector</label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Template</label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Page Count</label>
                <Input 
                  type="number" 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))}
                  min="1" 
                  max="1000"
                />
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={autoDeploy} 
                    onChange={(e) => setAutoDeploy(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Auto-Deploy to CDN</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={generatePages} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate {count} Pages
              </Button>
              
              <Button 
                onClick={bindSectorToCDN} 
                disabled={isLoading}
                variant="outline"
              >
                <Link className="h-4 w-4 mr-2" />
                Bind {sector}/{template} to CDN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Generation Results */}
        {lastGeneration && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <BarChart3 className="h-6 w-6 mr-3" />
                Last Generation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {lastGeneration.generated}
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-300">Pages Generated</p>
                </div>
                
                <div className="text-center bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <div className="text-sm font-bold text-blue-600 break-all">
                    {lastGeneration.path}
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">Output Path</p>
                </div>
                
                <div className="text-center bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {lastGeneration.vaultHashes.length}
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-300">Vault Hashes</p>
                </div>
                
                <div className="text-center bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                  <Badge 
                    variant={lastGeneration.deployment?.success ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {lastGeneration.deployment?.success ? 'CDN Deployed' : 'CDN Failed'}
                  </Badge>
                  <p className="text-sm text-orange-800 dark:text-orange-300 mt-2">
                    {lastGeneration.deployment?.deployUrl || 'No deployment'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Generated: {new Date(lastGeneration.timestamp).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Automation Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Settings className="h-6 w-6 mr-3" />
              Automation Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">Scheduled Generation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated page generation based on cron schedules and sector priorities.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-lg">
                <Globe className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">CDN Integration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatic deployment to CDN with cache invalidation and DNS management.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 p-6 rounded-lg">
                <Database className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">Vault Integrity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Every page includes vault hashes for integrity verification and treaty compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}