-- Add customer details and amount fields to printify_orders table
ALTER TABLE printify_orders 
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid INTEGER DEFAULT 0;