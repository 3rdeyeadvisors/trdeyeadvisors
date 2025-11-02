-- Allow admins to view all printify orders
CREATE POLICY "Admins can view all orders"
ON public.printify_orders
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Also allow service role to select for admin operations
CREATE POLICY "Service role can view all orders"
ON public.printify_orders
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);