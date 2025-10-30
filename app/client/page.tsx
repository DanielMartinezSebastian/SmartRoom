import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import AnimatedCard from '@/components/AnimatedCard';

export default async function ClientPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      Room: {
        include: {
          RoomProduct: {
            where: {
              status: 'AVAILABLE',
            },
            include: {
              Product: true,
            },
          },
        },
      },
    },
  });

  if (!dbUser) {
    redirect('/login');
  }

  if (!dbUser.Room) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <AnimatedCard className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
          <span className="mb-4 text-6xl">🏠</span>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            No Room Assigned
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You haven&apos;t been assigned to a room yet. Please contact an administrator or worker.
          </p>
        </AnimatedCard>
      </div>
    );
  }

  const availableProducts = dbUser.Room.RoomProduct.map((rp: any) => rp.Product);
  const room = dbUser.Room as typeof dbUser.Room & { imageUrl?: string | null };

  return (
    <div className="space-y-8">
      {/* Room Header with Image */}
      {room.imageUrl && (
        <AnimatedCard className="overflow-hidden rounded-lg shadow-lg">
          <div className="relative h-64 w-full md:h-80">
            <img
              src={room.imageUrl}
              alt={room.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold md:text-4xl">{room.name}</h1>
              {room.description && (
                <p className="mt-2 text-lg text-white/90">{room.description}</p>
              )}
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Welcome Section (shown if no image) */}
      {!room.imageUrl && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {dbUser.name || 'Guest'}!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Your room: <span className="font-semibold">{room.name}</span>
          </p>
          {room.description && (
            <p className="mt-1 text-gray-600 dark:text-gray-400">{room.description}</p>
          )}
        </div>
      )}

      {availableProducts.length === 0 ? (
        <AnimatedCard className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
          <span className="mb-4 text-6xl">📦</span>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            No Products Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no products available in your room at the moment.
          </p>
        </AnimatedCard>
      ) : (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Available Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableProducts.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
