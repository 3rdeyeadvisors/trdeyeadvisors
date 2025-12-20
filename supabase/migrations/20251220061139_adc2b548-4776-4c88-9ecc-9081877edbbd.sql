-- Create wallet_addresses table for linking user accounts to crypto wallets
CREATE TABLE public.wallet_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  chain_id INTEGER DEFAULT 1,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, wallet_address)
);

-- Create vault_whitelist table for tracking NFT verification & vault access
CREATE TABLE public.vault_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  user_id UUID,
  nft_token_id INTEGER,
  nft_balance INTEGER DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_whitelist ENABLE ROW LEVEL SECURITY;

-- RLS policies for wallet_addresses
CREATE POLICY "Users can view their own wallets"
ON public.wallet_addresses
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can link their own wallets"
ON public.wallet_addresses
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own wallets"
ON public.wallet_addresses
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own wallets"
ON public.wallet_addresses
FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all wallets"
ON public.wallet_addresses
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for vault_whitelist
CREATE POLICY "Users can view their own whitelist status"
ON public.vault_whitelist
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all whitelist entries"
ON public.vault_whitelist
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can manage whitelist"
ON public.vault_whitelist
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create updated_at trigger for wallet_addresses
CREATE TRIGGER update_wallet_addresses_updated_at
BEFORE UPDATE ON public.wallet_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for vault_whitelist
CREATE TRIGGER update_vault_whitelist_updated_at
BEFORE UPDATE ON public.vault_whitelist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();