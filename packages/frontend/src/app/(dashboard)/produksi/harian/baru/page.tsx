'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductionSchema, type CreateProductionInput } from '@mbg/shared';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { useRecipeList } from '@/hooks/queries/use-recipes';
import { useCreateProduction, useCheckStock } from '@/hooks/queries/use-productions';
import { formatDateInput } from '@/lib/utils';

export default function CreateProductionPage() {
  const router = useRouter();
  const createMutation = useCreateProduction();
  const { data: recipesData } = useRecipeList({ perPage: 100 });
  const recipes = (recipesData?.data ?? []).map((r: { id: number; name: string }) => ({ value: String(r.id), label: r.name }));

  const form = useForm<CreateProductionInput>({
    resolver: zodResolver(createProductionSchema),
    defaultValues: {
      recipeId: 0,
      productionDate: formatDateInput(new Date()),
      plannedQty: 1,
      notes: '',
      forceCreate: false,
    },
  });

  const recipeId = form.watch('recipeId');
  const qty = form.watch('plannedQty');
  const { data: stockCheck } = useCheckStock(recipeId, qty);

  const onSubmit = (data: CreateProductionInput) => {
    createMutation.mutate(data, { onSuccess: () => router.push('/produksi/harian') });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Buat Produksi" description="Catat produksi harian" />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="recipeId" render={({ field }) => (
                  <FormItem><FormLabel>Resep *</FormLabel><FormControl>
                    <Combobox options={recipes} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(Number(v))} placeholder="Pilih resep" />
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="productionDate" render={({ field }) => (
                  <FormItem><FormLabel>Tanggal Produksi *</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="plannedQty" render={({ field }) => (
                  <FormItem><FormLabel>Jumlah *</FormLabel><FormControl><Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              {stockCheck && stockCheck.warnings?.length > 0 && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-800 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    Peringatan Stok
                  </div>
                  {stockCheck.warnings.map((w: { itemName: string; required: number; available: number }, i: number) => (
                    <p key={i} className="text-sm text-yellow-700">
                      {w.itemName}: dibutuhkan {w.required}, tersedia {w.available}
                    </p>
                  ))}
                </div>
              )}

              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Catatan</FormLabel><FormControl><Textarea placeholder="Catatan produksi" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Buat Produksi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
