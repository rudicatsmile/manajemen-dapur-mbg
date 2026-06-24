'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { usePortalInvoices, useCreatePortalInvoice } from '@/hooks/queries/use-portal-invoices';

const rp = (n: number) => `Rp ${Math.round(Number(n)).toLocaleString('id-ID')}`;
const fDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PortalInvoicePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePortalInvoices({ page });
  const createInvoice = useCreatePortalInvoice();
  const [open, setOpen] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const rows = (data?.data ?? []) as Array<{
    id: number; invoiceNumber: string; invoiceDate: string; totalAmount: number;
    status: string; imageUrl: string | null; purchaseOrder?: { poNumber: string };
  }>;
  const meta = data?.meta;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('invoiceNumber', invoiceNumber);
    fd.append('invoiceDate', invoiceDate);
    fd.append('totalAmount', totalAmount);
    if (notes) fd.append('notes', notes);
    if (file) fd.append('file', file);
    createInvoice.mutate(fd, {
      onSuccess: () => {
        setOpen(false);
        setInvoiceNumber('');
        setTotalAmount('');
        setNotes('');
        setFile(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoice / Nota</h1>
          <p className="text-muted-foreground">Kirim invoice/nota pembelian secara digital</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Kirim Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Kirim Invoice Baru</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>No. Invoice *</Label>
                  <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="INV-001" required />
                </div>
                <div className="space-y-1">
                  <Label>Tanggal *</Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Jumlah (Rp) *</Label>
                  <Input type="number" min={1} value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0" required />
                </div>
              </div>
              <div className="space-y-1">
                <Label>File Bukti</Label>
                <Input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="space-y-1">
                <Label>Catatan</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan opsional" />
              </div>
              <Button type="submit" className="w-full" disabled={createInvoice.isPending}>
                {createInvoice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Invoice
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Daftar Invoice Terkirim</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Memuat...</div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Belum ada invoice yang dikirim.</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Invoice</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>PO Terkait</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                      <TableCell>{fDate(inv.invoiceDate)}</TableCell>
                      <TableCell>{inv.purchaseOrder?.poNumber ?? '-'}</TableCell>
                      <TableCell className="text-right">{rp(inv.totalAmount)}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                  <span>Halaman {meta.page} dari {meta.totalPages}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</Button>
                    <Button size="sm" variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Berikutnya</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
