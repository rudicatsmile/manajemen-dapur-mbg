'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOpnameSchema, type CreateOpnameInput } from '@mbg/shared';
import { toast } from 'sonner';
import { Loader2, Plus, ScanLine } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { BarcodeScanner } from '@/components/shared/barcode-scanner';
import { useItemList } from '@/hooks/queries/use-items';
import { lookupItemByCode } from '@/hooks/queries/use-item-lookup';
import { useCreateOpname } from '@/hooks/queries/use-opnames';
import { formatDateInput } from '@/lib/utils';

export default function CreateOpnamePage() {
  const router = useRouter();
  const createMutation = useCreateOpname();
  const [scannerOpen, setScannerOpen] = useState(false);
  const { data: itemsData } = useItemList({ perPage: 200 });
  const items = (itemsData?.data ?? []).map((i: { id: number; name: string; currentStock: number }) => ({
    value: String(i.id),
    label: `${i.name} (Sistem: ${i.currentStock})`,
  }));

  const form = useForm<CreateOpnameInput>({
    resolver: zodResolver(createOpnameSchema),
    defaultValues: {
      opnameDate: formatDateInput(new Date()),
      notes: '',
      items: [{ itemId: 0, actualQty: 0, notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });

  const handleScan = async (code: string) => {
    const item = await lookupItemByCode(code);
    if (!item) {
      toast.error(`Item dengan kode "${code}" tidak ditemukan`);
      return;
    }
    const current = form.getValues('items');
    const existingIndex = current.findIndex((row) => row.itemId === item.id);
    if (existingIndex >= 0) {
      toast.info(`${item.name} sudah ada di daftar`);
      const el = document.querySelector<HTMLInputElement>(`[name="items.${existingIndex}.actualQty"]`);
      el?.focus();
      return;
    }
    // Isi baris kosong pertama, atau append baris baru
    const emptyIndex = current.findIndex((row) => !row.itemId);
    if (emptyIndex >= 0) {
      form.setValue(`items.${emptyIndex}.itemId`, item.id);
    } else {
      append({ itemId: item.id, actualQty: 0, notes: '' });
    }
    toast.success(`${item.name} ditambahkan`);
  };

  const onSubmit = (data: CreateOpnameInput) => {
    createMutation.mutate(data, { onSuccess: () => router.push('/stok/opname') });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Buat Stok Opname" description="Lakukan penghitungan stok fisik" />
      <BarcodeScanner open={scannerOpen} onOpenChange={setScannerOpen} onDetected={handleScan} title="Scan Item Opname" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="opnameDate" render={({ field }) => (
                  <FormItem><FormLabel>Tanggal Opname *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Item</h3>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setScannerOpen(true)}>
                      <ScanLine className="mr-2 h-4 w-4" />Scan Item
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ itemId: 0, actualQty: 0, notes: '' })}>
                      <Plus className="mr-2 h-4 w-4" />Tambah Item
                    </Button>
                  </div>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-3 sm:grid-cols-3 items-end border rounded-lg p-3">
                    <FormField control={form.control} name={`items.${index}.itemId`} render={({ field: f }) => (
                      <FormItem><FormLabel>Item</FormLabel><FormControl>
                        <Combobox options={items} value={f.value ? String(f.value) : ''} onChange={(v) => f.onChange(Number(v))} placeholder="Pilih item" />
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`items.${index}.actualQty`} render={({ field: f }) => (
                      <FormItem><FormLabel>Qty Aktual</FormLabel><FormControl><Input type="number" min={0} {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-2 items-end">
                      <FormField control={form.control} name={`items.${index}.notes`} render={({ field: f }) => (
                        <FormItem className="flex-1"><FormLabel>Catatan</FormLabel><FormControl><Input placeholder="Catatan" {...f} /></FormControl></FormItem>
                      )} />
                      {fields.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>Hapus</Button>}
                    </div>
                  </div>
                ))}
              </div>

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Textarea placeholder="Catatan opname" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Opname
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
