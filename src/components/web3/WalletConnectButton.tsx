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
 * 
 * Note: Domain verification in WalletConnect Cloud can take 24-48 hours
 * to propagate. Until then, mobile deep linking may not work correctly.
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
  const wallets = useMemo(() => {
    const walletList = [
      createWallet("walletConnect"),
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
      createWallet("com.trustwallet.app"),
      createWallet("app.phantom"),
      createWallet("io.zerion.wallet"),
    ];

    if (inWalletBrowser) {
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
  }, [inWalletBrowser]);

  // Link wallet to user account when connected
  useEffect(() => {
    const linkWallet = async () => {
      if (!account?.address) return;
      
      setConnectionError(null);

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
                title: "Wallet Connected",
                description: `Connected: ${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
              });
            }
          }

          onConnect?.(account.address);
        } else {
          onConnect?.(account.address);
        }
      } catch (error) {
        console.error('Error in wallet linking:', error);
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
    <div className="flex flex-col items-center gap-3">
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
        recommendedWallets={
          mobile
            ? [createWallet("walletConnect"), createWallet("io.metamask")]
            : [createWallet("io.metamask"), createWallet("walletConnect"), createWallet("com.coinbase.wallet")]
        }
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
        detailsModal={{
          networkSelector: {
            sections: [
              { label: "Main Networks", chains: [ethereum] },
            ],
          },
        }}
        onConnect={(wallet) => {
          console.log('Connected:', wallet.getAccount()?.address);
          setConnectionError(null);
        }}
        onDisconnect={() => {
          console.log('Disconnected');
        }}
      />

      {connectionError && (
        <p className="text-xs text-destructive mt-1 text-center">
          {connectionError}
        </p>
      )}

      {/* Mobile hint */}
      {mobile && !account && (
        <p className="text-xs text-muted-foreground text-center max-w-[280px]">
          Tip: If wallet doesn't open automatically, WalletConnect domains may still be verifying (can take 24-48hrs).
        </p>
      )}
    </div>
  );
};

export default WalletConnectButton;
