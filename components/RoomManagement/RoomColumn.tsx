'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import UserCard from './UserCard';
import RoomCapacityBadge from './RoomCapacityBadge';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl: string | null;
  createdAt: Date | string;
};

type RoomColumnProps = {
  room: {
    id: string;
    name: string;
    description: string | null;
    capacity: number;
    imageUrl: string | null;
  };
  users: User[];
};

export default function RoomColumn({ room, users }: RoomColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: room.id,
  });

  const isFull = users.length >= room.capacity;

  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      {/* Room Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{room.name}</h3>
            {room.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{room.description}</p>
            )}
          </div>
          <RoomCapacityBadge current={users.length} capacity={room.capacity} />
        </div>
      </div>

      {/* Users List */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto p-4 transition-colors ${
          isOver && !isFull
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : isOver && isFull
              ? 'bg-red-50 dark:bg-red-900/20'
              : ''
        }`}
        style={{ minHeight: '200px', maxHeight: '600px' }}
      >
        {isFull && isOver && (
          <div className="mb-2 rounded-md bg-red-50 p-3 dark:bg-red-900/30">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Room is at full capacity
            </p>
          </div>
        )}
        
        <SortableContext items={users.map((u) => u.id)} strategy={verticalListSortingStrategy}>
          {users.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">No users assigned</p>
            </div>
          ) : (
            users.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}
