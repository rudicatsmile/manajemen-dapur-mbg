import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WasteService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string, from?: string, to?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
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

  async create(data: any, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id: data.itemId } });
      if (!item) throw new NotFoundException('Item tidak ditemukan');

      const qtyBefore = item.currentStock;
      const qtyChange = new Decimal(data.quantity).neg();
      const qtyAfter = qtyBefore.add(qtyChange);

      const waste = await tx.wasteRecord.create({
        data: {
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

      await tx.item.update({
        where: { id: data.itemId },
        data: { currentStock: qtyAfter.lessThan(0) ? 0 : qtyAfter },
      });

      await tx.stockMovement.create({
        data: {
          itemId: data.itemId,
          movementType: 'WST',
          referenceType: 'WASTE',
          referenceId: waste.id,
          qtyBefore,
          qtyChange,
          qtyAfter: qtyAfter.lessThan(0) ? new Decimal(0) : qtyAfter,
          notes: `Waste: ${data.category}${data.notes ? ' - ' + data.notes : ''}`,
          createdBy: userId,
        },
      });

      return waste;
    });
  }
}
