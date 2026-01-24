-- Allow anonymous users to view roadmap items
CREATE POLICY "Anyone can view roadmap items"
  ON public.roadmap_items
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to view vote counts
CREATE POLICY "Anyone can view votes"
  ON public.roadmap_votes
  FOR SELECT
  TO anon
  USING (true);