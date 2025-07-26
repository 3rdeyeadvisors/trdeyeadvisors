-- Create function to notify new signups
CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Build the payload
  payload := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'record', jsonb_build_object(
      'id', NEW.id,
      'email', NEW.email,
      'name', COALESCE(NEW.name, NEW.display_name),
      'created_at', NEW.created_at
    )
  );
  
  -- Call the edge function
  PERFORM net.http_post(
    url := current_setting('app.settings.functions_url', true) || '/notify-new-signup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for subscribers table
CREATE OR REPLACE TRIGGER trigger_notify_new_subscriber
  AFTER INSERT ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_signup();

-- Create triggers for profiles table (represents user signups)
CREATE OR REPLACE TRIGGER trigger_notify_new_user_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_signup();

-- Set the required settings for the function to work
ALTER DATABASE postgres SET "app.settings.functions_url" TO 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1';
ALTER DATABASE postgres SET "app.settings.service_role_key" TO current_setting('supabase.service_role_key');