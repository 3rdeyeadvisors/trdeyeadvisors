import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { EnhancedMarkdownRenderer } from './EnhancedMarkdownRenderer';
import { cn } from '@/lib/utils';

interface FullscreenContentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
  currentIndex: number;
  totalModules: number;
  onNext: () => void;
  onPrevious: () => void;
  courseTitle?: string;
}

export const FullscreenContentViewer: React.FC<FullscreenContentViewerProps> = ({
  isOpen,
  onClose,
  content,
  title,
  currentIndex,
  totalModules,
  onNext,
  onPrevious,
  courseTitle
}) => {
  const { isFullscreen, enter, exit, containerRef } = useFullscreen();
  const contentRef = useRef<HTMLDivElement>(null);
  const hasNext = currentIndex < totalModules - 1;
  const hasPrevious = currentIndex > 0;

  // Swipe navigation
  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: hasNext ? onNext : undefined,
    onSwipeRight: hasPrevious ? onPrevious : undefined,
    threshold: 60
  });

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          if (hasNext) onNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          if (hasPrevious) onPrevious();
          break;
        case 'Escape':
          handleClose();
          break;
        case 'f':
        case 'F':
          if (!isFullscreen) {
            enter(containerRef.current);
          } else {
            exit();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious, isFullscreen, enter, exit]);

  // Auto-enter fullscreen on open
  useEffect(() => {
    if (isOpen && containerRef.current) {
      enter(containerRef.current);
    }
  }, [isOpen, enter]);

  const handleClose = useCallback(() => {
    if (isFullscreen) {
      exit();
    }
    onClose();
  }, [isFullscreen, exit, onClose]);

  // Scroll to top when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-background flex flex-col"
        {...swipeHandlers}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm safe-area-inset-top">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="shrink-0 min-h-[44px] min-w-[44px]"
              aria-label="Close fullscreen"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              {courseTitle && (
                <p className="text-xs text-muted-foreground truncate">{courseTitle}</p>
              )}
              <h1 className="text-sm font-semibold text-foreground truncate">
                {title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {currentIndex + 1} / {totalModules}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isFullscreen ? exit() : enter(containerRef.current)}
              className="min-h-[44px] min-w-[44px]"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-2 bg-background/80">
          {Array.from({ length: totalModules }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i === currentIndex
                  ? "bg-primary"
                  : i < currentIndex
                  ? "bg-primary/40"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-16 xl:px-24"
        >
          <div className="max-w-4xl mx-auto">
            <EnhancedMarkdownRenderer content={content} />
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="min-h-[48px] px-4 gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Swipe or use arrows to navigate</span>
              <span className="sm:hidden">← Swipe →</span>
            </div>

            <Button
              variant={hasNext ? "cosmic" : "outline"}
              onClick={hasNext ? onNext : handleClose}
              className="min-h-[48px] px-4 gap-2"
            >
              <span className="hidden sm:inline">{hasNext ? "Next" : "Finish"}</span>
              <span className="sm:hidden">{hasNext ? "Next" : "Done"}</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Touch hint overlay - shows briefly on first open */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="flex items-center gap-4 text-muted-foreground/50 text-lg">
            <ChevronLeft className="w-8 h-8 animate-pulse" />
            <span>Swipe to navigate</span>
            <ChevronRight className="w-8 h-8 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
