-- Update avatars bucket to accept 10MB files
UPDATE storage.buckets 
SET file_size_limit = 10485760 
WHERE id = 'avatars';