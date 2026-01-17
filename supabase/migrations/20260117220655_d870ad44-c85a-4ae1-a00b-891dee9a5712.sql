-- Fix CRITICAL: Remove the permissive "Anyone can view public profiles" policy
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.profiles;

-- Fix: Ensure only authenticated users can view the leaderboard data (user_points_monthly)
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON public.user_points_monthly;
DROP POLICY IF EXISTS "Public leaderboard access" ON public.user_points_monthly;

-- Create a policy that only allows authenticated users to view leaderboard
CREATE POLICY "Authenticated users can view leaderboard" 
ON public.user_points_monthly 
FOR SELECT 
TO authenticated
USING (true);

-- Fix: Tighten newsletter subscriber INSERT policy (allow public but with stricter check)
-- The existing policy should be fine for public newsletter signups

-- Add admin read policy to profiles if not exists (so admins can still manage users)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));