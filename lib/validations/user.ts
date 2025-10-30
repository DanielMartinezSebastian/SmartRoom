import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['ADMIN', 'WORKER', 'CLIENT']).default('CLIENT'),
  supabaseId: z.string().uuid('Invalid Supabase ID'),
  roomId: z.string().uuid().optional().nullable(),
  avatarUrl: z.string().url('Invalid URL').optional().nullable(),
});

export const updateUserSchema = userSchema.partial();

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type UserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
