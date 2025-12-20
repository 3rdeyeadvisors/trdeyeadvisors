import { ConnectButton, AutoConnect, useActiveAccount, useDisconnect } from "thirdweb/react";
import { thirdwebClient, ethereum, appMetadata, WALLETCONNECT_PROJECT_ID } from "@/lib/thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

/**
 * WalletConnectButton - Uses thirdweb's built-in ConnectButton for all wallet connections.
 * 
 * Key design decisions:
 * 1. Use thirdweb's ConnectButton exclusively - it handles mobile/desktop detection automatically
 * 2. Include WalletConnect which works with ANY wallet via QR code or mobile deep link
 * 3. Use AutoConnect for session persistence across page loads
 * 4. No custom deep links - thirdweb handles this via WalletConnect v2 protocol
 * 
 * This approach is App Store compliant because:
 * - No custodial wallets (in-app wallet)
 * - Users connect their own external wallets
 * - No crypto trading/swapping functionality
 */
export const WalletConnectButton = ({ onConnect, onDisconnect }: WalletConnectButtonProps) => {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  // Configure supported wallets
  // Order matters - first wallet is the default/recommended
  const wallets = useMemo(() => [
    // WalletConnect - Works with ANY wallet (MetaMask, Rainbow, Trust, etc.)
    // This is the primary method for mobile connections
    createWallet("walletConnect"),
    // Popular injected wallets for desktop
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("com.trustwallet.app"),
    createWallet("app.phantom"),
    createWallet("io.zerion.wallet"),
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
    <>
      {/* AutoConnect restores previous wallet connection on page load */}
      <AutoConnect
        client={thirdwebClient}
        wallets={wallets}
        timeout={15000}
        appMetadata={appMetadata}
        onConnect={(wallet) => {
          console.log('AutoConnect: Wallet restored', wallet.getAccount()?.address);
        }}
      />

      {/* Main connect button - thirdweb handles all the complexity */}
      <ConnectButton
        client={thirdwebClient}
        wallets={wallets}
        chain={ethereum}
        theme="dark"
        appMetadata={appMetadata}
        // WalletConnect configuration for mobile deep linking
        walletConnect={{
          projectId: WALLETCONNECT_PROJECT_ID,
        }}
        // Connect modal configuration
        connectModal={{
          size: "wide",
          title: "Connect Your Wallet",
          showThirdwebBranding: false,
          // Show all wallets including WalletConnect prominently
          welcomeScreen: {
            title: "3rd Eye Advisors",
            subtitle: "Connect your wallet to access NFT-gated content and the Enzyme Vault",
          },
          // Terms of service and privacy policy
          termsOfServiceUrl: "https://the3rdeyeadvisors.com/terms-of-service",
          privacyPolicyUrl: "https://the3rdeyeadvisors.com/privacy-policy",
        }}
        // Recommended wallets shown first in the modal
        recommendedWallets={[
          createWallet("walletConnect"),
          createWallet("io.metamask"),
          createWallet("com.coinbase.wallet"),
        ]}
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
          // Allow users to switch networks
          networkSelector: {
            sections: [
              { label: "Main Networks", chains: [ethereum] },
            ],
          },
        }}
      />
    </>
  );
};

export default WalletConnectButton;
