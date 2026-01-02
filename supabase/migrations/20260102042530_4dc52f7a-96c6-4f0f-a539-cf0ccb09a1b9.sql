-- Create commissions table for referral commission tracking
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL,
  referred_user_id UUID NOT NULL,
  subscription_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'annual')),
  subscription_amount_cents INTEGER NOT NULL,
  commission_amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  UNIQUE(referred_user_id)
);

-- Enable RLS on commissions table
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for commissions
CREATE POLICY "Users can view their own commissions as referrer"
ON public.commissions
FOR SELECT
USING (referrer_id = auth.uid());

CREATE POLICY "Admins can view all commissions"
ON public.commissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update commissions"
ON public.commissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert commissions"
ON public.commissions
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Add payout columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS payout_method TEXT CHECK (payout_method IS NULL OR payout_method IN ('crypto', 'zelle')),
ADD COLUMN IF NOT EXISTS payout_details TEXT,
ADD COLUMN IF NOT EXISTS payout_crypto_network TEXT;

-- Create index for faster lookups
CREATE INDEX idx_commissions_referrer_id ON public.commissions(referrer_id);
CREATE INDEX idx_commissions_status ON public.commissions(status);