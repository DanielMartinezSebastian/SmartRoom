# Authentication and Profile Management Setup

This document provides instructions for setting up the new authentication and profile management features.

## Database Migration

Run the following SQL migration in your Supabase SQL Editor:

```sql
-- Add avatarUrl column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- Add imageUrl column to Room table if it doesn't exist
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
```

Alternatively, you can run:
```bash
npm run prisma:migrate
```

## Supabase Storage Setup

### Create Avatars Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **New Bucket**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Yes (checked)
   - **File size limit**: 2MB
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

### Configure Storage Policies

Add these policies to allow authenticated users to upload and read avatars:

```sql
-- Policy for uploading avatars (only ADMIN and WORKER)
CREATE POLICY "Allow authenticated uploads for ADMIN/WORKER"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Policy for reading avatars (public)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy for deleting avatars (only ADMIN and WORKER)
CREATE POLICY "Allow authenticated delete for ADMIN/WORKER"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = 'avatars'
);
```

## Email Configuration for Password Reset

Make sure your Supabase project has email configured:

1. Go to **Authentication** → **Email Templates** in Supabase Dashboard
2. Customize the **Reset Password** email template if needed
3. Configure your SMTP settings in **Settings** → **Authentication** → **SMTP Settings**

The reset password link will redirect users to: `{YOUR_SITE_URL}/reset-password`

## Features Implemented

### Authentication
- ✅ Forgot Password Flow (`/forgot-password`)
- ✅ Reset Password Page (`/reset-password`)
- ✅ Password change from profile

### User Profile (`/dashboard/profile`)
- ✅ View and edit personal information (name, email)
- ✅ Change password
- ✅ Upload/remove profile picture (ADMIN/WORKER only)
- ✅ Delete account with confirmation

### Security
- ✅ Role-based permissions for avatar upload
- ✅ Password validation (minimum 8 characters)
- ✅ Email validation
- ✅ Image upload validation (type, size)
- ✅ Confirmation required for account deletion

## API Endpoints

### Authentication
- `POST /api/auth/forgot-password` - Request password reset (handled by Supabase)
- `POST /api/auth/reset-password` - Reset password (handled by Supabase)

### User Profile
- `PATCH /api/users/[id]` - Update user profile
- `POST /api/users/[id]/avatar` - Upload/update avatar (ADMIN/WORKER only)
- `DELETE /api/users/[id]` - Delete user account

## Usage

### As a User
1. Navigate to profile by clicking your avatar/name in the navbar
2. Update your personal information, change password, or manage your avatar
3. To delete your account, scroll to the "Danger Zone" section

### As Admin/Worker
- You have additional permissions to upload and manage profile pictures for any user
- Avatar upload is restricted to ADMIN and WORKER roles only

### Password Reset Flow
1. User clicks "Forgot password?" on login page
2. User enters their email address
3. User receives reset link via email
4. User clicks the link and is redirected to `/reset-password`
5. User enters and confirms new password
6. User is redirected to login page

## Validation Rules

### Password
- Minimum 8 characters
- Must match confirmation password

### Email
- Valid email format required
- Email changes require verification

### Avatar Upload
- Only ADMIN and WORKER roles can upload
- Accepted formats: JPG, PNG, WebP
- Maximum size: 2MB
- Images stored in Supabase Storage

## Testing Checklist

- [ ] Test forgot password flow
- [ ] Test password reset with valid token
- [ ] Test password reset with expired/invalid token
- [ ] Test profile information update
- [ ] Test password change from profile
- [ ] Test avatar upload (as ADMIN/WORKER)
- [ ] Test avatar upload restriction (as CLIENT)
- [ ] Test avatar removal
- [ ] Test account deletion
- [ ] Verify avatar displays in navbar
- [ ] Verify all validation rules work correctly
