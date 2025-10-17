import { useGlobalSync } from '@/hooks/useGlobalSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GlobalSyncIndicator() {
  const { syncStatus, forceSync, isOnline } = useGlobalSync();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-lg p-2">
      {/* Connection Status */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
          {isOnline ? "SYNCED" : "OFFLINE"}
        </Badge>
      </div>

      {/* Sync Count */}
      <div className="flex items-center gap-1">
        <Activity className={cn(
          "w-3 h-3",
          isOnline ? "text-green-400 animate-pulse" : "text-gray-400"
        )} />
        <span className="text-xs text-gray-300">{syncStatus.syncCount}</span>
      </div>

      {/* Last Sync Time */}
      <span className="text-xs text-gray-400">
        {new Date(syncStatus.lastSync).toLocaleTimeString()}
      </span>

      {/* Force Sync Button */}
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={forceSync}
        className="h-6 w-6 p-0"
      >
        <RefreshCw className="w-3 h-3" />
      </Button>
    </div>
  );
}