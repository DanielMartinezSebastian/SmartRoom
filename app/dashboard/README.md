# Admin Dashboard Pages

This directory contains the administration pages for the SmartRoom application. These pages are protected and only accessible to users with the `ADMIN` role.

## Pages

### 1. Room Management (`/dashboard/rooms`)
Manage all rooms in the system with full CRUD operations.

**Features:**
- List all rooms with search and filters (active/inactive)
- Create new rooms with name, description, capacity
- Edit existing room details and status
- Delete rooms (with confirmation)
- View room statistics (users, products)
- Animated cards with GSAP
- Fully responsive design

**Components:**
- Server Component: `app/dashboard/rooms/page.tsx`
- Client Component: `components/RoomList.tsx`

### 2. Product Management (`/dashboard/products`)
Manage all products in the catalog with full CRUD operations.

**Features:**
- List all products with search and filters (category, active/inactive)
- Create new products with name, description, price, image, category
- Edit existing product details
- Delete products (with confirmation)
- Image preview support
- View product assignments to rooms
- Animated cards with GSAP
- Fully responsive design

**Components:**
- Server Component: `app/dashboard/products/page.tsx`
- Client Component: `components/ProductList.tsx`

### 3. User Management (`/dashboard/users`)
Manage all users in the system with role and room assignments.

**Features:**
- List all users with search and filters (role, room)
- Change user roles (ADMIN, WORKER, CLIENT)
- Assign/unassign users to rooms
- Delete users (with confirmation)
- View user purchase history
- Role badges with color coding
- Desktop table view + mobile card view
- Fully responsive design

**Components:**
- Server Component: `app/dashboard/users/page.tsx`
- Client Component: `components/UserList.tsx`

## Access Control

All admin pages are protected by:
1. **Authentication**: Users must be logged in via Supabase Auth
2. **Authorization**: Only users with `role === 'ADMIN'` can access these pages
3. **Automatic Redirect**: Non-admin users are redirected to `/dashboard`

## API Integration

The pages use the following API endpoints:

### Rooms
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create a new room
- `PATCH /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `PATCH /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Users
- `GET /api/users` - List all users
- `PATCH /api/users/:id` - Update a user (role, room assignment)
- `DELETE /api/users/:id` - Delete a user

## Validation

All forms use Zod validation schemas from `/lib/validations/`:
- `roomSchema` - Validates room data
- `productSchema` - Validates product data
- `updateUserSchema` - Validates user updates

## Styling

- **Framework**: TailwindCSS v4
- **Dark Mode**: Fully supported with `dark:` classes
- **Animations**: GSAP via `AnimatedCard` component
- **Responsive**: Mobile-first design with breakpoints

## Usage

1. Log in as an admin user
2. Navigate to the dashboard
3. Click on the appropriate quick action:
   - "Manage Rooms"
   - "Manage Products"
   - "Manage Users"
4. Use the search and filter controls to find specific items
5. Click "Create" buttons to add new items
6. Use "Edit" or "Delete" buttons on individual items

## Development

To add new features or modify existing ones:

1. **Server Components** (`app/dashboard/*/page.tsx`):
   - Fetch initial data with Prisma
   - Check authentication and authorization
   - Pass data to client components

2. **Client Components** (`components/*List.tsx`):
   - Handle user interactions
   - Manage local state (search, filters, modal visibility)
   - Call API endpoints for mutations
   - Refresh data after changes

## Notes

- All delete operations require user confirmation
- Forms include loading states during API calls
- Error messages are displayed via browser alerts (consider upgrading to toast notifications)
- Images are loaded via URL (no file upload implemented yet)
