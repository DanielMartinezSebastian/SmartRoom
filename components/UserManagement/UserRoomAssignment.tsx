'use client';

interface Room {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  _count?: {
    User: number;
  };
}

interface UserRoomAssignmentProps {
  rooms: Room[];
  currentRoomId: string | null;
  onChange: (roomId: string | null) => void;
  disabled?: boolean;
}

export default function UserRoomAssignment({
  rooms,
  currentRoomId,
  onChange,
  disabled,
}: UserRoomAssignmentProps) {
  const currentRoom = rooms.find((r) => r.id === currentRoomId);

  return (
    <div className="space-y-4">
      {/* Current Room Display */}
      {currentRoom && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{currentRoom.name}</h4>
              {currentRoom.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {currentRoom.description}
                </p>
              )}
              {currentRoom._count && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Occupancy: {currentRoom._count.User} / {currentRoom.capacity}
                </p>
              )}
            </div>
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              Current
            </span>
          </div>
        </div>
      )}

      {/* Room Selector */}
      <div>
        <label
          htmlFor="roomSelect"
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Assign to Room
        </label>
        <select
          id="roomSelect"
          value={currentRoomId || ''}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">No Room Assigned</option>
          {rooms.map((room) => {
            const occupancy = room._count ? room._count.User : 0;
            const isFull = occupancy >= room.capacity;
            return (
              <option key={room.id} value={room.id} disabled={isFull && room.id !== currentRoomId}>
                {room.name} ({occupancy}/{room.capacity}){isFull ? ' - FULL' : ''}
              </option>
            );
          })}
        </select>
      </div>

      {/* Available Rooms List */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Available Rooms
        </h4>
        <div className="space-y-2">
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No rooms available</p>
          ) : (
            rooms.map((room) => {
              const occupancy = room._count ? room._count.User : 0;
              const isFull = occupancy >= room.capacity;
              const percentage = (occupancy / room.capacity) * 100;

              return (
                <div
                  key={room.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{room.name}</span>
                      {isFull && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                          FULL
                        </span>
                      )}
                      {room.id === currentRoomId && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          ASSIGNED
                        </span>
                      )}
                    </div>
                    {room.description && (
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {room.description}
                      </p>
                    )}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>
                          {occupancy} / {room.capacity} occupied
                        </span>
                        <span>{Math.round(percentage)}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-full transition-all ${
                            isFull
                              ? 'bg-red-500'
                              : percentage > 80
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
