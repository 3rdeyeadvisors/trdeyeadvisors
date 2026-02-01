
# Fix Community Ideas Section Layout Issues

## Problem Analysis

The "Recent Community Ideas" section on the `/roadmap` page has visual issues on certain devices:

1. **Title and badge overlap**: The horizontal flex layout (`flex-col sm:flex-row`) causes the title and status badge to collide on mid-sized screens
2. **Content not centered**: Headers and card content are left-aligned when they should be centered, per your design preferences
3. **Tight spacing causes overlap**: Description text, submitter name, and "Click to read more" text compete for space
4. **Inconsistent mobile behavior**: The layout breaks between mobile breakpoints

## Solution

Restructure the suggestion item cards to use a stacked (vertical) layout consistently, with proper centering and spacing to prevent overlap.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/roadmap/FeatureSuggestionsList.tsx` | Fix card layout, center content, add proper spacing |

## Detailed Changes

### 1. Center the Card Header
Change the `CardTitle` from inline flex to centered text:
```text
Before: flex items-center gap-2
After:  flex flex-col items-center text-center gap-2
```

### 2. Restructure Suggestion Item Cards
Replace the problematic horizontal flex layout with a cleaner stacked design:

**Current structure (causes overlap):**
```text
[Title -------- Badge]  <- fights for horizontal space
[Description text....]
[Submitter | Read more] <- squished together
```

**Fixed structure (prevents overlap):**
```text
       [Badge]           <- centered at top
       [Title]           <- centered, with wrap
  [Description text]     <- centered
[Submitter] [Read more]  <- proper flex spacing
```

### 3. Specific CSS Changes

For each suggestion card button:
- Change from `flex flex-col sm:flex-row` to `flex flex-col items-center`
- Add `text-center` to ensure text wraps properly
- Increase vertical gap from `gap-2` to `gap-3`
- Move badge above title for consistent visual hierarchy
- Add `break-words` to prevent text overflow
- Increase padding from `p-3` to `p-4` for breathing room

### 4. Footer Row Fix
The submitter name and "Click to read more" row:
- Keep as `flex items-center justify-between` but add `flex-wrap`
- Add `gap-2` to prevent collision when wrapping
- Ensure minimum width constraints don't cause horizontal scroll

## Code Changes Summary

```text
File: src/components/roadmap/FeatureSuggestionsList.tsx

Line 73-76 (CardHeader):
- Add text-center and items-center to center the header content

Lines 88-111 (suggestion button):
- Restructure to vertical stacked layout
- Move badge to top, centered
- Center title and description
- Add proper spacing (gap-3 instead of gap-2)
- Add text-center and break-words classes
- Increase padding from p-3 to p-4

Lines 105-109 (footer row):
- Add flex-wrap and gap-2 to prevent overlap
```

## Expected Result

After these changes:
- All content in the community ideas cards will be properly centered
- No overlapping text on any screen size
- Consistent visual hierarchy: Badge, Title, Description, Footer
- Matches your preference for centered, compact layouts
