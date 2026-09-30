import { useEffect } from 'react';
import { socketClient } from '../services/websocket/socket-client';
import { useAuthStore } from '../store/auth.store';
import { useQueryClient } from '@tanstack/react-query';

export function useWebSocket() {
  const organizationId = useAuthStore((state) => state.organizationId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!organizationId) return;

    socketClient.connect();
    socketClient.joinOrg(organizationId);

    socketClient.onApplicationStatusUpdated((data) => {
      console.log('⚡ Real-time application update:', data);
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      // Keep connection active during session
    };
  }, [organizationId, queryClient]);
}
