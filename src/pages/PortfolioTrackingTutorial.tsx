import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  BarChart3,
  PieChart,
  TrendingUp,
  RefreshCw,
  Shield,
  CheckCircle,
  Circle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopOnlyNotice } from "@/components/DesktopOnlyNotice";

const PortfolioTrackingTutorial = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const totalSteps = 6;
  const progress = ((completedSteps.length) / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: "Why Track Your DeFi Portfolio?",
      icon: PieChart,
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Critical for Success:</strong> 78% of successful DeFi investors actively track their portfolios daily. Without tracking, you're flying blind.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-awareness" />
                  Track Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Monitor returns across protocols, identify winning strategies, and cut losing positions early.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-awareness" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Spot concentration risks, monitor liquidation levels, and maintain balanced exposure.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-awareness" />
                  Tax Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Accurate transaction history makes tax time painless and ensures compliance.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-awareness" />
                  Optimize Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                See where capital is working best and rebalance to maximize returns.
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Choose Your Tracking Tools",
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Top DeFi Portfolio Trackers</h4>
          
          <Card className="border-awareness/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Zapper</CardTitle>
                <Badge>Best Overall</Badge>
              </div>
              <CardDescription>Clean interface, multi-chain support, DeFi action shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Best For:</strong> Active DeFi users who want quick position management</p>
              <p><strong>Chains:</strong> 20+ including Ethereum, Polygon, Arbitrum, Optimism</p>
              <p><strong>Free Tier:</strong> Full features, unlimited wallets</p>
              <a href="https://zapper.fi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">Visit Zapper →</a>
            </CardContent>
          </Card>

          <Card className="border-awareness/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">DeBank</CardTitle>
                <Badge variant="secondary">Most Comprehensive</Badge>
              </div>
              <CardDescription>Deep analytics, social features, protocol insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Best For:</strong> Users who want detailed analytics and discovery</p>
              <p><strong>Chains:</strong> 30+ chains with deep protocol integration</p>
              <p><strong>Free Tier:</strong> Full access, portfolio sharing, social features</p>
              <a href="https://debank.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">Visit DeBank →</a>
            </CardContent>
          </Card>

          <Card className="border-awareness/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Zerion</CardTitle>
                <Badge variant="secondary">Best Mobile</Badge>
              </div>
              <CardDescription>Mobile-first design with built-in wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Best For:</strong> Mobile users who want wallet + tracker in one</p>
              <p><strong>Chains:</strong> 15+ major chains</p>
              <p><strong>Free Tier:</strong> Basic tracking, premium for advanced features</p>
              <a href="https://zerion.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">Visit Zerion →</a>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Use 2-3 trackers! They each catch different protocols. Cross-reference for complete accuracy.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: 3,
      title: "Connect Your Wallets",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Privacy Note:</strong> Portfolio trackers are read-only. They cannot move your funds. You're only sharing your public wallet address.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 1: Gather Your Wallet Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>You'll need the public address (0x...) for each wallet you use:</p>
                <ul className="space-y-1 ml-4">
                  <li>• MetaMask wallet addresses</li>
                  <li>• Hardware wallet addresses (Ledger, Trezor)</li>
                  <li>• Exchange withdrawal addresses you control</li>
                  <li>• Any other self-custody wallet addresses</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 2: Add Wallets to Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold">In Zapper or DeBank:</p>
                  <ol className="ml-4 space-y-1">
                    <li>1. Click "Add Wallet" or "Connect Wallet"</li>
                    <li>2. Choose "Watch Address" (not "Connect")</li>
                    <li>3. Paste your wallet address</li>
                    <li>4. Label it (e.g., "Main Trading Wallet")</li>
                    <li>5. Repeat for all wallets</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step 3: Verify All Positions Appear</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>After adding wallets, check that you see:</p>
                <ul className="space-y-1 ml-4">
                  <li>✓ Token balances across all chains</li>
                  <li>✓ LP positions in DEXes (Uniswap, Sushiswap, etc.)</li>
                  <li>✓ Lending positions (Aave, Compound)</li>
                  <li>✓ Staked assets</li>
                  <li>✓ Yield farming positions</li>
                </ul>
                <Alert className="mt-3">
                  <AlertDescription>
                    Missing positions? Try refreshing or check if the protocol is supported.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Organize Your Dashboard",
      icon: PieChart,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Create a Tracking System</h4>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Label Everything</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Use clear wallet labels to track strategy:</p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• "Conservative Stables" - Low-risk stable farming</li>
                <li>• "High Yield Farming" - Aggressive strategies</li>
                <li>• "Long-term Holdings" - Buy and hold positions</li>
                <li>• "Trading Wallet" - Active trading</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Set Up Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Most trackers let you set notifications for:</p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Large price movements (±10%)</li>
                <li>• Liquidation warnings</li>
                <li>• Yield rate changes</li>
                <li>• Transaction confirmations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Track These Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-xs mb-1">Essential Metrics:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Total portfolio value (USD)</li>
                    <li>• 24h change %</li>
                    <li>• Asset allocation by chain</li>
                    <li>• Protocol distribution</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-xs mb-1">Advanced Metrics:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Realized vs unrealized gains</li>
                    <li>• Average entry prices</li>
                    <li>• Yield generated per protocol</li>
                    <li>• Gas costs vs returns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Daily Tracking Routine",
      icon: RefreshCw,
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>The 5-Minute Daily Review:</strong> Consistency beats perfection. Spend 5 minutes daily, not hours weekly.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-awareness" />
                  Morning Check (2 min)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ul className="space-y-1 ml-4 text-muted-foreground">
                  <li>✓ Check total portfolio value</li>
                  <li>✓ Review overnight performance</li>
                  <li>✓ Scan for any alerts or warnings</li>
                  <li>✓ Check liquidation health (if applicable)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-awareness" />
                  Evening Review (3 min)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ul className="space-y-1 ml-4 text-muted-foreground">
                  <li>✓ Review day's performance by protocol</li>
                  <li>✓ Check for yield rate changes</li>
                  <li>✓ Note any positions that need attention</li>
                  <li>✓ Plan tomorrow's actions if needed</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-awareness" />
                  Weekly Deep Dive (15 min)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ul className="space-y-1 ml-4 text-muted-foreground">
                  <li>✓ Compare performance to last week</li>
                  <li>✓ Analyze winning and losing positions</li>
                  <li>✓ Review allocation vs targets</li>
                  <li>✓ Identify rebalancing opportunities</li>
                  <li>✓ Research new protocols (if interested)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Advanced Tracking & Tax Prep",
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Export for Tax Reporting</h4>

          <Alert className="border-awareness/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tax Time Ready:</strong> Most countries require reporting DeFi gains. Track now, save headaches later.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Portfolio trackers can export your complete transaction history:</p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• All swaps, deposits, and withdrawals</li>
                <li>• Yield earned per protocol</li>
                <li>• Realized gains/losses</li>
                <li>• Gas fees paid</li>
              </ul>
              <p className="mt-3">Most popular tax software integrates directly with Zapper and DeBank.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">DeFi Tax Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">CoinTracker</p>
                  <p className="text-xs text-muted-foreground">Imports from most DeFi protocols, generates tax forms</p>
                </div>
                <div>
                  <p className="font-semibold">Koinly</p>
                  <p className="text-xs text-muted-foreground">Great for complex DeFi transactions, supports 20+ countries</p>
                </div>
                <div>
                  <p className="font-semibold">TokenTax</p>
                  <p className="text-xs text-muted-foreground">Specialized in DeFi yield farming and LP taxation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Benchmarking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Compare your returns against:</p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• DeFi Pulse Index (overall DeFi market)</li>
                <li>• ETH performance (baseline)</li>
                <li>• Top protocol yields</li>
                <li>• Your historical performance</li>
              </ul>
              <Alert className="mt-3">
                <AlertDescription className="text-xs">
                  Aim to beat "hold ETH" strategy after accounting for time and risk.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      const newCompleted = [...completedSteps, currentStep];
      setCompletedSteps(newCompleted);
      toast({
        title: "Step Completed!",
        description: `You've completed step ${currentStep} of ${totalSteps}`,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      handleStepComplete();
      setCurrentStep(currentStep + 1);
    } else {
      handleStepComplete();
      // Save completion
      const completed = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
      if (!completed.includes('portfolio-tracking')) {
        completed.push('portfolio-tracking');
        localStorage.setItem('completedTutorials', JSON.stringify(completed));
      }
      toast({
        title: "Tutorial Complete! 🎉",
        description: "You're now ready to track your DeFi portfolio like a pro!",
      });
      setTimeout(() => {
        window.location.href = "/tutorials?tab=practical";
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps.find(s => s.id === currentStep);
  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/tutorials?tab=practical">
            <Button variant="ghost" className="gap-2 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Back to Practical DeFi Actions
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Portfolio Tracking Setup</h1>
              <p className="text-muted-foreground">Set up comprehensive DeFi portfolio tracking and monitoring</p>
            </div>
            <Badge variant="secondary">Medium Priority</Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedSteps.length}/{totalSteps} steps completed</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {steps.map((step) => (
            <Card 
              key={step.id}
              className={`cursor-pointer transition-all ${
                currentStep === step.id ? 'ring-2 ring-primary' : ''
              } ${isStepCompleted(step.id) ? 'bg-awareness/5' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <CardContent className="p-3 flex items-center gap-2">
                {isStepCompleted(step.id) ? (
                  <CheckCircle className="h-4 w-4 text-awareness flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className="text-xs font-medium truncate">Step {step.id}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Step Content */}
        {currentStepData && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <currentStepData.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{currentStepData.title}</CardTitle>
                    <CardDescription>
                      Step {currentStep} of {totalSteps}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={isStepCompleted(currentStep) ? "default" : "secondary"}>
                  {isStepCompleted(currentStep) ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStepData.content}

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {!isStepCompleted(currentStep) && (
                    <Button
                      variant="secondary"
                      onClick={handleStepComplete}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  
                  <Button onClick={handleNext}>
                    {currentStep === totalSteps ? "Finish Tutorial" : "Next Step"}
                    {currentStep < totalSteps && <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PortfolioTrackingTutorial;
