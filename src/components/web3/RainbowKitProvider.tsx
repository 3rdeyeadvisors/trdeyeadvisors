import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider as RKProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

// Create a separate query client for wagmi/rainbowkit
const wagmiQueryClient = new QueryClient();

interface RainbowKitProviderProps {
  children: ReactNode;
}

export const RainbowKitProvider = ({ children }: RainbowKitProviderProps) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={wagmiQueryClient}>
        <RKProvider
          theme={darkTheme({
            accentColor: 'hsl(217, 91%, 60%)',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          appInfo={{
            appName: '3rd Eye Advisors',
            learnMoreUrl: 'https://the3rdeyeadvisors.com/tutorials/wallet-setup',
          }}
          modalSize="compact"
        >
          {children}
        </RKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitProvider;
