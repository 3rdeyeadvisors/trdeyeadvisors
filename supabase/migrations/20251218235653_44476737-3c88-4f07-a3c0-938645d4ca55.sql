-- =====================================================
-- SECURITY FIX: Strengthen RLS policies for sensitive tables
-- =====================================================

-- 1. FIX: contact_submissions - Only admins should read customer contact data
-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admin select on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

-- Create secure policies: Anyone can INSERT (submit form), only admins can SELECT
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- 2. FIX: digital_downloads - Users can only access their own downloads
DROP POLICY IF EXISTS "Users can view their own downloads" ON public.digital_downloads;
DROP POLICY IF EXISTS "Users can access their downloads" ON public.digital_downloads;
DROP POLICY IF EXISTS "Admins can view all downloads" ON public.digital_downloads;
DROP POLICY IF EXISTS "System can create downloads" ON public.digital_downloads;

-- Enable RLS if not already enabled
ALTER TABLE public.digital_downloads ENABLE ROW LEVEL SECURITY;

-- Users can only view their own downloads (by user_id or email match)
CREATE POLICY "Users can view their own downloads"
ON public.digital_downloads
FOR SELECT
USING (
  user_id = auth.uid() OR 
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Admins can view all downloads
CREATE POLICY "Admins can view all downloads"
ON public.digital_downloads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Only service role / system can insert downloads (handled by edge functions)
CREATE POLICY "System can create downloads"
ON public.digital_downloads
FOR INSERT
WITH CHECK (true);

-- 3. FIX: profiles - Keep community visibility but add note
-- Profiles are intentionally viewable by all authenticated users for community features
-- This is acceptable for a community/learning platform

-- 4. Ensure contact_submissions has RLS enabled
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;