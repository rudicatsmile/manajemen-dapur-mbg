import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PriceHistoryService } from '../price-history/price-history.service';
import { BatchTrackingService } from '../batch-tracking/batch-tracking.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { adjustBranchStock } from '../../common/helpers/stock.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReceivingService {
  constructor(
    private prisma: PrismaService,
    private priceHistoryService: PriceHistoryService,
    private batchTrackingService: BatchTrackingService,
  ) {}

  async findAll(branchId: number | null, page: number, perPage: number, search?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (branchId) where.branchId = branchId;
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

    const result = await this.prisma.$transaction(async (tx) => {
      const receivingNumber = await generateDocNumber(tx as any, 'RCV', 'receivings', 'receiving_number');

      const receiving = await tx.receiving.create({
        data: {
          receivingNumber,
          branchId: po.branchId,
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

        // Update harga terakhir item (master global)
        await tx.item.update({
          where: { id: rcvItem.itemId },
          data: { lastPrice: poItem.unitPrice },
        });

        // Tambah stok cabang + catat mutasi (per-cabang sesuai cabang PO)
        await adjustBranchStock(tx, {
          branchId: po.branchId,
          itemId: rcvItem.itemId,
          qtyChange: Number(rcvItem.quantity),
          movementType: 'RCV',
          referenceType: 'RECEIVING',
          referenceId: receiving.id,
          userId,
          notes: `Penerimaan ${receivingNumber}`,
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

      // Record price history for each received item after transaction
      const priceRecords = data.items.map((rcvItem: any) => {
        const poItem = po.items.find((pi) => pi.id === rcvItem.poItemId);
        return {
          itemId: rcvItem.itemId,
          supplierId: po.supplierId,
          price: poItem!.unitPrice,
          quantity: rcvItem.quantity,
          poId: data.poId,
          date: new Date(data.receivedDate),
        };
      });

      return { receiving, priceRecords };
    });

    // Record price history outside transaction to avoid long-running tx
    for (const pr of result.priceRecords) {
      await this.priceHistoryService.recordPrice(
        pr.itemId,
        pr.supplierId,
        pr.price,
        pr.quantity,
        pr.poId,
        pr.date,
      );
    }

    // Create item batches for FIFO & expiry tracking
    for (const rcvItem of result.receiving.items) {
      const inputItem = data.items.find((i: any) => i.itemId === rcvItem.itemId);
      const batchNumber = inputItem?.batchNumber
        || `RCV-${result.receiving.receivingNumber}-${rcvItem.itemId}`;
      const expiryDate = inputItem?.expiryDate
        ? new Date(inputItem.expiryDate)
        : undefined;

      await this.batchTrackingService.createBatch(
        po.branchId,
        rcvItem.itemId,
        batchNumber,
        expiryDate,
        rcvItem.id,
        Number(rcvItem.quantity),
        new Date(data.receivedDate),
      );
    }

    return result.receiving;
  }
}
