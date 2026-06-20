import { z } from 'zod';

export const receivingItemSchema = z.object({
  poItemId: z.number().int().positive(),
  itemId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitId: z.number().int().positive(),
  notes: z.string().optional(),
});

export type ReceivingItemInput = z.infer<typeof receivingItemSchema>;

export const createReceivingSchema = z.object({
  poId: z.number().int().positive(),
  receivedDate: z.string().date(),
  notes: z.string().optional(),
  items: z.array(receivingItemSchema).min(1),
});

export type CreateReceivingInput = z.infer<typeof createReceivingSchema>;
