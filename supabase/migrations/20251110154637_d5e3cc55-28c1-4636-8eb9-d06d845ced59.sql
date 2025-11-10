-- Modify the handle_new_user function to also add users to subscribers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Get display name from metadata or use email prefix
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(user_email, '@', 1));
  
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, user_name);
  
  -- Insert into subscribers (if not already exists)
  INSERT INTO public.subscribers (email, name)
  VALUES (user_email, user_name)
  ON CONFLICT (email) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Backfill existing users who aren't subscribers yet
INSERT INTO public.subscribers (email, name)
SELECT 
  u.email,
  COALESCE(p.display_name, split_part(u.email, '@', 1)) as name
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscribers s WHERE s.email = u.email
)
ON CONFLICT (email) DO NOTHING;