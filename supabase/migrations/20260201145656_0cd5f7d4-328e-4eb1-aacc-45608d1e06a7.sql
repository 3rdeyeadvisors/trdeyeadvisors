-- Create a function to auto-call the roadmap notification edge function
CREATE OR REPLACE FUNCTION public.notify_new_roadmap_item()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Call edge function to send notification email
  PERFORM net.http_post(
    url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-roadmap-item-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o'
    ),
    body := jsonb_build_object('item_id', NEW.id)
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger to auto-notify on new roadmap items
CREATE TRIGGER trigger_notify_new_roadmap_item
  AFTER INSERT ON public.roadmap_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_roadmap_item();