import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveAccount, useIsAutoConnecting } from "thirdweb/react";
import { useAuth } from "@/components/auth/AuthProvider";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Wallet, 
  CheckCircle, 
  Circle, 
  Lock,
  ArrowRight,
  LogIn,
  Loader2
} from "lucide-react";
import WalletConnectButton from "@/components/web3/WalletConnectButton";
import NFTOwnershipCheck from "@/components/web3/NFTOwnershipCheck";
import NFTPurchaseButton from "@/components/web3/NFTPurchaseButton";
import EnzymeVaultCard from "@/components/web3/EnzymeVaultCard";
import CryptoDisclaimer from "@/components/web3/CryptoDisclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

type Step = 'auth' | 'disclaimer' | 'wallet' | 'nft' | 'vault';

const VaultAccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, ready } = useAuth();
  const account = useActiveAccount();
  const isAutoConnecting = useIsAutoConnecting();
  const { toast } = useToast();
  const mountTime = useRef(Date.now());
  const authRedirectTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Persist step state across wallet modal interactions
  const [currentStep, setCurrentStepInternal] = useState<Step>(() => {
    const savedStep = sessionStorage.getItem('vault_step') as Step | null;
    console.log('[Vault] Initial step from storage:', savedStep);
    return savedStep && ['auth', 'disclaimer', 'wallet', 'nft', 'vault'].includes(savedStep) 
      ? savedStep 
      : 'auth';
  });
  
  // Wrapper to persist step changes
  const setCurrentStep = (step: Step) => {
    console.log('[Vault] Setting step:', step);
    sessionStorage.setItem('vault_step', step);
    setCurrentStepInternal(step);
  };

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('vault_disclaimer_accepted') === 'true';
  });
  const [hasNFT, setHasNFT] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [checkingWhitelist, setCheckingWhitelist] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [walletStabilized, setWalletStabilized] = useState(false);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (authRedirectTimer.current) {
        clearTimeout(authRedirectTimer.current);
      }
    };
  }, []);

  // Track page view
  useEffect(() => {
    trackEvent('vault_page_view', 'vault', currentStep);
  }, []);

  // Wait for wallet to stabilize before making auth decisions
  useEffect(() => {
    if (!isAutoConnecting && !walletStabilized) {
      // Give thirdweb a moment to finish auto-connecting
      const timer = setTimeout(() => {
        console.log('[Vault] Wallet state stabilized, isAutoConnecting:', isAutoConnecting, 'account:', !!account);
        setWalletStabilized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAutoConnecting, walletStabilized, account]);

  // Auto-redirect to auth if not logged in (runs once when ready AND wallet stabilized)
  useEffect(() => {
    if (!ready || authLoading || !walletStabilized) return;
    
    console.log('[Vault] Auth check - user:', !!user, 'initialized:', initialized, 'step:', currentStep, 'account:', !!account);
    
    // Check if user has progressed beyond auth step - if so, trust the stored state
    const savedStep = sessionStorage.getItem('vault_step');
    const hasProgress = savedStep && savedStep !== 'auth';
    
    if (!user) {
      // If user has made progress, give more time before redirecting (wallet reconnection may restore session)
      if (hasProgress) {
        console.log('[Vault] User has progress, waiting before redirect...');
        
        // Only redirect after grace period - allows for page reloads during wallet connection
        if (!authRedirectTimer.current) {
          authRedirectTimer.current = setTimeout(() => {
            // Re-check user state after grace period
            if (!user) {
              console.log('[Vault] Grace period expired, redirecting to auth');
              sessionStorage.removeItem('vault_step'); // Clear stale progress
              navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
            }
          }, 500);
        }
        return;
      }
      
      // Fresh visit with no progress - redirect immediately
      const alreadyRedirecting = sessionStorage.getItem('vault_auth_redirect');
      if (alreadyRedirecting) {
        console.log('[Vault] Already redirecting, skipping');
        return;
      }
      
      sessionStorage.setItem('vault_auth_redirect', 'true');
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
    
    // Clear redirect flag and timer
    sessionStorage.removeItem('vault_auth_redirect');
    if (authRedirectTimer.current) {
      clearTimeout(authRedirectTimer.current);
      authRedirectTimer.current = null;
    }
    
    // Only initialize step ONCE when user is confirmed
    if (!initialized) {
      setInitialized(true);
      
      console.log('[Vault] Initializing - savedStep:', savedStep, 'disclaimerAccepted:', disclaimerAccepted, 'account:', !!account);
      
      if (!savedStep || savedStep === 'auth') {
        if (disclaimerAccepted) {
          setCurrentStep(account ? 'nft' : 'wallet');
        } else {
          setCurrentStep('disclaimer');
        }
      }
    }
  }, [ready, authLoading, user, initialized, walletStabilized]);

  // Check whitelist when wallet connects
  useEffect(() => {
    const checkWhitelist = async () => {
      if (!user || !account?.address) return;
      
      setCheckingWhitelist(true);
      try {
        const { data: whitelist } = await supabase
          .from('vault_whitelist')
          .select('is_active')
          .eq('wallet_address', account.address.toLowerCase())
          .eq('user_id', user.id)
          .single();
        
        if (whitelist?.is_active) {
          setIsWhitelisted(true);
          setHasNFT(true);
          setCurrentStep('vault');
        }
      } finally {
        setCheckingWhitelist(false);
      }
    };

    if (disclaimerAccepted && account) {
      checkWhitelist();
    }
  }, [user, account?.address, disclaimerAccepted]);

  // Update step when wallet connects - only if we're on wallet step
  // Wait for wallet to stabilize AND ensure minimum time since mount
  useEffect(() => {
    if (account && disclaimerAccepted && !isWhitelisted && currentStep === 'wallet' && walletStabilized) {
      const timeSinceMount = Date.now() - mountTime.current;
      const delay = Math.max(200, 500 - timeSinceMount); // Ensure at least 500ms since mount
      
      const timer = setTimeout(() => {
        console.log('[Vault] Wallet connected and stabilized, moving to nft step');
        setCurrentStep('nft');
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [account, disclaimerAccepted, isWhitelisted, currentStep, walletStabilized]);

  // Verify NFT ownership on backend
  const verifyOwnership = async () => {
    if (!account?.address || !user) return;

    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-nft-ownership', {
        body: { 
          walletAddress: account.address,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.isOwner) {
        setIsWhitelisted(true);
        setCurrentStep('vault');
        trackEvent('vault_verified', 'vault', account.address, data.balance);
        toast({
          title: "Verified!",
          description: "Your NFT ownership has been verified. Welcome to the vault!",
        });
      } else {
        trackEvent('vault_no_nft', 'vault', account.address);
      }
    } catch (error) {
      console.error('Verification error:', error);
      trackEvent('vault_error', 'vault', String(error));
      toast({
        title: "Verification Failed",
        description: "Could not verify NFT ownership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    localStorage.setItem('vault_disclaimer_accepted', 'true');
    trackEvent('vault_disclaimer_accepted', 'vault');
    setCurrentStep('wallet');
  };

  const handleNFTOwnershipVerified = useCallback((balance: number) => {
    if (balance > 0) {
      setHasNFT(true);
      verifyOwnership();
    }
  }, [account?.address, user]);

  const steps = [
    { id: 'auth', label: 'Sign In', icon: LogIn },
    { id: 'disclaimer', label: 'Disclaimer', icon: Shield },
    { id: 'wallet', label: 'Connect Wallet', icon: Wallet },
    { id: 'nft', label: 'Verify NFT', icon: Shield },
    { id: 'vault', label: 'Vault Access', icon: Lock },
  ];

  const getStepStatus = (stepId: Step) => {
    const stepOrder: Step[] = ['auth', 'disclaimer', 'wallet', 'nft', 'vault'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  // Show loading during initial auth check OR wallet auto-connect
  if (!ready || authLoading || !walletStabilized) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {!walletStabilized ? 'Reconnecting wallet...' : 'Loading...'}
          </p>
        </div>
      </Layout>
    );
  }

  // If no user and hasn't redirected yet, show loading (redirect will happen)
  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Vault Access | 3EA"
        description="Access the exclusive 3EA Enzyme Vault. NFT holders get access to managed DeFi strategies."
      />

      <div className="container max-w-4xl py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-4">
            <Shield className="h-3 w-3 mr-1" />
            NFT-Gated Access
          </Badge>
          <h1 className="text-4xl font-bold">3EA Enzyme Vault</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exclusive access to managed DeFi strategies for 3EA NFT holders. 
            Connect your wallet and verify ownership to access the vault.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id as Step);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg min-h-[44px] ${
                  status === 'complete' ? 'bg-success/10 text-success' :
                  status === 'current' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {status === 'complete' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : status === 'current' ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 2: Disclaimer */}
          {currentStep === 'disclaimer' && (
            <CryptoDisclaimer 
              onAccept={handleDisclaimerAccept}
              onDecline={() => navigate('/')}
            />
          )}

          {/* Step 3: Connect Wallet */}
          {currentStep === 'wallet' && (
            <Card>
              <CardHeader className="text-center sm:text-left">
                <CardTitle className="flex items-center justify-center sm:justify-start gap-2">
                  <Wallet className="h-5 w-5 shrink-0" />
                  <span>Connect Your Wallet</span>
                </CardTitle>
                <CardDescription>
                  Connect an external wallet that holds your 3EA Access NFT
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 pt-2">
                <div className="w-full flex justify-center">
                  <WalletConnectButton />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Supported: MetaMask, Coinbase Wallet, Rainbow, WalletConnect
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 4: NFT Verification */}
          {currentStep === 'nft' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-center sm:text-left">NFT Verification</h2>
                <WalletConnectButton />
              </div>

              {checkingWhitelist ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Checking access...</span>
                </div>
              ) : (
                <>
                  <NFTOwnershipCheck onOwnershipVerified={handleNFTOwnershipVerified} />

                  {!hasNFT && account && (
                    <NFTPurchaseButton onPurchaseComplete={() => setHasNFT(true)} />
                  )}

                  {hasNFT && !isWhitelisted && (
                    <Button 
                      onClick={verifyOwnership} 
                      disabled={verifying}
                      className="w-full min-h-[44px]"
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Access Vault
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 5: Vault Access */}
          {currentStep === 'vault' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-center sm:text-left">Your Vault Access</h2>
                <WalletConnectButton />
              </div>

              <EnzymeVaultCard 
                isWhitelisted={isWhitelisted} 
                walletAddress={account?.address}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VaultAccess;
