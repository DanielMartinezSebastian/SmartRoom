'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validations/user';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState<ChangePasswordInput>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const validated = changePasswordSchema.parse(formData);
      const supabase = createClient();

      // Verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: validated.currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: validated.newPassword,
      });

      if (updateError) throw updateError;

      setSuccess('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Change Password
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
