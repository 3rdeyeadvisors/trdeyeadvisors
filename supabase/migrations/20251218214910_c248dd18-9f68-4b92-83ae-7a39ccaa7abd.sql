-- Fix the broken auto_send_raffle_ended_notification trigger to use anon key directly
CREATE OR REPLACE FUNCTION public.auto_send_raffle_ended_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only trigger if raffle was just deactivated and has no winner yet
  IF OLD.is_active = true AND NEW.is_active = false AND NEW.winner_user_id IS NULL THEN
    -- Call edge function to send raffle ended notification using anon key
    PERFORM net.http_post(
      url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-raffle-ended',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
      ),
      body := jsonb_build_object(
        'raffle_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Also fix auto_send_winner_announcement with same issue
CREATE OR REPLACE FUNCTION public.auto_send_winner_announcement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only trigger if winner was just selected
  IF OLD.winner_user_id IS NULL AND NEW.winner_user_id IS NOT NULL THEN
    PERFORM net.http_post(
      url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-winner-announcement',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
      ),
      body := jsonb_build_object(
        'raffle_id', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Now create the referral ticket trigger
CREATE OR REPLACE FUNCTION public.award_referral_ticket()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only process if bonus_awarded is true and raffle_id exists
  IF NEW.bonus_awarded = true AND NEW.raffle_id IS NOT NULL THEN
    -- Insert a ticket for the referrer (SECURITY DEFINER bypasses RLS)
    INSERT INTO raffle_tickets (user_id, raffle_id, ticket_source, metadata)
    VALUES (
      NEW.referrer_id,
      NEW.raffle_id,
      'referral',
      jsonb_build_object('referred_user_id', NEW.referred_user_id, 'created_at', now())
    );
    
    -- Update or create the referrer's entry count
    INSERT INTO raffle_entries (user_id, raffle_id, entry_count)
    VALUES (NEW.referrer_id, NEW.raffle_id, 1)
    ON CONFLICT (raffle_id, user_id) 
    DO UPDATE SET entry_count = raffle_entries.entry_count + 1, updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on referrals table
DROP TRIGGER IF EXISTS on_referral_created ON referrals;
CREATE TRIGGER on_referral_created
  AFTER INSERT ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION award_referral_ticket();

-- Deactivate expired raffle (the one that ended Nov 24)
UPDATE raffles SET is_active = false WHERE end_date < now();

-- Create a new active raffle
INSERT INTO raffles (title, description, prize, prize_amount, start_date, end_date, is_active)
VALUES (
  'Holiday Giveaway — Bitcoin Edition',
  'Complete tasks, refer friends, and earn entries for a chance to win Bitcoin! Every referral earns you a bonus entry.',
  'Bitcoin',
  100,
  now(),
  now() + interval '30 days',
  true
);