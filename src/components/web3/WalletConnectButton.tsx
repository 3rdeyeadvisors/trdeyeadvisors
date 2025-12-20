import { ConnectButton } from "thirdweb/react";
import { thirdwebClient, ethereum } from "@/lib/thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

// Create external wallet instances (App Store compliant)
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("walletConnect"),
];

export const WalletConnectButton = ({ onConnect, onDisconnect }: WalletConnectButtonProps) => {
  const account = useActiveAccount();
  const { toast } = useToast();

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

              if (error && error.code !== '23505') { // Ignore duplicate key error
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

  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={wallets}
      chain={ethereum}
      theme="dark"
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
        },
      }}
    />
  );
};

export default WalletConnectButton;
