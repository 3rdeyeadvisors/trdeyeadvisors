-- Create trigger for subscribers table to send thank you emails and notifications
CREATE OR REPLACE TRIGGER on_subscriber_created
  AFTER INSERT ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_signup();

-- Create trigger for profiles table to send welcome emails and notifications  
CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_signup();