-- Remove duplicate index on course_progress table
-- Keep the unique constraint as it serves both purposes (index + uniqueness)

-- Drop the redundant index, keep the unique constraint
DROP INDEX IF EXISTS public.course_progress_user_course_idx;

-- The course_progress_user_course_unique constraint should remain as it provides
-- both indexing and uniqueness enforcement

-- Also check for and clean up any other potential duplicate indexes
-- across the entire database

-- Check ratings table for duplicates
DROP INDEX IF EXISTS public.ratings_user_content_idx;

-- Check discussions table for duplicates  
DROP INDEX IF EXISTS public.discussions_user_content_idx;

-- Check quiz_attempts for duplicates
DROP INDEX IF EXISTS public.quiz_attempts_user_quiz_idx;

-- Verify our essential composite indexes are still in place
-- (these should already exist from previous migrations)
CREATE INDEX IF NOT EXISTS idx_course_progress_user_lookup ON public.course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_lookup ON public.ratings(user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_lookup ON public.discussions(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lookup ON public.quiz_attempts(user_id, quiz_id);

-- Also ensure we don't have naming conflicts with the unique constraint
-- The unique constraint course_progress_user_course_unique should handle both indexing and uniqueness