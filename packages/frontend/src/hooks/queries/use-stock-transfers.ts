'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateStockTransferInput } from '@mbg/shared';

const QUERY_KEY = ['stock-transfers'] as const;

export function useStockTransferList(params?: { page?: number; perPage?: number; status?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/stock-transfers', { params });
      return res.data;
    },
  });
}

export function useStockTransfer(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/stock-transfers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateStockTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStockTransferInput) => {
      const res = await apiClient.post('/stock-transfers', data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Permintaan transfer dibuat');
    },
  });
}

/** Aksi workflow: approve | reject | cancel | ship | receive */
export function useTransferAction(action: 'approve' | 'reject' | 'cancel' | 'ship' | 'receive') {
  const qc = useQueryClient();
  const labels: Record<typeof action, string> = {
    approve: 'Transfer disetujui',
    reject: 'Transfer ditolak',
    cancel: 'Transfer dibatalkan',
    ship: 'Transfer dikirim',
    receive: 'Transfer diterima',
  };
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body?: unknown }) => {
      const res = await apiClient.post(`/stock-transfers/${id}/${action}`, body ?? {});
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
      // Stok berubah saat ship/receive → refresh data stok
      qc.invalidateQueries({ queryKey: ['stock'] });
      qc.invalidateQueries({ queryKey: ['items'] });
      toast.success(labels[action]);
    },
  });
}
