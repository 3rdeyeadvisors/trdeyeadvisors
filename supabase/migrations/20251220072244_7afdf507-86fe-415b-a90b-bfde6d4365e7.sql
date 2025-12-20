-- Fix 1: Ensure subscribers table has proper SELECT restriction
-- The existing policy "Only verified admins can view subscribers" should be the only SELECT policy
-- Let's verify and ensure no anonymous SELECT is possible
-- Drop any potential public SELECT policy
DROP POLICY IF EXISTS "Public can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anyone can view subscribers" ON public.subscribers;

-- Fix 2: Tighten contact_submissions security
-- Remove overly permissive service_role policy and replace with stricter one
DROP POLICY IF EXISTS "System can manage contact submissions" ON public.contact_submissions;

-- Create a more restrictive service role policy that only allows INSERT and SELECT
CREATE POLICY "System can manage contact submissions"
ON public.contact_submissions
FOR ALL
USING (
  (auth.jwt() ->> 'role') = 'service_role'
)
WITH CHECK (
  (auth.jwt() ->> 'role') = 'service_role'
);

-- Ensure no anonymous SELECT is possible on contact_submissions
DROP POLICY IF EXISTS "Public can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can view contact submissions" ON public.contact_submissions;

-- Fix 3: Tighten email_logs INSERT policy to only allow service_role
DROP POLICY IF EXISTS "System can insert email logs" ON public.email_logs;

-- Create a more restrictive INSERT policy for email_logs
CREATE POLICY "System can insert email logs"
ON public.email_logs
FOR INSERT
WITH CHECK (
  (auth.jwt() ->> 'role') = 'service_role'
);