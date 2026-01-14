import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ArrowDown } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const HeroSection = () => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Hero glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <AnimatedSection animation="fade-up" delay={0}>
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4 md:mb-6">
            DeFi Education Platform
          </span>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-consciousness font-bold text-foreground mb-3 md:mb-4 leading-[1.1] tracking-tight">
            Awaken Awareness.
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-consciousness font-bold mb-4 md:mb-6 leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Recode the System.
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={300}>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-consciousness mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Understand how decentralized systems really work—without hype, noise, or confusion.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/courses">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-consciousness min-w-[200px]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Start Learning Free
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            
            <Link to="/subscription">
              <Button 
                variant="outline"
                size="lg" 
                className="group border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-lg font-consciousness min-w-[200px]"
              >
                <Users className="w-5 h-5 mr-2" />
                Join the Movement
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Scroll indicator */}
        <AnimatedSection animation="fade-up" delay={600}>
          <button
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors group"
            aria-label="Scroll to content"
          >
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;
