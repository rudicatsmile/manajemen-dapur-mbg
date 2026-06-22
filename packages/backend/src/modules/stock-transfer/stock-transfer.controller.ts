import {
  Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe, BadRequestException,
} from '@nestjs/common';
import { StockTransferService } from './stock-transfer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createStockTransferSchema, shipStockTransferSchema, receiveStockTransferSchema,
  rejectStockTransferSchema, paginationQuerySchema,
} from '@mbg/shared';

@Controller('stock-transfers')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class StockTransferController {
  constructor(private transferService: StockTransferService) {}

  @Get()
  async findAll(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('status') status?: string,
  ) {
    return this.transferService.findAll(branch.branchId, query.page, query.perPage, status);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.transferService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER', 'PURCHASER')
  async create(
    @CurrentBranch() branch: BranchContext,
    @Body(new ZodValidationPipe(createStockTransferSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk membuat transfer');
    return this.transferService.create(branch.branchId, body, user.id);
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'OWNER')
  async approve(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.transferService.approve(id, user.id);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'OWNER')
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(rejectStockTransferSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.transferService.reject(id, user.id, body.reason);
  }

  @Post(':id/cancel')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER', 'PURCHASER')
  async cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.transferService.cancel(id, user.id);
  }

  @Post(':id/ship')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async ship(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(shipStockTransferSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.transferService.ship(id, body, user.id);
  }

  @Post(':id/receive')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async receive(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(receiveStockTransferSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.transferService.receive(id, body, user.id);
  }
}
