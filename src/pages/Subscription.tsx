import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, Crown, Loader2, Sparkles, Calendar, CreditCard } from 'lucide-react';
import SEO from '@/components/SEO';

const Subscription = () => {
  const { user, session } = useAuth();
  const { subscription, loading: subLoading, checkSubscription, hasAccess, isTrialing } = useSubscription();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutLoading, setCheckoutLoading] = useState<'monthly' | 'annual' | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Auto-trigger checkout if user came from auth with a plan parameter
  useEffect(() => {
    const planFromUrl = searchParams.get('plan') as 'monthly' | 'annual' | null;
    if (planFromUrl && user && session && !hasAccess && !subLoading) {
      // Clear the plan param from URL
      setSearchParams({});
      // Trigger checkout
      handleSubscribe(planFromUrl);
    }
  }, [user, session, hasAccess, subLoading, searchParams]);

  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    if (!user || !session) {
      navigate(`/auth?plan=${plan}`);
      return;
    }

    setCheckoutLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user || !session) {
      toast.error('Please sign in first');
      return;
    }

    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Subscription - 3rdeyeadvisors"
        description="Subscribe to 3rdeyeadvisors for full access to DeFi courses, tutorials, and premium content. Start your 14-day free trial today."
        keywords="defi subscription, crypto education, blockchain courses, defi membership"
      />

      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">14-Day Free Trial</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Unlock Your DeFi Potential
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Full access to all courses, tutorials, and premium content. 
              Cancel anytime during your trial - no questions asked.
            </p>
          </div>

          {/* Current Status */}
          {hasAccess && subscription && (
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle className="text-foreground">Your Subscription</CardTitle>
                      <CardDescription>
                        {subscription.isGrandfathered 
                          ? 'Grandfathered - Lifetime Free Access'
                          : subscription.isAdmin
                          ? 'Admin - Full Access'
                          : subscription.plan === 'annual' 
                          ? 'Annual Plan' 
                          : 'Monthly Plan'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={isTrialing ? 'secondary' : 'default'} className="text-sm">
                    {isTrialing ? 'Free Trial' : 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {subscription.trialEnd && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Trial ends: {formatDate(subscription.trialEnd)}</span>
                    </div>
                  )}
                  {subscription.subscriptionEnd && !subscription.isGrandfathered && !subscription.isAdmin && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {subscription.cancelAtPeriodEnd 
                          ? `Expires: ${formatDate(subscription.subscriptionEnd)}`
                          : `Renews: ${formatDate(subscription.subscriptionEnd)}`}
                      </span>
                    </div>
                  )}
                </div>
                {!subscription.isGrandfathered && !subscription.isAdmin && (
                  <Button 
                    onClick={handleManageSubscription} 
                    variant="outline"
                    disabled={portalLoading}
                  >
                    {portalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Opening...
                      </>
                    ) : (
                      'Manage Subscription'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pricing Cards */}
          {!hasAccess && (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Monthly Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Monthly</CardTitle>
                  <CardDescription>Full access, billed monthly</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {[
                      '14-day free trial',
                      'All DeFi courses & tutorials',
                      'Exclusive content & resources',
                      'Community access',
                      'Cancel anytime',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleSubscribe('monthly')}
                    disabled={checkoutLoading !== null || subLoading}
                  >
                    {checkoutLoading === 'monthly' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Annual Plan */}
              <Card className="relative border-primary">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Premium
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Annual</CardTitle>
                  <CardDescription>Full year commitment</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">$1,999</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {[
                      '14-day free trial',
                      'All DeFi courses & tutorials',
                      'Exclusive content & resources',
                      'Community access',
                      'Priority support',
                      'Locked-in annual rate',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant="default"
                    onClick={() => handleSubscribe('annual')}
                    disabled={checkoutLoading !== null || subLoading}
                  >
                    {checkoutLoading === 'annual' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FAQ */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 text-left">
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  How does the free trial work?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your 14-day trial starts immediately with full access to all content. 
                  You won't be charged until the trial ends. Even if you add a payment method, 
                  the trial runs for the full 14 days.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Cancel during your trial and you won't be charged. After that, 
                  cancel anytime and you'll keep access until the end of your billing period.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards and debit cards through our secure 
                  Stripe payment processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
