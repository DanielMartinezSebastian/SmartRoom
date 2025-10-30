'use client';

import { formatCurrency, formatDate } from '@/lib/utils';

interface Purchase {
  id: string;
  totalPrice: number;
  createdAt: Date;
  Product: {
    name: string;
    category: string | null;
  };
}

interface UserStatsProps {
  purchases: Purchase[];
  createdAt: Date;
}

export default function UserStats({ purchases, createdAt }: UserStatsProps) {
  // Calculate statistics
  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalPrice, 0);

  // Get most purchased products
  const productCounts = purchases.reduce(
    (acc, p) => {
      const name = p.Product.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get category distribution
  const categorySpending = purchases.reduce(
    (acc, p) => {
      const category = p.Product.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + p.totalPrice;
      return acc;
    },
    {} as Record<string, number>
  );

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Get recent activity
  const recentPurchases = [...purchases]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</div>
          <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {totalPurchases}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
          <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalSpent)}
          </div>
        </div>
      </div>

      {/* Account Age */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm font-medium text-gray-900 dark:text-white">Account Created</div>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{formatDate(createdAt)}</div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Most Purchased Products
          </h4>
          <div className="space-y-2">
            {topProducts.map(([product, count]) => (
              <div key={product} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">{product}</span>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending by Category */}
      {topCategories.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Spending by Category
          </h4>
          <div className="space-y-2">
            {topCategories.map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 dark:text-white">{category}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentPurchases.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Recent Purchases
          </h4>
          <div className="space-y-3">
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 dark:border-gray-700"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {purchase.Product.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {formatDate(purchase.createdAt)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(purchase.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data */}
      {purchases.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <span className="mb-2 text-4xl">📊</span>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            No Purchase History
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This user hasn&apos;t made any purchases yet.
          </p>
        </div>
      )}
    </div>
  );
}
