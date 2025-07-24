-- Remove duplicate index on quiz_attempts table
-- Keep the more descriptive index name

-- Drop the less descriptive duplicate index
DROP INDEX IF EXISTS public.idx_quiz_attempts_user_quiz;

-- Keep idx_quiz_attempts_user_lookup as it's more descriptive and follows our naming convention

-- Also check for and clean up any other potential duplicate indexes
-- that might exist from previous migrations

-- Drop any other potential duplicates on quiz_attempts
DROP INDEX IF EXISTS public.quiz_attempts_user_quiz_idx;
DROP INDEX IF EXISTS public.idx_quiz_attempts_composite;

-- Verify the essential indexes remain in place
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lookup ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);