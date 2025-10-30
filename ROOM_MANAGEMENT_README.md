# Room Management - Visual User Assignment System

## Overview
The Room Management feature provides an intuitive drag & drop interface for managing user assignments to rooms. Built with @dnd-kit, it offers a Kanban-style layout where administrators and workers can easily reorganize users across rooms.

## Access
- **Route**: `/dashboard/room-management`
- **Permissions**: ADMIN and WORKER roles only
- Accessible from the navigation bar when logged in as ADMIN or WORKER

## Features

### Drag & Drop Interface
- Drag users between rooms and the unassigned column
- Visual feedback during drag operations
- Smooth animations and transitions
- Keyboard navigation support (accessible)

### Room Columns
- Each room displays as a column with:
  - Room name and description
  - Capacity badge (color-coded: green=available, yellow=nearly full, red=full)
  - List of assigned users
  - Visual drop zone indicator

### User Cards
- Display user information:
  - Avatar (photo or initials)
  - Full name
  - Role badge (ADMIN/WORKER/CLIENT)
  - Email address
  - Join date
- Draggable with visual hover states

### Search & Filters
- **Search**: Find users by name or email in real-time
- **Role Filter**: Filter by ALL, ADMIN, WORKER, or CLIENT
- **Room Filter**: Show all rooms, only available rooms, or only full rooms

### Validations
- ✅ Prevents dropping users in rooms at full capacity
- ✅ Shows error message when capacity would be exceeded
- ✅ Validates user permissions (ADMIN/WORKER only)
- ✅ Rollback on API errors with user notification

### Unassigned Users
- Special column for users without room assignments
- Users can be dragged here to unassign them from rooms
- Shows count of unassigned users

## User Experience

### For Administrators
1. Navigate to "Room Management" from the navbar
2. See all rooms and users at a glance
3. Drag users to assign/reassign them to rooms
4. Use filters to focus on specific user types or room statuses
5. Get instant feedback on capacity and successful operations

### Visual Indicators
- **Green badge**: Room has available capacity
- **Yellow badge**: Room is 80%+ full
- **Red badge**: Room is at full capacity
- **Blue highlight**: Valid drop zone (room has space)
- **Red highlight**: Invalid drop zone (room is full)
- **Gray highlight**: Unassigned users drop zone

## Technical Details

### Dependencies
- `@dnd-kit/core`: Core drag and drop functionality
- `@dnd-kit/sortable`: Sortable list functionality
- `@dnd-kit/utilities`: CSS transform utilities

### API Endpoints
- `GET /api/room-management`: Fetch all rooms with users and unassigned users
- `PATCH /api/users/[id]/room`: Update user's room assignment

### Components Structure
```
app/dashboard/room-management/
  └── page.tsx                           # Server component (data fetching)

components/RoomManagement/
  ├── RoomManagementClient.tsx           # Main drag & drop container
  ├── RoomColumn.tsx                     # Individual room column
  ├── UnassignedUsers.tsx               # Unassigned users column
  ├── UserCard.tsx                       # Draggable user card
  ├── RoomCapacityBadge.tsx             # Capacity indicator
  └── UserSearchBar.tsx                  # Search and filters

lib/validations/
  └── roomAssignment.ts                  # Validation schema
```

### State Management
- Server-side rendering for initial data load
- Client-side state with React hooks (useState, useMemo, useCallback)
- Optimistic UI updates
- Error handling with rollback and toast notifications

### Accessibility
- Keyboard navigation support via @dnd-kit
- Screen reader friendly
- Semantic HTML structure
- ARIA labels and roles

### Responsive Design
- Desktop: Horizontal scrolling columns
- Tablet: Optimized column widths
- Mobile: Touch-friendly drag & drop
- Dark mode compatible

## Usage Examples

### Assigning a User to a Room
1. Find the user in the Unassigned Users column or another room
2. Click and hold on the user card
3. Drag to the target room column
4. Release to drop
5. System validates capacity and updates the assignment

### Unassigning a User
1. Find the user in their current room column
2. Drag the user to the Unassigned Users column
3. Release to drop
4. User is removed from the room

### Finding Specific Users
1. Use the search bar to filter by name or email
2. Or use the Role filter to show only specific roles
3. Or use the Room filter to focus on available or full rooms
4. Filters combine for precise results

## Error Handling
- Capacity exceeded: Shows error toast, prevents assignment
- API failure: Shows error toast, reverts state change
- Network issues: Graceful degradation with user notification
- Invalid permissions: Redirects to dashboard

## Performance Considerations
- Initial data fetched server-side for fast first paint
- Client-side filtering for instant search results
- Optimized re-renders with useMemo and useCallback
- Efficient drag & drop with @dnd-kit's collision detection

## Future Enhancements
- Bulk user operations (multi-select)
- Room sorting and filtering
- User activity history
- Export room assignments
- Room capacity analytics
- Undo/redo functionality
