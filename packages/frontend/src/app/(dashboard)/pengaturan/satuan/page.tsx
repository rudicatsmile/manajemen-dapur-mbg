'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUnitList, useCreateUnit, useUpdateUnit } from '@/hooks/queries/use-units';

interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}

export default function UnitManagementPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Unit | null>(null);
  const [name, setName] = useState('');
  const [abbr, setAbbr] = useState('');
  const { data, isLoading } = useUnitList({ page });
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();

  const columns: ColumnDef<Unit>[] = [
    { accessorKey: 'name', header: 'Nama' },
    { accessorKey: 'abbreviation', header: 'Singkatan' },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => { setEditItem(row.original); setName(row.original.name); setAbbr(row.original.abbreviation); setOpen(true); }}>
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleSubmit = () => {
    if (!name.trim() || !abbr.trim()) return;
    if (editItem) {
      updateUnit.mutate({ id: editItem.id, data: { name, abbreviation: abbr } }, { onSuccess: () => { setOpen(false); setEditItem(null); setName(''); setAbbr(''); } });
    } else {
      createUnit.mutate({ name, abbreviation: abbr }, { onSuccess: () => { setOpen(false); setName(''); setAbbr(''); } });
    }
  };

  const isPending = createUnit.isPending || updateUnit.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Satuan"
        description="Kelola satuan ukuran"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); setName(''); setAbbr(''); } }}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Tambah Satuan</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editItem ? 'Edit Satuan' : 'Tambah Satuan'}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Kilogram" />
                </div>
                <div className="space-y-2">
                  <Label>Singkatan *</Label>
                  <Input value={abbr} onChange={(e) => setAbbr(e.target.value)} placeholder="Contoh: kg" />
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editItem ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={20} total={data?.meta?.total ?? 0} onPageChange={setPage} />
    </div>
  );
}
