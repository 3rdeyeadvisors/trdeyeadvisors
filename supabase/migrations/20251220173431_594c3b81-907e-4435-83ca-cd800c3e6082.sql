-- FIX: digital_downloads - Tighten INSERT/UPDATE to service_role only
-- Current policies allow system-wide INSERT/UPDATE with 'true' which is too permissive

DROP POLICY IF EXISTS "System can create downloads" ON public.digital_downloads;
DROP POLICY IF EXISTS "System can update downloads" ON public.digital_downloads;

-- Only service_role can create downloads (from stripe webhook/edge functions)
CREATE POLICY "Only service_role can create downloads" 
ON public.digital_downloads 
FOR INSERT 
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Only service_role can update downloads (increment download count)
CREATE POLICY "Only service_role can update downloads" 
ON public.digital_downloads 
FOR UPDATE 
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);


-- FIX: Add rate limiting to subscribers INSERT  
-- Currently allows unlimited public inserts which could be abused

DROP POLICY IF EXISTS "Public can subscribe with rate limit" ON public.subscribers;

CREATE POLICY "Public can subscribe with rate limit" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (
  check_rate_limit(
    COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown'),
    'newsletter_subscribe',
    5,
    60
  )
);


-- FIX: Simplify printify_orders policies - remove duplicate email-based policy
-- The new "Users can view their own orders" policy already handles both user_id and email

DROP POLICY IF EXISTS "Users can view their orders by email" ON public.printify_orders;
DROP POLICY IF EXISTS "Users can view their own orders only" ON public.printify_orders;