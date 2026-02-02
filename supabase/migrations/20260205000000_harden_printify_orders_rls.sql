-- Harden Row Level Security for printify_orders table
-- This migration removes overly permissive policies and replaces them with role-based ones.

-- 1. Drop the existing permissive policies
DROP POLICY IF EXISTS "System can create orders" ON public.printify_orders;
DROP POLICY IF EXISTS "System can update orders" ON public.printify_orders;

-- 2. Ensure RLS is enabled (it should be, but just in case)
ALTER TABLE public.printify_orders ENABLE ROW LEVEL SECURITY;

-- 3. Create a more secure policy for admins
-- This allows admins to perform all operations on all orders
CREATE POLICY "Admins can manage all printify orders"
ON public.printify_orders
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Create a policy for the service role
-- Since service_role bypasses RLS by default in many configurations,
-- but it's good practice to be explicit if using TO.
-- Note: Edge functions using the service_role key will bypass RLS.

-- 5. Ensure users can still view their own orders (already exists, but kept for clarity)
-- DROP POLICY IF EXISTS "Users can view their own orders" ON public.printify_orders;
-- CREATE POLICY "Users can view their own orders"
-- ON public.printify_orders
-- FOR SELECT
-- TO authenticated
-- USING (auth.uid() = user_id);
