'use client';

import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategoryList, useCreateCategory, useUpdateCategory } from '@/hooks/queries/use-categories';

interface Category {
  id: number;
  name: string;
  type: string;
}

export default function CategoryManagementPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [catType, setCatType] = useState('ITEM');
  const { data, isLoading } = useCategoryList({ page, type: type || undefined });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const columns: ColumnDef<Category>[] = [
    { accessorKey: 'name', header: 'Nama' },
    { accessorKey: 'type', header: 'Tipe', cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => { setEditItem(row.original); setName(row.original.name); setCatType(row.original.type); setOpen(true); }}>
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (editItem) {
      updateCategory.mutate({ id: editItem.id, data: { name } }, { onSuccess: () => { setOpen(false); setEditItem(null); setName(''); } });
    } else {
      createCategory.mutate({ name, type: catType }, { onSuccess: () => { setOpen(false); setName(''); } });
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori"
        description="Kelola kategori item dan resep"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditItem(null); setName(''); } }}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Tambah Kategori</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editItem ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kategori" />
                </div>
                {!editItem && (
                  <div className="space-y-2">
                    <Label>Tipe *</Label>
                    <Select value={catType} onValueChange={setCatType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ITEM">Item</SelectItem>
                        <SelectItem value="RECIPE">Resep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editItem ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <Tabs value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="">Semua</TabsTrigger>
          <TabsTrigger value="ITEM">Item</TabsTrigger>
          <TabsTrigger value="RECIPE">Resep</TabsTrigger>
        </TabsList>
      </Tabs>
      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading} currentPage={page} totalPages={data?.meta?.totalPages ?? 1} perPage={20} total={data?.meta?.total ?? 0} onPageChange={setPage} />
    </div>
  );
}
