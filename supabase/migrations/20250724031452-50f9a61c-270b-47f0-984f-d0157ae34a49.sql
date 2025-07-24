-- Remove foreign key constraints to auth.users (Supabase managed schema)
-- and restructure to use profiles table instead

-- Drop the problematic foreign key constraints to auth.users
ALTER TABLE public.course_progress DROP CONSTRAINT IF EXISTS course_progress_user_id_fkey;
ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_user_id_fkey;
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE public.comment_likes DROP CONSTRAINT IF EXISTS comment_likes_user_id_fkey;
ALTER TABLE public.discussions DROP CONSTRAINT IF EXISTS discussions_user_id_fkey;
ALTER TABLE public.discussion_replies DROP CONSTRAINT IF EXISTS discussion_replies_user_id_fkey;
ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE public.user_badges DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Keep only the internal public schema foreign keys that are safe
-- comment_likes -> comments is fine (both in public schema)
-- discussion_replies -> discussions is fine (both in public schema)  
-- quiz_attempts -> quizzes is fine (both in public schema)

-- Add proper indexes for user_id columns (without foreign key constraints to auth.users)
-- These will still provide performance benefits for queries
CREATE INDEX IF NOT EXISTS idx_course_progress_user_lookup ON public.course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_lookup ON public.ratings(user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_lookup ON public.comments(user_id, content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_lookup ON public.discussions(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lookup ON public.quiz_attempts(user_id, quiz_id);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_course_progress_completion ON public.course_progress(user_id, completion_percentage);
CREATE INDEX IF NOT EXISTS idx_ratings_content_avg ON public.ratings(content_type, content_id, rating);
CREATE INDEX IF NOT EXISTS idx_comments_recent ON public.comments(content_type, content_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_active ON public.discussions(content_type, created_at DESC, replies_count);

-- Optimize the profiles table structure
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Add check constraints for data validation (instead of foreign keys)
ALTER TABLE public.course_progress ADD CONSTRAINT check_valid_completion_percentage 
CHECK (completion_percentage >= 0 AND completion_percentage <= 100);

ALTER TABLE public.ratings ADD CONSTRAINT check_valid_rating 
CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE public.quiz_attempts ADD CONSTRAINT check_valid_score 
CHECK (score >= 0);

-- Add NOT NULL constraints where appropriate for performance
ALTER TABLE public.course_progress ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.ratings ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.comments ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.comment_likes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.discussions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.discussion_replies ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.quiz_attempts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_badges ALTER COLUMN user_id SET NOT NULL;