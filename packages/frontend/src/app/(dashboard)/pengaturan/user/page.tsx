'use client';

import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2, MoreHorizontal, Pencil, UserX, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput, ROLES } from '@mbg/shared';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserList, useCreateUser, useUpdateUser } from '@/hooks/queries/use-users';
import { useAuthStore } from '@/stores/auth-store';

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

function EditUserDialog({ user, open, onOpenChange }: { user: User; open: boolean; onOpenChange: (v: boolean) => void }) {
  const updateUser = useUpdateUser();
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: user.name, email: user.email, role: user.role as UpdateUserInput['role'] },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: user.name, email: user.email, role: user.role as UpdateUserInput['role'] });
    }
  }, [open, user, form]);

  const onSubmit = (data: UpdateUserInput) => {
    updateUser.mutate({ id: user.id, data }, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Pengguna</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem><FormLabel>Role</FormLabel><FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.values(ROLES).map((r) => <SelectItem key={r} value={r}>{roleLabels[r] ?? r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={updateUser.isPending}>
              {updateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [toggleUser, setToggleUser] = useState<User | null>(null);
  const { data, isLoading } = useUserList({ page, perPage, search });
  const createUserMut = useCreateUser();
  const updateUser = useUpdateUser();
  const currentUser = useAuthStore((s) => s.user);
  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'OWNER';

  const createForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'ADMIN' as CreateUserInput['role'] },
  });

  const onCreateSubmit = (data: CreateUserInput) => {
    createUserMut.mutate(data, {
      onSuccess: () => { setCreateOpen(false); createForm.reset(); },
    });
  };

  const handleToggleActive = () => {
    if (!toggleUser) return;
    updateUser.mutate(
      { id: toggleUser.id, data: { isActive: !toggleUser.isActive } },
      { onSuccess: () => setToggleUser(null) },
    );
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
    ...(canEdit
      ? [{
          id: 'actions',
          header: 'Aksi',
          cell: ({ row }: { row: { original: User } }) => {
            const u = row.original;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Aksi</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditUser(u)}>
                    <Pencil className="mr-2 h-4 w-4" />Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setToggleUser(u)}>
                    {u.isActive
                      ? <><UserX className="mr-2 h-4 w-4" />Nonaktifkan</>
                      : <><UserCheck className="mr-2 h-4 w-4" />Aktifkan</>
                    }
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        } satisfies ColumnDef<User>]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengguna"
        description="Kelola pengguna sistem"
        action={
          canEdit ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Tambah Pengguna</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Tambah Pengguna</DialogTitle></DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <FormField control={createForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Nama *</FormLabel><FormControl><Input placeholder="Nama lengkap" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={createForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={createForm.control} name="password" render={({ field }) => (
                      <FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" placeholder="Min. 8 karakter" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={createForm.control} name="role" render={({ field }) => (
                      <FormItem><FormLabel>Role *</FormLabel><FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.values(ROLES).map((r) => <SelectItem key={r} value={r}>{roleLabels[r] ?? r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={createUserMut.isPending}>
                      {createUserMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Tambah
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={perPage} total={data?.meta?.total ?? 0} onPageChange={setPage} onPerPageChange={setPerPage} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Cari pengguna..." />

      {editUser && (
        <EditUserDialog user={editUser} open={!!editUser} onOpenChange={(v) => { if (!v) setEditUser(null); }} />
      )}

      <AlertDialog open={!!toggleUser} onOpenChange={(v) => { if (!v) setToggleUser(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleUser?.isActive ? 'Nonaktifkan' : 'Aktifkan'} Pengguna
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleUser?.isActive
                ? `Pengguna "${toggleUser?.name}" tidak akan bisa login setelah dinonaktifkan.`
                : `Pengguna "${toggleUser?.name}" akan bisa login kembali setelah diaktifkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleActive} disabled={updateUser.isPending}>
              {updateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {toggleUser?.isActive ? 'Nonaktifkan' : 'Aktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
