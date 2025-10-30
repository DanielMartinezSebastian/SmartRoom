'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';
import { formatDate } from '@/lib/utils';
import { showSuccess, showError, showDestructiveConfirm } from '@/lib/toast';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  supabaseId: string;
  roomId: string | null;
  createdAt: Date;
  updatedAt: Date;
  Room: {
    id: string;
    name: string;
  } | null;
  Purchase?: Array<{
    id: string;
    totalPrice: number;
    Product: {
      name: string;
    };
  }>;
};

interface UserListProps {
  initialUsers: User[];
}

export default function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'ADMIN' | 'WORKER' | 'CLIENT'>('all');
  const [filterRoom, setFilterRoom] = useState('all');
  const [loading, setLoading] = useState(false);

  // Extract unique rooms from users
  const availableRooms = Array.from(
    new Map(
      users
        .filter((u) => u.Room)
        .map((u) => [u.Room!.id, u.Room!])
    ).values()
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesRoom =
      filterRoom === 'all' ||
      (filterRoom === 'none' && !user.roomId) ||
      user.roomId === filterRoom;
    return matchesSearch && matchesRole && matchesRoom;
  });

  const handleDelete = async (userId: string, userEmail: string) => {
    const confirmed = await showDestructiveConfirm(
      `Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`
    );
    
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      setUsers(users.filter((u) => u.id !== userId));
      showSuccess('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'WORKER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CLIENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(e.target.value as 'all' | 'ADMIN' | 'WORKER' | 'CLIENT')
            }
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="WORKER">Worker</option>
            <option value="CLIENT">Client</option>
          </select>
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Rooms</option>
            <option value="none">No Room</option>
            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <AnimatedCard className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
          <span className="mb-4 text-6xl">👥</span>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No Users Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterRole !== 'all' || filterRoom !== 'all'
              ? 'Try adjusting your filters'
              : 'No users in the system'}
          </p>
        </AnimatedCard>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <AnimatedCard className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Purchases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {user.Room ? user.Room.name : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {user.Purchase?.length || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <Link
                            href={`/dashboard/users/${user.id}/edit`}
                            className="mr-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id, user.email)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedCard>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {filteredUsers.map((user, index) => (
              <AnimatedCard
                key={user.id}
                delay={index * 0.05}
                className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name || 'No name'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Room:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.Room ? user.Room.name : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Purchases:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.Purchase?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="flex-1 rounded-lg border-2 border-blue-600 px-3 py-2 text-center text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      disabled={loading}
                      className="flex-1 rounded-lg border-2 border-red-600 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
