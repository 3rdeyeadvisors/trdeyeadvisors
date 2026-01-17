-- Drop the old permissive policy (it already exists, so we just drop it)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- The view and grants were already created successfully
-- Just need to ensure the RLS is properly configured

-- Users can still see their own full profile (policy already exists)
-- The profiles_public view handles public read access without payout info