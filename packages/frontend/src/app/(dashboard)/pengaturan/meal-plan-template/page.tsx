'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { LayoutTemplate, Trash2, Play, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useMealPlanTemplates, useApplyTemplate, useDeleteTemplate,
} from '@/hooks/queries/use-meal-plans';

interface TemplateItem {
  id: number;
  name: string;
  description?: string;
  isDefault: boolean;
  itemCount: number;
  createdAt: string;
}

export default function MealPlanTemplatePage() {
  const { data: templates, isLoading } = useMealPlanTemplates();
  const templateList: TemplateItem[] = templates ?? [];
  const applyTemplate = useApplyTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [weekStartDate, setWeekStartDate] = useState('');

  const handleApply = () => {
    if (!selectedId || !weekStartDate) return;
    applyTemplate.mutate({ templateId: selectedId, weekStartDate }, {
      onSuccess: () => {
        setShowApplyDialog(false);
        setSelectedId(null);
        setWeekStartDate('');
      },
    });
  };

  const handleDelete = () => {
    if (!selectedId) return;
    deleteTemplate.mutate(selectedId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Meal Plan"
        description="Kelola template jadwal produksi yang bisa digunakan kembali"
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : templateList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <LayoutTemplate className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Belum ada template</p>
            <p className="text-sm text-muted-foreground">
              Buat template dari halaman Meal Prep Planner dengan tombol &ldquo;Simpan Template&rdquo;
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-center">Jumlah Item</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templateList.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.name}</span>
                      {t.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {t.description ?? '-'}
                  </TableCell>
                  <TableCell className="text-center">{t.itemCount}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(t.createdAt), 'd MMM yyyy', { locale: idLocale })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedId(t.id);
                          setShowApplyDialog(true);
                        }}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Terapkan
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedId(t.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Apply Template Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terapkan Template</DialogTitle>
            <DialogDescription>
              Pilih tanggal awal minggu untuk menerapkan template ini
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Tanggal Awal Minggu (Senin)</Label>
            <Input
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Batal</Button>
            <Button onClick={handleApply} disabled={applyTemplate.isPending || !weekStartDate}>
              {applyTemplate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Template yang dihapus tidak dapat dikembalikan. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteTemplate.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTemplate.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
