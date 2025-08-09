import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Wallet, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Eye, 
  EyeOff,
  Download,
  Lock,
  Key,
  Globe,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CommunityHub } from "@/components/community/CommunityHub";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const WalletSetupTutorial = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      id: 1,
      title: "Choose Your Wallet",
      icon: Wallet,
      duration: "2 min",
      content: {
        overview: "Select the right wallet for your DeFi journey. We recommend MetaMask for beginners.",
        walletOptions: [
          {
            name: "MetaMask",
            type: "Browser Extension",
            difficulty: "Beginner",
            pros: ["Most popular", "Great DeFi support", "User-friendly"],
            cons: ["Browser-based only", "Hot wallet"],
            recommended: true
          },
          {
            name: "Trust Wallet",
            type: "Mobile App",
            difficulty: "Beginner", 
            pros: ["Mobile-first", "Built-in DApp browser", "Multi-chain"],
            cons: ["Less DeFi integration", "Mobile only"],
            recommended: false
          },
          {
            name: "Ledger",
            type: "Hardware",
            difficulty: "Advanced",
            pros: ["Maximum security", "Cold storage", "Professional grade"],
            cons: ["Costs money", "Complex setup", "Physical device"],
            recommended: false
          }
        ]
      }
    },
    {
      id: 2,
      title: "Download & Install",
      icon: Download,
      duration: "1 min",
      content: {
        overview: "Get MetaMask from the official source only. Never download from third-party sites.",
        instructions: [
          "Go to metamask.io (verify the URL carefully)",
          "Click 'Download' button",
          "Select your browser (Chrome, Firefox, Brave, Edge)",
          "Install the extension from your browser's official store",
          "Pin the extension to your browser toolbar"
        ],
        warnings: [
          "Only download from metamask.io or official browser stores",
          "Check the URL carefully - scammers create fake sites",
          "Verify the extension has millions of users and good ratings"
        ]
      }
    },
    {
      id: 3,
      title: "Create Your Wallet",
      icon: Key,
      duration: "3 min",
      content: {
        overview: "Set up your new wallet with a strong password and secure seed phrase.",
        instructions: [
          "Click the MetaMask extension icon",
          "Select 'Create a new wallet'",
          "Accept or decline usage analytics (your choice)",
          "Create a strong password (8+ characters, mixed case, numbers, symbols)",
          "Read and accept the Terms of Service",
          "Click 'Create new wallet'"
        ],
        passwordTips: [
          "Use a unique password not used elsewhere",
          "Consider using a password manager",
          "Make it at least 12 characters long",
          "Include uppercase, lowercase, numbers, and symbols"
        ]
      }
    },
    {
      id: 4,
      title: "Secure Your Seed Phrase",
      icon: Shield,
      duration: "5 min",
      content: {
        overview: "Your seed phrase is the master key to your wallet. Treat it like your life savings.",
        seedPhrase: [
          "abandon", "ability", "able", "about", "above", "absent", 
          "absorb", "abstract", "absurd", "abuse", "access", "accident"
        ],
        instructions: [
          "Write down your 12-word seed phrase on paper",
          "Write it down again on a second piece of paper", 
          "Store both copies in different secure locations",
          "Never type it into any device or app",
          "Never take a photo of it",
          "Never store it digitally anywhere"
        ],
        storageOptions: [
          { method: "Physical Paper", security: "Good", notes: "Write clearly, use quality paper" },
          { method: "Metal Backup", security: "Excellent", notes: "Fire/water resistant, lasts forever" },
          { method: "Safety Deposit Box", security: "Excellent", notes: "Bank security, requires access" },
          { method: "Home Safe", security: "Good", notes: "Fire-rated safe, accessible" }
        ]
      }
    },
    {
      id: 5,
      title: "Verify Your Setup",
      icon: CheckCircle,
      duration: "2 min", 
      content: {
        overview: "Test your wallet and confirm your seed phrase backup is correct.",
        instructions: [
          "Click 'Confirm seed phrase' in MetaMask",
          "Select the words in the correct order",
          "Complete the verification successfully",
          "Your wallet is now created and secured!",
          "Add the Polygon network for DeFi access"
        ],
        networkSetup: {
          name: "Add Polygon Network",
          steps: [
            "Click the network dropdown (shows 'Ethereum Mainnet')",
            "Click 'Add network' at the bottom",
            "Search for 'Polygon' and click 'Add'",
            "Approve the network addition"
          ]
        }
      }
    },
    {
      id: 6,
      title: "Security Best Practices", 
      icon: Lock,
      duration: "3 min",
      content: {
        overview: "Essential security practices to keep your wallet safe long-term.",
        practices: [
          {
            title: "Phishing Protection",
            description: "Always check URLs carefully. Bookmark metamask.io and DeFi sites.",
            importance: "Critical"
          },
          {
            title: "Transaction Review",
            description: "Always read transaction details before signing. Check amounts and recipients.",
            importance: "Critical" 
          },
          {
            title: "Regular Backups",
            description: "Test your seed phrase backup periodically to ensure it works.",
            importance: "High"
          },
          {
            title: "Software Updates",
            description: "Keep MetaMask and your browser updated to the latest versions.",
            importance: "High"
          },
          {
            title: "Separate Wallets",
            description: "Consider using different wallets for large amounts vs daily trading.",
            importance: "Medium"
          }
        ],
        redFlags: [
          "Anyone asking for your seed phrase",
          "Urgent messages about 'validating' your wallet",
          "Unexpected transaction prompts",
          "Websites asking you to 'reconnect' your wallet",
          "Support that contacts you first"
        ]
      }
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    toast({
      title: "Step completed!",
      description: `You've completed step ${currentStep}: ${currentStepData?.title}`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);

  return (
    <>
      <SEO 
        title="DeFi Wallet Setup Tutorial - MetaMask Security Guide"
        description="Complete step-by-step guide to setting up MetaMask wallet safely. Learn wallet security, seed phrase protection, and DeFi best practices for beginners."
        keywords="MetaMask setup, DeFi wallet security, cryptocurrency wallet tutorial, seed phrase backup, blockchain wallet guide, DeFi security"
        url="https://www.the3rdeyeadvisors.com/tutorials/wallet-setup"
        schema={{
          type: 'Course',
          data: {
            offers: {
              price: "0",
              priceCurrency: "USD"
            },
            hasCourseInstance: true,
            coursePrerequisites: "No prior experience required",
            educationalLevel: "Beginner",
            teaches: [
              "MetaMask wallet setup",
              "Seed phrase security",
              "DeFi wallet best practices",
              "Cryptocurrency wallet safety",
              "Blockchain security fundamentals"
            ],
            timeRequired: "PT15M",
            courseCode: "WALLET-SETUP-101"
          }
        }}
        faq={[
          {
            question: "How do I set up a MetaMask wallet safely?",
            answer: "Follow our 6-step tutorial: Choose MetaMask, download from official sources, create with strong password, secure your seed phrase, verify setup, and implement security practices. Always write down your seed phrase on paper."
          },
          {
            question: "What is a seed phrase and why is it important?",
            answer: "A seed phrase is a 12-word backup that controls your entire wallet. It's the master key to your cryptocurrency. Never share it, store it digitally, or take photos. Write it on paper and store in secure locations."
          },
          {
            question: "Is MetaMask safe for DeFi?",
            answer: "MetaMask is widely trusted for DeFi when used properly. Follow security practices: verify URLs, review transactions carefully, keep software updated, and never share your seed phrase or private keys."
          }
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 mobile-typography-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Wallet Setup & Security</h1>
              <p className="text-muted-foreground">Complete guide to setting up MetaMask safely</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const completed = isStepCompleted(step.id);
            const current = step.id === currentStep;
            
            return (
              <Button
                key={step.id}
                variant={current ? "default" : completed ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 ${completed ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}`}
              >
                <StepIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
                {completed && <CheckCircle className="h-3 w-3" />}
              </Button>
            );
          })}
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
                      Estimated time: {currentStepData.duration}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={isStepCompleted(currentStep) ? "default" : "secondary"}>
                  {isStepCompleted(currentStep) ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{currentStepData.content.overview}</p>

              {/* Step 1: Choose Wallet */}
              {currentStep === 1 && (
                <div className="grid gap-4">
                  {currentStepData.content.walletOptions?.map((wallet, index) => (
                    <Card key={index} className={`${wallet.recommended ? "border-primary bg-primary/5" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{wallet.name}</CardTitle>
                            <CardDescription>{wallet.type}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{wallet.difficulty}</Badge>
                            {wallet.recommended && <Badge>Recommended</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">Pros:</h4>
                            <ul className="text-sm space-y-1">
                              {wallet.pros.map((pro, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-600 mb-2">Cons:</h4>
                            <ul className="text-sm space-y-1">
                              {wallet.cons.map((con, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 2: Download */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Security Warning:</strong> Only download MetaMask from official sources to avoid scams.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Installation Steps:</h3>
                    <ol className="space-y-2">
                      {currentStepData.content.instructions?.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="text-xs min-w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Critical Warnings:</h4>
                    {currentStepData.content.warnings?.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Create Wallet */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Setup Steps:</h3>
                    <ol className="space-y-2">
                      {currentStepData.content.instructions?.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="text-xs min-w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-800">Password Security Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {currentStepData.content.passwordTips?.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 4: Seed Phrase */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <Alert className="border-red-200 bg-red-50">
                    <Shield className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>CRITICAL:</strong> Your seed phrase is the master key to your wallet. If someone gets it, they own your crypto forever.
                    </AlertDescription>
                  </Alert>

                  {/* Example Seed Phrase */}
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Example Seed Phrase</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                        >
                          {showSeedPhrase ? (
                            <><EyeOff className="h-4 w-4 mr-2" /> Hide</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-2" /> Show</>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {showSeedPhrase ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {currentStepData.content.seedPhrase?.map((word, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                              <Badge variant="outline" className="text-xs w-6 h-6 flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <span className="text-sm font-mono">{word}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          Click "Show" to reveal the example seed phrase
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Storage Instructions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Backup Instructions:</h3>
                    <ol className="space-y-2">
                      {currentStepData.content.instructions?.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="text-xs min-w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Storage Options */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Storage Options:</h3>
                    <div className="grid gap-3">
                      {currentStepData.content.storageOptions?.map((option, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{option.method}</h4>
                              <Badge variant={
                                option.security === "Excellent" ? "default" : 
                                option.security === "Good" ? "secondary" : "outline"
                              }>
                                {option.security}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{option.notes}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Verification */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Verification Steps:</h3>
                    <ol className="space-y-2">
                      {currentStepData.content.instructions?.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="text-xs min-w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {currentStepData.content.networkSetup?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm">
                        {currentStepData.content.networkSetup?.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Badge variant="outline" className="text-xs min-w-6 h-6 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 6: Security Practices */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Essential Security Practices:</h3>
                    <div className="grid gap-4">
                      {currentStepData.content.practices?.map((practice, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{practice.title}</h4>
                              <Badge variant={
                                practice.importance === "Critical" ? "destructive" : 
                                practice.importance === "High" ? "default" : "secondary"
                              }>
                                {practice.importance}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{practice.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="space-y-2">
                        <p className="font-medium">Red Flags - Never Trust:</p>
                        <ul className="space-y-1 text-sm">
                          {currentStepData.content.redFlags?.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step Completion */}
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
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === totalSteps}
                  >
                    {currentStep === totalSteps ? "Finish Tutorial" : "Next Step"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Message */}
        {completedSteps.length === totalSteps && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Congratulations! Wallet Setup Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                You've successfully set up your MetaMask wallet with proper security measures. 
                You're now ready to safely explore DeFi!
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/tutorials">Back to Tutorials</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/courses">Start DeFi Courses</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community Hub */}
        <CommunityHub 
          contentType="tutorial"
          contentId="wallet-setup"
          title="Wallet Setup & Security Tutorial"
        />
      </div>
      </div>
    </>
  );
};

export default WalletSetupTutorial;