'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate } from '@/lib/utils';

type UserCardProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: 'ADMIN' | 'WORKER' | 'CLIENT';
    avatarUrl: string | null;
    createdAt: Date | string;
  };
  isDragging?: boolean;
};

export default function UserCard({ user, isDragging = false }: UserCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: user.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'WORKER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'CLIENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-move rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || user.email}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
              {getInitials(user.name, user.email)}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {user.name || 'No name'}
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
            >
              {user.role}
            </span>
          </div>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Joined: {formatDate(user.createdAt)}
          </p>
        </div>

        {/* Drag Handle Indicator */}
        <div className="flex-shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
