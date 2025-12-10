-- Fix the profiles INSERT policy - remove dangerous postgres role check
DROP POLICY IF EXISTS "Users and system can insert profiles" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add service role policy for system inserts (triggers, etc)
CREATE POLICY "Service role can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Fix printify_orders - ensure orders without user_id can only be seen by admins
-- Drop and recreate the user view policy to be more restrictive
DROP POLICY IF EXISTS "Users can view their own orders" ON public.printify_orders;

CREATE POLICY "Users can view their own orders"
ON public.printify_orders
FOR SELECT
USING (user_id IS NOT NULL AND user_id = auth.uid());