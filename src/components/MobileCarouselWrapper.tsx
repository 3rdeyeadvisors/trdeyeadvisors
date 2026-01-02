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
  const startTime = useRef(0);
  const containerWidth = useRef(0);

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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    containerWidth.current = containerRef.current.offsetWidth;
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    // Apply resistance at edges
    let offset = diff;
    if ((currentIndex === 0 && diff > 0) || (currentIndex === childCount - 1 && diff < 0)) {
      offset = diff * 0.3; // Resistance factor
    }
    
    setDragOffset(offset);
  }, [isDragging, currentIndex, childCount]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const elapsed = Date.now() - startTime.current;
    const velocity = Math.abs(dragOffset) / elapsed;
    const threshold = containerWidth.current * 0.2; // 20% of container width
    const velocityThreshold = 0.5; // pixels per ms
    
    let newIndex = currentIndex;
    
    // Swipe detection based on distance or velocity
    if (dragOffset > threshold || (dragOffset > 30 && velocity > velocityThreshold)) {
      // Swipe right - go to previous
      newIndex = Math.max(0, currentIndex - 1);
    } else if (dragOffset < -threshold || (dragOffset < -30 && velocity > velocityThreshold)) {
      // Swipe left - go to next
      newIndex = Math.min(childCount - 1, currentIndex + 1);
    }
    
    setCurrentIndex(newIndex);
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, currentIndex, childCount]);

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
