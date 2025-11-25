import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle, Sparkles, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdLanding = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate("/signup");
  };

  const handleExploreTutorials = () => {
    navigate("/tutorials");
  };

  return (
    <>
      <SEO
        title="Start Your Financial Awareness Journey | 3EA"
        description="Learn how money, markets, and decentralized systems are shifting. Understand the new financial system with clarity instead of confusion."
        keywords="financial education, DeFi learning, cryptocurrency education, awareness movement, decentralized finance"
      />

      <div className="min-h-screen w-full overflow-x-hidden">
        {/* SECTION 1 — Hook */}
        <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-cosmic opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          
          <div className="relative max-w-4xl mx-auto text-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-consciousness">Financial Awareness Movement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-consciousness font-bold mb-4 sm:mb-6 leading-tight">
              The financial system is changing.{" "}
              <span className="text-primary">Most people won't understand it in time.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Learn how money, markets, and decentralized systems are shifting — and how to stay ahead with awareness instead of fear.
            </p>

            <Button 
              onClick={handleStartLearning}
              size="lg"
              variant="cosmic"
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto min-h-[44px] touch-manipulation"
            >
              Start Learning Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* SECTION 2 — What You Get Inside 3EA */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 w-full">
          <div className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-consciousness font-bold mb-4">
                What You Get Inside 3EA
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to understand the new financial system
              </p>
            </div>

            <Card className="border-primary/20 bg-card/50 backdrop-blur w-full">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="grid gap-4 sm:gap-6">
                  {[
                    {
                      icon: Target,
                      text: "Clear breakdowns of how modern finance is evolving"
                    },
                    {
                      icon: CheckCircle,
                      text: "Beginner-friendly DeFi and awareness tutorials"
                    },
                    {
                      icon: TrendingUp,
                      text: "A structured path from confused to in control"
                    },
                    {
                      icon: Sparkles,
                      text: "Rewards for learning and participating"
                    },
                    {
                      icon: Target,
                      text: "A movement built on awareness, not hype"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <p className="text-base sm:text-lg text-foreground pt-2 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 3 — How It Works */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 w-full bg-secondary/20">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-consciousness font-bold mb-4">
                How It Works
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to begin your awareness journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16 w-full">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description: "Create your free account in seconds. No credit card required."
                },
                {
                  step: "02",
                  title: "Start Your First Tutorial",
                  description: "Pick a beginner-friendly path that matches your current knowledge level."
                },
                {
                  step: "03",
                  title: "Earn & Progress",
                  description: "Unlock XP, rewards, and new layers as you learn and participate."
                }
              ].map((item, index) => (
                <Card key={index} className="border-primary/20 bg-card/80 backdrop-blur hover:border-primary/40 transition-all duration-300 w-full">
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-4xl sm:text-5xl font-consciousness font-bold text-primary/30 mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-consciousness font-bold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={handleStartLearning}
                size="lg"
                variant="awareness"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto min-h-[44px] touch-manipulation"
              >
                Begin Your Awareness Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Why 3EA Is Different */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 w-full">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-consciousness font-bold mb-4">
                Why 3EA Is Different
              </h2>
            </div>

            <Card className="border-primary/20 bg-gradient-awareness backdrop-blur w-full">
              <CardContent className="p-8 sm:p-10 md:p-12">
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-6">
                  3EA is not a trading group or hype project. We don't promise overnight riches or "secret strategies."
                </p>
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-6">
                  We are a <span className="font-consciousness font-bold text-primary">conscious learning movement</span> that teaches how the new financial system is being built — so you understand what's happening, rather than being left behind or manipulated by those who profit from your confusion.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed">
                  This is about <span className="font-consciousness font-bold">awareness</span>, not speculation. About <span className="font-consciousness font-bold">education</span>, not exploitation. About building <span className="font-consciousness font-bold">clarity</span> in a world designed to keep you uncertain.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 5 — Final CTA */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 w-full bg-gradient-cosmic">
          <div className="max-w-4xl mx-auto text-center w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-consciousness font-bold mb-6 sm:mb-8 leading-tight">
              Ready to understand what's really happening?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 leading-relaxed">
              Start your awareness journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleStartLearning}
                size="lg"
                variant="cosmic"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto min-h-[44px] touch-manipulation"
              >
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={handleExploreTutorials}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 h-auto min-h-[44px] touch-manipulation border-border bg-background/60 hover:bg-accent/10"
              >
                Explore Tutorials
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdLanding;
