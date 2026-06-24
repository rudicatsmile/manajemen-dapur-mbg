'use client';

import Link from 'next/link';
import { FileText, Receipt, Tags, MessageSquare } from 'lucide-react';
import { useSupplierAuthStore } from '@/stores/supplier-auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const shortcuts = [
  { title: 'Purchase Order', description: 'Lihat PO yang ditujukan ke Anda & update status pengiriman', href: '/portal/purchase-order', icon: FileText },
  { title: 'Invoice / Nota', description: 'Kirim invoice/nota pembelian secara digital', href: '/portal/invoice', icon: Receipt },
  { title: 'Katalog Harga', description: 'Perbarui daftar harga bahan Anda secara berkala', href: '/portal/katalog-harga', icon: Tags },
  { title: 'Pesan', description: 'Komunikasi langsung dengan tim purchasing', href: '/portal/pesan', icon: MessageSquare },
];

export default function PortalDashboardPage() {
  const supplier = useSupplierAuthStore((s) => s.supplier);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {supplier?.name ?? 'Supplier'}</h1>
        <p className="text-muted-foreground">{supplier?.supplierName}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/40">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="pt-2 text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
