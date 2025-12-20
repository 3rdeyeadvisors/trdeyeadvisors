import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { getNFTContract } from "@/lib/thirdweb";
import { prepareContractCall } from "thirdweb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NFTPurchaseButtonProps {
  onPurchaseComplete?: () => void;
}

export const NFTPurchaseButton = ({ onPurchaseComplete }: NFTPurchaseButtonProps) => {
  const account = useActiveAccount();
  const { toast } = useToast();
  const contract = getNFTContract();

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
          Mint your NFT to unlock exclusive access to the 3EA Enzyme Vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            // Prepare the mint transaction
            // Adjust the method name and params based on your NFT contract
            return prepareContractCall({
              contract,
              method: "function mint()",
              params: [],
            });
          }}
          onTransactionSent={() => {
            toast({
              title: "Transaction Submitted",
              description: "Your NFT purchase is being processed...",
            });
          }}
          onTransactionConfirmed={() => {
            toast({
              title: "NFT Purchased!",
              description: "Welcome to 3EA! You now have vault access.",
            });
            onPurchaseComplete?.();
          }}
          onError={(error) => {
            console.error('NFT purchase error:', error);
            toast({
              title: "Transaction Failed",
              description: error.message || "Failed to purchase NFT. Please try again.",
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
          }}
        >
          Mint Access NFT
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
