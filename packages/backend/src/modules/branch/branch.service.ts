import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateBranchInput, UpdateBranchInput } from '@mbg/shared';

interface RequestUser {
  id: number;
  role: string;
}

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  /** Cabang yang boleh diakses user (OWNER → semua, lainnya → cabang yang di-assign). */
  async findAccessible(user: RequestUser) {
    const where =
      user.role === 'OWNER'
        ? { isActive: true }
        : { isActive: true, members: { some: { userId: user.id } } };

    return this.prisma.branch.findMany({ where, orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] });
  }

  /** Daftar lengkap cabang untuk manajemen (dengan jumlah anggota & item berstok). */
  async findAll() {
    const branches = await this.prisma.branch.findMany({
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      include: {
        _count: { select: { members: true, branchStocks: true } },
      },
    });

    return branches.map((b) => ({
      ...b,
      memberCount: b._count.members,
      itemCount: b._count.branchStocks,
    }));
  }

  async findById(id: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
      },
    });
    if (!branch) throw new NotFoundException('Cabang tidak ditemukan');

    return {
      ...branch,
      members: branch.members.map((m) => m.user),
    };
  }

  async create(data: CreateBranchInput) {
    const existing = await this.prisma.branch.findUnique({ where: { code: data.code } });
    if (existing) throw new BadRequestException(`Kode cabang "${data.code}" sudah digunakan`);

    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.branch.updateMany({ data: { isDefault: false }, where: { isDefault: true } });
      }
      return tx.branch.create({
        data: {
          code: data.code,
          name: data.name,
          address: data.address || null,
          phone: data.phone || null,
          isActive: data.isActive ?? true,
          isDefault: data.isDefault ?? false,
        },
      });
    });
  }

  async update(id: number, data: UpdateBranchInput) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Cabang tidak ditemukan');

    if (data.code && data.code !== branch.code) {
      const dup = await this.prisma.branch.findUnique({ where: { code: data.code } });
      if (dup) throw new BadRequestException(`Kode cabang "${data.code}" sudah digunakan`);
    }

    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.branch.updateMany({ data: { isDefault: false }, where: { isDefault: true, id: { not: id } } });
      }
      return tx.branch.update({
        where: { id },
        data: {
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.address !== undefined ? { address: data.address || null } : {}),
          ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
          ...(data.isDefault !== undefined ? { isDefault: data.isDefault } : {}),
        },
      });
    });
  }

  async deactivate(id: number) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Cabang tidak ditemukan');
    if (branch.isDefault) throw new BadRequestException('Cabang default tidak dapat dinonaktifkan');
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }

  async getMembers(branchId: number) {
    await this.ensureExists(branchId);
    const members = await this.prisma.userBranch.findMany({
      where: { branchId },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
    return members.map((m) => m.user);
  }

  /** Set anggota cabang = daftar userIds (menambah yang baru, menghapus yang tidak ada). */
  async setMembers(branchId: number, userIds: number[]) {
    await this.ensureExists(branchId);
    return this.prisma.$transaction(async (tx) => {
      await tx.userBranch.deleteMany({ where: { branchId, userId: { notIn: userIds.length ? userIds : [0] } } });
      for (const userId of userIds) {
        await tx.userBranch.upsert({
          where: { userId_branchId: { userId, branchId } },
          update: {},
          create: { userId, branchId },
        });
      }
      return this.getMembers(branchId);
    });
  }

  async removeMember(branchId: number, userId: number) {
    await this.ensureExists(branchId);
    await this.prisma.userBranch.deleteMany({ where: { branchId, userId } });
    return { success: true };
  }

  private async ensureExists(branchId: number) {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new NotFoundException('Cabang tidak ditemukan');
  }
}
