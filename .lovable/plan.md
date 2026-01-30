

# Fix Yes/No Button Centering and Equal Spacing

## Problem
The Yes and No voting buttons are not evenly centered, and there's unequal spacing (a "huge gap" after the No button). This happens because:

1. The inner button container uses `max-w-xs` (320px max) but the buttons inside may not fill evenly
2. The `VotingButtons` component returns a `<div className="flex gap-2">` but the parent wrapper adds another layer that causes alignment issues

## Solution
Ensure the voting buttons have equal width and are perfectly centered by:

1. Making both buttons explicitly `flex-1` to share space equally
2. Removing redundant wrapper and ensuring the button container fills the available space properly
3. Adding `w-full` to the inner flex container so buttons stretch evenly within the constrained max-width

## Technical Changes

### File: `src/components/roadmap/RoadmapCard.tsx`

**Change 1: VotingButtons Component (lines 152-163 - disabled state)**
Ensure disabled buttons also have `flex-1`:
```tsx
// Current
<Button variant="outline" size="sm" disabled className={`${compact ? '' : 'flex-1'} min-h-[36px] opacity-50 text-xs`}>

// Updated - ensure flex-1 is always applied for equal sizing
<Button variant="outline" size="sm" disabled className="flex-1 min-h-[36px] opacity-50 text-xs">
```

**Change 2: VotingButtons Component (lines 166-214 - active state)**
Ensure both Yes and No buttons always have `flex-1`:
```tsx
// Current
className={`${compact ? '' : 'flex-1'} min-h-[36px] text-xs ...`}

// Updated - always use flex-1 for equal distribution
className="flex-1 min-h-[36px] text-xs ..."
```

**Change 3: Card Voting Section Wrapper (lines 315-319)**
```tsx
// Current
<div className="w-full flex justify-center">
  <div className="flex gap-2 w-full max-w-xs">
    <VotingButtons />
  </div>
</div>

// Updated - simplify and ensure proper centering
<div className="flex justify-center w-full">
  <div className="w-full max-w-[280px]">
    <VotingButtons />
  </div>
</div>
```

**Change 4: Dialog Voting Section Wrapper (lines 396-400)**
```tsx
// Current
<div className="pt-2 flex justify-center">
  <div className="flex gap-2 w-full max-w-xs">
    <VotingButtons />
  </div>
</div>

// Updated - match card styling
<div className="pt-2 flex justify-center w-full">
  <div className="w-full max-w-[280px]">
    <VotingButtons />
  </div>
</div>
```

**Change 5: VotingButtons inner flex container (line 166)**
```tsx
// Current
<div className="flex gap-2">

// Updated - ensure full width so flex-1 children divide evenly
<div className="flex gap-2 w-full">
```

## Summary of Changes

| Location | Change |
|----------|--------|
| VotingButtons disabled state | Add `flex-1` to both buttons, add `w-full` to container |
| VotingButtons active state | Add `flex-1` to both buttons, add `w-full` to container |
| Card wrapper | Use `max-w-[280px]` and `w-full` for consistent sizing |
| Dialog wrapper | Match card wrapper styling |

This ensures:
- Both buttons are exactly the same width
- Equal spacing on left and right sides
- Consistent appearance on all devices
- No extra gap after the No button

