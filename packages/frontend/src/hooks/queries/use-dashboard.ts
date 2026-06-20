'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/summary');
      return res.data.data;
    },
  });
}

export function useLowStockCount() {
  return useQuery({
    queryKey: ['dashboard', 'low-stock-count'],
    queryFn: async () => {
      const res = await apiClient.get('/stock/low-stock');
      return res.data.data?.length ?? 0;
    },
  });
}

export function usePurchaseTrend() {
  return useQuery({
    queryKey: ['dashboard', 'purchase-trend'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/purchase-trend');
      return res.data.data;
    },
  });
}

export function useTopItems() {
  return useQuery({
    queryKey: ['dashboard', 'top-items'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/top-items');
      return res.data.data;
    },
  });
}

export function useFoodCostSummary() {
  return useQuery({
    queryKey: ['dashboard', 'food-cost'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/food-cost');
      return res.data.data;
    },
  });
}
