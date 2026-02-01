import { useState, useEffect, useCallback, useRef } from 'react';

interface FullscreenAPI {
  isFullscreen: boolean;
  isSupported: boolean;
  enter: (element?: HTMLElement | null) => Promise<boolean>;
  exit: () => Promise<void>;
  toggle: (element?: HTMLElement | null) => Promise<void>;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useFullscreen = (): FullscreenAPI => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if fullscreen is supported (not in iframe, API available)
  useEffect(() => {
    const checkSupport = () => {
      try {
        // Check if fullscreen API is available
        const hasFullscreenAPI = !!(
          document.documentElement.requestFullscreen ||
          (document.documentElement as any).webkitRequestFullscreen ||
          (document.documentElement as any).msRequestFullscreen
        );
        
        // Allow attempting fullscreen regardless of iframe status
        // The browser will handle if it's blocked by the iframe 'allow' attribute
        setIsSupported(hasFullscreenAPI);
      } catch {
        // If we can't access window.top, we're in a cross-origin iframe
        setIsSupported(false);
      }
    };
    
    checkSupport();
  }, []);

  const enter = useCallback(async (element?: HTMLElement | null): Promise<boolean> => {
    const target = element || containerRef.current;
    if (!target) {
      console.warn('Fullscreen: No element provided');
      return false;
    }

    if (!isSupported) {
      console.warn('Fullscreen: Not supported in this context (likely iframe)');
      return false;
    }

    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
        return true;
      } else if ((target as any).webkitRequestFullscreen) {
        await (target as any).webkitRequestFullscreen();
        return true;
      } else if ((target as any).msRequestFullscreen) {
        await (target as any).msRequestFullscreen();
        return true;
      }
    } catch (error) {
      // Silently fail - fullscreen is not critical functionality
      console.warn('Fullscreen request failed (this is normal in embedded contexts)');
    }
    return false;
  }, [isSupported]);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      // Silently fail
    }
  }, []);

  const toggle = useCallback(async (element?: HTMLElement | null) => {
    if (isFullscreen) {
      await exit();
    } else {
      await enter(element);
    }
  }, [isFullscreen, enter, exit]);

  useEffect(() => {
    const handleChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('msfullscreenchange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
    };
  }, []);

  return { isFullscreen, isSupported, enter, exit, toggle, containerRef };
};
