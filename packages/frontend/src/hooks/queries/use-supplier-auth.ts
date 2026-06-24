'use client';

import { useMutation } from '@tanstack/react-query';
import portalApiClient from '@/lib/portal-api-client';
import { useSupplierAuthStore } from '@/stores/supplier-auth-store';
import { toast } from 'sonner';
import type { SupplierLoginInput } from '@mbg/shared';

export function useSupplierLogin() {
  const setAuth = useSupplierAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: SupplierLoginInput) => {
      const res = await portalApiClient.post('/supplier-auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      const { supplier, accessToken } = data.data;
      setAuth(supplier, accessToken);
      toast.success('Berhasil masuk');
    },
    onError: () => {
      toast.error('Email atau password salah');
    },
  });
}

export function useSupplierChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const res = await portalApiClient.post('/supplier-auth/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password berhasil diubah');
    },
  });
}
