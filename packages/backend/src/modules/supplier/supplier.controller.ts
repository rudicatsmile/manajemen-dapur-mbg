import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createSupplierSchema, updateSupplierSchema, paginationQuerySchema } from '@mbg/shared';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  async findAll(@Query(new ZodValidationPipe(paginationQuerySchema)) query: any) {
    return this.supplierService.findAll(query.page, query.perPage, query.search);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.findById(id);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async create(@Body(new ZodValidationPipe(createSupplierSchema)) body: any) {
    return this.supplierService.create(body);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updateSupplierSchema)) body: any) {
    return this.supplierService.update(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.deactivate(id);
  }
}
