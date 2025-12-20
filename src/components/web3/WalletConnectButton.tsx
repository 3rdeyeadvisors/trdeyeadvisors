import { ConnectButton, useConnect } from "thirdweb/react";
import { thirdwebClient, ethereum, appMetadata, WALLETCONNECT_PROJECT_ID } from "@/lib/thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink } from "lucide-react";
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

// Get the current page URL for wallet deep linking
const getCurrentUrl = () => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

// Wallet deep link configurations
const WALLET_DEEPLINKS = {
  metamask: {
    name: 'MetaMask',
    icon: '🦊',
    // MetaMask uses metamask.app.link for universal links
    getDeepLink: () => `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
  },
  coinbase: {
    name: 'Coinbase Wallet',
    icon: '🔵',
    // Coinbase Wallet uses go.cb-w.com for universal links
    getDeepLink: () => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`,
  },
  rainbow: {
    name: 'Rainbow',
    icon: '🌈',
    // Rainbow uses rnbwapp.com for universal links
    getDeepLink: () => `https://rnbwapp.com/dapp?url=${encodeURIComponent(window.location.href)}`,
  },
  trust: {
    name: 'Trust Wallet',
    icon: '🛡️',
    getDeepLink: () => `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(window.location.href)}`,
  },
};

export const WalletConnectButton = ({ onConnect, onDisconnect }: WalletConnectButtonProps) => {
  const account = useActiveAccount();
  const { toast } = useToast();
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(isMobileBrowser());
  }, []);

  // Create external wallet instances for desktop
  const wallets = useMemo(() => [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("walletConnect"),
  ], []);

  // Link wallet to user account when connected
  useEffect(() => {
    const linkWallet = async () => {
      if (account?.address) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if wallet already linked
            const { data: existingWallet } = await supabase
              .from('wallet_addresses')
              .select('id')
              .eq('user_id', user.id)
              .eq('wallet_address', account.address.toLowerCase())
              .single();

            if (!existingWallet) {
              // Link new wallet
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

  // Handle mobile wallet selection
  const handleMobileWalletClick = useCallback((walletKey: keyof typeof WALLET_DEEPLINKS) => {
    const wallet = WALLET_DEEPLINKS[walletKey];
    const deepLink = wallet.getDeepLink();
    
    // Open the wallet app via deep link
    window.location.href = deepLink;
    setShowMobileModal(false);
  }, []);

  // Mobile: Show custom wallet selector with deep links
  if (isMobile && !account) {
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Your Wallet</DialogTitle>
              <DialogDescription>
                Select a wallet to open it and connect to this site. You'll be redirected to the wallet app.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-3 py-4">
              {Object.entries(WALLET_DEEPLINKS).map(([key, wallet]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 text-left"
                  onClick={() => handleMobileWalletClick(key as keyof typeof WALLET_DEEPLINKS)}
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="flex-1 font-medium">{wallet.name}</span>
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </Button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Don't have a wallet? We recommend{' '}
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                MetaMask
              </a>
            </p>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop or already connected: Use thirdweb ConnectButton
  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={wallets}
      chain={ethereum}
      theme="dark"
      appMetadata={appMetadata}
      walletConnect={{
        projectId: WALLETCONNECT_PROJECT_ID,
      }}
      connectModal={{
        size: "compact",
        title: "Connect Your Wallet",
        showThirdwebBranding: false,
      }}
      connectButton={{
        label: "Connect Wallet",
        style: {
          background: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          fontWeight: "600",
          fontSize: "0.875rem",
          minHeight: "44px",
        },
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
};

export default WalletConnectButton;
