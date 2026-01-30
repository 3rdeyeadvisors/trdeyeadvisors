
-- Drop the existing profiles_public view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.profiles_public;

-- Create a secure public view for profiles that excludes sensitive payout information
-- Using default SECURITY INVOKER (not DEFINER) so RLS policies apply
CREATE VIEW public.profiles_public 
WITH (security_invoker = on)
AS
SELECT 
  user_id,
  display_name,
  avatar_url,
  bio,
  is_bot,
  created_at
FROM public.profiles;

-- Grant SELECT on the view to authenticated users for community features
GRANT SELECT ON public.profiles_public TO authenticated;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.profiles_public IS 'Public-safe view of profiles that excludes payout_method, payout_details, and payout_crypto_network. Uses SECURITY INVOKER to respect RLS policies.';
