import { z } from 'zod';

export const createSupplierPriceSchema = z.object({
  itemId: z.number().int().positive(),
  unitId: z.number().int().positive().optional(),
  price: z.number().positive('Harga harus lebih dari 0'),
  effectiveDate: z.string().min(1, 'Tanggal berlaku wajib diisi'),
  validUntil: z.string().optional(),
  note: z.string().max(500).optional(),
});

export type CreateSupplierPriceInput = z.infer<typeof createSupplierPriceSchema>;
