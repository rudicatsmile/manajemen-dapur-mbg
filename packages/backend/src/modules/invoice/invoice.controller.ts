import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { paginationQuerySchema } from '@mbg/shared';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: any,
    @Query('status') status?: string,
  ) {
    return this.invoiceService.findAll(query.page, query.perPage, query.search, status);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async create(@Body() body: any, @CurrentUser() user: { id: number }) {
    return this.invoiceService.create(body, user.id);
  }

  @Post(':id/verify')
  @Roles('ADMIN', 'OWNER')
  async verify(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.invoiceService.verify(id, user.id);
  }
}
