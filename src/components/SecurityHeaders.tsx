import { useEffect } from 'react';

// Security headers component to set important security headers
const SecurityHeaders = () => {
  useEffect(() => {
    // Set security headers via meta tags where possible
    const setSecurityHeaders = () => {
      // Content Security Policy - More restrictive
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://esm.sh; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.resend.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';";
      document.head.appendChild(cspMeta);

      // X-Content-Type-Options
      const xContentTypeMeta = document.createElement('meta');
      xContentTypeMeta.httpEquiv = 'X-Content-Type-Options';
      xContentTypeMeta.content = 'nosniff';
      document.head.appendChild(xContentTypeMeta);

      // X-Frame-Options
      const xFrameMeta = document.createElement('meta');
      xFrameMeta.httpEquiv = 'X-Frame-Options';
      xFrameMeta.content = 'DENY';
      document.head.appendChild(xFrameMeta);

      // X-XSS-Protection
      const xXSSMeta = document.createElement('meta');
      xXSSMeta.httpEquiv = 'X-XSS-Protection';
      xXSSMeta.content = '1; mode=block';
      document.head.appendChild(xXSSMeta);

      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);
    };

    setSecurityHeaders();
  }, []);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;