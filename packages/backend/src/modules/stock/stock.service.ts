import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const items = await this.prisma.item.findMany({
      where: { isActive: true },
      include: { category: true, baseUnit: true },
      orderBy: { name: 'asc' },
    });

    const grouped: Record<string, any[]> = {};
    for (const item of items) {
      const cat = item.category.name;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }

    return grouped;
  }

  async lowStock() {
    const items = await this.prisma.$queryRaw<any[]>`
      SELECT i.id, i.sku, i.name, i.current_stock, i.min_stock,
             c.name as category_name, u.abbreviation as unit
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN units_of_measure u ON i.base_unit_id = u.id
      WHERE i.is_active = true AND i.current_stock <= i.min_stock
      ORDER BY (i.current_stock - i.min_stock) ASC
    `;
    return items;
  }

  async adjustment(data: { itemId: number; quantity: number; reason: string; notes?: string }, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id: data.itemId } });
      if (!item) throw new NotFoundException('Item tidak ditemukan');

      const qtyBefore = item.currentStock;
      const qtyChange = new Decimal(data.quantity);
      const qtyAfter = qtyBefore.add(qtyChange);

      if (qtyAfter.lessThan(0)) {
        throw new NotFoundException('Stok tidak boleh kurang dari 0');
      }

      await tx.item.update({
        where: { id: data.itemId },
        data: { currentStock: qtyAfter },
      });

      const movementType = data.quantity >= 0 ? 'ADJ_PLUS' : 'ADJ_MINUS';

      await tx.stockMovement.create({
        data: {
          itemId: data.itemId,
          movementType,
          referenceType: 'ADJUSTMENT',
          referenceId: 0,
          qtyBefore,
          qtyChange,
          qtyAfter,
          notes: `${data.reason}${data.notes ? ': ' + data.notes : ''}`,
          createdBy: userId,
        },
      });

      return { itemId: data.itemId, qtyBefore, qtyChange, qtyAfter };
    });
  }

  async movements(page: number, perPage: number, itemId?: number, type?: string, from?: string, to?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (itemId) where.itemId = itemId;
    if (type) where.movementType = type;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to + 'T23:59:59');
    }

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          item: { select: { id: true, name: true, sku: true } },
          creator: { select: { id: true, name: true } },
        },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }
}
