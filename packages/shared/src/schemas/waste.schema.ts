import { z } from 'zod';
import { WASTE_CATEGORY } from '../constants/status';

const wasteCategoryValues = Object.values(WASTE_CATEGORY) as [string, ...string[]];

export const createWasteSchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitId: z.number().int().positive(),
  category: z.enum(wasteCategoryValues),
  wasteDate: z.string().date(),
  notes: z.string().optional(),
});

export type CreateWasteInput = z.infer<typeof createWasteSchema>;
