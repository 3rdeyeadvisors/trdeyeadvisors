-- Fix Critical Security Issue: Printify Orders Access Control
-- The current policies use 'true' which is too permissive
-- Need to explicitly check for service_role JWT claims

-- Drop the vulnerable policies
DROP POLICY IF EXISTS "System can create orders" ON public.printify_orders;
DROP POLICY IF EXISTS "System can update orders" ON public.printify_orders;

-- Create secure policies with explicit service_role checks
CREATE POLICY "Only service_role can create orders"
ON public.printify_orders
FOR INSERT
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

CREATE POLICY "Only service_role can update orders"
ON public.printify_orders
FOR UPDATE
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
)
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);