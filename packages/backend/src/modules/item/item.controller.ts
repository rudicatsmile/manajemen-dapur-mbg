import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ItemService } from './item.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createItemSchema, updateItemSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('categoryId') categoryId?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.itemService.findAll(
      query.page,
      query.perPage,
      query.search,
      categoryId ? parseInt(categoryId, 10) : undefined,
      lowStock === 'true',
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findById(id);
  }

  @Get(':id/movements')
  async getMovements(
    @Param('id', ParseIntPipe) id: number,
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
  ) {
    return this.itemService.getMovements(id, query.page, query.perPage);
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
