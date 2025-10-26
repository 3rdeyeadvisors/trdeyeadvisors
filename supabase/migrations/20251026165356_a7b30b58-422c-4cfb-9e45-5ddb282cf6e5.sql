-- Fix Quiz Answers Exposure
-- Create a view that excludes correct answers and explanations
CREATE OR REPLACE VIEW public.quizzes_public AS
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

-- Update RLS policy to restrict full quiz access to admins only
DROP POLICY IF EXISTS "Quizzes are viewable by everyone" ON public.quizzes;

CREATE POLICY "Only admins can view full quizzes with answers"
ON public.quizzes
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Grant access to the public view for all authenticated users
GRANT SELECT ON public.quizzes_public TO authenticated;
GRANT SELECT ON public.quizzes_public TO anon;