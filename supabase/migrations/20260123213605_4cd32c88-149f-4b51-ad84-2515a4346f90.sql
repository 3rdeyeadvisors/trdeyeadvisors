-- Add voting_ends_at column to roadmap_items
ALTER TABLE public.roadmap_items 
ADD COLUMN IF NOT EXISTS voting_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days');

-- Update existing items to have a voting deadline (7 days from now for active items)
UPDATE public.roadmap_items 
SET voting_ends_at = now() + interval '7 days' 
WHERE voting_ends_at IS NULL AND status = 'proposed';

-- Create table to track sent reminders and prevent duplicates
CREATE TABLE IF NOT EXISTS public.roadmap_reminder_sent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_item_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'created', '3-day', '24-hour'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(roadmap_item_id, reminder_type)
);

-- Enable RLS on roadmap_reminder_sent
ALTER TABLE public.roadmap_reminder_sent ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage reminders (edge functions will use service role)
CREATE POLICY "Service role can manage reminders"
ON public.roadmap_reminder_sent
FOR ALL
USING (true)
WITH CHECK (true);