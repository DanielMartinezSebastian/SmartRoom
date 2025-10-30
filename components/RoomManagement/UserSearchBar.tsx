'use client';

type UserSearchBarProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: 'ALL' | 'ADMIN' | 'WORKER' | 'CLIENT';
  onRoleFilterChange: (value: 'ALL' | 'ADMIN' | 'WORKER' | 'CLIENT') => void;
  roomFilter: 'all' | 'available' | 'full';
  onRoomFilterChange: (value: 'all' | 'available' | 'full') => void;
};

export default function UserSearchBar({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  roomFilter,
  onRoomFilterChange,
}: UserSearchBarProps) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Search Input */}
      <div>
        <label htmlFor="search" className="sr-only">
          Search users
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Role Filter */}
        <div>
          <label
            htmlFor="role-filter"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Role
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) =>
              onRoleFilterChange(e.target.value as 'ALL' | 'ADMIN' | 'WORKER' | 'CLIENT')
            }
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="WORKER">Worker</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        {/* Room Filter */}
        <div>
          <label
            htmlFor="room-filter"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Room Status
          </label>
          <select
            id="room-filter"
            value={roomFilter}
            onChange={(e) => onRoomFilterChange(e.target.value as 'all' | 'available' | 'full')}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Rooms</option>
            <option value="available">Available</option>
            <option value="full">Full</option>
          </select>
        </div>
      </div>
    </div>
  );
}
