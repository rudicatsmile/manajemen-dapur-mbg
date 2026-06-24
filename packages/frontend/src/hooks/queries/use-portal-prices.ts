'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import portalApiClient from '@/lib/portal-api-client';
import { toast } from 'sonner';
import type { CreateSupplierPriceInput } from '@mbg/shared';

const KEY = ['portal', 'prices'] as const;

export function usePortalPrices() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await portalApiClient.get('/portal/prices');
      return res.data.data as Array<{
        id: number; itemId: number; price: number; effectiveDate: string;
        validUntil: string | null; note: string | null;
        item: { id: number; name: string; sku: string };
        unit: { id: number; name: string; abbreviation: string } | null;
      }>;
    },
  });
}

export function usePortalItems() {
  return useQuery({
    queryKey: ['portal', 'items'],
    queryFn: async () => {
      const res = await portalApiClient.get('/portal/items');
      return res.data.data as Array<{ id: number; name: string; sku: string; baseUnitId: number; baseUnit: { id: number; name: string; abbreviation: string } }>;
    },
  });
}

export function useCreatePortalPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSupplierPriceInput) => {
      const res = await portalApiClient.post('/portal/prices', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Harga berhasil disimpan');
    },
  });
}
