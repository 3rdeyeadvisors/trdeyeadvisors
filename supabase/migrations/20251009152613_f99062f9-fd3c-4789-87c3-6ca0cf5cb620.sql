-- Fix the notify_new_signup trigger to handle profiles table properly
-- The profiles table doesn't have an email column, so we need to get it from auth.users

CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  payload jsonb;
  function_url text;
  mailchimp_url text;
  user_name text;
  user_email text;
BEGIN
  -- Handle different table structures
  IF TG_TABLE_NAME = 'subscribers' THEN
    user_name := NEW.name;
    user_email := NEW.email;
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    user_name := NEW.display_name;
    -- Get email from auth.users since profiles doesn't have email
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
  ELSE
    user_name := 'Unknown';
    user_email := NEW.email;
  END IF;
  
  -- Build the payload
  payload := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'record', jsonb_build_object(
      'id', NEW.id,
      'email', user_email,
      'name', user_name,
      'created_at', NEW.created_at
    )
  );
  
  -- Set the function URLs
  function_url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/notify-new-signup';
  mailchimp_url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/mailchimp-sync';
  
  -- Call the email notification function
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  );
  
  -- Call the Mailchimp sync function
  PERFORM net.http_post(
    url := mailchimp_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  );
  
  RETURN NEW;
END;
$function$;