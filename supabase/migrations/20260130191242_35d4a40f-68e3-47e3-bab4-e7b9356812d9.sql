-- Fix Issue #1: Quiz Answer Exposure
-- Remove explanation field from public view to prevent answer hints leaking

DROP VIEW IF EXISTS public.quizzes_public;

CREATE OR REPLACE VIEW public.quizzes_public
WITH (security_invoker = on)
AS SELECT 
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
                'options', q.value -> 'options'
                -- explanation intentionally removed for security
            )
        )
        FROM jsonb_array_elements(quizzes.questions) q(value)
    ) AS questions,
    created_at,
    updated_at
FROM quizzes
WHERE auth.uid() IS NOT NULL;

-- Grant access to authenticated users only
GRANT SELECT ON public.quizzes_public TO authenticated;