import { ConnectButton, useConnect } from "thirdweb/react";
import { thirdwebClient, ethereum, appMetadata, WALLETCONNECT_PROJECT_ID } from "@/lib/thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, Smartphone, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

// Detect if user is on mobile browser
const isMobileBrowser = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Detect specific wallet in-app browsers
const detectWalletBrowser = () => {
  if (typeof window === 'undefined') return null;
  const ua = navigator.userAgent.toLowerCase();
  const ethereum = (window as any).ethereum;
  
  // Check for specific wallet providers
  if (ethereum?.isMetaMask) return 'metamask';
  if (ethereum?.isCoinbaseWallet) return 'coinbase';
  if (ethereum?.isRainbow) return 'rainbow';
  if (ethereum?.isTrust) return 'trust';
  if (ethereum?.isPhantom) return 'phantom';
  if (ua.includes('metamask')) return 'metamask';
  if (ua.includes('coinbase')) return 'coinbase';
  if (ua.includes('rainbow')) return 'rainbow';
  if (ua.includes('trust')) return 'trust';
  
  // Generic injected provider
  if (ethereum) return 'injected';
  
  return null;
};

// Check if we have any injected provider
const hasInjectedWallet = () => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).ethereum;
};

// Wallet configurations for mobile deep links
const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/lovable-uploads/aefbbf1a-e30e-4002-9925-836a5e183a48.png',
    emoji: '🦊',
    getDeepLink: () => `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
    downloadUrl: 'https://metamask.io/download/',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: null,
    emoji: '🔵',
    getDeepLink: () => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`,
    downloadUrl: 'https://www.coinbase.com/wallet',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: null,
    emoji: '🌈',
    getDeepLink: () => `https://rnbwapp.com/dapp?url=${encodeURIComponent(window.location.href)}`,
    downloadUrl: 'https://rainbow.me/',
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: null,
    emoji: '🛡️',
    getDeepLink: () => `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(window.location.href)}`,
    downloadUrl: 'https://trustwallet.com/',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: null,
    emoji: '👻',
    getDeepLink: () => `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}?ref=${encodeURIComponent(window.location.origin)}`,
    downloadUrl: 'https://phantom.app/',
  },
  {
    id: 'zerion',
    name: 'Zerion',
    icon: null,
    emoji: '⚡',
    getDeepLink: () => `https://wallet.zerion.io/wc?uri=${encodeURIComponent(window.location.href)}`,
    downloadUrl: 'https://zerion.io/',
  },
];

