import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get fresh session to avoid stale token issues
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !freshSession) {
        console.error('[Subscription] No active session:', sessionError);
        setSubscription(null);
        setLoading(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${freshSession.access_token}`,
        },
      });

      if (fnError) {
        console.error('[Subscription] Error checking subscription:', fnError);
        setError(fnError.message);
        setSubscription(defaultSubscription);
        return;
      }

      if (data.error) {
        console.error('[Subscription] API error:', data.error);
        setError(data.error);
        setSubscription(defaultSubscription);
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
  }, [user]);

  // Check subscription on mount and when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, checkSubscription]);

  // Periodically refresh subscription status (every 60 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

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
