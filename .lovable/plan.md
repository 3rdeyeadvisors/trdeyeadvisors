

# Fix Content Centering in "Submit Your Feature Idea" Card

## Problem
The "Submit Your Feature Idea" card header content is not centered on desktop. The current layout uses `text-left` and a left-aligned flex layout that looks fine on mobile but appears off-center on larger screens.

## Current Layout Issue (lines 77-92)
```tsx
<CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors rounded-t-lg">
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary/10">
      <Lightbulb className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1 text-left">  <!-- Problem: Always left-aligned -->
      <CardTitle>Submit Your Feature Idea</CardTitle>
      <CardDescription>Share your ideas...</CardDescription>
    </div>
    <Button>Open</Button>
  </div>
</CardHeader>
```

## Solution
Restructure the card header to:
1. Center the content (icon, title, description) on all screen sizes
2. Move the Open/Close button below on mobile, inline on desktop
3. Ensure consistent visual hierarchy

## Technical Changes

### File: `src/components/roadmap/FeatureSuggestionForm.tsx`

**CardHeader Section (lines 76-92):**

```tsx
<CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors rounded-t-lg">
  <div className="flex flex-col items-center text-center gap-2">
    <div className="p-2.5 rounded-lg bg-primary/10">
      <Lightbulb className="w-5 h-5 text-primary" />
    </div>
    <div>
      <CardTitle className="text-base md:text-lg">Submit Your Feature Idea</CardTitle>
      <CardDescription className="text-sm mt-1">
        Share your ideas and help shape the platform
      </CardDescription>
    </div>
    <Button variant="ghost" size="sm" className="mt-1">
      {isOpen ? 'Close' : 'Open'}
    </Button>
  </div>
</CardHeader>
```

**Key Changes:**
- Changed wrapper from horizontal flex to `flex flex-col items-center text-center`
- Removed `flex-1 text-left` from the inner div
- Stacked icon, text, and button vertically with proper centering
- Added `gap-2` for consistent spacing between elements
- Button now centered below the text

This matches the centered layout pattern already used in the "Premium Feature" card for non-premium users (lines 52-70), ensuring visual consistency across both states.

