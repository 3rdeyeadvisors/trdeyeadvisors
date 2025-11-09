-- Add social media username fields and verification status to raffle_tasks
ALTER TABLE public.raffle_tasks 
ADD COLUMN instagram_username TEXT,
ADD COLUMN x_username TEXT,
ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'submitted', 'verified', 'rejected'));

-- Add index for faster verification queries
CREATE INDEX idx_raffle_tasks_verification ON public.raffle_tasks(verification_status) WHERE verification_status = 'submitted';

-- Create function to send notification when username is submitted
CREATE OR REPLACE FUNCTION notify_username_submission()
RETURNS TRIGGER AS $$
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
    PERFORM net.http_post(
      url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-username-verification-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for username submission
CREATE TRIGGER on_username_submitted
  AFTER INSERT OR UPDATE ON public.raffle_tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_username_submission();

-- Add comment for documentation
COMMENT ON COLUMN public.raffle_tasks.instagram_username IS 'Instagram username submitted by user for verification';
COMMENT ON COLUMN public.raffle_tasks.x_username IS 'X (Twitter) username submitted by user for verification';
COMMENT ON COLUMN public.raffle_tasks.verification_status IS 'Verification status: pending (not submitted), submitted (awaiting admin review), verified (approved), rejected (denied)';
