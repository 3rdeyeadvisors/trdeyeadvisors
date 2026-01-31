
# Security Fix Plan: 3 Critical Issues (One by One)

We'll fix each security vulnerability individually to ensure accuracy and proper testing.

---

## Issue #1: Quiz Answer Exposure (HIGH PRIORITY)

### Problem
The `quizzes_public` view currently includes `explanation` in the questions JSON:
```sql
jsonb_build_object(
  'id', q.value ->> 'id',
  'question', q.value ->> 'question',
  'options', q.value -> 'options',
  'explanation', q.value ->> 'explanation'  -- ⚠️ LEAKING HINTS
)
```
This reveals answer hints before quiz completion.

### Solution
Recreate the view WITHOUT the `explanation` field:

**Migration File: `fix_quiz_explanation_leak.sql`**
```sql
-- Drop and recreate quizzes_public view without explanation field
DROP VIEW IF EXISTS public.quizzes_public;

CREATE OR REPLACE VIEW public.quizzes_public
WITH (security_invoker = on)
AS SELECT
    id,
    course_id,
    module_id,
    title,
    description,
    passing_score,
    time_limit,
    max_attempts,
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', q.value ->> 'id',
                'question', q.value ->> 'question',
                'options', q.value -> 'options'
                -- explanation intentionally removed for security
            )
        )
        FROM jsonb_array_elements(quizzes.questions) q(value)
    ) AS questions,
    created_at,
    updated_at
FROM quizzes
WHERE auth.uid() IS NOT NULL;

-- Grant access to authenticated users
GRANT SELECT ON public.quizzes_public TO authenticated;
```

### Impact
- Users can still take quizzes with questions and options
- Explanations only revealed after submission (handled by app logic)
- No frontend code changes needed

---

## Issue #2: User Privacy / Vote Tracking (HIGH PRIORITY)

### Problem
The `roadmap_votes` table has TWO overlapping public SELECT policies:
```sql
"Anyone can view votes" -- qual: true (public!)
"Authenticated users can view votes" -- qual: true
```
This exposes `user_id` values to anonymous visitors, allowing tracking of individual voting patterns.

### Solution
Remove the overly permissive "Anyone can view votes" policy and restrict vote visibility:

**Migration File: `fix_roadmap_vote_privacy.sql`**
```sql
-- Remove the public policy that exposes user voting patterns
DROP POLICY IF EXISTS "Anyone can view votes" ON public.roadmap_votes;

-- Keep authenticated users policy but make it more restrictive
-- Users can only see their own votes (for UI highlighting)
-- Vote counts are computed server-side in the app
DROP POLICY IF EXISTS "Authenticated users can view votes" ON public.roadmap_votes;

CREATE POLICY "Users can view own votes for UI"
ON public.roadmap_votes FOR SELECT
USING (auth.uid() = user_id);

-- Allow service role to see all votes for admin operations
CREATE POLICY "Service role can view all votes"
ON public.roadmap_votes FOR SELECT
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Admins can view all votes for management
CREATE POLICY "Admins can view all votes"
ON public.roadmap_votes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
```

### Frontend Update Required
Since users can no longer fetch ALL votes, we need to update `useRoadmapVotes.tsx` to:
1. Fetch only the user's own votes for UI highlighting
2. Compute vote counts from aggregated data (create a new view or edge function)

**New View: `roadmap_vote_counts`**
```sql
CREATE OR REPLACE VIEW public.roadmap_vote_counts
WITH (security_invoker = on)
AS SELECT
    roadmap_item_id,
    COUNT(*) FILTER (WHERE vote_type = 'yes') as yes_votes,
    COUNT(*) FILTER (WHERE vote_type = 'no') as no_votes
FROM roadmap_votes
GROUP BY roadmap_item_id;

GRANT SELECT ON public.roadmap_vote_counts TO authenticated;
```

**File: `src/hooks/useRoadmapVotes.tsx`**
```tsx
// Line 78-81: Change from fetching all votes to:
// 1. Fetch vote counts from the new view
const { data: voteCounts } = await supabase
  .from('roadmap_vote_counts')
  .select('*');

// 2. Fetch only user's own votes for highlighting
const { data: userVotes } = user
  ? await supabase
      .from('roadmap_votes')
      .select('roadmap_item_id, vote_type')
      .eq('user_id', user.id)
  : { data: [] };
```

---

## Issue #3: Roadmap Strategy Visibility (MEDIUM PRIORITY)

### Problem
The `roadmap_items` table has two public SELECT policies:
```sql
"Anyone can view roadmap items" -- qual: true (public!)
"Authenticated users can view roadmap items" -- qual: true
```

### Solution
This is intentionally public for transparency. We'll mark it as acknowledged:

**Option A: Keep public (recommended)** - The roadmap is meant to be visible for community transparency. We'll dismiss this security warning as "intentional behavior."

**Option B: Restrict to authenticated only** - Remove "Anyone can view" policy if you want it members-only.

### Recommended Action
Mark this as intentional by updating the security finding status.

---

## Implementation Order

| Step | Issue | Priority | Risk |
|------|-------|----------|------|
| 1 | Quiz explanation leak | HIGH | None - just removes field |
| 2 | Roadmap votes privacy | HIGH | Requires frontend update |
| 3 | Roadmap items visibility | MEDIUM | Decision only - no code change |

---

## Summary of Changes

### Database Migrations
1. `fix_quiz_explanation_leak.sql` - Recreate view without explanation
2. `fix_roadmap_vote_privacy.sql` - New RLS policies + vote counts view

### Frontend Changes
1. `src/hooks/useRoadmapVotes.tsx` - Update to use new vote counts view and fetch only user's own votes

### Security Finding Updates
1. Mark "roadmap items public" as intentional if keeping public transparency
