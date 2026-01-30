
-- Create a secure public view for profiles that excludes sensitive payout information
-- This view should be used for community features (comments, discussions, etc.)
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT 
  user_id,
  display_name,
  avatar_url,
  bio,
  is_bot,
  created_at
FROM public.profiles;

-- Grant SELECT on the view to authenticated and anon roles
GRANT SELECT ON public.profiles_public TO authenticated;
GRANT SELECT ON public.profiles_public TO anon;

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.profiles_public IS 'Public-safe view of profiles that excludes payout_method, payout_details, and payout_crypto_network for security';
