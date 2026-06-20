'use client';

import { use } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ItemForm } from '@/components/stok/item-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useItem } from '@/hooks/queries/use-items';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: item, isLoading } = useItem(Number(id));

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 w-full" /></div>;
  if (!item) return <div>Item tidak ditemukan</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Item" description={`Edit data item ${item.name}`} />
      <ItemForm initialData={{ ...item, id: Number(id), categoryId: item.category?.id ?? item.categoryId, baseUnitId: item.baseUnit?.id ?? item.baseUnitId }} isEdit />
    </div>
  );
}
