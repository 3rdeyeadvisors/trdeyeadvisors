-- Fix 1: Fix check_daily_login ambiguous column reference
CREATE OR REPLACE FUNCTION public.check_daily_login(_user_id uuid)
RETURNS TABLE(already_logged_in boolean, points_awarded integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  login_exists BOOLEAN;
  awarded_points INTEGER := 0;
BEGIN
  -- Check if already logged in today
  SELECT EXISTS (
    SELECT 1 FROM public.daily_logins dl
    WHERE dl.user_id = _user_id AND dl.login_date = today
  ) INTO login_exists;
  
  IF login_exists THEN
    RETURN QUERY SELECT true, 0;
    RETURN;
  END IF;
  
  -- Record login
  INSERT INTO public.daily_logins (user_id, login_date, points_awarded)
  VALUES (_user_id, today, true)
  ON CONFLICT (user_id, login_date) DO NOTHING;
  
  -- Award points - use explicit column name from function result
  SELECT aup.points_awarded INTO awarded_points
  FROM public.award_user_points(_user_id, 10, 'daily_login', today::TEXT) aup;
  
  RETURN QUERY SELECT false, COALESCE(awarded_points, 10);
END;
$$;

-- Fix 2: Create security definer function for profile creation
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
  _user_id UUID,
  _display_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (_user_id, _display_name)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Fix 3: Update handle_new_user to use the security definer function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Get display name from metadata or use email prefix
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(user_email, '@', 1));
  
  -- Use security definer function to insert profile
  PERFORM public.create_profile_for_user(NEW.id, user_name);
  
  -- Insert into subscribers (if not already exists)
  INSERT INTO public.subscribers (email, name)
  VALUES (user_email, user_name)
  ON CONFLICT (email) DO NOTHING;
  
  -- Auto-create 14-day free trial
  INSERT INTO public.user_trials (user_id, trial_start, trial_end)
  VALUES (NEW.id, now(), now() + interval '14 days')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;