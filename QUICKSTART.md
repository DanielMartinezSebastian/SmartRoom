# 🚀 Quick Start Guide - SmartRoom

## Prerequisites Checklist
- ✅ Node.js 20+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Git installed
- ⬜ Supabase account (create at https://supabase.com)

---

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create a Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `smartroom`
   - Database password: (save this!)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 1.2 Get Your Credentials
1. In your project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project API Key (anon public)** (starts with `eyJ...`)
   
3. Go to **Settings** → **Database**
4. Copy the **Connection String** → **URI**
   - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

---

## Step 2: Configure Environment Variables (2 minutes)

1. Open the `.env` file in the project root
2. Replace the placeholder values:

\`\`\`env
# Replace [YOUR-PASSWORD] and [YOUR-PROJECT-REF] with your actual values
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"

# Replace [YOUR-PROJECT-REF] with your project reference
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"

# Replace with your anon key from Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Optional: Service role key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Leave as is for local development
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

**Example:**
\`\`\`env
DATABASE_URL="postgresql://postgres:MyP@ssw0rd123@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
\`\`\`

---

## Step 3: Set Up Database (2 minutes)

Run these commands in your terminal:

\`\`\`bash
# Navigate to project directory
cd /home/dras/Documentos/PROGRAMACION/SmartRoom

# Generate Prisma Client
pnpm prisma:generate

# Create database tables (run migration)
pnpm prisma:migrate

# When prompted, name your migration: "init" or "initial_setup"
\`\`\`

---

## Step 4: Start Development Server (30 seconds)

\`\`\`bash
pnpm dev
\`\`\`

Wait for:
\`\`\`
  ▲ Next.js 15.4.6
  - Local:        http://localhost:3000
\`\`\`

---

## Step 5: Test the Application (5 minutes)

### 5.1 Open the App
Open your browser and go to: http://localhost:3000

### 5.2 Create Your First User
1. Click **"Sign Up"**
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: (min 6 characters)
3. Click **"Sign Up"**

🎉 You're in! You'll be redirected to the client portal.

### 5.3 Explore the Interface
- **Client View**: http://localhost:3000/client
- **Dashboard**: http://localhost:3000/dashboard (for admin/worker)

---

## Step 6: Create Admin User (Optional)

To access admin features, you need to manually set a user as ADMIN:

### Option 1: Using Prisma Studio (Recommended)
\`\`\`bash
pnpm prisma:studio
\`\`\`

1. Opens at http://localhost:5555
2. Click on **User** table
3. Find your user
4. Change `role` from `CLIENT` to `ADMIN`
5. Save changes
6. Refresh your browser

### Option 2: Using Supabase Dashboard
1. Go to Supabase Dashboard → Table Editor
2. Select **User** table
3. Find your user
4. Edit the `role` column to `ADMIN`
5. Save

Now you can access:
- http://localhost:3000/dashboard/rooms
- http://localhost:3000/dashboard/products
- http://localhost:3000/dashboard/users

---

## 🎯 What You Can Do Now

### As CLIENT:
- View assigned room (once assigned by admin/worker)
- Browse available products
- Make purchases
- View purchase history

### As WORKER:
- Assign clients to rooms
- Manage product availability
- Update inventory

### As ADMIN:
- **Create Rooms**: Add new rooms with capacity
- **Add Products**: Create product catalog
- **Manage Users**: Assign roles and rooms
- **View Statistics**: Monitor purchases and usage

---

## 📋 Common Commands

\`\`\`bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm format

# Lint code
pnpm lint

# Open Prisma Studio (database GUI)
pnpm prisma:studio

# Reset database (WARNING: deletes all data!)
pnpm exec prisma migrate reset
\`\`\`

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors
**Solution:** Run `pnpm install` again

### Issue: Prisma Client errors
**Solution:** Run `pnpm prisma:generate`

### Issue: Database connection failed
**Solution:** Check your `.env` file:
- Ensure DATABASE_URL is correct
- Check your Supabase password
- Verify project reference is correct

### Issue: Can't login after signup
**Solution:** Check Supabase Auth settings:
1. Go to Supabase Dashboard → Authentication → Settings
2. Disable email confirmation (for development)
3. Try signing up again

### Issue: "next-view-transitions" peer dependency warning
**Solution:** This is expected (React 19 with package expecting React 18). Safe to ignore.

---

## 🎨 Creating Your First Room & Product

### 1. Create a Room
1. Login as ADMIN
2. Go to Dashboard → Rooms → Create New
3. Fill in:
   - Name: "Room 101"
   - Description: "Main conference room"
   - Capacity: 10
4. Save

### 2. Create a Product
1. Go to Dashboard → Products → Create New
2. Fill in:
   - Name: "Coffee"
   - Description: "Premium espresso"
   - Price: 2.50
   - Category: "Beverages"
3. Save

### 3. Assign Product to Room
1. Edit the Room
2. Add products from the list
3. Set stock and availability

### 4. Assign Client to Room
1. Go to Dashboard → Users
2. Find a CLIENT user
3. Edit and assign to Room 101
4. Save

Now the client can see and purchase products!

---

## 🚀 Next Steps

1. **Customize the UI**: Edit components in `/components`
2. **Add More Features**: Create new pages in `/app`
3. **Modify Database**: Update `/prisma/schema.prisma`
4. **Add Animations**: Use GSAP in components
5. **Deploy**: Deploy to Vercel (automatic with Next.js)

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **GSAP Docs**: https://gsap.com/docs
- **Zod Docs**: https://zod.dev

---

## 🎉 You're Ready!

Your SmartRoom application is fully set up and ready to use!

If you encounter any issues, check:
1. Console errors in browser DevTools (F12)
2. Terminal output for server errors
3. `.env` file configuration
4. Supabase project status

Happy coding! 🚀
