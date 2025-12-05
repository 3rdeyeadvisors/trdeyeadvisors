import { supabase } from "@/integrations/supabase/client";

interface TikTokEventProperties {
  currency?: string;
  value?: number;
  content_type?: string;
  content_id?: string;
  content_name?: string;
  quantity?: number;
}

interface TrackEventOptions {
  event: string;
  email?: string;
  userId?: string;
  properties?: TikTokEventProperties;
}

/**
 * Track a TikTok conversion event via server-side Events API
 * This provides more accurate tracking than pixel-only
 */
export async function trackTikTokEvent({
  event,
  email,
  userId,
  properties,
}: TrackEventOptions): Promise<void> {
  try {
    // Also fire the client-side pixel event
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track(event, properties);
    }

    // Send server-side event for more accurate tracking
    const { error } = await supabase.functions.invoke('tiktok-conversion', {
      body: {
        event,
        user: {
          email,
          external_id: userId,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        },
        properties,
        page: {
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        },
      },
    });

    if (error) {
      console.warn('TikTok server-side tracking error:', error);
    }
  } catch (err) {
    console.warn('Failed to track TikTok event:', err);
  }
}

// Convenience functions for common events
export const trackPurchase = (email: string, userId: string, value: number, currency = 'USD', contentName?: string) =>
  trackTikTokEvent({
    event: 'CompletePayment',
    email,
    userId,
    properties: { value, currency, content_name: contentName },
  });

export const trackSignUp = (email: string, userId: string) =>
  trackTikTokEvent({
    event: 'CompleteRegistration',
    email,
    userId,
  });

export const trackAddToCart = (contentId: string, contentName: string, value: number, currency = 'USD') =>
  trackTikTokEvent({
    event: 'AddToCart',
    properties: { content_id: contentId, content_name: contentName, value, currency },
  });

export const trackViewContent = (contentId: string, contentName: string) =>
  trackTikTokEvent({
    event: 'ViewContent',
    properties: { content_id: contentId, content_name: contentName },
  });

export const trackInitiateCheckout = (value: number, currency = 'USD') =>
  trackTikTokEvent({
    event: 'InitiateCheckout',
    properties: { value, currency },
  });
