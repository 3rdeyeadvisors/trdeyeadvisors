-- =====================================================
-- DISABLE MARKETING EMAIL TRIGGERS
-- Keep only Mailchimp sync and transactional emails
-- =====================================================

-- Drop the old notify_new_signup trigger that sends welcome/thank-you emails
-- We keep Mailchimp sync but disable Lovable marketing emails
DROP TRIGGER IF EXISTS on_new_subscriber ON public.subscribers;
DROP TRIGGER IF EXISTS on_new_profile ON public.profiles;

-- Recreate trigger function ONLY for Mailchimp sync (no welcome/thank-you emails)
CREATE OR REPLACE FUNCTION public.notify_new_signup_mailchimp_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  payload jsonb;
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
  
  -- Set the Mailchimp sync URL
  mailchimp_url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/mailchimp-sync';
  
  -- ONLY call Mailchimp sync function (no welcome/thank-you emails from Lovable)
  -- All marketing emails are now handled by Mailchimp's 18-day automation sequence
  PERFORM net.http_post(
    url := mailchimp_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  );
  
  RETURN NEW;
END;
$$;

-- Create new triggers that ONLY sync to Mailchimp
CREATE TRIGGER on_new_subscriber_mailchimp_only
  AFTER INSERT ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_signup_mailchimp_only();

CREATE TRIGGER on_new_profile_mailchimp_only
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_signup_mailchimp_only();

-- Add comment explaining the change
COMMENT ON FUNCTION public.notify_new_signup_mailchimp_only IS 
'Mailchimp-only sync function. Marketing/nurture emails (welcome, thank-you, newsletters) are now handled exclusively by Mailchimp''s automation sequences, not by Lovable/Supabase edge functions.';