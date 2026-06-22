import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { OpnameService } from './opname/opname.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { stockAdjustmentSchema, createOpnameSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class StockController {
  constructor(
    private stockService: StockService,
    private opnameService: OpnameService,
  ) {}

  @Get('summary')
  async summary(@CurrentBranch() branch: BranchContext) {
    return this.stockService.summary(branch.branchId);
  }

  @Get('low-stock')
  async lowStock(@CurrentBranch() branch: BranchContext) {
    return this.stockService.lowStock(branch.branchId);
  }

  @Post('adjustment')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async adjustment(
    @CurrentBranch() branch: BranchContext,
    @Body(new ZodValidationPipe(stockAdjustmentSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk penyesuaian stok');
    return this.stockService.adjustment(branch.branchId, body, user.id);
  }

  @Get('movements')
  async movements(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('itemId') itemId?: string,
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.stockService.movements(
      branch.branchId,
      query.page, query.perPage,
      itemId ? parseInt(itemId, 10) : undefined,
      type, from, to,
    );
  }

  // Opname endpoints
  @Get('opnames')
  async opnameList(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
  ) {
    return this.opnameService.findAll(branch.branchId, query.page, query.perPage);
  }

  @Get('opnames/:id')
  async opnameDetail(@Param('id', ParseIntPipe) id: number) {
    return this.opnameService.findById(id);
  }

  @Post('opnames')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async opnameCreate(
    @CurrentBranch() branch: BranchContext,
    @Body(new ZodValidationPipe(createOpnameSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk membuat opname');
    return this.opnameService.create(branch.branchId, body, user.id);
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
