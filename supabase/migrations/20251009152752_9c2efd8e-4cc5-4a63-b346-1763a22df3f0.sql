-- Fix signup triggers - remove duplicate and ensure proper email handling
-- The issue: Two triggers calling notify_new_signup on profiles table

-- Drop the duplicate trigger (keep the newer one)
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- The trigger_notify_new_user_signup will remain and use the fixed function
-- which now properly gets email from auth.users instead of trying NEW.email