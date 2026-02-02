import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: () => void;
}

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  horizontalRatio?: number;
  preventDefaultOnSwipe?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  horizontalRatio = 1.2,
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

    if (preventDefaultOnSwipe) {
      const deltaX = Math.abs(touchStartX.current - touchEndX.current);
      const deltaY = Math.abs(touchStartY.current - touchEndY.current);

      // If we've moved enough to show intent, and it's mostly horizontal
      // and we have horizontal handlers
      if (deltaX > 10 && deltaX > deltaY * horizontalRatio && (onSwipeLeft || onSwipeRight)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    }
  }, [preventDefaultOnSwipe, horizontalRatio, onSwipeLeft, onSwipeRight]);

  const onTouchCancel = useCallback(() => {
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if this is a horizontal swipe:
    // - Must exceed threshold
    // - Horizontal movement must be significantly greater than vertical (to distinguish from diagonal scrolling)
    const isHorizontalSwipe = absDeltaX > threshold && absDeltaX > (absDeltaY * horizontalRatio);

    if (isHorizontalSwipe) {
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
      
      if (deltaX > 0 && onSwipeLeft) {
        onSwipeLeft(); // Swipe left = go to next
      } else if (deltaX < 0 && onSwipeRight) {
        onSwipeRight(); // Swipe right = go to previous
      }

      // Reset after successful swipe to prevent double triggers
      onTouchCancel();
      return;
    }
    
    // Vertical swipe handling (optional)
    const isVerticalSwipe = absDeltaY > threshold && absDeltaY > absDeltaX;
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
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, horizontalRatio, preventDefaultOnSwipe, onTouchCancel]);

  return { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel };
};
