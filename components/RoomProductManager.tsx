'use client';

import { useState } from 'react';
import AnimatedCard from '@/components/AnimatedCard';
import { formatCurrency } from '@/lib/utils';
import { showSuccess, showError, showDestructiveConfirm } from '@/lib/toast';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
};

type RoomProduct = {
  id: string;
  roomId: string;
  productId: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK';
  stock: number;
  Product: Product;
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  RoomProduct: RoomProduct[];
};

interface RoomProductManagerProps {
  room: Room;
  allProducts: Product[];
}

export default function RoomProductManager({ room, allProducts }: RoomProductManagerProps) {
  const [roomProducts, setRoomProducts] = useState<RoomProduct[]>(room.RoomProduct);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RoomProduct | null>(null);

  // Form state for adding product
  const [selectedProductId, setSelectedProductId] = useState('');
  const [addStock, setAddStock] = useState(10);

  // Form state for editing
  const [editStock, setEditStock] = useState(0);
  const [editStatus, setEditStatus] = useState<'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK'>(
    'AVAILABLE'
  );

  // Filter out products already assigned
  const availableProducts = allProducts.filter(
    (p) => !roomProducts.some((rp) => rp.productId === p.id)
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/room-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          productId: selectedProductId,
          stock: addStock,
          status: 'AVAILABLE',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add product');
      }

      const newRoomProduct = await response.json();

      // Fetch the product details and add to list
      const productResponse = await fetch(`/api/products/${selectedProductId}`);
      const product = await productResponse.json();

      setRoomProducts([...roomProducts, { ...newRoomProduct, Product: product }]);
      setShowAddModal(false);
      setSelectedProductId('');
      setAddStock(10);
      showSuccess('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      showError(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (rp: RoomProduct) => {
    setEditingProduct(rp);
    setEditStock(rp.stock);
    setEditStatus(rp.status);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/room-products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock: editStock,
          status: editStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      const updated = await response.json();

      setRoomProducts(
        roomProducts.map((rp) =>
          rp.id === editingProduct.id
            ? { ...rp, stock: updated.stock, status: updated.status }
            : rp
        )
      );

      setEditingProduct(null);
      showSuccess('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      showError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (rpId: string, productName: string) => {
    const confirmed = await showDestructiveConfirm(
      `Remove "${productName}" from this room? This action cannot be undone.`
    );
    
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/room-products/${rpId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove product');
      }

      setRoomProducts(roomProducts.filter((rp) => rp.id !== rpId));
      showSuccess('Product removed successfully!');
    } catch (error) {
      console.error('Error removing product:', error);
      showError(error instanceof Error ? error.message : 'Failed to remove product');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'UNAVAILABLE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Product Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          disabled={availableProducts.length === 0 || loading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add Product to Room
        </button>
      </div>

      {/* Products Grid */}
      {roomProducts.length === 0 ? (
        <AnimatedCard className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
          <span className="mb-4 text-6xl">📦</span>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            No Products Assigned
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add products to this room to make them available for clients
          </p>
        </AnimatedCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roomProducts.map((rp, index) => (
            <AnimatedCard
              key={rp.id}
              delay={index * 0.1}
              className="rounded-lg bg-white shadow-lg dark:bg-gray-800"
            >
              <div className="flex flex-col">
                {rp.Product.imageUrl ? (
                  <img
                    src={rp.Product.imageUrl}
                    alt={rp.Product.name}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-gray-200 dark:bg-gray-700">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {rp.Product.name}
                      </h3>
                      {rp.Product.category && (
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {rp.Product.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {rp.Product.description && (
                    <p
                      className="text-sm text-gray-600 dark:text-gray-400"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      } as React.CSSProperties}
                    >
                      {rp.Product.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(rp.Product.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {rp.stock}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(rp.status)}`}>
                        {rp.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => openEditModal(rp)}
                      disabled={loading}
                      className="flex-1 rounded-lg border-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(rp.id, rp.Product.name)}
                      disabled={loading}
                      className="flex-1 rounded-lg border-2 border-red-600 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Add Product to Room
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Product *
                </label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Choose a product...</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Initial Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={addStock}
                  onChange={(e) => setAddStock(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Edit Product: {editingProduct.Product.name}
            </h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editStock}
                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status *
                </label>
                <select
                  required
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as 'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK')
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
