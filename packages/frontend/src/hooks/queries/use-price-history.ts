'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useItemPriceHistory(itemId: number, months?: number) {
  return useQuery({
    queryKey: ['price-history', 'item', itemId, months],
    queryFn: async () => {
      const res = await apiClient.get(`/price-history/item/${itemId}`, {
        params: { months: months ?? 6 },
      });
      return res.data.data;
    },
    enabled: !!itemId,
  });
}

export function useItemPriceComparison(itemId: number) {
  return useQuery({
    queryKey: ['price-history', 'compare', itemId],
    queryFn: async () => {
      const res = await apiClient.get(`/price-history/item/${itemId}/compare`);
      return res.data.data;
    },
    enabled: !!itemId,
  });
}

export function usePriceAlerts(page?: number, perPage?: number) {
  return useQuery({
    queryKey: ['price-history', 'alerts', page, perPage],
    queryFn: async () => {
      const res = await apiClient.get('/price-history/alerts', {
        params: { page: page ?? 1, perPage: perPage ?? 20 },
      });
      return res.data;
    },
  });
}

export function usePriceSummary() {
  return useQuery({
    queryKey: ['price-history', 'summary'],
    queryFn: async () => {
      const res = await apiClient.get('/price-history/summary');
      return res.data.data;
    },
  });
}
