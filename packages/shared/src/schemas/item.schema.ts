import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1).max(200),
  barcode: z.string().max(100).optional(),
  categoryId: z.number().int().positive(),
  baseUnitId: z.number().int().positive(),
  purchaseUnitId: z.number().int().positive().optional(),
  conversionFactor: z.number().positive().default(1),
  minStock: z.number().min(0).default(0),
  imageUrl: z.string().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial();

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
