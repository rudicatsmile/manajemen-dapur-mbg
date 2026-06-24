import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { adjustBranchStock, getBranchStockQty } from '../../common/helpers/stock.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId: number | null, page: number, perPage: number, search?: string, status?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (branchId) where.branchId = branchId;
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

  async checkStock(branchId: number, recipeId: number, qty: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { items: { include: { item: true, unit: true } } },
    });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');

    const multiplier = new Decimal(qty);
    const result = await Promise.all(
      recipe.items.map(async (ri) => {
        const needed = new Decimal(ri.quantity).mul(multiplier);
        const available = new Decimal(await getBranchStockQty(this.prisma, branchId, ri.itemId));
        return {
          itemId: ri.itemId,
          itemName: ri.item.name,
          unitName: ri.unit.abbreviation,
          needed: needed.toNumber(),
          available: available.toNumber(),
          sufficient: available.gte(needed),
        };
      }),
    );

    return result;
  }

  async create(branchId: number, data: any, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: data.recipeId },
      include: { items: { include: { item: true } } },
    });
    if (!recipe) throw new NotFoundException('Resep tidak ditemukan');

    const multiplier = new Decimal(data.plannedQty);

    // Cek kecukupan stok pada cabang aktif
    if (!data.forceCreate) {
      for (const ri of recipe.items) {
        const needed = new Decimal(ri.quantity).mul(multiplier);
        const available = new Decimal(await getBranchStockQty(this.prisma, branchId, ri.itemId));
        if (available.lessThan(needed)) {
          throw new BadRequestException(
            `Stok ${ri.item.name} tidak mencukupi di cabang ini. Dibutuhkan: ${needed.toNumber()}, Tersedia: ${available.toNumber()}`,
          );
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const productionNumber = await generateDocNumber(tx as any, 'PRD', 'productions', 'production_number');

      const production = await tx.production.create({
        data: {
          productionNumber,
          branchId,
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

      // Kurangi stok cabang + catat mutasi
      for (const ri of recipe.items) {
        const qtyChange = new Decimal(ri.quantity).mul(multiplier).toNumber();
        await adjustBranchStock(tx, {
          branchId,
          itemId: ri.itemId,
          qtyChange: -qtyChange,
          movementType: 'PRD',
          referenceType: 'PRODUCTION',
          referenceId: production.id,
          userId,
          notes: `Produksi ${productionNumber}`,
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
