-- Add is_bot column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_bot boolean NOT NULL DEFAULT false;

-- Create bot_config table for personality settings
CREATE TABLE public.bot_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  personality_type text NOT NULL CHECK (personality_type IN ('aggressive', 'steady', 'casual', 'low_activity')),
  max_point_percentage numeric NOT NULL CHECK (max_point_percentage > 0 AND max_point_percentage <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on bot_config
ALTER TABLE public.bot_config ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can access bot_config
CREATE POLICY "Admins can view bot config"
  ON public.bot_config
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage bot config"
  ON public.bot_config
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Create index for faster lookups
CREATE INDEX idx_profiles_is_bot ON public.profiles(is_bot) WHERE is_bot = true;
CREATE INDEX idx_bot_config_user_id ON public.bot_config(user_id);

-- Update the get_points_leaderboard function to include bots (they should appear on leaderboard)
-- But we'll exclude them from rewards in the processing function