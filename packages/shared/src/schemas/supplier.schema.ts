import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  phone: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Invalid Indonesian phone number')
    .optional()
    .or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  contactPerson: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

export const updateSupplierSchema = createSupplierSchema.partial();

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
