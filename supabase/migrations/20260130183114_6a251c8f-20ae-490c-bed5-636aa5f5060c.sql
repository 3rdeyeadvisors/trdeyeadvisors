-- Add vote_type column to roadmap_votes for yes/no voting
ALTER TABLE public.roadmap_votes 
ADD COLUMN vote_type text NOT NULL DEFAULT 'yes' 
CHECK (vote_type IN ('yes', 'no'));