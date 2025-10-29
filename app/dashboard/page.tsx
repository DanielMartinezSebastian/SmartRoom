import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AnimatedCard from '@/components/AnimatedCard';

export default async function DashboardPage() {
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
      Room: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Redirect based on role
  if (user.role === 'CLIENT') {
    redirect('/client');
  }

  const stats = await getStats(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Role: <span className="font-semibold">{user.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <AnimatedCard
            key={stat.label}
            delay={index * 0.1}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <AnimatedCard delay={0.4} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.role === 'ADMIN' && (
            <>
              <QuickAction href="/dashboard/rooms" label="Manage Rooms" icon="🏠" />
              <QuickAction href="/dashboard/products" label="Manage Products" icon="📦" />
              <QuickAction href="/dashboard/users" label="Manage Users" icon="👥" />
            </>
          )}
          {user.role === 'WORKER' && (
            <>
              <QuickAction href="/dashboard/assign" label="Assign Clients" icon="👤" />
              <QuickAction href="/dashboard/inventory" label="Manage Inventory" icon="📊" />
            </>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
}

function QuickAction({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-gray-700"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
    </a>
  );
}

async function getStats(role: string) {
  if (role === 'ADMIN') {
    const [roomsCount, productsCount, usersCount, purchasesCount] = await Promise.all([
      prisma.room.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.purchase.count(),
    ]);

    return [
      { label: 'Total Rooms', value: roomsCount, icon: '🏠' },
      { label: 'Total Products', value: productsCount, icon: '📦' },
      { label: 'Total Users', value: usersCount, icon: '👥' },
      { label: 'Total Purchases', value: purchasesCount, icon: '🛒' },
    ];
  }

  if (role === 'WORKER') {
    const [roomsCount, clientsCount, productsCount] = await Promise.all([
      prisma.room.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.product.count({ where: { isActive: true } }),
    ]);

    return [
      { label: 'Active Rooms', value: roomsCount, icon: '🏠' },
      { label: 'Clients', value: clientsCount, icon: '👥' },
      { label: 'Available Products', value: productsCount, icon: '📦' },
    ];
  }

  return [];
}
