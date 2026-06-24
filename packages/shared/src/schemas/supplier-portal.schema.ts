import { z } from 'zod';

export const updateShipmentSchema = z.object({
  status: z.enum(['ACKNOWLEDGED', 'PREPARING', 'SHIPPED', 'DELIVERED']),
  note: z.string().max(1000).optional(),
  eta: z.string().optional(),
});

export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;

export const portalCreateInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Nomor invoice wajib diisi').max(100),
  poId: z.number().int().positive().optional(),
  invoiceDate: z.string().min(1, 'Tanggal wajib diisi'),
  totalAmount: z.number().positive('Jumlah harus lebih dari 0'),
  notes: z.string().max(1000).optional(),
});

export type PortalCreateInvoiceInput = z.infer<typeof portalCreateInvoiceSchema>;
