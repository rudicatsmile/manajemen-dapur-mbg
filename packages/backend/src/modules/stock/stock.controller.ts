import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { OpnameService } from './opname/opname.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { stockAdjustmentSchema, createOpnameSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {
  constructor(
    private stockService: StockService,
    private opnameService: OpnameService,
  ) {}

  @Get('summary')
  async summary() {
    return this.stockService.summary();
  }

  @Get('low-stock')
  async lowStock() {
    return this.stockService.lowStock();
  }

  @Post('adjustment')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async adjustment(
    @Body(new ZodValidationPipe(stockAdjustmentSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.stockService.adjustment(body, user.id);
  }

  @Get('movements')
  async movements(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('itemId') itemId?: string,
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.stockService.movements(
      query.page, query.perPage,
      itemId ? parseInt(itemId, 10) : undefined,
      type, from, to,
    );
  }

  // Opname endpoints
  @Get('opnames')
  async opnameList(@Query(new ZodValidationPipe(paginationQuerySchema)) query: any) {
    return this.opnameService.findAll(query.page, query.perPage);
  }

  @Get('opnames/:id')
  async opnameDetail(@Param('id', ParseIntPipe) id: number) {
    return this.opnameService.findById(id);
  }

  @Post('opnames')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async opnameCreate(
    @Body(new ZodValidationPipe(createOpnameSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.opnameService.create(body, user.id);
  }

  @Patch('opnames/:id')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async opnameUpdate(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.opnameService.update(id, body);
  }

  @Post('opnames/:id/approve')
  @Roles('ADMIN', 'OWNER')
  async opnameApprove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.opnameService.approve(id, user.id);
  }
}
