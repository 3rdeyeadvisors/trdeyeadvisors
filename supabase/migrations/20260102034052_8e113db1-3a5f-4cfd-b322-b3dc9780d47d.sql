-- Fix: Recreate quizzes_public with SECURITY INVOKER (not DEFINER)
DROP VIEW IF EXISTS quizzes_public;

CREATE VIEW quizzes_public 
WITH (security_invoker = true)
AS
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