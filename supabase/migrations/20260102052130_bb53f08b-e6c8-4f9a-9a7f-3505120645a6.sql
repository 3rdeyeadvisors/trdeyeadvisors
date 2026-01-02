-- Fix: Allow the handle_new_user trigger to insert into user_trials
-- The trigger runs as SECURITY DEFINER but RLS blocks it since there's no INSERT policy

-- Add policy to allow the trigger function to insert trials
-- Since handle_new_user runs with search_path=public and SECURITY DEFINER,
-- we need a policy that allows inserts when called from triggers

CREATE POLICY "Allow trigger inserts for new users"
ON public.user_trials FOR INSERT
WITH CHECK (true);

-- Also backfill trials for existing users who don't have one
INSERT INTO public.user_trials (user_id, trial_start, trial_end)
SELECT 
  u.id,
  u.created_at,
  u.created_at + interval '14 days'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_trials ut WHERE ut.user_id = u.id
);