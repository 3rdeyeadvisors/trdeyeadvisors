import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultOnSwipe?: boolean;
}

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
  const isSwiping = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    const deltaX = Math.abs(touchEndX.current - touchStartX.current);
    const deltaY = Math.abs(touchEndY.current - touchStartY.current);
    
    // Only mark as horizontal swipe if deltaX is significantly larger than deltaY
    // This prevents accidental swipes while scrolling
    if (deltaX > threshold && deltaX > deltaY * 2) {
      isSwiping.current = true;
    }
  }, [threshold]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
      
      if (deltaX > 0 && onSwipeLeft) {
        onSwipeLeft(); // Swipe left = go to next
      } else if (deltaX < 0 && onSwipeRight) {
        onSwipeRight(); // Swipe right = go to previous
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (preventDefaultOnSwipe) {
        e.preventDefault();
      }
      
      if (deltaY > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (deltaY < 0 && onSwipeDown) {
        onSwipeDown();
      }
    }
    
    // Reset
    isSwiping.current = false;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefaultOnSwipe]);

  return { onTouchStart, onTouchMove, onTouchEnd };
};
