import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { useReadContract } from "thirdweb/react";
import { getNFTContract, NFT_CONTRACT_ADDRESS } from "@/lib/thirdweb";
import { claimTo, getActiveClaimCondition, totalSupply } from "thirdweb/extensions/erc1155";
import { encode } from "thirdweb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, Coins, Package, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";

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
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const contract = getNFTContract();
  const [isPreparing, setIsPreparing] = useState(false);

  // Wagmi send transaction
  const { 
    data: txHash, 
    sendTransaction, 
    isPending: isSending,
    error: sendError,
    reset 
  } = useSendTransaction();

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Fetch active claim condition (includes price) with error handling
  const { 
    data: claimCondition, 
    isLoading: loadingCondition,
    error: conditionError,
    refetch: refetchCondition
  } = useReadContract(
    getActiveClaimCondition,
    {
      contract,
      tokenId: ACCESS_TOKEN_ID,
    }
  );

  // Fetch total minted supply with error handling
  const { 
    data: minted, 
    isLoading: loadingSupply,
    error: supplyError,
    refetch: refetchSupply
  } = useReadContract(
    totalSupply,
    {
      contract,
      id: ACCESS_TOKEN_ID,
    }
  );

  const hasContractError = conditionError || supplyError;

  const handleRetryFetch = useCallback(() => {
    refetchCondition();
    refetchSupply();
  }, [refetchCondition, refetchSupply]);

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

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "NFT Claimed!",
        description: "Welcome to 3EA! You now have vault access.",
      });
      onPurchaseComplete?.();
      reset();
    }
  }, [isConfirmed, onPurchaseComplete, toast, reset]);

  // Handle errors
  useEffect(() => {
    if (sendError) {
      console.error('NFT claim error:', sendError);
      toast({
        title: "Transaction Failed",
        description: sendError.message || "Failed to claim NFT. Please try again.",
        variant: "destructive",
      });
      setIsPreparing(false);
    }
    if (confirmError) {
      console.error('Transaction confirmation error:', confirmError);
      toast({
        title: "Transaction Failed",
        description: "Transaction was not confirmed. Please try again.",
        variant: "destructive",
      });
    }
  }, [sendError, confirmError, toast]);

  // Handle claim click
  const handleClaim = async () => {
    if (!address) return;
    
    setIsPreparing(true);
    
    try {
      // Prepare the claim transaction using thirdweb
      const transaction = claimTo({
        contract,
        to: address,
        tokenId: ACCESS_TOKEN_ID,
        quantity: QUANTITY,
      });

      // Encode the transaction to get calldata
      const data = await encode(transaction);
      
      // Send via wagmi
      sendTransaction({
        to: NFT_CONTRACT_ADDRESS as `0x${string}`,
        data: data as `0x${string}`,
        value: pricePerToken || 0n,
      });
      
      toast({
        title: "Transaction Submitted",
        description: "Your NFT claim is being processed...",
      });
    } catch (error) {
      console.error('Error preparing transaction:', error);
      toast({
        title: "Error",
        description: "Failed to prepare transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPreparing(false);
    }
  };

  const isProcessing = isPreparing || isSending || isConfirming;

  if (!isConnected) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Connect your wallet to purchase an NFT</p>
        </CardContent>
      </Card>
    );
  }

  // Show error state with retry option
  if (hasContractError && !isLoading) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-destructive text-base">
            <AlertCircle className="h-4 w-4" />
            Unable to Load NFT Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Could not connect to the blockchain to fetch NFT information. Please check your network connection.
          </p>
          <Button onClick={handleRetryFetch} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
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

        <Button
          onClick={handleClaim}
          disabled={isProcessing || isLoading}
          className="w-full min-h-[44px]"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isPreparing ? 'Preparing...' : isSending ? 'Confirm in wallet...' : 'Confirming...'}
            </>
          ) : (
            <>
              Claim Access NFT {pricePerToken && pricePerToken > 0n ? `(${formattedPrice})` : ''}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <ExternalLink className="h-3 w-3" />
          Transaction processed via your connected wallet
        </p>
      </CardContent>
    </Card>
  );
};

export default NFTPurchaseButton;
