'use client';

import { use } from 'react';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecipe } from '@/hooks/queries/use-recipes';
import { formatRupiah } from '@/lib/utils';

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: recipe, isLoading } = useRecipe(Number(id));

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;
  if (!recipe) return <div>Resep tidak ditemukan</div>;

  const totalCost = recipe.items?.reduce((sum: number, i: { cost: number }) => sum + (i.cost ?? 0), 0) ?? 0;
  const costPerServing = recipe.yieldQuantity > 0 ? totalCost / recipe.yieldQuantity : 0;
  const foodCostPct = recipe.sellingPrice > 0 ? (costPerServing / recipe.sellingPrice) * 100 : 0;

  const foodCostColor = foodCostPct > 40 ? 'destructive' : foodCostPct > 30 ? 'warning' : 'success';

  return (
    <div className="space-y-6">
      <PageHeader
        title={recipe.name}
        description="Detail resep"
        action={<Button asChild><Link href={`/produksi/resep/baru`}><Edit className="mr-2 h-4 w-4" />Edit</Link></Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Informasi Resep</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Kategori:</span> <span className="font-medium">{recipe.category?.name}</span></div>
            <div><span className="text-muted-foreground">Hasil:</span> <span className="font-medium">{recipe.yieldQuantity} {recipe.yieldUnit}</span></div>
            <div><span className="text-muted-foreground">Harga Jual:</span> <span className="font-medium">{formatRupiah(recipe.sellingPrice ?? 0)}</span></div>
            <div><span className="text-muted-foreground">Biaya per Porsi:</span> <span className="font-medium">{formatRupiah(costPerServing)}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Food Cost:</span>
              <Badge variant={foodCostColor as 'destructive' | 'warning' | 'success'}>{foodCostPct.toFixed(1)}%</Badge>
            </div>
            {recipe.description && <div><span className="text-muted-foreground">Deskripsi:</span> <span className="font-medium">{recipe.description}</span></div>}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Bahan-bahan</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Biaya</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipe.items?.map((item: { id: number; item?: { name: string }; quantity: number; unit?: { name: string }; cost: number }) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item?.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit?.name}</TableCell>
                    <TableCell>{formatRupiah(item.cost ?? 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">Total Biaya</TableCell>
                  <TableCell className="font-bold">{formatRupiah(totalCost)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
