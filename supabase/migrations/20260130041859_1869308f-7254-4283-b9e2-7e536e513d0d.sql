
-- Fix quizzes_public view to use SECURITY INVOKER instead of DEFINER
DROP VIEW IF EXISTS public.quizzes_public;

CREATE VIEW public.quizzes_public
WITH (security_invoker = on)
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
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', q.value ->> 'id',
        'question', q.value ->> 'question',
        'options', q.value -> 'options',
        'explanation', q.value ->> 'explanation'
      )
    )
    FROM jsonb_array_elements(quizzes.questions) q(value)
  ) AS questions,
  created_at,
  updated_at
FROM quizzes
WHERE auth.uid() IS NOT NULL;

-- Grant access to authenticated users
GRANT SELECT ON public.quizzes_public TO authenticated;

COMMENT ON VIEW public.quizzes_public IS 'Public view of quizzes that strips correct answers. Uses SECURITY INVOKER to respect RLS policies.';
