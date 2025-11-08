-- Make user_id nullable in printify_orders since orders can come from guest checkouts
ALTER TABLE printify_orders ALTER COLUMN user_id DROP NOT NULL;