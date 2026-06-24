'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { SendMessageInput } from '@mbg/shared';

const KEY = ['supplier-messages'] as const;

export interface SupplierMessage {
  id: number;
  senderType: string;
  body: string;
  createdAt: string;
  poId: number | null;
  senderUser: { id: number; name: string } | null;
  senderSupplierUser: { id: number; name: string } | null;
  purchaseOrder: { id: number; poNumber: string } | null;
}

export function useSupplierMessages(supplierId: number, page: number = 1) {
  return useQuery({
    queryKey: [...KEY, supplierId, page],
    queryFn: async () => {
      const res = await apiClient.get(`/suppliers/${supplierId}/messages`, { params: { page, perPage: 50 } });
      return res.data as { data: SupplierMessage[]; meta: { page: number; totalPages: number; total: number } };
    },
    enabled: !!supplierId,
    refetchInterval: 15000,
  });
}

export function useSendSupplierMessage(supplierId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      const res = await apiClient.post(`/suppliers/${supplierId}/messages`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...KEY, supplierId] });
    },
  });
}

export function useSupplierPrices(supplierId: number) {
  return useQuery({
    queryKey: ['supplier-prices', supplierId],
    queryFn: async () => {
      const res = await apiClient.get(`/suppliers/${supplierId}/prices`);
      return res.data.data as Array<{
        id: number; price: number; effectiveDate: string; validUntil: string | null; note: string | null;
        item: { id: number; name: string; sku: string };
        unit: { id: number; name: string; abbreviation: string } | null;
      }>;
    },
    enabled: !!supplierId,
  });
}
