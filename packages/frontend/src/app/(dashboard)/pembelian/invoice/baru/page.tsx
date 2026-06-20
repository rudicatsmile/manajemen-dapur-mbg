'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { useSupplierList } from '@/hooks/queries/use-suppliers';
import { useCreateInvoice } from '@/hooks/queries/use-invoices';
import { formatDateInput } from '@/lib/utils';

export default function CreateInvoicePage() {
  const router = useRouter();
  const createMutation = useCreateInvoice();
  const { data: suppliersData } = useSupplierList({ perPage: 100 });
  const suppliers = (suppliersData?.data ?? []).map((s: { id: number; name: string }) => ({ value: String(s.id), label: s.name }));

  const [supplierId, setSupplierId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(formatDateInput(new Date()));
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('supplierId', supplierId);
    formData.append('invoiceNumber', invoiceNumber);
    formData.append('amount', amount);
    formData.append('invoiceDate', invoiceDate);
    formData.append('notes', notes);
    if (file) formData.append('file', file);
    createMutation.mutate(formData, { onSuccess: () => router.push('/pembelian/invoice') });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Bukti Pembelian" description="Upload bukti pembelian / invoice" />
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Combobox options={suppliers} value={supplierId} onChange={setSupplierId} placeholder="Pilih supplier" />
              </div>
              <div className="space-y-2">
                <Label>No. Invoice</Label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="No. invoice" />
              </div>
              <div className="space-y-2">
                <Label>Jumlah *</Label>
                <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Tanggal *</Label>
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>File Bukti</Label>
              <Input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
