-- Create function to automatically send raffle ended notification
CREATE OR REPLACE FUNCTION public.auto_send_raffle_ended_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger if raffle was just deactivated and has no winner yet
  IF OLD.is_active = true AND NEW.is_active = false AND NEW.winner_user_id IS NULL THEN
    -- Call edge function to send raffle ended notification
    PERFORM net.http_post(
      url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-raffle-ended',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
      ),
      body := jsonb_build_object(
        'raffle_id', NEW.id
      )
    );
    
    RAISE NOTICE 'Raffle ended notification triggered for raffle: %', NEW.title;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for raffle ended notification
DROP TRIGGER IF EXISTS trigger_raffle_ended_notification ON public.raffles;
CREATE TRIGGER trigger_raffle_ended_notification
  AFTER UPDATE ON public.raffles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_send_raffle_ended_notification();

-- Create function to automatically send winner announcement
CREATE OR REPLACE FUNCTION public.auto_send_winner_announcement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger if winner was just selected (changed from NULL to a value)
  IF OLD.winner_user_id IS NULL AND NEW.winner_user_id IS NOT NULL THEN
    -- Call edge function to send winner announcement
    PERFORM net.http_post(
      url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-winner-announcement',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
      ),
      body := jsonb_build_object(
        'raffle_id', NEW.id
      )
    );
    
    RAISE NOTICE 'Winner announcement triggered for raffle: %', NEW.title;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for winner announcement
DROP TRIGGER IF EXISTS trigger_winner_announcement ON public.raffles;
CREATE TRIGGER trigger_winner_announcement
  AFTER UPDATE ON public.raffles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_send_winner_announcement();

COMMENT ON FUNCTION public.auto_send_raffle_ended_notification() IS 'Automatically sends email notification to all participants when a raffle is deactivated';
COMMENT ON FUNCTION public.auto_send_winner_announcement() IS 'Automatically sends email announcement when a raffle winner is selected';