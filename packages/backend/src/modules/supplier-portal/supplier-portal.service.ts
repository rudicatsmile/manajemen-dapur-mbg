import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { NotificationService } from '../notification/notification.service';

const PO_INCLUDE = {
  branch: { select: { id: true, name: true } },
  items: {
    include: {
      item: { select: { id: true, name: true, sku: true } },
      unit: { select: { id: true, name: true, abbreviation: true } },
    },
  },
  shipmentUpdates: {
    orderBy: { createdAt: 'desc' as const },
    include: { createdBy: { select: { id: true, name: true } } },
  },
} as const;

@Injectable()
export class SupplierPortalService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // ─── PURCHASE ORDERS ─────────────────────────────────────

  async findPurchaseOrders(
    supplierId: number,
    page: number,
    perPage: number,
    status?: string,
  ) {
    const { skip, take } = paginate(page, perPage);
    const where: Record<string, unknown> = {
      supplierId,
      status: { in: ['APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'COMPLETED'] },
    };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take,
        orderBy: { poDate: 'desc' },
        include: {
          branch: { select: { id: true, name: true } },
          items: {
            include: {
              item: { select: { id: true, name: true } },
              unit: { select: { id: true, abbreviation: true } },
            },
          },
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findPurchaseOrderById(poId: number, supplierId: number) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: PO_INCLUDE,
    });
    if (!po) throw new NotFoundException('PO tidak ditemukan');
    if (po.supplierId !== supplierId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke PO ini');
    }
    return po;
  }

  async updateShipment(
    poId: number,
    supplierId: number,
    supplierUserId: number,
    data: { status: string; note?: string; eta?: string },
  ) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id: poId } });
    if (!po) throw new NotFoundException('PO tidak ditemukan');
    if (po.supplierId !== supplierId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke PO ini');
    }

    return this.prisma.$transaction(async (tx) => {
      const update = await tx.poShipmentUpdate.create({
        data: {
          poId,
          status: data.status,
          note: data.note ?? null,
          eta: data.eta ? new Date(data.eta) : null,
          createdBySupplierUserId: supplierUserId,
        },
      });

      await tx.purchaseOrder.update({
        where: { id: poId },
        data: {
          shipmentStatus: data.status,
          shipmentNote: data.note ?? null,
          ...(data.status === 'SHIPPED' ? { shippedAt: new Date() } : {}),
        },
      });

      // Kirim notifikasi ke pembuat PO
      await this.notificationService.create(
        po.createdBy,
        'SHIPMENT_UPDATE',
        `Update pengiriman ${po.poNumber}`,
        `Supplier mengubah status pengiriman ke "${data.status}"${data.note ? `: ${data.note}` : ''}`,
        `/pembelian/purchase-order/${poId}`,
      );

      return update;
    });
  }

  // ─── INVOICES ────────────────────────────────────────────

  async findInvoices(supplierId: number, page: number, perPage: number) {
    const { skip, take } = paginate(page, perPage);
    const where = { supplierId, source: 'SUPPLIER' };
    const [data, total] = await Promise.all([
      this.prisma.purchaseInvoice.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { purchaseOrder: { select: { id: true, poNumber: true } } },
      }),
      this.prisma.purchaseInvoice.count({ where }),
    ]);
    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async createInvoice(
    supplierId: number,
    supplierUserId: number,
    data: { invoiceNumber: string; poId?: number; invoiceDate: string; totalAmount: number; notes?: string },
    imageUrl?: string,
  ) {
    if (data.poId) {
      const po = await this.prisma.purchaseOrder.findUnique({ where: { id: data.poId } });
      if (!po || po.supplierId !== supplierId) {
        throw new BadRequestException('PO tidak valid atau bukan milik Anda');
      }
    }

    const invoice = await this.prisma.purchaseInvoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        poId: data.poId ?? null,
        supplierId,
        invoiceDate: new Date(data.invoiceDate),
        totalAmount: data.totalAmount,
        imageUrl: imageUrl ?? null,
        notes: data.notes ?? null,
        source: 'SUPPLIER',
        supplierUserId,
        createdBy: null,
      },
      include: { purchaseOrder: { select: { id: true, poNumber: true } } },
    });

    // Notifikasi ke purchaser/admin yang membuat PO terkait
    if (data.poId) {
      const po = await this.prisma.purchaseOrder.findUnique({ where: { id: data.poId } });
      if (po) {
        await this.notificationService.create(
          po.createdBy,
          'SUPPLIER_INVOICE',
          `Invoice baru dari supplier`,
          `Supplier mengirim invoice ${data.invoiceNumber} untuk ${po.poNumber}`,
          `/pembelian/invoice`,
        );
      }
    }

    return invoice;
  }

  // ─── KATALOG HARGA ──────────────────────────────────────

  async findPrices(supplierId: number) {
    return this.prisma.supplierItemPrice.findMany({
      where: { supplierId, isActive: true },
      orderBy: { effectiveDate: 'desc' },
      include: {
        item: { select: { id: true, name: true, sku: true } },
        unit: { select: { id: true, name: true, abbreviation: true } },
      },
    });
  }

  async createPrice(
    supplierId: number,
    data: { itemId: number; unitId?: number; price: number; effectiveDate: string; validUntil?: string; note?: string },
  ) {
    // Nonaktifkan harga lama untuk item yang sama
    await this.prisma.supplierItemPrice.updateMany({
      where: { supplierId, itemId: data.itemId, isActive: true },
      data: { isActive: false },
    });

    return this.prisma.supplierItemPrice.create({
      data: {
        supplierId,
        itemId: data.itemId,
        unitId: data.unitId ?? null,
        price: data.price,
        effectiveDate: new Date(data.effectiveDate),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        note: data.note ?? null,
      },
      include: {
        item: { select: { id: true, name: true, sku: true } },
        unit: { select: { id: true, name: true, abbreviation: true } },
      },
    });
  }

  async findItemsForPriceCatalog() {
    return this.prisma.item.findMany({
      where: { isActive: true },
      select: { id: true, name: true, sku: true, baseUnitId: true, baseUnit: { select: { id: true, name: true, abbreviation: true } } },
      orderBy: { name: 'asc' },
    });
  }

  // ─── CHAT / MESSAGES ────────────────────────────────────

  async findMessages(supplierId: number, page: number, perPage: number) {
    const { skip, take } = paginate(page, perPage);
    const where = { supplierId };
    const [data, total] = await Promise.all([
      this.prisma.supplierMessage.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          senderUser: { select: { id: true, name: true } },
          senderSupplierUser: { select: { id: true, name: true } },
          purchaseOrder: { select: { id: true, poNumber: true } },
        },
      }),
      this.prisma.supplierMessage.count({ where }),
    ]);

    // Tandai pesan internal sebagai dibaca oleh supplier
    await this.prisma.supplierMessage.updateMany({
      where: { supplierId, senderType: 'INTERNAL', readBySupplier: false },
      data: { readBySupplier: true },
    });

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async sendMessageFromPortal(
    supplierId: number,
    supplierUserId: number,
    data: { body: string; poId?: number },
  ) {
    const message = await this.prisma.supplierMessage.create({
      data: {
        supplierId,
        senderType: 'SUPPLIER',
        senderSupplierUserId: supplierUserId,
        body: data.body,
        poId: data.poId ?? null,
        readBySupplier: true,
      },
      include: {
        senderSupplierUser: { select: { id: true, name: true } },
        purchaseOrder: { select: { id: true, poNumber: true } },
      },
    });

    // Notifikasi ke purchaser/admin terkait supplier ini
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    const purchasers = await this.prisma.user.findMany({
      where: { role: { in: ['PURCHASER', 'ADMIN', 'OWNER'] }, isActive: true },
      select: { id: true },
    });
    for (const u of purchasers.slice(0, 5)) {
      await this.notificationService.create(
        u.id,
        'SUPPLIER_MESSAGE',
        `Pesan dari ${supplier?.name ?? 'supplier'}`,
        data.body.slice(0, 100),
        `/pembelian/supplier/${supplierId}`,
      ).catch(() => {});
    }

    return message;
  }
}
