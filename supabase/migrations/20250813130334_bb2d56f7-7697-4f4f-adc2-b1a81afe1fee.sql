-- Fix security vulnerability in contact_submissions table
-- Clean up conflicting policies and ensure only admin access to sensitive customer data

-- Drop existing potentially conflicting policies
DROP POLICY IF EXISTS "Allow admin to view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow contact form submissions" ON public.contact_submissions;

-- Create secure, non-conflicting policies

-- Allow anyone to submit contact forms (needed for public contact form)
CREATE POLICY "Public can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only allow admin users to view contact submissions (protects customer PII)
CREATE POLICY "Only admins can view contact data" 
ON public.contact_submissions 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow system operations via service role (needed for edge functions)
CREATE POLICY "System can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
)
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- Only allow admins to update/delete contact submissions (for data management)
CREATE POLICY "Only admins can modify contact data" 
ON public.contact_submissions 
FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Only admins can delete contact data" 
ON public.contact_submissions 
FOR DELETE 
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add security comment
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions - contains customer PII. Access restricted to admin users only to prevent data theft.';

-- Add index for admin queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at 
ON public.contact_submissions (submitted_at DESC);