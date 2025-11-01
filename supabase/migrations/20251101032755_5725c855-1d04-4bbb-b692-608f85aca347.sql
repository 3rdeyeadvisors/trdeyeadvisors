-- Create table for tracking digital downloads with secure tokens
CREATE TABLE public.digital_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL, -- 'course' or 'digital_product'
  download_token TEXT NOT NULL UNIQUE,
  file_ids JSONB NOT NULL, -- Array of file IDs for this product
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  max_downloads INTEGER NOT NULL DEFAULT 5,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_digital_downloads_token ON public.digital_downloads(download_token);
CREATE INDEX idx_digital_downloads_order ON public.digital_downloads(order_id);
CREATE INDEX idx_digital_downloads_email ON public.digital_downloads(user_email);

-- Enable RLS
ALTER TABLE public.digital_downloads ENABLE ROW LEVEL SECURITY;

-- Users can view their own downloads
CREATE POLICY "Users can view their own downloads"
  ON public.digital_downloads
  FOR SELECT
  USING (user_id = auth.uid() OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- System can create downloads
CREATE POLICY "System can create downloads"
  ON public.digital_downloads
  FOR INSERT
  WITH CHECK (true);

-- System can update download counts
CREATE POLICY "System can update downloads"
  ON public.digital_downloads
  FOR UPDATE
  USING (true);

-- Admins can view all downloads
CREATE POLICY "Admins can view all downloads"
  ON public.digital_downloads
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create table for action logging
CREATE TABLE public.order_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'digital_links_generated', 'digital_email_sent', 'printify_created', 'download_email_resent'
  status TEXT NOT NULL, -- 'success', 'error'
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for logs
CREATE INDEX idx_order_logs_order ON public.order_action_logs(order_id);
CREATE INDEX idx_order_logs_created ON public.order_action_logs(created_at DESC);

-- Enable RLS on logs
ALTER TABLE public.order_action_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Admins can view logs"
  ON public.order_action_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert logs
CREATE POLICY "System can insert logs"
  ON public.order_action_logs
  FOR INSERT
  WITH CHECK (true);