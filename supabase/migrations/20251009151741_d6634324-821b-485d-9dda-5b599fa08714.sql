-- Fix the RLS policy to allow the trigger to insert profiles
-- The issue is that during signup, the trigger runs but RLS blocks it

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a new policy that allows both user inserts and system inserts (from triggers)
CREATE POLICY "Users and system can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (
  -- Allow if user is inserting their own profile
  (auth.uid() = user_id)
  OR
  -- Allow if this is a security definer function (trigger context)
  (current_setting('role', true) = 'postgres')
);