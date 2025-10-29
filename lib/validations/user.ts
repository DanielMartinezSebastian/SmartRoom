import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['ADMIN', 'WORKER', 'CLIENT']).default('CLIENT'),
  supabaseId: z.string().uuid('Invalid Supabase ID'),
  roomId: z.string().uuid().optional().nullable(),
});

export const updateUserSchema = userSchema.partial();

export type UserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
