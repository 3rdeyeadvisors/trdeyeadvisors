-- Fix search_path for get_points_leaderboard function
DROP FUNCTION IF EXISTS public.get_points_leaderboard;
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
SET search_path = ''
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

-- Fix search_path for get_user_points_rank function
DROP FUNCTION IF EXISTS public.get_user_points_rank;
CREATE OR REPLACE FUNCTION public.get_user_points_rank(_user_id UUID)
RETURNS TABLE(
  total_points INTEGER,
  rank BIGINT,
  total_users BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
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