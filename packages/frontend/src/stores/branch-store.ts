'use client';

import { create } from 'zustand';

export interface BranchOption {
  id: number;
  code: string;
  name: string;
  isDefault: boolean;
}

/** Nilai cabang aktif: id cabang spesifik, atau 'ALL' untuk mode konsolidasi (owner/admin). */
export type ActiveBranch = number | 'ALL';

interface BranchState {
  branches: BranchOption[];
  activeBranch: ActiveBranch | null;
  setBranches: (branches: BranchOption[], defaultBranchId?: number | null) => void;
  setActiveBranch: (value: ActiveBranch) => void;
  hydrate: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'activeBranch';
const BRANCHES_KEY = 'branches';

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  activeBranch: null,

  setBranches: (branches, defaultBranchId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
    }
    // Pertahankan pilihan sebelumnya jika masih valid, kalau tidak pakai default/awal
    const current = get().activeBranch;
    const stillValid =
      current === 'ALL' || (typeof current === 'number' && branches.some((b) => b.id === current));
    let next: ActiveBranch | null = stillValid ? current : null;
    if (next === null) {
      next = defaultBranchId ?? branches.find((b) => b.isDefault)?.id ?? branches[0]?.id ?? null;
    }
    if (next !== null && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(next));
    }
    set({ branches, activeBranch: next });
  },

  setActiveBranch: (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(value));
    }
    set({ activeBranch: value });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    const branchesStr = localStorage.getItem(BRANCHES_KEY);
    let branches: BranchOption[] = [];
    if (branchesStr) {
      try {
        branches = JSON.parse(branchesStr);
      } catch {
        branches = [];
      }
    }
    let activeBranch: ActiveBranch | null = null;
    if (raw === 'ALL') activeBranch = 'ALL';
    else if (raw && !Number.isNaN(parseInt(raw, 10))) activeBranch = parseInt(raw, 10);
    set({ branches, activeBranch });
  },

  reset: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BRANCHES_KEY);
    }
    set({ branches: [], activeBranch: null });
  },
}));

/** Helper non-React untuk membaca cabang aktif (dipakai axios interceptor). */
export function getActiveBranchHeader(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}
