// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics with your measurement ID
export const GA_MEASUREMENT_ID = 'G-M2QLEVLMS2';

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track course enrollments
export const trackCourseEnrollment = (courseName: string) => {
  trackEvent('enroll', 'course', courseName);
};

// Track resource downloads
export const trackDownload = (resourceName: string) => {
  trackEvent('download', 'resource', resourceName);
};

// Track newsletter signups
export const trackNewsletterSignup = () => {
  trackEvent('signup', 'newsletter');
};

// Track video plays
export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('play', 'video', videoTitle);
};

// Track quiz completions
export const trackQuizCompletion = (quizName: string, score?: number) => {
  trackEvent('complete', 'quiz', quizName, score);
};