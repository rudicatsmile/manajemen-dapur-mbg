'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput, ROLES } from '@mbg/shared';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserList, useCreateUser } from '@/hooks/queries/use-users';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const roleLabels: Record<string, string> = {
  OWNER: 'Pemilik',
  ADMIN: 'Admin',
  PURCHASER: 'Purchasing',
  KITCHEN_MANAGER: 'Manajer Dapur',
};

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role', cell: ({ row }) => <Badge variant="outline">{roleLabels[row.original.role] ?? row.original.role}</Badge> },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => <Badge variant={row.original.isActive ? 'success' : 'secondary'}>{row.original.isActive ? 'Aktif' : 'Nonaktif'}</Badge>,
  },
];

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useUserList({ page, perPage, search });
  const createUser = useCreateUser();

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'ADMIN' as CreateUserInput['role'] },
  });

  const onSubmit = (data: CreateUserInput) => {
    createUser.mutate(data, {
      onSuccess: () => { setOpen(false); form.reset(); },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengguna"
        description="Kelola pengguna sistem"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Tambah Pengguna</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Tambah Pengguna</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nama *</FormLabel><FormControl><Input placeholder="Nama lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="Min. 8 karakter" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem><FormLabel>Role *</FormLabel><FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(ROLES).map((r) => <SelectItem key={r} value={r}>{roleLabels[r] ?? r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createUser.isPending}>
                    {createUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Tambah
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari pengguna..." />
    </div>
  );
}
