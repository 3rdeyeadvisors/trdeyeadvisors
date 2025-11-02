-- Add Stripe product and price ID columns to printify_products table
ALTER TABLE printify_products
ADD COLUMN IF NOT EXISTS stripe_product_id text,
ADD COLUMN IF NOT EXISTS stripe_prices jsonb DEFAULT '[]'::jsonb;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_printify_products_stripe_product_id 
ON printify_products(stripe_product_id);