'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSupplierAuthStore } from '@/stores/supplier-auth-store';
import { PortalSidebar } from '@/components/portal/portal-sidebar';
import { PortalHeader } from '@/components/portal/portal-header';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, hydrate } = useSupplierAuthStore();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/portal/login';

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  useEffect(() => {
    if (mounted && !accessToken && !isLoginPage) {
      router.push('/portal/login');
    }
  }, [mounted, accessToken, isLoginPage, router]);

  // Halaman login dirender mandiri tanpa chrome portal.
  if (isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        {children}
      </div>
    );
  }

  if (!mounted || !accessToken) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PortalSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PortalHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
