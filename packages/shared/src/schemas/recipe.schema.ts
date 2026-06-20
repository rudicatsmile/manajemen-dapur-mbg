import { z } from 'zod';

export const recipeItemSchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitId: z.number().int().positive(),
});

export type RecipeItemInput = z.infer<typeof recipeItemSchema>;

export const createRecipeSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.number().int().positive(),
  description: z.string().optional(),
  yieldQuantity: z.number().positive(),
  yieldUnit: z.string().default('porsi'),
  sellingPrice: z.number().min(0).default(0),
  imageUrl: z.string().optional(),
  items: z.array(recipeItemSchema).min(1),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export const updateRecipeSchema = createRecipeSchema.partial();

export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
