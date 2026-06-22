import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ItemService } from './item.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentBranch, type BranchContext } from '../../common/decorators/current-branch.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createItemSchema, updateItemSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard, BranchAccessGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  async findAll(
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('categoryId') categoryId?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.itemService.findAll(
      branch.branchId,
      query.page,
      query.perPage,
      query.search,
      categoryId ? parseInt(categoryId, 10) : undefined,
      lowStock === 'true',
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @CurrentBranch() branch: BranchContext) {
    return this.itemService.findById(id, branch.branchId);
  }

  @Get(':id/movements')
  async getMovements(
    @Param('id', ParseIntPipe) id: number,
    @CurrentBranch() branch: BranchContext,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
  ) {
    return this.itemService.getMovements(id, branch.branchId, query.page, query.perPage);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async create(@Body(new ZodValidationPipe(createItemSchema)) body: any) {
    return this.itemService.create(body);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateItemSchema)) body: any) {
    return this.itemService.update(id, body);
  }
}
