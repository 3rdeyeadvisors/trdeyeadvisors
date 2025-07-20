-- Create storage bucket for digital products
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('digital-products', 'digital-products', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'video/mp4']);

-- Create digital_product_files table to track available files
CREATE TABLE public.digital_product_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_purchases table to track what users have bought
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stripe_session_id TEXT,
  amount_paid INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.digital_product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for digital_product_files (admin only can manage)
CREATE POLICY "Digital product files are viewable by everyone" 
ON public.digital_product_files 
FOR SELECT 
USING (true);

-- Create policies for user_purchases
CREATE POLICY "Users can view their own purchases" 
ON public.user_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create purchases" 
ON public.user_purchases 
FOR INSERT 
WITH CHECK (true);

-- Create storage policies for digital products
CREATE POLICY "Authenticated users can view files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'digital-products' AND auth.role() = 'authenticated');

-- Create function to check if user has purchased a product
CREATE OR REPLACE FUNCTION public.user_has_purchased_product(product_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_purchases 
    WHERE user_id = auth.uid() AND user_purchases.product_id = $1
  );
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_digital_product_files_updated_at
BEFORE UPDATE ON public.digital_product_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample digital product files
INSERT INTO public.digital_product_files (product_id, file_name, file_path, file_type, description) VALUES
(1, 'Complete_DeFi_Mastery_eBook.pdf', 'ebooks/defi-mastery-complete-guide.pdf', 'application/pdf', 'Complete 200+ page guide to DeFi mastery'),
(1, 'DeFi_Quick_Reference_Card.pdf', 'ebooks/defi-quick-reference.pdf', 'application/pdf', 'Quick reference card with key concepts'),
(2, 'DeFi_Portfolio_Tracker.xlsx', 'templates/defi-portfolio-tracker.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Excel template for tracking DeFi positions'),
(2, 'Portfolio_Setup_Guide.pdf', 'templates/portfolio-setup-guide.pdf', 'application/pdf', 'Step-by-step setup instructions'),
(3, 'Yield_Farming_Strategy_Guide.pdf', 'guides/yield-farming-strategies.pdf', 'application/pdf', 'Advanced yield farming strategies'),
(3, 'ROI_Calculator.xlsx', 'guides/roi-calculator.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ROI calculation spreadsheet');