'use client';

import { useRouter } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  userRole?: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl?: string | null;
  userName?: string | null;
}

export default function Navbar({ userRole, avatarUrl, userName }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center text-xl font-bold text-blue-600">
              SmartRoom
            </Link>
            <div className="ml-10 flex space-x-8">
              {userRole === 'ADMIN' && (
                <>
                  <Link
                    href="/dashboard/rooms"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    Rooms
                  </Link>
                  <Link
                    href="/dashboard/products"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    Products
                  </Link>
                  <Link
                    href="/dashboard/users"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    Users
                  </Link>
                </>
              )}
              {userRole === 'WORKER' && (
                <>
                  <Link
                    href="/dashboard/assign"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    Assign Clients
                  </Link>
                  <Link
                    href="/dashboard/inventory"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  >
                    Inventory
                  </Link>
                </>
              )}
              {userRole === 'CLIENT' && (
                <Link
                  href="/client"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  My Room
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-sm font-semibold">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
