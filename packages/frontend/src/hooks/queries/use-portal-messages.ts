'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import portalApiClient from '@/lib/portal-api-client';
import { toast } from 'sonner';
import type { SendMessageInput } from '@mbg/shared';

const KEY = ['portal', 'messages'] as const;

export interface PortalMessage {
  id: number;
  senderType: string;
  body: string;
  createdAt: string;
  poId: number | null;
  senderUser: { id: number; name: string } | null;
  senderSupplierUser: { id: number; name: string } | null;
  purchaseOrder: { id: number; poNumber: string } | null;
}

export function usePortalMessages(page: number = 1) {
  return useQuery({
    queryKey: [...KEY, page],
    queryFn: async () => {
      const res = await portalApiClient.get('/portal/messages', { params: { page, perPage: 50 } });
      return res.data as { data: PortalMessage[]; meta: { page: number; totalPages: number; total: number } };
    },
    refetchInterval: 15000,
  });
}

export function useSendPortalMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      const res = await portalApiClient.post('/portal/messages', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
    onError: () => {
      toast.error('Gagal mengirim pesan');
    },
  });
}
