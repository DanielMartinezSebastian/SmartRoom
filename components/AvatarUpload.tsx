'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { showDestructiveConfirm } from '@/lib/toast';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  userRole: 'ADMIN' | 'WORKER' | 'CLIENT';
  onSuccess: () => void;
}

export default function AvatarUpload({ userId, currentAvatarUrl, userRole, onSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUpload = userRole === 'ADMIN' || userRole === 'WORKER';

  // Update preview when currentAvatarUrl changes
  useEffect(() => {
    setPreview(currentAvatarUrl);
  }, [currentAvatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 2MB.');
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('userAvatar')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('userAvatar')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      // Update user profile with new avatar URL
      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: publicUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update avatar');
      }

      const updatedUser = await response.json();
      console.log('Avatar updated successfully:', updatedUser);

      // Update preview with the URL from the database
      setPreview(updatedUser.avatarUrl);
      
      // Force refresh the page data
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
      console.error('Avatar upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    const confirmed = await showDestructiveConfirm('Are you sure you want to remove your avatar?');
    
    if (!confirmed) return;

    setUploading(true);
    setError('');

    try {
      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove avatar');
      }

      setPreview(null);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  if (!canUpload) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-4">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="text-2xl text-gray-500 dark:text-gray-400">
                {userId.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only administrators and workers can change profile pictures.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Profile Picture
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <span className="text-2xl text-gray-500 dark:text-gray-400">
              {userId.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
          {preview && (
            <button
              onClick={handleRemoveAvatar}
              disabled={uploading}
              className="ml-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or WebP. Max size 2MB.
          </p>
        </div>
      </div>
    </div>
  );
}
