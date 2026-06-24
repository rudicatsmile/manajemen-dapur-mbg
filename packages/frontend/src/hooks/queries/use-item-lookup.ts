'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface ItemLookupResult {
  id: number;
  sku: string;
  barcode: string | null;
  name: string;
  currentStock: number;
  minStock: number;
  category?: { name: string };
  baseUnit?: { name: string; abbreviation: string };
  recentMovements: Array<{
    id: number;
    movementType: string;
    qtyChange: number;
    qtyAfter: number;
    createdAt: string;
    creator?: { name: string };
  }>;
}

/** Lookup imperatif (untuk handler scan di form). Mengembalikan null bila tidak ditemukan. */
export async function lookupItemByCode(code: string): Promise<ItemLookupResult | null> {
  try {
    const res = await apiClient.get('/items/lookup', { params: { code } });
    return res.data.data as ItemLookupResult;
  } catch {
    return null;
  }
}

export function useItemLookup(code: string | null) {
  return useQuery({
    queryKey: ['item-lookup', code],
    queryFn: async () => {
      const res = await apiClient.get('/items/lookup', { params: { code } });
      return res.data.data as ItemLookupResult;
    },
    enabled: !!code,
    retry: false,
  });
}
