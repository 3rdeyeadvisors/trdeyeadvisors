-- Make paid courses free (courses 3 and 4)
UPDATE public.courses 
SET 
  category = 'free',
  price_cents = NULL,
  stripe_price_id = NULL,
  updated_at = now()
WHERE id IN (3, 4);