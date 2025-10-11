-- Create discount codes table
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_purchase_amount INTEGER DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applies_to TEXT NOT NULL CHECK (applies_to IN ('all', 'courses', 'merchandise', 'digital')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active discount codes to validate them
CREATE POLICY "Active discount codes are viewable by everyone"
ON public.discount_codes
FOR SELECT
USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Policy: Only admins can manage discount codes
CREATE POLICY "Only admins can manage discount codes"
ON public.discount_codes
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create function to validate and apply discount
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  _code TEXT,
  _amount INTEGER,
  _product_type TEXT
)
RETURNS TABLE(
  is_valid BOOLEAN,
  discount_id UUID,
  discount_amount INTEGER,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_discount discount_codes%ROWTYPE;
  v_calculated_discount INTEGER;
BEGIN
  -- Find the discount code
  SELECT * INTO v_discount
  FROM public.discount_codes
  WHERE code = UPPER(_code)
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until > now())
    AND (max_uses IS NULL OR current_uses < max_uses)
    AND (applies_to = 'all' OR applies_to = _product_type);
  
  -- If not found, return invalid
  IF v_discount.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Invalid or expired discount code';
    RETURN;
  END IF;
  
  -- Check minimum purchase amount
  IF v_discount.min_purchase_amount > _amount THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Minimum purchase amount not met';
    RETURN;
  END IF;
  
  -- Calculate discount
  IF v_discount.discount_type = 'percentage' THEN
    v_calculated_discount := FLOOR(_amount * v_discount.discount_value / 100);
  ELSE
    v_calculated_discount := LEAST(v_discount.discount_value::INTEGER, _amount);
  END IF;
  
  -- Return valid discount
  RETURN QUERY SELECT true, v_discount.id, v_calculated_discount, 'Discount applied successfully';
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create discount usage tracking table
CREATE TABLE public.discount_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id UUID NOT NULL REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_amount INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on discount usage
ALTER TABLE public.discount_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own discount usage
CREATE POLICY "Users can view their own discount usage"
ON public.discount_usage
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Only admins can view all discount usage
CREATE POLICY "Admins can view all discount usage"
ON public.discount_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Policy: System can insert discount usage
CREATE POLICY "System can insert discount usage"
ON public.discount_usage
FOR INSERT
WITH CHECK (true);