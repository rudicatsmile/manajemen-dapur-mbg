import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createPurchaseOrderSchema, updatePurchaseOrderSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseOrderController {
  constructor(private poService: PurchaseOrderService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('status') status?: string,
    @Query('supplierId') supplierId?: string,
  ) {
    return this.poService.findAll(
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
    @Body(new ZodValidationPipe(createPurchaseOrderSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.poService.create(body, user.id);
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
