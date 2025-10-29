import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import AnimatedCard from '@/components/AnimatedCard';

export default async function ClientPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: session.user.id },
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
      Purchase: {
        include: {
          Product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!user || user.role !== 'CLIENT') {
    redirect('/dashboard');
  }

  if (!user.Room) {
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

  const availableProducts = user.Room.RoomProduct.map((rp: any) => rp.Product);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user.name || 'Guest'}!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Your room: <span className="font-semibold">{user.Room.name}</span>
        </p>
        {user.Room.description && (
          <p className="mt-1 text-gray-600 dark:text-gray-400">{user.Room.description}</p>
        )}
      </div>

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
        <>
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
        </>
      )}

      {user.Purchase.length > 0 && (
        <AnimatedCard delay={0.5}>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Recent Purchases
            </h2>
            <div className="space-y-3">
              {user.Purchase.map((purchase: any) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {purchase.Product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {purchase.quantity} • Status: {purchase.status}
                    </p>
                  </div>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    €{purchase.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}
