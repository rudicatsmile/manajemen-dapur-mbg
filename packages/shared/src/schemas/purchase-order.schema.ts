import { z } from 'zod';

export const createPurchaseOrderItemSchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitId: z.number().int().positive(),
  unitPrice: z.number().min(0),
  notes: z.string().optional(),
});

export type CreatePurchaseOrderItemInput = z.infer<typeof createPurchaseOrderItemSchema>;

export const createPurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive(),
  poDate: z.string().date(),
  expectedDate: z.string().date().optional(),
  notes: z.string().optional(),
  items: z.array(createPurchaseOrderItemSchema).min(1),
});

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;

export const updatePurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive().optional(),
  poDate: z.string().date().optional(),
  expectedDate: z.string().date().optional(),
  notes: z.string().optional(),
  items: z.array(createPurchaseOrderItemSchema).min(1).optional(),
});

export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;
