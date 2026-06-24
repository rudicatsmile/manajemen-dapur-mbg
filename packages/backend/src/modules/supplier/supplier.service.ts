import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate, paginationMeta } from '../../common/helpers/pagination.helper';
import { NotificationService } from '../notification/notification.service';

const SUPPLIER_USER_SELECT = {
  id: true,
  supplierId: true,
  email: true,
  name: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SupplierService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async findAll(page: number, perPage: number, search?: string) {
    const { skip, take } = paginate(page, perPage);
    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { contactPerson: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      this.prisma.supplier.count({ where }),
    ]);

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async findById(id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return supplier;
  }

  async create(data: any) {
    return this.prisma.supplier.create({ data });
  }

  async update(id: number, data: any) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async deactivate(id: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return this.prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }

  // ---- Akun login supplier (Vendor Portal) ----

  async listAccounts(supplierId: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');
    return this.prisma.supplierUser.findMany({
      where: { supplierId },
      select: SUPPLIER_USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAccount(
    supplierId: number,
    data: { name: string; email: string; password: string },
  ) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');

    const exists = await this.prisma.supplierUser.findUnique({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.supplierUser.create({
      data: { supplierId, name: data.name, email: data.email, passwordHash },
      select: SUPPLIER_USER_SELECT,
    });
  }

  async updateAccount(
    accountId: number,
    data: { name?: string; email?: string; password?: string; isActive?: boolean },
  ) {
    const account = await this.prisma.supplierUser.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('Akun supplier tidak ditemukan');

    if (data.email && data.email !== account.email) {
      const exists = await this.prisma.supplierUser.findUnique({ where: { email: data.email } });
      if (exists) throw new BadRequestException('Email sudah terdaftar');
    }

    return this.prisma.supplierUser.update({
      where: { id: accountId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.password !== undefined && { passwordHash: await bcrypt.hash(data.password, 10) }),
      },
      select: SUPPLIER_USER_SELECT,
    });
  }

  // ---- Katalog Harga (internal view) ----

  async listPrices(supplierId: number, itemId?: number) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');

    const where: Record<string, unknown> = { supplierId, isActive: true };
    if (itemId) where.itemId = itemId;

    return this.prisma.supplierItemPrice.findMany({
      where,
      orderBy: { effectiveDate: 'desc' },
      include: {
        item: { select: { id: true, name: true, sku: true } },
        unit: { select: { id: true, name: true, abbreviation: true } },
      },
    });
  }

  // ---- Chat / Messages (internal side) ----

  async listMessages(supplierId: number, page: number, perPage: number) {
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

    // Tandai pesan supplier sebagai dibaca oleh internal
    await this.prisma.supplierMessage.updateMany({
      where: { supplierId, senderType: 'SUPPLIER', readByInternal: false },
      data: { readByInternal: true },
    });

    return { data, meta: paginationMeta(total, page, perPage) };
  }

  async sendMessage(supplierId: number, userId: number, data: { body: string; poId?: number }) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { supplierUsers: { where: { isActive: true }, select: { id: true } } },
    });
    if (!supplier) throw new NotFoundException('Supplier tidak ditemukan');

    const message = await this.prisma.supplierMessage.create({
      data: {
        supplierId,
        senderType: 'INTERNAL',
        senderUserId: userId,
        body: data.body,
        poId: data.poId ?? null,
        readByInternal: true,
      },
      include: {
        senderUser: { select: { id: true, name: true } },
        purchaseOrder: { select: { id: true, poNumber: true } },
      },
    });

    return message;
  }

  async unreadMessageCount(userId: number) {
    // Hitung supplier yang memiliki pesan belum dibaca oleh internal
    const result = await this.prisma.supplierMessage.count({
      where: { senderType: 'SUPPLIER', readByInternal: false },
    });
    return result;
  }
}
