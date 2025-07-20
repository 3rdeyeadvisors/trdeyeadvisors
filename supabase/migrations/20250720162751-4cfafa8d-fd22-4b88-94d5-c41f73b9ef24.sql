-- Create printify_products table
CREATE TABLE public.printify_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  printify_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  images JSONB,
  variants JSONB,
  shop_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create printify_orders table
CREATE TABLE public.printify_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  printify_order_id TEXT NOT NULL UNIQUE,
  external_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL,
  shipping_method INTEGER,
  address_to JSONB NOT NULL,
  line_items JSONB NOT NULL,
  total_price INTEGER,
  total_shipping INTEGER,
  total_tax INTEGER,
  tracking_number TEXT,
  tracking_url TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.printify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printify_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for printify_products (publicly readable)
CREATE POLICY "Printify products are viewable by everyone" 
ON public.printify_products 
FOR SELECT 
USING (is_active = true);

-- Create policies for printify_orders
CREATE POLICY "Users can view their own orders" 
ON public.printify_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create orders" 
ON public.printify_orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update orders" 
ON public.printify_orders 
FOR UPDATE 
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_printify_products_updated_at
BEFORE UPDATE ON public.printify_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_printify_orders_updated_at
BEFORE UPDATE ON public.printify_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_printify_products_shop_id ON public.printify_products(shop_id);
CREATE INDEX idx_printify_products_active ON public.printify_products(is_active) WHERE is_active = true;
CREATE INDEX idx_printify_orders_user_id ON public.printify_orders(user_id);
CREATE INDEX idx_printify_orders_status ON public.printify_orders(status);