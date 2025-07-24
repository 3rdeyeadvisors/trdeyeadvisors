-- Add missing foreign key constraints and performance indexes

-- Add foreign key constraints for user references
ALTER TABLE public.comments ADD CONSTRAINT comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.comment_likes ADD CONSTRAINT comment_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.comment_likes ADD CONSTRAINT comment_likes_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;

ALTER TABLE public.discussions ADD CONSTRAINT discussions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.discussion_replies ADD CONSTRAINT discussion_replies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.discussion_replies ADD CONSTRAINT discussion_replies_discussion_id_fkey 
FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;

ALTER TABLE public.ratings ADD CONSTRAINT ratings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.course_progress ADD CONSTRAINT course_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_quiz_id_fkey 
FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

ALTER TABLE public.user_badges ADD CONSTRAINT user_badges_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON public.comments(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);

CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON public.discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_content ON public.discussions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON public.discussions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_user_id ON public.discussion_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_content ON public.ratings(content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON public.course_progress(course_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- Add unique constraints where needed
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
ALTER TABLE public.course_progress ADD CONSTRAINT course_progress_user_course_unique UNIQUE (user_id, course_id);