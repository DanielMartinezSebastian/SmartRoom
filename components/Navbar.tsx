'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  userRole?: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl?: string | null;
  userName?: string | null;
  roomName?: string | null;
}

export default function Navbar({ userRole, avatarUrl, userName, roomName }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center text-xl font-bold text-blue-600">
              SmartRoom
            </Link>
            
            {/* Desktop Navigation */}
            <div className="ml-10 hidden space-x-8 md:flex">
              {(userRole === 'ADMIN' || userRole === 'WORKER') && (
                <Link
                  href="/dashboard/room-management"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  Room Management
                </Link>
              )}
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
                  {roomName || 'My Room'}
                </Link>
              )}
            </div>
          </div>
          
          {/* Desktop Profile & Logout */}
          <div className="hidden items-center space-x-4 md:flex">
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

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {(userRole === 'ADMIN' || userRole === 'WORKER') && (
              <Link
                href="/dashboard/room-management"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Room Management
              </Link>
            )}
            {userRole === 'ADMIN' && (
              <>
                <Link
                  href="/dashboard/rooms"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rooms
                </Link>
                <Link
                  href="/dashboard/products"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/dashboard/users"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Users
                </Link>
              </>
            )}
            {userRole === 'WORKER' && (
              <>
                <Link
                  href="/dashboard/assign"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Assign Clients
                </Link>
                <Link
                  href="/dashboard/inventory"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inventory
                </Link>
              </>
            )}
            {userRole === 'CLIENT' && (
              <Link
                href="/client"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {roomName || 'My Room'}
              </Link>
            )}
          </div>
          
          {/* Mobile Profile & Logout */}
          <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-sm font-semibold">
                    {userName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {userName || 'User'}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  View profile
                </div>
              </div>
            </Link>
            <div className="mt-3 px-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full rounded-lg bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
