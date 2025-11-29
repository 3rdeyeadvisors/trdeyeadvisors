import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, LineChart, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopOnlyNotice } from "@/components/DesktopOnlyNotice";
import { TutorialHeader } from "@/components/course/TutorialHeader";
import { StepNavigation } from "@/components/course/StepNavigation";

const ChartReadingTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const isMobile = useIsMobile();

  const steps = [
    {
      id: 0,
      title: "Chart Types and Timeframes",
      icon: LineChart,
      duration: "5 min",
      description: "Understanding different chart types and when to use them",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Essential Chart Types</h3>
          <div className="grid gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <LineChart className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Line Charts</h4>
              </div>
              <p className="text-sm text-muted-foreground">Simple price movements over time, best for trend identification</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-awareness" />
                <h4 className="font-semibold">Candlestick Charts</h4>
              </div>
              <p className="text-sm text-muted-foreground">Shows open, high, low, close prices - most detailed view</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-accent" />
                <h4 className="font-semibold">Volume Charts</h4>
              </div>
              <p className="text-sm text-muted-foreground">Trading volume indicating market strength and conviction</p>
            </Card>
          </div>
          
          <h4 className="font-semibold mt-6">Timeframe Selection</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded">
              <h5 className="font-medium text-sm">Short-term (1m-1h)</h5>
              <p className="text-xs text-muted-foreground">Day trading, quick entries/exits</p>
            </div>
            <div className="p-3 border rounded">
              <h5 className="font-medium text-sm">Medium-term (4h-1d)</h5>
              <p className="text-xs text-muted-foreground">Swing trading, position management</p>
            </div>
            <div className="p-3 border rounded">
              <h5 className="font-medium text-sm">Long-term (1w-1M)</h5>
              <p className="text-xs text-muted-foreground">Investment decisions, major trends</p>
            </div>
            <div className="p-3 border rounded">
              <h5 className="font-medium text-sm">Multi-timeframe</h5>
              <p className="text-xs text-muted-foreground">Complete market picture</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Support and Resistance Levels",
      icon: BarChart3,
      duration: "4 min",
      description: "Identify key price levels that act as barriers",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Understanding Support & Resistance</h3>
          
          <Card className="p-4 bg-awareness/10 border-awareness/20">
            <h4 className="font-semibold text-awareness mb-2">Support Levels</h4>
            <p className="text-sm text-foreground">Price levels where buying pressure is strong enough to prevent further decline</p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Previous lows that held multiple times</li>
              <li>• Round numbers (psychological levels)</li>
              <li>• Moving averages acting as dynamic support</li>
            </ul>
          </Card>
          
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <h4 className="font-semibold text-destructive mb-2">Resistance Levels</h4>
            <p className="text-sm text-foreground">Price levels where selling pressure prevents further upward movement</p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Previous highs that rejected price</li>
              <li>• Major round numbers</li>
              <li>• Trend lines and moving averages</li>
            </ul>
          </Card>
          
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Trading Strategy</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Buy near support:</strong> Look for bounces off established support levels</p>
              <p><strong>Sell near resistance:</strong> Take profits as price approaches resistance</p>
              <p><strong>Breakout trading:</strong> Enter positions when price breaks through key levels with volume</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Trend Analysis",
      icon: TrendingUp,
      duration: "5 min",
      description: "Identify and follow market trends",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trend Identification</h3>
          
          <div className="grid gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-awareness" />
                <h4 className="font-semibold text-awareness">Uptrend</h4>
              </div>
              <p className="text-sm mb-2">Higher highs and higher lows</p>
              <div className="text-xs text-muted-foreground">
                <p>• Price consistently breaks above previous highs</p>
                <p>• Pullbacks don't break previous support</p>
                <p>• Increasing volume on upward moves</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-destructive rotate-180" />
                <h4 className="font-semibold text-destructive">Downtrend</h4>
              </div>
              <p className="text-sm mb-2">Lower highs and lower lows</p>
              <div className="text-xs text-muted-foreground">
                <p>• Price consistently breaks below previous lows</p>
                <p>• Rallies fail at previous support (now resistance)</p>
                <p>• Increasing volume on downward moves</p>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-semibold text-foreground">Sideways/Consolidation</h4>
              </div>
              <p className="text-sm mb-2">Price moves within a range</p>
              <div className="text-xs text-muted-foreground">
                <p>• Price bounces between support and resistance</p>
                <p>• No clear direction</p>
                <p>• Often precedes major moves</p>
              </div>
            </Card>
          </div>
          
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Trend Trading Rules</h4>
            <ul className="text-sm space-y-1">
              <li>• "The trend is your friend" - trade with the trend</li>
              <li>• Don't try to catch falling knives</li>
              <li>• Wait for confirmation before entering counter-trend trades</li>
              <li>• Use multiple timeframes to confirm trend direction</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Technical Indicators",
      icon: Activity,
      duration: "6 min",
      description: "Using indicators to confirm signals and timing",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Essential Technical Indicators</h3>
          
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Moving Averages (MA)</h4>
              <p className="text-sm text-muted-foreground mb-2">Smooth out price data to identify trend direction</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-muted rounded">
                  <strong>Simple MA (SMA):</strong> Average of closing prices
                </div>
                <div className="p-2 bg-muted rounded">
                  <strong>Exponential MA (EMA):</strong> More weight on recent prices
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">RSI (Relative Strength Index)</h4>
              <p className="text-sm text-muted-foreground mb-2">Measures overbought/oversold conditions (0-100)</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive" className="whitespace-nowrap">Oversold: &lt;30</Badge>
                <Badge variant="secondary" className="whitespace-nowrap">Neutral: 30-70</Badge>
                <Badge variant="destructive" className="whitespace-nowrap">Overbought: &gt;70</Badge>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">MACD (Moving Average Convergence Divergence)</h4>
              <p className="text-sm text-muted-foreground mb-2">Shows relationship between two moving averages</p>
              <ul className="text-xs space-y-1">
                <li>• MACD line crossing above signal line = bullish</li>
                <li>• MACD line crossing below signal line = bearish</li>
                <li>• Histogram shows momentum strength</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Volume Indicators</h4>
              <p className="text-sm text-muted-foreground mb-2">Confirm price movements with volume analysis</p>
              <ul className="text-xs space-y-1">
                <li>• High volume + price increase = strong bullish signal</li>
                <li>• High volume + price decrease = strong bearish signal</li>
                <li>• Low volume moves are often false signals</li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Chart Patterns",
      icon: BarChart3,
      duration: "5 min",
      description: "Recognize common patterns that predict price movements",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Classic Chart Patterns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-awareness/20 bg-awareness/10">
              <h4 className="font-semibold text-awareness mb-2">Bullish Patterns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Cup and Handle</span>
                  <Badge variant="outline" className="text-awareness whitespace-nowrap w-fit">Continuation</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Double Bottom</span>
                  <Badge variant="outline" className="text-awareness whitespace-nowrap w-fit">Reversal</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Ascending Triangle</span>
                  <Badge variant="outline" className="text-awareness whitespace-nowrap w-fit">Continuation</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Bull Flag</span>
                  <Badge variant="outline" className="text-awareness whitespace-nowrap w-fit">Continuation</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-destructive/20 bg-destructive/10">
              <h4 className="font-semibold text-destructive mb-2">Bearish Patterns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Head and Shoulders</span>
                  <Badge variant="outline" className="text-destructive whitespace-nowrap w-fit">Reversal</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Double Top</span>
                  <Badge variant="outline" className="text-destructive whitespace-nowrap w-fit">Reversal</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Descending Triangle</span>
                  <Badge variant="outline" className="text-destructive whitespace-nowrap w-fit">Continuation</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span>Bear Flag</span>
                  <Badge variant="outline" className="text-destructive whitespace-nowrap w-fit">Continuation</Badge>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Pattern Trading Strategy</h4>
            <ol className="text-sm space-y-1">
              <li>1. <strong>Identify the pattern:</strong> Wait for complete formation</li>
              <li>2. <strong>Confirm with volume:</strong> Breakouts should have increasing volume</li>
              <li>3. <strong>Set entry point:</strong> Enter on breakout, not during formation</li>
              <li>4. <strong>Define stop loss:</strong> Place below support for bullish patterns</li>
              <li>5. <strong>Calculate target:</strong> Measure pattern height and project</li>
            </ol>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Risk Management Through Charts",
      icon: LineChart,
      duration: "4 min",
      description: "Use charts to manage position size and risk",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Chart-Based Risk Management</h3>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Position Sizing</h4>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">Risk Per Trade: 1-2% of Portfolio</h5>
                <p className="text-xs text-muted-foreground">Never risk more than you can afford to lose on a single trade</p>
              </div>
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">Stop Loss Placement</h5>
                <p className="text-xs text-muted-foreground">Use chart levels: below support for longs, above resistance for shorts</p>
              </div>
              <div className="p-3 border rounded">
                <h5 className="font-medium text-sm">Risk-Reward Ratio</h5>
                <p className="text-xs text-muted-foreground">Aim for minimum 1:2 ratio (risk $1 to make $2)</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Entry and Exit Strategies</h4>
            <div className="grid gap-3">
              <div className="p-3 bg-success/10 border border-success rounded">
                <h5 className="font-medium text-sm text-success">Entry Signals</h5>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Breakout above resistance with volume</li>
                  <li>• Bounce off support level</li>
                  <li>• Pattern completion</li>
                  <li>• Multiple indicator confirmation</li>
                </ul>
              </div>
              
              <div className="p-3 bg-destructive/10 border border-destructive rounded">
                <h5 className="font-medium text-sm text-destructive">Exit Signals</h5>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Price hits predetermined target</li>
                  <li>• Stop loss triggered</li>
                  <li>• Pattern failure or reversal</li>
                  <li>• Volume divergence</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Advanced Risk Techniques</h4>
            <ul className="text-sm space-y-2">
              <li>• <strong>Trailing stops:</strong> Protect profits as price moves favorably</li>
              <li>• <strong>Partial profit taking:</strong> Scale out at resistance levels</li>
              <li>• <strong>Multiple timeframe confirmation:</strong> Align trades across timeframes</li>
              <li>• <strong>Market structure analysis:</strong> Respect major support/resistance zones</li>
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStepComplete(currentStep);
      const completed = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
      if (!completed.includes('chart-reading')) {
        completed.push('chart-reading');
        localStorage.setItem('completedTutorials', JSON.stringify(completed));
      }
      toast.success("Tutorial Complete! 🎉");
      setTimeout(() => window.location.href = "/tutorials", 1500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mobile-typography-center">
      <TutorialHeader
        title="Chart Reading Mastery"
        icon={TrendingUp}
        difficulty="Intermediate"
        duration="30 min"
        currentStep={currentStep + 1}
        totalSteps={steps.length}
        completedSteps={completedSteps}
      />

      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={setCurrentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onMarkComplete={() => handleStepComplete(currentStep)}
        isAuthenticated={true}
      />

      <div className="tutorial-content-area">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>Learn essential chart reading techniques</CardDescription>
          </CardHeader>
          <CardContent>
            {steps[currentStep].content}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartReadingTutorial;