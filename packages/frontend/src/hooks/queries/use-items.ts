'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateItemInput, UpdateItemInput } from '@mbg/shared';

const QUERY_KEY = ['items'] as const;

export function useItemList(params?: { page?: number; perPage?: number; search?: string; categoryId?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/items', { params });
      return res.data;
    },
  });
}

export function useItem(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/items/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateItemInput) => {
      const res = await apiClient.post('/items', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Item berhasil ditambahkan');
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateItemInput }) => {
      const res = await apiClient.patch(`/items/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Item berhasil diperbarui');
    },
  });
}

export function useItemMovements(id: number, params?: { page?: number; perPage?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, id, 'movements', params],
    queryFn: async () => {
      const res = await apiClient.get(`/items/${id}/movements`, { params });
      return res.data;
    },
    enabled: !!id,
  });
}
