-- Remove duplicate indexes to improve performance
-- Keep the more descriptive index name and drop duplicates

-- Drop duplicate indexes on comments table
DROP INDEX IF EXISTS public.idx_comments_user;

-- Check for and remove other potential duplicate indexes across all tables
-- Keep the more specific/descriptive index names

-- Comments table - keep the descriptive ones
DROP INDEX IF EXISTS public.idx_comments_user_id;
-- Keep idx_comments_user_lookup which is more specific (user_id, content_type, content_id)

-- Check other tables for potential duplicates and clean up
DROP INDEX IF EXISTS public.idx_comment_likes_user;
DROP INDEX IF EXISTS public.idx_discussions_user;  
DROP INDEX IF EXISTS public.idx_discussion_replies_user;
DROP INDEX IF EXISTS public.idx_ratings_user;
DROP INDEX IF EXISTS public.idx_course_progress_user;
DROP INDEX IF EXISTS public.idx_quiz_attempts_user;
DROP INDEX IF EXISTS public.idx_user_badges_user;

-- Keep only the optimized composite indexes we created:
-- idx_comments_user_lookup (user_id, content_type, content_id)
-- idx_ratings_user_lookup (user_id, content_type, content_id)  
-- idx_discussions_user_lookup (user_id, content_type)
-- idx_course_progress_user_lookup (user_id, course_id)
-- idx_quiz_attempts_user_lookup (user_id, quiz_id)
-- etc.

-- Verify we have the essential indexes in place (these should already exist)
CREATE INDEX IF NOT EXISTS idx_comments_user_lookup ON public.comments(user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_lookup ON public.discussions(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_user_id ON public.discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_lookup ON public.ratings(user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_lookup ON public.course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lookup ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);