import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Zap } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const CTASection = () => {
  return (
    <>
      {/* Why This Matters */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-b from-card/80 to-card/40 border border-border/50 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary/50" />
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent/50" />
              <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-awareness/50" />
              <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-primary/50" />
              
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-consciousness font-bold text-foreground mb-6">
                Why This Matters
              </h2>
              
              <p className="text-base md:text-lg text-foreground/90 font-consciousness leading-relaxed mb-4">
                The world is shifting into new financial systems: decentralized, transparent, and powered by code rather than institutions.
              </p>
              
              <p className="text-sm md:text-base text-muted-foreground font-consciousness leading-relaxed">
                Those who learn how these systems work will navigate the future with clarity.
                <span className="text-primary font-semibold"> The choice is yours.</span>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-consciousness font-bold text-foreground mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground font-consciousness mb-10 max-w-2xl mx-auto">
              Start learning today. No hype. No confusion. Just clear education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/courses">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-consciousness min-w-[200px]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Begin Learning
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              
              <Link to="/tutorials">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="group border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-lg font-consciousness min-w-[200px]"
                >
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Explore Tutorials
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default CTASection;
