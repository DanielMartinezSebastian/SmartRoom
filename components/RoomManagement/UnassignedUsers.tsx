'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import UserCard from './UserCard';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl: string | null;
  createdAt: Date | string;
};

type UnassignedUsersProps = {
  users: User[];
};

export default function UnassignedUsers({ users }: UnassignedUsersProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
  });

  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unassigned Users
          </h3>
          <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {users.length}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Users without a room assignment
        </p>
      </div>

      {/* Users List */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto p-4 transition-colors ${
          isOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''
        }`}
        style={{ minHeight: '200px', maxHeight: '600px' }}
      >
        <SortableContext items={users.map((u) => u.id)} strategy={verticalListSortingStrategy}>
          {users.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All users are assigned
              </p>
            </div>
          ) : (
            users.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}
