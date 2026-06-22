'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { createStockTransferSchema, type CreateStockTransferInput } from '@mbg/shared';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/shared/combobox';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBranchStore } from '@/stores/branch-store';
import { useAccessibleBranches } from '@/hooks/queries/use-branches';
import { useItemList } from '@/hooks/queries/use-items';
import { useUnitList } from '@/hooks/queries/use-units';
import { useCreateStockTransfer } from '@/hooks/queries/use-stock-transfers';

interface ItemOpt { id: number; name: string; baseUnitId: number }

export default function CreateStockTransferPage() {
  const router = useRouter();
  const activeBranch = useBranchStore((s) => s.activeBranch);
  const { data: branchesData } = useAccessibleBranches();
  const { data: itemsData } = useItemList({ perPage: 200 });
  const { data: unitsData } = useUnitList({ perPage: 100 });
  const createTransfer = useCreateStockTransfer();

  const branches: Array<{ id: number; name: string }> = branchesData ?? [];
  const items: ItemOpt[] = itemsData?.data ?? [];
  const itemOptions = items.map((i) => ({ value: String(i.id), label: i.name }));
  const unitOptions = (unitsData?.data ?? []).map((u: { id: number; name: string }) => ({ value: String(u.id), label: u.name }));

  const defaultFrom = typeof activeBranch === 'number' ? activeBranch : (branches[0]?.id ?? 0);

  const form = useForm<CreateStockTransferInput>({
    resolver: zodResolver(createStockTransferSchema),
    defaultValues: {
      fromBranchId: defaultFrom,
      toBranchId: 0,
      requestDate: new Date().toISOString().slice(0, 10),
      notes: '',
      items: [{ itemId: 0, unitId: 0, requestedQty: 1, notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  const fromBranchId = form.watch('fromBranchId');
  const itemUnitMap = useMemo(() => new Map(items.map((i) => [i.id, i.baseUnitId])), [items]);

  const onSubmit = (values: CreateStockTransferInput) => {
    createTransfer.mutate(values, { onSuccess: (t) => router.push(`/stok/transfer/${t.id}`) });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Buat Transfer Stok" description="Minta pemindahan stok antar cabang" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informasi Transfer</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <FormField control={form.control} name="fromBranchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabang Asal</FormLabel>
                  <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih cabang" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="toBranchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabang Tujuan</FormLabel>
                  <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih cabang" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {branches.filter((b) => b.id !== fromBranchId).map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="requestDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Permintaan</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Item</CardTitle>
                <Button type="button" variant="outline" size="sm"
                  onClick={() => append({ itemId: 0, unitId: 0, requestedQty: 1, notes: '' })}>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid items-end gap-3 rounded-lg border p-3 sm:grid-cols-12">
                  <FormField control={form.control} name={`items.${index}.itemId`} render={({ field: f }) => (
                    <FormItem className="sm:col-span-5">
                      <FormLabel className="text-xs">Item</FormLabel>
                      <FormControl>
                        <Combobox options={itemOptions} value={f.value ? String(f.value) : ''}
                          onChange={(v) => {
                            const id = Number(v);
                            f.onChange(id);
                            const unit = itemUnitMap.get(id);
                            if (unit) form.setValue(`items.${index}.unitId`, unit);
                          }}
                          placeholder="Pilih item" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.requestedQty`} render={({ field: f }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel className="text-xs">Jumlah</FormLabel>
                      <FormControl><Input type="number" step="0.001" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.unitId`} render={({ field: f }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel className="text-xs">Satuan</FormLabel>
                      <FormControl>
                        <Combobox options={unitOptions} value={f.value ? String(f.value) : ''} onChange={(v) => f.onChange(Number(v))} placeholder="Satuan" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="sm:col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => fields.length > 1 && remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea id="notes" placeholder="Catatan opsional..." {...form.register('notes')} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" disabled={createTransfer.isPending}>
              {createTransfer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Permintaan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
