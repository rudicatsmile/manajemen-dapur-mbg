import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CategoryService } from './category.service';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(@Query() query: { type?: string }) {
    return this.categoryService.findAll(query.type);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  create(@Body() body: { name: string; type: string; description?: string }) {
    return this.categoryService.create(body);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: { name?: string; description?: string; isActive?: boolean }) {
    return this.categoryService.update(id, body);
  }
}
