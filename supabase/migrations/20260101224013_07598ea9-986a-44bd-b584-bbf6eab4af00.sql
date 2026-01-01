-- Create user_trials table to track automatic trials
CREATE TABLE public.user_trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  trial_start timestamp with time zone NOT NULL DEFAULT now(),
  trial_end timestamp with time zone NOT NULL DEFAULT (now() + interval '14 days'),
  converted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own trial"
ON public.user_trials FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all trials"
ON public.user_trials FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage trials"
ON public.user_trials FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Update handle_new_user function to auto-create trial
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
  
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, user_name);
  
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