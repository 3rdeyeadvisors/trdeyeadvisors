-- Update the user_has_purchased_course function to give admins free access
CREATE OR REPLACE FUNCTION public.user_has_purchased_course(course_id integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is an admin - admins get free access to all courses
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ) THEN
    RETURN true;
  END IF;

  -- Check if course is free
  IF EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND category = 'free') THEN
    RETURN true;
  END IF;
  
  -- Check if user has purchased the course
  RETURN EXISTS (
    SELECT 1 FROM public.user_purchases 
    WHERE user_id = auth.uid() AND product_id = course_id
  );
END;
$function$;