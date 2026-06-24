import { z } from 'zod';

export const createStockTransferSchema = z
  .object({
    fromBranchId: z.number().int().positive('Cabang asal wajib dipilih'),
    toBranchId: z.number().int().positive('Cabang tujuan wajib dipilih'),
    requestDate: z.string().min(1, 'Tanggal permintaan wajib diisi'),
    notes: z.string().max(1000).optional().or(z.literal('')),
    items: z
      .array(
        z.object({
          itemId: z.number().int().positive(),
          unitId: z.number().int().positive(),
          requestedQty: z.number().positive('Jumlah harus lebih dari 0'),
          notes: z.string().max(500).optional().or(z.literal('')),
        }),
      )
      .min(1, 'Minimal satu item harus ditransfer'),
  })
  .refine((d) => d.fromBranchId !== d.toBranchId, {
    message: 'Cabang asal dan tujuan tidak boleh sama',
    path: ['toBranchId'],
  });

export type CreateStockTransferInput = z.infer<typeof createStockTransferSchema>;

/** Item dikirim — actual qty yang dikirim per item (boleh <= requested). */
export const shipStockTransferSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.number().int().positive(),
        shippedQty: z.number().nonnegative(),
      }),
    )
    .min(1),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type ShipStockTransferInput = z.infer<typeof shipStockTransferSchema>;

/** Item diterima — actual qty diterima per item (boleh <= shipped untuk susut). */
export const receiveStockTransferSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.number().int().positive(),
        receivedQty: z.number().nonnegative(),
      }),
    )
    .min(1),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type ReceiveStockTransferInput = z.infer<typeof receiveStockTransferSchema>;

export const rejectStockTransferSchema = z.object({
  reason: z.string().max(1000).optional().or(z.literal('')),
});

export type RejectStockTransferInput = z.infer<typeof rejectStockTransferSchema>;
