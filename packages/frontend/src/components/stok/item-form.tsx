'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createItemSchema, type CreateItemInput } from '@mbg/shared';
import { Loader2, ScanLine } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { BarcodeScanner } from '@/components/shared/barcode-scanner';
import { useCategoryList } from '@/hooks/queries/use-categories';
import { useUnitList } from '@/hooks/queries/use-units';
import { useCreateItem, useUpdateItem } from '@/hooks/queries/use-items';

interface ItemFormProps {
  initialData?: CreateItemInput & { id?: number };
  isEdit?: boolean;
}

export function ItemForm({ initialData, isEdit }: ItemFormProps) {
  const router = useRouter();
  const [scannerOpen, setScannerOpen] = useState(false);
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const { data: categoriesData } = useCategoryList({ type: 'ITEM', perPage: 100 });
  const { data: unitsData } = useUnitList({ perPage: 100 });

  const categories = (categoriesData?.data ?? []).map((c: { id: number; name: string }) => ({ value: String(c.id), label: c.name }));
  const units = (unitsData?.data ?? []).map((u: { id: number; name: string }) => ({ value: String(u.id), label: u.name }));

  const form = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      barcode: initialData?.barcode ?? '',
      categoryId: initialData?.categoryId ?? 0,
      baseUnitId: initialData?.baseUnitId ?? 0,
      purchaseUnitId: initialData?.purchaseUnitId ?? undefined,
      conversionFactor: initialData?.conversionFactor ?? 1,
      minStock: initialData?.minStock ?? 0,
    },
  });

  const onSubmit = (data: CreateItemInput) => {
    if (isEdit && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data }, { onSuccess: () => router.push('/stok/item') });
    } else {
      createMutation.mutate(data, { onSuccess: () => router.push('/stok/item') });
    }
  };

  return (
    <Card>
      <BarcodeScanner open={scannerOpen} onOpenChange={setScannerOpen} onDetected={(code) => form.setValue('barcode', code)} title="Scan Barcode Item" />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama Item *</FormLabel><FormControl><Input placeholder="Nama item" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="barcode" render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <div className="flex gap-2">
                  <FormControl><Input placeholder="Barcode pabrik (EAN/UPC) — opsional" {...field} value={field.value ?? ''} /></FormControl>
                  <Button type="button" variant="outline" size="icon" onClick={() => setScannerOpen(true)}>
                    <ScanLine className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem><FormLabel>Kategori *</FormLabel><FormControl>
                  <Combobox options={categories} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(Number(v))} placeholder="Pilih kategori" />
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="baseUnitId" render={({ field }) => (
                <FormItem><FormLabel>Satuan Dasar *</FormLabel><FormControl>
                  <Combobox options={units} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(Number(v))} placeholder="Pilih satuan" />
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="purchaseUnitId" render={({ field }) => (
                <FormItem><FormLabel>Satuan Beli</FormLabel><FormControl>
                  <Combobox options={units} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(v ? Number(v) : undefined)} placeholder="Pilih satuan beli" />
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="conversionFactor" render={({ field }) => (
                <FormItem><FormLabel>Faktor Konversi</FormLabel><FormControl><Input type="number" min={0} step="any" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="minStock" render={({ field }) => (
                <FormItem><FormLabel>Stok Minimum</FormLabel><FormControl><Input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Simpan Perubahan' : 'Tambah Item'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
