import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertTriangle, Shield, TrendingDown, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import riskHero from "@/assets/tutorials/risk-assessment-hero.jpg";

const RiskAssessmentTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Understanding Risk Types",
      description: "Learn about different types of risks in DeFi",
      content: (
        <div className="space-y-4">
          <KeyTakeaway title="2025 Critical Data">
            The largest DeFi hack in 2024 was $231 million from WazirX. Over 60% of DeFi exploits could have been prevented with proper audits and risk assessment.
          </KeyTakeaway>

          <DidYouKnow fact="Protocols with multiple independent audits from firms like Trail of Bits, CertiK, and OpenZeppelin have a 95% lower hack rate than unaudited protocols." />

          <h3 className="text-lg font-semibold">Types of DeFi Risks</h3>
          <div className="grid gap-4">
            <Card className="p-4 border-destructive/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-destructive" />
                <h4 className="font-semibold">Market Risk</h4>
              </div>
              <p className="text-sm text-muted-foreground">Price volatility, impermanent loss, liquidity risks</p>
            </Card>
            <Card className="p-4 border-awareness/20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-awareness" />
                <h4 className="font-semibold">Smart Contract Risk</h4>
              </div>
              <p className="text-sm text-muted-foreground">Code vulnerabilities, bugs, exploits</p>
            </Card>
            <Card className="p-4 border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-accent" />
                <h4 className="font-semibold">Counterparty Risk</h4>
              </div>
              <p className="text-sm text-muted-foreground">Protocol governance, admin keys, centralization</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Risk Assessment Framework",
      description: "Create a systematic approach to evaluating risks",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Assessment Matrix</h3>
          <div className="space-y-3">
            <div className="border rounded p-3">
              <h4 className="font-semibold text-sm mb-2">1. Protocol Maturity</h4>
              <div className="flex gap-2">
                <Badge variant="destructive">New (&lt;6 months)</Badge>
                <Badge variant="secondary">Established (6-24 months)</Badge>
                <Badge variant="default">Mature (&gt;2 years)</Badge>
              </div>
            </div>
            <div className="border rounded p-3">
              <h4 className="font-semibold text-sm mb-2">2. TVL (Total Value Locked)</h4>
              <div className="flex gap-2">
                <Badge variant="destructive">&lt;$10M</Badge>
                <Badge variant="secondary">$10M-$100M</Badge>
                <Badge variant="default">&gt;$100M</Badge>
              </div>
            </div>
            <div className="border rounded p-3">
              <h4 className="font-semibold text-sm mb-2">3. Audit Status</h4>
              <div className="flex gap-2">
                <Badge variant="destructive">No audits</Badge>
                <Badge variant="secondary">1-2 audits</Badge>
                <Badge variant="default">Multiple audits</Badge>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Due Diligence Checklist",
      description: "Essential checks before investing in any DeFi protocol",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pre-Investment Checklist</h3>
          <div className="space-y-2">
            {[
              "Check if the protocol has been audited",
              "Review the team and their track record",
              "Understand the tokenomics and incentive structure",
              "Assess the total value locked (TVL)",
              "Read the documentation and whitepaper",
              "Check for any past security incidents",
              "Evaluate the governance model",
              "Test with small amounts first"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <Circle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Risk Mitigation Strategies",
      description: "Learn how to minimize and manage risks",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Management Techniques</h3>
          <div className="grid gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Diversification</h4>
              <p className="text-sm text-muted-foreground">Spread investments across multiple protocols and asset types</p>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Position Sizing</h4>
              <p className="text-sm text-muted-foreground">Never invest more than you can afford to lose</p>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Dollar-Cost Averaging</h4>
              <p className="text-sm text-muted-foreground">Enter positions gradually over time</p>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Stop Losses</h4>
              <p className="text-sm text-muted-foreground">Set clear exit criteria for losing positions</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Red Flags and Warning Signs",
      description: "Identify potentially dangerous protocols",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Critical Warning Signs</h3>
          <div className="space-y-3">
            {[
              {
                flag: "Anonymous team with no track record",
                severity: "high"
              },
              {
                flag: "Unrealistic yield promises (>100% APY)",
                severity: "high"
              },
              {
                flag: "No code audits or security reviews",
                severity: "high"
              },
              {
                flag: "Centralized admin keys without timelock",
                severity: "medium"
              },
              {
                flag: "Poor documentation or unclear mechanics",
                severity: "medium"
              },
              {
                flag: "Low liquidity or small TVL",
                severity: "low"
              }
            ].map((item, index) => (
              <div key={index} className={`p-3 border rounded flex items-center gap-3 ${
                item.severity === 'high' ? 'border-destructive bg-destructive/10' :
                item.severity === 'medium' ? 'border-awareness bg-awareness/10' :
                'border-accent bg-accent/10'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  item.severity === 'high' ? 'text-destructive' :
                  item.severity === 'medium' ? 'text-awareness' :
                  'text-accent'
                }`} />
                <span className="text-sm">{item.flag}</span>
                <Badge variant={item.severity === 'high' ? 'destructive' : 'secondary'} className="ml-auto">
                  {item.severity}
                </Badge>
              </div>
            ))}
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 mobile-typography-center">
        {/* Back to Tutorials Button */}
        <div className="mb-6">
          <Link to="/tutorials">
            <Button variant="ghost" className="gap-2 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Back to Tutorials
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={riskHero} 
            alt="DeFi risk assessment dashboard with security metrics and analysis tools" 
            className="w-full h-48 md:h-64 object-cover"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Risk Assessment in Action</h1>
            <p className="text-muted-foreground">Learn to evaluate and manage DeFi risks systematically</p>
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
                        if (!completed.includes('risk-assessment')) {
                          completed.push('risk-assessment');
                          localStorage.setItem('completedTutorials', JSON.stringify(completed));
                        }
                        
                        toast.success("Tutorial Complete! 🎉 You've mastered DeFi risk assessment.");
                        setTimeout(() => {
                          window.location.href = "/tutorials?tab=practical";
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

export default RiskAssessmentTutorial;