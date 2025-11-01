
-- Allow admins and service role to update printify products
CREATE POLICY "Admins can update printify products"
ON public.printify_products
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  (auth.jwt() ->> 'role') = 'service_role'
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  (auth.jwt() ->> 'role') = 'service_role'
);
