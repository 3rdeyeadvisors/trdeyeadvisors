import { useState, useEffect, useRef } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

// Check if touch started inside a carousel
const isInsideCarousel = (element: HTMLElement | null): boolean => {
  let current = element;
  while (current) {
    if (
      current.hasAttribute('data-carousel') ||
      current.classList.contains('mobile-carousel-container') ||
      current.classList.contains('embla')
    ) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
};

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  disabled = false
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  // Use refs to avoid stale closure issues
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const isCarouselTouchRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const isRefreshingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    pullDistanceRef.current = pullDistance;
  }, [pullDistance]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Skip if carousel is currently dragging (class-based coordination)
      if (document.body.classList.contains('carousel-dragging')) {
        isCarouselTouchRef.current = true;
        return;
      }

      // Check if touch started inside a carousel
      const target = e.target as HTMLElement;
      if (isInsideCarousel(target)) {
        isCarouselTouchRef.current = true;
        return;
      }

      isCarouselTouchRef.current = false;

      // Only start pull-to-refresh if at top of page
      if (window.scrollY <= 0) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Skip if this is a carousel touch or carousel is dragging
      if (isCarouselTouchRef.current || document.body.classList.contains('carousel-dragging')) {
        return;
      }

      if (!isPullingRef.current || isRefreshingRef.current) return;

      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startYRef.current);

      // Only allow pull down, not up
      if (distance > 0 && window.scrollY <= 0) {
        // Apply resistance curve
        const resistedDistance = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(resistedDistance);
        
        // Prevent default scrolling when pulling down
        if (resistedDistance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      // Skip if this was a carousel touch
      if (isCarouselTouchRef.current) {
        isCarouselTouchRef.current = false;
        return;
      }

      if (!isPullingRef.current) return;

      isPullingRef.current = false;

      const currentPullDistance = pullDistanceRef.current;
      
      if (currentPullDistance >= threshold && !isRefreshingRef.current) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setPullDistance(0);
    };

    // Use capture phase for touchstart to detect carousel early
    document.body.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.body.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.body.removeEventListener('touchstart', handleTouchStart, { capture: true });
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, threshold, onRefresh]);

  return {
    isRefreshing,
    pullDistance,
    isTriggered: pullDistance >= threshold
  };
};
