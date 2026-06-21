'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useSeasonalFactors,
  useCreateSeasonalFactor,
  useUpdateSeasonalFactor,
  useDeleteSeasonalFactor,
} from '@/hooks/queries/use-forecasting';
import { useCategoryList } from '@/hooks/queries/use-categories';
import { formatDate } from '@/lib/utils';

interface SeasonalFactor {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  scope: string;
  categoryId: number | null;
  categoryName?: string;
  isActive: boolean;
  notes: string | null;
}

interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  multiplier: string;
  scope: string;
  categoryId: string;
  notes: string;
}

const emptyForm: FormData = {
  name: '',
  startDate: '',
  endDate: '',
  multiplier: '1.0',
  scope: 'GLOBAL',
  categoryId: '',
  notes: '',
};

function isCurrentlyActive(factor: SeasonalFactor): boolean {
  if (!factor.isActive) return false;
  const now = new Date();
  return new Date(factor.startDate) <= now && new Date(factor.endDate) >= now;
}

function formatMultiplier(m: number): string {
  const pct = Math.round((m - 1) * 100);
  if (pct === 0) return 'Normal';
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

export default function SeasonalFactorsPage() {
  const { data: factors, isLoading } = useSeasonalFactors();
  const { data: categoriesData } = useCategoryList({ type: 'RECIPE', perPage: 100 });
  const createMutation = useCreateSeasonalFactor();
  const updateMutation = useUpdateSeasonalFactor();
  const deleteMutation = useDeleteSeasonalFactor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const categories = categoriesData?.data ?? categoriesData ?? [];

  const list: SeasonalFactor[] = Array.isArray(factors) ? factors : [];

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(factor: SeasonalFactor) {
    setEditId(factor.id);
    setForm({
      name: factor.name,
      startDate: factor.startDate.split('T')[0] ?? '',
      endDate: factor.endDate.split('T')[0] ?? '',
      multiplier: String(factor.multiplier),
      scope: factor.scope,
      categoryId: factor.categoryId ? String(factor.categoryId) : '',
      notes: factor.notes ?? '',
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    const payload = {
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      multiplier: parseFloat(form.multiplier),
      scope: form.scope,
      categoryId: form.scope === 'CATEGORY' && form.categoryId ? Number(form.categoryId) : undefined,
      notes: form.notes || undefined,
    };

    if (editId) {
      updateMutation.mutate(
        { id: editId, data: payload },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  }

  function handleDelete() {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faktor Musiman"
        description="Kelola faktor penyesuaian prediksi untuk event atau musim tertentu"
      />

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Faktor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tanggal Mulai</TableHead>
                  <TableHead>Tanggal Selesai</TableHead>
                  <TableHead className="text-center">Multiplier</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Belum ada faktor musiman
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((factor) => (
                    <TableRow key={factor.id}>
                      <TableCell className="font-medium">{factor.name}</TableCell>
                      <TableCell>{formatDate(factor.startDate)}</TableCell>
                      <TableCell>{formatDate(factor.endDate)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={factor.multiplier > 1 ? 'warning' : factor.multiplier < 1 ? 'default' : 'secondary'}>
                          {formatMultiplier(factor.multiplier)}
                        </Badge>
                      </TableCell>
                      <TableCell>{factor.scope === 'GLOBAL' ? 'Global' : 'Per Kategori'}</TableCell>
                      <TableCell>{factor.categoryName ?? '-'}</TableCell>
                      <TableCell>
                        {isCurrentlyActive(factor) ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : factor.isActive ? (
                          <Badge variant="secondary">Terjadwal</Badge>
                        ) : (
                          <Badge variant="outline">Nonaktif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(factor)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(factor.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Faktor Musiman' : 'Tambah Faktor Musiman'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                placeholder="Contoh: Ramadan, Natal, Tahun Baru"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="multiplier">Multiplier</Label>
              <Input
                id="multiplier"
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={form.multiplier}
                onChange={(e) => setForm({ ...form, multiplier: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                1.0 = normal, 1.5 = naik 50%, 0.5 = turun 50%
              </p>
            </div>
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={form.scope} onValueChange={(v) => setForm({ ...form, scope: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLOBAL">Global</SelectItem>
                  <SelectItem value="CATEGORY">Per Kategori</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.scope === 'CATEGORY' && (
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(categories) ? categories : []).map((cat: { id: number; name: string }) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan (opsional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving || !form.name || !form.startDate || !form.endDate}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Faktor Musiman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus faktor musiman ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
