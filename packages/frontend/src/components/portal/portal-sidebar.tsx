'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, Receipt, Tags, MessageSquare, Store, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface PortalNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: PortalNavItem[] = [
  { title: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { title: 'Purchase Order', href: '/portal/purchase-order', icon: FileText },
  { title: 'Invoice / Nota', href: '/portal/invoice', icon: Receipt },
  { title: 'Katalog Harga', href: '/portal/katalog-harga', icon: Tags },
  { title: 'Pesan', href: '/portal/pesan', icon: MessageSquare },
];

function PortalNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/portal/dashboard" className="flex items-center gap-2 font-bold text-primary" onClick={onNavigate}>
          <Store className="h-6 w-6" />
          <span>Portal Supplier</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PortalSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-sidebar-background">
      <PortalNav />
    </aside>
  );
}

export function PortalMobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetTitle className="sr-only">Menu Navigasi Portal</SheetTitle>
        <PortalNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
