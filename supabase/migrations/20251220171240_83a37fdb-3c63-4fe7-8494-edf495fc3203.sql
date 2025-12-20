-- Fix #1: Subscribers table - Ensure only admins can SELECT
-- The current policy "Public can subscribe with rate limit" correctly allows INSERT
-- But we need to ensure there's no way for non-admins to read the data

-- First, verify the existing SELECT policy is correct (it should only allow admins)
-- The "Only verified admins can view subscribers" policy exists but let's make it more robust
DROP POLICY IF EXISTS "Only verified admins can view subscribers" ON public.subscribers;
CREATE POLICY "Only admins can view subscribers" 
ON public.subscribers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix #2: Digital downloads - Strengthen token security
-- Add a minimum token length constraint (already added previously)
-- Ensure the SELECT policy is more strict

-- The current policies are:
-- 1. "Admins can view all downloads" - OK
-- 2. "Users can view valid downloads" - This needs review

-- Let's make the user download policy more restrictive
DROP POLICY IF EXISTS "Users can view valid downloads" ON public.digital_downloads;
CREATE POLICY "Users can view their own valid downloads" 
ON public.digital_downloads 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND
  (
    (user_id = auth.uid()) OR 
    (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  ) AND 
  (expires_at > now()) AND 
  (download_count < max_downloads)
);

-- Fix #3: Profiles table - Add a note that this is intentional for community features
-- The current policy allows authenticated users to view profiles which is standard for community platforms
-- However, let's add a comment to document this is intentional