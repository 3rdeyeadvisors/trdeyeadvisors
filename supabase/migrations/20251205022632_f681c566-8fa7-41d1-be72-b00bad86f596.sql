-- Fix ratings table: Restrict public access to user ratings
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.ratings;

-- Users can only view their own ratings
CREATE POLICY "Users can view their own ratings"
ON public.ratings
FOR SELECT
USING (user_id = auth.uid());

-- Admins can view all ratings
CREATE POLICY "Admins can view all ratings"
ON public.ratings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));