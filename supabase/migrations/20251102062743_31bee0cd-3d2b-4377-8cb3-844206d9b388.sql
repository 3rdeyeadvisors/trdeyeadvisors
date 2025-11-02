-- Add DELETE policy for admins on printify_products table
CREATE POLICY "Admins can delete printify products"
ON public.printify_products
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);