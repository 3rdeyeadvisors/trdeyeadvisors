-- Create founding33_purchases table
CREATE TABLE public.founding33_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER NOT NULL DEFAULT 200000,
  status TEXT NOT NULL DEFAULT 'pending',
  seat_number INTEGER,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.founding33_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own founding33 purchase"
  ON public.founding33_purchases FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all founding33 purchases"
  ON public.founding33_purchases FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update founding33 purchases"
  ON public.founding33_purchases FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Service role insert policy (for edge functions)
CREATE POLICY "Service role can insert founding33 purchases"
  ON public.founding33_purchases FOR INSERT
  WITH CHECK (true);

-- Service role update policy (for webhook)
CREATE POLICY "Service role can update founding33 purchases"
  ON public.founding33_purchases FOR UPDATE
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_founding33_purchases_updated_at
  BEFORE UPDATE ON public.founding33_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get next seat number (atomic)
CREATE OR REPLACE FUNCTION public.get_next_founding33_seat()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_seat INTEGER;
BEGIN
  SELECT COALESCE(MAX(seat_number), 0) + 1 INTO next_seat
  FROM public.founding33_purchases
  WHERE status = 'completed';
  RETURN next_seat;
END;
$$;

-- Function to count remaining spots
CREATE OR REPLACE FUNCTION public.get_founding33_spots_remaining()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN 33 - (
    SELECT COUNT(*)::INTEGER
    FROM public.founding33_purchases
    WHERE status = 'completed'
  );
END;
$$;

-- Function to check if user has founding33 access
CREATE OR REPLACE FUNCTION public.user_has_founding33_access(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.founding33_purchases
    WHERE user_id = check_user_id AND status = 'completed'
  );
END;
$$;