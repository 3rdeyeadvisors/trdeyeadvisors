import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, Users, Lightbulb, Repeat, TrendingUp, Globe, Cloud, Rocket, ArrowRight,
  Shield, Wallet, LineChart, GraduationCap, Layers, FileText, CheckCircle2, Zap, Target
} from "lucide-react";
import cosmicHeroBg from "@/assets/cosmic-hero-bg.jpg";
import NewsletterSignup from "@/components/NewsletterSignup";

import SEO from "@/components/SEO";

const Index = () => {
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
      icon: TrendingUp,
      title: "Earn",
      description: "Gain rewards for learning and contributing knowledge"
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
      description: "Master basic concepts and earn learning rewards. Build your knowledge base through clear, practical education.",
      features: ["Wallet setup & security", "Blockchain fundamentals", "Crypto basics"]
    },
    {
      icon: Cloud,
      title: "Sky Vault",
      subtitle: "Intermediate Level",
      description: "Deepen your understanding of protocols and earn advanced rewards for comprehension and participation.",
      features: ["DeFi protocol deep-dives", "Yield & staking strategies", "Risk management"]
    },
    {
      icon: Rocket,
      title: "Cosmos Vault",
      subtitle: "Expert Level",
      description: "Achieve mastery of decentralized systems and earn the highest learning rewards.",
      features: ["Advanced trading strategies", "Protocol governance", "Community leadership"]
    }
  ];

  return (
    <>
      <SEO 
        title="Master DeFi & Build True Wealth"
        description="Transform your financial future with expert DeFi education. Learn decentralized finance, crypto strategies, and blockchain protocols from industry professionals."
        keywords="DeFi education, crypto training, blockchain courses, decentralized finance, cryptocurrency strategies"
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
            
            <p className="text-base sm:text-lg text-foreground/80 font-consciousness mb-10 md:mb-12 max-w-2xl mx-auto">
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
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-5 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
                What You'll Learn
              </h2>
              <p className="text-base md:text-xl text-foreground/80 font-consciousness max-w-2xl mx-auto">
                Practical skills for navigating the decentralized future
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {whatYoullLearn.map((item, index) => (
                <Card 
                  key={item.title}
                  className="p-4 md:p-6 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary/30 transition-colors">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-consciousness font-semibold text-foreground mb-1.5 md:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/70 font-consciousness leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What is 3EA? */}
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-4 md:p-10 bg-card border-border">
              <div className="text-center">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                  <Target className="w-5 h-5 md:w-8 md:h-8 text-primary" />
                </div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
                  What is 3EA?
                </h2>
                <p className="text-sm md:text-xl text-foreground/90 font-consciousness leading-relaxed mb-2 md:mb-4">
                  3EA (3rdeyeadvisors) is a conscious financial awareness movement focused on clarity, education, and decentralized participation.
                </p>
                <p className="text-xs md:text-lg text-foreground/70 font-consciousness leading-relaxed">
                  We cut through the noise to help you understand how new financial systems work—not through hype or promises, 
                  but through genuine learning and conscious evolution.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-5 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
                Everything You Need to Succeed
              </h2>
              <p className="text-base md:text-xl text-foreground/80 font-consciousness max-w-2xl mx-auto">
                A complete learning platform designed for your success
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {platformFeatures.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="p-3 md:p-6 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2 md:mb-4 group-hover:bg-primary/30 transition-colors">
                    <feature.icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-xs md:text-lg font-consciousness font-semibold text-foreground mb-1 md:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-foreground/70 font-consciousness leading-tight">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* The Awareness Engine */}
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-5 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
                The Awareness Engine
              </h2>
              <p className="text-base md:text-xl text-foreground/80 font-consciousness max-w-2xl mx-auto">
                A continuous cycle of learning, participation, and growth
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
              {awarenessSteps.map((step, index) => (
                <Card 
                  key={step.title}
                  className="p-3 md:p-5 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <step.icon className="w-7 h-7 md:w-10 md:h-10 text-primary mx-auto mb-2 md:mb-3" />
                  <h3 className="text-xs md:text-lg font-consciousness font-semibold text-foreground mb-1 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-foreground/70 font-consciousness leading-tight md:leading-normal">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* The Vault Layers */}
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-5 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
                The Vault Layers
              </h2>
              <p className="text-base md:text-xl text-foreground/80 font-consciousness max-w-2xl mx-auto">
                Progress through levels as you build your knowledge
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              {vaultLayers.map((vault, index) => (
                <Card 
                  key={vault.title}
                  className="relative p-4 md:p-6 bg-card border-border hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <span className="absolute top-2 right-2 md:top-4 md:right-4 text-[8px] md:text-[10px] uppercase tracking-wider text-primary bg-primary/20 border border-primary/40 px-1.5 py-0.5 md:px-2 md:py-1 rounded font-consciousness font-medium">
                    Coming Soon
                  </span>
                  <div className="text-center mb-3 md:mb-5 pt-1">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-2 md:mb-4">
                      <vault.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                    </div>
                    <span className="inline-block text-[9px] md:text-[11px] uppercase tracking-wider text-primary bg-primary/15 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-consciousness font-medium">
                      {vault.subtitle}
                    </span>
                    <h3 className="text-base md:text-xl font-consciousness font-bold text-foreground mt-1.5 md:mt-3">
                      {vault.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-foreground/75 font-consciousness leading-relaxed text-center mb-3 md:mb-5">
                    {vault.description}
                  </p>
                  <ul className="space-y-1.5 md:space-y-2">
                    {vault.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-xs md:text-sm text-foreground/85 font-consciousness bg-background rounded-lg px-2.5 py-1.5 md:px-3 md:py-2">
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary mr-2 md:mr-3 flex-shrink-0" />
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
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-4 md:p-10 bg-card border-border">
              <div className="text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                  <Zap className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                </div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
                  Why This Matters
                </h2>
                <p className="text-xs md:text-lg text-foreground/80 font-consciousness leading-relaxed mb-2 md:mb-4">
                  The world is shifting into new financial systems—decentralized, transparent, and powered by code rather than institutions.
                </p>
                <p className="text-xs md:text-lg text-foreground/70 font-consciousness leading-relaxed">
                  Those who learn how these systems work will navigate the future with clarity.
                  <span className="text-primary font-semibold"> The choice is yours.</span>
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-2 md:mb-5">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-sm md:text-xl text-foreground/80 font-consciousness mb-5 md:mb-10 max-w-2xl mx-auto">
              Start learning today. No hype. No confusion. Just clear education.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full">
              <Link to="/courses" className="w-full sm:w-auto flex justify-center">
                <Button 
                  variant="cosmic" 
                  size="lg" 
                  className="text-sm md:text-lg px-5 md:px-8 py-4 md:py-6 font-consciousness w-full sm:w-auto"
                >
                  <BookOpen className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
                  Begin Learning
                </Button>
              </Link>
              
              <Link to="/tutorials" className="w-full sm:w-auto flex justify-center">
                <Button 
                  variant="system" 
                  size="lg" 
                  className="text-sm md:text-lg px-5 md:px-8 py-4 md:py-6 font-consciousness w-full sm:w-auto"
                >
                  <ArrowRight className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
                  Explore Tutorials
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-8 md:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterSignup variant="cosmic" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
