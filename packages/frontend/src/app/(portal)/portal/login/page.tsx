'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierLoginSchema, type SupplierLoginInput } from '@mbg/shared';
import { Store, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupplierLogin } from '@/hooks/queries/use-supplier-auth';

export default function PortalLoginPage() {
  const router = useRouter();
  const login = useSupplierLogin();

  const form = useForm<SupplierLoginInput>({
    resolver: zodResolver(supplierLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: SupplierLoginInput) => {
    login.mutate(data, {
      onSuccess: () => router.push('/portal/dashboard'),
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Portal Supplier</CardTitle>
        <CardDescription>Masuk untuk melihat PO, kirim invoice, dan kelola harga</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="vendor@perusahaan.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Staf internal?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
