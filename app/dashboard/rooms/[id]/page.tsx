import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';
import { formatDate } from '@/lib/utils';

export default async function RoomDetailPage({
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

  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'WORKER')) {
    redirect('/dashboard');
  }

  const { id } = await params;

  // Fetch comprehensive room data
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      User: {
        include: {
          Purchase: {
            include: {
              Product: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      },
      RoomProduct: {
        include: {
          Product: true,
        },
        orderBy: { Product: { name: 'asc' } },
      },
    },
  });

  if (!room) {
    redirect('/dashboard/rooms');
  }

  // Calculate statistics
  const totalUsers = room.User.length;
  const activeUsers = room.User.filter((u) => u.role === 'CLIENT').length;
  const totalProducts = room.RoomProduct.length;
  const availableProducts = room.RoomProduct.filter((rp) => rp.status === 'AVAILABLE').length;
  const totalPurchases = room.User.reduce((sum, u) => sum + u.Purchase.length, 0);
  const recentPurchases = room.User.flatMap((u) => 
    u.Purchase.map((p) => ({ ...p, userName: u.name, userEmail: u.email }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const totalRevenue = room.User.reduce(
    (sum, u) => sum + u.Purchase.reduce((s, p) => s + p.totalPrice, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/rooms"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Rooms
          </Link>
        </div>
        {dbUser.role === 'ADMIN' && (
          <Link
            href={`/dashboard/rooms/${id}/manage`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Manage Products
          </Link>
        )}
      </div>

      {/* Room Hero */}
      <AnimatedCard className="overflow-hidden">
        {room.imageUrl && (
          <div className="relative h-48 w-full">
            <img
              src={room.imageUrl}
              alt={room.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{room.name}</h1>
              {room.description && <p className="mt-1 text-white/90">{room.description}</p>}
            </div>
          </div>
        )}
        {!room.imageUrl && (
          <div className="bg-white p-6 dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{room.name}</h1>
            {room.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">{room.description}</p>
            )}
          </div>
        )}
      </AnimatedCard>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard delay={0.1} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </p>
              <p className="mt-1 text-xs text-gray-500">{activeUsers} active clients</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {totalProducts}
              </p>
              <p className="mt-1 text-xs text-gray-500">{availableProducts} available</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Purchases</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {totalPurchases}
              </p>
              <p className="mt-1 text-xs text-gray-500">All time</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                €{totalRevenue.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Total sales</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Users in Room */}
        <AnimatedCard delay={0.5} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Users in Room ({totalUsers})
          </h2>
          {room.User.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No users assigned</p>
          ) : (
            <div className="space-y-3">
              {room.User.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name || 'No name'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : user.role === 'WORKER'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {user.role}
                    </span>
                    <span className="text-sm text-gray-500">
                      {user.Purchase.length} purchases
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedCard>

        {/* Products in Room */}
        <AnimatedCard delay={0.6} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Products ({totalProducts})
          </h2>
          {room.RoomProduct.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No products assigned</p>
          ) : (
            <div className="space-y-3">
              {room.RoomProduct.map((rp) => (
                <div
                  key={rp.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {rp.Product.imageUrl && (
                      <img
                        src={rp.Product.imageUrl}
                        alt={rp.Product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {rp.Product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        €{rp.Product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        rp.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : rp.status === 'UNAVAILABLE'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {rp.status}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">Stock: {rp.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatedCard>
      </div>

      {/* Recent Purchases */}
      <AnimatedCard delay={0.7} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Recent Purchases
        </h2>
        {recentPurchases.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No purchases yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                    User
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                    Product
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                    Quantity
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="py-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {purchase.userName || 'No name'}
                        </p>
                        <p className="text-xs text-gray-500">{purchase.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {purchase.Product.name}
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                      {purchase.quantity}
                    </td>
                    <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                      €{purchase.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          purchase.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : purchase.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-500">
                      {formatDate(purchase.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedCard>
    </div>
  );
}
