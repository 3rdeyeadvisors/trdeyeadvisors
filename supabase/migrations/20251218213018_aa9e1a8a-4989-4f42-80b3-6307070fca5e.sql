-- Add admin policy for course_progress so instructors can monitor student progress
CREATE POLICY "Admins can view all course progress"
ON public.course_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment to document security decisions
COMMENT ON VIEW public.quizzes_public IS 'Public view of quizzes that strips correct_answer field from questions for security. Only exposes question text, type, options, and points.';