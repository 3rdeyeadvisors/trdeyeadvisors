-- Update the notify_new_signup function to also call Mailchimp sync
CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  function_url text;
  mailchimp_url text;
  user_name text;
BEGIN
  -- Handle different table structures
  IF TG_TABLE_NAME = 'subscribers' THEN
    user_name := NEW.name;
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    user_name := NEW.display_name;
  ELSE
    user_name := 'Unknown';
  END IF;
  
  -- Build the payload
  payload := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'record', jsonb_build_object(
      'id', NEW.id,
      'email', NEW.email,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Test the integration by adding a test subscriber
INSERT INTO public.subscribers (email, name) 
VALUES ('test-mailchimp@example.com', 'Mailchimp Test User');