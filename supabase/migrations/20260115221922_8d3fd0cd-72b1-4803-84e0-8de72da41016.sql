-- Create user_points table for individual point transactions
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  action_id TEXT,
  month_year TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint for deduplication (prevent double-awarding for same action)
CREATE UNIQUE INDEX user_points_unique_action ON public.user_points (user_id, action_type, action_id, month_year) 
WHERE action_id IS NOT NULL;

-- Create index for fast lookups
CREATE INDEX user_points_user_month_idx ON public.user_points (user_id, month_year);
CREATE INDEX user_points_month_idx ON public.user_points (month_year);

-- Create user_points_monthly table for aggregated totals
CREATE TABLE public.user_points_monthly (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month_year TEXT NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Create index for leaderboard queries
CREATE INDEX user_points_monthly_leaderboard_idx ON public.user_points_monthly (month_year, total_points DESC);

-- Create monthly_rewards table for winners
CREATE TABLE public.monthly_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year TEXT NOT NULL,
  user_id UUID NOT NULL,
  rank INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_details JSONB DEFAULT '{}'::jsonb,
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for user rewards lookup
CREATE INDEX monthly_rewards_user_idx ON public.monthly_rewards (user_id);
CREATE INDEX monthly_rewards_month_idx ON public.monthly_rewards (month_year);

-- Create daily_logins table to track daily login points
CREATE TABLE public.daily_logins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  login_date DATE NOT NULL,
  points_awarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, login_date)
);

-- Enable RLS on all tables
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points"
ON public.user_points FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all points"
ON public.user_points FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert points"
ON public.user_points FOR INSERT
WITH CHECK (true);

-- RLS Policies for user_points_monthly
CREATE POLICY "Users can view their own monthly totals"
ON public.user_points_monthly FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "All users can view leaderboard data"
ON public.user_points_monthly FOR SELECT
USING (true);

CREATE POLICY "Service role can manage monthly totals"
ON public.user_points_monthly FOR ALL
USING (true);

-- RLS Policies for monthly_rewards
CREATE POLICY "Users can view their own rewards"
ON public.monthly_rewards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rewards"
ON public.monthly_rewards FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage rewards"
ON public.monthly_rewards FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for daily_logins
CREATE POLICY "Users can view their own logins"
ON public.daily_logins FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logins"
ON public.daily_logins FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to award points and update monthly total
CREATE OR REPLACE FUNCTION public.award_user_points(
  _user_id UUID,
  _points INTEGER,
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
  is_annual BOOLEAN;
BEGIN
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
  final_points := FLOOR(_points * multiplier);
  
  -- Insert point transaction (will fail silently on duplicate for unique actions)
  BEGIN
    INSERT INTO public.user_points (user_id, points, action_type, action_id, month_year, metadata)
    VALUES (_user_id, final_points, _action_type, _action_id, current_month, 
            _metadata || jsonb_build_object('base_points', _points, 'multiplier', multiplier));
  EXCEPTION WHEN unique_violation THEN
    RETURN QUERY SELECT false, 0, 'Points already awarded for this action';
    RETURN;
  END;
  
  -- Update monthly total
  INSERT INTO public.user_points_monthly (user_id, month_year, total_points)
  VALUES (_user_id, current_month, final_points)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    total_points = user_points_monthly.total_points + final_points,
    updated_at = now();
  
  RETURN QUERY SELECT true, final_points, 'Points awarded successfully';
END;
$$;

-- Function to get current month leaderboard
CREATE OR REPLACE FUNCTION public.get_points_leaderboard(_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER,
  rank BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    upm.user_id,
    p.display_name,
    p.avatar_url,
    upm.total_points,
    ROW_NUMBER() OVER (ORDER BY upm.total_points DESC) as rank
  FROM public.user_points_monthly upm
  LEFT JOIN public.profiles p ON p.user_id = upm.user_id
  WHERE upm.month_year = to_char(now(), 'YYYY-MM')
  ORDER BY upm.total_points DESC
  LIMIT _limit;
$$;

-- Function to get user's rank
CREATE OR REPLACE FUNCTION public.get_user_points_rank(_user_id UUID)
RETURNS TABLE(
  total_points INTEGER,
  rank BIGINT,
  total_users BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH ranked AS (
    SELECT 
      upm.user_id,
      upm.total_points,
      ROW_NUMBER() OVER (ORDER BY upm.total_points DESC) as rank
    FROM public.user_points_monthly upm
    WHERE upm.month_year = to_char(now(), 'YYYY-MM')
  ),
  total AS (
    SELECT COUNT(*) as total_users
    FROM public.user_points_monthly
    WHERE month_year = to_char(now(), 'YYYY-MM')
  )
  SELECT 
    COALESCE(r.total_points, 0)::INTEGER,
    COALESCE(r.rank, 0)::BIGINT,
    COALESCE(t.total_users, 0)::BIGINT
  FROM (SELECT _user_id as user_id) u
  LEFT JOIN ranked r ON r.user_id = u.user_id
  CROSS JOIN total t;
$$;

-- Function to check and award daily login points
CREATE OR REPLACE FUNCTION public.check_daily_login(_user_id UUID)
RETURNS TABLE(already_logged_in BOOLEAN, points_awarded INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  today DATE := CURRENT_DATE;
  login_exists BOOLEAN;
  awarded INTEGER := 0;
BEGIN
  -- Check if already logged in today
  SELECT EXISTS (
    SELECT 1 FROM public.daily_logins 
    WHERE daily_logins.user_id = _user_id AND login_date = today
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
  SELECT points_awarded INTO awarded
  FROM public.award_user_points(_user_id, 10, 'daily_login', today::TEXT);
  
  RETURN QUERY SELECT false, COALESCE(awarded, 10);
END;
$$;