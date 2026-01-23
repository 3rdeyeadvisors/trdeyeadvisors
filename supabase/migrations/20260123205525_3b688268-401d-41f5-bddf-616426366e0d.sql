-- Premium content announcements tracking
CREATE TABLE public.premium_content_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('course', 'vault', 'resource', 'feature')),
  content_id text NOT NULL,
  title text NOT NULL,
  description text,
  early_access_date timestamptz,
  public_release_date timestamptz,
  announcement_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_content_announcements ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage announcements
CREATE POLICY "Admins can manage premium announcements"
  ON public.premium_content_announcements
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to view announcements
CREATE POLICY "Authenticated users can view announcements"
  ON public.premium_content_announcements
  FOR SELECT
  TO authenticated
  USING (true);

-- Roadmap items for platform input feature
CREATE TABLE public.roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'proposed' CHECK (status IN ('proposed', 'in_progress', 'completed', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage roadmap items
CREATE POLICY "Admins can manage roadmap items"
  ON public.roadmap_items
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to view roadmap items
CREATE POLICY "Authenticated users can view roadmap items"
  ON public.roadmap_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Roadmap votes with weighted voting for founding members
CREATE TABLE public.roadmap_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_item_id uuid REFERENCES roadmap_items(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  vote_weight int DEFAULT 1, -- 3 for founding members
  created_at timestamptz DEFAULT now(),
  UNIQUE(roadmap_item_id, user_id)
);

-- Enable RLS
ALTER TABLE public.roadmap_votes ENABLE ROW LEVEL SECURITY;

-- Allow users to view all votes
CREATE POLICY "Authenticated users can view votes"
  ON public.roadmap_votes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to manage their own votes
CREATE POLICY "Users can manage their own votes"
  ON public.roadmap_votes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create update timestamp trigger for announcements
CREATE TRIGGER update_premium_content_announcements_updated_at
  BEFORE UPDATE ON public.premium_content_announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create update timestamp trigger for roadmap
CREATE TRIGGER update_roadmap_items_updated_at
  BEFORE UPDATE ON public.roadmap_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();