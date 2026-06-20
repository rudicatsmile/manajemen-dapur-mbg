'use client';

import { use } from 'react';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupplier } from '@/hooks/queries/use-suppliers';

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: supplier, isLoading } = useSupplier(Number(id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="pt-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</CardContent></Card>
      </div>
    );
  }

  if (!supplier) return <div>Supplier tidak ditemukan</div>;

  const fields = [
    { label: 'Nama', value: supplier.name },
    { label: 'Kategori', value: supplier.category },
    { label: 'Alamat', value: supplier.address },
    { label: 'Telepon', value: supplier.phone },
    { label: 'Email', value: supplier.email },
    { label: 'Kontak Person', value: supplier.contactPerson },
    { label: 'Catatan', value: supplier.notes },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description="Detail supplier"
        action={
          <Button asChild><Link href={`/pembelian/supplier/${id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Informasi Supplier
            <Badge variant={supplier.isActive ? 'success' : 'secondary'}>
              {supplier.isActive ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value || '-'}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
