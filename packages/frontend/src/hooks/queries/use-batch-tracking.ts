'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const QUERY_KEY = ['batch-tracking'] as const;

export function useBatchDashboard() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/batch-tracking/dashboard');
      return res.data.data ?? res.data;
    },
  });
}

export function useExpiringBatches(days: number = 7) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'expiring', days],
    queryFn: async () => {
      const res = await apiClient.get('/batch-tracking/expiring', { params: { days } });
      return res.data.data ?? res.data;
    },
  });
}

export function useItemBatches(itemId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'item', itemId],
    queryFn: async () => {
      const res = await apiClient.get(`/batch-tracking/item/${itemId}`);
      return res.data.data ?? res.data;
    },
    enabled: !!itemId,
  });
}

export function useFifoSuggestion(itemId: number, qty: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'fifo', itemId, qty],
    queryFn: async () => {
      const res = await apiClient.get(`/batch-tracking/fifo-suggestion/${itemId}`, { params: { qty } });
      return res.data.data ?? res.data;
    },
    enabled: !!itemId && qty > 0,
  });
}

export function useMarkExpired() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (batchId: number) => {
      const res = await apiClient.post(`/batch-tracking/mark-expired/${batchId}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Batch ditandai expired dan waste tercatat');
    },
  });
}

export function useCheckExpiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/batch-tracking/check-expiry');
      return res.data.data ?? res.data;
    },
    onSuccess: (data: { notified: number }) => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(`${data.notified} notifikasi expiry terkirim`);
    },
  });
}

export function useAutoExpire() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/batch-tracking/auto-expire');
      return res.data.data ?? res.data;
    },
    onSuccess: (data: { expired: number }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success(`${data.expired} batch expired otomatis diproses`);
    },
  });
}
