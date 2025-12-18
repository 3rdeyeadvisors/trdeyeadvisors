import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, Users, Lightbulb, Repeat, TrendingUp, Globe, Cloud, Rocket, ArrowRight,
  Shield, Wallet, LineChart, GraduationCap, Layers, FileText, CheckCircle2, Zap, Target, Loader2
} from "lucide-react";
import cosmicHeroBg from "@/assets/cosmic-hero-bg.jpg";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import SEO from "@/components/SEO";

const Index = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState<'monthly' | 'annual' | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'annual') => {
    if (!user || !session) {
      toast.error('Please sign in to start your free trial');
      navigate(`/auth?redirect=/subscription?plan=${plan}`);
      return;
    }

    setCheckoutLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { plan },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const whatYoullLearn = [
    {
      icon: Wallet,
      title: "Wallet Security & Setup",
      description: "Learn to safely create, manage, and protect your crypto wallets from common threats"
    },
    {
      icon: LineChart,
      title: "DeFi Protocols Explained",
      description: "Understand lending, borrowing, staking, and yield farming without the jargon"
    },
    {
      icon: Shield,
      title: "Scam Detection & Safety",
      description: "Identify red flags and protect yourself from rug pulls, phishing, and fraud"
    },
    {
      icon: TrendingUp,
      title: "Market Analysis Basics",
      description: "Read charts, understand metrics, and make informed decisions"
    }
  ];

  const platformFeatures = [
    {
      icon: Layers,
      title: "Step-by-Step Courses",
      description: "Structured learning paths from beginner to advanced"
    },
    {
      icon: FileText,
      title: "Practical Tutorials",
      description: "Hands-on guides for real DeFi actions"
    },
    {
      icon: GraduationCap,
      title: "Quizzes & Certification",
      description: "Test your knowledge and earn badges"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Learn alongside conscious investors"
    }
  ];

  const awarenessSteps = [
    {
      icon: BookOpen,
      title: "Learn",
      description: "Study decentralized systems without hype or confusion"
    },
    {
      icon: Users,
      title: "Participate",
      description: "Engage with the community and real-world protocols"
    },
    {
      icon: GraduationCap,
      title: "Achieve",
      description: "Earn badges and certificates for completing courses"
    },
    {
      icon: Lightbulb,
      title: "Grow",
      description: "Expand your awareness and financial understanding"
    },
    {
      icon: Repeat,
      title: "Repeat",
      description: "Continue the cycle of conscious evolution"
    }
  ];

  const vaultLayers = [
    {
      icon: Globe,
      title: "Earth Vault",
      subtitle: "Foundation Level",
      description: "Master basic concepts and track your progress. Build your knowledge base through clear, practical education.",
      features: ["Wallet setup & security", "Blockchain fundamentals", "Crypto basics"]
    },
    {
      icon: Cloud,
      title: "Sky Vault",
      subtitle: "Intermediate Level",
      description: "Deepen your understanding of protocols and unlock advanced certifications for comprehension.",
      features: ["DeFi protocol deep-dives", "Yield & staking concepts", "Risk management"]
    },
    {
      icon: Rocket,
      title: "Cosmos Vault",
      subtitle: "Expert Level",
      description: "Achieve mastery of decentralized systems and unlock exclusive expert-level content.",
      features: ["Advanced concepts", "Protocol governance", "Community leadership"]
    }
  ];

  return (
    <>
      <SEO 
        title="Master DeFi Education & Cryptocurrency Knowledge"
        description="Build your financial understanding with comprehensive DeFi education. Learn decentralized finance, crypto fundamentals, and blockchain protocols through practical courses and tutorials."
        keywords="DeFi education, crypto training, blockchain courses, decentralized finance, cryptocurrency learning"
        url="https://www.the3rdeyeadvisors.com/"
        type="website"
        schema={{
          type: "Organization",
          data: {
            "@type": "Organization",
            "name": "3rdeyeadvisors",
            "description": "Expert DeFi education and cryptocurrency training platform",
            "url": "https://www.the3rdeyeadvisors.com",
            "sameAs": [
              "https://twitter.com/3rdeyeadvisors"
            ]
          }
        }}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${cosmicHeroBg})` }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
          
          <div className="relative z-10 container mx-auto px-4 text-center mobile-typography-center">
            <div className="animate-awareness-float">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                Awaken Awareness.
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-consciousness font-bold text-primary mb-6 md:mb-8 animate-cosmic-pulse">
                Recode the System.
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-consciousness mb-6 max-w-3xl mx-auto leading-relaxed">
              Understand how decentralized systems really work — without hype, noise, or confusion.
            </p>
            
            <p className="text-base sm:text-lg text-foreground font-consciousness mb-10 md:mb-12 max-w-2xl mx-auto">
              Free courses, practical tutorials, and a community of conscious learners building financial awareness together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full">
              <Link to="/courses" className="w-full sm:w-auto flex justify-center">
                <Button 
                  variant="cosmic" 
                  size="lg" 
                  className="text-lg px-8 py-6 font-consciousness animate-consciousness-glow w-full sm:w-auto"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Start Learning Free
                </Button>
              </Link>
              
              <Link to="/raffles" className="w-full sm:w-auto flex justify-center">
                <Button 
                  variant="awareness" 
                  size="lg" 
                  className="text-lg px-8 py-6 font-consciousness animate-consciousness-glow w-full sm:w-auto"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Users className="w-6 h-6 mr-3" />
                  Join the Movement
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                What You'll Learn
              </h2>
              <p className="text-base md:text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
                Practical skills for navigating the decentralized future
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {whatYoullLearn.map((item, index) => (
                <Card 
                  key={item.title}
                  className="p-5 md:p-8 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 md:mb-5 group-hover:bg-primary/30 transition-colors">
                    <item.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-consciousness font-semibold text-foreground mb-2 md:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-consciousness leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What is 3EA? */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-6 md:p-12 bg-card border-border">
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Target className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                  What is 3EA?
                </h2>
                <p className="text-base md:text-xl text-foreground mb-3 md:mb-4 font-consciousness leading-relaxed">
                  3EA (3rdeyeadvisors) is a conscious financial awareness movement focused on clarity, education, and decentralized participation.
                </p>
                <p className="text-sm md:text-lg text-muted-foreground font-consciousness leading-relaxed">
                  We cut through the noise to help you understand how new financial systems work—not through hype or promises, 
                  but through genuine learning and conscious evolution.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-base md:text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
                A complete learning platform designed for your success
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {platformFeatures.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="p-4 md:p-8 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-5 group-hover:bg-primary/30 transition-colors">
                    <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-sm md:text-lg font-consciousness font-semibold text-foreground mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-consciousness leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* The Awareness Engine */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                The Awareness Engine
              </h2>
              <p className="text-base md:text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
                A continuous cycle of learning, participation, and growth
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {awarenessSteps.map((step, index) => (
                <Card 
                  key={step.title}
                  className="p-4 md:p-6 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-3 md:mb-4" />
                  <h3 className="text-sm md:text-lg font-consciousness font-semibold text-foreground mb-2 md:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-consciousness leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* The Vault Layers */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                The Vault Layers
              </h2>
              <p className="text-base md:text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
                Progress through levels as you build your knowledge
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {vaultLayers.map((vault, index) => (
                <Card 
                  key={vault.title}
                  className="relative p-5 md:p-8 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <span className="absolute top-3 right-3 md:top-4 md:right-4 text-[9px] md:text-[10px] uppercase tracking-wider text-primary bg-primary/20 border border-primary/40 px-2 py-1 rounded font-consciousness font-medium">
                    Coming Soon
                  </span>
                  <div className="text-center mb-4 md:mb-6 pt-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <vault.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                    </div>
                    <span className="inline-block text-[10px] md:text-xs uppercase tracking-wider text-primary bg-primary/15 px-3 py-1 rounded-full font-consciousness font-medium">
                      {vault.subtitle}
                    </span>
                    <h3 className="text-lg md:text-xl font-consciousness font-bold text-foreground mt-2 md:mt-3">
                      {vault.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground font-consciousness leading-relaxed text-center mb-4 md:mb-6">
                    {vault.description}
                  </p>
                  <ul className="space-y-2 md:space-y-3">
                    {vault.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm md:text-base text-foreground font-consciousness bg-background rounded-lg px-3 py-2 md:px-4 md:py-3">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-6 md:p-12 bg-card border-border">
              <div className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Zap className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                  Why This Matters
                </h2>
                <p className="text-base md:text-lg text-foreground font-consciousness leading-relaxed mb-3 md:mb-4">
                  The world is shifting into new financial systems—decentralized, transparent, and powered by code rather than institutions.
                </p>
                <p className="text-sm md:text-lg text-muted-foreground font-consciousness leading-relaxed">
                  Those who learn how these systems work will navigate the future with clarity.
                  <span className="text-primary font-semibold"> The choice is yours.</span>
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <span className="inline-block text-xs md:text-sm uppercase tracking-wider text-primary bg-primary/15 px-4 py-2 rounded-full font-consciousness font-medium mb-4">
                14-Day Free Trial
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                Start Your Journey Risk-Free
              </h2>
              <p className="text-base md:text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
                Try everything free for 14 days. Cancel anytime.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <Card className="relative p-6 md:p-8 bg-card border-border hover:border-primary/60 transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-consciousness font-semibold text-foreground mb-2">
                    Monthly
                  </h3>
                  <p className="text-sm text-muted-foreground font-consciousness mb-4">
                    Full access, billed monthly
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl md:text-5xl font-consciousness font-bold text-foreground">$99</span>
                    <span className="text-muted-foreground font-consciousness">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      14-day free trial
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      All DeFi courses & tutorials
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Exclusive content & resources
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Community access
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Cancel anytime
                    </li>
                  </ul>
                  <Button 
                    variant="system" 
                    className="w-full font-consciousness"
                    onClick={() => handleSubscribe('monthly')}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === 'monthly' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>
                </div>
              </Card>
              
              {/* Annual Plan */}
              <Card className="relative p-6 md:p-8 bg-card border-primary/60 shadow-lg shadow-primary/10 transition-all duration-300">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider text-primary-foreground bg-primary px-4 py-1 rounded-full font-consciousness font-medium">
                  Premium
                </span>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-consciousness font-semibold text-foreground mb-2">
                    Annual
                  </h3>
                  <p className="text-sm text-muted-foreground font-consciousness mb-4">
                    Full year commitment
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl md:text-5xl font-consciousness font-bold text-foreground">$1,999</span>
                    <span className="text-muted-foreground font-consciousness">/year</span>
                  </div>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      14-day free trial
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      All DeFi courses & tutorials
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Exclusive content & resources
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Community access
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Priority support
                    </li>
                    <li className="flex items-center text-sm text-foreground/90 font-consciousness">
                      <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                      Locked-in annual rate
                    </li>
                  </ul>
                  <Button 
                    variant="cosmic" 
                    className="w-full font-consciousness"
                    onClick={() => handleSubscribe('annual')}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === 'annual' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>
                </div>
              </Card>
            </div>
            
            <p className="text-center text-xs md:text-sm text-muted-foreground font-consciousness mt-6 md:mt-8">
              No credit card required to start. Cancel anytime during your trial.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground font-consciousness mb-8 md:mb-12 max-w-2xl mx-auto">
              Start learning today. No hype. No confusion. Just clear education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center w-full">
              <Link to="/courses" className="w-full sm:w-auto flex justify-center">
                <Button 
                  variant="cosmic" 
                  size="lg" 
                  className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-consciousness w-full sm:w-auto"
                >
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                  Begin Learning
                </Button>
              </Link>
              
              <Link to="/tutorials" className="w-full sm:w-auto flex justify-center">
                <Button 
                  variant="system" 
                  size="lg" 
                  className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-consciousness w-full sm:w-auto"
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                  Explore Tutorials
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterSignup variant="cosmic" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
