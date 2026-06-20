import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReceivingService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, perPage: number, search?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (search) {
      where.OR = [
        { receivingNumber: { contains: search } },
        { purchaseOrder: { poNumber: { contains: search } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.receiving.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          purchaseOrder: { include: { supplier: true } },
          creator: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.receiving.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const receiving = await this.prisma.receiving.findUnique({
      where: { id },
      include: {
        purchaseOrder: { include: { supplier: true } },
        creator: { select: { id: true, name: true } },
        items: { include: { item: true, unit: true, purchaseOrderItem: true } },
      },
    });
    if (!receiving) throw new NotFoundException('Penerimaan tidak ditemukan');
    return receiving;
  }

  async create(data: any, userId: number) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: data.poId },
      include: { items: true },
    });
    if (!po) throw new NotFoundException('Purchase Order tidak ditemukan');
    if (!['APPROVED', 'SENT', 'PARTIALLY_RECEIVED'].includes(po.status)) {
      throw new BadRequestException('PO belum disetujui atau sudah selesai');
    }

    return this.prisma.$transaction(async (tx) => {
      const receivingNumber = await generateDocNumber(tx as any, 'RCV', 'receivings', 'receiving_number');

      const receiving = await tx.receiving.create({
        data: {
          receivingNumber,
          poId: data.poId,
          receivedDate: new Date(data.receivedDate),
          notes: data.notes || null,
          createdBy: userId,
          items: {
            create: data.items.map((item: any) => ({
              poItemId: item.poItemId,
              itemId: item.itemId,
              quantity: item.quantity,
              unitId: item.unitId,
              notes: item.notes || null,
            })),
          },
        },
        include: { items: { include: { item: true, unit: true } } },
      });

      // Update PO item receivedQty, item stock, create stock movements
      for (const rcvItem of data.items) {
        const poItem = po.items.find((pi) => pi.id === rcvItem.poItemId);
        if (!poItem) throw new BadRequestException(`PO Item dengan ID ${rcvItem.poItemId} tidak ditemukan`);

        // Update PO item received qty
        await tx.purchaseOrderItem.update({
          where: { id: rcvItem.poItemId },
          data: {
            receivedQty: { increment: rcvItem.quantity },
          },
        });

        // Get current item stock
        const item = await tx.item.findUnique({ where: { id: rcvItem.itemId } });
        if (!item) throw new BadRequestException(`Item dengan ID ${rcvItem.itemId} tidak ditemukan`);

        const qtyBefore = item.currentStock;
        const qtyChange = new Decimal(rcvItem.quantity);
        const qtyAfter = qtyBefore.add(qtyChange);

        // Update item stock and last price
        await tx.item.update({
          where: { id: rcvItem.itemId },
          data: {
            currentStock: qtyAfter,
            lastPrice: poItem.unitPrice,
          },
        });

        // Create stock movement
        await tx.stockMovement.create({
          data: {
            itemId: rcvItem.itemId,
            movementType: 'RCV',
            referenceType: 'RECEIVING',
            referenceId: receiving.id,
            qtyBefore,
            qtyChange,
            qtyAfter,
            notes: `Penerimaan ${receivingNumber}`,
            createdBy: userId,
          },
        });
      }

      // Check if PO is fully received
      const updatedPoItems = await tx.purchaseOrderItem.findMany({ where: { poId: data.poId } });
      const allReceived = updatedPoItems.every((pi) =>
        new Decimal(pi.receivedQty).gte(new Decimal(pi.quantity)),
      );

      await tx.purchaseOrder.update({
        where: { id: data.poId },
        data: { status: allReceived ? 'COMPLETED' : 'PARTIALLY_RECEIVED' },
      });

      return receiving;
    });
  }
}
