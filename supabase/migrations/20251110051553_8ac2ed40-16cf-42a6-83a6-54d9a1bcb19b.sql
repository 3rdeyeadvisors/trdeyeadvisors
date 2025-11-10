-- Fix the notify_username_submission trigger function to remove the problematic authorization header casting
CREATE OR REPLACE FUNCTION public.notify_username_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
  raffle_title TEXT;
BEGIN
  -- Only proceed if verification_status changed to 'submitted'
  IF NEW.verification_status = 'submitted' AND (OLD.verification_status IS NULL OR OLD.verification_status != 'submitted') THEN
    -- Get user email
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
    
    -- Get raffle title
    SELECT title INTO raffle_title FROM public.raffles WHERE id = NEW.raffle_id;
    
    -- Call edge function to send notification
    -- Using the anon key directly instead of problematic header extraction
    PERFORM net.http_post(
      url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-username-verification-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
      ),
      body := jsonb_build_object(
        'email', user_email,
        'raffle_title', raffle_title,
        'instagram_username', NEW.instagram_username,
        'x_username', NEW.x_username,
        'task_type', NEW.task_type
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;