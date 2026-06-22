'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';
import type { CreateBranchInput, UpdateBranchInput } from '@mbg/shared';

const QUERY_KEY = ['branches'] as const;

/** Cabang yang bisa diakses user saat ini (untuk switcher). */
export function useAccessibleBranches() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'accessible'],
    queryFn: async () => {
      const res = await apiClient.get('/branches');
      return res.data.data;
    },
  });
}

/** Daftar lengkap cabang untuk halaman manajemen. */
export function useBranchList() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'manage'],
    queryFn: async () => {
      const res = await apiClient.get('/branches/manage');
      return res.data.data;
    },
  });
}

export function useBranch(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const res = await apiClient.get(`/branches/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBranchInput) => {
      const res = await apiClient.post('/branches', data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cabang berhasil ditambahkan');
    },
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateBranchInput }) => {
      const res = await apiClient.patch(`/branches/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cabang berhasil diperbarui');
    },
  });
}

export function useDeactivateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/branches/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cabang dinonaktifkan');
    },
  });
}

export function useSetBranchMembers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, userIds }: { id: number; userIds: number[] }) => {
      const res = await apiClient.post(`/branches/${id}/members`, { userIds });
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
      qc.invalidateQueries({ queryKey: [...QUERY_KEY, 'manage'] });
      toast.success('Anggota cabang diperbarui');
    },
  });
}
