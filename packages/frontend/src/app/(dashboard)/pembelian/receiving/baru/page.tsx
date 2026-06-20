'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ReceivingForm } from '@/components/pembelian/receiving-form';

export default function CreateReceivingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Buat Penerimaan" description="Catat penerimaan barang dari PO" />
      <ReceivingForm />
    </div>
  );
}
