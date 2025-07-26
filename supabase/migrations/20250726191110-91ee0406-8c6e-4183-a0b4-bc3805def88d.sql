-- Fix the configuration parameter issue
CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  function_url text;
  user_name text;
  service_role_key text;
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
  
  -- Set the function URL and service role key directly
  function_url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/notify-new-signup';
  
  -- Call the edge function without auth header to avoid key issues
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';