'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ItemForm } from '@/components/stok/item-form';

export default function CreateItemPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Item" description="Tambahkan item/bahan baku baru" />
      <ItemForm />
    </div>
  );
}
