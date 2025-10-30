-- Storage Policies for userAvatar bucket
-- Execute this SQL in Supabase SQL Editor after creating the 'userAvatar' bucket

-- IMPORTANT: Make sure the bucket 'userAvatar' is set as PUBLIC in Supabase Dashboard

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to userAvatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to userAvatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from userAvatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update in userAvatar" ON storage.objects;

-- Policy for uploading avatars (authenticated users)
CREATE POLICY "Allow authenticated uploads to userAvatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'userAvatar');

-- Policy for reading avatars (public access)
CREATE POLICY "Allow public read access to userAvatar"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'userAvatar');

-- Policy for deleting avatars (authenticated users)
CREATE POLICY "Allow authenticated delete from userAvatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'userAvatar');

-- Policy for updating avatars (authenticated users)
CREATE POLICY "Allow authenticated update in userAvatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'userAvatar')
WITH CHECK (bucket_id = 'userAvatar');

-- Note: Role-based restrictions (ADMIN/WORKER only) are enforced 
-- at the application level through the API endpoint /api/users/[id]/avatar
