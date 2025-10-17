import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface SyncStatus {
  isConnected: boolean;
  lastSync: string;
  syncCount: number;
  errors: string[];
}

export function useGlobalSync() {
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: true,
    lastSync: new Date().toISOString(),
    syncCount: 0,
    errors: []
  });

  // Global sync for all critical data endpoints
  const syncEndpoints = [
    '/api/sectors',
    '/api/brands',
    '/api/dashboard/stats',
    '/api/system-status',
    '/api/admin-panel/stats',
    '/api/admin-panel/brands',
    '/api/admin-panel/sector-breakdown',
    '/api/sync/complete-sync'
  ];

  // Force refresh all queries every 3 seconds for complete sync
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Invalidate all queries simultaneously for complete sync
        await Promise.all(
          syncEndpoints.map(endpoint => 
            queryClient.invalidateQueries({ queryKey: [endpoint] })
          )
        );
        
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          syncCount: prev.syncCount + 1,
          isConnected: true
        }));
      } catch (error) {
        setSyncStatus(prev => ({
          ...prev,
          isConnected: false,
          errors: [...prev.errors.slice(-4), `Sync error: ${(error as Error).message}`]
        }));
      }
    }, 3000); // Sync every 3 seconds for real-time feel

    return () => clearInterval(interval);
  }, [queryClient]);

  // Manual force sync function
  const forceSync = useCallback(async () => {
    try {
      // Force refetch all data immediately
      await queryClient.refetchQueries();
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        syncCount: prev.syncCount + 1,
        isConnected: true
      }));
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isConnected: false,
        errors: [...prev.errors.slice(-4), `Force sync error: ${(error as Error).message}`]
      }));
    }
  }, [queryClient]);

  return {
    syncStatus,
    forceSync,
    isOnline: syncStatus.isConnected
  };
}