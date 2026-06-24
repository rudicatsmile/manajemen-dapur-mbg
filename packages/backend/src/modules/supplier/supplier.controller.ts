import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createSupplierSchema,
  updateSupplierSchema,
  paginationQuerySchema,
  createSupplierUserSchema,
  updateSupplierUserSchema,
  sendMessageSchema,
} from '@mbg/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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

  // ---- Akun login supplier (Vendor Portal) ----

  @Get(':id/accounts')
  @Roles('ADMIN', 'OWNER')
  async listAccounts(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.listAccounts(id);
  }

  @Post(':id/accounts')
  @Roles('ADMIN', 'OWNER')
  async createAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(createSupplierUserSchema)) body: any,
  ) {
    return this.supplierService.createAccount(id, body);
  }

  @Patch('accounts/:accountId')
  @Roles('ADMIN', 'OWNER')
  async updateAccount(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body(new ZodValidationPipe(updateSupplierUserSchema)) body: any,
  ) {
    return this.supplierService.updateAccount(accountId, body);
  }

  // ---- Katalog Harga (internal view) ----

  @Get(':id/prices')
  async listPrices(
    @Param('id', ParseIntPipe) id: number,
    @Query('itemId') itemId?: string,
  ) {
    return this.supplierService.listPrices(id, itemId ? parseInt(itemId, 10) : undefined);
  }

  // ---- Chat / Messages (internal side) ----

  @Get(':id/messages')
  async listMessages(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.supplierService.listMessages(
      id,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 50,
    );
  }

  @Post(':id/messages')
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  async sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(sendMessageSchema)) body: { body: string; poId?: number },
    @CurrentUser() user: { id: number },
  ) {
    return this.supplierService.sendMessage(id, user.id, body);
  }

  @Get('messages/unread-count')
  async unreadCount(@CurrentUser() user: { id: number }) {
    const count = await this.supplierService.unreadMessageCount(user.id);
    return { count };
  }
}
