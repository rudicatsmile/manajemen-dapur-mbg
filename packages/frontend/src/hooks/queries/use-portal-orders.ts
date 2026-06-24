'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import portalApiClient from '@/lib/portal-api-client';
import { toast } from 'sonner';
import type { UpdateShipmentInput } from '@mbg/shared';

const KEY = ['portal', 'purchase-orders'] as const;

export function usePortalOrders(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: async () => {
      const res = await portalApiClient.get('/portal/purchase-orders', { params });
      return res.data as { data: unknown[]; meta: { page: number; totalPages: number; total: number; perPage: number } };
    },
  });
}

export function usePortalOrder(id: number) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: async () => {
      const res = await portalApiClient.get(`/portal/purchase-orders/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useUpdateShipment(poId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateShipmentInput) => {
      const res = await portalApiClient.post(`/portal/purchase-orders/${poId}/shipment`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Status pengiriman diperbarui');
    },
  });
}
