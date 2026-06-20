import { z } from 'zod';

export const createProductionSchema = z.object({
  recipeId: z.number().int().positive(),
  productionDate: z.string().date(),
  plannedQty: z.number().positive(),
  notes: z.string().optional(),
  forceCreate: z.boolean().default(false),
});

export type CreateProductionInput = z.infer<typeof createProductionSchema>;
