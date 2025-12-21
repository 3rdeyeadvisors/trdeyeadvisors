-- Fix profiles table RLS - restrict to own profile + admins
-- The get_profiles_batch function is SECURITY DEFINER so it will still work for comments/discussions

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Add policy for users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (user_id = auth.uid());

-- Add policy for admins to view all profiles  
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));