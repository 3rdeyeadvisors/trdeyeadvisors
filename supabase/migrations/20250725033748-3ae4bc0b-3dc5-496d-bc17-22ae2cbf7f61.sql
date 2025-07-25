-- Create a courses table to track actual course products
CREATE TABLE public.courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('free', 'paid')),
  price_cents INTEGER, -- Price in cents, NULL for free courses
  stripe_price_id TEXT, -- Stripe price ID for paid courses
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing courses
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (is_active = true);

-- Insert the courses from your frontend
INSERT INTO public.courses (id, title, description, category, price_cents) VALUES
(1, 'DeFi Foundations: Understanding the New Financial System', 'Complete beginner''s guide from zero knowledge to confident understanding. Learn what DeFi is, why it exists, and how it works in plain English.', 'free', NULL),
(2, 'Staying Safe in DeFi: Wallets, Security, and Avoiding Scams', 'Essential security course for beginners worried about hacks or losing funds. Learn to set up wallets correctly and keep funds safe.', 'free', NULL),
(3, 'Earning with DeFi: Staking, Yield Farming, and Liquidity Pools Made Simple', 'Ready to earn passive income? Understand different earning methods and choose what fits your risk level.', 'paid', 6700),
(4, 'Managing Your Own DeFi Portfolio: From Beginner to Confident User', 'Learn to actively manage a small DeFi portfolio. Track, adjust, and grow your investments responsibly.', 'paid', 9700);

-- Create a function to check if user has purchased a course
CREATE OR REPLACE FUNCTION public.user_has_purchased_course(course_id integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if course is free
  IF EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND category = 'free') THEN
    RETURN true;
  END IF;
  
  -- Check if user has purchased the course
  RETURN EXISTS (
    SELECT 1 FROM public.user_purchases 
    WHERE user_id = auth.uid() AND product_id = course_id
  );
END;
$function$;