export const WalletConnectButton = ({ onConnect, onDisconnect }: WalletConnectButtonProps) => {
  const account = useActiveAccount();
  const { toast } = useToast();
  const { connect } = useConnect();
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [walletBrowser, setWalletBrowser] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Detect environment on mount
  useEffect(() => {
    setIsMobile(isMobileBrowser());
    setWalletBrowser(detectWalletBrowser());
  }, []);

  // Create wallet instances
  const wallets = useMemo(() => [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("com.trustwallet.app"),
    createWallet("app.phantom"),
    createWallet("io.zerion.wallet"),
    createWallet("walletConnect"),
  ], []);

  // Auto-connect if inside wallet browser with injected provider
  useEffect(() => {
    const autoConnect = async () => {
      if (walletBrowser && !account && !isConnecting) {
        setIsConnecting(true);
        try {
          // Check if there's an injected provider
          const provider = injectedProvider("io.metamask");
          if (provider) {
            const wallet = createWallet("io.metamask");
            await connect(async () => {
              await wallet.connect({ client: thirdwebClient });
              return wallet;
            });
            toast({
              title: "Wallet Connected",
              description: "Connected via " + walletBrowser,
            });
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
        } finally {
          setIsConnecting(false);
        }
      }
    };
    
    // Delay to allow provider injection
    const timeout = setTimeout(autoConnect, 500);
    return () => clearTimeout(timeout);
  }, [walletBrowser, account, connect, isConnecting, toast]);

  // Link wallet to user account when connected
  useEffect(() => {
    const linkWallet = async () => {
      if (account?.address) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { data: existingWallet } = await supabase
              .from('wallet_addresses')
              .select('id')
              .eq('user_id', user.id)
              .eq('wallet_address', account.address.toLowerCase())
              .single();

            if (!existingWallet) {
              const { error } = await supabase
                .from('wallet_addresses')
                .insert({
                  user_id: user.id,
                  wallet_address: account.address.toLowerCase(),
                  chain_id: 1,
                  is_primary: true,
                });

              if (error && error.code !== '23505') {
                console.error('Error linking wallet:', error);
              } else {
                toast({
                  title: "Wallet Linked",
                  description: "Your wallet has been connected to your account.",
                });
              }
            }

            onConnect?.(account.address);
          }
        } catch (error) {
          console.error('Error in wallet linking:', error);
        }
      }
    };

    linkWallet();
  }, [account?.address, onConnect, toast]);

  // Handle mobile wallet deep link
  const handleMobileWalletClick = useCallback((wallet: typeof WALLET_OPTIONS[0]) => {
    const deepLink = wallet.getDeepLink();
    window.location.href = deepLink;
    setShowMobileModal(false);
  }, []);

  // Direct connect for injected wallets (when in wallet browser)
  const handleDirectConnect = useCallback(async () => {
    if (!hasInjectedWallet()) return;
    
    setIsConnecting(true);
    try {
      const wallet = createWallet("io.metamask");
      await connect(async () => {
        await wallet.connect({ client: thirdwebClient });
        return wallet;
      });
    } catch (error) {
      console.error('Direct connect failed:', error);
      toast({
        title: "Connection Failed",
        description: "Please try again or use WalletConnect.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [connect, toast]);

  // If connected, show the thirdweb button for account management
  if (account) {
    return (
      <ConnectButton
        client={thirdwebClient}
        wallets={wallets}
        chain={ethereum}
        theme="dark"
        appMetadata={appMetadata}
        walletConnect={{ projectId: WALLETCONNECT_PROJECT_ID }}
        connectModal={{
          size: "compact",
          title: "Connect Your Wallet",
          showThirdwebBranding: false,
        }}
        detailsButton={{
          style: {
            background: "hsl(var(--secondary))",
            color: "hsl(var(--secondary-foreground))",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontWeight: "500",
            fontSize: "0.875rem",
            minHeight: "44px",
          },
        }}
      />
    );
  }

  // Desktop or inside wallet browser with injected provider - use thirdweb's modal
  if (!isMobile || walletBrowser) {
    return (
      <div className="flex flex-col gap-2">
        {/* Show direct connect button if inside wallet browser */}
        {walletBrowser && (
          <Button
            onClick={handleDirectConnect}
            disabled={isConnecting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 min-h-[44px]"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isConnecting ? "Connecting..." : `Connect with ${walletBrowser}`}
          </Button>
        )}
        
        {/* Standard thirdweb connect button */}
        <ConnectButton
          client={thirdwebClient}
          wallets={wallets}
          chain={ethereum}
          theme="dark"
          appMetadata={appMetadata}
          walletConnect={{ projectId: WALLETCONNECT_PROJECT_ID }}
          connectModal={{
            size: "wide",
            title: "Connect Your Wallet",
            showThirdwebBranding: false,
            welcomeScreen: {
              title: "Welcome to 3rd Eye Advisors",
              subtitle: "Connect your wallet to access NFT-gated content",
            },
          }}
          connectButton={{
            label: walletBrowser ? "Other Wallets" : "Connect Wallet",
            style: {
              background: walletBrowser ? "hsl(var(--secondary))" : "hsl(var(--primary))",
              color: walletBrowser ? "hsl(var(--secondary-foreground))" : "hsl(var(--primary-foreground))",
              borderRadius: "0.5rem",
              padding: "0.75rem 1.5rem",
              fontWeight: "600",
              fontSize: "0.875rem",
              minHeight: "44px",
            },
          }}
        />
      </div>
    );
  }

  // Mobile browser without wallet - show custom modal with deep links + WalletConnect QR
  return (
    <>
      <Button
        onClick={() => setShowMobileModal(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 min-h-[44px]"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <Dialog open={showMobileModal} onOpenChange={setShowMobileModal}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription>
              Choose how you'd like to connect. Tap a wallet to open its app, or use WalletConnect for any wallet.
            </DialogDescription>
          </DialogHeader>
          
          {/* WalletConnect Option - Works with ANY wallet */}
          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <QrCode className="w-3 h-3" />
              RECOMMENDED: Works with any wallet
            </p>
            <ConnectButton
              client={thirdwebClient}
              wallets={[createWallet("walletConnect")]}
              chain={ethereum}
              theme="dark"
              appMetadata={appMetadata}
              walletConnect={{ projectId: WALLETCONNECT_PROJECT_ID }}
              connectModal={{
                size: "compact",
                title: "Scan QR Code",
                showThirdwebBranding: false,
              }}
              connectButton={{
                label: "WalletConnect (Any Wallet)",
                style: {
                  width: "100%",
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  borderRadius: "0.5rem",
                  padding: "0.875rem 1rem",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  minHeight: "52px",
                },
              }}
            />
          </div>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or open wallet app directly
              </span>
            </div>
          </div>
          
          {/* Individual wallet deep links */}
          <div className="grid gap-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              OPEN IN WALLET APP
            </p>
            {WALLET_OPTIONS.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-left hover:bg-muted/50"
                onClick={() => handleMobileWalletClick(wallet)}
              >
                <span className="text-xl">{wallet.emoji}</span>
                <span className="flex-1 font-medium">{wallet.name}</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </Button>
            ))}
          </div>

          <div className="border-t pt-4 mt-2">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Don't have a wallet app?
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary underline"
              >
                Get MetaMask
              </a>
              <span className="text-xs text-muted-foreground">•</span>
              <a 
                href="https://www.coinbase.com/wallet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary underline"
              >
                Coinbase Wallet
              </a>
              <span className="text-xs text-muted-foreground">•</span>
              <a 
                href="https://rainbow.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary underline"
              >
                Rainbow
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnectButton;
