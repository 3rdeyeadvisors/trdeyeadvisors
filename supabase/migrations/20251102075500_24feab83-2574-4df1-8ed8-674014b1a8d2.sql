-- Add unique constraint to ratings table to prevent duplicate ratings
-- This allows users to update their ratings instead of creating duplicates
ALTER TABLE public.ratings 
ADD CONSTRAINT ratings_user_content_unique 
UNIQUE (user_id, content_id, content_type);

-- Add unique constraint to comment_likes to prevent duplicate likes
-- Check if constraint exists first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'comment_likes_user_comment_unique'
    ) THEN
        ALTER TABLE public.comment_likes 
        ADD CONSTRAINT comment_likes_user_comment_unique 
        UNIQUE (user_id, comment_id);
    END IF;
END $$;