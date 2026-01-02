-- Fix 2: Recreate quizzes_public view with SECURITY INVOKER
-- This view intentionally strips answers for public quiz display

DROP VIEW IF EXISTS public.quizzes_public;

CREATE VIEW public.quizzes_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  course_id,
  module_id,
  title,
  description,
  passing_score,
  time_limit,
  max_attempts,
  -- Strip correct_answer from questions for public view
  jsonb_agg(
    jsonb_build_object(
      'id', q->>'id',
      'question', q->>'question',
      'options', q->'options',
      'explanation', q->>'explanation'
    )
  ) as questions,
  created_at,
  updated_at
FROM public.quizzes,
     jsonb_array_elements(questions) AS q
GROUP BY id, course_id, module_id, title, description, passing_score, time_limit, max_attempts, created_at, updated_at;

-- Grant SELECT to authenticated users only (not anon - quizzes require login)
GRANT SELECT ON public.quizzes_public TO authenticated;

COMMENT ON VIEW public.quizzes_public IS 'Public quiz view that strips correct answers. Uses SECURITY INVOKER for proper permission checking.';