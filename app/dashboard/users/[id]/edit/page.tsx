import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import UserEditForm from './UserEditForm';

export default async function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  // Get current user from database
  const currentUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!currentUser) {
    redirect('/login');
  }

  // Check if user has permission (ADMIN or WORKER)
  if (currentUser.role !== 'ADMIN' && currentUser.role !== 'WORKER') {
    redirect('/dashboard');
  }

  // Get the user to edit
  const userToEdit = await prisma.user.findUnique({
    where: { id },
    include: {
      Room: true,
      Purchase: {
        include: {
          Product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!userToEdit) {
    notFound();
  }

  // Get all rooms with user count
  const rooms = await prisma.room.findMany({
    include: {
      _count: {
        select: { User: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-600 dark:text-gray-400">
        <Link
          href="/dashboard"
          className="transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Dashboard
        </Link>
        <span className="mx-2">&gt;</span>
        <Link
          href="/dashboard/users"
          className="transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Users
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {userToEdit.name || userToEdit.email}
        </span>
        <span className="mx-2">&gt;</span>
        <span className="font-medium text-gray-900 dark:text-white">Edit</span>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit User</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage user information, role, and room assignment
        </p>
      </div>

      {/* User Edit Form */}
      <UserEditForm user={userToEdit} rooms={rooms} currentUserId={currentUser.id} />
    </div>
  );
}
