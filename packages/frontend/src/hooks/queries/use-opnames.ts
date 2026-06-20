'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateOpnameInput } from '@mbg/shared';

const QUERY_KEY = ['opnames'] as const;

export function useOpnameList(params?: { page?: number; perPage?: number; status?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/stock/opnames', { params });
      return res.data;
    },
  });
}

export function useOpname(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/opnames/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOpname() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOpnameInput) => {
      const res = await apiClient.post('/stock/opnames', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Stok opname berhasil dibuat');
    },
  });
}

export function useUpdateOpname() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateOpnameInput }) => {
      const res = await apiClient.patch(`/opnames/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Stok opname berhasil diperbarui');
    },
  });
}

export function useApproveOpname() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/opnames/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Stok opname disetujui');
    },
  });
}
