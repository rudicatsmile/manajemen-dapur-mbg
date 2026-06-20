'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

const QUERY_KEY = ['supplier-ratings'] as const;

export interface SupplierScores {
  onTimeDelivery: number;
  orderFulfillment: number;
  quality: number;
  priceCompetitiveness: number;
}

export interface SupplierRating {
  supplierId: number;
  supplierName: string;
  category: string | null;
  overallScore: number;
  scores: SupplierScores;
  totalPOs: number;
  totalValue: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface SupplierRatingDetail extends SupplierRating {
  poHistory: Array<{
    poNumber: string;
    date: string;
    expectedDate: string | null;
    status: string;
    totalAmount: number;
    onTimeStatus: 'ON_TIME' | 'LATE' | 'PENDING' | 'NO_EXPECTED';
  }>;
  itemsSupplied: Array<{
    itemName: string;
    lastPrice: number;
    avgMarketPrice: number | null;
  }>;
}

export function useSupplierRatings(from?: string, to?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, from, to],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await apiClient.get('/supplier-ratings', { params });
      return res.data.data as SupplierRating[];
    },
  });
}

export function useSupplierRatingDetail(supplierId: number, from?: string, to?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', supplierId, from, to],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await apiClient.get(`/supplier-ratings/${supplierId}`, { params });
      return res.data.data as SupplierRatingDetail;
    },
    enabled: !!supplierId,
  });
}
