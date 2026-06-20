'use client';

import { PageHeader } from '@/components/layout/page-header';
import { PurchaseOrderForm } from '@/components/pembelian/purchase-order-form';

export default function CreatePurchaseOrderPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Buat Purchase Order" description="Buat purchase order baru" />
      <PurchaseOrderForm />
    </div>
  );
}
