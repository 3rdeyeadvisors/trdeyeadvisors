import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Image, Coins, Lock, ArrowLeft, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NftDefiTutorial = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "NFT Fundamentals",
      description: "Understanding NFTs and their unique properties",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What Makes NFTs Special?</h3>
          <div className="grid gap-4">
            <Card className="p-4 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Image className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Non-Fungible</h4>
              </div>
              <p className="text-sm text-muted-foreground">Each NFT is unique and cannot be replaced by another identical item</p>
            </Card>
            <Card className="p-4 border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-accent" />
                <h4 className="font-semibold">Blockchain Verified</h4>
              </div>
              <p className="text-sm text-muted-foreground">Ownership and authenticity are verified on the blockchain</p>
            </Card>
            <Card className="p-4 border-awareness/20">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-awareness" />
                <h4 className="font-semibold">Programmable</h4>
              </div>
              <p className="text-sm text-muted-foreground">Smart contracts can add utility and functionality</p>
            </Card>
          </div>
          
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Common NFT Standards</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-muted rounded">
                <h5 className="font-medium text-sm">ERC-721</h5>
                <p className="text-xs text-muted-foreground">Individual unique tokens</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <h5 className="font-medium text-sm">ERC-1155</h5>
                <p className="text-xs text-muted-foreground">Semi-fungible tokens</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "NFT Lending and Borrowing",
      description: "Use NFTs as collateral for loans",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">NFT-Collateralized Lending</h3>
          
          <Card className="p-4 bg-accent/10 border-accent">
            <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Deposit your NFT as collateral</li>
              <li>2. Receive a loan in cryptocurrency (usually ETH or stablecoins)</li>
              <li>3. Pay interest over the loan period</li>
              <li>4. Repay the loan to get your NFT back</li>
              <li>5. If you default, the lender keeps your NFT</li>
            </ol>
          </Card>
          
          <div className="grid gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Popular NFT Lending Platforms</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="font-medium">BendDAO</span>
                  <Badge variant="outline">Ethereum</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="font-medium">NFTfi</span>
                  <Badge variant="outline">P2P Lending</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="font-medium">Arcade</span>
                  <Badge variant="outline">Institutional</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Key Considerations</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Loan-to-Value (LTV):</strong> Usually 30-50% of NFT floor price</li>
                <li>• <strong>Interest rates:</strong> Typically higher than traditional DeFi</li>
                <li>• <strong>Liquidation risk:</strong> NFT can be sold if you default</li>
                <li>• <strong>Floor price volatility:</strong> NFT values can change rapidly</li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "NFT Yield Farming",
      description: "Earn rewards by staking or providing NFT liquidity",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generating Yield from NFTs</h3>
          
          <div className="grid gap-4">
            <Card className="p-4 border-success/20">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-5 h-5 text-success" />
                <h4 className="font-semibold">NFT Staking</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Lock your NFTs to earn token rewards</p>
              <ul className="text-xs space-y-1">
                <li>• Keep ownership while earning passive income</li>
                <li>• Rewards often paid in project tokens</li>
                <li>• May require holding for minimum periods</li>
              </ul>
            </Card>
            
            <Card className="p-4 border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-5 h-5 text-accent" />
                <h4 className="font-semibold">Liquidity Mining</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Provide NFT liquidity to earn trading fees</p>
              <ul className="text-xs space-y-1">
                <li>• Deposit NFTs into liquidity pools</li>
                <li>• Earn from trading fees and incentives</li>
                <li>• Risk of impermanent loss equivalent</li>
              </ul>
            </Card>
            
            <Card className="p-4 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Fractionalized Ownership</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Own fractions of expensive NFTs</p>
              <ul className="text-xs space-y-1">
                <li>• Split expensive NFTs into tradeable tokens</li>
                <li>• Lower barrier to entry</li>
                <li>• Share in potential appreciation</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4 bg-awareness/10 border-awareness">
            <h4 className="font-semibold text-foreground mb-2">⚠️ Yield Farming Risks</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Smart contract vulnerabilities</li>
              <li>• Token price volatility</li>
              <li>• Liquidity risks when unstaking</li>
              <li>• Regulatory uncertainty</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: "NFT Marketplaces and Trading",
      description: "Navigate NFT markets and trading strategies",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">NFT Trading Strategies</h3>
          
          <div className="grid gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Major NFT Marketplaces</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">OpenSea</span>
                    <p className="text-xs text-muted-foreground">Largest NFT marketplace</p>
                  </div>
                  <Badge variant="outline">2.5% fee</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">LooksRare</span>
                    <p className="text-xs text-muted-foreground">Rewards for trading</p>
                  </div>
                  <Badge variant="outline">2% fee</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">X2Y2</span>
                    <p className="text-xs text-muted-foreground">Lower fees</p>
                  </div>
                  <Badge variant="outline">0.5% fee</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Trading Strategies</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded">
                  <h5 className="font-medium text-sm">Floor Sweeping</h5>
                  <p className="text-xs text-muted-foreground">Buy multiple NFTs at floor price</p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium text-sm">Trait Sniping</h5>
                  <p className="text-xs text-muted-foreground">Target undervalued rare traits</p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium text-sm">Flip Trading</h5>
                  <p className="text-xs text-muted-foreground">Quick buy and sell for profit</p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium text-sm">Long-term Holding</h5>
                  <p className="text-xs text-muted-foreground">Accumulate blue-chip collections</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Analysis Tools</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Rarity tools:</strong> Understand trait rarity and value</li>
              <li>• <strong>Floor tracking:</strong> Monitor price movements</li>
              <li>• <strong>Volume analysis:</strong> Track trading activity</li>
              <li>• <strong>Whale watching:</strong> Follow large holders</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: "Gaming and Metaverse NFTs",
      description: "Explore utility NFTs in gaming and virtual worlds",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Utility-Driven NFTs</h3>
          
          <div className="grid gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Gaming NFTs</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded">
                  <h5 className="font-medium text-sm">In-Game Assets</h5>
                  <p className="text-xs text-muted-foreground">Weapons, characters, skins that you truly own</p>
                </div>
                <div className="p-2 border rounded">
                  <h5 className="font-medium text-sm">Play-to-Earn</h5>
                  <p className="text-xs text-muted-foreground">Earn NFTs and tokens by playing games</p>
                </div>
                <div className="p-2 border rounded">
                  <h5 className="font-medium text-sm">Cross-Game Utility</h5>
                  <p className="text-xs text-muted-foreground">Use NFTs across multiple games/platforms</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Virtual Real Estate</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded">
                  <h5 className="font-medium text-sm">Land Ownership</h5>
                  <p className="text-xs text-muted-foreground">Own virtual plots in metaverse worlds</p>
                </div>
                <div className="p-2 border rounded">
                  <h5 className="font-medium text-sm">Development Rights</h5>
                  <p className="text-xs text-muted-foreground">Build experiences on your land</p>
                </div>
                <div className="p-2 border rounded">
                  <h5 className="font-medium text-sm">Rental Income</h5>
                  <p className="text-xs text-muted-foreground">Lease land to other users/brands</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Popular Gaming Ecosystems</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">Axie Infinity</h5>
                <p className="text-xs text-muted-foreground">Pet battling game</p>
              </div>
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">The Sandbox</h5>
                <p className="text-xs text-muted-foreground">Voxel metaverse</p>
              </div>
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">Decentraland</h5>
                <p className="text-xs text-muted-foreground">Virtual world platform</p>
              </div>
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">Gods Unchained</h5>
                <p className="text-xs text-muted-foreground">Trading card game</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      title: "Risk Management for NFT-DeFi",
      description: "Protect yourself in the volatile NFT market",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">NFT-Specific Risks</h3>
          
          <div className="space-y-4">
            <Card className="p-4 bg-destructive/10 border-destructive">
              <h4 className="font-semibold text-foreground mb-2">Major Risk Categories</h4>
              <div className="space-y-2">
                <div className="p-2 border border-destructive/30 rounded">
                  <h5 className="font-medium text-sm text-destructive">Liquidity Risk</h5>
                  <p className="text-xs text-muted-foreground">NFTs can become illiquid quickly</p>
                </div>
                <div className="p-2 border border-destructive/30 rounded">
                  <h5 className="font-medium text-sm text-destructive">Volatility Risk</h5>
                  <p className="text-xs text-muted-foreground">Prices can swing dramatically</p>
                </div>
                <div className="p-2 border border-destructive/30 rounded">
                  <h5 className="font-medium text-sm text-destructive">Technical Risk</h5>
                  <p className="text-xs text-muted-foreground">Smart contract bugs and exploits</p>
                </div>
                <div className="p-2 border border-destructive/30 rounded">
                  <h5 className="font-medium text-sm text-destructive">Regulatory Risk</h5>
                  <p className="text-xs text-muted-foreground">Uncertain legal framework</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Risk Mitigation Strategies</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Diversification:</strong> Don't put all funds in NFTs</li>
                <li>• <strong>Blue-chip focus:</strong> Stick to established collections</li>
                <li>• <strong>Due diligence:</strong> Research team, roadmap, utility</li>
                <li>• <strong>Start small:</strong> Test platforms with small amounts</li>
                <li>• <strong>Monitor markets:</strong> Stay updated on trends and news</li>
                <li>• <strong>Secure storage:</strong> Use hardware wallets for valuable NFTs</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Portfolio Allocation Guidelines</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Conservative investor</span>
                  <Badge variant="outline">2-5% in NFTs</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Moderate investor</span>
                  <Badge variant="outline">5-10% in NFTs</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Aggressive investor</span>
                  <Badge variant="outline">10-20% in NFTs</Badge>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Best Practices</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Never invest more than you can afford to lose</li>
              <li>• Keep detailed records for tax purposes</li>
              <li>• Stay informed about market trends and developments</li>
              <li>• Build relationships in the NFT community</li>
              <li>• Consider the long-term utility, not just speculation</li>
            </ul>
          </Card>
        </div>
      )
    }
  ];

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      toast.success(`Step ${stepIndex + 1} completed!`);
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 mobile-typography-center">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/tutorials')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tutorials
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">NFT & DeFi Integration</h1>
            <p className="text-muted-foreground">Discover how NFTs and DeFi protocols work together</p>
          </div>
          <Badge variant="secondary">Medium Priority</Badge>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{completedSteps.length}/{steps.length} steps completed</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tutorial Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    currentStep === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center gap-2">
                  {completedSteps.includes(index) ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {steps[currentStep].content}
              
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStepComplete(currentStep)}
                    disabled={completedSteps.includes(currentStep)}
                  >
                    {completedSteps.includes(currentStep) ? 'Completed' : 'Mark Complete'}
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NftDefiTutorial;