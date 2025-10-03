-- ============================================
-- CRITICAL SECURITY FIXES
-- ============================================

-- 1. FIX RATE_LIMITS TABLE RLS POLICIES
-- Drop overly permissive policies that allow any user to manipulate rate limiting
DROP POLICY IF EXISTS "System can insert rate limits" ON public.rate_limits;
DROP POLICY IF EXISTS "System can update rate limits" ON public.rate_limits;
DROP POLICY IF EXISTS "System can delete rate limits" ON public.rate_limits;

-- Create restrictive policy that only allows service_role to manage rate limits
CREATE POLICY "Only service_role can manage rate limits"
ON public.rate_limits
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- 2. FIX PROFILES TABLE RLS POLICIES
-- Add policy to allow authenticated users to view all profiles (needed for community features)
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. ENHANCE SECURITY AUDIT LOGGING
-- Add indexes for faster security audit log queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON public.security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);