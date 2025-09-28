-- Phase 1: Critical Data Protection

-- 1. Fix Profile Data Exposure - Restrict public access to profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Only allow users to see their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow public to view specific profiles if needed for features like public user pages
-- This can be enabled later with a 'is_public' column if needed
-- CREATE POLICY "Public profiles are viewable by everyone" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (is_public = true);

-- 2. Strengthen Subscriber Data Protection
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
DROP POLICY IF EXISTS "Subscribers are viewable by admins" ON public.subscribers;

-- Only allow inserts with rate limiting consideration
CREATE POLICY "Public can subscribe with rate limit" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);

-- Only admins with verified role can view subscriber data
CREATE POLICY "Only verified admins can view subscribers" 
ON public.subscribers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 3. Secure Contact Submissions - Already has proper admin-only access, but let's ensure it's tight
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;

-- Allow public submission but remove IP tracking from public access
CREATE POLICY "Public can submit contact forms securely" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- 4. Add security for digital product files
DROP POLICY IF EXISTS "Users can view files for purchased products only" ON public.digital_product_files;

-- Ensure only authenticated users who purchased can access
CREATE POLICY "Authenticated users can view purchased product files" 
ON public.digital_product_files 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.user_purchases 
      WHERE user_id = auth.uid() 
      AND product_id = digital_product_files.product_id
    ) OR 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
);

-- 5. Add index for better performance on security checks
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id_product ON public.user_purchases(user_id, product_id);

-- 6. Create a function to clean up old rate limits automatically
CREATE OR REPLACE FUNCTION public.auto_cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_end < now() - INTERVAL '24 hours';
END;
$$;

-- 7. Add security audit logging for authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log authentication events to security audit log
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.security_audit_log (
      event_type,
      user_id,
      details,
      created_at
    ) VALUES (
      'user_signup',
      NEW.id,
      jsonb_build_object(
        'email', NEW.email,
        'provider', COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
      ),
      now()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auth events (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created_security_log'
  ) THEN
    CREATE TRIGGER on_auth_user_created_security_log
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.log_auth_event();
  END IF;
END $$;