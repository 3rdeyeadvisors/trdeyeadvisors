import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAuth } from "@/components/auth/AuthProvider";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  CheckCircle, 
  Circle, 
  Lock,
  ArrowRight,
  LogIn,
  Loader2,
  ExternalLink
} from "lucide-react";
import WalletConnectButton from "@/components/web3/WalletConnectButton";
import EnzymeVaultCard from "@/components/web3/EnzymeVaultCard";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

type Step = 'auth' | 'wallet' | 'vault';

const VaultAccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, ready } = useAuth();
  const { address, isConnected, isReconnecting } = useAccount();
  
  const [currentStep, setCurrentStep] = useState<Step>('auth');
  const [walletStabilized, setWalletStabilized] = useState(false);

  // Track page view
  useEffect(() => {
    trackEvent('vault_page_view', 'vault', currentStep);
  }, []);

  // Wait for wallet to stabilize
  useEffect(() => {
    if (!isReconnecting && !walletStabilized) {
      const timer = setTimeout(() => {
        setWalletStabilized(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isReconnecting, walletStabilized]);

  // Determine current step based on state
  useEffect(() => {
    if (!ready || authLoading || !walletStabilized) return;
    
    if (!user) {
      setCurrentStep('auth');
      return;
    }
    
    if (!isConnected) {
      setCurrentStep('wallet');
      return;
    }
    
    setCurrentStep('vault');
  }, [ready, authLoading, user, isConnected, walletStabilized]);

  const handleSignIn = () => {
    navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`);
  };

  const steps = [
    { id: 'auth', label: 'Sign In', icon: LogIn },
    { id: 'wallet', label: 'Connect Wallet', icon: Wallet },
    { id: 'vault', label: 'Vault Access', icon: Lock },
  ];

  const getStepStatus = (stepId: Step) => {
    const stepOrder: Step[] = ['auth', 'wallet', 'vault'];
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
            <Lock className="h-3 w-3 mr-1" />
            Exclusive Access
          </Badge>
          <h1 className="text-4xl font-bold">3EA Enzyme Vault</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access managed DeFi strategies through the 3EA Enzyme Vault. 
            Sign in and connect your wallet to get started.
          </p>
          <p className="text-sm text-muted-foreground">
            Don't have an NFT yet?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/store')}>
              Visit the Store
            </Button>
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
                  <span className="text-sm font-medium">{step.label}</span>
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
          {/* Step 1: Sign In */}
          {currentStep === 'auth' && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5 shrink-0" />
                  <span>Sign In Required</span>
                </CardTitle>
                <CardDescription>
                  Please sign in to your 3EA account to access the vault
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 pt-2">
                <Button onClick={handleSignIn} size="lg" className="min-h-[44px]">
                  Sign In to Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Connect Wallet */}
          {currentStep === 'wallet' && (
            <Card>
              <CardHeader className="text-center sm:text-left">
                <CardTitle className="flex items-center justify-center sm:justify-start gap-2">
                  <Wallet className="h-5 w-5 shrink-0" />
                  <span>Connect Your Wallet</span>
                </CardTitle>
                <CardDescription>
                  Connect your wallet to access the Enzyme Vault
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

          {/* Step 3: Vault Access */}
          {currentStep === 'vault' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-center sm:text-left">Your Vault Access</h2>
                <WalletConnectButton />
              </div>

              <EnzymeVaultCard 
                isWhitelisted={true} 
                walletAddress={address}
              />
              
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Note:</strong> Deposits require your wallet to be whitelisted on the vault. 
                    If you've recently purchased an NFT, please allow some time for your wallet to be added.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VaultAccess;
