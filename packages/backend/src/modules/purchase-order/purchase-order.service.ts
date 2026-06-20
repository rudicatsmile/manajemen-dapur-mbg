import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string, status?: string, supplierId?: number) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (search) {
      where.OR = [
        { poNumber: { contains: search } },
        { supplier: { name: { contains: search } } },
      ];
    }
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: true,
          creator: { select: { id: true, name: true } },
          approver: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        creator: { select: { id: true, name: true } },
        approver: { select: { id: true, name: true } },
        items: {
          include: {
            item: true,
            unit: true,
          },
        },
      },
    });
    if (!po) throw new NotFoundException('Purchase Order tidak ditemukan');
    return po;
  }

  async create(data: any, userId: number) {
    const poNumber = await generateDocNumber(this.prisma, 'PO', 'purchase_orders', 'po_number');

    let totalAmount = new Decimal(0);
    const itemsData = data.items.map((item: any) => {
      const totalPrice = new Decimal(item.quantity).mul(new Decimal(item.unitPrice));
      totalAmount = totalAmount.add(totalPrice);
      return {
        itemId: item.itemId,
        quantity: item.quantity,
        unitId: item.unitId,
        unitPrice: item.unitPrice,
        totalPrice,
        notes: item.notes || null,
      };
    });

    return this.prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: data.supplierId,
        poDate: new Date(data.poDate),
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
        notes: data.notes || null,
        totalAmount,
        createdBy: userId,
        items: { create: itemsData },
      },
      include: {
        supplier: true,
        items: { include: { item: true, unit: true } },
      },
    });
  }

  async update(id: number, data: any) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!po) throw new NotFoundException('Purchase Order tidak ditemukan');
    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Hanya PO dengan status DRAFT yang dapat diubah');
    }

    const updateData: any = {};
    if (data.supplierId) updateData.supplierId = data.supplierId;
    if (data.poDate) updateData.poDate = new Date(data.poDate);
    if (data.expectedDate !== undefined) updateData.expectedDate = data.expectedDate ? new Date(data.expectedDate) : null;
    if (data.notes !== undefined) updateData.notes = data.notes;

    if (data.items) {
      let totalAmount = new Decimal(0);
      const itemsData = data.items.map((item: any) => {
        const totalPrice = new Decimal(item.quantity).mul(new Decimal(item.unitPrice));
        totalAmount = totalAmount.add(totalPrice);
        return {
          itemId: item.itemId,
          quantity: item.quantity,
          unitId: item.unitId,
          unitPrice: item.unitPrice,
          totalPrice,
          notes: item.notes || null,
        };
      });

      updateData.totalAmount = totalAmount;

      return this.prisma.$transaction(async (tx) => {
        await tx.purchaseOrderItem.deleteMany({ where: { poId: id } });
        return tx.purchaseOrder.update({
          where: { id },
          data: {
            ...updateData,
            items: { create: itemsData },
          },
          include: { supplier: true, items: { include: { item: true, unit: true } } },
        });
      });
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: { supplier: true, items: { include: { item: true, unit: true } } },
    });
  }

  async approve(id: number, userId: number) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!po) throw new NotFoundException('Purchase Order tidak ditemukan');
    if (po.status !== 'DRAFT' && po.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('PO tidak dapat disetujui dengan status saat ini');
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
      include: { supplier: true },
    });
  }

  async reject(id: number, userId: number) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!po) throw new NotFoundException('Purchase Order tidak ditemukan');
    if (po.status !== 'DRAFT' && po.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('PO tidak dapat ditolak dengan status saat ini');
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'REJECTED', approvedBy: userId, approvedAt: new Date() },
      include: { supplier: true },
    });
  }

  async cancel(id: number) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!po) throw new NotFoundException('Purchase Order tidak ditemukan');
    if (po.status === 'COMPLETED') {
      throw new BadRequestException('PO yang sudah selesai tidak dapat dibatalkan');
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { supplier: true },
    });
  }
}
