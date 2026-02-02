import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { EnhancedMarkdownRenderer } from './EnhancedMarkdownRenderer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  type?: 'text' | 'video' | 'interactive';
  videoUrl?: string;
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
  courseTitle,
  type = 'text',
  videoUrl
}) => {
  const { isFullscreen, isSupported, enter, exit, containerRef } = useFullscreen();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showUI, setShowUI] = useState(true);
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasNext = currentIndex < totalModules - 1;
  const hasPrevious = currentIndex > 0;

  const resetUITimer = useCallback(() => {
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    if (showUI) {
      uiTimeoutRef.current = setTimeout(() => setShowUI(false), 4000);
    }
  }, [showUI]);

  useEffect(() => {
    if (showUI) {
      resetUITimer();
    }
    return () => {
      if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    };
  }, [showUI, resetUITimer]);

  const swipeOccurredRef = useRef(false);

  const toggleUI = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // If a swipe just happened, don't toggle UI
    if (swipeOccurredRef.current) {
      swipeOccurredRef.current = false;
      return;
    }

    // If we're clicking on an interactive element (button, link, iframe), don't toggle
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('iframe')) {
      return;
    }
    setShowUI(prev => !prev);
  }, []);

  // Don't auto-enter fullscreen - it doesn't work in iframes and causes errors
  // The overlay mode works great without native fullscreen API

  const handleClose = useCallback(() => {
    if (isFullscreen) {
      exit();
    }
    onClose();
  }, [isFullscreen, exit, onClose]);

  // Boundary handlers for swipe feedback
  const handleBoundarySwipe = useCallback((direction: 'left' | 'right') => {
    toast.info(direction === 'left' ? "You're at the last module" : "You're at the first module");
  }, []);

  // Swipe navigation with lower threshold for reliable detection
  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => {
      swipeOccurredRef.current = true;
      if (hasNext) onNext();
      else handleBoundarySwipe('left');
    },
    onSwipeRight: () => {
      swipeOccurredRef.current = true;
      if (hasPrevious) onPrevious();
      else handleBoundarySwipe('right');
    },
    threshold: 40,
    preventDefaultOnSwipe: true
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
          // Only try fullscreen if supported (not in iframe)
          if (isSupported) {
            if (!isFullscreen) {
              enter(containerRef.current);
            } else {
              exit();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious, isFullscreen, isSupported, enter, exit, containerRef, handleClose]);

  // Scroll to top when content changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-background flex flex-col overflow-hidden"
        onClick={toggleUI}
        {...swipeHandlers}
      >
        {/* Subtle persistent exit button when UI is hidden */}
        <AnimatePresence>
          {!showUI && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              className="fixed top-4 right-4 z-[10000]"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="bg-background/20 backdrop-blur-md rounded-full w-10 h-10 border border-white/10"
                aria-label="Exit focus mode"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={false}
          animate={{
            y: showUI ? 0 : -100,
            opacity: showUI ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm safe-area-inset-top z-10"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="shrink-0 min-h-[44px] min-w-[44px]"
              aria-label="Close focus mode"
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
            {/* Only show fullscreen button if supported (not in iframe) */}
            {isSupported && (
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
            )}
          </div>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={false}
          animate={{
            opacity: showUI ? 1 : 0,
            y: showUI ? 0 : -20
          }}
          transition={{ duration: 0.3 }}
          className="flex justify-center gap-1.5 py-2 bg-background/80 z-10"
        >
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
        </motion.div>

        {/* Content - improved touch action */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-16 xl:px-24 scroll-smooth"
          style={{ touchAction: 'pan-y' }}
          onScroll={resetUITimer}
        >
          <div className="max-w-4xl mx-auto">
            {type === 'video' && videoUrl && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-2xl border border-border">
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <EnhancedMarkdownRenderer content={content} />
          </div>
        </div>

        {/* Navigation Footer */}
        <motion.div
          initial={false}
          animate={{
            y: showUI ? 0 : 100,
            opacity: showUI ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 safe-area-inset-bottom z-10"
        >
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
        </motion.div>

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
