import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { generateDocNumber } from '../../common/helpers/doc-number.helper';
import { adjustBranchStock, getBranchStockQty } from '../../common/helpers/stock.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class StockTransferService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  private readonly detailInclude = {
    fromBranch: { select: { id: true, code: true, name: true } },
    toBranch: { select: { id: true, code: true, name: true } },
    requester: { select: { id: true, name: true } },
    approver: { select: { id: true, name: true } },
    shipper: { select: { id: true, name: true } },
    receiver: { select: { id: true, name: true } },
    items: { include: { item: { select: { id: true, name: true, sku: true } }, unit: true } },
  };

  /** Transfer yang melibatkan cabang aktif (asal atau tujuan). Null = semua cabang. */
  async findAll(branchId: number | null, page: number, perPage: number, status?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = {};
    if (branchId) where.OR = [{ fromBranchId: branchId }, { toBranchId: branchId }];
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.stockTransfer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          fromBranch: { select: { id: true, name: true } },
          toBranch: { select: { id: true, name: true } },
          requester: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.stockTransfer.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: this.detailInclude,
    });
    if (!transfer) throw new NotFoundException('Transfer stok tidak ditemukan');
    return transfer;
  }

  async create(branchId: number, data: any, userId: number) {
    if (data.fromBranchId === data.toBranchId) {
      throw new BadRequestException('Cabang asal dan tujuan tidak boleh sama');
    }
    // User harus terkait dengan cabang asal atau tujuan (cabang aktif salah satunya)
    if (branchId !== data.fromBranchId && branchId !== data.toBranchId) {
      throw new ForbiddenException('Cabang aktif harus menjadi asal atau tujuan transfer');
    }

    const [fromBranch, toBranch] = await Promise.all([
      this.prisma.branch.findUnique({ where: { id: data.fromBranchId } }),
      this.prisma.branch.findUnique({ where: { id: data.toBranchId } }),
    ]);
    if (!fromBranch || !toBranch) throw new NotFoundException('Cabang tidak ditemukan');

    const transfer = await this.prisma.$transaction(async (tx) => {
      const transferNumber = await generateDocNumber(tx as any, 'TRF', 'stock_transfers', 'transfer_number');
      return tx.stockTransfer.create({
        data: {
          transferNumber,
          fromBranchId: data.fromBranchId,
          toBranchId: data.toBranchId,
          status: 'REQUESTED',
          requestDate: new Date(data.requestDate),
          notes: data.notes || null,
          requestedBy: userId,
          items: {
            create: data.items.map((it: any) => ({
              itemId: it.itemId,
              unitId: it.unitId,
              requestedQty: new Decimal(it.requestedQty),
              notes: it.notes || null,
            })),
          },
        },
        include: this.detailInclude,
      });
    });

    await this.notificationService.createForRole(
      'ADMIN',
      'TRANSFER_REQUEST',
      `Permintaan Transfer: ${transfer.transferNumber}`,
      `Transfer dari ${fromBranch.name} ke ${toBranch.name} menunggu persetujuan.`,
      `/stok/transfer/${transfer.id}`,
    );

    return transfer;
  }

  async approve(id: number, userId: number) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: { items: { include: { item: { select: { name: true } } } }, fromBranch: true, toBranch: true },
    });
    if (!transfer) throw new NotFoundException('Transfer stok tidak ditemukan');
    if (transfer.status !== 'REQUESTED') {
      throw new BadRequestException('Hanya transfer berstatus REQUESTED yang dapat disetujui');
    }

    // Cek stok cukup di cabang asal
    for (const it of transfer.items) {
      const available = await getBranchStockQty(this.prisma, transfer.fromBranchId, it.itemId);
      if (available < Number(it.requestedQty)) {
        throw new BadRequestException(
          `Stok ${it.item.name} di ${transfer.fromBranch.name} tidak mencukupi (tersedia ${available}, diminta ${Number(it.requestedQty)})`,
        );
      }
    }

    const updated = await this.prisma.stockTransfer.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
      include: this.detailInclude,
    });

    await this.notificationService.createForRole(
      'KITCHEN_MANAGER',
      'TRANSFER_APPROVED',
      `Transfer Disetujui: ${transfer.transferNumber}`,
      `Transfer dari ${transfer.fromBranch.name} ke ${transfer.toBranch.name} siap dikirim.`,
      `/stok/transfer/${id}`,
    );

    return updated;
  }

  async reject(id: number, userId: number, reason?: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({ where: { id } });
    if (!transfer) throw new NotFoundException('Transfer stok tidak ditemukan');
    if (transfer.status !== 'REQUESTED') {
      throw new BadRequestException('Hanya transfer berstatus REQUESTED yang dapat ditolak');
    }

    return this.prisma.stockTransfer.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedBy: userId,
        approvedAt: new Date(),
        notes: reason ? `${transfer.notes ? transfer.notes + ' | ' : ''}Ditolak: ${reason}` : transfer.notes,
      },
      include: this.detailInclude,
    });
  }

  async cancel(id: number, userId: number) {
    const transfer = await this.prisma.stockTransfer.findUnique({ where: { id } });
    if (!transfer) throw new NotFoundException('Transfer stok tidak ditemukan');
    if (!['REQUESTED', 'APPROVED'].includes(transfer.status)) {
      throw new BadRequestException('Transfer yang sudah dikirim tidak dapat dibatalkan');
    }
    void userId;
    return this.prisma.stockTransfer.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: this.detailInclude,
    });
  }

  /** Kirim: kurangi stok cabang asal (TRF_OUT). */
  async ship(id: number, data: any, userId: number) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: { items: { include: { item: { select: { name: true } } } }, fromBranch: true, toBranch: true },
    });
    if (!transfer) throw new NotFoundException('Transfer stok tidak ditemukan');
    if (transfer.status !== 'APPROVED') {
      throw new BadRequestException('Hanya transfer yang sudah disetujui yang dapat dikirim');
    }

    const shipMap = new Map<number, number>((data.items ?? []).map((i: any) => [i.itemId, Number(i.shippedQty)]));

    const updated = await this.prisma.$transaction(async (tx) => {
      for (const it of transfer.items) {
        const shippedQty = shipMap.has(it.itemId) ? shipMap.get(it.itemId)! : Number(it.requestedQty);
        if (shippedQty <= 0) continue;

        const available = await getBranchStockQty(tx, transfer.fromBranchId, it.itemId);
        if (available < shippedQty) {
          throw new BadRequestException(
            `Stok ${it.item.name} di ${transfer.fromBranch.name} tidak mencukupi (tersedia ${available}, dikirim ${shippedQty})`,
          );
        }

        await tx.stockTransferItem.update({
          where: { id: it.id },
          data: { shippedQty: new Decimal(shippedQty) },
        });

        await adjustBranchStock(tx, {
          branchId: transfer.fromBranchId,
          itemId: it.itemId,
          qtyChange: -shippedQty,
          movementType: 'TRF_OUT',
          referenceType: 'STOCK_TRANSFER',
          referenceId: transfer.id,
          userId,
          notes: `Transfer ${transfer.transferNumber} → ${transfer.toBranch.name}`,
        });
      }

      return tx.stockTransfer.update({
        where: { id },
        data: { status: 'SHIPPED', shippedBy: userId, shippedAt: new Date() },
        include: this.detailInclude,
      });
    });

    await this.notificationService.createForRole(
      'KITCHEN_MANAGER',
      'TRANSFER_SHIPPED',
      `Transfer Dikirim: ${transfer.transferNumber}`,
      `Transfer dari ${transfer.fromBranch.name} sedang dalam perjalanan ke ${transfer.toBranch.name}. Konfirmasi saat diterima.`,
      `/stok/transfer/${id}`,
    );

    return updated;
  }

  /** Terima: tambah stok cabang tujuan (TRF_IN). receivedQty boleh <= shippedQty (susut). */
  async receive(id: number, data: any, userId: number) {
    const transfer = await this.prisma.stockTransfer.findUnique({
      where: { id },
      include: { items: { include: { item: { select: { name: true } } } }, fromBranch: true, toBranch: true },
    });
    if (!transfer) throw new NotFoundException('Transfer stok tidak ditemukan');
    if (transfer.status !== 'SHIPPED') {
      throw new BadRequestException('Hanya transfer yang sudah dikirim yang dapat diterima');
    }

    const recvMap = new Map<number, number>((data.items ?? []).map((i: any) => [i.itemId, Number(i.receivedQty)]));

    return this.prisma.$transaction(async (tx) => {
      for (const it of transfer.items) {
        const shipped = Number(it.shippedQty ?? 0);
        const receivedQty = recvMap.has(it.itemId) ? recvMap.get(it.itemId)! : shipped;
        if (receivedQty > shipped) {
          throw new BadRequestException(`Qty diterima ${it.item.name} melebihi qty dikirim (${shipped})`);
        }
        if (receivedQty <= 0) {
          await tx.stockTransferItem.update({ where: { id: it.id }, data: { receivedQty: new Decimal(0) } });
          continue;
        }

        await tx.stockTransferItem.update({
          where: { id: it.id },
          data: { receivedQty: new Decimal(receivedQty) },
        });

        await adjustBranchStock(tx, {
          branchId: transfer.toBranchId,
          itemId: it.itemId,
          qtyChange: receivedQty,
          movementType: 'TRF_IN',
          referenceType: 'STOCK_TRANSFER',
          referenceId: transfer.id,
          userId,
          notes: `Transfer ${transfer.transferNumber} ← ${transfer.fromBranch.name}`,
        });
      }

      return tx.stockTransfer.update({
        where: { id },
        data: { status: 'RECEIVED', receivedBy: userId, receivedAt: new Date() },
        include: this.detailInclude,
      });
    });
  }
}
