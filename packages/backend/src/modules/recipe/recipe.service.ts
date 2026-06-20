import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string, categoryId?: number) {
    const { skip, take } = paginate(page, perPage);
    const where: any = { isActive: true };
    if (search) {
      where.name = { contains: search };
    }
    if (categoryId) where.categoryId = categoryId;

    const [data, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          category: true,
          creator: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        category: true,
        creator: { select: { id: true, name: true } },
        items: { include: { item: { include: { baseUnit: true } }, unit: true } },
      },
    });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');
    return recipe;
  }

  async create(data: any, userId: number) {
    const estimatedCost = await this.calculateCost(data.items, data.yieldQuantity);

    return this.prisma.recipe.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        description: data.description || null,
        yieldQuantity: data.yieldQuantity,
        yieldUnit: data.yieldUnit || 'porsi',
        sellingPrice: data.sellingPrice || 0,
        estimatedCost,
        imageUrl: data.imageUrl || null,
        createdBy: userId,
        items: {
          create: data.items.map((item: any) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitId: item.unitId,
          })),
        },
      },
      include: {
        category: true,
        items: { include: { item: true, unit: true } },
      },
    });
  }

  async update(id: number, data: any) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');

    return this.prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.recipeItem.deleteMany({ where: { recipeId: id } });
        await tx.recipeItem.createMany({
          data: data.items.map((item: any) => ({
            recipeId: id,
            itemId: item.itemId,
            quantity: item.quantity,
            unitId: item.unitId,
          })),
        });
      }

      const yieldQty = data.yieldQuantity || recipe.yieldQuantity;
      const items = data.items || (await tx.recipeItem.findMany({ where: { recipeId: id } }));
      const estimatedCost = await this.calculateCostTx(tx, items, yieldQty);

      return tx.recipe.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.yieldQuantity !== undefined && { yieldQuantity: data.yieldQuantity }),
          ...(data.yieldUnit !== undefined && { yieldUnit: data.yieldUnit }),
          ...(data.sellingPrice !== undefined && { sellingPrice: data.sellingPrice }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          estimatedCost,
          version: { increment: 1 },
        },
        include: {
          category: true,
          items: { include: { item: true, unit: true } },
        },
      });
    });
  }

  async duplicate(id: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');

    return this.prisma.recipe.create({
      data: {
        name: `${recipe.name} (Copy)`,
        categoryId: recipe.categoryId,
        description: recipe.description,
        yieldQuantity: recipe.yieldQuantity,
        yieldUnit: recipe.yieldUnit,
        sellingPrice: recipe.sellingPrice,
        estimatedCost: recipe.estimatedCost,
        imageUrl: recipe.imageUrl,
        createdBy: userId,
        items: {
          create: recipe.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            unitId: item.unitId,
          })),
        },
      },
      include: {
        category: true,
        items: { include: { item: true, unit: true } },
      },
    });
  }

  private async calculateCost(items: any[], yieldQuantity: number): Promise<Decimal> {
    let totalCost = new Decimal(0);
    for (const recipeItem of items) {
      const item = await this.prisma.item.findUnique({ where: { id: recipeItem.itemId } });
      if (item) {
        const itemCost = new Decimal(recipeItem.quantity).mul(item.lastPrice);
        totalCost = totalCost.add(itemCost);
      }
    }
    return totalCost.div(new Decimal(yieldQuantity));
  }

  private async calculateCostTx(tx: any, items: any[], yieldQuantity: any): Promise<Decimal> {
    let totalCost = new Decimal(0);
    for (const recipeItem of items) {
      const item = await tx.item.findUnique({ where: { id: recipeItem.itemId } });
      if (item) {
        const itemCost = new Decimal(recipeItem.quantity).mul(item.lastPrice);
        totalCost = totalCost.add(itemCost);
      }
    }
    return totalCost.div(new Decimal(Number(yieldQuantity)));
  }
}
