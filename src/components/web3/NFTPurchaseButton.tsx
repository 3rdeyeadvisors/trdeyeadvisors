import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { getNFTContract } from "@/lib/thirdweb";
import { claimTo, getActiveClaimCondition, totalSupply } from "thirdweb/extensions/erc1155";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ExternalLink, Coins, Package, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper to format wei to ETH
const formatEther = (wei: bigint): string => {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(eth < 0.01 ? 4 : 2);
};

interface NFTPurchaseButtonProps {
  onPurchaseComplete?: () => void;
}

// Token ID for the 3EA Access NFT (first token in the ERC1155 collection)
const ACCESS_TOKEN_ID = 0n;
const QUANTITY = 1n;

export const NFTPurchaseButton = ({ onPurchaseComplete }: NFTPurchaseButtonProps) => {
  const account = useActiveAccount();
  const { toast } = useToast();
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
  const formattedPrice = pricePerToken 
    ? `${formatEther(pricePerToken)} ETH` 
    : 'Free';

  if (!account) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Connect your wallet to purchase an NFT</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Purchase 3EA Access NFT
        </CardTitle>
        <CardDescription>
          Claim your NFT to unlock exclusive access to the 3EA Enzyme Vault
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
              <p className="font-semibold text-foreground">{formattedPrice}</p>
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
              <p className="font-semibold text-foreground">
                {maxSupply 
                  ? `${remaining?.toLocaleString()} / ${maxSupply.toLocaleString()}` 
                  : `${mintedCount.toLocaleString()} minted`}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4 text-sm">
          <h4 className="font-medium mb-2">What you get:</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Exclusive access to 3EA Enzyme Vault</li>
            <li>• Deposit & withdraw from managed DeFi strategies</li>
            <li>• Member-only educational content</li>
            <li>• Community access</li>
          </ul>
        </div>

        <TransactionButton
          transaction={() => {
            return claimTo({
              contract,
              to: account.address,
              tokenId: ACCESS_TOKEN_ID,
              quantity: QUANTITY,
            });
          }}
          onTransactionSent={() => {
            toast({
              title: "Transaction Submitted",
              description: "Your NFT claim is being processed...",
            });
          }}
          onTransactionConfirmed={() => {
            toast({
              title: "NFT Claimed!",
              description: "Welcome to 3EA! You now have vault access.",
            });
            onPurchaseComplete?.();
          }}
          onError={(error) => {
            console.error('NFT claim error:', error);
            toast({
              title: "Transaction Failed",
              description: error.message || "Failed to claim NFT. Please try again.",
              variant: "destructive",
            });
          }}
          style={{
            width: "100%",
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontWeight: "600",
            fontSize: "0.875rem",
            border: "none",
            cursor: "pointer",
            minHeight: "44px",
          }}
        >
          Claim Access NFT {pricePerToken && pricePerToken > 0n ? `(${formattedPrice})` : ''}
        </TransactionButton>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <ExternalLink className="h-3 w-3" />
          Transaction processed via your connected wallet
        </p>
      </CardContent>
    </Card>
  );
};

export default NFTPurchaseButton;
