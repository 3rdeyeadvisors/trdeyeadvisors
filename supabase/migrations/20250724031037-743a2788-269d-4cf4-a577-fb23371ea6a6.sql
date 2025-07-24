-- First clean up orphaned data, then add performance optimizations

-- Clean up orphaned data in tables that reference auth.users
DELETE FROM public.quiz_attempts 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.comment_likes 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.discussions 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.discussion_replies 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.ratings 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.course_progress 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_badges 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Now add the missing foreign key constraints
DO $$
BEGIN
    -- Add comment_likes constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'comment_likes' 
        AND constraint_name = 'comment_likes_user_id_fkey'
    ) THEN
        ALTER TABLE public.comment_likes ADD CONSTRAINT comment_likes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'comment_likes' 
        AND constraint_name = 'comment_likes_comment_id_fkey'
    ) THEN
        ALTER TABLE public.comment_likes ADD CONSTRAINT comment_likes_comment_id_fkey 
        FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;
    END IF;

    -- Add discussions constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'discussions' 
        AND constraint_name = 'discussions_user_id_fkey'
    ) THEN
        ALTER TABLE public.discussions ADD CONSTRAINT discussions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add discussion_replies constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'discussion_replies' 
        AND constraint_name = 'discussion_replies_user_id_fkey'
    ) THEN
        ALTER TABLE public.discussion_replies ADD CONSTRAINT discussion_replies_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'discussion_replies' 
        AND constraint_name = 'discussion_replies_discussion_id_fkey'
    ) THEN
        ALTER TABLE public.discussion_replies ADD CONSTRAINT discussion_replies_discussion_id_fkey 
        FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;
    END IF;

    -- Add ratings constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'ratings' 
        AND constraint_name = 'ratings_user_id_fkey'
    ) THEN
        ALTER TABLE public.ratings ADD CONSTRAINT ratings_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add course_progress constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'course_progress' 
        AND constraint_name = 'course_progress_user_id_fkey'
    ) THEN
        ALTER TABLE public.course_progress ADD CONSTRAINT course_progress_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add quiz_attempts constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'quiz_attempts' 
        AND constraint_name = 'quiz_attempts_user_id_fkey'
    ) THEN
        ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'quiz_attempts' 
        AND constraint_name = 'quiz_attempts_quiz_id_fkey'
    ) THEN
        ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_quiz_id_fkey 
        FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
    END IF;

    -- Add user_badges constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'user_badges' 
        AND constraint_name = 'user_badges_user_id_fkey'
    ) THEN
        ALTER TABLE public.user_badges ADD CONSTRAINT user_badges_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add profiles constraints if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'profiles' 
        AND constraint_name = 'profiles_user_id_fkey'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

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
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'profiles' 
        AND constraint_name = 'profiles_user_id_unique'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'course_progress' 
        AND constraint_name = 'course_progress_user_course_unique'
    ) THEN
        ALTER TABLE public.course_progress ADD CONSTRAINT course_progress_user_course_unique UNIQUE (user_id, course_id);
    END IF;
END $$;