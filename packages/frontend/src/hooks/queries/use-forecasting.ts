'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const QUERY_KEY = ['forecasting'] as const;

export function useDemandForecast(days: number = 7) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'demand', days],
    queryFn: async () => {
      const res = await apiClient.get('/forecasting/demand', { params: { days } });
      return res.data.data ?? res.data;
    },
  });
}

export function useItemForecast(itemId: number, days: number = 14) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'item', itemId, days],
    queryFn: async () => {
      const res = await apiClient.get(`/forecasting/item/${itemId}`, { params: { days } });
      return res.data.data ?? res.data;
    },
    enabled: !!itemId,
  });
}

export function useGeneratePO() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (horizonDays: number) => {
      const res = await apiClient.post('/forecasting/generate-po', { horizonDays });
      return res.data.data ?? res.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(`${data.createdPOs.length} Draft PO berhasil dibuat`);
    },
  });
}

export function useForecastAccuracy(months: number = 3) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'accuracy', months],
    queryFn: async () => {
      const res = await apiClient.get('/forecasting/accuracy', { params: { months } });
      return res.data.data ?? res.data;
    },
  });
}

export function useReconcileForecasts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/forecasting/reconcile');
      return res.data.data ?? res.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(`${data.reconciled} prediksi direkonsiliasi`);
    },
  });
}

export function useSeasonalFactors() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'seasonal-factors'],
    queryFn: async () => {
      const res = await apiClient.get('/forecasting/seasonal-factors');
      return res.data.data ?? res.data;
    },
  });
}

export function useCreateSeasonalFactor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      startDate: string;
      endDate: string;
      multiplier: number;
      scope: string;
      categoryId?: number;
      notes?: string;
    }) => {
      const res = await apiClient.post('/forecasting/seasonal-factors', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'seasonal-factors'] });
      toast.success('Faktor musiman berhasil ditambahkan');
    },
  });
}

export function useUpdateSeasonalFactor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: {
      id: number;
      data: {
        name?: string;
        startDate?: string;
        endDate?: string;
        multiplier?: number;
        scope?: string;
        categoryId?: number;
        notes?: string;
      };
    }) => {
      const res = await apiClient.patch(`/forecasting/seasonal-factors/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'seasonal-factors'] });
      toast.success('Faktor musiman berhasil diperbarui');
    },
  });
}

export function useDeleteSeasonalFactor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/forecasting/seasonal-factors/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'seasonal-factors'] });
      toast.success('Faktor musiman berhasil dihapus');
    },
  });
}
