import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { createProductionSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('productions')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Get()
  async findAll(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('status') status?: string,
  ) {
    return this.productionService.findAll(branch.branchId, query.page, query.perPage, query.search, status);
  }

  @Get('check-stock')
  async checkStock(
    @CurrentBranch() branch: BranchContext,
    @Query('recipeId') recipeId: string,
    @Query('qty') qty: string,
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk cek stok');
    return this.productionService.checkStock(branch.branchId, parseInt(recipeId, 10), parseFloat(qty));
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.productionService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async create(
    @CurrentBranch() branch: BranchContext,
    @Body(new ZodValidationPipe(createProductionSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    if (!branch.branchId) throw new BadRequestException('Pilih cabang spesifik untuk membuat produksi');
    return this.productionService.create(branch.branchId, body, user.id);
  }

  @Post(':id/complete')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async complete(@Param('id', ParseIntPipe) id: number, @Body('actualQty') actualQty?: number) {
    return this.productionService.complete(id, actualQty);
  }
}
