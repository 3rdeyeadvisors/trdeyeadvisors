import { useState, useEffect, useCallback, useRef } from 'react';

interface FullscreenAPI {
  isFullscreen: boolean;
  enter: (element?: HTMLElement | null) => Promise<void>;
  exit: () => Promise<void>;
  toggle: (element?: HTMLElement | null) => Promise<void>;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useFullscreen = (): FullscreenAPI => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const enter = useCallback(async (element?: HTMLElement | null) => {
    const target = element || containerRef.current;
    if (!target) return;

    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else if ((target as any).webkitRequestFullscreen) {
        await (target as any).webkitRequestFullscreen();
      } else if ((target as any).msRequestFullscreen) {
        await (target as any).msRequestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.warn('Exit fullscreen failed:', error);
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

  return { isFullscreen, enter, exit, toggle, containerRef };
};
