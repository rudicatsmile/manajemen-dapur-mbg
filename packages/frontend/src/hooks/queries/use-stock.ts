'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { StockAdjustmentInput } from '@mbg/shared';

const QUERY_KEY = ['stock'] as const;

export function useStockSummary(params?: { page?: number; perPage?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'summary', params],
    queryFn: async () => {
      const res = await apiClient.get('/stock/summary', { params });
      return res.data;
    },
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'low-stock'],
    queryFn: async () => {
      const res = await apiClient.get('/stock/low-stock');
      return res.data.data;
    },
  });
}

export function useStockMovements(params?: { page?: number; perPage?: number; itemId?: number; type?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'movements', params],
    queryFn: async () => {
      const res = await apiClient.get('/stock/movements', { params });
      return res.data;
    },
  });
}

export function useStockAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: StockAdjustmentInput) => {
      const res = await apiClient.post('/stock/adjustment', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Penyesuaian stok berhasil');
    },
  });
}
