import { ConnectButton, AutoConnect, useActiveAccount, useDisconnect } from "thirdweb/react";
import { thirdwebClient, ethereum, appMetadata, WALLETCONNECT_PROJECT_ID, isMobile, isInWalletBrowser } from "@/lib/thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

/**
 * WalletConnectButton - Production-ready wallet connection component
 * 
 * Design Principles (following successful dApps like OpenSea, Uniswap, Blur):
 * 1. Use thirdweb's ConnectButton - handles all complexity internally
 * 2. WalletConnect v2 as primary mobile connection method
 * 3. AutoConnect for session persistence
 * 4. No custom deep links - let thirdweb/WalletConnect handle it
 * 
 * App Store Compliance:
 * - Only external wallets (no in-app/custodial wallets)
 * - No crypto trading/swapping functionality
 * - Users connect their own external wallets
 * 
 * Mobile Flow:
 * 1. User taps "Connect Wallet"
 * 2. Modal shows wallet options with WalletConnect prominent
 * 3. WalletConnect shows QR code (can scan from another device)
 *    OR opens wallet app directly via deep link
 * 4. User approves in their wallet app
 * 5. Connection established via WalletConnect protocol
 */
export const WalletConnectButton = ({ onConnect, onDisconnect }: WalletConnectButtonProps) => {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Detect platform for optimized wallet list
  const mobile = useMemo(() => isMobile(), []);
  const inWalletBrowser = useMemo(() => isInWalletBrowser(), []);

  // Configure supported wallets
  // Mobile: Prioritize WalletConnect (works with any wallet)
  // Desktop: Show injected wallets first, then WalletConnect
  const wallets = useMemo(() => {
    // Base wallets - WalletConnect always included for interoperability
    const walletList = [
      createWallet("walletConnect"), // Works with 300+ wallets
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
      createWallet("com.trustwallet.app"),
      createWallet("app.phantom"),
      createWallet("io.zerion.wallet"),
    ];

    // On mobile, move WalletConnect to the top
    if (mobile && !inWalletBrowser) {
      return walletList;
    }

    // In wallet browser, the injected wallet should work directly
    if (inWalletBrowser) {
      // Put MetaMask-like wallets first since we're in their browser
      return [
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("walletConnect"),
        createWallet("me.rainbow"),
        createWallet("com.trustwallet.app"),
        createWallet("app.phantom"),
      ];
    }

    return walletList;
  }, [mobile, inWalletBrowser]);

  // Link wallet to user account when connected
  useEffect(() => {
    const linkWallet = async () => {
      if (!account?.address) return;
      
      setConnectionError(null);

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
                title: "Wallet Connected",
                description: `Connected: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
              });
            }
          }

          onConnect?.(account.address);
        } else {
          // No Supabase user, but wallet connected - still call onConnect
          onConnect?.(account.address);
        }
      } catch (error) {
        console.error('Error in wallet linking:', error);
        // Still call onConnect even if linking fails
        onConnect?.(account.address);
      }
    };

    linkWallet();
  }, [account?.address, onConnect, toast]);

  // Handle disconnect callback
  useEffect(() => {
    if (!account && onDisconnect) {
      onDisconnect();
    }
  }, [account, onDisconnect]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* AutoConnect restores previous wallet connection on page load */}
      <AutoConnect
        client={thirdwebClient}
        wallets={wallets}
        timeout={15000}
        appMetadata={appMetadata}
        onConnect={(wallet) => {
          console.log('AutoConnect: Wallet restored', wallet.getAccount()?.address);
          setConnectionError(null);
        }}
      />

      {/* Main connect button - thirdweb handles all the complexity */}
      <ConnectButton
        client={thirdwebClient}
        wallets={wallets}
        chain={ethereum}
        theme="dark"
        appMetadata={appMetadata}
        // WalletConnect configuration - CRITICAL for mobile
        walletConnect={{
          projectId: WALLETCONNECT_PROJECT_ID,
        }}
        // Connect modal configuration
        connectModal={{
          size: mobile ? "compact" : "wide",
          title: "Connect Wallet",
          showThirdwebBranding: false,
          welcomeScreen: {
            title: "3rd Eye Advisors",
            subtitle: mobile 
              ? "Tap a wallet to connect"
              : "Connect your wallet to access NFT-gated content",
          },
          termsOfServiceUrl: "https://the3rdeyeadvisors.com/terms-of-service",
          privacyPolicyUrl: "https://the3rdeyeadvisors.com/privacy-policy",
        }}
        // Recommended wallets shown prominently
        recommendedWallets={
          mobile
            ? [createWallet("walletConnect"), createWallet("io.metamask")]
            : [createWallet("io.metamask"), createWallet("walletConnect"), createWallet("com.coinbase.wallet")]
        }
        // Style the connect button
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
            border: "none",
            cursor: "pointer",
          },
        }}
        // Style the details button (shown when connected)
        detailsButton={{
          style: {
            background: "hsl(var(--secondary))",
            color: "hsl(var(--secondary-foreground))",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontWeight: "500",
            fontSize: "0.875rem",
            minHeight: "44px",
            border: "none",
            cursor: "pointer",
          },
        }}
        // Details modal (shown when clicking connected wallet)
        detailsModal={{
          networkSelector: {
            sections: [
              { label: "Main Networks", chains: [ethereum] },
            ],
          },
        }}
        // Handle connection events
        onConnect={(wallet) => {
          console.log('Connected:', wallet.getAccount()?.address);
          setConnectionError(null);
        }}
        onDisconnect={() => {
          console.log('Disconnected');
        }}
      />

      {/* Show error message if connection failed */}
      {connectionError && (
        <p className="text-xs text-destructive mt-2 text-center">
          {connectionError}
        </p>
      )}

      {/* Mobile hint for users who approved in wallet but connection didn't complete */}
      {mobile && !account && (
        <p className="text-xs text-muted-foreground text-center max-w-[250px]">
          After approving in your wallet, return to this page. Connection will complete automatically.
        </p>
      )}
    </div>
  );
};

export default WalletConnectButton;
