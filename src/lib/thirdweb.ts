import { createThirdwebClient, getContract, defineChain } from "thirdweb";

// Thirdweb Client ID
export const THIRDWEB_CLIENT_ID = "87309968bcf322141f6cdb41ada4edcf";

// WalletConnect Project ID (required for mobile wallet deep linking)
// Get your own at https://cloud.walletconnect.com
export const WALLETCONNECT_PROJECT_ID = "e7f0ae0f07d0e2fdd4c8a6c3c17f1d5f";

// Create the Thirdweb client
export const thirdwebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// App metadata for WalletConnect (required for mobile wallet deep linking)
export const appMetadata = {
  name: "3rd Eye Advisors",
  description: "DeFi Education & NFT-Gated Vault Access",
  url: typeof window !== "undefined" ? window.location.origin : "https://the3rdeyeadvisors.com",
  logoUrl: "https://the3rdeyeadvisors.com/android-chrome-192x192.png",
};

// Ethereum Mainnet chain
export const ethereum = defineChain(1);

// NFT Contract Address (3EA Access NFT)
export const NFT_CONTRACT_ADDRESS = "0x91AE8ec3d88E871679F826c1D6c5B008f105506c";

// Enzyme Vault ComptrollerProxy Address
export const ENZYME_VAULT_ADDRESS = "0xCb5d2578e76F1cc93c1A0bDe1686729C6fbAeC58";

// Get NFT Contract instance
export const getNFTContract = () => {
  return getContract({
    client: thirdwebClient,
    chain: ethereum,
    address: NFT_CONTRACT_ADDRESS,
  });
};

// Get Enzyme Vault Contract instance
export const getEnzymeVaultContract = () => {
  return getContract({
    client: thirdwebClient,
    chain: ethereum,
    address: ENZYME_VAULT_ADDRESS,
  });
};

// Supported external wallets (App Store compliant - no custodial wallets)
export const SUPPORTED_WALLETS = [
  "io.metamask",
  "com.coinbase.wallet", 
  "me.rainbow",
  "walletConnect",
] as const;
