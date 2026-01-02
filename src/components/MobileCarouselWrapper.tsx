import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface MobileCarouselWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCarouselWrapper: React.FC<MobileCarouselWrapperProps> = ({ 
  children, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;
  
  const minSwipeDistance = 50;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const diff = currentTouch - touchStart;
    setTranslateX(diff);
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setTranslateX(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < totalSlides - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    
    setIsDragging(false);
    setTranslateX(0);
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, currentIndex, totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className={cn("md:hidden", className)}>
      <div 
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? translateX : 0}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {childrenArray.map((child, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0 px-2"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      
      {/* Dot indicators */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                currentIndex === index 
                  ? "bg-primary w-4" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
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
