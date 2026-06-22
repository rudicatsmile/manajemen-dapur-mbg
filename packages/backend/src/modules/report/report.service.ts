import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async purchaseReport(from: string, to: string) {
    const purchaseOrders = await this.prisma.purchaseOrder.findMany({
      where: {
        poDate: {
          gte: new Date(from),
          lte: new Date(to),
        },
        status: { not: 'CANCELLED' },
      },
      include: {
        supplier: true,
        items: { include: { item: true, unit: true } },
        creator: { select: { id: true, name: true } },
      },
      orderBy: { poDate: 'asc' },
    });

    const totalAmount = purchaseOrders.reduce(
      (sum, po) => sum + Number(po.totalAmount),
      0,
    );

    return { purchaseOrders, totalAmount, period: { from, to } };
  }

  async stockReport(date: string) {
    const items = await this.prisma.item.findMany({
      where: { isActive: true },
      include: { category: true, baseUnit: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    });

    return { items, date };
  }

  async productionReport(from: string, to: string) {
    const productions = await this.prisma.production.findMany({
      where: {
        productionDate: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      include: {
        recipe: true,
        items: { include: { item: true, unit: true } },
        creator: { select: { id: true, name: true } },
      },
      orderBy: { productionDate: 'asc' },
    });

    return { productions, period: { from, to } };
  }

  async wasteReport(from: string, to: string) {
    const wastes = await this.prisma.wasteRecord.findMany({
      where: {
        wasteDate: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      include: {
        item: true,
        unit: true,
        creator: { select: { id: true, name: true } },
      },
      orderBy: { wasteDate: 'asc' },
    });

    return { wastes, period: { from, to } };
  }

  /** Perbandingan performa antar cabang dalam rentang tanggal (Fase 3 multi-cabang). */
  async branchComparison(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const [branches, productions, wastes, purchases] = await Promise.all([
      this.prisma.branch.findMany({
        where: { isActive: true },
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
        select: { id: true, code: true, name: true },
      }),
      this.prisma.production.findMany({
        where: { status: 'COMPLETED', productionDate: { gte: fromDate, lte: toDate } },
        select: {
          branchId: true,
          plannedQty: true,
          actualQty: true,
          recipe: { select: { sellingPrice: true, estimatedCost: true } },
        },
      }),
      this.prisma.wasteRecord.findMany({
        where: { wasteDate: { gte: fromDate, lte: toDate } },
        select: { branchId: true, quantity: true, item: { select: { lastPrice: true } } },
      }),
      this.prisma.purchaseOrder.groupBy({
        by: ['branchId'],
        where: { poDate: { gte: fromDate, lte: toDate }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
    ]);

    const purchaseMap = new Map(purchases.map((p) => [p.branchId, Number(p._sum.totalAmount ?? 0)]));

    const rows = branches.map((b) => {
      let revenue = 0;
      let foodCost = 0;
      let portions = 0;
      for (const p of productions) {
        if (p.branchId !== b.id) continue;
        const qty = Number(p.actualQty ?? p.plannedQty);
        portions += qty;
        revenue += qty * Number(p.recipe.sellingPrice);
        foodCost += qty * Number(p.recipe.estimatedCost);
      }

      let wasteValue = 0;
      let wasteCount = 0;
      for (const w of wastes) {
        if (w.branchId !== b.id) continue;
        wasteCount += 1;
        wasteValue += Number(w.quantity) * Number(w.item.lastPrice);
      }

      const foodCostPct = revenue > 0 ? (foodCost / revenue) * 100 : 0;

      return {
        branchId: b.id,
        branchCode: b.code,
        branchName: b.name,
        revenue: Math.round(revenue),
        foodCost: Math.round(foodCost),
        foodCostPercentage: Math.round(foodCostPct * 100) / 100,
        portions: Math.round(portions * 100) / 100,
        wasteValue: Math.round(wasteValue),
        wasteCount,
        purchaseTotal: Math.round(purchaseMap.get(b.id) ?? 0),
      };
    });

    const totals = rows.reduce(
      (acc, r) => ({
        revenue: acc.revenue + r.revenue,
        foodCost: acc.foodCost + r.foodCost,
        wasteValue: acc.wasteValue + r.wasteValue,
        purchaseTotal: acc.purchaseTotal + r.purchaseTotal,
        portions: acc.portions + r.portions,
      }),
      { revenue: 0, foodCost: 0, wasteValue: 0, purchaseTotal: 0, portions: 0 },
    );

    return {
      data: rows,
      totals: {
        ...totals,
        foodCostPercentage: totals.revenue > 0 ? Math.round((totals.foodCost / totals.revenue) * 10000) / 100 : 0,
      },
      period: { from, to },
    };
  }

  async foodCostReport() {
    const recipes = await this.prisma.recipe.findMany({
      where: { isActive: true },
      include: {
        category: true,
        items: { include: { item: true, unit: true } },
      },
      orderBy: { name: 'asc' },
    });

    return recipes.map((r) => {
      const cost = Number(r.estimatedCost);
      const price = Number(r.sellingPrice);
      const foodCostPct = price > 0 ? (cost / price) * 100 : 0;

      return {
        id: r.id,
        name: r.name,
        category: r.category.name,
        costPerServing: cost,
        sellingPrice: price,
        foodCostPercentage: Math.round(foodCostPct * 100) / 100,
        margin: price - cost,
        ingredients: r.items.map((ri) => ({
          name: ri.item.name,
          quantity: Number(ri.quantity),
          unit: ri.unit.abbreviation,
          unitPrice: Number(ri.item.lastPrice),
          totalCost: Number(ri.quantity) * Number(ri.item.lastPrice),
        })),
      };
    });
  }
}
