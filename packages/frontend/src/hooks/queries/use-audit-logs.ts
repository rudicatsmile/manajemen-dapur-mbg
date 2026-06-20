'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

const QUERY_KEY = ['audit-logs'] as const;

export function useAuditLogList(params?: { page?: number; perPage?: number; entity?: string; entityId?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/audit-logs', { params });
      return res.data;
    },
  });
}
