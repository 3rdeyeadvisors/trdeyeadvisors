-- Strengthen digital downloads RLS to validate expiration and download limits
DROP POLICY IF EXISTS "Users can view their own downloads" ON public.digital_downloads;

-- New policy that enforces expiration and download count limits
CREATE POLICY "Users can view valid downloads" 
ON public.digital_downloads 
FOR SELECT 
USING (
  -- Must be the owner (by user_id or email)
  (
    (user_id = auth.uid()) 
    OR 
    (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
  -- AND must not be expired
  AND expires_at > now()
  -- AND must not have exceeded download limit
  AND download_count < max_downloads
);

-- Add index for faster expiration queries
CREATE INDEX IF NOT EXISTS idx_digital_downloads_expires_at 
ON public.digital_downloads(expires_at);

-- Add index for download count checks
CREATE INDEX IF NOT EXISTS idx_digital_downloads_counts 
ON public.digital_downloads(download_count, max_downloads);