-- =====================================================
-- CLEANUP: Remove duplicate and conflicting RLS policies
-- =====================================================

-- 1. FIX: contact_submissions - Remove duplicate policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can submit contact forms securely" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact data" ON public.contact_submissions;

-- Recreate clean policies (one INSERT for public, one SELECT for admins)
CREATE POLICY "Public can submit contact forms"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Add data retention cleanup for security_audit_log (info-level finding)
-- Create a function to cleanup old audit logs (older than 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_security_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.security_audit_log
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- 3. Add data retention cleanup for email_logs (older than 60 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_email_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.email_logs
  WHERE created_at < NOW() - INTERVAL '60 days';
END;
$$;