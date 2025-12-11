-- Remove duplicate triggers that are causing double emails

-- On profiles table: keep on_profile_created, remove the duplicate
DROP TRIGGER IF EXISTS trigger_notify_new_user_signup ON public.profiles;

-- On subscribers table: keep on_subscriber_created, remove the duplicate  
DROP TRIGGER IF EXISTS trigger_notify_new_subscriber ON public.subscribers;