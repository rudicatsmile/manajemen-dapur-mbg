import {
  Controller, Get, Post, Param, Body, Query, UseGuards, UseInterceptors,
  ParseIntPipe, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { paginationQuerySchema } from '@mbg/shared';
import { uploadStorage, fileFilter, MAX_FILE_SIZE } from '../../common/helpers/upload.helper';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(paginationQuerySchema)) query: { page: number; perPage: number; search?: string },
    @Query('status') status?: string,
  ) {
    return this.invoiceService.findAll(query.page, query.perPage, query.search, status);
  }

  @Post()
  @Roles('ADMIN', 'OWNER', 'PURCHASER')
  @UseInterceptors(FileInterceptor('file', {
    storage: uploadStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }))
  async create(
    @Body() body: { invoiceNumber: string; poId?: string; supplierId: string; invoiceDate: string; amount: string; notes?: string },
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: { id: number },
  ) {
    return this.invoiceService.create(
      {
        invoiceNumber: body.invoiceNumber,
        poId: body.poId ? parseInt(body.poId, 10) : undefined,
        supplierId: parseInt(body.supplierId, 10),
        invoiceDate: body.invoiceDate,
        totalAmount: parseFloat(body.amount),
        imageUrl: file ? `/uploads/${file.filename}` : undefined,
        notes: body.notes,
      },
      user.id,
    );
  }

  @Post(':id/verify')
  @Roles('ADMIN', 'OWNER')
  async verify(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.invoiceService.verify(id, user.id);
  }
}
