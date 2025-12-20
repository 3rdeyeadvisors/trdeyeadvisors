import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
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
  const { user, loading: authLoading } = useAuth();
  const account = useActiveAccount();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<Step>('auth');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [hasNFT, setHasNFT] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [checkingWhitelist, setCheckingWhitelist] = useState(false);

  // Track page view
  useEffect(() => {
    trackEvent('vault_page_view', 'vault', currentStep);
  }, []);

  // Determine step based on auth state - runs once when auth is ready
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setCurrentStep('auth');
      return;
    }
    
    // User is logged in - check disclaimer
    const accepted = localStorage.getItem('vault_disclaimer_accepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
      setCurrentStep(account ? 'nft' : 'wallet');
    } else {
      setCurrentStep('disclaimer');
    }
  }, [authLoading, user]);

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

  // Update step when wallet connects
  useEffect(() => {
    if (account && disclaimerAccepted && !isWhitelisted) {
      setCurrentStep('nft');
    }
  }, [account, disclaimerAccepted, isWhitelisted]);

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

  const handleSignIn = () => {
    // Redirect to auth with current path so user comes back here
    const currentPath = location.pathname;
    navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`);
  };

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

  // Show loading only during initial auth check
  if (authLoading) {
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
          {/* Step 1: Authentication */}
          {currentStep === 'auth' && (
            <Card>
              <CardHeader className="text-center sm:text-left">
                <CardTitle className="flex items-center justify-center sm:justify-start gap-2">
                  <LogIn className="h-5 w-5 shrink-0" />
                  <span>Sign In Required</span>
                </CardTitle>
                <CardDescription>
                  Please sign in to your 3EA account to access the vault
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center sm:justify-start">
                <Button onClick={handleSignIn} className="min-h-[44px]">
                  Sign In to Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

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
                  <WalletConnectButton 
                    onConnect={() => setCurrentStep('nft')}
                  />
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
