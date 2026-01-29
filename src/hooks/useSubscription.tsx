import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface SubscriptionStatus {
  subscribed: boolean;
  isGrandfathered: boolean;
  isAdmin: boolean;
  isFounder?: boolean;
  plan: 'monthly' | 'annual' | 'grandfathered' | 'founding_33' | 'admin' | 'trial' | null;
  status?: 'active' | 'trialing' | 'canceled' | 'past_due';
  subscriptionEnd: string | null;
  trialEnd: string | null;
  daysRemaining?: number;
  isDbTrial?: boolean;
  trialExpired?: boolean;
  cancelAtPeriodEnd?: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  hasAccess: boolean;
  isTrialing: boolean;
  isDbTrial: boolean;
  daysRemaining: number | null;
  trialExpired: boolean;
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
    if (authLoading || !user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Get a fresh access token before making the request
      let accessToken = session.access_token;
      
      // If this is a retry, refresh the session first
      if (retryCountRef.current > 0) {
        console.log('[Subscription] Refreshing session before retry');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.warn('[Subscription] Session refresh failed:', refreshError.message);
          // Continue with existing token - the edge function will handle it
        } else if (refreshData.session) {
          accessToken = refreshData.session.access_token;
          console.log('[Subscription] Session refreshed successfully');
        }
      }

      const { data, error: fnError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (fnError) {
        const errorMessage = fnError.message || String(fnError);
        
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
        
        console.warn('[Subscription] Error checking subscription (not signing out):', errorMessage);
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = Math.pow(2, retryCountRef.current) * 1000;
          console.log(`[Subscription] Retrying in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`);
          setTimeout(() => checkSubscription(), delay);
          return;
        }
        
        setError(fnError.message);
        setSubscription(defaultSubscription);
        setLoading(false);
        return;
      }

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

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (user && session) {
      checkSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, session, authLoading, checkSubscription]);

  useEffect(() => {
    if (!user || !session || authLoading) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [user, session, authLoading, checkSubscription]);

  const hasAccess = subscription?.subscribed || false;
  const isTrialing = subscription?.status === 'trialing';
  const isDbTrial = subscription?.isDbTrial || false;
  const daysRemaining = subscription?.daysRemaining ?? null;
  const trialExpired = subscription?.trialExpired || false;

  const value = {
    subscription,
    loading,
    error,
    checkSubscription,
    hasAccess,
    isTrialing,
    isDbTrial,
    daysRemaining,
    trialExpired,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
