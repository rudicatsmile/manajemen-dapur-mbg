import {
  Controller, Get, Post, Param, Body, Query, UseGuards, UseInterceptors,
  ParseIntPipe, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupplierPortalService } from './supplier-portal.service';
import { SupplierJwtGuard } from '../../common/guards/supplier-jwt.guard';
import { CurrentSupplier } from '../../common/decorators/current-supplier.decorator';
import type { SupplierPrincipal } from '../supplier-auth/strategies/supplier-jwt.strategy';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { updateShipmentSchema, createSupplierPriceSchema, sendMessageSchema } from '@mbg/shared';
import { uploadStorage, fileFilter, MAX_FILE_SIZE } from '../../common/helpers/upload.helper';

@Controller('portal')
@UseGuards(SupplierJwtGuard)
export class SupplierPortalController {
  constructor(private portalService: SupplierPortalService) {}

  // ─── PURCHASE ORDERS ─────────────────────────────────────

  @Get('purchase-orders')
  async listPOs(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('status') status?: string,
  ) {
    return this.portalService.findPurchaseOrders(
      supplier.supplierId,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 20,
      status,
    );
  }

  @Get('purchase-orders/:id')
  async getPO(
    @Param('id', ParseIntPipe) id: number,
    @CurrentSupplier() supplier: SupplierPrincipal,
  ) {
    return this.portalService.findPurchaseOrderById(id, supplier.supplierId);
  }

  @Post('purchase-orders/:id/shipment')
  async updateShipment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Body(new ZodValidationPipe(updateShipmentSchema)) body: { status: string; note?: string; eta?: string },
  ) {
    return this.portalService.updateShipment(
      id,
      supplier.supplierId,
      supplier.supplierUserId,
      body,
    );
  }

  // ─── INVOICES ────────────────────────────────────────────

  @Get('invoices')
  async listInvoices(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.portalService.findInvoices(
      supplier.supplierId,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 20,
    );
  }

  @Post('invoices')
  @UseInterceptors(FileInterceptor('file', {
    storage: uploadStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }))
  async createInvoice(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Body() body: { invoiceNumber: string; poId?: string; invoiceDate: string; totalAmount: string; notes?: string },
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return this.portalService.createInvoice(
      supplier.supplierId,
      supplier.supplierUserId,
      {
        invoiceNumber: body.invoiceNumber,
        poId: body.poId ? parseInt(body.poId, 10) : undefined,
        invoiceDate: body.invoiceDate,
        totalAmount: parseFloat(body.totalAmount),
        notes: body.notes,
      },
      file ? `/uploads/${file.filename}` : undefined,
    );
  }

  // ─── KATALOG HARGA ──────────────────────────────────────

  @Get('items')
  async listItems() {
    return this.portalService.findItemsForPriceCatalog();
  }

  @Get('prices')
  async listPrices(@CurrentSupplier() supplier: SupplierPrincipal) {
    return this.portalService.findPrices(supplier.supplierId);
  }

  @Post('prices')
  async createPrice(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Body(new ZodValidationPipe(createSupplierPriceSchema)) body: { itemId: number; unitId?: number; price: number; effectiveDate: string; validUntil?: string; note?: string },
  ) {
    return this.portalService.createPrice(supplier.supplierId, body);
  }

  // ─── MESSAGES ───────────────────────────────────────────

  @Get('messages')
  async listMessages(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.portalService.findMessages(
      supplier.supplierId,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 50,
    );
  }

  @Post('messages')
  async sendMessage(
    @CurrentSupplier() supplier: SupplierPrincipal,
    @Body(new ZodValidationPipe(sendMessageSchema)) body: { body: string; poId?: number },
  ) {
    return this.portalService.sendMessageFromPortal(
      supplier.supplierId,
      supplier.supplierUserId,
      body,
    );
  }
}
