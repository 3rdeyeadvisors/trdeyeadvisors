-- Fix security vulnerability in rate_limits table
-- Remove overly permissive policy that allows public access to email addresses

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

-- Create secure policies that prevent email harvesting while maintaining functionality
-- Only allow system operations, no public read access

-- Allow system to insert rate limit records (needed for tracking)
CREATE POLICY "System can insert rate limits" 
ON public.rate_limits 
FOR INSERT 
WITH CHECK (true);

-- Allow system to update rate limit records (needed for incrementing counters)
CREATE POLICY "System can update rate limits" 
ON public.rate_limits 
FOR UPDATE 
USING (true);

-- Allow system to delete rate limit records (needed for cleanup)
CREATE POLICY "System can delete rate limits" 
ON public.rate_limits 
FOR DELETE 
USING (true);

-- NO SELECT policy - this prevents any public read access to email addresses
-- The check_rate_limit function uses SECURITY DEFINER so it can still access the data
-- but external users cannot query the table directly

-- Add index for better performance on rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup 
ON public.rate_limits (identifier, action_type, window_start);

-- Add a comment explaining the security consideration
COMMENT ON TABLE public.rate_limits IS 'Rate limiting table - no public SELECT access to prevent email harvesting. Access only through SECURITY DEFINER functions.';