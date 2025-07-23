import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Wrench, Eye, Code, TrendingUp, Shield, Star } from "lucide-react";
import cosmicHeroBg from "@/assets/cosmic-hero-bg.jpg";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useEffect, useState } from "react";

import SEO from "@/components/SEO";

const Index = () => {
  const [showStar, setShowStar] = useState(false);

  useEffect(() => {
    // Start the shooting star immediately when component mounts
    const startShootingStar = () => {
      setShowStar(true);
      setTimeout(() => setShowStar(false), 3000); // Hide after 3 seconds
    };

    // Initial shooting star on page load
    startShootingStar();

    // Set interval for every 15 seconds
    const interval = setInterval(startShootingStar, 15000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Eye,
      title: "Awareness",
      description: "Break free from traditional financial programming"
    },
    {
      icon: Code,
      title: "Understanding",
      description: "Master the mechanics of decentralized protocols"
    },
    {
      icon: TrendingUp,
      title: "Evolution",
      description: "Transform your relationship with money and wealth"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Navigate DeFi safely with proper risk management"
    }
  ];

  return (
    <>
      <SEO />
      
      <div className="min-h-screen">
        {/* Shooting Star */}
        {showStar && (
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
            {/* Star with trail */}
            <div 
              className="absolute animate-[shooting-star_3s_linear]"
              style={{
                top: '10%',
                right: '-10%',
              }}
            >
              {/* Trail elements */}
              <div className="absolute flex items-center">
                {/* Trail dots */}
                <div className="flex items-center space-x-2 opacity-30">
                  <div className="w-1 h-1 bg-primary-glow rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary-glow rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                </div>
                {/* Main star */}
                <Star 
                  className="text-primary-glow opacity-90 ml-2" 
                  size={28}
                  style={{
                    filter: 'drop-shadow(0 0 15px hsl(var(--primary-glow))) drop-shadow(0 0 30px hsl(var(--primary))) drop-shadow(0 0 45px hsl(var(--accent) / 0.3))'
                  }}
                />
              </div>
              {/* Glowing trail line */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-primary-glow opacity-70"
                style={{ 
                  right: '28px',
                  filter: 'blur(1px)'
                }}
              ></div>
            </div>
          </div>
        )}
        
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cosmicHeroBg})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-awareness-float">
            <h1 className="text-5xl md:text-7xl font-consciousness font-bold text-foreground mb-6">
              Awaken Awareness.
            </h1>
            <h1 className="text-5xl md:text-7xl font-consciousness font-bold text-primary mb-8 animate-cosmic-pulse">
              Recode the System.
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-consciousness mb-12 max-w-3xl mx-auto leading-relaxed">
            This is not financial advice. This is consciousness expansion. 
            Break free from programmed limitations and discover true financial sovereignty 
            through decentralized finance education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/courses">
              <Button 
                variant="cosmic" 
                size="lg" 
                className="text-lg px-8 py-6 font-consciousness animate-consciousness-glow"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Start Learning
              </Button>
            </Link>
            
            <Link to="/resources">
              <Button 
                variant="awareness" 
                size="lg" 
                className="text-lg px-8 py-6 font-consciousness animate-consciousness-glow"
                style={{ animationDelay: "0.3s" }}
              >
                <Wrench className="w-6 h-6 mr-3" />
                Access Utilities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card className="p-8 bg-gradient-consciousness border-primary/20 shadow-consciousness max-w-4xl mx-auto hover:shadow-[0_0_30px_hsl(var(--primary)/0.4),0_0_60px_hsl(var(--accent)/0.3)] hover:border-primary/40 transition-all duration-consciousness cursor-pointer group animate-consciousness-glow hover:animate-none">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-consciousness font-bold text-foreground mb-6 group-hover:text-primary-glow transition-colors duration-cosmic">
                Our Mission
              </h2>
              <p className="text-lg text-foreground/90 font-consciousness leading-relaxed drop-shadow-sm group-hover:text-foreground transition-colors duration-cosmic">
                We exist to reprogram the financial consciousness of those ready to evolve beyond 
                traditional systems. Through education, tools, and resources, we guide you toward 
                genuine financial sovereignty in the decentralized economy. No hype. No promises. 
                Only knowledge, awareness, and the tools to rewrite your financial reality.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-4">
              The Path to Financial Consciousness
            </h2>
            <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
              Four pillars that form the foundation of your DeFi education journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group text-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <feature.icon className="w-12 h-12 text-primary group-hover:text-primary-glow transition-colors mx-auto mb-4" />
                <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-consciousness">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-8">
            Ready to Begin Your Reprogramming?
          </h2>
          <p className="text-lg text-muted-foreground font-consciousness mb-8 max-w-2xl mx-auto">
            Start with our philosophy, explore our courses, or dive into the resource hub. 
            The system is waiting to be rewritten.
          </p>
          <Link to="/philosophy">
            <Button variant="system" size="lg" className="font-consciousness">
              Explore Our Philosophy
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <NewsletterSignup variant="cosmic" />
        </div>
      </section>
      </div>
    </>
  );
};

export default Index;
