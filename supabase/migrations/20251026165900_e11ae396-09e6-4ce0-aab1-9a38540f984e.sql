-- Fix Security Definer View issue
-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.quizzes_public;

CREATE VIEW public.quizzes_public
WITH (security_invoker = true)
AS
SELECT 
  q.id,
  q.title,
  q.description,
  q.course_id,
  q.module_id,
  q.passing_score,
  q.max_attempts,
  q.time_limit,
  q.created_at,
  q.updated_at,
  -- Strip out correctAnswers and explanations from questions
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', question->>'id',
        'question', question->>'question',
        'type', question->>'type',
        'options', question->'options',
        'points', question->'points'
      )
    )
    FROM jsonb_array_elements(q.questions) as question
  ) as questions
FROM public.quizzes q;

-- Ensure proper grants
GRANT SELECT ON public.quizzes_public TO authenticated;
GRANT SELECT ON public.quizzes_public TO anon;