-- Fix 1: Recreate public_profiles view with SECURITY INVOKER (default, safer)
-- This ensures the view uses the querying user's permissions, not the creator's

DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  user_id,
  display_name,
  avatar_url
FROM public.profiles;

-- Grant SELECT access to authenticated and anon users (intentionally public for community features)
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

COMMENT ON VIEW public.public_profiles IS 'Public view of user profiles for community features. Uses SECURITY INVOKER for proper permission checking.';