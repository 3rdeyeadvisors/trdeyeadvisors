-- Fix Critical Security Issue: User Badge System Vulnerability
-- Drop the vulnerable policy that allows anyone to create badges
DROP POLICY IF EXISTS "System can create user badges" ON public.user_badges;

-- Create new secure policy: Only service_role and admins can create badges
CREATE POLICY "Only service_role and admins can create user badges"
ON public.user_badges
FOR INSERT
WITH CHECK (
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) 
  OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Fix Critical Security Issue: Profile Data Exposure
-- Update the policy to require authentication
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add monitoring trigger for contact submissions (bulk access detection)
CREATE OR REPLACE FUNCTION public.log_contact_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log access to security audit for monitoring
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    details
  ) VALUES (
    'contact_submission_access',
    auth.uid(),
    jsonb_build_object(
      'action', TG_OP,
      'table', TG_TABLE_NAME
    )
  );
  RETURN NEW;
END;
$$;

-- Create trigger for monitoring (optional - can be enabled later)
-- Commented out to avoid performance impact, but available if needed
-- CREATE TRIGGER log_contact_submission_access
-- AFTER SELECT ON public.contact_submissions
-- FOR EACH STATEMENT
-- EXECUTE FUNCTION public.log_contact_access();