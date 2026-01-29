
## Fix Roadmap Voting Button - Complete Solution

### The Problem
The Vote button exists but shows as "Premium Only" (disabled) because the `check-subscription` edge function is failing with "Auth session missing!" errors. When this error occurs, the subscription data returns as the default (no access), so `canVote()` returns `false`.

### Evidence
Console logs from your session:
```
[Subscription] Error checking subscription (not signing out): Edge Function returned a non-2xx status code
```

Edge function logs:
```
[CHECK-SUBSCRIPTION] ERROR in check-subscription - {"message":"Authentication error: Auth session missing!"}
```

### Root Cause Analysis
The edge function uses `supabaseClient.auth.getUser(token)` to validate the JWT, but Supabase is returning an error. This happens when:
- There's a timing issue between frontend session establishment and the API call
- The token validation fails silently on Supabase's end

### Solution: Two-Part Fix

**Part 1: Improve Edge Function Auth Handling**

Instead of using the problematic `auth.getUser(token)` method, use the more reliable pattern of creating a user-scoped client directly with the JWT.

Changes to `supabase/functions/check-subscription/index.ts`:
```typescript
// Instead of service role + getUser(token), create a user client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";

// Parse JWT to get user info (more reliable than getUser)
const token = authHeader.replace("Bearer ", "");
const payload = JSON.parse(atob(token.split('.')[1]));
const userId = payload.sub;
const userEmail = payload.email;

// Create a service client for database queries
const supabaseClient = createClient(
  supabaseUrl,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);
```

**Part 2: Add Better Error Recovery**

Modify the frontend subscription hook to retry with a fresh session if the first attempt fails:

Changes to `src/hooks/useSubscription.tsx`:
- Add logic to refresh the session before retrying
- Ensure the token being passed is the most current one

### Files to Modify

1. **`supabase/functions/check-subscription/index.ts`**
   - Replace `auth.getUser(token)` with direct JWT parsing
   - Add fallback validation for email from JWT payload
   - Keep all existing business logic intact

2. **`src/hooks/useSubscription.tsx`**
   - Add session refresh before retry attempts
   - Improve error handling to get a fresh access token

### Expected Outcome

After these changes:
- Grandfathered + Admin users will see the active "Vote" button with 3x power badge
- Annual subscribers will see the active "Vote" button with 1x power badge
- Non-subscribers will see the "Premium Only" disabled button
- The auth errors in console logs will be resolved

### Technical Details

The JWT parsing approach is more reliable because:
1. JWTs are self-contained - the user ID and email are already in the token payload
2. It doesn't require a round-trip to Supabase Auth service
3. It eliminates the "Auth session missing" race condition

Token structure (decoded):
```json
{
  "sub": "user-uuid-here",  // This is the user ID
  "email": "user@email.com",
  "role": "authenticated",
  ...
}
```
