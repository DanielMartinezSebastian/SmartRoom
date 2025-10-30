import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    redirect('/login');
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar userRole={user.role} avatarUrl={user.avatarUrl} userName={user.name} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <ProfileClient user={user} />
      </div>
    </div>
  );
}
