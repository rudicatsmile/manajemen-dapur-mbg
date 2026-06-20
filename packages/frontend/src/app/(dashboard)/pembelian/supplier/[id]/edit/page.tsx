'use client';

import { use } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { SupplierForm } from '@/components/pembelian/supplier-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupplier } from '@/hooks/queries/use-suppliers';

export default function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: supplier, isLoading } = useSupplier(Number(id));

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 w-full" /></div>;
  if (!supplier) return <div>Supplier tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Supplier" description={`Edit data supplier ${supplier.name}`} />
      <SupplierForm initialData={{ ...supplier, id: Number(id) }} isEdit />
    </div>
  );
}
