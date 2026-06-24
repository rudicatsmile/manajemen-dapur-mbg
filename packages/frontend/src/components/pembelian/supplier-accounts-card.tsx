'use client';

import { useState } from 'react';
import { Plus, Loader2, KeyRound, UserX, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierUserSchema, type CreateSupplierUserInput } from '@mbg/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  useSupplierAccounts, useCreateSupplierAccount, useUpdateSupplierAccount,
} from '@/hooks/queries/use-supplier-accounts';

function formatDate(value: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export function SupplierAccountsCard({ supplierId }: { supplierId: number }) {
  const { data: accounts, isLoading } = useSupplierAccounts(supplierId);
  const createAccount = useCreateSupplierAccount(supplierId);
  const updateAccount = useUpdateSupplierAccount(supplierId);
  const [open, setOpen] = useState(false);
  const [resetFor, setResetFor] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const form = useForm<CreateSupplierUserInput>({
    resolver: zodResolver(createSupplierUserSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onCreate = (data: CreateSupplierUserInput) => {
    createAccount.mutate(data, { onSuccess: () => { setOpen(false); form.reset(); } });
  };

  const handleResetPassword = () => {
    if (resetFor === null || newPassword.length < 8) return;
    updateAccount.mutate(
      { accountId: resetFor, data: { password: newPassword } },
      { onSuccess: () => { setResetFor(null); setNewPassword(''); } },
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Akun Portal Supplier</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" />Buat Akun</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Buat Akun Portal Supplier</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nama *</FormLabel><FormControl><Input placeholder="Nama kontak supplier" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="vendor@perusahaan.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem><FormLabel>Password Awal *</FormLabel><FormControl><Input type="password" placeholder="Min. 8 karakter" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createAccount.isPending}>
                  {createAccount.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Buat Akun
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Memuat...</div>
        ) : !accounts || accounts.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Belum ada akun. Buat akun agar supplier bisa login ke portal.
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{acc.name}</span>
                    <Badge variant={acc.isActive ? 'success' : 'secondary'}>{acc.isActive ? 'Aktif' : 'Nonaktif'}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{acc.email}</div>
                  <div className="text-xs text-muted-foreground">Login terakhir: {formatDate(acc.lastLoginAt)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setResetFor(acc.id); setNewPassword(''); }}>
                    <KeyRound className="mr-2 h-4 w-4" />Reset Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updateAccount.isPending}
                    onClick={() => updateAccount.mutate({ accountId: acc.id, data: { isActive: !acc.isActive } })}
                  >
                    {acc.isActive
                      ? <><UserX className="mr-2 h-4 w-4" />Nonaktifkan</>
                      : <><UserCheck className="mr-2 h-4 w-4" />Aktifkan</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={resetFor !== null} onOpenChange={(v) => { if (!v) { setResetFor(null); setNewPassword(''); } }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Reset Password</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <FormLabel>Password Baru</FormLabel>
              <Input type="password" placeholder="Min. 8 karakter" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-xs text-destructive">Password minimal 8 karakter</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setResetFor(null); setNewPassword(''); }}>Batal</Button>
              <Button onClick={handleResetPassword} disabled={newPassword.length < 8 || updateAccount.isPending}>
                {updateAccount.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
