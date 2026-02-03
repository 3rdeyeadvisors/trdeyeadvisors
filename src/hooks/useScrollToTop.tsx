import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Check if we are in a course module view - smooth scroll might be less jarring
    const isModuleView = pathname.includes('/module/');
    window.scrollTo({
      top: 0,
      behavior: isModuleView ? 'smooth' : 'instant'
    });
  }, [pathname]);
};

export default useScrollToTop;
