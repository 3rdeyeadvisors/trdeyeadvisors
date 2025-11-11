-- Create table to track individual raffle tickets with sources
CREATE TABLE IF NOT EXISTS public.raffle_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  ticket_source TEXT NOT NULL, -- 'participation', 'verification', 'tutorial', 'purchase', 'referral'
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  task_id UUID REFERENCES public.raffle_tasks(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.raffle_tickets ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets"
  ON public.raffle_tickets
  FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
  ON public.raffle_tickets
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert tickets
CREATE POLICY "System can insert tickets"
  ON public.raffle_tickets
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_raffle_tickets_user_raffle ON public.raffle_tickets(user_id, raffle_id);
CREATE INDEX idx_raffle_tickets_source ON public.raffle_tickets(ticket_source);

-- Function to sync ticket count with raffle_entries
CREATE OR REPLACE FUNCTION sync_raffle_entry_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the entry_count in raffle_entries based on ticket count
  INSERT INTO public.raffle_entries (user_id, raffle_id, entry_count)
  VALUES (NEW.user_id, NEW.raffle_id, 1)
  ON CONFLICT (user_id, raffle_id)
  DO UPDATE SET 
    entry_count = raffle_entries.entry_count + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update entry counts
CREATE TRIGGER sync_entry_count_on_ticket_insert
  AFTER INSERT ON public.raffle_tickets
  FOR EACH ROW
  EXECUTE FUNCTION sync_raffle_entry_count();