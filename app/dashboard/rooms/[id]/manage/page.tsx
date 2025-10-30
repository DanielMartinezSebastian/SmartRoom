import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import RoomProductManager from '@/components/RoomProductManager';

export default async function RoomManageProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
        <Link
          href={`/dashboard/rooms/${id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Room Details
        </Link>
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
