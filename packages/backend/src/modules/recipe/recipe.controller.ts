import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createRecipeSchema, updateRecipeSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('recipes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.recipeService.findAll(
      query.page, query.perPage, query.search,
      categoryId ? parseInt(categoryId, 10) : undefined,
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async create(
    @Body(new ZodValidationPipe(createRecipeSchema)) body: any,
    @CurrentUser() user: { id: number },
  ) {
    return this.recipeService.create(body, user.id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateRecipeSchema)) body: any,
  ) {
    return this.recipeService.update(id, body);
  }

  @Post(':id/duplicate')
  @Roles('ADMIN', 'OWNER', 'KITCHEN_MANAGER')
  async duplicate(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.recipeService.duplicate(id, user.id);
  }
}
