-- Fix the trigger issues - recreate them properly

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_subscriber_created ON public.subscribers;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Recreate triggers with proper configuration
CREATE TRIGGER on_subscriber_created
  AFTER INSERT ON public.subscribers
  FOR EACH ROW 
  EXECUTE FUNCTION public.notify_new_signup();

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.notify_new_signup();