-- Create a public storage bucket for social banners
INSERT INTO storage.buckets (id, name, public) VALUES ('social-banners', 'social-banners', true);

-- Create policies for the social banners bucket
CREATE POLICY "Anyone can view social banners" ON storage.objects FOR SELECT USING (bucket_id = 'social-banners');

CREATE POLICY "Anyone can upload social banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'social-banners');

CREATE POLICY "Anyone can update social banners" ON storage.objects FOR UPDATE USING (bucket_id = 'social-banners');