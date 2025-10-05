-- Optimize RLS Policies for Performance Advisor Warnings
-- Wraps all auth.uid() and has_role() calls in SELECT statements
-- This ensures functions are called once per statement, not per row

-- ============================================================================
-- COMMENT_LIKES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can create comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON public.comment_likes;

CREATE POLICY "Users can create comment likes"
ON public.comment_likes
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own comment likes"
ON public.comment_likes
FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

CREATE POLICY "Users can create comments"
ON public.comments
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own comments"
ON public.comments
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own comments"
ON public.comments
FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- CONTACT_SUBMISSIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Only admins can view contact data" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can modify contact data" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can delete contact data" ON public.contact_submissions;

CREATE POLICY "Only admins can view contact data"
ON public.contact_submissions
FOR SELECT
USING ((SELECT has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Only admins can modify contact data"
ON public.contact_submissions
FOR UPDATE
USING ((SELECT has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Only admins can delete contact data"
ON public.contact_submissions
FOR DELETE
USING ((SELECT has_role(auth.uid(), 'admin'::app_role)));

-- ============================================================================
-- COURSE_PROGRESS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.course_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.course_progress;

CREATE POLICY "Users can view their own progress"
ON public.course_progress
FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own progress"
ON public.course_progress
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own progress"
ON public.course_progress
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- DIGITAL_PRODUCT_FILES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Authenticated users can view purchased product files" ON public.digital_product_files;
DROP POLICY IF EXISTS "System can manage digital product files" ON public.digital_product_files;

CREATE POLICY "Authenticated users can view purchased product files"
ON public.digital_product_files
FOR SELECT
USING (
  (SELECT auth.uid()) IS NOT NULL 
  AND (
    EXISTS (
      SELECT 1
      FROM user_purchases
      WHERE user_purchases.user_id = (SELECT auth.uid())
        AND user_purchases.product_id = digital_product_files.product_id
    )
    OR EXISTS (
      SELECT 1
      FROM user_roles
      WHERE user_roles.user_id = (SELECT auth.uid())
        AND user_roles.role = 'admin'::app_role
    )
  )
);

CREATE POLICY "System can manage digital product files"
ON public.digital_product_files
FOR ALL
USING (
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) 
  OR (SELECT has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) 
  OR (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- ============================================================================
-- DISCUSSION_REPLIES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can create discussion replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can update their own discussion replies" ON public.discussion_replies;

CREATE POLICY "Users can create discussion replies"
ON public.discussion_replies
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own discussion replies"
ON public.discussion_replies
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- DISCUSSIONS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can create discussions" ON public.discussions;
DROP POLICY IF EXISTS "Users can update their own discussions" ON public.discussions;

CREATE POLICY "Users can create discussions"
ON public.discussions
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own discussions"
ON public.discussions
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- PRINTIFY_ORDERS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own orders" ON public.printify_orders;

CREATE POLICY "Users can view their own orders"
ON public.printify_orders
FOR SELECT
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- QUIZ_ATTEMPTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Users can update their own quiz attempts" ON public.quiz_attempts;

CREATE POLICY "Users can view their own quiz attempts"
ON public.quiz_attempts
FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own quiz attempts"
ON public.quiz_attempts
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own quiz attempts"
ON public.quiz_attempts
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- RATINGS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can create ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.ratings;

CREATE POLICY "Users can create ratings"
ON public.ratings
FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own ratings"
ON public.ratings
FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own ratings"
ON public.ratings
FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- USER_BADGES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Only service_role and admins can create user badges" ON public.user_badges;

CREATE POLICY "Only service_role and admins can create user badges"
ON public.user_badges
FOR INSERT
WITH CHECK (
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) 
  OR (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- ============================================================================
-- USER_PURCHASES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;

CREATE POLICY "Users can view their own purchases"
ON public.user_purchases
FOR SELECT
USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- USER_ROLES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
USING ((SELECT has_role(auth.uid(), 'admin'::app_role)));

-- ============================================================================
-- SUBSCRIBERS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Only verified admins can view subscribers" ON public.subscribers;

CREATE POLICY "Only verified admins can view subscribers"
ON public.subscribers
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_roles.user_id = (SELECT auth.uid())
      AND user_roles.role = 'admin'::app_role
  )
);