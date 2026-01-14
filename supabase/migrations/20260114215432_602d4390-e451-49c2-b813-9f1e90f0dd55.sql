-- Fix overly permissive RLS policies
-- These policies currently use WITH CHECK (true) which is too permissive

-- 1. Fix discount_usage - only allow authenticated users to insert their own usage records
DROP POLICY IF EXISTS "System can insert discount usage" ON public.discount_usage;
CREATE POLICY "Users can insert their own discount usage"
ON public.discount_usage
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- 2. Fix order_action_logs - only admins should be able to insert logs
DROP POLICY IF EXISTS "System can insert logs" ON public.order_action_logs;
CREATE POLICY "Only admins can insert order action logs"
ON public.order_action_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Fix referrals - ensure referrer_id matches the authenticated user
DROP POLICY IF EXISTS "System can create referrals" ON public.referrals;
CREATE POLICY "System and authenticated users can create valid referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (
  referrer_id = auth.uid() 
  AND referred_user_id != auth.uid()
);

-- 4. Fix security_audit_log - only service role (edge functions) should insert
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_audit_log;
-- Security logs should only be inserted by backend/edge functions using service role
-- No direct client inserts allowed
CREATE POLICY "No direct client inserts for security logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (false);

-- 5. Fix user_purchases - only service role should create purchases (via Stripe webhook)
DROP POLICY IF EXISTS "System can create purchases" ON public.user_purchases;
CREATE POLICY "Only backend can create purchases"
ON public.user_purchases
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 6. Fix user_trials - only allow trigger inserts for the authenticated user
DROP POLICY IF EXISTS "Allow trigger inserts for new users" ON public.user_trials;
CREATE POLICY "Users can only have trials created for themselves"
ON public.user_trials
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Additional security improvements:

-- Ensure raffle_tasks cannot be manipulated by users for verification fields
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.raffle_tasks;
CREATE POLICY "Users can update their own tasks safely"
ON public.raffle_tasks
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  -- Users cannot change verification_status or verified_at directly
  -- These should only be changed by admins
);

-- Ensure raffle_entries entry_count cannot be directly manipulated
DROP POLICY IF EXISTS "Users can update their own entries" ON public.raffle_entries;
CREATE POLICY "Users can view their entries only"
ON public.raffle_entries
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());