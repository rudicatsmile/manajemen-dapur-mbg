import { z } from 'zod';

export const createBranchSchema = z.object({
  code: z
    .string()
    .min(1, 'Kode cabang wajib diisi')
    .max(20)
    .regex(/^[A-Z0-9-]+$/, 'Kode hanya boleh huruf kapital, angka, dan tanda hubung'),
  name: z.string().min(1, 'Nama cabang wajib diisi').max(200),
  address: z.string().max(500).optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor telepon tidak valid')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;

export const updateBranchSchema = createBranchSchema.partial();

export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

export const assignBranchMembersSchema = z.object({
  userIds: z.array(z.number().int().positive()),
});

export type AssignBranchMembersInput = z.infer<typeof assignBranchMembersSchema>;
