import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import type { SupplierJwtPayload } from './strategies/supplier-jwt.strategy';

@Injectable()
export class SupplierAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const supplierUser = await this.prisma.supplierUser.findUnique({
      where: { email },
      include: { supplier: true },
    });
    if (!supplierUser) {
      throw new UnauthorizedException('Email atau password salah');
    }
    if (!supplierUser.isActive) {
      throw new UnauthorizedException('Akun tidak aktif');
    }
    if (!supplierUser.supplier.isActive) {
      throw new UnauthorizedException('Supplier tidak aktif');
    }
    const isMatch = await bcrypt.compare(password, supplierUser.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    await this.prisma.supplierUser.update({
      where: { id: supplierUser.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: SupplierJwtPayload = {
      sub: supplierUser.id,
      supplierId: supplierUser.supplierId,
      email: supplierUser.email,
      type: 'SUPPLIER',
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      supplier: {
        id: supplierUser.id,
        supplierId: supplierUser.supplierId,
        name: supplierUser.name,
        email: supplierUser.email,
        supplierName: supplierUser.supplier.name,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<SupplierJwtPayload>(refreshToken);
      if (payload.type !== 'SUPPLIER') {
        throw new UnauthorizedException('Token tidak valid');
      }
      const supplierUser = await this.prisma.supplierUser.findUnique({
        where: { id: payload.sub },
      });
      if (!supplierUser || !supplierUser.isActive) {
        throw new UnauthorizedException('Token tidak valid');
      }
      const newPayload: SupplierJwtPayload = {
        sub: supplierUser.id,
        supplierId: supplierUser.supplierId,
        email: supplierUser.email,
        type: 'SUPPLIER',
      };
      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid atau sudah kadaluarsa');
    }
  }

  async changePassword(supplierUserId: number, currentPassword: string, newPassword: string) {
    const supplierUser = await this.prisma.supplierUser.findUnique({
      where: { id: supplierUserId },
    });
    if (!supplierUser) {
      throw new BadRequestException('Akun tidak ditemukan');
    }
    const isMatch = await bcrypt.compare(currentPassword, supplierUser.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Password saat ini salah');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.supplierUser.update({
      where: { id: supplierUserId },
      data: { passwordHash: hashedPassword },
    });
    return { message: 'Password berhasil diubah' };
  }
}
