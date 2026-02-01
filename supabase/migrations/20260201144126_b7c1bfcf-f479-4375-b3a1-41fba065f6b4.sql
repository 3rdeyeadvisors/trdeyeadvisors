-- Add unique constraint for presence upserts to work correctly
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_presence_unique_user_content 
ON public.user_presence (user_id, content_type, content_id);