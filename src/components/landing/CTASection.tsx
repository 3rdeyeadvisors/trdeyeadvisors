import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Zap, Check } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const benefits = [
  "Beat inflation — Stop watching your money lose value",
  "True ownership — Assets only YOU control",
  "No borders — Access financial tools from anywhere",
  "No permission needed — No credit checks, no gatekeepers"
];

const CTASection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Why This Matters Card */}
        <AnimatedSection className="mb-10 md:mb-14">
          <div className="relative p-6 md:p-8 lg:p-10 rounded-2xl bg-gradient-to-b from-card/80 to-card/40 border border-border/50 overflow-hidden max-w-3xl mx-auto">
            {/* Decorative elements */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-primary/50" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent/50" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-awareness/50" />
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-primary/50" />
            
            <div className="text-center mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl font-consciousness font-bold text-foreground mb-3">
                Why This Matters
              </h2>
              
              <p className="text-sm md:text-base lg:text-lg text-foreground/90 font-consciousness leading-relaxed">
                Your bank can freeze your account. Your government can inflate your savings away. <span className="text-primary font-semibold">DeFi gives you tools they can't control.</span> This isn't about getting rich—it's about reclaiming ownership of what's yours.
              </p>
            </div>
            
            {/* Benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2 text-left">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-xs md:text-sm text-muted-foreground font-consciousness">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Final CTA */}
        <AnimatedSection className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-consciousness font-bold text-foreground mb-3 md:mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-consciousness mb-6 md:mb-8 max-w-2xl mx-auto">
            Start learning today. No hype. No confusion. Just clear education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link to="/courses">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-consciousness min-w-[180px] md:min-w-[200px]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                  Begin Learning
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            
            <Link to="/tutorials">
              <Button 
                variant="outline"
                size="lg" 
                className="group border-border hover:border-primary/50 hover:bg-primary/5 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-consciousness min-w-[180px] md:min-w-[200px]"
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Explore Tutorials
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;