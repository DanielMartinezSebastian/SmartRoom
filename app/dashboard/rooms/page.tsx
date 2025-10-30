import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RoomList from '@/components/RoomList';

export default async function RoomsPage() {
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

  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const rooms = await prisma.room.findMany({
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      RoomProduct: {
        include: {
          Product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage rooms, capacity, and assignments
        </p>
      </div>
      <RoomList initialRooms={rooms} />
    </div>
  );
}
