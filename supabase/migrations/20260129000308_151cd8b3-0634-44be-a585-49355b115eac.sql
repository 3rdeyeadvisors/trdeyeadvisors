-- Fix roadmap_reminder_sent: Restrict to service_role only
DROP POLICY IF EXISTS "Service role can manage reminders" ON public.roadmap_reminder_sent;
CREATE POLICY "Service role can manage reminders" ON public.roadmap_reminder_sent
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Fix user_points_monthly: Restrict to service_role only  
DROP POLICY IF EXISTS "Service role can manage monthly totals" ON public.user_points_monthly;
CREATE POLICY "Service role can manage monthly totals" ON public.user_points_monthly
  FOR ALL TO service_role USING (true) WITH CHECK (true);