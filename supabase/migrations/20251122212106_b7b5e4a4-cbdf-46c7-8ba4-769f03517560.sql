-- Create a public bucket for resources if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create RLS policies for the resources bucket
CREATE POLICY "Public read access for resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'resources');

CREATE POLICY "Admin upload access for resources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');