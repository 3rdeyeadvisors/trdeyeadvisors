-- Fix Issue #2: User Privacy / Vote Tracking
-- Remove public vote visibility and create aggregate counts view

-- Remove the overly permissive public policy that exposes user voting patterns
DROP POLICY IF EXISTS "Anyone can view votes" ON public.roadmap_votes;

-- Remove the authenticated users policy (too permissive - shows all user IDs)
DROP POLICY IF EXISTS "Authenticated users can view votes" ON public.roadmap_votes;

-- Create new restrictive policy: Users can only see their own votes for UI highlighting
CREATE POLICY "Users can view own votes for UI"
ON public.roadmap_votes FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all votes for management
CREATE POLICY "Admins can view all votes"
ON public.roadmap_votes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a secure view for aggregate vote counts (no user_id exposed)
CREATE OR REPLACE VIEW public.roadmap_vote_counts
WITH (security_invoker = on)
AS SELECT 
    roadmap_item_id,
    COALESCE(SUM(CASE WHEN vote_type = 'yes' THEN vote_weight ELSE 0 END), 0)::integer as yes_votes,
    COALESCE(SUM(CASE WHEN vote_type = 'no' THEN vote_weight ELSE 0 END), 0)::integer as no_votes
FROM roadmap_votes
GROUP BY roadmap_item_id;

-- Allow anyone to see vote counts (but NOT individual votes/user_ids)
GRANT SELECT ON public.roadmap_vote_counts TO anon;
GRANT SELECT ON public.roadmap_vote_counts TO authenticated;