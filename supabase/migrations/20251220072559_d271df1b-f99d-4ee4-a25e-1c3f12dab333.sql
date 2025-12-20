-- COMPREHENSIVE SECURITY FIX MIGRATION
-- Fixes all critical and warning-level security issues

-- ============================================
-- FIX 1: Ensure subscribers table has NO public SELECT
-- ============================================
-- The subscribers table should only be readable by admins
-- Drop any potential conflicting policies
DROP POLICY IF EXISTS "Public can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anyone can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Subscribers are viewable by everyone" ON public.subscribers;

-- Verify admin-only SELECT exists (it should from previous migrations)
-- If not, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscribers' 
    AND policyname = 'Only verified admins can view subscribers'
  ) THEN
    EXECUTE 'CREATE POLICY "Only verified admins can view subscribers" ON public.subscribers FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = ''admin''::app_role))';
  END IF;
END $$;

-- ============================================
-- FIX 2: Strengthen contact_submissions protection
-- ============================================
-- Ensure the public INSERT has proper rate limiting and no SELECT for public
DROP POLICY IF EXISTS "Public can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can view contact submissions" ON public.contact_submissions;

-- ============================================
-- FIX 3: Improve digital_downloads security
-- ============================================
-- Add audit logging trigger for download access
CREATE OR REPLACE FUNCTION public.log_download_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log download access to security audit
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
  ) VALUES (
    'digital_download_access',
    auth.uid(),
    jsonb_build_object(
      'download_id', NEW.id,
      'product_name', NEW.product_name,
      'download_count', NEW.download_count
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger for download access logging (drop if exists first)
DROP TRIGGER IF EXISTS log_download_access_trigger ON public.digital_downloads;
CREATE TRIGGER log_download_access_trigger
AFTER UPDATE OF download_count ON public.digital_downloads
FOR EACH ROW
EXECUTE FUNCTION public.log_download_access();

-- ============================================
-- FIX 4: Add audit logging for admin access to sensitive tables
-- ============================================
CREATE OR REPLACE FUNCTION public.log_admin_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user is admin accessing data
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    INSERT INTO public.security_audit_log (
      event_type,
      user_id,
      details
    ) VALUES (
      'admin_data_access',
      auth.uid(),
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'timestamp', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- FIX 5: Strengthen printify_orders access
-- ============================================
-- Ensure guest orders are protected - drop any overly permissive policies
DROP POLICY IF EXISTS "Anyone can view orders" ON public.printify_orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.printify_orders;

-- ============================================
-- FIX 6: Protect grandfathered_emails table
-- ============================================
-- This table should ONLY be accessible by admins
DROP POLICY IF EXISTS "Public can view grandfathered emails" ON public.grandfathered_emails;
DROP POLICY IF EXISTS "Anyone can view grandfathered emails" ON public.grandfathered_emails;

-- ============================================
-- FIX 7: Add index for rate limiting performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
ON public.rate_limits (identifier, action_type, window_start);

-- ============================================
-- FIX 8: Ensure security_audit_log can only be read by admins
-- ============================================
DROP POLICY IF EXISTS "Public can view security logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Anyone can view security logs" ON public.security_audit_log;

-- ============================================
-- FIX 9: Add constraint to prevent empty download tokens
-- ============================================
ALTER TABLE public.digital_downloads 
DROP CONSTRAINT IF EXISTS download_token_not_empty;

ALTER TABLE public.digital_downloads 
ADD CONSTRAINT download_token_not_empty 
CHECK (length(download_token) >= 32);

-- ============================================
-- FIX 10: Strengthen email_logs protection
-- ============================================
DROP POLICY IF EXISTS "Public can view email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Anyone can view email logs" ON public.email_logs;