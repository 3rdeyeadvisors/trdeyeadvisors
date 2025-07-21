-- Enable the email hook for password reset
-- This allows us to send custom branded emails for password resets
CREATE OR REPLACE FUNCTION public.send_custom_password_reset_email()
RETURNS TRIGGER AS $$
DECLARE
  reset_url TEXT;
  user_email TEXT;
BEGIN
  -- Only handle password recovery events
  IF NEW.email_action_type = 'recovery' THEN
    -- Get the user email
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
    
    -- Construct the reset URL with the token
    reset_url := NEW.redirect_to || '&token_hash=' || NEW.token_hash || '&type=recovery';
    
    -- Call our edge function to send the branded email
    PERFORM net.http_post(
      url := current_setting('app.settings.functions_url') || '/send-password-reset',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'email', user_email,
        'resetUrl', reset_url
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;