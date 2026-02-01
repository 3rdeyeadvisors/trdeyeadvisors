
# Plan: Fix Roadmap Layout, Focus Mode Swipe, and Reduce Platform Sounds

## Overview
This plan addresses 4 issues the user reported:
1. Roadmap boxes are not identical sizes on desktop
2. Boxes move/glitch after voting (layout shift)
3. Focus mode exits when swiping left/right
4. Too many sounds throughout the platform

---

## Issue 1: Non-Identical Roadmap Boxes

**Problem**: Cards have varying heights because they contain dynamic content (description length, timer visibility, vote weight badges) that causes each card to be a different size.

**Solution**: Add CSS to ensure all cards in a row have equal height and internal content sections have fixed/minimum heights.

**Changes to `src/components/roadmap/RoadmapCard.tsx`**:
- Add `h-full` class to the Card component to stretch to grid row height
- Add `flex flex-col` to enable flexbox layout
- Add `flex-1` to description area to push buttons to bottom
- Ensure consistent spacing regardless of content presence

---

## Issue 2: Layout Shift When Voting

**Problem**: When voting, the vote counts change (e.g., "(0)" becomes "(1)") causing text width to change and the entire card to shift. The button states also change, causing layout jumps.

**Solution**: Add fixed minimum widths and stabilize the voting UI:
- Fix button minimum widths so they don't resize when vote counts change
- Add fixed-width containers for vote count displays
- Use `tabular-nums` for numbers to prevent width changes

**Changes to `src/components/roadmap/RoadmapCard.tsx`**:
- Add `tabular-nums` class to vote count numbers
- Set minimum widths on vote buttons
- Add `min-w-[XX]` to vote count display areas

---

## Issue 3: Focus Mode Swipe Exits the Mode

**Problem**: The swipe navigation in `FullscreenContentViewer.tsx` calls `onNext` and `onPrevious` which navigate between modules, but the swipe is being interpreted incorrectly or the navigation is closing the modal.

**Root Cause**: Looking at the code, the swipe handlers are correctly mapped:
- `onSwipeLeft` (swipe finger left) → `hasNext ? onNext : undefined`
- `onSwipeRight` (swipe finger right) → `hasPrevious ? onPrevious : undefined`

The issue is likely that when the user is on the first or last module, swipe handlers are `undefined`, and the swipe gesture may be bubbling up or causing unexpected behavior. Also, there's no feedback when swiping at boundaries.

**Solution**:
- Always provide swipe handlers (not `undefined`)
- Add boundary feedback when user tries to swipe past first/last module
- Prevent event propagation during swipes

**Changes to `src/components/course/FullscreenContentViewer.tsx`**:
- Add boundary handlers that show feedback instead of `undefined`
- Add `toast` notification when user reaches the boundary
- Use `stopPropagation` in swipe handling

---

## Issue 4: Too Many Sounds Throughout the Platform

**Problem**: The platform plays sounds for:
- Navigation (every page change)
- Pull-to-refresh
- Menu open/close
- Clicks
- Points earned
- Daily login
- Quiz answers
- Module/course completion

This is too frequent and annoying.

**Solution**: Keep only meaningful achievement sounds and remove UI interaction sounds:

**Keep (achievement-based)**:
- `pointsEarned` - rewards
- `dailyLogin` - streak encouragement
- `correctAnswer` / `wrongAnswer` - quiz feedback
- `moduleComplete` / `courseComplete` - major milestones
- `quizPass` - achievement
- `badgeEarned` - achievement

**Remove (UI interaction sounds)**:
- `click` - too frequent
- `hover` - unnecessary
- `navigate` - every page change is annoying
- `refresh` - too frequent
- `menuOpen` / `menuClose` - too frequent
- `success` / `error` - redundant with visual feedback

**Changes**:

1. **`src/components/Navigation.tsx`**: Remove `playClick`, `playMenuOpen`, `playMenuClose`, `playNavigate` calls

2. **`src/components/Layout.tsx`**: Remove `playRefresh`, `playNavigate` calls

3. **`src/hooks/useAchievementSounds.tsx`**: Keep the UI sound functions for future use but they won't be called

---

## Technical Implementation Details

### File: `src/components/roadmap/RoadmapCard.tsx`

1. Update Card component classes:
```tsx
<Card
  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col"
  onClick={handleCardClick}
>
```

2. Update CardContent to use flex-grow:
```tsx
<CardContent className="relative p-4 pt-2 space-y-3 flex-1 flex flex-col">
```

3. Add `tabular-nums` to vote counts:
```tsx
<span className="font-medium tabular-nums">
```

4. Set fixed minimum widths on buttons:
```tsx
className={`flex-1 min-h-[36px] min-w-[100px] text-xs...`}
```

### File: `src/components/course/FullscreenContentViewer.tsx`

Add boundary handling for swipes:
```tsx
const handleBoundarySwipe = (direction: 'left' | 'right') => {
  toast.info(direction === 'left' ? "You're at the last module" : "You're at the first module");
};

const swipeHandlers = useSwipeNavigation({
  onSwipeLeft: hasNext ? onNext : () => handleBoundarySwipe('left'),
  onSwipeRight: hasPrevious ? onPrevious : () => handleBoundarySwipe('right'),
  threshold: 60
});
```

### File: `src/components/Navigation.tsx`

Remove sound hooks and calls:
```tsx
// Remove this import usage
const { playClick, playMenuOpen, playMenuClose, playNavigate } = useAchievementSounds();

// Remove playNavigate() call from useEffect
// Remove playMenuOpen() and playMenuClose() calls from handlers
```

### File: `src/components/Layout.tsx`

Remove sound hooks and calls:
```tsx
// Remove this import usage
const { playRefresh, playNavigate } = useAchievementSounds();

// Remove playRefresh() call from handleRefresh
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/roadmap/RoadmapCard.tsx` | Add flex layout, consistent heights, stabilize vote counts |
| `src/components/course/FullscreenContentViewer.tsx` | Add boundary feedback for swipes |
| `src/components/Navigation.tsx` | Remove UI sound effects |
| `src/components/Layout.tsx` | Remove UI sound effects |

---

## Expected Outcome

1. **Roadmap**: All cards will be identical heights within each row
2. **Voting**: No more layout shifts when votes are cast
3. **Focus mode**: Swiping at boundaries shows feedback instead of exiting
4. **Sounds**: Only achievement sounds remain (quiz, milestones, points)
