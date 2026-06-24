'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { useBranchStore } from '@/stores/branch-store';
import { toast } from 'sonner';
import type { LoginInput } from '@mbg/shared';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setBranches = useBranchStore((s) => s.setBranches);
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await apiClient.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      const user = data.data.user;
      setAuth(user, data.data.accessToken);
      setBranches(user.branches ?? [], user.defaultBranchId ?? null);
      toast.success('Berhasil masuk');
    },
    onError: () => {
      toast.error('Email atau password salah');
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await apiClient.get('/auth/me');
      return res.data.data;
    },
    retry: false,
  });
}
