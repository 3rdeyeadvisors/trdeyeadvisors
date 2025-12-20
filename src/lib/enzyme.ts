// Enzyme Finance Configuration
// This module contains configuration for the Enzyme vault integration

export const ENZYME_CONFIG = {
  // ComptrollerProxy address for the 3EA vault
  comptrollerProxy: "0xCb5d2578e76F1cc93c1A0bDe1686729C6fbAeC58",
  
  // Enzyme app URL for external access
  appUrl: "https://app.enzyme.finance",
  
  // Chain ID (Ethereum Mainnet)
  chainId: 1,
  
  // Denomination asset (typically WETH or USDC)
  // Update this based on your vault's denomination asset
  denominationAsset: {
    symbol: "ETH",
    decimals: 18,
  },
};

// Build the external Enzyme vault URL
export const getEnzymeVaultUrl = (vaultAddress: string = ENZYME_CONFIG.comptrollerProxy): string => {
  return `${ENZYME_CONFIG.appUrl}/vault/${vaultAddress}`;
};

// Build the deposit URL for external navigation
export const getEnzymeDepositUrl = (vaultAddress: string = ENZYME_CONFIG.comptrollerProxy): string => {
  return `${ENZYME_CONFIG.appUrl}/vault/${vaultAddress}/deposit`;
};

// Build the redeem URL for external navigation  
export const getEnzymeRedeemUrl = (vaultAddress: string = ENZYME_CONFIG.comptrollerProxy): string => {
  return `${ENZYME_CONFIG.appUrl}/vault/${vaultAddress}/redeem`;
};
