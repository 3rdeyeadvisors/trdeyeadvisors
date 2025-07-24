-- Fix RLS policy performance by using (select auth.uid()) instead of auth.uid()
-- This prevents re-evaluation for each row

-- Drop existing policies and recreate with optimized versions
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can create ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can create comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can create discussions" ON public.discussions;
DROP POLICY IF EXISTS "Users can update their own discussions" ON public.discussions;
DROP POLICY IF EXISTS "Users can create discussion replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can update their own discussion replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can update their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.printify_orders;

-- Recreate optimized policies using (select auth.uid())

-- Profiles policies
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Course progress policies  
CREATE POLICY "Users can view their own progress" ON public.course_progress
FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own progress" ON public.course_progress
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own progress" ON public.course_progress
FOR UPDATE USING (user_id = (select auth.uid()));

-- Ratings policies
CREATE POLICY "Users can create ratings" ON public.ratings
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own ratings" ON public.ratings
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own ratings" ON public.ratings
FOR DELETE USING (user_id = (select auth.uid()));

-- Comments policies
CREATE POLICY "Users can create comments" ON public.comments
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own comments" ON public.comments
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own comments" ON public.comments
FOR DELETE USING (user_id = (select auth.uid()));

-- Comment likes policies
CREATE POLICY "Users can create comment likes" ON public.comment_likes
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own comment likes" ON public.comment_likes
FOR DELETE USING (user_id = (select auth.uid()));

-- Discussions policies
CREATE POLICY "Users can create discussions" ON public.discussions
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own discussions" ON public.discussions
FOR UPDATE USING (user_id = (select auth.uid()));

-- Discussion replies policies
CREATE POLICY "Users can create discussion replies" ON public.discussion_replies
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own discussion replies" ON public.discussion_replies
FOR UPDATE USING (user_id = (select auth.uid()));

-- Quiz attempts policies
CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts
FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own quiz attempts" ON public.quiz_attempts
FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
FOR SELECT USING (user_id = (select auth.uid()));

-- User purchases policies
CREATE POLICY "Users can view their own purchases" ON public.user_purchases
FOR SELECT USING (user_id = (select auth.uid()));

-- Printify orders policies
CREATE POLICY "Users can view their own orders" ON public.printify_orders
FOR SELECT USING (user_id = (select auth.uid()));