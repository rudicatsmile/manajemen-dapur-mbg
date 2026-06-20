'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWasteSchema, type CreateWasteInput, WASTE_CATEGORY } from '@mbg/shared';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/shared/combobox';
import { useItemList } from '@/hooks/queries/use-items';
import { useUnitList } from '@/hooks/queries/use-units';
import { useCreateWaste } from '@/hooks/queries/use-wastes';
import { formatDateInput } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  EXPIRED: 'Kadaluarsa',
  DAMAGED: 'Rusak',
  SPILLED: 'Tumpah',
  PRODUCTION_LEFTOVER: 'Sisa Produksi',
  OTHER: 'Lainnya',
};

export default function CreateWastePage() {
  const router = useRouter();
  const createMutation = useCreateWaste();
  const { data: itemsData } = useItemList({ perPage: 200 });
  const { data: unitsData } = useUnitList({ perPage: 100 });
  const items = (itemsData?.data ?? []).map((i: { id: number; name: string }) => ({ value: String(i.id), label: i.name }));
  const units = (unitsData?.data ?? []).map((u: { id: number; name: string }) => ({ value: String(u.id), label: u.name }));

  const form = useForm<CreateWasteInput>({
    resolver: zodResolver(createWasteSchema),
    defaultValues: {
      itemId: 0,
      quantity: 1,
      unitId: 0,
      category: 'OTHER' as CreateWasteInput['category'],
      wasteDate: formatDateInput(new Date()),
      notes: '',
    },
  });

  const onSubmit = (data: CreateWasteInput) => {
    createMutation.mutate(data, { onSuccess: () => router.push('/produksi/waste') });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Catat Waste" description="Catat waste/pemborosan bahan" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="itemId" render={({ field }) => (
                  <FormItem><FormLabel>Item *</FormLabel><FormControl>
                    <Combobox options={items} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(Number(v))} placeholder="Pilih item" />
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem><FormLabel>Jumlah *</FormLabel><FormControl><Input type="number" min={1} step="any" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="unitId" render={({ field }) => (
                  <FormItem><FormLabel>Satuan *</FormLabel><FormControl>
                    <Combobox options={units} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(Number(v))} placeholder="Pilih satuan" />
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Kategori *</FormLabel><FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                      <SelectContent>
                        {Object.values(WASTE_CATEGORY).map((c) => <SelectItem key={c} value={c}>{categoryLabels[c] ?? c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="wasteDate" render={({ field }) => (
                  <FormItem><FormLabel>Tanggal *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Textarea placeholder="Catatan waste" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
