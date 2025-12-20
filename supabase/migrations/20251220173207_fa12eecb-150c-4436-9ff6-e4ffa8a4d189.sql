-- FIX #1: contact_submissions - Remove public SELECT access, keep INSERT with rate limit
-- The public SELECT policy exposes customer PII (emails, names, IPs)

DROP POLICY IF EXISTS "Public can submit contact forms with rate limit" ON public.contact_submissions;

-- Create separate policies: public INSERT only, admin SELECT
CREATE POLICY "Public can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (
  check_rate_limit(
    COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown'),
    'contact_form',
    3,
    60
  )
);

CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));


-- FIX #2: printify_orders - Tighten email-based access to require authentication
-- Current policy allows viewing by email match which could be exploited

DROP POLICY IF EXISTS "Users can view their orders by email" ON public.printify_orders;

CREATE POLICY "Users can view their own orders" 
ON public.printify_orders 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND
  (
    user_id = auth.uid() OR 
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);


-- FIX #3: discount_codes - Restrict viewing to authenticated users only
-- Currently anyone can view all discount codes

DROP POLICY IF EXISTS "Anyone can view active discounts" ON public.discount_codes;

CREATE POLICY "Authenticated users can view active discounts" 
ON public.discount_codes 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  is_active = true AND
  (valid_from IS NULL OR valid_from <= now()) AND
  (valid_until IS NULL OR valid_until > now())
);