import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MobileCarouselWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCarouselWrapper: React.FC<MobileCarouselWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const containerWidth = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const childrenArray = React.Children.toArray(children);
  const childCount = childrenArray.length;

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        containerWidth.current = containerRef.current.offsetWidth;
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Native touch event handlers for consistent behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      containerWidth.current = container.offsetWidth;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      startTime.current = Date.now();
      isHorizontalSwipe.current = null;
      setIsDragging(true);
      setDragOffset(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX.current;
      const diffY = currentY - startY.current;
      
      // Determine swipe direction on first significant movement
      if (isHorizontalSwipe.current === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
        isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
      }
      
      // Only handle horizontal swipes
      if (isHorizontalSwipe.current !== true) {
        return;
      }
      
      // Prevent scroll and stop pull-to-refresh
      e.preventDefault();
      e.stopImmediatePropagation();
      
      // Apply resistance at edges
      let offset = diffX;
      if ((currentIndex === 0 && diffX > 0) || (currentIndex === childCount - 1 && diffX < 0)) {
        offset = diffX * 0.3;
      }
      
      setDragOffset(offset);
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const elapsed = Date.now() - startTime.current;
      const velocity = Math.abs(dragOffset) / elapsed;
      const threshold = containerWidth.current * 0.2;
      const velocityThreshold = 0.5;
      
      let newIndex = currentIndex;
      
      if (isHorizontalSwipe.current === true) {
        if (dragOffset > threshold || (dragOffset > 30 && velocity > velocityThreshold)) {
          newIndex = Math.max(0, currentIndex - 1);
        } else if (dragOffset < -threshold || (dragOffset < -30 && velocity > velocityThreshold)) {
          newIndex = Math.min(childCount - 1, currentIndex + 1);
        }
      }
      
      setCurrentIndex(newIndex);
      setIsDragging(false);
      setDragOffset(0);
      isHorizontalSwipe.current = null;
    };

    // Use passive: false for touchmove to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, currentIndex, childCount, dragOffset]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(childCount - 1, index)));
  }, [childCount]);

  // Calculate transform
  const baseTransform = -currentIndex * 100;
  const dragPercent = containerWidth.current > 0 ? (dragOffset / containerWidth.current) * 100 : 0;
  const transform = baseTransform + dragPercent;

  return (
    <div className={cn("md:hidden", className)}>
      <div 
        ref={containerRef}
        className="mobile-carousel-container relative overflow-hidden"
        data-carousel="true"
        data-dragging={isDragging}
      >
        <div
          className="mobile-carousel-track flex"
          style={{
            transform: `translateX(${transform}%)`,
            transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {childrenArray.map((child, index) => (
            <div 
              key={index}
              className="min-w-full w-full flex-shrink-0 px-2"
            >
              {child}
            </div>
          ))}
        </div>
        
        {/* Swipe hint - only show on first slide initially */}
        {currentIndex === 0 && childCount > 1 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 animate-pulse pointer-events-none">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Dot indicators */}
      {childCount > 1 && (
        <div className="flex justify-center gap-2 mt-4 pb-2">
          {Array.from({ length: childCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex 
                  ? 'bg-primary w-4' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground">← Swipe to see more →</span>
      </div>
    </div>
  );
};
