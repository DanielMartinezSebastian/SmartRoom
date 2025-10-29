import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProductList from '@/components/ProductList';

export default async function ProductsPage() {
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

  const products = await prisma.product.findMany({
    include: {
      RoomProduct: {
        include: {
          Room: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage products, pricing, and inventory
        </p>
      </div>
      <ProductList initialProducts={products} />
    </div>
  );
}
