import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { adjustBranchStock } from '../../common/helpers/stock.helper';

@Injectable()
export class WasteService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId: number | null, page: number, perPage: number, search?: string, from?: string, to?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (search) {
      where.item = { name: { contains: search } };
    }
    if (from || to) {
      where.wasteDate = {};
      if (from) where.wasteDate.gte = new Date(from);
      if (to) where.wasteDate.lte = new Date(to);
    }

    const [data, total] = await Promise.all([
      this.prisma.wasteRecord.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          item: true,
          unit: true,
          creator: { select: { id: true, name: true } },
        },
      }),
      this.prisma.wasteRecord.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async create(branchId: number, data: any, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const waste = await tx.wasteRecord.create({
        data: {
          branchId,
          wasteDate: new Date(data.wasteDate),
          itemId: data.itemId,
          quantity: data.quantity,
          unitId: data.unitId,
          category: data.category,
          notes: data.notes || null,
          createdBy: userId,
        },
        include: { item: true, unit: true },
      });

      // Kurangi stok cabang + catat mutasi
      await adjustBranchStock(tx, {
        branchId,
        itemId: data.itemId,
        qtyChange: -Number(data.quantity),
        movementType: 'WST',
        referenceType: 'WASTE',
        referenceId: waste.id,
        userId,
        notes: `Waste: ${data.category}${data.notes ? ' - ' + data.notes : ''}`,
      });

      return waste;
    });
  }
}
