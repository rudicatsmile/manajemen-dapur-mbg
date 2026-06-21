'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const QUERY_KEY = ['meal-plans'] as const;
const TEMPLATE_KEY = ['meal-plan-templates'] as const;

export function useMealPlans(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/meal-plans', { params });
      return res.data;
    },
  });
}

export function useMealPlan(id: number | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/meal-plans/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateMealPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      weekStartDate: string;
      maxPortionsPerDay?: number;
      notes?: string;
      items: Array<{ recipeId: number; dayOfWeek: number; portions: number; sortOrder?: number; notes?: string }>;
    }) => {
      const res = await apiClient.post('/meal-plans', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Jadwal meal plan berhasil dibuat');
    },
  });
}

export function useUpdateMealPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: {
      id: number;
      data: {
        name?: string;
        weekStartDate?: string;
        maxPortionsPerDay?: number;
        notes?: string;
        items?: Array<{ recipeId: number; dayOfWeek: number; portions: number; sortOrder?: number; notes?: string }>;
      };
    }) => {
      const res = await apiClient.patch(`/meal-plans/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
      toast.success('Jadwal meal plan berhasil diperbarui');
    },
  });
}

export function useDeleteMealPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/meal-plans/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Jadwal meal plan berhasil dihapus');
    },
  });
}

export function useActivateMealPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/meal-plans/${id}/activate`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
      toast.success('Meal plan berhasil diaktifkan');
    },
  });
}

export function useCompleteMealPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/meal-plans/${id}/complete`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
      toast.success('Meal plan ditandai selesai');
    },
  });
}

export function useMealPlanStockCheck(id: number | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, id, 'stock-check'],
    queryFn: async () => {
      const res = await apiClient.get(`/meal-plans/${id}/stock-check`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useGenerateShoppingList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.post(`/meal-plans/${id}/generate-shopping-list`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Daftar belanja berhasil dibuat');
    },
  });
}

export function useMealPlanSuggestions(week?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'suggest', week],
    queryFn: async () => {
      const res = await apiClient.get('/meal-plans/suggest', { params: { week } });
      return res.data.data;
    },
    enabled: !!week,
  });
}

export function useMealPlanTemplates() {
  return useQuery({
    queryKey: TEMPLATE_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/meal-plans/templates');
      return res.data.data;
    },
  });
}

export function useSaveAsTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { planId: number; name: string; description?: string }) => {
      const res = await apiClient.post('/meal-plans/templates', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEMPLATE_KEY });
      toast.success('Template berhasil disimpan');
    },
  });
}

export function useApplyTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ templateId, weekStartDate }: { templateId: number; weekStartDate: string }) => {
      const res = await apiClient.post(`/meal-plans/templates/${templateId}/apply`, { weekStartDate });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Template berhasil diterapkan');
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/meal-plans/templates/${id}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEMPLATE_KEY });
      toast.success('Template berhasil dihapus');
    },
  });
}
