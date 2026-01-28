
## Grant Admin Voting Access on Roadmap

### Problem
Your admin account cannot vote on roadmap items because the voting eligibility check only includes:
- Founding 33 members (3x power)
- Annual subscribers (1x power)

Admins are excluded from voting even though they have full platform access.

### Solution
Add `subscription?.isAdmin` to the voting weight logic in `useRoadmapVotes.tsx`. Admins will get 3x voting power (same as Founding 33 members).

### Changes Required

**File:** `src/hooks/useRoadmapVotes.tsx`

**Update line 39** - Add isAdmin to the isFounder check:
```typescript
// FROM:
const isFounder = isFoundingMember || subscription?.plan === 'founding_33' || subscription?.isFounder;

// TO:
const isFounder = isFoundingMember || subscription?.plan === 'founding_33' || subscription?.isFounder || subscription?.isAdmin;
```

This single change propagates to all the dependent functions:
- `getVoteWeight()` → Returns 3 for admins
- `canVote()` → Returns true for admins  
- `getVotingTier()` → Returns 'founding' for admins

### Result
| User Type | Voting Power |
|-----------|-------------|
| Admin | 3x (new) |
| Founding 33 | 3x |
| Annual Subscriber | 1x |
| Monthly/Trial/Free | Cannot vote |

### Technical Notes
- The `subscription?.isAdmin` value is already returned from the `check-subscription` edge function
- No database changes required - this is purely a frontend logic update
- Admins will see the "3x Voting Power Active" badge and can cast votes immediately
