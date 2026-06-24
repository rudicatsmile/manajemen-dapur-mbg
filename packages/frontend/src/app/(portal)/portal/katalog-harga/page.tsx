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
import { Combobox } from '@/components/shared/combobox';
import { usePortalPrices, usePortalItems, useCreatePortalPrice } from '@/hooks/queries/use-portal-prices';

const rp = (n: number) => `Rp ${Math.round(Number(n)).toLocaleString('id-ID')}`;
const fDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PortalKatalogHargaPage() {
  const { data: prices, isLoading } = usePortalPrices();
  const { data: items } = usePortalItems();
  const createPrice = useCreatePortalPrice();
  const [open, setOpen] = useState(false);

  const [itemId, setItemId] = useState('');
  const [price, setPrice] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState('');
  const [note, setNote] = useState('');

  const itemOptions = (items ?? []).map((i) => ({ value: String(i.id), label: `${i.name} (${i.sku})` }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrice.mutate(
      {
        itemId: parseInt(itemId, 10),
        price: parseFloat(price),
        effectiveDate,
        validUntil: validUntil || undefined,
        note: note || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setItemId('');
          setPrice('');
          setNote('');
          setValidUntil('');
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Katalog Harga</h1>
          <p className="text-muted-foreground">Perbarui daftar harga bahan Anda secara berkala</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Update Harga</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Update Harga Bahan</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Item *</Label>
                <Combobox options={itemOptions} value={itemId} onChange={setItemId} placeholder="Pilih item" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Harga (Rp) *</Label>
                  <Input type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" required />
                </div>
                <div className="space-y-1">
                  <Label>Berlaku Mulai *</Label>
                  <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} required />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Berlaku Sampai (opsional)</Label>
                  <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Catatan</Label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mis. harga promo" />
              </div>
              <Button type="submit" className="w-full" disabled={!itemId || !price || createPrice.isPending}>
                {createPrice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Harga
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Daftar Harga Aktif</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Memuat...</div>
          ) : !prices || prices.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Belum ada harga. Klik "Update Harga" untuk menambahkan.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead>Berlaku Mulai</TableHead>
                  <TableHead>Berlaku Sampai</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.item.name}</TableCell>
                    <TableCell className="text-right">{rp(p.price)}</TableCell>
                    <TableCell>{fDate(p.effectiveDate)}</TableCell>
                    <TableCell>{p.validUntil ? fDate(p.validUntil) : '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{p.note ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
