-- =====================================================
-- CREATE AUTOMATED EMAIL CRON JOBS
-- =====================================================

-- Ensure pg_net extension is available
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 1. INACTIVE USER REMINDER - Daily at 3 PM UTC (9 AM Central)
SELECT cron.schedule(
  'inactive-user-reminder-daily',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-inactive-user-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 2. COURSE REMINDER - Daily at 4 PM UTC (10 AM Central)
SELECT cron.schedule(
  'send-course-reminder-daily',
  '0 16 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-course-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 3. SUBSCRIBER SIGNUP REMINDER - Daily at 2 PM UTC (8 AM Central)
SELECT cron.schedule(
  'send-subscriber-signup-reminder-daily',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-subscriber-signup-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
    ),
    body := '{}'::jsonb
  );
  $$
);