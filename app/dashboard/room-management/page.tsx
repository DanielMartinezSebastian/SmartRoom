import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RoomManagementClient from '@/components/RoomManagement/RoomManagementClient';

export default async function RoomManagementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'WORKER')) {
    redirect('/dashboard');
  }

  // Get all rooms with their users
  const rooms = await prisma.room.findMany({
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Get users without room assignment
  const unassignedUsers = await prisma.user.findMany({
    where: { roomId: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Room Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage user assignments to rooms with drag & drop
        </p>
      </div>

      <RoomManagementClient initialRooms={rooms} initialUnassignedUsers={unassignedUsers} />
    </div>
  );
}
