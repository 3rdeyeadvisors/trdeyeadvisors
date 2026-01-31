

# Build Errors Fix Plan

## Issue Summary

Multiple files have **duplicate/merged code blocks** that are causing syntax errors. It appears that code was somehow duplicated or merged incorrectly, resulting in broken imports, function declarations, and JSX structures.

---

## Files Affected

| File | Issue Type | Lines Affected |
|------|------------|----------------|
| `src/components/pwa/ReloadPrompt.tsx` | Duplicate useEffect block | Lines 97-130 |
| `src/components/admin/FeatureSuggestionsManager.tsx` | Duplicate imports | Lines 3-17, 56-63 |
| `src/components/roadmap/FeatureSuggestionForm.tsx` | Duplicate function signature & button | Lines 19-27, 150-159 |
| `src/components/roadmap/FeatureSuggestionsList.tsx` | Duplicate function signature | Lines 39-47 |
| `src/components/roadmap/RoadmapCard.tsx` | Multiple duplicate blocks | Lines 165-187, 199-229, 262-313, 399-455, 490-541 |
| `src/hooks/useFeatureSuggestions.tsx` | Duplicate function params & update statements | Lines 151-167, 213-218 |
| `supabase/functions/delete-inactive-accounts/index.ts` | Resend import format | Line 3 |

---

## Fix Details

### 1. ReloadPrompt.tsx (PWA Component)

**Problem**: Duplicate `useEffect` block for `needRefresh` at lines 97-130

**Fix**: Remove the duplicate code block (lines 118-130) that repeats the toast notification logic

---

### 2. FeatureSuggestionsManager.tsx (Admin Component)

**Problem**: Two duplicate import sections merged together

**Fix**: 
- Remove duplicate import block at lines 3-8
- Remove duplicate import block at lines 56-62

---

### 3. FeatureSuggestionForm.tsx (Roadmap Component)

**Problem**: 
- Duplicate function signature at lines 19-27
- Duplicate button at lines 150-153

**Fix**: Remove the duplicate sections

---

### 4. FeatureSuggestionsList.tsx (Roadmap Component)

**Problem**: Duplicate function signature at lines 39-47

**Fix**: Remove the duplicate section

---

### 5. RoadmapCard.tsx (Roadmap Component)

**Problem**: Multiple duplicated sections throughout the file, including:
- Duplicate conditional blocks for `canVote` check (lines 165-187)
- Duplicate ternary expressions in className (lines 199-229)
- Duplicate countdown timer sections (lines 262-313)
- Duplicate Dialog content sections (lines 399-455, 490-541)

**Fix**: Remove all duplicate blocks, keeping only the first occurrence of each

---

### 6. useFeatureSuggestions.tsx (Hook)

**Problem**: 
- Duplicate function parameter on lines 151-156
- Duplicate `.update()` statements on lines 159-167 and 213-218

**Fix**: Remove the duplicate declarations

---

### 7. delete-inactive-accounts Edge Function

**Problem**: Deno import format issue - using `npm:resend@2.0.0` which is not resolving correctly

**Fix**: Change to esm.sh import format:
```typescript
// Before
import { Resend } from "npm:resend@2.0.0";

// After
import { Resend } from "https://esm.sh/resend@2.0.0";
```

---

## Implementation Order

1. Fix `ReloadPrompt.tsx` - Critical (blocks build)
2. Fix `FeatureSuggestionsManager.tsx` - Import errors
3. Fix `FeatureSuggestionForm.tsx` - Component errors
4. Fix `FeatureSuggestionsList.tsx` - Component errors
5. Fix `RoadmapCard.tsx` - Multiple JSX errors
6. Fix `useFeatureSuggestions.tsx` - Hook errors
7. Fix `delete-inactive-accounts` edge function - Deno import

---

## Technical Notes

All fixes involve removing duplicate code blocks that were incorrectly merged. No logic changes are required - just cleanup of malformed code structure.

