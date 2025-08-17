-- Performance optimization migration
-- Add missing indexes for hot-path tables

-- User purchases indexes for faster lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_purchases_user_id ON public.user_purchases(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_purchases_product_id ON public.user_purchases(product_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_purchases_user_product ON public.user_purchases(user_id, product_id);

-- Digital product files index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_digital_product_files_product_id ON public.digital_product_files(product_id);

-- Courses partial index for active courses
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_active ON public.courses(id) WHERE is_active = true;

-- Security audit log indexes for analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_audit_log_event_type ON public.security_audit_log(event_type);

-- Course progress indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_course_progress_course_id ON public.course_progress(course_id);

-- Comments and ratings indexes for analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_content_type_id ON public.comments(content_type, content_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ratings_content_type_id ON public.ratings(content_type, content_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ratings_created_at ON public.ratings(created_at DESC);

-- Profile indexes for faster lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Add missing triggers for counter updates
CREATE OR REPLACE FUNCTION public.update_discussion_replies_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions 
    SET replies_count = replies_count + 1 
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions 
    SET replies_count = replies_count - 1 
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Ensure trigger exists for discussion replies
DROP TRIGGER IF EXISTS update_discussion_replies_count_trigger ON public.discussion_replies;
CREATE TRIGGER update_discussion_replies_count_trigger
    AFTER INSERT OR DELETE ON public.discussion_replies
    FOR EACH ROW EXECUTE FUNCTION public.update_discussion_replies_count();

-- Ensure trigger exists for comment likes
DROP TRIGGER IF EXISTS update_comment_likes_count_trigger ON public.comment_likes;
CREATE TRIGGER update_comment_likes_count_trigger
    AFTER INSERT OR DELETE ON public.comment_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_comment_likes_count();

-- Add updated_at triggers for tables that need them
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_discussions_updated_at ON public.discussions;
CREATE TRIGGER update_discussions_updated_at
    BEFORE UPDATE ON public.discussions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_discussion_replies_updated_at ON public.discussion_replies;
CREATE TRIGGER update_discussion_replies_updated_at
    BEFORE UPDATE ON public.discussion_replies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ratings_updated_at ON public.ratings;
CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for batch profile fetching to eliminate N+1 queries
CREATE OR REPLACE FUNCTION public.get_profiles_batch(user_ids uuid[])
RETURNS TABLE(user_id uuid, display_name text, avatar_url text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT p.user_id, p.display_name, p.avatar_url
  FROM public.profiles p
  WHERE p.user_id = ANY(user_ids);
$function$;

-- Create optimized analytics functions
CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT count(*) FROM auth.users;
$function$;

CREATE OR REPLACE FUNCTION public.get_total_courses_count()
RETURNS bigint
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT count(*) FROM public.courses WHERE is_active = true;
$function$;

CREATE OR REPLACE FUNCTION public.get_average_rating()
RETURNS numeric
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT COALESCE(AVG(rating), 0) FROM public.ratings;
$function$;

-- Create cleanup function for rate limits and schedule it
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_end < now() - INTERVAL '24 hours';
END;
$function$;