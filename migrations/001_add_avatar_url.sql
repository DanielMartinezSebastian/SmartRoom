-- Migration: Add avatar_url to User table
-- Execute this SQL in Supabase SQL Editor

-- Add avatarUrl column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- Note: Create storage bucket for avatars in Supabase Dashboard
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket named "userAvatar"
-- 3. Set it as public
-- 4. Configure policies for upload/download (see SETUP_AUTH_PROFILE.md)
-- 5. Set max file size to 2MB
-- 6. Allow MIME types: image/jpeg, image/png, image/webp
