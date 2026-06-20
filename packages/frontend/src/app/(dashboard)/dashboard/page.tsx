'use client';

import { ShoppingCart, AlertTriangle, ChefHat, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';
import { useDashboardSummary } from '@/hooks/queries/use-dashboard';
import { useLowStock } from '@/hooks/queries/use-stock';
import { usePurchaseOrderList } from '@/hooks/queries/use-purchase-orders';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageHeader } from '@/components/layout/page-header';

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary();
  const { data: lowStockItems } = useLowStock();
  const { data: pendingPOs } = usePurchaseOrderList({ status: 'PENDING_APPROVAL', perPage: 5 });

  const cards = [
    { title: 'Total Pembelian Hari Ini', value: summary?.todayPurchase ?? 0, format: formatRupiah, icon: ShoppingCart, color: 'text-blue-600' },
    { title: 'Stok Rendah', value: summary?.lowStockCount ?? 0, icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Produksi Hari Ini', value: summary?.todayProduction ?? 0, icon: ChefHat, color: 'text-green-600' },
    { title: 'Waste Hari Ini', value: summary?.todayWaste ?? 0, icon: Trash2, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Ringkasan aktivitas dapur hari ini" />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {card.format ? card.format(card.value) : card.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stok Rendah</CardTitle>
          </CardHeader>
          <CardContent>
            {!lowStockItems?.length ? (
              <p className="text-sm text-muted-foreground">Tidak ada item dengan stok rendah</p>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((item: { id: number; name: string; currentStock: number; minStock: number; unit?: { abbreviation: string } }) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Min: {item.minStock} {item.unit?.abbreviation}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {item.currentStock} {item.unit?.abbreviation}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">PO Menunggu Persetujuan</CardTitle>
          </CardHeader>
          <CardContent>
            {!pendingPOs?.data?.length ? (
              <p className="text-sm text-muted-foreground">Tidak ada PO yang menunggu persetujuan</p>
            ) : (
              <div className="space-y-3">
                {pendingPOs.data.map((po: { id: number; poNumber: string; supplier?: { name: string }; totalAmount: number; status: string }) => (
                  <div key={po.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{po.poNumber}</p>
                      <p className="text-xs text-muted-foreground">{po.supplier?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatRupiah(po.totalAmount)}</p>
                      <StatusBadge status={po.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
