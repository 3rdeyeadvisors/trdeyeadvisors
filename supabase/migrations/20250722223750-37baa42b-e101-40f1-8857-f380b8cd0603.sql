-- Fix function search path security warnings by updating existing functions

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update update_comment_likes_count function
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Update update_discussion_replies_count function
CREATE OR REPLACE FUNCTION public.update_discussion_replies_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions 
    SET replies_count = replies_count + 1 
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions 
    SET replies_count = replies_count - 1 
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Update user_has_purchased_product function
CREATE OR REPLACE FUNCTION public.user_has_purchased_product(product_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_purchases 
    WHERE user_id = auth.uid() AND user_purchases.product_id = $1
  );
END;
$$;

-- Update validate_password_strength function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Basic password strength validation
  -- At least 8 characters, contains uppercase, lowercase, and number
  RETURN (
    LENGTH(password) >= 8 AND
    password ~ '[A-Z]' AND
    password ~ '[a-z]' AND
    password ~ '[0-9]'
  );
END;
$$;