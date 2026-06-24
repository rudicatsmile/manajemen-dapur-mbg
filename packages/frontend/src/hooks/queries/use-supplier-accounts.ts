'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateSupplierUserInput, UpdateSupplierUserInput, SupplierUser } from '@mbg/shared';

const KEY = ['supplier-accounts'] as const;

export function useSupplierAccounts(supplierId: number) {
  return useQuery({
    queryKey: [...KEY, supplierId],
    queryFn: async () => {
      const res = await apiClient.get(`/suppliers/${supplierId}/accounts`);
      return res.data.data as SupplierUser[];
    },
    enabled: !!supplierId,
  });
}

export function useCreateSupplierAccount(supplierId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSupplierUserInput) => {
      const res = await apiClient.post(`/suppliers/${supplierId}/accounts`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...KEY, supplierId] });
      toast.success('Akun supplier berhasil dibuat');
    },
  });
}

export function useUpdateSupplierAccount(supplierId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ accountId, data }: { accountId: number; data: UpdateSupplierUserInput }) => {
      const res = await apiClient.patch(`/suppliers/accounts/${accountId}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...KEY, supplierId] });
      toast.success('Akun supplier diperbarui');
    },
  });
}
