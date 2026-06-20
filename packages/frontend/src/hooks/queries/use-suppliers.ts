'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateSupplierInput, UpdateSupplierInput } from '@mbg/shared';

const QUERY_KEY = ['suppliers'] as const;

export function useSupplierList(params?: { page?: number; perPage?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/suppliers', { params });
      return res.data;
    },
  });
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/suppliers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSupplierInput) => {
      const res = await apiClient.post('/suppliers', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Supplier berhasil ditambahkan');
    },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSupplierInput }) => {
      const res = await apiClient.patch(`/suppliers/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Supplier berhasil diperbarui');
    },
  });
}
