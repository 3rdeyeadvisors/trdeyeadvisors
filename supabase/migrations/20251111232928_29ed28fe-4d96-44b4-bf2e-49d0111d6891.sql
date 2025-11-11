-- Enable realtime for raffle tables so users get instant updates

-- Enable realtime on raffle_entries table
ALTER TABLE public.raffle_entries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.raffle_entries;

-- Enable realtime on raffle_tasks table
ALTER TABLE public.raffle_tasks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.raffle_tasks;

-- Enable realtime on raffles table
ALTER TABLE public.raffles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.raffles;