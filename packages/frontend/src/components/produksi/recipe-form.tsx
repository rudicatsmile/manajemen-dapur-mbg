'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRecipeSchema, type CreateRecipeInput } from '@mbg/shared';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/shared/combobox';
import { useCategoryList } from '@/hooks/queries/use-categories';
import { useItemList } from '@/hooks/queries/use-items';
import { useUnitList } from '@/hooks/queries/use-units';
import { useCreateRecipe, useUpdateRecipe } from '@/hooks/queries/use-recipes';

interface RecipeFormProps {
  initialData?: CreateRecipeInput & { id?: number };
  isEdit?: boolean;
}

export function RecipeForm({ initialData, isEdit }: RecipeFormProps) {
  const router = useRouter();
  const createMutation = useCreateRecipe();
  const updateMutation = useUpdateRecipe();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const { data: categoriesData } = useCategoryList({ type: 'RECIPE', perPage: 100 });
  const { data: itemsData } = useItemList({ perPage: 200 });
  const { data: unitsData } = useUnitList({ perPage: 100 });

  const categories = (categoriesData?.data ?? []).map((c: { id: number; name: string }) => ({ value: String(c.id), label: c.name }));
  const items = (itemsData?.data ?? []).map((i: { id: number; name: string }) => ({ value: String(i.id), label: i.name }));
  const units = (unitsData?.data ?? []).map((u: { id: number; name: string }) => ({ value: String(u.id), label: u.name }));

  const form = useForm<CreateRecipeInput>({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      categoryId: initialData?.categoryId ?? 0,
      description: initialData?.description ?? '',
      yieldQuantity: initialData?.yieldQuantity ?? 1,
      yieldUnit: initialData?.yieldUnit ?? 'porsi',
      sellingPrice: initialData?.sellingPrice ?? 0,
      items: initialData?.items ?? [{ itemId: 0, quantity: 1, unitId: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });

  const onSubmit = (data: CreateRecipeInput) => {
    if (isEdit && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data }, { onSuccess: () => router.push('/produksi/resep') });
    } else {
      createMutation.mutate(data, { onSuccess: () => router.push('/produksi/resep') });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nama Resep *</FormLabel><FormControl><Input placeholder="Nama resep" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem><FormLabel>Kategori *</FormLabel><FormControl>
                  <Combobox options={categories} value={field.value ? String(field.value) : ''} onChange={(v) => field.onChange(Number(v))} placeholder="Pilih kategori" />
                </FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea placeholder="Deskripsi resep" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField control={form.control} name="yieldQuantity" render={({ field }) => (
                <FormItem><FormLabel>Hasil *</FormLabel><FormControl><Input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="yieldUnit" render={({ field }) => (
                <FormItem><FormLabel>Satuan Hasil</FormLabel><FormControl><Input placeholder="porsi" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="sellingPrice" render={({ field }) => (
                <FormItem><FormLabel>Harga Jual</FormLabel><FormControl><Input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Bahan-bahan</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ itemId: 0, quantity: 1, unitId: 0 })}>
                  <Plus className="mr-2 h-4 w-4" />Tambah Bahan
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="grid gap-3 sm:grid-cols-4 items-end border rounded-lg p-3">
                  <FormField control={form.control} name={`items.${index}.itemId`} render={({ field: f }) => (
                    <FormItem><FormLabel>Item</FormLabel><FormControl>
                      <Combobox options={items} value={f.value ? String(f.value) : ''} onChange={(v) => f.onChange(Number(v))} placeholder="Pilih item" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.quantity`} render={({ field: f }) => (
                    <FormItem><FormLabel>Qty</FormLabel><FormControl><Input type="number" min={0} step="any" {...f} onChange={(e) => f.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`items.${index}.unitId`} render={({ field: f }) => (
                    <FormItem><FormLabel>Satuan</FormLabel><FormControl>
                      <Combobox options={units} value={f.value ? String(f.value) : ''} onChange={(v) => f.onChange(Number(v))} placeholder="Satuan" />
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <div>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Simpan Perubahan' : 'Tambah Resep'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
