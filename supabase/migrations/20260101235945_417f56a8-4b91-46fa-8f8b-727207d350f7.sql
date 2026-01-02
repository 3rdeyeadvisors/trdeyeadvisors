-- Drop the overly permissive policy that exposes all profile fields to authenticated users
DROP POLICY IF EXISTS "Authenticated users can view public profile info" ON public.profiles;

-- Create a view for public profile data (minimal fields only)
-- This exposes only display_name and avatar_url, not bio or other sensitive fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  display_name,
  avatar_url
FROM public.profiles;

-- Grant access to the view for community features (comments, discussions, etc.)
GRANT SELECT ON public.public_profiles TO authenticated;

-- Note: The remaining policies already handle:
-- - "Users can view their own profile" (full access to own profile)
-- - "Admins can view all profiles" (admin full access)