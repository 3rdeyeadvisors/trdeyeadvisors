-- Create table to track referral terms acceptance
CREATE TABLE public.referral_terms_acceptance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  terms_version TEXT NOT NULL DEFAULT 'v1.0',
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate acceptances per version
CREATE UNIQUE INDEX idx_referral_terms_user_version ON public.referral_terms_acceptance(user_id, terms_version);

-- Enable RLS
ALTER TABLE public.referral_terms_acceptance ENABLE ROW LEVEL SECURITY;

-- Users can view their own acceptance records
CREATE POLICY "Users can view their own terms acceptance"
ON public.referral_terms_acceptance
FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own acceptance
CREATE POLICY "Users can accept referral terms"
ON public.referral_terms_acceptance
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins can view all acceptance records
CREATE POLICY "Admins can view all terms acceptance"
ON public.referral_terms_acceptance
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can manage all records
CREATE POLICY "Service role can manage terms acceptance"
ON public.referral_terms_acceptance
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);