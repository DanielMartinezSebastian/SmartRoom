'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import AvatarUpload from '@/components/AvatarUpload';
import DeleteAccountModal from '@/components/DeleteAccountModal';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl: string | null;
}

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <AvatarUpload
        userId={user.id}
        currentAvatarUrl={user.avatarUrl}
        userRole={user.role}
        onSuccess={handleSuccess}
      />

      {/* Personal Information */}
      <ProfileForm user={user} onSuccess={handleSuccess} />

      {/* Change Password */}
      <ChangePasswordForm />

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-300 bg-white p-6 shadow dark:border-red-800 dark:bg-gray-800">
        <h3 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        userId={user.id}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
