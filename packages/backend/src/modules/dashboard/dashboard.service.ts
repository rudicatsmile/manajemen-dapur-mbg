import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayPurchases, lowStockCount, todayProductions, todayWaste, pendingPO] =
      await Promise.all([
        this.prisma.purchaseOrder.aggregate({
          _sum: { totalAmount: true },
          where: {
            poDate: { gte: today, lt: tomorrow },
            status: { not: 'CANCELLED' },
          },
        }),
        this.prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM items
          WHERE is_active = true AND current_stock <= min_stock
        `,
        this.prisma.production.count({
          where: { productionDate: { gte: today, lt: tomorrow } },
        }),
        this.prisma.wasteRecord.count({
          where: { wasteDate: { gte: today, lt: tomorrow } },
        }),
        this.prisma.purchaseOrder.count({
          where: { status: { in: ['DRAFT', 'PENDING_APPROVAL'] } },
        }),
      ]);

    return {
      todayPurchaseTotal: todayPurchases._sum.totalAmount || 0,
      lowStockCount: Number(lowStockCount[0].count),
      todayProductionsCount: todayProductions,
      todayWasteCount: todayWaste,
      pendingPOCount: pendingPO,
    };
  }

  async purchaseTrend() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await this.prisma.$queryRaw<any[]>`
      SELECT DATE(po_date) as date, SUM(total_amount) as total
      FROM purchase_orders
      WHERE po_date >= ${thirtyDaysAgo} AND status != 'CANCELLED'
      GROUP BY DATE(po_date)
      ORDER BY date ASC
    `;

    return data;
  }

  async topItems() {
    const data = await this.prisma.$queryRaw<any[]>`
      SELECT i.id, i.name, i.sku, SUM(poi.total_price) as total_value,
             SUM(poi.quantity) as total_quantity
      FROM purchase_order_items poi
      JOIN items i ON poi.item_id = i.id
      JOIN purchase_orders po ON poi.po_id = po.id
      WHERE po.status != 'CANCELLED'
      GROUP BY i.id, i.name, i.sku
      ORDER BY total_value DESC
      LIMIT 10
    `;

    return data;
  }

  async foodCost() {
    const recipes = await this.prisma.recipe.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        estimatedCost: true,
        sellingPrice: true,
        yieldQuantity: true,
        yieldUnit: true,
      },
    });

    return recipes.map((r) => {
      const cost = Number(r.estimatedCost);
      const price = Number(r.sellingPrice);
      const foodCostPct = price > 0 ? (cost / price) * 100 : 0;
      const margin = price - cost;

      return {
        id: r.id,
        name: r.name,
        costPerServing: cost,
        sellingPrice: price,
        foodCostPercentage: Math.round(foodCostPct * 100) / 100,
        margin,
      };
    });
  }
}
