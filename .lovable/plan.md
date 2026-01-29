
## Fix Voting Access for Grandfathered Users & Admins

### Root Cause Identified
Your account is in the `grandfathered_emails` table, so the `check-subscription` edge function returns early with `plan: 'grandfathered'` **before** ever checking if you're also an admin. 

The voting eligibility logic in `useRoadmapVotes.tsx` doesn't recognize:
- `plan: 'grandfathered'` as a valid voting tier
- Your admin role (because `isAdmin` is never set)

### Console Log Evidence
```
[Subscription] Status: {
  "subscribed": true,
  "isGrandfathered": true,
  "plan": "grandfathered",  // NOT founding_33, NOT annual
  "subscriptionEnd": null
  // Missing: isAdmin, isFounder
}
```

### Solution: Two-Part Fix

**Part 1: Fix Edge Function Logic (Priority)**

Update `supabase/functions/check-subscription/index.ts` to:
1. Check admin role first, before grandfathered emails
2. Always include `isAdmin` flag in the response when user is admin
3. For admins who are also grandfathered, return the higher-tier response

```typescript
// CHECK ADMIN FIRST (move lines 82-101 before grandfathered check)
const { data: adminRole } = await supabaseClient
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .eq('role', 'admin')
  .single();

const isAdmin = !!adminRole;

// THEN check grandfathered - but include isAdmin in response
if (grandfatheredData) {
  return new Response(JSON.stringify({
    subscribed: true,
    isGrandfathered: true,
    isAdmin,  // NEW: Include admin status
    isFounder,
    plan: isFounder ? 'founding_33' : 'grandfathered',
    subscriptionEnd: null
  }), ...);
}

// If admin but not grandfathered
if (isAdmin) {
  return new Response(JSON.stringify({
    subscribed: true,
    isAdmin: true,
    plan: 'admin',
    subscriptionEnd: null
  }), ...);
}
```

**Part 2: Update Frontend Logic (Backup)**

Update `useRoadmapVotes.tsx` to also grant voting to grandfathered users:

```typescript
// Line 39: Add grandfathered to founders check
const isFounder = isFoundingMember || 
  subscription?.plan === 'founding_33' || 
  subscription?.isFounder || 
  subscription?.isAdmin ||
  subscription?.isGrandfathered; // NEW: Grandfathered = Founding tier
```

### Result After Fix

| Status | Before | After |
|--------|--------|-------|
| Grandfathered + Admin | Cannot vote | 3x voting power |
| Grandfathered only | Cannot vote | 3x voting power |
| Admin only | 3x voting | 3x voting (unchanged) |

### Files to Modify
1. `supabase/functions/check-subscription/index.ts` - Reorder checks, add isAdmin to grandfathered response
2. `src/hooks/useRoadmapVotes.tsx` - Add `isGrandfathered` to voting eligibility

### RLS Policies (Already Correct)
The `roadmap_votes` table has a permissive policy allowing authenticated users to manage their own votes:
- `Users can manage their own votes`: `auth.uid() = user_id`

No database changes needed - this is purely an edge function + frontend logic fix.
