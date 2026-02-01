-- Drop and recreate the roadmap_vote_counts view with SECURITY DEFINER wrapper
-- This allows the view to aggregate votes without RLS restrictions

-- First create a SECURITY DEFINER function to get vote counts
CREATE OR REPLACE FUNCTION public.get_roadmap_vote_counts()
RETURNS TABLE (
  roadmap_item_id uuid,
  yes_votes integer,
  no_votes integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    roadmap_item_id,
    COALESCE(SUM(CASE WHEN vote_type = 'yes' THEN vote_weight ELSE 0 END), 0)::integer AS yes_votes,
    COALESCE(SUM(CASE WHEN vote_type = 'no' THEN vote_weight ELSE 0 END), 0)::integer AS no_votes
  FROM roadmap_votes
  GROUP BY roadmap_item_id;
$$;

-- Now recreate the view using this function
DROP VIEW IF EXISTS public.roadmap_vote_counts;

CREATE VIEW public.roadmap_vote_counts AS
SELECT * FROM public.get_roadmap_vote_counts();