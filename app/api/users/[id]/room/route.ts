import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { roomAssignmentSchema } from '@/lib/validations/roomAssignment';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'WORKER')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = roomAssignmentSchema.parse({ userId: id, ...body });

    // If assigning to a room, check capacity
    if (validated.roomId) {
      const room = await prisma.room.findUnique({
        where: { id: validated.roomId },
        include: {
          User: true,
        },
      });

      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      // Check if room is at capacity (excluding the user being moved)
      const currentUsersInRoom = room.User.filter(u => u.id !== id).length;
      
      if (currentUsersInRoom >= room.capacity) {
        return NextResponse.json(
          { error: 'Room is at full capacity' },
          { status: 400 }
        );
      }
    }

    // Update user's room assignment
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roomId: validated.roomId },
      include: {
        Room: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
