import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface SubscriptionStatus {
  subscribed: boolean;
  isGrandfathered: boolean;
  isAdmin: boolean;
  plan: 'monthly' | 'annual' | 'grandfathered' | 'admin' | null;
  status?: 'active' | 'trialing' | 'canceled' | 'past_due';
  subscriptionEnd: string | null;
  trialEnd: string | null;
  cancelAtPeriodEnd?: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  hasAccess: boolean;
  isTrialing: boolean;
}

const defaultSubscription: SubscriptionStatus = {
  subscribed: false,
  isGrandfathered: false,
  isAdmin: false,
  plan: null,
  subscriptionEnd: null,
  trialEnd: null,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, session, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const checkSubscription = useCallback(async () => {
    // Don't check if auth is still loading or no user/session
    if (authLoading || !user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Use the existing session token - don't force refresh
      // This avoids hitting rate limits and causing unnecessary logouts
      const { data, error: fnError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (fnError) {
        const errorMessage = fnError.message || String(fnError);
        
        // Only sign out on DEFINITIVE session invalid errors
        const isSessionInvalid = 
          errorMessage.includes('session_not_found') || 
          errorMessage.includes('Invalid Refresh Token') ||
          errorMessage.includes('JWT expired');
        
        if (isSessionInvalid) {
          console.error('[Subscription] Session is definitely invalid, signing out');
          await supabase.auth.signOut();
          setSubscription(null);
          setLoading(false);
          return;
        }
        
        // For other errors (network, rate limit, etc), just skip this check
        // Don't sign out - the session might still be valid
        console.warn('[Subscription] Error checking subscription (not signing out):', errorMessage);
        
        // Retry logic with exponential backoff for transient errors
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = Math.pow(2, retryCountRef.current) * 1000; // 2s, 4s, 8s
          console.log(`[Subscription] Retrying in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
          setTimeout(() => checkSubscription(), delay);
          return;
        }
        
        setError(fnError.message);
        setSubscription(defaultSubscription);
        setLoading(false);
        return;
      }

      // Reset retry count on success
      retryCountRef.current = 0;

      if (data.error) {
        console.error('[Subscription] API error:', data.error);
        setError(data.error);
        setSubscription(defaultSubscription);
        setLoading(false);
        return;
      }

      console.log('[Subscription] Status:', data);
      setSubscription(data as SubscriptionStatus);
    } catch (err) {
      console.error('[Subscription] Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'Failed to check subscription');
      setSubscription(defaultSubscription);
    } finally {
      setLoading(false);
    }
  }, [user, session, authLoading]);

  // Check subscription when auth is ready and user exists
  useEffect(() => {
    if (authLoading) {
      // Auth still loading, keep subscription loading too
      return;
    }
    
    if (user && session) {
      checkSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, session, authLoading, checkSubscription]);

  // Periodically refresh subscription status (every 5 minutes instead of 60 seconds)
  // This reduces rate limit issues significantly
  useEffect(() => {
    if (!user || !session || authLoading) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [user, session, authLoading, checkSubscription]);

  const hasAccess = subscription?.subscribed || false;
  const isTrialing = subscription?.status === 'trialing';

  const value = {
    subscription,
    loading,
    error,
    checkSubscription,
    hasAccess,
    isTrialing,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
