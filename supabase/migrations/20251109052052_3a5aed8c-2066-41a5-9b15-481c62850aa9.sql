-- Create raffles table
CREATE TABLE public.raffles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  prize text NOT NULL,
  prize_amount numeric NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  winner_user_id uuid REFERENCES auth.users(id),
  winner_selected_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create raffle_entries table
CREATE TABLE public.raffle_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id uuid NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(raffle_id, user_id)
);

-- Create raffle_tasks table to track user completion
CREATE TABLE public.raffle_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id uuid NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(raffle_id, user_id, task_type)
);

-- Create referrals table for bonus entries
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raffle_id uuid REFERENCES public.raffles(id) ON DELETE SET NULL,
  bonus_awarded boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_user_id)
);

-- Enable RLS
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for raffles
CREATE POLICY "Raffles are viewable by everyone"
ON public.raffles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage raffles"
ON public.raffles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for raffle_entries
CREATE POLICY "Users can view their own entries"
ON public.raffle_entries FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all entries"
ON public.raffle_entries FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create entries"
ON public.raffle_entries FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update entries"
ON public.raffle_entries FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for raffle_tasks
CREATE POLICY "Users can view their own tasks"
ON public.raffle_tasks FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tasks"
ON public.raffle_tasks FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own tasks"
ON public.raffle_tasks FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tasks"
ON public.raffle_tasks FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals"
ON public.referrals FOR SELECT
TO authenticated
USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Admins can view all referrals"
ON public.referrals FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create referrals"
ON public.referrals FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_raffle_entries_user ON public.raffle_entries(user_id);
CREATE INDEX idx_raffle_entries_raffle ON public.raffle_entries(raffle_id);
CREATE INDEX idx_raffle_tasks_user ON public.raffle_tasks(user_id);
CREATE INDEX idx_raffle_tasks_raffle ON public.raffle_tasks(raffle_id);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_user_id);

-- Create updated_at trigger
CREATE TRIGGER update_raffles_updated_at
  BEFORE UPDATE ON public.raffles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_raffle_entries_updated_at
  BEFORE UPDATE ON public.raffle_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();