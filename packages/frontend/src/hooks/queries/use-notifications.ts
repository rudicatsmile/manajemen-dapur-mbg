'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: async () => {
      const res = await apiClient.get('/notifications/count');
      return res.data.data.count as number;
    },
    refetchInterval: 30000,
  });
}

export function useNotifications(page: number = 1, unreadOnly: boolean = false) {
  return useQuery({
    queryKey: ['notifications', 'list', page, unreadOnly],
    queryFn: async () => {
      const res = await apiClient.get('/notifications', {
        params: { page, perPage: 20, unreadOnly: unreadOnly ? 'true' : undefined },
      });
      return res.data;
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/notifications/read-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
