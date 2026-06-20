'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierSchema, type CreateSupplierInput } from '@mbg/shared';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/queries/use-suppliers';

interface SupplierFormProps {
  initialData?: CreateSupplierInput & { id?: number };
  isEdit?: boolean;
}

export function SupplierForm({ initialData, isEdit }: SupplierFormProps) {
  const router = useRouter();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CreateSupplierInput>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      address: initialData?.address ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      contactPerson: initialData?.contactPerson ?? '',
      category: initialData?.category ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  const onSubmit = (data: CreateSupplierInput) => {
    if (isEdit && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data }, { onSuccess: () => router.push('/pembelian/supplier') });
    } else {
      createMutation.mutate(data, { onSuccess: () => router.push('/pembelian/supplier') });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Supplier *</FormLabel>
                  <FormControl><Input placeholder="Nama supplier" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl><Input placeholder="Contoh: Sayur, Daging" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl><Textarea placeholder="Alamat lengkap" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl><Input placeholder="08xxxxxxxxxx" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="email@contoh.com" type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="contactPerson" render={({ field }) => (
              <FormItem>
                <FormLabel>Kontak Person</FormLabel>
                <FormControl><Input placeholder="Nama kontak" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan</FormLabel>
                <FormControl><Textarea placeholder="Catatan tambahan" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Simpan Perubahan' : 'Tambah Supplier'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
