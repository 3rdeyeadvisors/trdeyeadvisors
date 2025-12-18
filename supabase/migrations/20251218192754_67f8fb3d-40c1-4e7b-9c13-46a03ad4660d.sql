-- Add all existing users to grandfathered_emails with full platform access
-- This ensures existing users who already signed up get grandfathered subscription access

INSERT INTO public.grandfathered_emails (email, claimed_by, claimed_at, access_type)
SELECT 
  u.email,
  u.id as claimed_by,
  NOW() as claimed_at,
  'full_platform' as access_type
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.grandfathered_emails ge 
  WHERE LOWER(ge.email) = LOWER(u.email)
)
ON CONFLICT (email) DO NOTHING;