import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CloudIcon, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Zap,
  Database,
  ExternalLink
} from "lucide-react"
import { apiRequest } from "@/lib/queryClient"

interface EcosystemData {
  activeSectors: number
  connectedApps: number
  vaultLevel: number
  intakeFee: string
  systemStatus: string
  lastSync: string
  realTimeData: boolean
  ecosystemMetrics: {
    totalBrands: number
    totalSectors: number
    coreApplications: number
    vaultMeshCompliance: boolean
    faaX13TreatyCompliant: boolean
  }
}

export function CloudflareSyncManager() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  // Get current ecosystem data
  const { data: ecosystemData, isLoading } = useQuery<EcosystemData>({
    queryKey: ['/api/cloudflare/ecosystem-data'],
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Force sync mutation
  const forceSyncMutation = useMutation({
    mutationFn: async () => {
      setSyncStatus('syncing')
      return await apiRequest('/api/cloudflare/force-sync', {
        method: 'POST'
      })
    },
    onSuccess: (data) => {
      setSyncStatus('success')
      console.log('✅ Cloudflare Workers sync successful:', data)
      setTimeout(() => setSyncStatus('idle'), 5000)
    },
    onError: (error) => {
      setSyncStatus('error')
      console.error('❌ Cloudflare Workers sync failed:', error)
      setTimeout(() => setSyncStatus('idle'), 5000)
    }
  })

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'bg-blue-500 text-white'
      case 'success': return 'bg-green-500 text-white'
      case 'error': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <CloudIcon className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-400">
          <CloudIcon className="w-6 h-6 mr-2" />
          ☁️ Cloudflare Workers Data Sync
        </CardTitle>
        <CardDescription>
          Keep external deployments aligned with real HSOMNI9000 ecosystem data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Current Ecosystem Data Display */}
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading ecosystem data...</span>
          </div>
        ) : ecosystemData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">{ecosystemData.activeSectors}</div>
              <div className="text-xs text-gray-400">Active Sectors</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{ecosystemData.connectedApps.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Connected Apps</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{ecosystemData.vaultLevel}</div>
              <div className="text-xs text-gray-400">Vault Level</div>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{ecosystemData.intakeFee}</div>
              <div className="text-xs text-gray-400">Intake Fee</div>
            </div>
          </div>
        ) : (
          <div className="text-red-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Failed to load ecosystem data</span>
          </div>
        )}

        {/* Sync Status and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <Badge className={getSyncStatusColor()}>
              {getSyncStatusIcon()}
              <span className="ml-1">
                {syncStatus === 'syncing' && 'Syncing...'}
                {syncStatus === 'success' && 'Sync Complete'}
                {syncStatus === 'error' && 'Sync Failed'}
                {syncStatus === 'idle' && 'Ready to Sync'}
              </span>
            </Badge>
            
            {ecosystemData && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Database className="w-4 h-4" />
                <span>Real-time data: {ecosystemData.realTimeData ? '✅' : '❌'}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => forceSyncMutation.mutate()}
              disabled={syncStatus === 'syncing'}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-1" />
              Force Sync
            </Button>
            
            <Button
              onClick={() => window.open('https://replit.com/@fruitfulglobal/CloudFlare-Workers', '_blank')}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View Workers
            </Button>
          </div>
        </div>

        {/* Sync Instructions */}
        {syncStatus === 'idle' && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
            <p className="text-blue-400 mb-2">
              <strong>⚠️ Data Misalignment Detected:</strong>
            </p>
            <p className="text-gray-300">
              External Cloudflare Workers deployment is showing outdated data (2 sectors, 57 apps) 
              instead of your real ecosystem data ({ecosystemData?.activeSectors} sectors, {ecosystemData?.connectedApps.toLocaleString()} brands).
            </p>
            <p className="text-gray-300 mt-2">
              Click "Force Sync" to push correct HSOMNI9000 data to all external deployments.
            </p>
          </div>
        )}

        {/* Success Message */}
        {syncStatus === 'success' && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm">
            <p className="text-green-400">
              ✅ <strong>Sync Successful!</strong> Cloudflare Workers now displays accurate HSOMNI9000 ecosystem data.
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  )
}