'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateRecipeInput, UpdateRecipeInput } from '@mbg/shared';

const QUERY_KEY = ['recipes'] as const;

export function useRecipeList(params?: { page?: number; perPage?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/recipes', { params });
      return res.data;
    },
  });
}

export function useRecipe(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/recipes/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateRecipeInput) => {
      const res = await apiClient.post('/recipes', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Resep berhasil ditambahkan');
    },
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRecipeInput }) => {
      const res = await apiClient.patch(`/recipes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Resep berhasil diperbarui');
    },
  });
}

export function useDuplicateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/recipes/${id}/duplicate`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Resep berhasil diduplikasi');
    },
  });
}
