import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

// WalletConnect Project ID - Get your own at https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = "0ceca1527f12a6186d4a1003bc45b2d9";

export const wagmiConfig = getDefaultConfig({
  appName: '3rd Eye Advisors',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet],
  ssr: false,
});
