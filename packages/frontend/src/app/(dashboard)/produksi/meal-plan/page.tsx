'use client';

import { useState, useMemo, useCallback } from 'react';
import { addDays, startOfWeek, format, parseISO, isToday } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  ChevronLeft, ChevronRight, Plus, ShoppingCart, ClipboardCheck,
  AlertTriangle, X, CheckCircle2, XCircle, Loader2, LayoutTemplate,
  Save, Zap, CalendarDays,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/utils';
import {
  useMealPlans, useMealPlan, useCreateMealPlan, useUpdateMealPlan,
  useDeleteMealPlan, useActivateMealPlan, useCompleteMealPlan,
  useMealPlanStockCheck, useGenerateShoppingList,
  useMealPlanTemplates, useSaveAsTemplate, useApplyTemplate,
} from '@/hooks/queries/use-meal-plans';
import { useRecipeList } from '@/hooks/queries/use-recipes';

const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

interface MealPlanItem {
  id?: number;
  recipeId: number;
  dayOfWeek: number;
  portions: number;
  sortOrder?: number;
  notes?: string;
  recipe?: {
    id: number;
    name: string;
    category?: { name: string };
    estimatedCost?: number;
    sellingPrice?: number;
    yieldQuantity?: number;
  };
}

interface StockCheckItem {
  itemId: number;
  itemName: string;
  sku: string;
  unit: string;
  totalNeeded: number;
  currentStock: number;
  surplus: number;
  deficit: number;
}

interface ShoppingListResult {
  createdPOs: Array<{ id: number; poNumber: string; supplier: string; totalAmount: number; itemCount: number }>;
  totalItems: number;
  totalValue: number;
}

interface TemplateItem {
  id: number;
  name: string;
  description?: string;
  isDefault: boolean;
  itemCount: number;
  createdAt: string;
}

function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  return `${format(weekStart, 'd', { locale: idLocale })} - ${format(weekEnd, 'd MMM yyyy', { locale: idLocale })}`;
}

function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

const STATUS_MAP: Record<string, { label: string; variant: 'secondary' | 'default' | 'destructive' | 'outline' }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  ACTIVE: { label: 'Aktif', variant: 'default' },
  COMPLETED: { label: 'Selesai', variant: 'outline' },
};

