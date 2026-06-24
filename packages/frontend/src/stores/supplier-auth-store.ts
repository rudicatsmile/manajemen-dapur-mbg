'use client';

import { create } from 'zustand';
import type { SupplierSessionProfile } from '@mbg/shared';

interface SupplierAuthState {
  supplier: SupplierSessionProfile | null;
  accessToken: string | null;
  setAuth: (supplier: SupplierSessionProfile, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hydrate: () => void;
}

export const useSupplierAuthStore = create<SupplierAuthState>((set, get) => ({
  supplier: null,
  accessToken: null,
  setAuth: (supplier, token) => {
    localStorage.setItem('supplierAccessToken', token);
    localStorage.setItem('supplierUser', JSON.stringify(supplier));
    set({ supplier, accessToken: token });
  },
  logout: () => {
    localStorage.removeItem('supplierAccessToken');
    localStorage.removeItem('supplierUser');
    set({ supplier: null, accessToken: null });
  },
  isAuthenticated: () => !!get().accessToken,
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('supplierAccessToken');
    const supplierStr = localStorage.getItem('supplierUser');
    if (token && supplierStr) {
      try {
        const supplier = JSON.parse(supplierStr) as SupplierSessionProfile;
        set({ supplier, accessToken: token });
      } catch {
        set({ supplier: null, accessToken: null });
      }
    }
  },
}));
