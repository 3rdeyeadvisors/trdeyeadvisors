
## Security Cleanup Plan

### Summary
After a thorough audit, I found 2 actual RLS policy issues that need fixing, plus 3 false positive security warnings that can be dismissed. The platform is already well-secured - just needs minor policy corrections.

### What Needs Fixing

**1. Fix Overly Permissive RLS Policies**

Two tables have `USING (true)` policies that grant broader access than intended:

| Table | Current Issue | Fix |
|-------|--------------|-----|
| `roadmap_reminder_sent` | ALL policy with `true` for public role | Restrict to service_role only |
| `user_points_monthly` | ALL policy with `true` for public role | Restrict to service_role only |

**Migration to apply:**
```sql
-- Fix roadmap_reminder_sent: Only service role should manage this
DROP POLICY IF EXISTS "Service role can manage reminders" ON public.roadmap_reminder_sent;
CREATE POLICY "Service role can manage reminders" ON public.roadmap_reminder_sent
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Fix user_points_monthly: Only service role for bulk operations
DROP POLICY IF EXISTS "Service role can manage monthly totals" ON public.user_points_monthly;
CREATE POLICY "Service role can manage monthly totals" ON public.user_points_monthly
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

**2. Mark False Positives as Resolved**

These tables are already properly secured with admin-only access:

- **subscribers** - Only admins can SELECT, public INSERT has rate limiting
- **contact_submissions** - Admin-only SELECT/UPDATE/DELETE, rate-limited INSERT
- **grandfathered_emails** - Admin-only ALL policy

### What You Need to Do Manually

**Leaked Password Protection** - This must be enabled in the Supabase Dashboard:
1. Go to Authentication → Providers → Email
2. Under "Password Policy", enable "Leaked Password Protection"
3. This checks passwords against known breached password databases

### Technical Details

**Why these policies were flagged:**
The original policies used `TO public` which includes all roles. By changing to `TO service_role`, the policies only apply when your edge functions call the database with the service role key, preventing any client-side exploitation.

**No encryption needed:**
The flagged email fields in `subscribers` and `contact_submissions` don't require encryption because:
- RLS already blocks unauthorized access completely
- Encryption at rest would add complexity without security benefit since the data is already protected by RLS
- Supabase encrypts data at rest at the infrastructure level

### Implementation Order
1. Apply the RLS policy fixes via migration
2. Update security findings to mark false positives
3. Remind you to enable leaked password protection in dashboard

