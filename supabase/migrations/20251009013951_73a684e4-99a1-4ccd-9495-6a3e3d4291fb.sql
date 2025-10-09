-- Create function to get user emails with profiles
CREATE OR REPLACE FUNCTION public.get_user_emails_with_profiles()
RETURNS TABLE (
  user_id uuid,
  email text,
  display_name text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    u.email,
    p.display_name,
    u.created_at
  FROM public.profiles p
  INNER JOIN auth.users u ON p.user_id = u.id
  ORDER BY u.created_at DESC;
$$;