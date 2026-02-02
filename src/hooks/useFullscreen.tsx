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

  // Check if fullscreen is supported
  useEffect(() => {
    const checkSupport = () => {
      // Check if fullscreen API is available and enabled
      const isEnabled = !!(
        document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
      );

      setIsSupported(isEnabled);
    };
    
    checkSupport();
    // Re-check on focus as it might change
    window.addEventListener('focus', checkSupport);
    return () => window.removeEventListener('focus', checkSupport);
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
      } else if ((target as any).mozRequestFullScreen) {
        await (target as any).mozRequestFullScreen();
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
      const fullscreenElement = document.fullscreenElement ||
                                (document as any).webkitFullscreenElement ||
                                (document as any).mozFullScreenElement ||
                                (document as any).msFullscreenElement;

      if (fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
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
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('mozfullscreenchange', handleChange);
    document.addEventListener('MSFullscreenChange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('mozfullscreenchange', handleChange);
      document.removeEventListener('MSFullscreenChange', handleChange);
    };
  }, []);

  return { isFullscreen, isSupported, enter, exit, toggle, containerRef };
};
