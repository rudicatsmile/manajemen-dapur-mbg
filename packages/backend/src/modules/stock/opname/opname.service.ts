import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../../common/helpers/doc-number.helper';
import { adjustBranchStock, getBranchStockQty } from '../../../common/helpers/stock.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OpnameService {
  constructor(private prisma: PrismaService) {}

  async findAll(branchId: number | null, page: number, perPage: number) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (branchId) where.branchId = branchId;

    const [data, total] = await Promise.all([
      this.prisma.stockOpname.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { id: true, name: true } },
          approver: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.stockOpname.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const opname = await this.prisma.stockOpname.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true } },
        approver: { select: { id: true, name: true } },
        items: { include: { item: { include: { baseUnit: true } } } },
      },
    });
    if (!opname) throw new NotFoundException('Stock opname tidak ditemukan');
    return opname;
  }

  async create(branchId: number, data: any, userId: number) {
    const opnameNumber = await generateDocNumber(this.prisma, 'SOP', 'stock_opnames', 'opname_number');

    // Tangkap system qty dari stok cabang aktif saat opname dibuat
    const itemsData = await Promise.all(
      data.items.map(async (item: any) => {
        const systemQty = new Decimal(await getBranchStockQty(this.prisma, branchId, item.itemId));
        const actualQty = new Decimal(item.actualQty);
        const difference = actualQty.sub(systemQty);

        return {
          itemId: item.itemId,
          systemQty,
          actualQty,
          difference,
          notes: item.notes || null,
        };
      }),
    );

    return this.prisma.stockOpname.create({
      data: {
        opnameNumber,
        branchId,
        opnameDate: new Date(data.opnameDate),
        notes: data.notes || null,
        createdBy: userId,
        items: { create: itemsData },
      },
      include: { items: { include: { item: true } } },
    });
  }

  async update(id: number, data: any) {
    const opname = await this.prisma.stockOpname.findUnique({ where: { id } });
    if (!opname) throw new NotFoundException('Stock opname tidak ditemukan');
    if (opname.status !== 'DRAFT' && opname.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Opname tidak dapat diubah dengan status saat ini');
    }

    if (data.items) {
      return this.prisma.$transaction(async (tx) => {
        // Update each item's actualQty
        for (const item of data.items) {
          const opnameItem = await tx.stockOpnameItem.findFirst({
            where: { opnameId: id, itemId: item.itemId },
          });
          if (opnameItem) {
            const actualQty = new Decimal(item.actualQty);
            const difference = actualQty.sub(opnameItem.systemQty);
            await tx.stockOpnameItem.update({
              where: { id: opnameItem.id },
              data: { actualQty, difference, notes: item.notes || opnameItem.notes },
            });
          }
        }

        return tx.stockOpname.update({
          where: { id },
          data: { status: 'IN_PROGRESS', notes: data.notes || opname.notes },
          include: { items: { include: { item: true } } },
        });
      });
    }

    return this.prisma.stockOpname.update({
      where: { id },
      data: { notes: data.notes || opname.notes },
      include: { items: { include: { item: true } } },
    });
  }

  async approve(id: number, userId: number) {
    const opname = await this.prisma.stockOpname.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!opname) throw new NotFoundException('Stock opname tidak ditemukan');
    if (opname.status === 'APPROVED') {
      throw new BadRequestException('Opname sudah disetujui');
    }

    return this.prisma.$transaction(async (tx) => {
      for (const opnameItem of opname.items) {
        const diff = new Decimal(opnameItem.difference);
        if (!diff.isZero()) {
          const movementType = diff.greaterThan(0) ? 'ADJ_PLUS' : 'ADJ_MINUS';
          await adjustBranchStock(tx, {
            branchId: opname.branchId,
            itemId: opnameItem.itemId,
            qtyChange: diff.toNumber(),
            movementType,
            referenceType: 'STOCK_OPNAME',
            referenceId: opname.id,
            userId,
            notes: `Stock Opname ${opname.opnameNumber}`,
          });
        }
      }

      return tx.stockOpname.update({
        where: { id },
        data: { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
        include: { items: { include: { item: true } } },
      });
    });
  }
}
