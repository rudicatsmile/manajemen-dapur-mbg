'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createReceivingSchema, type CreateReceivingInput } from '@mbg/shared';
import { Loader2, ScanLine } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { BarcodeScanner } from '@/components/shared/barcode-scanner';
import { usePurchaseOrderList, usePurchaseOrder } from '@/hooks/queries/use-purchase-orders';
import { useCreateReceiving } from '@/hooks/queries/use-receivings';
import { lookupItemByCode } from '@/hooks/queries/use-item-lookup';
import { formatDateInput } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function ReceivingForm() {
  const router = useRouter();
  const createMutation = useCreateReceiving();
  const { data: posData } = usePurchaseOrderList({ status: 'APPROVED', perPage: 100 });
  const [selectedPoId, setSelectedPoId] = useState<number>(0);
  const { data: poDetail } = usePurchaseOrder(selectedPoId);

  const poOptions = (posData?.data ?? []).map((po: { id: number; poNumber: string }) => ({ value: String(po.id), label: po.poNumber }));

  const form = useForm<CreateReceivingInput>({
    resolver: zodResolver(createReceivingSchema),
    defaultValues: {
      poId: 0,
      receivedDate: formatDateInput(new Date()),
      notes: '',
      items: [],
    },
  });

  const { fields, replace } = useFieldArray({ control: form.control, name: 'items' });
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleScan = async (code: string) => {
    if (!poDetail?.items) {
      toast.error('Pilih PO terlebih dahulu');
      return;
    }
    const item = await lookupItemByCode(code);
    if (!item) {
      toast.error(`Item dengan kode "${code}" tidak ditemukan`);
      return;
    }
    const lineIndex = poDetail.items.findIndex((pi: { itemId: number }) => pi.itemId === item.id);
    if (lineIndex < 0) {
      toast.error(`${item.name} tidak ada di PO ini`);
      return;
    }
    const el = document.querySelector<HTMLInputElement>(`[name="items.${lineIndex}.quantity"]`);
    el?.focus();
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast.success(`${item.name} — masukkan qty diterima`);
  };

  useEffect(() => {
    if (poDetail?.items) {
      replace(
        poDetail.items.map((item: { id: number; itemId: number; unitId: number; quantity: number }) => ({
          poItemId: item.id,
          itemId: item.itemId,
          quantity: 0,
          unitId: item.unitId,
          notes: '',
        }))
      );
    }
  }, [poDetail, replace]);

  const onSubmit = (data: CreateReceivingInput) => {
    const filtered = { ...data, items: data.items.filter((i) => i.quantity > 0) };
    if (filtered.items.length === 0) return;
    createMutation.mutate(filtered, { onSuccess: () => router.push('/pembelian/receiving') });
  };

  return (
    <Card>
      <BarcodeScanner open={scannerOpen} onOpenChange={setScannerOpen} onDetected={handleScan} title="Scan Item Penerimaan" />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="poId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order *</FormLabel>
                  <FormControl>
                    <Combobox
                      options={poOptions}
                      value={field.value ? String(field.value) : ''}
                      onChange={(v) => { field.onChange(Number(v)); setSelectedPoId(Number(v)); }}
                      placeholder="Pilih PO"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="receivedDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Terima *</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {fields.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Item</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setScannerOpen(true)}>
                    <ScanLine className="mr-2 h-4 w-4" />Scan untuk Isi
                  </Button>
                </div>
                {fields.map((field, index) => {
                  const poItem = poDetail?.items?.[index];
                  return (
                    <div key={field.id} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6 items-end border rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium">{poItem?.item?.name}</p>
                        <p className="text-xs text-muted-foreground">Dipesan: {poItem?.quantity} {poItem?.unit?.name}</p>
                      </div>
                      <FormField control={form.control} name={`items.${index}.quantity`} render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Qty Diterima</FormLabel>
                          <FormControl><Input type="number" min={0} {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`items.${index}.batchNumber` as `items.${number}.notes`} render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>No. Batch</FormLabel>
                          <FormControl><Input placeholder="No. Batch (opsional)" {...f} value={f.value ?? ''} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`items.${index}.expiryDate` as `items.${number}.notes`} render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Tanggal Expired</FormLabel>
                          <FormControl><Input type="date" {...f} value={f.value ?? ''} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`items.${index}.notes`} render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Catatan</FormLabel>
                          <FormControl><Input placeholder="Catatan item" {...f} /></FormControl>
                        </FormItem>
                      )} />
                    </div>
                  );
                })}
              </div>
            )}

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan</FormLabel>
                <FormControl><Textarea placeholder="Catatan penerimaan" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Penerimaan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
