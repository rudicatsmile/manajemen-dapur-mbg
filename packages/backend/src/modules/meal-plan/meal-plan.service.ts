import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { getBranchStockQty } from '../../common/helpers/stock.helper';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
const DEFAULT_LEAD_TIME = 3;

interface CreateMealPlanInput {
  name: string;
  weekStartDate: string;
  maxPortionsPerDay?: number;
  notes?: string;
  items: Array<{
    recipeId: number;
    dayOfWeek: number;
    portions: number;
    sortOrder?: number;
    notes?: string;
  }>;
}

interface UpdateMealPlanInput {
  name?: string;
  notes?: string;
  maxPortionsPerDay?: number;
  items?: Array<{
    recipeId: number;
    dayOfWeek: number;
    portions: number;
    sortOrder?: number;
    notes?: string;
  }>;
}

export interface StockCheckResult {
  itemId: number;
  itemName: string;
  sku: string;
  unit: string;
  totalNeeded: number;
  currentStock: number;
  surplus: number;
  deficit: number;
}

@Injectable()
export class MealPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    perPage: number;
    status?: string;
    weekStart?: string;
  }) {
    const take = params.perPage || 20;
    const skip = (params.page - 1) * take;

    const where: Record<string, unknown> = {};
    if (params.status) where.status = params.status;
    if (params.weekStart) where.weekStartDate = new Date(params.weekStart);

    const [data, total] = await Promise.all([
      this.prisma.mealPlan.findMany({
        where,
        skip,
        take,
        orderBy: { weekStartDate: 'desc' },
        include: {
          creator: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.mealPlan.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: params.page,
        perPage: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findById(id: number) {
    const plan = await this.prisma.mealPlan.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true } },
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                categoryId: true,
                yieldQuantity: true,
                estimatedCost: true,
                sellingPrice: true,
                category: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: [{ dayOfWeek: 'asc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Meal plan tidak ditemukan');
    }

    return plan;
  }

  async create(data: CreateMealPlanInput, userId: number) {
    const maxPortions = data.maxPortionsPerDay ?? 200;

    // Validate portions per day
    this.validatePortionsPerDay(data.items, maxPortions);

    return this.prisma.mealPlan.create({
      data: {
        name: data.name,
        weekStartDate: new Date(data.weekStartDate),
        maxPortionsPerDay: maxPortions,
        notes: data.notes,
        createdBy: userId,
        items: {
          create: data.items.map((item, index) => ({
            recipeId: item.recipeId,
            dayOfWeek: item.dayOfWeek,
            portions: item.portions,
            sortOrder: item.sortOrder ?? index,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: { include: { recipe: { select: { id: true, name: true } } } },
        creator: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: number, data: UpdateMealPlanInput, userId: number) {
    const plan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan tidak ditemukan');
    if (plan.status !== 'DRAFT') {
      throw new BadRequestException('Hanya meal plan berstatus DRAFT yang dapat diedit');
    }

    const maxPortions = data.maxPortionsPerDay ?? plan.maxPortionsPerDay;

    if (data.items) {
      this.validatePortionsPerDay(data.items, maxPortions);
    }

    return this.prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.mealPlanItem.deleteMany({ where: { mealPlanId: id } });
        for (let i = 0; i < data.items.length; i++) {
          const item = data.items[i];
          await tx.mealPlanItem.create({
            data: {
              mealPlanId: id,
              recipeId: item.recipeId,
              dayOfWeek: item.dayOfWeek,
              portions: item.portions,
              sortOrder: item.sortOrder ?? i,
              notes: item.notes,
            },
          });
        }
      }

      return tx.mealPlan.update({
        where: { id },
        data: {
          name: data.name,
          notes: data.notes,
          maxPortionsPerDay: data.maxPortionsPerDay,
        },
        include: {
          items: { include: { recipe: { select: { id: true, name: true } } } },
          creator: { select: { id: true, name: true } },
        },
      });
    });
  }

  async delete(id: number): Promise<void> {
    const plan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan tidak ditemukan');
    if (plan.status !== 'DRAFT') {
      throw new BadRequestException('Hanya meal plan berstatus DRAFT yang dapat dihapus');
    }
    await this.prisma.mealPlan.delete({ where: { id } });
  }

  async activate(id: number) {
    const plan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan tidak ditemukan');
    if (plan.status !== 'DRAFT') {
      throw new BadRequestException('Hanya meal plan berstatus DRAFT yang dapat diaktifkan');
    }

    // Deactivate other plans for the same week
    await this.prisma.mealPlan.updateMany({
      where: {
        weekStartDate: plan.weekStartDate,
        status: 'ACTIVE',
        id: { not: id },
      },
      data: { status: 'DRAFT' },
    });

    return this.prisma.mealPlan.update({
      where: { id },
      data: { status: 'ACTIVE' },
      include: {
        items: { include: { recipe: { select: { id: true, name: true } } } },
        creator: { select: { id: true, name: true } },
      },
    });
  }

  async complete(id: number) {
    const plan = await this.prisma.mealPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan tidak ditemukan');
    if (plan.status !== 'ACTIVE') {
      throw new BadRequestException('Hanya meal plan berstatus ACTIVE yang dapat diselesaikan');
    }

    return this.prisma.mealPlan.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: {
        items: { include: { recipe: { select: { id: true, name: true } } } },
        creator: { select: { id: true, name: true } },
      },
    });
  }

  /** Stok untuk cek meal plan: cabang spesifik atau agregat semua cabang (mode ALL). */
  private async planStock(branchId: number | null, itemId: number): Promise<number> {
    if (branchId) return getBranchStockQty(this.prisma, branchId, itemId);
    const agg = await this.prisma.branchStock.aggregate({
      where: { itemId },
      _sum: { currentStock: true },
    });
    return Number(agg._sum.currentStock ?? 0);
  }

  async stockCheck(branchId: number | null, id: number): Promise<StockCheckResult[]> {
    const plan = await this.prisma.mealPlan.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            recipe: {
              include: {
                items: {
                  include: {
                    item: {
                      include: { baseUnit: { select: { abbreviation: true } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!plan) throw new NotFoundException('Meal plan tidak ditemukan');

    // Aggregate total needed per item
    const itemNeeds = new Map<number, { totalNeeded: number; item: { id: number; name: string; sku: string; currentStock: number; unit: string } }>();

    for (const planItem of plan.items) {
      const recipe = planItem.recipe;
      const yieldQty = Number(recipe.yieldQuantity);
      const portions = Number(planItem.portions);

      for (const ri of recipe.items) {
        const recipeItemQty = Number(ri.quantity);
        const needed = recipeItemQty * (portions / yieldQty);

        const existing = itemNeeds.get(ri.itemId);
        if (existing) {
          existing.totalNeeded += needed;
        } else {
          itemNeeds.set(ri.itemId, {
            totalNeeded: needed,
            item: {
              id: ri.item.id,
              name: ri.item.name,
              sku: ri.item.sku,
              currentStock: Number(ri.item.currentStock),
              unit: ri.item.baseUnit.abbreviation,
            },
          });
        }
      }
    }

    const results: StockCheckResult[] = [];
    for (const [itemId, data] of itemNeeds) {
      const totalNeeded = Math.round(data.totalNeeded * 1000) / 1000;
      const currentStock = await this.planStock(branchId, itemId);
      const diff = currentStock - totalNeeded;
      results.push({
        itemId,
        itemName: data.item.name,
        sku: data.item.sku,
        unit: data.item.unit,
        totalNeeded,
        currentStock,
        surplus: diff > 0 ? Math.round(diff * 1000) / 1000 : 0,
        deficit: diff < 0 ? Math.round(Math.abs(diff) * 1000) / 1000 : 0,
      });
    }

    // Sort by deficit descending (most deficit first)
    results.sort((a, b) => b.deficit - a.deficit);

    return results;
  }

  async generateShoppingList(branchId: number, id: number, userId: number): Promise<{ poIds: number[] }> {
    const stockResults = await this.stockCheck(branchId, id);
    const deficitItems = stockResults.filter(r => r.deficit > 0);

    if (deficitItems.length === 0) {
      return { poIds: [] };
    }

    // Find best supplier for each item from PriceHistory
    const itemSupplierMap = new Map<number, { supplierId: number; unitPrice: number }>();
    for (const di of deficitItems) {
      const latestPrice = await this.prisma.priceHistory.findFirst({
        where: { itemId: di.itemId },
        orderBy: { recordedAt: 'desc' },
      });

      if (latestPrice) {
        itemSupplierMap.set(di.itemId, {
          supplierId: latestPrice.supplierId,
          unitPrice: Number(latestPrice.price),
        });
      } else {
        const firstSupplier = await this.prisma.supplier.findFirst({ where: { isActive: true } });
        if (firstSupplier) {
          const item = await this.prisma.item.findUnique({ where: { id: di.itemId } });
          itemSupplierMap.set(di.itemId, {
            supplierId: firstSupplier.id,
            unitPrice: item ? Number(item.lastPrice) : 0,
          });
        }
      }
    }

    // Group by supplier
    const supplierGroups = new Map<number, Array<{ itemId: number; qty: number; unitPrice: number; unitId: number }>>();
    for (const di of deficitItems) {
      const supplierInfo = itemSupplierMap.get(di.itemId);
      if (!supplierInfo) continue;

      const item = await this.prisma.item.findUnique({ where: { id: di.itemId } });
      if (!item) continue;

      if (!supplierGroups.has(supplierInfo.supplierId)) {
        supplierGroups.set(supplierInfo.supplierId, []);
      }
      supplierGroups.get(supplierInfo.supplierId)!.push({
        itemId: di.itemId,
        qty: di.deficit,
        unitPrice: supplierInfo.unitPrice || Number(item.lastPrice),
        unitId: item.purchaseUnitId ?? item.baseUnitId,
      });
    }

    const poIds: number[] = [];

    for (const [supplierId, poItems] of supplierGroups) {
      const poNumber = await generateDocNumber(
        this.prisma as any,
        'PO',
        'purchase_orders',
        'po_number',
      );

      let totalAmount = 0;
      for (const pi of poItems) {
        totalAmount += pi.qty * pi.unitPrice;
      }

      const po = await this.prisma.purchaseOrder.create({
        data: {
          poNumber,
          branchId,
          supplierId,
          poDate: new Date(),
          expectedDate: new Date(Date.now() + DEFAULT_LEAD_TIME * 24 * 60 * 60 * 1000),
          status: 'DRAFT',
          totalAmount,
          notes: `Auto-generated dari meal plan #${id}`,
          createdBy: userId,
        },
      });

      for (const pi of poItems) {
        await this.prisma.purchaseOrderItem.create({
          data: {
            poId: po.id,
            itemId: pi.itemId,
            quantity: pi.qty,
            unitId: pi.unitId,
            unitPrice: pi.unitPrice,
            totalPrice: pi.qty * pi.unitPrice,
          },
        });
      }

      poIds.push(po.id);
    }

    return { poIds };
  }

  async suggest(weekStartDate: string) {
    const targetDate = new Date(weekStartDate);
    const fourWeeksAgo = new Date(targetDate);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const productions = await this.prisma.production.findMany({
      where: {
        status: 'COMPLETED',
        productionDate: {
          gte: fourWeeksAgo,
          lt: targetDate,
        },
      },
      include: {
        recipe: { select: { id: true, name: true } },
      },
    });

    // Group by dayOfWeek + recipe
    const dayRecipeMap = new Map<string, { recipeId: number; recipeName: string; totalPortions: number; count: number }>();

    for (const prod of productions) {
      const prodDate = new Date(prod.productionDate);
      const dow = prodDate.getDay();
      const key = `${dow}-${prod.recipeId}`;

      const existing = dayRecipeMap.get(key);
      if (existing) {
        existing.totalPortions += Number(prod.actualQty ?? prod.plannedQty);
        existing.count += 1;
      } else {
        dayRecipeMap.set(key, {
          recipeId: prod.recipeId,
          recipeName: prod.recipe.name,
          totalPortions: Number(prod.actualQty ?? prod.plannedQty),
          count: 1,
        });
      }
    }

    // Build suggestion per day
    const suggestion: Array<{
      dayOfWeek: number;
      dayName: string;
      recipes: Array<{ recipeId: number; recipeName: string; suggestedPortions: number }>;
    }> = [];

    for (let dow = 0; dow <= 6; dow++) {
      const recipes: Array<{ recipeId: number; recipeName: string; suggestedPortions: number }> = [];

      for (const [key, data] of dayRecipeMap) {
        if (key.startsWith(`${dow}-`)) {
          recipes.push({
            recipeId: data.recipeId,
            recipeName: data.recipeName,
            suggestedPortions: Math.round(data.totalPortions / data.count),
          });
        }
      }

      // Sort by suggestedPortions descending
      recipes.sort((a, b) => b.suggestedPortions - a.suggestedPortions);

      suggestion.push({
        dayOfWeek: dow,
        dayName: DAY_NAMES[dow],
        recipes,
      });
    }

    return suggestion;
  }

  // Template methods

  async getTemplates() {
    return this.prisma.mealPlanTemplate.findMany({
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveAsTemplate(planId: number, name: string, description: string | undefined, userId: number) {
    const plan = await this.prisma.mealPlan.findUnique({
      where: { id: planId },
      include: { items: true },
    });

    if (!plan) throw new NotFoundException('Meal plan tidak ditemukan');

    return this.prisma.mealPlanTemplate.create({
      data: {
        name,
        description,
        createdBy: userId,
        items: {
          create: plan.items.map((item) => ({
            recipeId: item.recipeId,
            dayOfWeek: item.dayOfWeek,
            portions: item.portions,
            sortOrder: item.sortOrder,
          })),
        },
      },
      include: {
        items: true,
        creator: { select: { id: true, name: true } },
      },
    });
  }

  async applyTemplate(templateId: number, weekStartDate: string, userId: number) {
    const template = await this.prisma.mealPlanTemplate.findUnique({
      where: { id: templateId },
      include: { items: true },
    });

    if (!template) throw new NotFoundException('Template tidak ditemukan');

    return this.prisma.mealPlan.create({
      data: {
        name: `${template.name} — ${weekStartDate}`,
        weekStartDate: new Date(weekStartDate),
        createdBy: userId,
        items: {
          create: template.items.map((item) => ({
            recipeId: item.recipeId,
            dayOfWeek: item.dayOfWeek,
            portions: item.portions,
            sortOrder: item.sortOrder,
          })),
        },
      },
      include: {
        items: { include: { recipe: { select: { id: true, name: true } } } },
        creator: { select: { id: true, name: true } },
      },
    });
  }

  async deleteTemplate(id: number): Promise<void> {
    const template = await this.prisma.mealPlanTemplate.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template tidak ditemukan');
    await this.prisma.mealPlanTemplate.delete({ where: { id } });
  }

  // Private helpers

  private validatePortionsPerDay(
    items: Array<{ dayOfWeek: number; portions: number }>,
    maxPortionsPerDay: number,
  ): void {
    const dayTotals = new Map<number, number>();
    for (const item of items) {
      const current = dayTotals.get(item.dayOfWeek) ?? 0;
      dayTotals.set(item.dayOfWeek, current + item.portions);
    }

    for (const [day, total] of dayTotals) {
      if (total > maxPortionsPerDay) {
        throw new BadRequestException(
          `Total porsi pada hari ${DAY_NAMES[day]} (${total}) melebihi batas maksimum (${maxPortionsPerDay})`,
        );
      }
    }
  }
}
