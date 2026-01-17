-- Security Fix: Clean up leaderboard policies and create secure printify view

-- 1. Remove overly permissive leaderboard policies (keep only the secure one)
DROP POLICY IF EXISTS "All users can view leaderboard data" ON user_points_monthly;
DROP POLICY IF EXISTS "Authenticated users can view leaderboard" ON user_points_monthly;

-- 2. Create a public view for printify products that hides pricing strategy
CREATE VIEW public.printify_products_public
WITH (security_invoker=on) AS
  SELECT 
    id, 
    printify_id, 
    title, 
    description, 
    tags, 
    images, 
    variants, 
    shop_id, 
    is_active, 
    created_at, 
    updated_at
  FROM public.printify_products
  WHERE is_active = true;
-- Note: Excludes stripe_product_id and stripe_prices

-- 3. Restrict base table access to admins only
DROP POLICY IF EXISTS "Printify products are viewable by everyone" ON printify_products;

CREATE POLICY "Admins can view all printify products" 
  ON printify_products FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'::app_role));