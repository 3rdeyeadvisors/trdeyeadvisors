import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Lightbulb, Repeat, TrendingUp, Globe, Cloud, Rocket, ArrowRight } from "lucide-react";
import cosmicHeroBg from "@/assets/cosmic-hero-bg.jpg";
import NewsletterSignup from "@/components/NewsletterSignup";

import SEO from "@/components/SEO";

const Index = () => {
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
      description: "Foundation level: Master basic concepts and earn learning rewards. Build your knowledge base through clear, practical education."
    },
    {
      icon: Cloud,
      title: "Sky Vault",
      description: "Intermediate level: Deepen your understanding of protocols and earn advanced rewards for comprehension and participation."
    },
    {
      icon: Rocket,
      title: "Cosmos Vault",
      description: "Expert level: Achieve mastery of decentralized systems and earn the highest learning rewards for teaching and leading others."
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
        className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cosmicHeroBg})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center mobile-typography-center">
          <div className="animate-awareness-float">
            <h1 className="text-5xl md:text-7xl font-consciousness font-bold text-foreground mb-6">
              Awaken Awareness.
            </h1>
            <h1 className="text-5xl md:text-7xl font-consciousness font-bold text-primary mb-8 animate-cosmic-pulse">
              Recode the System.
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-consciousness mb-12 max-w-3xl mx-auto leading-relaxed">
            Understand how decentralized systems really work — without hype, noise, or confusion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <Link to="/courses" className="w-full sm:w-auto flex justify-center">
              <Button 
                variant="cosmic" 
                size="lg" 
                className="text-lg px-8 py-6 font-consciousness animate-consciousness-glow w-full sm:w-auto"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Start Learning
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

      {/* What is 3EA? */}
      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12 bg-gradient-consciousness border-primary/20 shadow-consciousness max-w-4xl mx-auto hover:shadow-[0_0_30px_hsl(var(--primary)/0.4),0_0_60px_hsl(var(--accent)/0.3)] hover:border-primary/40 transition-all duration-consciousness cursor-pointer group animate-consciousness-glow hover:animate-none">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-consciousness font-bold text-foreground mb-6 group-hover:text-primary-glow transition-colors duration-cosmic">
                What is 3EA?
              </h2>
              <p className="text-lg text-foreground/90 font-consciousness leading-relaxed drop-shadow-sm group-hover:text-foreground transition-colors duration-cosmic">
                3EA is a conscious financial awareness movement focused on clarity, education, and decentralized participation. 
                We cut through the noise to help you understand how new financial systems work—not through hype or promises, 
                but through genuine learning and conscious evolution. This is about awakening awareness and building real knowledge 
                in a world shifting toward decentralized protocols.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* The Awareness Engine */}
      <section className="py-12 md:py-20 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-4">
              The Awareness Engine
            </h2>
            <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
              A continuous cycle of learning, participation, and growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {awarenessSteps.map((step, index) => (
              <Card 
                key={step.title}
                className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <step.icon className="w-12 h-12 text-primary group-hover:text-primary-glow transition-colors mx-auto mb-4" />
                <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-consciousness text-sm">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Vault Layers */}
      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-4">
              The Vault Layers
            </h2>
            <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
              Earn rewards for learning, not for financial returns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {vaultLayers.map((vault, index) => (
              <Card 
                key={vault.title}
                className="p-8 bg-gradient-consciousness border-primary/20 shadow-consciousness hover:shadow-[0_0_30px_hsl(var(--primary)/0.4),0_0_60px_hsl(var(--accent)/0.3)] hover:border-primary/40 transition-all duration-consciousness group text-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <vault.icon className="w-16 h-16 text-primary group-hover:text-primary-glow transition-colors mx-auto mb-6" />
                <h3 className="text-2xl font-consciousness font-bold text-foreground mb-4 group-hover:text-primary-glow transition-colors duration-cosmic">
                  {vault.title}
                </h3>
                <p className="text-foreground/90 font-consciousness leading-relaxed">
                  {vault.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-12 md:py-20 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12 bg-card/60 border-border max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-consciousness font-bold text-foreground mb-6">
                Why This Matters
              </h2>
              <p className="text-lg text-muted-foreground font-consciousness leading-relaxed mb-6">
                The world is shifting into new financial systems—decentralized, transparent, and powered by code rather than institutions. 
                Financial awareness isn't just about making money; it's about understanding the rules of the game and participating consciously.
              </p>
              <p className="text-lg text-muted-foreground font-consciousness leading-relaxed">
                Those who learn how these systems work will navigate the future with clarity and confidence. 
                Those who don't will remain stuck in outdated patterns. The choice is yours—awaken your awareness or stay programmed.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-8">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground font-consciousness mb-8 max-w-2xl mx-auto">
            Start learning about decentralized systems today. No hype. No confusion. Just clear, conscious education.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
            <Link to="/courses" className="w-full sm:w-auto flex justify-center">
              <Button 
                variant="cosmic" 
                size="lg" 
                className="text-lg px-8 py-6 font-consciousness w-full sm:w-auto"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Begin Learning
              </Button>
            </Link>
            
            <Link to="/tutorials" className="w-full sm:w-auto flex justify-center">
              <Button 
                variant="system" 
                size="lg" 
                className="text-lg px-8 py-6 font-consciousness w-full sm:w-auto"
              >
                <ArrowRight className="w-6 h-6 mr-3" />
                Explore Tutorials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 md:py-20 lg:py-24 bg-muted/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup variant="cosmic" />
        </div>
      </section>
      </div>
    </>
  );
};

export default Index;
