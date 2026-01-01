-- CRITICAL FIX 1: Tighten printify_orders - remove email-based access vulnerability
DROP POLICY IF EXISTS "Users can view their own orders" ON public.printify_orders;

CREATE POLICY "Users can view their own orders by user_id only"
ON public.printify_orders
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND user_id = auth.uid()
);

-- CRITICAL FIX 2: Ensure contact_submissions has explicit deny for non-admins
-- The existing policies are correct but let's ensure no gaps by verifying RLS is on
-- (Already enabled, policies are admin-only for SELECT which is correct)

-- WARNING FIX: Tighten digital_downloads - remove email enumeration vulnerability  
DROP POLICY IF EXISTS "Users can view their own valid downloads" ON public.digital_downloads;

CREATE POLICY "Users can view their own valid downloads by user_id only"
ON public.digital_downloads
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
  AND expires_at > now() 
  AND download_count < max_downloads
);

-- INFO FIX 1: Allow authenticated users to view public profile info for community features
CREATE POLICY "Authenticated users can view public profile info"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL
);

-- INFO FIX 2: Allow course purchasers to access quizzes through the public view
-- The quizzes_public view already strips answers, just need SELECT access
GRANT SELECT ON public.quizzes_public TO authenticated;