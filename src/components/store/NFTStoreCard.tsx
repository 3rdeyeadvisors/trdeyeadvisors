import { useReadContract, useActiveAccount } from "thirdweb/react";
import { getNFTContract, NFT_CONTRACT_ADDRESS } from "@/lib/thirdweb";
import { getActiveClaimCondition, totalSupply } from "thirdweb/extensions/erc1155";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, Coins, Package, Loader2, Wallet, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import nftImage from "@/assets/nft/3ea-earth-access.png";
import WalletConnectButton from "@/components/web3/WalletConnectButton";
import NFTPurchaseButton from "@/components/web3/NFTPurchaseButton";
import { useState } from "react";

// Token ID for the 3EA Access NFT (first token in the ERC1155 collection)
const ACCESS_TOKEN_ID = 0n;

// Fallback values when blockchain data can't be fetched
const FALLBACK_PRICE = "0.01 ETH";
const FALLBACK_SUPPLY = "Limited";

// Helper to format wei to ETH
const formatEther = (wei: bigint): string => {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(eth < 0.01 ? 4 : 2);
};

export const NFTStoreCard = () => {
  const contract = getNFTContract();
  const account = useActiveAccount();
  const [purchased, setPurchased] = useState(false);

  // Fetch active claim condition (includes price)
  const { data: claimCondition, isLoading: loadingCondition, error: conditionError } = useReadContract(
    getActiveClaimCondition,
    {
      contract,
      tokenId: ACCESS_TOKEN_ID,
    }
  );

  // Fetch total minted supply
  const { data: minted, isLoading: loadingSupply, error: supplyError } = useReadContract(
    totalSupply,
    {
      contract,
      id: ACCESS_TOKEN_ID,
    }
  );

  const isLoading = loadingCondition || loadingSupply;
  const hasDataError = conditionError || supplyError;
  
  const pricePerToken = claimCondition?.pricePerToken;
  const maxClaimableSupply = claimCondition?.maxClaimableSupply;
  const mintedCount = minted ? Number(minted) : 0;
  const maxSupply = maxClaimableSupply ? Number(maxClaimableSupply) : null;
  const remaining = maxSupply ? maxSupply - mintedCount : null;

  // Format price for display - always use fallback if no valid price
  const formattedPrice = pricePerToken && pricePerToken > 0n
    ? `${formatEther(pricePerToken)} ETH` 
    : FALLBACK_PRICE;
  
  // Format supply for display
  const formattedSupply = hasDataError 
    ? FALLBACK_SUPPLY 
    : (maxSupply 
        ? `${remaining?.toLocaleString()} left` 
        : `${mintedCount.toLocaleString()} minted`);

  return (
    <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      {/* NFT Image */}
      <div className="aspect-square relative bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
        <img 
          src={nftImage} 
          alt="3EA Earth Access NFT"
          className="w-full h-full object-cover"
        />
        {hasDataError && (
          <Badge variant="outline" className="absolute top-2 left-2 text-xs bg-background/80">
            <AlertCircle className="w-3 h-3 mr-1" />
            Live data unavailable
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2 px-4">
        <CardTitle className="font-consciousness text-base">
          3EA Earth Access NFT
        </CardTitle>
        <CardDescription className="font-consciousness text-xs">
          Unlock exclusive Enzyme Vault access
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4 flex-1 flex flex-col">
        {/* Price & Supply Info - Compact */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-0.5">
              <Coins className="h-3 w-3 shrink-0" />
              <span>Price</span>
            </div>
            {isLoading && !hasDataError ? (
              <Loader2 className="h-3 w-3 animate-spin mx-auto" />
            ) : (
              <p className="font-semibold text-foreground text-xs truncate">{formattedPrice}</p>
            )}
          </div>
          <div className="rounded-md bg-muted/50 p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-0.5">
              <Package className="h-3 w-3 shrink-0" />
              <span>Supply</span>
            </div>
            {isLoading && !hasDataError ? (
              <Loader2 className="h-3 w-3 animate-spin mx-auto" />
            ) : (
              <p className="font-semibold text-foreground text-xs truncate">{formattedSupply}</p>
            )}
          </div>
        </div>

        {/* Benefits - Compact */}
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>✓ Enzyme Vault access</p>
          <p>✓ Managed DeFi strategies</p>
        </div>

        {/* CTA - Wallet connect or Purchase directly */}
        <div className="mt-auto pt-2 space-y-3">
          {purchased ? (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">NFT Purchased!</span>
              </div>
              <Link to="/vault-access">
                <Button variant="outline" className="w-full min-h-[44px]">
                  Access Vault
                </Button>
              </Link>
            </div>
          ) : !account ? (
            <div className="flex justify-center">
              <WalletConnectButton />
            </div>
          ) : (
            <NFTPurchaseButton onPurchaseComplete={() => setPurchased(true)} />
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          <a 
            href={`https://etherscan.io/address/${NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline inline-flex items-center justify-center gap-1"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span>View on Etherscan</span>
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default NFTStoreCard;