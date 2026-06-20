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
