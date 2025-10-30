import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
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

      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading room management...</p>
          </div>
        </div>
      }>
        <RoomManagementClient initialRooms={rooms} initialUnassignedUsers={unassignedUsers} />
      </Suspense>
    </div>
  );
}
