-- Fix 1: Drop insecure public_profiles view (get_profiles_batch function already exists and is secure)
DROP VIEW IF EXISTS public_profiles;

-- Fix 2: Update handle_grandfathered_user to require email confirmation
CREATE OR REPLACE FUNCTION public.handle_grandfathered_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  grandfathered_record RECORD;
BEGIN
  -- SECURITY: Only process if email is confirmed to prevent claim attacks
  IF NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check if email is in grandfathered list
  SELECT * INTO grandfathered_record
  FROM public.grandfathered_emails
  WHERE LOWER(email) = LOWER(NEW.email)
    AND claimed_at IS NULL;
  
  -- If found, grant access to all paid courses
  IF grandfathered_record.id IS NOT NULL THEN
    INSERT INTO public.user_purchases (user_id, product_id, amount_paid)
    VALUES 
      (NEW.id, 3, 0),
      (NEW.id, 4, 0)
    ON CONFLICT DO NOTHING;
    
    UPDATE public.grandfathered_emails
    SET claimed_at = now(), claimed_by = NEW.id
    WHERE id = grandfathered_record.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix 3: Drop insecure quizzes_public view and recreate with auth requirement
DROP VIEW IF EXISTS quizzes_public;

CREATE OR REPLACE VIEW quizzes_public AS
SELECT 
  quizzes.id,
  quizzes.course_id,
  quizzes.module_id,
  quizzes.title,
  quizzes.description,
  quizzes.passing_score,
  quizzes.time_limit,
  quizzes.max_attempts,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', q.value->>'id',
        'question', q.value->>'question',
        'options', q.value->'options',
        'explanation', q.value->>'explanation'
      )
    )
    FROM jsonb_array_elements(quizzes.questions) AS q(value)
  ) AS questions,
  quizzes.created_at,
  quizzes.updated_at
FROM quizzes
WHERE auth.uid() IS NOT NULL;