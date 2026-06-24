import { Controller, Post, Body, UseGuards, UsePipes } from '@nestjs/common';
import { SupplierAuthService } from './supplier-auth.service';
import { SupplierJwtGuard } from '../../common/guards/supplier-jwt.guard';
import { CurrentSupplier } from '../../common/decorators/current-supplier.decorator';
import type { SupplierPrincipal } from './strategies/supplier-jwt.strategy';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { supplierLoginSchema, supplierChangePasswordSchema } from '@mbg/shared';

@Controller('supplier-auth')
export class SupplierAuthController {
  constructor(private supplierAuthService: SupplierAuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(supplierLoginSchema))
  async login(@Body() body: { email: string; password: string }) {
    return this.supplierAuthService.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.supplierAuthService.refresh(refreshToken);
  }

  @Post('change-password')
  @UseGuards(SupplierJwtGuard)
  async changePassword(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Body(new ZodValidationPipe(supplierChangePasswordSchema))
    body: { currentPassword: string; newPassword: string },
  ) {
    return this.supplierAuthService.changePassword(
      supplier.supplierUserId,
      body.currentPassword,
      body.newPassword,
    );
  }
}
