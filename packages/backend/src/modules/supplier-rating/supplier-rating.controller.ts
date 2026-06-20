import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SupplierRatingService } from './supplier-rating.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('supplier-ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('OWNER', 'ADMIN')
export class SupplierRatingController {
  constructor(private supplierRatingService: SupplierRatingService) {}

  @Get()
  async getSupplierRatings(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const period = from && to ? { from, to } : undefined;
    return this.supplierRatingService.getSupplierRatings(period);
  }

  @Get(':supplierId')
  async getSupplierDetail(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const period = from && to ? { from, to } : undefined;
    return this.supplierRatingService.getSupplierDetail(supplierId, period);
  }
}
