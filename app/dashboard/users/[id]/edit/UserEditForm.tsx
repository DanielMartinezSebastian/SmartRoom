'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AnimatedCard from '@/components/AnimatedCard';
import UserRoleSelector from '@/components/UserManagement/UserRoleSelector';
import UserRoomAssignment from '@/components/UserManagement/UserRoomAssignment';
import UserStats from '@/components/UserManagement/UserStats';
import { formatDate } from '@/lib/utils';
import { showError, showSuccess, showConfirm, showDestructiveConfirm, showLoading, updateToSuccess, updateToError } from '@/lib/toast';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  supabaseId: string;
  roomId: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  Room: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  Purchase: Array<{
    id: string;
    totalPrice: number;
    createdAt: Date;
    Product: {
      name: string;
      category: string | null;
    };
  }>;
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  _count: {
    User: number;
  };
};

interface UserEditFormProps {
  user: User;
  rooms: Room[];
  currentUserId: string;
}

export default function UserEditForm({ user, rooms, currentUserId }: UserEditFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<'ADMIN' | 'WORKER' | 'CLIENT'>(user.role);
  const [roomId, setRoomId] = useState<string | null>(user.roomId);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if there are unsaved changes
  const checkChanges = (newRole: typeof role, newRoomId: typeof roomId, newAvatarUrl: typeof avatarUrl) => {
    setHasChanges(newRole !== user.role || newRoomId !== user.roomId || newAvatarUrl !== user.avatarUrl);
  };

  const handleRoleChange = (newRole: 'ADMIN' | 'WORKER' | 'CLIENT') => {
    setRole(newRole);
    checkChanges(newRole, roomId, avatarUrl);
  };

  const handleRoomChange = (newRoomId: string | null) => {
    setRoomId(newRoomId);
    checkChanges(role, newRoomId, avatarUrl);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('File too large. Maximum size is 2MB.');
      return;
    }

    const toastId = showLoading('Uploading avatar...');
    setUploading(true);

    try {
      const supabase = createClient();

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('userAvatar')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('userAvatar')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      checkChanges(role, roomId, publicUrl);
      updateToSuccess(toastId, 'Avatar uploaded! Click Save to apply changes.');
    } catch (err: any) {
      updateToError(toastId, err.message || 'Failed to upload avatar');
      console.error('Avatar upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const confirmed = await showDestructiveConfirm('Are you sure you want to remove this avatar?');
    if (!confirmed) return;

    setAvatarUrl(null);
    checkChanges(role, roomId, null);
    showSuccess('Avatar removed! Click Save to apply changes.');
  };

  const handleSave = async () => {
    if (!hasChanges) {
      showError('No changes to save');
      return;
    }

    const toastId = showLoading('Saving changes...');
    setSaving(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          roomId: roomId || null,
          avatarUrl: avatarUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      updateToSuccess(toastId, 'User updated successfully!');
      setHasChanges(false);
      
      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error('Error updating user:', error);
      updateToError(toastId, error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // Prevent deleting yourself
    if (user.id === currentUserId) {
      showError('You cannot delete your own account from here. Use the profile page instead.');
      return;
    }

    const confirmed = await showDestructiveConfirm(
      `Are you sure you want to delete user "${user.name || user.email}"? This action cannot be undone and will delete all associated data.`
    );

    if (!confirmed) return;

    const toastId = showLoading('Deleting user...');

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      updateToSuccess(toastId, 'User deleted successfully!');
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      updateToError(toastId, error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleCancel = async () => {
    if (hasChanges) {
      const confirmed = await showConfirm(
        'You have unsaved changes. Are you sure you want to leave?',
        'Leave',
        'Stay'
      );
      if (confirmed) {
        router.push('/dashboard/users');
      }
    } else {
      router.push('/dashboard/users');
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <AnimatedCard className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user.name || 'No name set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created
                  </label>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Updated
                  </label>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Role Management */}
          <AnimatedCard className="rounded-lg bg-white p-6 shadow dark:bg-gray-800" delay={0.1}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Role Management
            </h2>
            <UserRoleSelector currentRole={role} onChange={handleRoleChange} disabled={saving} />
          </AnimatedCard>

          {/* Room Assignment */}
          <AnimatedCard className="rounded-lg bg-white p-6 shadow dark:bg-gray-800" delay={0.2}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Room Assignment
            </h2>
            <UserRoomAssignment
              rooms={rooms}
              currentRoomId={roomId}
              onChange={handleRoomChange}
              disabled={saving}
            />
          </AnimatedCard>

          {/* Danger Zone */}
          <AnimatedCard
            className="rounded-lg border-2 border-red-200 bg-red-50 p-6 shadow dark:border-red-800 dark:bg-red-900/20"
            delay={0.3}
          >
            <h2 className="mb-4 text-xl font-semibold text-red-900 dark:text-red-200">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-red-300 bg-white p-4 dark:border-red-700 dark:bg-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">Delete User</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete this user and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={saving || user.id === currentUserId}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete User
                </button>
                {user.id === currentUserId && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    You cannot delete your own account from here
                  </p>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Right Column - Avatar & Stats */}
        <div className="space-y-6">
          {/* Avatar Upload */}
          <AnimatedCard className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Profile Picture
            </h2>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar Preview */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name || user.email}
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-gray-200 dark:ring-gray-700">
                  <span className="text-4xl font-bold text-white">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Upload Controls */}
              <div className="flex flex-col items-center space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading || saving}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || saving}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload New Photo'}
                </button>
                
                {avatarUrl && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploading || saving}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove Photo
                  </button>
                )}
                
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG or WebP. Max 2MB.
                  <br />
                  Changes require clicking Save.
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* User Statistics */}
          <AnimatedCard className="rounded-lg bg-white p-6 shadow dark:bg-gray-800" delay={0.1}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Statistics
            </h2>
            <UserStats purchases={user.Purchase} createdAt={user.createdAt} />
          </AnimatedCard>
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            {hasChanges && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
