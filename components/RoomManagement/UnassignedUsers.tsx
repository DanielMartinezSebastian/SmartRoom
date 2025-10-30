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
    <div className="flex w-full flex-1 flex-col rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 md:max-w-[calc(33.333%-0.67rem)]">
      {/* Header */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-700 sm:p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
            Unassigned Users
          </h3>
          <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300 sm:px-2.5">
            {users.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          Users without a room assignment
        </p>
      </div>

      {/* Users List */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto p-3 transition-colors sm:p-4 ${
          isOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''
        }`}
        style={{ minHeight: '180px', maxHeight: '500px' }}
      >
        <SortableContext items={users.map((u) => u.id)} strategy={verticalListSortingStrategy}>
          {users.length === 0 ? (
            <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 sm:h-32">
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
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
