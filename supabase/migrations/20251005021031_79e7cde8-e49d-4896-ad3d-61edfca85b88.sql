-- Allow authenticated users to upload files to digital-products bucket
CREATE POLICY "Authenticated users can upload digital products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'digital-products');

-- Allow authenticated users to update files in digital-products bucket
CREATE POLICY "Authenticated users can update digital products"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'digital-products')
WITH CHECK (bucket_id = 'digital-products');