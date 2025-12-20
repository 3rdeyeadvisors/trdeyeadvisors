import { ThirdwebProvider } from "thirdweb/react";
import { ReactNode } from "react";

interface ThirdwebWrapperProps {
  children: ReactNode;
}

/**
 * ThirdwebWrapper - Wraps the app with Thirdweb provider
 * Configured for Ethereum mainnet with external wallets only (App Store compliant)
 */
export const ThirdwebWrapper = ({ children }: ThirdwebWrapperProps) => {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
};

export default ThirdwebWrapper;
