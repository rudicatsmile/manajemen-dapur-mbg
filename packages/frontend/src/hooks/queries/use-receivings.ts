'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateReceivingInput } from '@mbg/shared';

const QUERY_KEY = ['receivings'] as const;

export function useReceivingList(params?: { page?: number; perPage?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/receivings', { params });
      return res.data;
    },
  });
}

export function useReceiving(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/receivings/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateReceiving() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReceivingInput) => {
      const res = await apiClient.post('/receivings', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Penerimaan berhasil dicatat');
    },
  });
}
