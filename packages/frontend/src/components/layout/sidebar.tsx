'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Truck, FileText, PackageCheck, Receipt,
  Package, ArrowLeftRight, ClipboardCheck, ChefHat, CalendarDays,
  Trash2, Calculator, BarChart3, TrendingUp, TrendingDown, Users, Tag, Ruler,
  ChevronDown, ChevronRight, Menu, Bell, Award, LineChart, Calendar,
  CalendarRange, UtensilsCrossed, Timer, Building2, ArrowRightLeft, ScanLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useLowStockCount } from '@/hooks/queries/use-dashboard';
import { useNotificationCount } from '@/hooks/queries/use-notifications';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const navGroups: NavGroup[] = [
  {
    title: '',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Notifikasi', href: '/notifikasi', icon: Bell },
    ],
  },
  {
    title: 'Pembelian',
    items: [
      { title: 'Supplier', href: '/pembelian/supplier', icon: Truck },
      { title: 'Purchase Order', href: '/pembelian/purchase-order', icon: FileText },
      { title: 'Penerimaan', href: '/pembelian/receiving', icon: PackageCheck },
      { title: 'Bukti Pembelian', href: '/pembelian/invoice', icon: Receipt },
      { title: 'Rating Supplier', href: '/pembelian/supplier-rating', icon: Award },
    ],
  },
  {
    title: 'Stok Gudang',
    items: [
      { title: 'Master Item', href: '/stok/item', icon: Package },
      { title: 'Scan Item', href: '/stok/scan', icon: ScanLine },
      { title: 'Mutasi Stok', href: '/stok/mutasi', icon: ArrowLeftRight },
      { title: 'Stok Opname', href: '/stok/opname', icon: ClipboardCheck },
      { title: 'Transfer Stok', href: '/stok/transfer', icon: ArrowRightLeft },
      { title: 'Histori Harga', href: '/stok/histori-harga', icon: TrendingDown },
      { title: 'Batch & Expiry', href: '/stok/batch-tracking', icon: Timer },
    ],
  },
  {
    title: 'Produksi',
    items: [
      { title: 'Resep', href: '/produksi/resep', icon: ChefHat },
      { title: 'Produksi Harian', href: '/produksi/harian', icon: CalendarDays },
      { title: 'Waste', href: '/produksi/waste', icon: Trash2 },
      { title: 'Meal Prep', href: '/produksi/meal-plan', icon: UtensilsCrossed },
      { title: 'Prediksi Bahan', href: '/produksi/forecasting', icon: LineChart },
    ],
  },
  {
    title: 'Laporan',
    items: [
      { title: 'Biaya Per Porsi', href: '/laporan/biaya-per-porsi', icon: Calculator },
      { title: 'Menu Engineering', href: '/laporan/menu-engineering', icon: TrendingUp },
      { title: 'Perbandingan Cabang', href: '/laporan/perbandingan-cabang', icon: Building2 },
      { title: 'Laporan', href: '/laporan', icon: BarChart3 },
    ],
  },
  {
    title: 'Pengaturan',
    adminOnly: true,
    items: [
      { title: 'Cabang', href: '/pengaturan/cabang', icon: Building2 },
      { title: 'Pengguna', href: '/pengaturan/user', icon: Users },
      { title: 'Kategori', href: '/pengaturan/kategori', icon: Tag },
      { title: 'Satuan', href: '/pengaturan/satuan', icon: Ruler },
      { title: 'Template Meal Plan', href: '/pengaturan/meal-plan-template', icon: CalendarRange },
      { title: 'Faktor Musiman', href: '/pengaturan/musiman', icon: Calendar },
    ],
  },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { data: lowStockCount } = useLowStockCount();
  const { data: notifCount } = useNotificationCount();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) => setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary" onClick={onNavigate}>
          <ChefHat className="h-6 w-6" />
          <span>Dapur MBG</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navGroups.map((group) => {
          if (group.adminOnly && user?.role !== 'OWNER' && user?.role !== 'ADMIN') return null;
          return (
            <div key={group.title || 'main'}>
              {group.title && (
                <button
                  onClick={() => toggle(group.title)}
                  className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {group.title}
                  {collapsed[group.title] ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              )}
              {!collapsed[group.title] &&
                group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const badgeCount = item.href === '/stok/item' ? lowStockCount : item.href === '/notifikasi' ? notifCount : undefined;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                      {badgeCount !== undefined && badgeCount > 0 && (
                        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                          {badgeCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              {group.title && <Separator className="my-2" />}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-sidebar-background">
      <SidebarNav />
    </aside>
  );
}

export function MobileSidebar() {
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
        <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
