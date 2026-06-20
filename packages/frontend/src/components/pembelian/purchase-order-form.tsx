'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPurchaseOrderSchema, type CreatePurchaseOrderInput } from '@mbg/shared';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { useSupplierList } from '@/hooks/queries/use-suppliers';
import { useItemList } from '@/hooks/queries/use-items';
import { useUnitList } from '@/hooks/queries/use-units';
import { useCreatePurchaseOrder } from '@/hooks/queries/use-purchase-orders';
import { formatRupiah, formatDateInput } from '@/lib/utils';

export function PurchaseOrderForm() {
  const router = useRouter();
  const createMutation = useCreatePurchaseOrder();
  const { data: suppliersData } = useSupplierList({ perPage: 100 });
  const { data: itemsData } = useItemList({ perPage: 200 });
  const { data: unitsData } = useUnitList({ perPage: 100 });

  const suppliers = (suppliersData?.data ?? []).map((s: { id: number; name: string }) => ({ value: String(s.id), label: s.name }));
  const items = (itemsData?.data ?? []).map((i: { id: number; name: string }) => ({ value: String(i.id), label: i.name }));
  const units = (unitsData?.data ?? []).map((u: { id: number; name: string }) => ({ value: String(u.id), label: u.name }));

  const form = useForm<CreatePurchaseOrderInput>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues: {
      supplierId: 0,
      poDate: formatDateInput(new Date()),
      expectedDate: '',
      notes: '',
      items: [{ itemId: 0, quantity: 1, unitId: 0, unitPrice: 0, notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  const watchedItems = form.watch('items');
  const grandTotal = watchedItems.reduce((sum, item) => sum + (item.quantity ?? 0) * (item.unitPrice ?? 0), 0);

  const onSubmit = (data: CreatePurchaseOrderInput) => {
    createMutation.mutate(data, { onSuccess: () => router.push('/pembelian/purchase-order') });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="supplierId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier *</FormLabel>
                  <FormControl>
                    <Combobox
                      options={suppliers}
                      value={field.value ? String(field.value) : ''}
                      onChange={(v) => field.onChange(Number(v))}
                      placeholder="Pilih supplier"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="poDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal PO *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="expectedDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Diharapkan</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Item</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ itemId: 0, quantity: 1, unitId: 0, unitPrice: 0, notes: '' })}>
                  <Plus className="mr-2 h-4 w-4" />Tambah Item
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 sm:grid-cols-5 items-end border rounded-lg p-3">
                  <FormField control={form.control} name={`items.${index}.itemId`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Item</FormLabel>
                      <FormControl>
                        <Combobox options={items} value={f.value ? String(f.value) : ''} onChange={(v) => f.onChange(Number(v))} placeholder="Pilih item" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.quantity`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Qty</FormLabel>
                      <FormControl><Input type="number" min={1} {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.unitId`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Combobox options={units} value={f.value ? String(f.value) : ''} onChange={(v) => f.onChange(Number(v))} placeholder="Satuan" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>Harga Satuan</FormLabel>
                      <FormControl><Input type="number" min={0} {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium whitespace-nowrap">
                      {formatRupiah((watchedItems[index]?.quantity ?? 0) * (watchedItems[index]?.unitPrice ?? 0))}
                    </div>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-right text-lg font-bold">Total: {formatRupiah(grandTotal)}</div>
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan</FormLabel>
                <FormControl><Textarea placeholder="Catatan PO" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat Purchase Order
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
