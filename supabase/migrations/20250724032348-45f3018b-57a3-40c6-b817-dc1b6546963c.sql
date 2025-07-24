-- Remove duplicate indexes on discussion_replies table
-- Keep the more descriptive index name

-- Drop the less descriptive duplicate index
DROP INDEX IF EXISTS public.idx_discussion_replies_discussion;

-- Keep idx_discussion_replies_discussion_id as it's more descriptive

-- Check for other potential duplicate indexes on related tables and clean up
DROP INDEX IF EXISTS public.idx_comment_likes_comment;
DROP INDEX IF EXISTS public.idx_quiz_attempts_quiz;

-- Verify essential indexes remain in place
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_user_id ON public.discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);