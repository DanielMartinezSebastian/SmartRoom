import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RoomProductManager from '@/components/RoomProductManager';

export default async function RoomProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: session.user.id },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const { id } = await params;

  // Fetch the room with its current products
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      RoomProduct: {
        include: {
          Product: true,
        },
      },
    },
  });

  if (!room) {
    redirect('/dashboard/rooms');
  }

  // Fetch all products to show available ones
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <a
          href="/dashboard/rooms"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Rooms
        </a>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Products for {room.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Assign products to this room and manage inventory
        </p>
      </div>
      <RoomProductManager room={room} allProducts={allProducts} />
    </div>
  );
}
