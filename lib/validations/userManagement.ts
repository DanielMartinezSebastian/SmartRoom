import { z } from 'zod';

/**
 * Schema for updating user information (for ADMIN/WORKER)
 */
export const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'WORKER', 'CLIENT']).optional(),
  roomId: z.string().nullable().optional(),
  name: z.string().min(1, 'Name is required').optional(),
});

/**
 * Schema for user role changes
 */
export const userRoleSchema = z.object({
  role: z.enum(['ADMIN', 'WORKER', 'CLIENT']),
});

/**
 * Schema for room assignment
 */
export const roomAssignmentSchema = z.object({
  roomId: z.string().nullable(),
});

/**
 * Type exports
 */
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserRoleInput = z.infer<typeof userRoleSchema>;
export type RoomAssignmentInput = z.infer<typeof roomAssignmentSchema>;
