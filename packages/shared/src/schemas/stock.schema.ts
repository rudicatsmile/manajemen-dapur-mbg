import { z } from 'zod';

export const stockAdjustmentSchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number(),
  reason: z.string().min(1),
  notes: z.string().optional(),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;

export const createOpnameItemSchema = z.object({
  itemId: z.number().int().positive(),
  actualQty: z.number().min(0),
  notes: z.string().optional(),
});

export type CreateOpnameItemInput = z.infer<typeof createOpnameItemSchema>;

export const createOpnameSchema = z.object({
  opnameDate: z.string().date(),
  notes: z.string().optional(),
  items: z.array(createOpnameItemSchema).min(1),
});

export type CreateOpnameInput = z.infer<typeof createOpnameSchema>;
