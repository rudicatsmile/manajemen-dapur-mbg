'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Users as UsersIcon, Building2, Power } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useBranchList, useBranch, useCreateBranch, useUpdateBranch, useDeactivateBranch, useSetBranchMembers,
} from '@/hooks/queries/use-branches';
import { useUserList } from '@/hooks/queries/use-users';

interface BranchRow {
  id: number;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  isDefault: boolean;
  memberCount: number;
  itemCount: number;
}

const emptyForm = { code: '', name: '', address: '', phone: '', isDefault: false };

export default function BranchManagementPage() {
  const { data: branches, isLoading } = useBranchList();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deactivateBranch = useDeactivateBranch();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [memberBranch, setMemberBranch] = useState<BranchRow | null>(null);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (b: BranchRow) => {
    setEditId(b.id);
    setForm({ code: b.code, name: b.name, address: b.address ?? '', phone: b.phone ?? '', isDefault: b.isDefault });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.code.trim() || !form.name.trim()) return;
    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      address: form.address || undefined,
      phone: form.phone || undefined,
      isDefault: form.isDefault,
    };
    if (editId) {
      updateBranch.mutate({ id: editId, data: payload }, { onSuccess: () => setOpen(false) });
    } else {
      createBranch.mutate(payload, { onSuccess: () => setOpen(false) });
    }
  };

  const columns: ColumnDef<BranchRow>[] = [
    { accessorKey: 'code', header: 'Kode' },
    {
      accessorKey: 'name',
      header: 'Nama Cabang',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.name}</span>
          {row.original.isDefault && <Badge variant="secondary">Default</Badge>}
        </div>
      ),
    },
    { accessorKey: 'memberCount', header: 'Anggota', cell: ({ row }) => `${row.original.memberCount} user` },
    { accessorKey: 'itemCount', header: 'Item Berstok', cell: ({ row }) => `${row.original.itemCount} item` },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) =>
        row.original.isActive ? <Badge variant="default">Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" title="Kelola anggota" onClick={() => setMemberBranch(row.original)}>
            <UsersIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Ubah" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          {row.original.isActive && !row.original.isDefault && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Nonaktifkan">
                  <Power className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nonaktifkan cabang {row.original.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cabang yang dinonaktifkan tidak akan muncul di pemilihan cabang. Data historis tetap tersimpan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deactivateBranch.mutate(row.original.id)}>
                    Nonaktifkan
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cabang"
        description="Kelola cabang dan penempatan pengguna"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Cabang
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? 'Ubah Cabang' : 'Tambah Cabang'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Kode Cabang</Label>
                <Input id="code" placeholder="CBG-01" value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Cabang</Label>
                <Input id="name" placeholder="Cabang Selatan" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" placeholder="Jl. ..." value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" placeholder="0812..." value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="isDefault" checked={form.isDefault}
                  onCheckedChange={(c) => setForm({ ...form, isDefault: c === true })} />
                <Label htmlFor="isDefault" className="font-normal">Jadikan cabang default</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button onClick={handleSubmit} disabled={createBranch.isPending || updateBranch.isPending}>
                Simpan
              </Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={columns} data={(branches as BranchRow[]) ?? []} isLoading={isLoading} />

      {memberBranch && (
        <MemberDialog branch={memberBranch} onClose={() => setMemberBranch(null)} />
      )}
    </div>
  );
}

function MemberDialog({ branch, onClose }: { branch: BranchRow; onClose: () => void }) {
  const { data: detail } = useBranch(branch.id);
  const { data: usersResp } = useUserList({ perPage: 100 });
  const setMembers = useSetBranchMembers();
  const [selected, setSelected] = useState<number[] | null>(null);

  const allUsers: Array<{ id: number; name: string; email: string; role: string }> = usersResp?.data ?? [];
  const currentMemberIds: number[] = (detail?.members ?? []).map((m: { id: number }) => m.id);
  const value = selected ?? currentMemberIds;

  const toggle = (userId: number) => {
    const next = value.includes(userId) ? value.filter((id) => id !== userId) : [...value, userId];
    setSelected(next);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Anggota — {branch.name}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[360px] space-y-2 overflow-y-auto">
          {allUsers.map((u) => (
            <label key={u.id} className="flex cursor-pointer items-center gap-3 rounded-md border p-2 hover:bg-muted/50">
              <Checkbox checked={value.includes(u.id)} onCheckedChange={() => toggle(u.id)} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{u.name}</span>
                <span className="text-xs text-muted-foreground">{u.email} · {u.role}</span>
              </div>
            </label>
          ))}
          {allUsers.length === 0 && <p className="text-sm text-muted-foreground">Tidak ada pengguna.</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button
            disabled={setMembers.isPending}
            onClick={() => setMembers.mutate({ id: branch.id, userIds: value }, { onSuccess: onClose })}
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
