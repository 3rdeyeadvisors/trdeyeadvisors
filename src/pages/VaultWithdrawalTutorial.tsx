import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  Wallet,
  Link2,
  ArrowRight,
  Eye,
  CheckCircle2,
  ExternalLink,
  Clock,
  MinusCircle,
  AlertTriangle,
  DollarSign
} from "lucide-react";

const ENZYME_VAULT_URL = "https://app.enzyme.finance/vault/0x8b668add6fba7c01444353c0dfdef222a816cd9f";
const ENZYME_REDEEM_URL = "https://app.enzyme.finance/vault/0x8b668add6fba7c01444353c0dfdef222a816cd9f/redeem";

const VaultWithdrawalTutorial = () => {
  return (
    <>
      <SEO 
        title="How to Withdraw from the 3EA Vault | Tutorial"
        description="Step-by-step guide to redeeming your vault shares and withdrawing funds from the 3EA Enzyme Vault."
      />

      <div className="container max-w-3xl py-12 space-y-8">
        {/* Back Navigation */}
        <Link to="/vault-access" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Vault Access
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <Badge variant="outline" className="mb-2">
            <Wallet className="h-3 w-3 mr-1" />
            Tutorial
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">How to Withdraw from the 3EA Vault</h1>
          <p className="text-lg text-muted-foreground">
            A complete guide to redeeming your vault shares and getting your funds back.
          </p>
        </div>

        <Separator />

        {/* Important Note */}
        <Alert variant="default" className="bg-amber-500/5 border-amber-500/20">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription>
            <strong>Good to know:</strong> Withdrawals are processed instantly on the blockchain. 
            You'll receive the current value of your vault shares based on the vault's net asset value (NAV).
          </AlertDescription>
        </Alert>

        {/* Step 1: Connect to Enzyme */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Connect to the Enzyme Vault
                </CardTitle>
                <CardDescription>Link your wallet to view your shares</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Navigate to the 3EA vault on Enzyme Finance and connect the same wallet you used to deposit.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click the button below to open the 3EA Vault on Enzyme Finance</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Connect Wallet"</strong> in the top-right corner</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Select <strong>"MetaMask"</strong> and approve the connection</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Your vault share balance should be visible on the vault page</p>
              </div>
            </div>

            <Button asChild className="gap-2">
              <a href={ENZYME_VAULT_URL} target="_blank" rel="noopener noreferrer">
                Open 3EA Vault on Enzyme
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Check Your Share Value */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                2
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Check Your Share Value
                </CardTitle>
                <CardDescription>See how much your shares are worth</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Before withdrawing, review the current value of your vault shares.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>On the vault page, look for your <strong>"Share Balance"</strong> or <strong>"Your Position"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>The value shown is based on the vault's current NAV (Net Asset Value)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Your shares may be worth more or less than your original deposit depending on vault performance</p>
              </div>
            </div>

            <Alert variant="default" className="bg-muted/50">
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> The vault's value fluctuates based on market conditions and the performance of the DeFi strategies being used.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 3: Initiate Withdrawal */}
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MinusCircle className="h-5 w-5" />
                  Initiate Your Withdrawal
                </CardTitle>
                <CardDescription>Redeem your vault shares for the underlying assets</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Click the Redeem button to start the withdrawal process.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>On the vault page, find and click the <strong>"Redeem"</strong> or <strong>"Withdraw"</strong> button</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Enter the number of shares you want to redeem (or click "Max" for all shares)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Review the estimated value you'll receive in the denomination asset (ETH)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Redeem"</strong> or <strong>"Confirm"</strong> to proceed</p>
              </div>
            </div>

            <Button asChild className="gap-2">
              <a href={ENZYME_REDEEM_URL} target="_blank" rel="noopener noreferrer">
                Go to Redeem Page
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 4: Confirm Transaction */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                4
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Confirm the Transaction
                </CardTitle>
                <CardDescription>Approve the withdrawal in MetaMask</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              MetaMask will pop up asking you to confirm the redemption transaction.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Review the transaction details in the MetaMask popup</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Check the gas fee – you'll need enough ETH to cover this</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Confirm"</strong> to submit the transaction</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Wait for the transaction to be confirmed on the blockchain (usually 1-3 minutes)</p>
              </div>
            </div>

            <Alert variant="default" className="bg-muted/50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Tip:</strong> Gas fees are lower during off-peak hours. 
                Check <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">etherscan.io/gastracker</a> for current prices.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 5: Verify Funds Received */}
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                5
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Verify Funds in Your Wallet
                </CardTitle>
                <CardDescription>Check that your withdrawal was successful</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Once the transaction is confirmed, your funds will appear in your MetaMask wallet.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Open MetaMask and check your ETH balance</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Your balance should have increased by the redeemed amount (minus gas fees)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Your vault share balance on Enzyme should be reduced or zero</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>You can view the transaction on <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Etherscan</a> for full details</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold">Withdrawal Complete!</p>
                <p className="text-sm text-muted-foreground">
                  Your funds are now back in your wallet. You can re-deposit at any time as long as you still hold the access NFT.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/vault-deposit-guide" className="text-sm text-primary hover:underline text-center">
            ← View Deposit Guide
          </Link>
          <Link to="/contact" className="text-sm text-primary hover:underline text-center">
            Need Help? Contact Us
          </Link>
        </div>
      </div>
    </>
  );
};

export default VaultWithdrawalTutorial;
