import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFTContract, NFT_CONTRACT_ADDRESS } from "@/lib/thirdweb";
import { getActiveClaimCondition, totalSupply } from "thirdweb/extensions/erc1155";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, Coins, Package, Loader2, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

// Token ID for the 3EA Access NFT (first token in the ERC1155 collection)
const ACCESS_TOKEN_ID = 0n;

// Helper to format wei to ETH
const formatEther = (wei: bigint): string => {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(eth < 0.01 ? 4 : 2);
};

export const NFTStoreCard = () => {
  const account = useActiveAccount();
  const contract = getNFTContract();

  // Fetch active claim condition (includes price)
  const { data: claimCondition, isLoading: loadingCondition } = useReadContract(
    getActiveClaimCondition,
    {
      contract,
      tokenId: ACCESS_TOKEN_ID,
    }
  );

  // Fetch total minted supply
  const { data: minted, isLoading: loadingSupply } = useReadContract(
    totalSupply,
    {
      contract,
      id: ACCESS_TOKEN_ID,
    }
  );

  const isLoading = loadingCondition || loadingSupply;
  const pricePerToken = claimCondition?.pricePerToken;
  const maxClaimableSupply = claimCondition?.maxClaimableSupply;
  const mintedCount = minted ? Number(minted) : 0;
  const maxSupply = maxClaimableSupply ? Number(maxClaimableSupply) : null;
  const remaining = maxSupply ? maxSupply - mintedCount : null;

  // Format price for display
  const formattedPrice = pricePerToken && pricePerToken > 0n
    ? `${formatEther(pricePerToken)} ETH` 
    : 'Free';

  return (
    <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
      {/* NFT Image/Visual */}
      <div className="aspect-square relative bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-primary" />
          </div>
        </div>
        <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0">
          NFT
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="font-consciousness text-lg md:text-xl flex items-center gap-2">
          3EA Earth Access NFT
        </CardTitle>
        <CardDescription className="font-consciousness text-sm">
          Unlock exclusive access to the 3EA Enzyme Vault
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price & Supply Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
              <Coins className="h-3.5 w-3.5" />
              Price
            </div>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              <p className="font-semibold text-foreground text-sm">{formattedPrice}</p>
            )}
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
              <Package className="h-3.5 w-3.5" />
              Supply
            </div>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              <p className="font-semibold text-foreground text-sm">
                {maxSupply 
                  ? `${remaining?.toLocaleString()} left` 
                  : `${mintedCount.toLocaleString()} minted`}
              </p>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Enzyme Vault access</p>
          <p>✓ Managed DeFi strategies</p>
          <p>✓ Member-only content</p>
        </div>

        {/* CTA */}
        <Link to="/vault-access" className="block">
          <Button className="w-full font-consciousness gap-2" variant="default">
            <Wallet className="h-4 w-4" />
            View & Purchase
          </Button>
        </Link>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <ExternalLink className="h-3 w-3" />
          <a 
            href={`https://etherscan.io/address/${NFT_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View on Etherscan
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default NFTStoreCard;