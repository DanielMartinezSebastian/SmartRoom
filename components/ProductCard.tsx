'use client';

import { useState } from 'react';
import AnimatedCard from '@/components/AnimatedCard';
import { formatCurrency } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to make purchase');
      }

      showSuccess('Purchase successful!');
      setQuantity(1);
    } catch (error: any) {
      showError(error.message || 'Failed to make purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedCard delay={index * 0.1} className="h-full">
      <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="mb-4 h-48 w-full rounded-lg object-cover"
          />
        )}
        {!product.imageUrl && (
          <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
            <span className="text-6xl">📦</span>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
            {product.category && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {product.category}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
          )}

          <p className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 rounded-lg border border-gray-300 px-3 py-1 text-center dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Buy for ${formatCurrency(product.price * quantity)}`}
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
}
