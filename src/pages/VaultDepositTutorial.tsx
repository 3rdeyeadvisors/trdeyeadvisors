import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowLeft,
  Wallet,
  Download,
  Shield,
  Link2,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

const ENZYME_VAULT_URL = "https://app.enzyme.finance/vault/0x8b668add6fba7c01444353c0dfdef222a816cd9f";
const VAULT_TOKEN_ADDRESS = "0x8b668add6fba7c01444353c0dfdef222a816cd9f";
const METAMASK_DOWNLOAD_URL = "https://metamask.io/download/";
const THIRDWEB_NFT_URL = "https://thirdweb.com/ethereum/0x91AE8ec3d88E871679F826c1D6c5B008f105506c";

const VaultDepositTutorial = () => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <>
      <SEO 
        title="How to Deposit into the 3EA Vault | Tutorial"
        description="Step-by-step guide to depositing into the 3EA Enzyme Vault using MetaMask. Learn how to connect, deposit, and view your vault tokens."
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
          <h1 className="text-3xl md:text-4xl font-bold">How to Deposit into the 3EA Vault</h1>
          <p className="text-lg text-muted-foreground">
            A complete guide to depositing into our Enzyme vault and viewing your vault tokens in MetaMask.
          </p>
        </div>

        <Separator />

        {/* Step 1: Get the Access NFT */}
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Get the 3EA Earth Access NFT
                </CardTitle>
                <CardDescription>Your membership key to the vault</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The 3EA Earth Access NFT is required to deposit into the vault. Without it, you won't be able to access the vault even if you connect your wallet.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Visit the Thirdweb page and connect your MetaMask wallet</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Buy"</strong> to purchase the NFT with ETH from your wallet</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Confirm the transaction in MetaMask and wait for it to complete</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>The NFT will appear in your wallet once the transaction is confirmed</p>
              </div>
            </div>

            <Button asChild className="gap-2">
              <a href={THIRDWEB_NFT_URL} target="_blank" rel="noopener noreferrer">
                Get Your Access NFT
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Wait for Whitelisting */}
        <Card className="border-amber-500/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 font-bold">
                2
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Wait for Whitelisting
                </CardTitle>
                <CardDescription>Your wallet needs to be added to the vault's whitelist</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              After purchasing the NFT, your wallet address needs to be whitelisted on the Enzyme vault. This is a manual process that can take up to 7 days.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Wait up to <strong>7 days</strong> after your NFT purchase for whitelisting</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Check the vault periodically by connecting your wallet to Enzyme</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>If the <strong>"Deposit"</strong> button is available and clickable, you're whitelisted!</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>If you see an error or the button is disabled, check back in a day or two</p>
              </div>
            </div>

            <Alert variant="default" className="bg-amber-500/5 border-amber-500/20">
              <Clock className="h-4 w-4 text-amber-500" />
              <AlertDescription>
                <strong>Be patient:</strong> Whitelisting happens in batches. If it's been more than 7 days, contact us through the <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 3: Install MetaMask */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Install MetaMask
                </CardTitle>
                <CardDescription>Set up your wallet if you haven't already</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              MetaMask is a browser extension wallet that lets you interact with Ethereum dApps like Enzyme Finance.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Go to <a href={METAMASK_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">metamask.io/download</a> and install the browser extension</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Create a new wallet or import an existing one using your seed phrase</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p><strong>Important:</strong> Write down your 12-word recovery phrase and store it securely offline</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Make sure you're connected to <strong>Ethereum Mainnet</strong> (select from the network dropdown at the top)</p>
              </div>
            </div>

            <Button asChild variant="outline" className="gap-2">
              <a href={METAMASK_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                Download MetaMask
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Step 4: Fund Your Wallet */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                4
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Fund Your Wallet
                </CardTitle>
                <CardDescription>Add ETH for deposits and gas fees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You'll need ETH in your wallet for two purposes: your deposit amount and gas fees for the transaction.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Transfer ETH from an exchange (Coinbase, Kraken, etc.) to your MetaMask wallet address</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Your wallet address is shown at the top of MetaMask – click to copy it</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Include extra ETH for gas fees (typically $5-20 depending on network congestion)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Wait for the transfer to complete (usually 5-15 minutes)</p>
              </div>
            </div>

            <Alert variant="default" className="bg-muted/50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Tip:</strong> Gas fees are lower during off-peak hours (weekends, early mornings UTC). 
                Check <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">etherscan.io/gastracker</a> for current gas prices.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 5: Connect to Enzyme */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                5
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Connect to the Enzyme Vault
                </CardTitle>
                <CardDescription>Link your wallet to the 3EA vault</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Navigate to our vault on Enzyme Finance and connect your MetaMask wallet.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click the button below to open the 3EA Vault on Enzyme Finance</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Connect Wallet"</strong> in the top-right corner of the Enzyme page</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Select <strong>"MetaMask"</strong> from the wallet options</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>MetaMask will pop up – click <strong>"Connect"</strong> to approve the connection</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Your wallet address should now appear in the top-right corner</p>
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

        {/* Step 6: Make Your Deposit */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                6
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Make Your Deposit
                </CardTitle>
                <CardDescription>Deposit ETH into the vault</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Once connected, you can deposit ETH into the vault to receive vault shares.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>On the vault page, look for the <strong>"Deposit"</strong> or <strong>"Buy Shares"</strong> button</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Enter the amount of ETH you want to deposit</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Review the transaction details, including the estimated vault shares you'll receive</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Deposit"</strong> or <strong>"Confirm"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>MetaMask will pop up showing the transaction – review the gas fee and click <strong>"Confirm"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Wait for the transaction to be confirmed on the blockchain (usually 1-3 minutes)</p>
              </div>
            </div>

            <Alert variant="default" className="bg-muted/50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Once deposited, your funds are managed by the vault strategy. 
                You can withdraw at any time by redeeming your vault shares.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 7: View Vault Tokens in MetaMask */}
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                7
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  View Vault Tokens in MetaMask
                </CardTitle>
                <CardDescription>Add your vault shares to MetaMask</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your vault shares are ERC-20 tokens. To see them in MetaMask, you need to manually add the token.
            </p>

            {/* Token Address Box */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Vault Token Contract Address:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs md:text-sm bg-background rounded px-3 py-2 overflow-x-auto">
                  {VAULT_TOKEN_ADDRESS}
                </code>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(VAULT_TOKEN_ADDRESS, "Token address")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Open MetaMask and make sure you're on <strong>Ethereum Mainnet</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Scroll down and click <strong>"Import tokens"</strong> at the bottom</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Select the <strong>"Custom token"</strong> tab</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Paste the vault token address (copied above) into the <strong>"Token contract address"</strong> field</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>MetaMask will auto-fill the token symbol and decimals</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>Click <strong>"Add custom token"</strong> and then <strong>"Import tokens"</strong></p>
              </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your vault shares will now appear in your MetaMask token list. The balance reflects your share of the vault's total value.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• <strong>Whitelisting:</strong> After purchasing your NFT, allow up to 7 days for your wallet to be whitelisted.</p>
            <p>• <strong>Non-custodial:</strong> You always maintain control of your funds. Withdraw anytime by redeeming shares.</p>
            <p>• <strong>Gas fees:</strong> All Ethereum transactions require gas. Keep some ETH in your wallet for future transactions.</p>
            <p>• <strong>Vault value:</strong> Your share value fluctuates based on the vault's strategy performance.</p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <a href={ENZYME_VAULT_URL} target="_blank" rel="noopener noreferrer">
              Start Depositing
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/vault-access">
              Back to Vault Access
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default VaultDepositTutorial;