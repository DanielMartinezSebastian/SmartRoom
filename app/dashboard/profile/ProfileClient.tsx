'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import AvatarUpload from '@/components/AvatarUpload';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import AnimatedCard from '@/components/AnimatedCard';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl: string | null;
}

interface Purchase {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: Date | string;
  Product: {
    id: string;
    name: string;
    category: string | null;
  };
}

interface ProfileClientProps {
  user: User;
  purchases: Purchase[];
}

export default function ProfileClient({ user, purchases }: ProfileClientProps) {
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

      {/* Recent Purchases - Only for CLIENTs */}
      {user.role === 'CLIENT' && purchases && purchases.length > 0 && (
        <AnimatedCard delay={0.3}>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Recent Purchases
            </h3>
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {purchase.Product.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Quantity: {purchase.quantity}</span>
                      <span>•</span>
                      <span className="capitalize">{purchase.status}</span>
                      <span>•</span>
                      <span>{formatDate(purchase.createdAt)}</span>
                    </div>
                    {purchase.Product.category && (
                      <span className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {purchase.Product.category}
                      </span>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      €{purchase.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>
      )}

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
