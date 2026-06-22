import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary(branchId: number | null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const branchFilter = branchId ? { branchId } : {};

    const [todayPurchases, lowStockCount, todayProductions, todayWaste, pendingPO] =
      await Promise.all([
        this.prisma.purchaseOrder.aggregate({
          _sum: { totalAmount: true },
          where: {
            poDate: { gte: today, lt: tomorrow },
            status: { not: 'CANCELLED' },
            ...branchFilter,
          },
        }),
        this.prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM branch_stocks bs
          JOIN items i ON bs.item_id = i.id
          WHERE i.is_active = true AND bs.current_stock <= bs.min_stock
            AND (${branchId} IS NULL OR bs.branch_id = ${branchId})
        `,
        this.prisma.production.count({
          where: { productionDate: { gte: today, lt: tomorrow }, ...branchFilter },
        }),
        this.prisma.wasteRecord.count({
          where: { wasteDate: { gte: today, lt: tomorrow }, ...branchFilter },
        }),
        this.prisma.purchaseOrder.count({
          where: { status: { in: ['DRAFT', 'PENDING_APPROVAL'] }, ...branchFilter },
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

  async purchaseTrend(branchId: number | null) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await this.prisma.$queryRaw<any[]>`
      SELECT DATE(po_date) as date, SUM(total_amount) as total
      FROM purchase_orders
      WHERE po_date >= ${thirtyDaysAgo} AND status != 'CANCELLED'
        AND (${branchId} IS NULL OR branch_id = ${branchId})
      GROUP BY DATE(po_date)
      ORDER BY date ASC
    `;

    return data;
  }

  async topItems(branchId: number | null) {
    const data = await this.prisma.$queryRaw<any[]>`
      SELECT i.id, i.name, i.sku, SUM(poi.total_price) as total_value,
             SUM(poi.quantity) as total_quantity
      FROM purchase_order_items poi
      JOIN items i ON poi.item_id = i.id
      JOIN purchase_orders po ON poi.po_id = po.id
      WHERE po.status != 'CANCELLED'
        AND (${branchId} IS NULL OR po.branch_id = ${branchId})
      GROUP BY i.id, i.name, i.sku
      ORDER BY total_value DESC
      LIMIT 10
    `;

    return data;
  }

  async getMenuEngineering(from: string, to: string, branchId: number | null) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1); // inclusive end date

    // 1. Get all active recipes with their ingredients
    const recipes = await this.prisma.recipe.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            item: { select: { lastPrice: true } },
          },
        },
        category: { select: { name: true } },
      },
    });

    // 2. Get production volumes per recipe for the date range
    const productions = await this.prisma.production.groupBy({
      by: ['recipeId'],
      _sum: { plannedQty: true },
      where: {
        status: 'COMPLETED',
        productionDate: { gte: fromDate, lt: toDate },
        ...(branchId ? { branchId } : {}),
      },
    });

    const productionMap = new Map(
      productions.map((p) => [p.recipeId, Number(p._sum.plannedQty || 0)]),
    );

    // 3. Build menu items with cost and production data
    const menuItems = recipes.map((recipe) => {
      const yieldQty = Number(recipe.yieldQuantity);
      const costPerServing =
        yieldQty > 0
          ? recipe.items.reduce((sum, ri) => {
              const ingredientCost =
                (Number(ri.quantity) / yieldQty) * Number(ri.item.lastPrice);
              return sum + ingredientCost;
            }, 0)
          : 0;

      const sellingPrice = Number(recipe.sellingPrice);
      const profitPerServing = sellingPrice - costPerServing;
      const foodCostPercentage =
        sellingPrice > 0 ? (costPerServing / sellingPrice) * 100 : 0;
      const totalProduced = productionMap.get(recipe.id) || 0;

      return {
        recipeId: recipe.id,
        recipeName: recipe.name,
        category: recipe.category.name,
        sellingPrice,
        costPerServing: Math.round(costPerServing * 100) / 100,
        foodCostPercentage: Math.round(foodCostPercentage * 100) / 100,
        profitPerServing: Math.round(profitPerServing * 100) / 100,
        totalProduced,
        classification: '' as 'STAR' | 'PUZZLE' | 'PLOW_HORSE' | 'DOG',
      };
    });

    // 4. Calculate medians
    const sortedPopularity = [...menuItems]
      .map((m) => m.totalProduced)
      .sort((a, b) => a - b);
    const sortedProfit = [...menuItems]
      .map((m) => m.profitPerServing)
      .sort((a, b) => a - b);

    const median = (arr: number[]) => {
      if (arr.length === 0) return 0;
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 !== 0
        ? arr[mid]
        : (arr[mid - 1] + arr[mid]) / 2;
    };

    const medianPopularity = median(sortedPopularity);
    const medianProfit = median(sortedProfit);

    // 5. Classify each menu item
    for (const item of menuItems) {
      if (
        item.totalProduced >= medianPopularity &&
        item.profitPerServing >= medianProfit
      ) {
        item.classification = 'STAR';
      } else if (
        item.totalProduced < medianPopularity &&
        item.profitPerServing >= medianProfit
      ) {
        item.classification = 'PUZZLE';
      } else if (
        item.totalProduced >= medianPopularity &&
        item.profitPerServing < medianProfit
      ) {
        item.classification = 'PLOW_HORSE';
      } else {
        item.classification = 'DOG';
      }
    }

    // 6. Build summary
    const summary = {
      starCount: menuItems.filter((m) => m.classification === 'STAR').length,
      puzzleCount: menuItems.filter((m) => m.classification === 'PUZZLE').length,
      plowHorseCount: menuItems.filter((m) => m.classification === 'PLOW_HORSE').length,
      dogCount: menuItems.filter((m) => m.classification === 'DOG').length,
      totalMenus: menuItems.length,
      averageFoodCost:
        menuItems.length > 0
          ? Math.round(
              (menuItems.reduce((s, m) => s + m.foodCostPercentage, 0) /
                menuItems.length) *
                100,
            ) / 100
          : 0,
    };

    return {
      data: {
        items: menuItems,
        thresholds: { medianPopularity, medianProfit },
        summary,
      },
    };
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
