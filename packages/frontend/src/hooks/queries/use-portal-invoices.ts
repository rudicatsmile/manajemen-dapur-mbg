'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import portalApiClient from '@/lib/portal-api-client';
import { toast } from 'sonner';

const KEY = ['portal', 'invoices'] as const;

export function usePortalInvoices(params?: { page?: number }) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: async () => {
      const res = await portalApiClient.get('/portal/invoices', { params });
      return res.data as { data: unknown[]; meta: { page: number; totalPages: number; total: number; perPage: number } };
    },
  });
}

export function useCreatePortalInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await portalApiClient.post('/portal/invoices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('Invoice berhasil dikirim');
    },
  });
}
