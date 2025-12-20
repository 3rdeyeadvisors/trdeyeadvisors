-- Fix 1: Update contact_submissions INSERT policy to use rate limiting
-- Drop the existing public insert policy
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;

-- Create a new policy that requires rate limit check
-- Note: Since check_rate_limit modifies data, we'll rely on application-level rate limiting
-- But we can add a simple check using a function
CREATE POLICY "Public can submit contact forms with rate limit"
ON public.contact_submissions
FOR INSERT
WITH CHECK (
  check_rate_limit(
    COALESCE(current_setting('request.headers', true)::json->>'x-real-ip', 'unknown'),
    'contact_form',
    3,  -- max 3 submissions
    60  -- per 60 minutes
  )
);

-- Fix 2: Update printify_orders policies to protect guest orders
-- Guest orders (user_id IS NULL) should only be accessible by admins/service role

-- Drop the existing user policy that might expose guest orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.printify_orders;

-- Create a more restrictive policy for authenticated users viewing their own orders
-- This ensures NULL user_id orders are NOT visible to regular users
CREATE POLICY "Users can view their own orders only"
ON public.printify_orders
FOR SELECT
USING (
  user_id IS NOT NULL 
  AND user_id = auth.uid()
);

-- Add a policy allowing users to view orders by their email (for guest checkout lookup)
-- But only if they're authenticated and the email matches
CREATE POLICY "Users can view their orders by email"
ON public.printify_orders
FOR SELECT
USING (
  customer_email IS NOT NULL 
  AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);