-- Alternative: Create a custom password validation function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Basic password strength validation
  -- At least 8 characters, contains uppercase, lowercase, and number
  RETURN (
    LENGTH(password) >= 8 AND
    password ~ '[A-Z]' AND
    password ~ '[a-z]' AND
    password ~ '[0-9]'
  );
END;
$$;

-- Create a trigger to enforce password policies (if needed)
COMMENT ON FUNCTION public.validate_password_strength(TEXT) IS 'Validates password meets minimum security requirements';