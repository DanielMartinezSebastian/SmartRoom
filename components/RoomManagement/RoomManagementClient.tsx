'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import RoomColumn from './RoomColumn';
import UnassignedUsers from './UnassignedUsers';
import UserCard from './UserCard';
import UserSearchBar from './UserSearchBar';
import { showSuccess, showError } from '@/lib/toast';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'WORKER' | 'CLIENT';
  avatarUrl: string | null;
  createdAt: Date | string;
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  User: User[];
};

type RoomManagementClientProps = {
  initialRooms: Room[];
  initialUnassignedUsers: User[];
};

export default function RoomManagementClient({
  initialRooms,
  initialUnassignedUsers,
}: RoomManagementClientProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [unassignedUsers, setUnassignedUsers] = useState<User[]>(initialUnassignedUsers);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'WORKER' | 'CLIENT'>('ALL');
  const [roomFilter, setRoomFilter] = useState<'all' | 'available' | 'full'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter users by search term and role
  const filterUsers = useCallback((users: User[]) => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === '' ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  // Filter rooms by status
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    if (roomFilter === 'available') {
      filtered = filtered.filter((room) => room.User.length < room.capacity);
    } else if (roomFilter === 'full') {
      filtered = filtered.filter((room) => room.User.length >= room.capacity);
    }

    // Apply user filters to each room
    filtered = filtered.map((room) => ({
      ...room,
      User: filterUsers(room.User),
    }));

    return filtered;
  }, [rooms, roomFilter, filterUsers]);

  const filteredUnassignedUsers = useMemo(() => {
    return filterUsers(unassignedUsers);
  }, [unassignedUsers, filterUsers]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const userId = active.id as string;

    // Find the user being dragged
    let user: User | undefined;

    // Check unassigned users
    user = unassignedUsers.find((u) => u.id === userId);

    // Check all rooms
    if (!user) {
      for (const room of rooms) {
        user = room.User.find((u) => u.id === userId);
        if (user) break;
      }
    }

    setActiveUser(user || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveUser(null);

    if (!over) return;

    const userId = active.id as string;
    const targetContainerId = over.id as string;

    // Find the source room
    let sourceRoomId: string | null = null;
    const fromUnassigned = unassignedUsers.some((u) => u.id === userId);

    if (!fromUnassigned) {
      for (const room of rooms) {
        if (room.User.some((u) => u.id === userId)) {
          sourceRoomId = room.id;
          break;
        }
      }
    }

    // Determine the target room
    const targetRoomId = targetContainerId === 'unassigned' ? null : targetContainerId;

    // If dropping in the same container, do nothing
    if (sourceRoomId === targetRoomId) {
      return;
    }

    // Check if target room is at capacity (client-side validation)
    if (targetRoomId) {
      const targetRoom = rooms.find((r) => r.id === targetRoomId);
      if (targetRoom && targetRoom.User.length >= targetRoom.capacity) {
        showError('Room is at full capacity');
        return;
      }
    }

    // Store the previous state for rollback
    const previousRooms = rooms;
    const previousUnassignedUsers = unassignedUsers;

    // OPTIMISTIC UPDATE: Update UI immediately
    setRooms((prevRooms) => {
      const newRooms = prevRooms.map((room) => ({
        ...room,
        User: room.User.filter((u) => u.id !== userId),
      }));

      if (targetRoomId) {
        const targetRoom = newRooms.find((r) => r.id === targetRoomId);
        const user =
          unassignedUsers.find((u) => u.id === userId) ||
          prevRooms.flatMap((r) => r.User).find((u) => u.id === userId);

        if (targetRoom && user) {
          targetRoom.User.push(user);
        }
      }

      return newRooms;
    });

    setUnassignedUsers((prevUnassigned) => {
      const newUnassigned = prevUnassigned.filter((u) => u.id !== userId);

      if (!targetRoomId) {
        const user =
          prevUnassigned.find((u) => u.id === userId) ||
          rooms.flatMap((r) => r.User).find((u) => u.id === userId);

        if (user) {
          newUnassigned.push(user);
        }
      }

      return newUnassigned;
    });

    try {
      // Make API call after optimistic update
      const response = await fetch(`/api/users/${userId}/room`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: targetRoomId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update room assignment');
      }

      // Success: Show success message
      showSuccess(
        targetRoomId
          ? 'User assigned to room successfully'
          : 'User moved to unassigned successfully'
      );
    } catch (error) {
      // Error: Rollback to previous state
      setRooms(previousRooms);
      setUnassignedUsers(previousUnassignedUsers);

      const errorMessage = error instanceof Error ? error.message : 'Failed to update room assignment';
      showError(errorMessage);
      console.error('Error updating room assignment:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <UserSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        roomFilter={roomFilter}
        onRoomFilterChange={setRoomFilter}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Responsive container: column on mobile, wrapped grid on larger screens */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:flex-wrap">
          {/* Unassigned Users Column */}
          <UnassignedUsers users={filteredUnassignedUsers} />

          {/* Room Columns */}
          {filteredRooms.map((room) => (
            <RoomColumn key={room.id} room={room} users={room.User} />
          ))}

          {filteredRooms.length === 0 && roomFilter !== 'all' && (
            <div className="flex w-full items-center justify-center p-8">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                No rooms match the selected filter
              </p>
            </div>
          )}
        </div>

        <DragOverlay>
          {activeUser ? <UserCard user={activeUser} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
