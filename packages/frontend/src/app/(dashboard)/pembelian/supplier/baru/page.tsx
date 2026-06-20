'use client';

import { PageHeader } from '@/components/layout/page-header';
import { SupplierForm } from '@/components/pembelian/supplier-form';

export default function CreateSupplierPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Supplier" description="Tambahkan supplier baru" />
      <SupplierForm />
    </div>
  );
}
