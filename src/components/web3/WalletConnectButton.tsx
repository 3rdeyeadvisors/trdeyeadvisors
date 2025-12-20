import { ConnectButton } from "thirdweb/react";
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

// Detect if user is on mobile browser (not in wallet's in-app browser)
const isMobileBrowser = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Check if we're inside a wallet's in-app browser (has injected provider)
const hasInjectedWallet = () => {
  if (typeof window === 'undefined') return false;
  // Check for any injected ethereum provider
  return !!(window as any).ethereum;
};

// Wallet deep link configurations for mobile
const WALLET_DEEPLINKS = {
  metamask: {
    name: 'MetaMask',
    icon: '🦊',
    getDeepLink: () => `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
  },
  coinbase: {
    name: 'Coinbase Wallet',
    icon: '🔵',
    getDeepLink: () => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`,
  },
  rainbow: {
    name: 'Rainbow',
    icon: '🌈',
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
  const [hasInjected, setHasInjected] = useState(false);

  // Check device type and injected provider on mount
  useEffect(() => {
    setIsMobile(isMobileBrowser());
    setHasInjected(hasInjectedWallet());
  }, []);

  // Create wallet instances - includes both injected wallets and WalletConnect
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

  // Handle mobile wallet selection via deep link
  const handleMobileWalletClick = useCallback((walletKey: keyof typeof WALLET_DEEPLINKS) => {
    const wallet = WALLET_DEEPLINKS[walletKey];
    const deepLink = wallet.getDeepLink();
    
    // Open the wallet app via deep link
    window.location.href = deepLink;
    setShowMobileModal(false);
  }, []);

  // Use thirdweb's standard ConnectButton if:
  // 1. User is on desktop
  // 2. User is already connected
  // 3. User is on mobile BUT inside a wallet's in-app browser (has injected provider)
  const shouldUseThirdwebButton = !isMobile || hasInjected || !!account;

  if (shouldUseThirdwebButton) {
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
  }

  // Mobile browser without injected wallet: Show custom wallet selector with deep links
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
              Choose a wallet app to open. You'll connect through the wallet's built-in browser.
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

          <div className="border-t pt-4 mt-2">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Don't have a wallet app?
            </p>
            <div className="flex gap-2 justify-center">
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
                Get Coinbase Wallet
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnectButton;
