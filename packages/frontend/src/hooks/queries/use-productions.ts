'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateProductionInput } from '@mbg/shared';

const QUERY_KEY = ['productions'] as const;

export function useProductionList(params?: { page?: number; perPage?: number; search?: string; date?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/productions', { params });
      return res.data;
    },
  });
}

export function useProduction(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/productions/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateProduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProductionInput) => {
      const res = await apiClient.post('/productions', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Produksi berhasil dicatat');
    },
  });
}

export function useCompleteProduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/productions/${id}/complete`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Produksi selesai');
    },
  });
}

export function useCheckStock(recipeId: number, qty: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'check-stock', recipeId, qty],
    queryFn: async () => {
      const res = await apiClient.get(`/productions/check-stock`, { params: { recipeId, qty } });
      return res.data.data;
    },
    enabled: !!recipeId && qty > 0,
  });
}
