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
    <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 md:max-w-[calc(33.333%-0.67rem)]">
      {/* Background Image with Fade Effect */}
      {room.imageUrl && (
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-45"
          style={{
            backgroundImage: `url(${room.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Content with relative positioning to appear above background */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Room Header */}
        <div className="border-b border-gray-200 bg-white/60 p-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 sm:p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">{room.name}</h3>
              {room.description && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{room.description}</p>
              )}
            </div>
            <RoomCapacityBadge current={users.length} capacity={room.capacity} />
          </div>
        </div>

        {/* Users List */}
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-2 overflow-y-auto p-3 transition-colors sm:p-4 ${
            isOver && !isFull
              ? 'bg-blue-50/80 dark:bg-blue-900/30'
              : isOver && isFull
                ? 'bg-red-50/80 dark:bg-red-900/30'
                : 'bg-white/40 dark:bg-gray-800/60'
          }`}
          style={{ minHeight: '180px', maxHeight: '500px' }}
        >
          {isFull && isOver && (
            <div className="mb-2 rounded-md bg-red-50 p-2 dark:bg-red-900/30 sm:p-3">
              <p className="text-xs font-medium text-red-800 dark:text-red-300 sm:text-sm">
                Room is at full capacity
              </p>
            </div>
          )}
          
          <SortableContext items={users.map((u) => u.id)} strategy={verticalListSortingStrategy}>
            {users.length === 0 ? (
              <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 sm:h-32">
                <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">No users assigned</p>
              </div>
            ) : (
              users.map((user) => <UserCard key={user.id} user={user} />)
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
