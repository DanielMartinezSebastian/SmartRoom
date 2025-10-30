'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DeleteAccountModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ userId, isOpen, onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Delete user from database
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out from Supabase
      const supabase = createClient();
      await supabase.auth.signOut();

      // Redirect to login
      router.push('/login');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Delete Account
        </h3>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="confirmText"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Type <strong>DELETE</strong> to confirm
          </label>
          <input
            id="confirmText"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="DELETE"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== 'DELETE'}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
