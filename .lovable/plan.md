
# Plan: Fix Focus Mode Swipe Navigation

## Root Cause Analysis

After auditing the code, I identified **three interconnected issues** preventing swipe navigation from working:

### Issue 1: CSS `touch-pan-y` Blocking Horizontal Gestures
The content area in `FullscreenContentViewer.tsx` has `touch-pan-y` class:
```tsx
className="flex-1 overflow-y-auto px-4 py-6 ... touch-pan-y"
```

This CSS property tells the browser to handle vertical scrolling natively, but it can prevent JavaScript from receiving horizontal touch events entirely. The browser intercepts the gesture before our `onTouchMove` handler is called.

### Issue 2: Overly Strict Swipe Detection Threshold
The current logic in `useSwipeNavigation.tsx` requires:
- `deltaX > 80px` (high threshold)
- `deltaX > deltaY * 2` (horizontal must be twice vertical)

Both conditions must be met during `onTouchMove` to set `isSwiping = true`. If the user swipes at even a slight angle, the swipe is ignored.

### Issue 3: Early Termination in onTouchEnd
If `isSwiping.current` is never set to `true` (due to issues 1 or 2), the `onTouchEnd` handler exits immediately:
```tsx
const onTouchEnd = useCallback((e: React.TouchEvent) => {
  if (!isSwiping.current) return; // Exits here - never fires callback
  ...
```

---

## Solution

### Fix 1: Replace `touch-pan-y` with `touch-action: auto`

Remove the `touch-pan-y` class from the content div and instead let the swipe hook decide when to allow scrolling vs swiping. We'll use `touch-action: manipulation` which allows both scrolling and gestures.

**File: `src/components/course/FullscreenContentViewer.tsx`**
```tsx
// Before (line 191)
className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-16 xl:px-24 touch-pan-y"

// After
className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-16 xl:px-24"
style={{ touchAction: 'manipulation' }}
```

### Fix 2: Rewrite Swipe Detection Logic

The current approach tries to detect swipe intent during `onTouchMove`, but this conflicts with scroll behavior. Instead:

1. **Always track touch positions** during `onTouchStart` and `onTouchMove`
2. **Determine swipe vs scroll on `onTouchEnd`** based on final delta values
3. **Lower the threshold** to 50px (reasonable for mobile)
4. **Relax the ratio requirement** to 1.5x instead of 2x

**File: `src/hooks/useSwipeNavigation.tsx`**

```tsx
export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventDefaultOnSwipe = false
}: UseSwipeNavigationOptions): SwipeHandlers => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    // Initialize end positions to start positions
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if this is a horizontal swipe:
    // - Must exceed threshold
    // - Horizontal movement must be at least 1.5x vertical (to distinguish from scrolling)
    const isHorizontalSwipe = absDeltaX > threshold && absDeltaX > absDeltaY * 1.5;

    if (isHorizontalSwipe) {
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
      
      if (deltaX > 0 && onSwipeLeft) {
        onSwipeLeft(); // Swipe left = go to next
      } else if (deltaX < 0 && onSwipeRight) {
        onSwipeRight(); // Swipe right = go to previous
      }
    }
    
    // Vertical swipe handling (optional)
    const isVerticalSwipe = absDeltaY > threshold && absDeltaY > absDeltaX * 1.5;
    if (isVerticalSwipe) {
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
      
      if (deltaY > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (deltaY < 0 && onSwipeDown) {
        onSwipeDown();
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefaultOnSwipe]);

  return { onTouchStart, onTouchMove, onTouchEnd };
};
```

### Fix 3: Lower Threshold in FullscreenContentViewer

**File: `src/components/course/FullscreenContentViewer.tsx`**
```tsx
// Before
const swipeHandlers = useSwipeNavigation({
  onSwipeLeft: hasNext ? onNext : () => handleBoundarySwipe('left'),
  onSwipeRight: hasPrevious ? onPrevious : () => handleBoundarySwipe('right'),
  threshold: 80,
  preventDefaultOnSwipe: true
});

// After
const swipeHandlers = useSwipeNavigation({
  onSwipeLeft: hasNext ? onNext : () => handleBoundarySwipe('left'),
  onSwipeRight: hasPrevious ? onPrevious : () => handleBoundarySwipe('right'),
  threshold: 50
});
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/hooks/useSwipeNavigation.tsx` | Rewrite detection logic to evaluate swipe on touchEnd, not during touchMove. Lower ratio requirement from 2x to 1.5x |
| `src/components/course/FullscreenContentViewer.tsx` | Remove `touch-pan-y` class, use `touchAction: manipulation`, lower threshold to 50px |

---

## Why This Will Work

1. **No CSS conflict**: Removing `touch-pan-y` ensures JavaScript receives all touch events
2. **Reliable detection**: Evaluating on `touchEnd` means we always have final delta values
3. **Reasonable threshold**: 50px is comfortable for intentional swipes but not triggered accidentally
4. **Clear horizontal intent**: 1.5x ratio distinguishes horizontal swipes from diagonal scrolling
5. **Scrolling still works**: The content area still has `overflow-y-auto`, so vertical scrolling is unaffected

---

## Testing Recommendations

After implementation:
1. Open any course module
2. Click "Focus Mode" to enter fullscreen reader
3. Swipe left → should navigate to next module (or show "last module" toast)
4. Swipe right → should navigate to previous module (or show "first module" toast)
5. Scroll up/down → should scroll content normally without triggering navigation
