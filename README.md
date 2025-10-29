# SmartRoom - Room Control System

A comprehensive full-stack room control system built with Next.js 15.4.6, TypeScript, TailwindCSS v4, Prisma, and Supabase.

## Features

- **Admin Panel**: Manage rooms, products, and users
- **Worker Interface**: Assign clients to rooms and manage product availability
- **Client Portal**: View available products and make purchases
- **Authentication**: Secure authentication with Supabase Auth
- **Role-Based Access Control**: Different interfaces for Admin, Worker, and Client roles
- **Smooth Animations**: GSAP-powered animations and page transitions
- **Modern UI**: TailwindCSS v4 with dark mode support
- **Type-Safe**: Full TypeScript implementation with Zod validation

## Tech Stack

- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **Animations**: GSAP + @gsap/react
- **Transitions**: next-view-transitions
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Supabase account
- PostgreSQL database (via Supabase)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/DanielMartinezSebastian/SmartRoom.git
   cd SmartRoom
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

Edit `.env` and add your Supabase credentials:
\`\`\`env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

4. Set up the database:
   \`\`\`bash
   pnpm prisma:migrate
   pnpm prisma:generate
   \`\`\`

5. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
SmartRoom/
├── app/ # Next.js App Router
│ ├── api/ # API routes
│ │ ├── users/ # User CRUD endpoints
│ │ ├── rooms/ # Room CRUD endpoints
│ │ ├── products/ # Product CRUD endpoints
│ │ └── purchases/ # Purchase endpoints
│ ├── dashboard/ # Admin/Worker dashboard
│ ├── client/ # Client interface
│ ├── login/ # Login page
│ ├── signup/ # Signup page
│ ├── layout.tsx # Root layout with ViewTransitions
│ └── page.tsx # Landing page
├── components/ # Reusable components
│ ├── Navbar.tsx # Navigation component
│ ├── AnimatedCard.tsx # GSAP-animated card
│ └── ProductCard.tsx # Product display card
├── lib/ # Utilities and configurations
│ ├── prisma.ts # Prisma client
│ ├── supabase/ # Supabase clients
│ ├── validations/ # Zod schemas
│ └── utils.ts # Helper functions
├── prisma/
│ └── schema.prisma # Database schema
├── middleware.ts # Auth middleware
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json # TypeScript configuration
└── package.json # Dependencies
\`\`\`

## Database Schema

### Models

- **User**: Stores user information with roles (ADMIN, WORKER, CLIENT)
- **Room**: Represents physical rooms
- **Product**: Product catalog
- **RoomProduct**: Junction table linking rooms and products with availability
- **Purchase**: Purchase records

## API Endpoints

### Users

- `GET /api/users` - List all users (filter by role)
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Rooms

- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/[id]` - Get room details
- `PATCH /api/rooms/[id]` - Update room
- `DELETE /api/rooms/[id]` - Delete room

### Products

- `GET /api/products` - List all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get product details
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Purchases

- `GET /api/purchases` - List all purchases
- `POST /api/purchases` - Create a purchase (authenticated)

## User Roles

### Admin

- Full access to all features
- Manage rooms, products, and users
- View all purchases and analytics

### Worker

- Assign clients to rooms
- Manage product availability and inventory
- View room and product information

### Client

- View assigned room and available products
- Make purchases
- View purchase history

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Author

Daniel Martinez Sebastian

## Support

For issues and questions, please open an issue on GitHub.