export default function MealPlanPage() {
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(new Date()));
  const weekStartStr = formatDateISO(currentWeek);

  // Dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddMenuDialog, setShowAddMenuDialog] = useState(false);
  const [showEditMenuDialog, setShowEditMenuDialog] = useState(false);
  const [showStockCheckDialog, setShowStockCheckDialog] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [showShoppingConfirm, setShowShoppingConfirm] = useState(false);
  const [showShoppingResult, setShowShoppingResult] = useState(false);
  const [shoppingResult, setShoppingResult] = useState<ShoppingListResult | null>(null);
  const [showApplyTemplateDialog, setShowApplyTemplateDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  // Form states
  const [createName, setCreateName] = useState('');
  const [createMaxPortions, setCreateMaxPortions] = useState('');
  const [addMenuDay, setAddMenuDay] = useState(0);
  const [addMenuRecipeId, setAddMenuRecipeId] = useState('');
  const [addMenuPortions, setAddMenuPortions] = useState('');
  const [addMenuNotes, setAddMenuNotes] = useState('');
  const [editItem, setEditItem] = useState<MealPlanItem | null>(null);
  const [editPortions, setEditPortions] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [recipeSearch, setRecipeSearch] = useState('');

  // Queries
  const { data: plansData, isLoading: plansLoading } = useMealPlans({ status: undefined, page: 1 });
  const plans = plansData?.data ?? [];
  const currentPlan = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return plans.find((p: any) => p.weekStartDate?.startsWith(weekStartStr));
  }, [plans, weekStartStr]);
  const planId = currentPlan?.id ?? null;

  const { data: planDetail, isLoading: detailLoading } = useMealPlan(planId);
  const { data: recipes } = useRecipeList({ page: 1, perPage: 200 });
  const recipeList = recipes?.data ?? [];
  const { data: templates } = useMealPlanTemplates();
  const templateList: TemplateItem[] = templates ?? [];

  // Mutations
  const createMealPlan = useCreateMealPlan();
  const updateMealPlan = useUpdateMealPlan();
  const deleteMealPlan = useDeleteMealPlan();
  const activateMealPlan = useActivateMealPlan();
  const completeMealPlan = useCompleteMealPlan();
  const generateShoppingList = useGenerateShoppingList();
  const saveAsTemplate = useSaveAsTemplate();
  const applyTemplate = useApplyTemplate();

  const items: MealPlanItem[] = planDetail?.items ?? [];
  const status: string = planDetail?.status ?? currentPlan?.status ?? '';
  const maxPortionsPerDay: number = planDetail?.maxPortionsPerDay ?? 0;
  const isReadOnly = status === 'COMPLETED';

  const itemsByDay = useMemo(() => {
    const map: Record<number, MealPlanItem[]> = {};
    for (let d = 0; d < 7; d++) map[d] = [];
    for (const item of items) {
      if (!map[item.dayOfWeek]) map[item.dayOfWeek] = [];
      map[item.dayOfWeek].push(item);
    }
    return map;
  }, [items]);

  const dayPortions = useMemo(() => {
    const result: Record<number, number> = {};
    for (let d = 0; d < 7; d++) {
      result[d] = (itemsByDay[d] ?? []).reduce((sum, i) => sum + i.portions, 0);
    }
    return result;
  }, [itemsByDay]);

  // Week nav
  const prevWeek = () => setCurrentWeek(addDays(currentWeek, -7));
  const nextWeek = () => setCurrentWeek(addDays(currentWeek, 7));

  // Create plan
  const handleCreate = () => {
    if (!createName.trim()) return;
    createMealPlan.mutate({
      name: createName.trim(),
      weekStartDate: weekStartStr,
      maxPortionsPerDay: createMaxPortions ? parseInt(createMaxPortions, 10) : undefined,
      items: [],
    }, {
      onSuccess: () => {
        setShowCreateDialog(false);
        setCreateName('');
        setCreateMaxPortions('');
      },
    });
  };

  // Add menu item
  const handleAddMenu = () => {
    if (!addMenuRecipeId || !addMenuPortions || !planDetail) return;
    const newItems = [
      ...items.map((i) => ({
        recipeId: i.recipeId,
        dayOfWeek: i.dayOfWeek,
        portions: i.portions,
        sortOrder: i.sortOrder,
        notes: i.notes,
      })),
      {
        recipeId: parseInt(addMenuRecipeId, 10),
        dayOfWeek: addMenuDay,
        portions: parseInt(addMenuPortions, 10),
        notes: addMenuNotes || undefined,
      },
    ];
    updateMealPlan.mutate({ id: planDetail.id, data: { items: newItems } }, {
      onSuccess: () => {
        setShowAddMenuDialog(false);
        setAddMenuRecipeId('');
        setAddMenuPortions('');
        setAddMenuNotes('');
      },
    });
  };

  // Edit menu item
  const openEditMenu = (item: MealPlanItem) => {
    setEditItem(item);
    setEditPortions(String(item.portions));
    setEditNotes(item.notes ?? '');
    setShowEditMenuDialog(true);
  };

  const handleEditMenu = () => {
    if (!editItem || !planDetail) return;
    const newItems = items.map((i) => {
      const base = { recipeId: i.recipeId, dayOfWeek: i.dayOfWeek, portions: i.portions, sortOrder: i.sortOrder, notes: i.notes };
      if (i === editItem) {
        return { ...base, portions: parseInt(editPortions, 10), notes: editNotes || undefined };
      }
      return base;
    });
    updateMealPlan.mutate({ id: planDetail.id, data: { items: newItems } }, {
      onSuccess: () => {
        setShowEditMenuDialog(false);
        setEditItem(null);
      },
    });
  };

  // Delete menu item
  const handleDeleteMenuItem = (itemToRemove: MealPlanItem) => {
    if (!planDetail) return;
    const newItems = items
      .filter((i) => i !== itemToRemove)
      .map((i) => ({
        recipeId: i.recipeId, dayOfWeek: i.dayOfWeek, portions: i.portions,
        sortOrder: i.sortOrder, notes: i.notes,
      }));
    updateMealPlan.mutate({ id: planDetail.id, data: { items: newItems } });
  };

  // Shopping list
  const handleGenerateShoppingList = () => {
    if (!planDetail) return;
    generateShoppingList.mutate(planDetail.id, {
      onSuccess: (data) => {
        setShoppingResult(data);
        setShowShoppingConfirm(false);
        setShowShoppingResult(true);
      },
    });
  };

  // Save template
  const handleSaveTemplate = () => {
    if (!planDetail || !templateName.trim()) return;
    saveAsTemplate.mutate({
      planId: planDetail.id,
      name: templateName.trim(),
      description: templateDesc || undefined,
    }, {
      onSuccess: () => {
        setShowSaveTemplateDialog(false);
        setTemplateName('');
        setTemplateDesc('');
      },
    });
  };

  // Apply template
  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    applyTemplate.mutate({ templateId: selectedTemplateId, weekStartDate: weekStartStr }, {
      onSuccess: () => {
        setShowApplyTemplateDialog(false);
        setSelectedTemplateId(null);
      },
    });
  };

  const filteredRecipes = useMemo(() => {
    if (!recipeSearch) return recipeList;
    const q = recipeSearch.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return recipeList.filter((r: any) => r.name?.toLowerCase().includes(q));
  }, [recipeList, recipeSearch]);

  const isLoading = plansLoading || (planId && detailLoading);

  const statusInfo = STATUS_MAP[status];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meal Prep Planner"
        description="Jadwal produksi mingguan"
        action={
          statusInfo && (
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          )
        }
      />

      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Week navigator */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[180px] text-center text-sm font-medium">
            {formatWeekLabel(currentWeek)}
          </span>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        {/* Template controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Terapkan Template
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {templateList.length === 0 && (
              <DropdownMenuItem disabled>Belum ada template</DropdownMenuItem>
            )}
            {templateList.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  setShowApplyTemplateDialog(true);
                }}
              >
                {t.name} ({t.itemCount} item)
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {planDetail && (
          <Button variant="outline" size="sm" onClick={() => setShowSaveTemplateDialog(true)}>
            <Save className="mr-2 h-4 w-4" />
            Simpan Template
          </Button>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        {!planId && !isLoading && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Jadwal Baru
          </Button>
        )}

        {planDetail && status === 'DRAFT' && (
          <Button
            variant="default"
            size="sm"
            onClick={() => activateMealPlan.mutate(planDetail.id)}
            disabled={activateMealPlan.isPending}
          >
            <Zap className="mr-2 h-4 w-4" />
            Aktifkan
          </Button>
        )}

        {planDetail && status === 'ACTIVE' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => completeMealPlan.mutate(planDetail.id)}
            disabled={completeMealPlan.isPending}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Selesai
          </Button>
        )}

        {planDetail && (
          <>
            <Button variant="outline" size="sm" onClick={() => setShowStockCheckDialog(true)}>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Cek Stok
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowShoppingConfirm(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buat Daftar Belanja
            </Button>
          </>
        )}
      </div>

      {/* Weekly Board */}
      {isLoading ? (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : !planId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <CalendarDays className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Belum ada jadwal untuk minggu ini</p>
            <div className="flex gap-2">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Jadwal Baru
              </Button>
              {templateList.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Terapkan Template
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {templateList.map((t) => (
                      <DropdownMenuItem
                        key={t.id}
                        onClick={() => {
                          setSelectedTemplateId(t.id);
                          setShowApplyTemplateDialog(true);
                        }}
                      >
                        {t.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="grid grid-cols-7 gap-2 min-w-[1120px]">
            {DAY_NAMES.map((dayName, dayIndex) => {
              const dayDate = addDays(currentWeek, dayIndex);
              const isTodayCol = isToday(dayDate);
              const dayItems = itemsByDay[dayIndex] ?? [];
              const totalPortions = dayPortions[dayIndex] ?? 0;
              const overCapacity = maxPortionsPerDay > 0 && totalPortions > maxPortionsPerDay;
              const nearCapacity = maxPortionsPerDay > 0 && totalPortions >= maxPortionsPerDay * 0.8 && !overCapacity;

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'flex flex-col border rounded-lg min-w-[160px]',
                    isTodayCol && 'bg-primary/5 border-primary/30'
                  )}
                >
                  {/* Day header */}
                  <div className="p-2 border-b text-center">
                    <div className="font-semibold text-sm">{dayName}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(dayDate, 'd MMM', { locale: idLocale })}
                    </div>
                    <div className={cn(
                      'text-xs mt-1 flex items-center justify-center gap-1',
                      overCapacity && 'text-destructive font-semibold',
                      nearCapacity && 'text-yellow-600',
                    )}>
                      {overCapacity && <AlertTriangle className="h-3 w-3" />}
                      {totalPortions} porsi
                      {maxPortionsPerDay > 0 && ` / ${maxPortionsPerDay}`}
                    </div>
                  </div>

                  {/* Recipe cards */}
                  <div className="flex-1 p-2 space-y-2 min-h-[120px]">
                    {dayItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'relative rounded-md border p-2 text-xs bg-card hover:shadow-sm transition-shadow cursor-pointer',
                          'border-l-4 border-l-primary/60'
                        )}
                        onClick={() => !isReadOnly && openEditMenu(item)}
                      >
                        <div className="font-medium truncate">
                          {item.recipe?.name ?? `Resep #${item.recipeId}`}
                        </div>
                        <div className="text-muted-foreground mt-1">
                          {item.portions} porsi
                        </div>
                        {item.recipe?.estimatedCost !== undefined && item.recipe.estimatedCost > 0 && (
                          <div className="text-muted-foreground">
                            {formatRupiah(item.recipe.estimatedCost)}/porsi
                          </div>
                        )}
                        {!isReadOnly && (
                          <button
                            className="absolute top-1 right-1 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMenuItem(item);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add button */}
                  {!isReadOnly && planId && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          setAddMenuDay(dayIndex);
                          setShowAddMenuDialog(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Tambah Menu
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Jadwal Baru</DialogTitle>
            <DialogDescription>
              Buat jadwal meal plan untuk minggu {formatWeekLabel(currentWeek)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Jadwal</Label>
              <Input
                placeholder="Contoh: Jadwal Minggu ke-4 Juni"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
            </div>
            <div>
              <Label>Maks Porsi per Hari (opsional)</Label>
              <Input
                type="number"
                placeholder="Contoh: 200"
                value={createMaxPortions}
                onChange={(e) => setCreateMaxPortions(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={createMealPlan.isPending || !createName.trim()}>
              {createMealPlan.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Buat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Menu Dialog */}
      <Dialog open={showAddMenuDialog} onOpenChange={setShowAddMenuDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Menu - {DAY_NAMES[addMenuDay]}</DialogTitle>
            <DialogDescription>Pilih resep dan jumlah porsi</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Resep</Label>
              <Input
                placeholder="Cari resep..."
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                className="mb-2"
              />
              <Select value={addMenuRecipeId} onValueChange={setAddMenuRecipeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih resep" />
                </SelectTrigger>
                <SelectContent>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {filteredRecipes.map((r: any) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                      {r.estimatedCost ? ` (${formatRupiah(r.estimatedCost)}/porsi)` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Jumlah Porsi</Label>
              <Input
                type="number"
                min={1}
                placeholder="50"
                value={addMenuPortions}
                onChange={(e) => setAddMenuPortions(e.target.value)}
              />
            </div>
            <div>
              <Label>Catatan (opsional)</Label>
              <Textarea
                placeholder="Catatan tambahan..."
                value={addMenuNotes}
                onChange={(e) => setAddMenuNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMenuDialog(false)}>Batal</Button>
            <Button
              onClick={handleAddMenu}
              disabled={updateMealPlan.isPending || !addMenuRecipeId || !addMenuPortions}
            >
              {updateMealPlan.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={showEditMenuDialog} onOpenChange={setShowEditMenuDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>
              {editItem?.recipe?.name ?? ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Jumlah Porsi</Label>
              <Input
                type="number"
                min={1}
                value={editPortions}
                onChange={(e) => setEditPortions(e.target.value)}
              />
            </div>
            <div>
              <Label>Catatan (opsional)</Label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditMenuDialog(false)}>Batal</Button>
            <Button onClick={handleEditMenu} disabled={updateMealPlan.isPending || !editPortions}>
              {updateMealPlan.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Check Dialog */}
      <StockCheckDialog
        open={showStockCheckDialog}
        onOpenChange={setShowStockCheckDialog}
        planId={planId}
        onGenerateShoppingList={() => {
          setShowStockCheckDialog(false);
          setShowShoppingConfirm(true);
        }}
      />

      {/* Shopping List Confirm */}
      <AlertDialog open={showShoppingConfirm} onOpenChange={setShowShoppingConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Buat Daftar Belanja?</AlertDialogTitle>
            <AlertDialogDescription>
              Sistem akan membuat draft Purchase Order berdasarkan kebutuhan bahan yang kurang untuk meal plan ini. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerateShoppingList} disabled={generateShoppingList.isPending}>
              {generateShoppingList.isPending ? 'Memproses...' : 'Ya, Buat PO'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Shopping List Result */}
      <Dialog open={showShoppingResult} onOpenChange={setShowShoppingResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daftar Belanja Dibuat</DialogTitle>
            <DialogDescription>Purchase Order draft berhasil dibuat</DialogDescription>
          </DialogHeader>
          {shoppingResult && (
            <div className="space-y-3">
              <p className="text-sm">Total {shoppingResult.totalItems} item, nilai {formatRupiah(shoppingResult.totalValue)}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. PO</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Item</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shoppingResult.createdPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono text-xs">{po.poNumber}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell className="text-right">{po.itemCount}</TableCell>
                      <TableCell className="text-right">{formatRupiah(po.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowShoppingResult(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Simpan sebagai Template</DialogTitle>
            <DialogDescription>Simpan jadwal saat ini sebagai template yang bisa digunakan kembali</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Template</Label>
              <Input
                placeholder="Contoh: Jadwal Standar Weekday"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div>
              <Label>Deskripsi (opsional)</Label>
              <Textarea
                placeholder="Deskripsi template..."
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveTemplateDialog(false)}>Batal</Button>
            <Button onClick={handleSaveTemplate} disabled={saveAsTemplate.isPending || !templateName.trim()}>
              {saveAsTemplate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Template Dialog */}
      <AlertDialog open={showApplyTemplateDialog} onOpenChange={setShowApplyTemplateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terapkan Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Template akan diterapkan untuk minggu {formatWeekLabel(currentWeek)}. Jadwal baru akan dibuat dari template ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleApplyTemplate} disabled={applyTemplate.isPending}>
              {applyTemplate.isPending ? 'Menerapkan...' : 'Terapkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Stock Check Dialog component
function StockCheckDialog({
  open, onOpenChange, planId, onGenerateShoppingList,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  planId: number | null;
  onGenerateShoppingList: () => void;
}) {
  const { data: stockItems, isLoading } = useMealPlanStockCheck(open ? planId : null);
  const items: StockCheckItem[] = stockItems ?? [];
  const sufficient = items.filter((i) => i.deficit <= 0);
  const deficit = items.filter((i) => i.deficit > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cek Ketersediaan Stok</DialogTitle>
          <DialogDescription>
            {!isLoading && items.length > 0 && (
              <span>{sufficient.length} item cukup, {deficit.length} item kekurangan</span>
            )}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Tidak ada data</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Kebutuhan</TableHead>
                <TableHead className="text-right">Stok Saat Ini</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell>
                    <div className="font-medium text-sm">{item.itemName}</div>
                    {item.sku && <div className="text-xs text-muted-foreground">{item.sku}</div>}
                  </TableCell>
                  <TableCell className="text-right">{item.totalNeeded} {item.unit}</TableCell>
                  <TableCell className="text-right">{item.currentStock} {item.unit}</TableCell>
                  <TableCell>
                    {item.deficit > 0 ? (
                      <span className="flex items-center gap-1 text-destructive text-sm">
                        <XCircle className="h-4 w-4" />
                        Kurang {item.deficit}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Cukup
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <DialogFooter>
          {deficit.length > 0 && (
            <Button onClick={onGenerateShoppingList}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buat Daftar Belanja
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
