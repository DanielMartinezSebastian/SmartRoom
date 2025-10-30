import { z } from 'zod';

export const roomAssignmentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  roomId: z.string().uuid().nullable(),
});

export type RoomAssignmentInput = z.infer<typeof roomAssignmentSchema>;
