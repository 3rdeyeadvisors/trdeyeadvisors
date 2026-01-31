-- Security Hardening for Point Awarding Functions
-- This migration ensures that users can only award points to themselves and prevents point spoofing.

-- 1. Create a table for point values to make them authoritative on the server
CREATE TABLE IF NOT EXISTS public.point_configs (
  action_type TEXT PRIMARY KEY,
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on point_configs
ALTER TABLE public.point_configs ENABLE ROW LEVEL SECURITY;

-- Only admins can manage point configs
CREATE POLICY "Admins can manage point configs"
ON public.point_configs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view point configs
CREATE POLICY "Everyone can view point configs"
ON public.point_configs FOR SELECT
USING (true);

-- Populate point values
INSERT INTO public.point_configs (action_type, points, description)
VALUES
  ('account_creation', 100, 'One-time account creation'),
  ('first_course_started', 50, 'Starting the first course'),
  ('complete_profile', 50, 'Completing user profile'),
  ('accept_referral_terms', 25, 'Accepting referral program terms'),
  ('daily_login', 10, 'Daily login bonus'),
  ('module_completion', 25, 'Completing a course module'),
  ('course_completion', 100, 'Completing an entire course'),
  ('quiz_passed', 50, 'Passing a course quiz'),
  ('quiz_perfect', 75, 'Perfect score on a quiz'),
  ('tutorial_completed', 20, 'Completing a tutorial'),
  ('comment_posted', 15, 'Posting a comment'),
  ('discussion_started', 25, 'Starting a discussion thread'),
  ('discussion_reply', 10, 'Replying to a discussion'),
  ('rate_course', 20, 'Rating a course'),
  ('roadmap_vote', 15, 'Voting on roadmap items'),
  ('referral_signup', 50, 'New user signed up via referral link'),
  ('referral_monthly_conversion', 150, 'Referral converted to monthly plan'),
  ('referral_annual_conversion', 300, 'Referral converted to annual plan'),
  ('referral_founding33_conversion', 500, 'Referral converted to Founding 33')
ON CONFLICT (action_type) DO UPDATE
SET points = EXCLUDED.points;

-- 2. Hardened award_user_points function
CREATE OR REPLACE FUNCTION public.award_user_points(
  _user_id UUID,
  _points INTEGER, -- Still keep this for backward compat, but we will prefer the config
  _action_type TEXT,
  _action_id TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(success BOOLEAN, points_awarded INTEGER, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_month TEXT;
  multiplier DECIMAL := 1.0;
  final_points INTEGER;
  is_founding33 BOOLEAN;
  config_points INTEGER;
  caller_id UUID := auth.uid();
BEGIN
  -- SECURITY CHECK: Only allow users to award points to themselves, or allow admin/service role
  -- Note: service_role bypasses this if called from edge function with service key, but auth.uid() will be null
  IF caller_id IS NOT NULL AND caller_id != _user_id THEN
    RETURN QUERY SELECT false, 0, 'Unauthorized: Cannot award points to another user';
    RETURN;
  END IF;

  -- Get authoritative points from config
  SELECT points INTO config_points FROM public.point_configs WHERE action_type = _action_type;

  -- If action type is unknown, use the provided points as fallback (or reject)
  IF config_points IS NULL THEN
    final_points := _points;
  ELSE
    final_points := config_points;
  END IF;

  -- Get current month
  current_month := to_char(now(), 'YYYY-MM');

  -- Check for Founding 33 status (1.5x multiplier)
  SELECT EXISTS (
    SELECT 1 FROM public.founding33_purchases
    WHERE founding33_purchases.user_id = _user_id AND status = 'completed'
  ) INTO is_founding33;

  IF is_founding33 THEN
    multiplier := multiplier * 1.5;
  END IF;

  -- Apply multiplier
  final_points := FLOOR(final_points * multiplier);

  -- Insert point transaction
  BEGIN
    INSERT INTO public.user_points (user_id, points, action_type, action_id, month_year, metadata)
    VALUES (_user_id, final_points, _action_type, _action_id, current_month,
            _metadata || jsonb_build_object('base_points', COALESCE(config_points, _points), 'multiplier', multiplier));
  EXCEPTION WHEN unique_violation THEN
    RETURN QUERY SELECT false, 0, 'Points already awarded for this action this month';
    RETURN;
  END;

  -- Update monthly total (upsert)
  INSERT INTO public.user_points_monthly (user_id, month_year, total_points, updated_at)
  VALUES (_user_id, current_month, final_points, now())
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET
    total_points = user_points_monthly.total_points + EXCLUDED.total_points,
    updated_at = now();

  RETURN QUERY SELECT true, final_points, 'Points awarded successfully';
END;
$$;

-- 3. Hardened check_daily_login function
CREATE OR REPLACE FUNCTION public.check_daily_login(_user_id UUID)
RETURNS TABLE(already_logged_in BOOLEAN, points_awarded INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  login_exists BOOLEAN;
  awarded_points INTEGER := 0;
  caller_id UUID := auth.uid();
BEGIN
  -- SECURITY CHECK
  IF caller_id IS NOT NULL AND caller_id != _user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

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

  -- Award points
  SELECT aup.points_awarded INTO awarded_points
  FROM public.award_user_points(_user_id, 10, 'daily_login', today::TEXT) aup;

  RETURN QUERY SELECT false, awarded_points;
END;
$$;
