import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createProductionSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('productions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('status') status?: string,
  ) {
    return this.productionService.findAll(query.page, query.perPage, query.search, status);
  }

  @Get('check-stock')
  async checkStock(@Query('recipeId') recipeId: string, @Query('qty') qty: string) {
    return this.productionService.checkStock(parseInt(recipeId, 10), parseFloat(qty));
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.productionService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async create(
    @Body(new ZodValidationPipe(createProductionSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.productionService.create(body, user.id);
  }

  @Post(':id/complete')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async complete(@Param('id', ParseIntPipe) id: number, @Body('actualQty') actualQty?: number) {
    return this.productionService.complete(id, actualQty);
  }
}
