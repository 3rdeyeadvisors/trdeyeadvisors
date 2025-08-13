-- Fix critical security vulnerability in digital_product_files table
-- Remove public read access to prevent unauthorized access to paid content file paths

-- Drop the existing overly permissive policy that allows everyone to view file paths
DROP POLICY IF EXISTS "Digital product files are viewable by everyone" ON public.digital_product_files;

-- Create secure policy that only allows users who purchased the product to see file metadata
-- This policy protects file paths from being exposed to non-customers
CREATE POLICY "Users can view files for purchased products only" 
ON public.digital_product_files 
FOR SELECT 
USING (
  -- Allow access only if the user has purchased this product
  EXISTS (
    SELECT 1 
    FROM public.user_purchases 
    WHERE user_id = auth.uid() 
    AND product_id = digital_product_files.product_id
  )
  OR
  -- Allow admin access for management purposes
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow system operations for file management (needed for upload/admin functions)
CREATE POLICY "System can manage digital product files" 
ON public.digital_product_files 
FOR ALL 
USING (
  -- Only allow for system operations (service role) or admin users
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
  OR public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add comment explaining the security considerations
COMMENT ON TABLE public.digital_product_files IS 'Digital product files - access restricted to purchasers only to prevent unauthorized access to paid content. File downloads must go through the secure edge function.';

-- Ensure the download edge function can still access files with service role
-- (No changes needed to edge function as it uses service role key)