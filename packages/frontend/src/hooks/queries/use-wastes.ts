'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateWasteInput } from '@mbg/shared';

const QUERY_KEY = ['wastes'] as const;

export function useWasteList(params?: { page?: number; perPage?: number; category?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/wastes', { params });
      return res.data;
    },
  });
}

export function useCreateWaste() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateWasteInput) => {
      const res = await apiClient.post('/wastes', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Waste berhasil dicatat');
    },
  });
}
