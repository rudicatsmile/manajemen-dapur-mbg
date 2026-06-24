import { z } from 'zod';

export const supplierLoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type SupplierLoginInput = z.infer<typeof supplierLoginSchema>;

export const createSupplierUserSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export type CreateSupplierUserInput = z.infer<typeof createSupplierUserSchema>;

export const updateSupplierUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email('Format email tidak valid').optional(),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
  isActive: z.boolean().optional(),
});

export type UpdateSupplierUserInput = z.infer<typeof updateSupplierUserSchema>;

export const supplierChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type SupplierChangePasswordInput = z.infer<typeof supplierChangePasswordSchema>;
