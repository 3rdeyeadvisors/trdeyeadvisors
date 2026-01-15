-- Add policy to allow authenticated users to view any public profile
-- This enables viewing other users' profiles from leaderboard, comments, etc.
CREATE POLICY "Anyone can view public profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);