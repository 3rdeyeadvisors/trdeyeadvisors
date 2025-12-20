import { useReadContract, useActiveAccount } from "thirdweb/react";
import { getNFTContract } from "@/lib/thirdweb";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

interface NFTOwnershipCheckProps {
  onOwnershipVerified?: (balance: number) => void;
}

export const NFTOwnershipCheck = ({ onOwnershipVerified }: NFTOwnershipCheckProps) => {
  const account = useActiveAccount();
  const contract = getNFTContract();
  const hasCalledCallback = useRef(false);

  const { data: balance, isLoading, error } = useReadContract({
    contract,
    method: "function balanceOf(address owner) view returns (uint256)",
    params: account?.address ? [account.address] : undefined,
  });

  const ownsNFT = balance && BigInt(balance.toString()) > 0n;
  const nftCount = balance ? Number(balance.toString()) : 0;

  // Callback when ownership is verified - use useEffect to avoid render loop
  useEffect(() => {
    if (ownsNFT && onOwnershipVerified && !hasCalledCallback.current) {
      hasCalledCallback.current = true;
      onOwnershipVerified(nftCount);
    }
  }, [ownsNFT, nftCount, onOwnershipVerified]);

  if (!account) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Connect your wallet to check NFT ownership</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking NFT ownership...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex items-center justify-center gap-3 py-8">
          <XCircle className="h-5 w-5 text-destructive" />
          <p className="text-destructive">Error checking NFT ownership</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={ownsNFT ? "border-green-500/50 bg-green-500/5" : "border-amber-500/50 bg-amber-500/5"}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className={`h-5 w-5 ${ownsNFT ? "text-green-500" : "text-amber-500"}`} />
          3EA Access NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ownsNFT ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-500">Verified Owner</span>
              <Badge variant="secondary" className="ml-auto">
                {nftCount} NFT{nftCount > 1 ? 's' : ''}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              You have access to the 3EA Enzyme Vault. Proceed to view vault details and manage your investment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-amber-500">No NFT Found</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You need to own a 3EA Access NFT to access the Enzyme Vault. Purchase an NFT below to gain access.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTOwnershipCheck;
