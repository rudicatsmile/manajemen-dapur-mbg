import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { createPurchaseOrderSchema, updatePurchaseOrderSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class PurchaseOrderController {
  constructor(private poService: PurchaseOrderService) {}

  @Get()
  async findAll(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('status') status?: string,
    @Query('supplierId') supplierId?: string,
  ) {
    return this.poService.findAll(
      branch.branchId,
      query.page, query.perPage, query.search,
      status, supplierId ? parseInt(supplierId, 10) : undefined,
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.poService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async create(
    @CurrentBranch() branch: BranchContext,
    @Body(new ZodValidationPipe(createPurchaseOrderSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk membuat PO');
    return this.poService.create(branch.branchId, body, user.id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updatePurchaseOrderSchema)) body: any,
  ) {
    return this.poService.update(id, body);
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'OWNER')
  async approve(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.poService.approve(id, user.id);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'OWNER')
  async reject(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.poService.reject(id, user.id);
  }

  @Post(':id/cancel')
  @Roles('ADMIN', 'OWNER')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.poService.cancel(id);
  }
}
