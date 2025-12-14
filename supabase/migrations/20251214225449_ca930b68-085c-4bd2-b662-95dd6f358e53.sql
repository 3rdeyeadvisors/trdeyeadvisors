-- Create grandfathered_emails table
CREATE TABLE public.grandfathered_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  access_type text DEFAULT 'full_platform',
  expires_at timestamp with time zone,
  claimed_at timestamp with time zone,
  claimed_by uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.grandfathered_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage grandfathered emails
CREATE POLICY "Only admins can view grandfathered emails"
  ON public.grandfathered_emails FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can manage grandfathered emails"
  ON public.grandfathered_emails FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to auto-grant access when grandfathered user signs up
CREATE OR REPLACE FUNCTION public.handle_grandfathered_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  grandfathered_record RECORD;
BEGIN
  -- Check if email is in grandfathered list
  SELECT * INTO grandfathered_record
  FROM public.grandfathered_emails
  WHERE LOWER(email) = LOWER(NEW.email)
    AND claimed_at IS NULL;
  
  -- If found, grant access to all paid courses
  IF grandfathered_record.id IS NOT NULL THEN
    -- Insert purchases for courses 3 and 4 (the previously paid courses)
    INSERT INTO public.user_purchases (user_id, product_id, amount_paid)
    VALUES 
      (NEW.id, 3, 0),
      (NEW.id, 4, 0)
    ON CONFLICT DO NOTHING;
    
    -- Mark as claimed
    UPDATE public.grandfathered_emails
    SET claimed_at = now(), claimed_by = NEW.id
    WHERE id = grandfathered_record.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_grandfathered_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_grandfathered_user();

-- Insert the grandfathered emails
INSERT INTO public.grandfathered_emails (email) VALUES
  ('nessmoreno91@icloud.com'),
  ('divontebush8@gmail.com'),
  ('karla970@icloud.com'),
  ('jessgem143@yahoo.com'),
  ('lenoirdestiny24@gmail.com'),
  ('ashleywalther56@gmail.com'),
  ('laehdz1987@gmail.com'),
  ('gcarlosjr1988@gmail.com'),
  ('celso.martinez1981@outlook.com'),
  ('jonsaks@hotmail.com'),
  ('wcrumbley7@gmail.com'),
  ('clarissa.flores022197@gmail.com'),
  ('jaxel7149@gmail.com'),
  ('ailema88@icloud.com'),
  ('fink_williams@yahoo.com');