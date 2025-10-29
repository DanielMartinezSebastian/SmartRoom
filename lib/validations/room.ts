import { z } from 'zod';

export const roomSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  isActive: z.boolean().default(true),
});

export const updateRoomSchema = roomSchema.partial();

export type RoomInput = z.infer<typeof roomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
