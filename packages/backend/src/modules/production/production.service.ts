import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string, status?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (search) {
      where.OR = [
        { productionNumber: { contains: search } },
        { recipe: { name: { contains: search } } },
      ];
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.production.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          recipe: true,
          creator: { select: { id: true, name: true } },
        },
      }),
      this.prisma.production.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const production = await this.prisma.production.findUnique({
      where: { id },
      include: {
        recipe: true,
        creator: { select: { id: true, name: true } },
        items: { include: { item: { include: { baseUnit: true } }, unit: true } },
      },
    });
    if (!production) throw new NotFoundException('Produksi tidak ditemukan');
    return production;
  }

  async checkStock(recipeId: number, qty: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { items: { include: { item: true, unit: true } } },
    });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');

    const multiplier = new Decimal(qty);
    const result = recipe.items.map((ri) => {
      const needed = new Decimal(ri.quantity).mul(multiplier);
      const available = ri.item.currentStock;
      return {
        itemId: ri.itemId,
        itemName: ri.item.name,
        unitName: ri.unit.abbreviation,
        needed: needed.toNumber(),
        available: available.toNumber(),
        sufficient: available.gte(needed),
      };
    });

    return result;
  }

  async create(data: any, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: data.recipeId },
      include: { items: { include: { item: true } } },
    });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');

    const multiplier = new Decimal(data.plannedQty);

    // Check stock availability
    if (!data.forceCreate) {
      for (const ri of recipe.items) {
        const needed = new Decimal(ri.quantity).mul(multiplier);
        if (ri.item.currentStock.lessThan(needed)) {
          throw new BadRequestException(
            `Stok ${ri.item.name} tidak mencukupi. Dibutuhkan: ${needed.toNumber()}, Tersedia: ${ri.item.currentStock.toNumber()}`,
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const productionNumber = await generateDocNumber(tx as any, 'PRD', 'productions', 'production_number');

      const production = await tx.production.create({
        data: {
          productionNumber,
          productionDate: new Date(data.productionDate),
          recipeId: data.recipeId,
          plannedQty: data.plannedQty,
          status: 'PLANNED',
          notes: data.notes || null,
          createdBy: userId,
          items: {
            create: recipe.items.map((ri) => ({
              itemId: ri.itemId,
              plannedQty: new Decimal(ri.quantity).mul(multiplier),
              unitId: ri.unitId,
            })),
          },
        },
        include: { recipe: true, items: { include: { item: true, unit: true } } },
      });

      // Deduct stock
      for (const ri of recipe.items) {
        const item = await tx.item.findUnique({ where: { id: ri.itemId } });
        if (!item) continue;

        const qtyBefore = item.currentStock;
        const qtyChange = new Decimal(ri.quantity).mul(multiplier).neg();
        const qtyAfter = qtyBefore.add(qtyChange);

        await tx.item.update({
          where: { id: ri.itemId },
          data: { currentStock: qtyAfter.lessThan(0) ? 0 : qtyAfter },
        });

        await tx.stockMovement.create({
          data: {
            itemId: ri.itemId,
            movementType: 'PRD',
            referenceType: 'PRODUCTION',
            referenceId: production.id,
            qtyBefore,
            qtyChange,
            qtyAfter: qtyAfter.lessThan(0) ? new Decimal(0) : qtyAfter,
            notes: `Produksi ${productionNumber}`,
            createdBy: userId,
          },
        });
      }

      return production;
    });
  }

  async complete(id: number, actualQty?: number) {
    const production = await this.prisma.production.findUnique({ where: { id } });
    if (!production) throw new NotFoundException('Produksi tidak ditemukan');
    if (production.status === 'COMPLETED') {
      throw new BadRequestException('Produksi sudah selesai');
    }

    return this.prisma.production.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        actualQty: actualQty !== undefined ? actualQty : production.plannedQty,
      },
      include: { recipe: true },
    });
  }
}
