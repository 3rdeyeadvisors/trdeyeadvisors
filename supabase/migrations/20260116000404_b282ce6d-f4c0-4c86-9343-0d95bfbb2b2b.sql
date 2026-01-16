-- =====================================================
-- Security Fixes for RLS Policies and Function
-- =====================================================

-- 1. Fix founding33_purchases overly permissive INSERT policy
-- This policy was incorrectly allowing any authenticated user to insert
-- The edge functions use service role which bypasses RLS anyway
DROP POLICY IF EXISTS "Service role can insert founding33 purchases" ON public.founding33_purchases;

-- 2. Fix founding33_purchases overly permissive UPDATE policy
-- Replace with a proper user-scoped policy for users updating their own pending purchases
DROP POLICY IF EXISTS "Service role can update founding33 purchases" ON public.founding33_purchases;

CREATE POLICY "Users can update their own pending purchases"
ON public.founding33_purchases FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() 
  AND status = 'pending'
)
WITH CHECK (
  user_id = auth.uid() 
  AND status = 'pending'
);

-- 3. Fix user_points overly permissive INSERT policy
-- Points are inserted via SECURITY DEFINER function award_user_points()
-- which bypasses RLS, so this policy was redundant and dangerous
DROP POLICY IF EXISTS "Service role can insert points" ON public.user_points;

-- 4. Fix get_founding33_spots_remaining function search path
-- Add SET search_path = public for security
CREATE OR REPLACE FUNCTION public.get_founding33_spots_remaining()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  legacy_founders INTEGER := 13;  -- Pre-existing founding members before automated system
  new_purchases INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO new_purchases
  FROM public.founding33_purchases
  WHERE status = 'completed';
  
  RETURN GREATEST(0, 33 - legacy_founders - new_purchases);
END;
$function$;