import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

/**
 * WalletConnectButton - RainbowKit-powered wallet connection
 * Much better UI and mobile support than thirdweb's ConnectButton
 */
export const WalletConnectButton = ({ onConnect, onDisconnect }: WalletConnectButtonProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [hasLinked, setHasLinked] = useState(false);

  // Link wallet to user account when connected
  useEffect(() => {
    const linkWallet = async () => {
      if (!address || hasLinked) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: existingWallet } = await supabase
            .from('wallet_addresses')
            .select('id')
            .eq('user_id', user.id)
            .eq('wallet_address', address.toLowerCase())
            .single();

          if (!existingWallet) {
            const { error } = await supabase
              .from('wallet_addresses')
              .insert({
                user_id: user.id,
                wallet_address: address.toLowerCase(),
                chain_id: 1,
                is_primary: true,
              });

            if (error && error.code !== '23505') {
              console.error('Error linking wallet:', error);
            } else {
              toast({
                title: "Wallet Connected",
                description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
              });
            }
          }
        }

        setHasLinked(true);
        onConnect?.(address);
      } catch (error) {
        console.error('Error in wallet linking:', error);
        onConnect?.(address);
      }
    };

    if (isConnected && address) {
      linkWallet();
    }
  }, [address, isConnected, hasLinked, onConnect, toast]);

  // Handle disconnect callback
  useEffect(() => {
    if (!isConnected && hasLinked) {
      setHasLinked(false);
      onDisconnect?.();
    }
  }, [isConnected, hasLinked, onDisconnect]);

  return (
    <ConnectButton 
      showBalance={false}
      chainStatus="icon"
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
    />
  );
};

export default WalletConnectButton;
