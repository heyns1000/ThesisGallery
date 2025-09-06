import { useEffect, useCallback } from 'react';
import { wsManager } from '@/lib/websocket';

export function useWebSocket() {
  useEffect(() => {
    wsManager.connect();
    
    return () => {
      wsManager.disconnect();
    };
  }, []);

  const subscribe = useCallback((messageType: string, callback: (data: any) => void) => {
    return wsManager.subscribe(messageType, callback);
  }, []);

  const send = useCallback((message: { type: string; data: any }) => {
    wsManager.send(message);
  }, []);

  return { subscribe, send };
}
