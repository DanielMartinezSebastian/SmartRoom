-- Migration: Add avatar_url to User table and imageUrl to Room table
-- Execute this SQL in Supabase SQL Editor

-- Add avatarUrl column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

-- Add imageUrl column to Room table if it doesn't exist
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- Note: Create storage bucket for avatars in Supabase Dashboard
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket named "avatars"
-- 3. Set it as public
-- 4. Configure policies for upload/download
-- 5. Set max file size to 2MB
-- 6. Allow MIME types: image/jpeg, image/png, image/webp
