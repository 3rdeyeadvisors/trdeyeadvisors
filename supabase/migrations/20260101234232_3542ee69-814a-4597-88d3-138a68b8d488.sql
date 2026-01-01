-- Database cleanup: Remove old/stale data

-- 1. Delete old rate limit records (7 records older than 24 hours)
DELETE FROM public.rate_limits 
WHERE window_end < now() - INTERVAL '24 hours';

-- 2. Fix empty profile display names (5 profiles)
UPDATE public.profiles 
SET display_name = 'User', updated_at = now()
WHERE display_name IS NULL OR display_name = '';

-- 3. Delete old failed email logs (4 records older than 30 days)
DELETE FROM public.email_logs 
WHERE status = 'failed' 
AND created_at < now() - INTERVAL '30 days';