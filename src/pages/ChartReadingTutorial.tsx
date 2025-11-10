import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, TrendingUp, BarChart3, LineChart, ArrowLeft, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ChartReadingTutorial = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Chart Types and Timeframes",
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
      title: "Support and Resistance Levels",
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
      title: "Trend Analysis",
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
      title: "Technical Indicators",
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
              <div className="flex gap-2">
                <Badge variant="destructive">Oversold: &lt;30</Badge>
                <Badge variant="secondary">Neutral: 30-70</Badge>
                <Badge variant="destructive">Overbought: &gt;70</Badge>
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
      title: "Chart Patterns",
      description: "Recognize common patterns that predict price movements",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Classic Chart Patterns</h3>
          
          <div className="grid gap-4">
            <Card className="p-4 border-awareness/20 bg-awareness/10">
              <h4 className="font-semibold text-awareness mb-2">Bullish Patterns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cup and Handle</span>
                  <Badge variant="outline" className="text-awareness">Continuation</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Double Bottom</span>
                  <Badge variant="outline" className="text-awareness">Reversal</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ascending Triangle</span>
                  <Badge variant="outline" className="text-awareness">Continuation</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bull Flag</span>
                  <Badge variant="outline" className="text-awareness">Continuation</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 border-destructive/20 bg-destructive/10">
              <h4 className="font-semibold text-destructive mb-2">Bearish Patterns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Head and Shoulders</span>
                  <Badge variant="outline" className="text-destructive">Reversal</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Double Top</span>
                  <Badge variant="outline" className="text-destructive">Reversal</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Descending Triangle</span>
                  <Badge variant="outline" className="text-destructive">Continuation</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bear Flag</span>
                  <Badge variant="outline" className="text-destructive">Continuation</Badge>
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
      title: "Risk Management Through Charts",
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
            <h1 className="text-3xl font-bold">Advanced Chart Reading</h1>
            <p className="text-muted-foreground">Master technical analysis for better trading decisions</p>
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
                      <CheckCircle className="w-4 h-4 text-awareness" />
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
                    onClick={() => {
                      if (currentStep === steps.length - 1) {
                        handleStepComplete(currentStep);
                        
                        // Save completion to localStorage
                        const completed = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
                        if (!completed.includes('chart-reading')) {
                          completed.push('chart-reading');
                          localStorage.setItem('completedTutorials', JSON.stringify(completed));
                        }
                        
                        toast.success("Tutorial Complete! 🎉 You've mastered chart reading.");
                        setTimeout(() => {
                          navigate('/tutorials?tab=advanced');
                        }, 1500);
                      } else {
                        setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
                      }
                    }}
                  >
                    {currentStep === steps.length - 1 ? 'Finish Tutorial' : 'Next'}
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

export default ChartReadingTutorial;