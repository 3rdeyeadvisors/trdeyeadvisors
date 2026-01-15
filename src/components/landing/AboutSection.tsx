import { Shield, Lock, Globe } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const valueProps = [
  {
    icon: Shield,
    title: "Protect Your Wealth",
    subtitle: "Beat inflation, own what's yours"
  },
  {
    icon: Lock,
    title: "True Ownership",
    subtitle: "No banks, no borders, no limits"
  },
  {
    icon: Globe,
    title: "Global Access",
    subtitle: "No geographical discrimination"
  }
];

const AboutSection = () => {
  return (
    <section className="py-10 md:py-14 lg:py-20 relative">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <div className="relative p-5 md:p-8 lg:p-10 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
            
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-consciousness font-bold text-foreground mb-4 md:mb-6">
                What is 3EA?
              </h2>
              
              <p className="text-base md:text-lg text-foreground/90 font-consciousness leading-relaxed mb-3">
                3EA teaches you to protect what you own in a system where <span className="text-primary font-semibold">no one else can touch it</span>. This isn't an investment course. It's a new way of thinking about money, freedom, and possibility.
              </p>
              
              <p className="text-sm md:text-base text-muted-foreground font-consciousness leading-relaxed mb-6 md:mb-8">
                Traditional finance locks people out based on geography, credit scores, and arbitrary gatekeeping. DeFi opens the door to anyone with an internet connection.
              </p>

              {/* Value props row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-border/50">
                {valueProps.map((prop) => (
                  <div key={prop.title} className="flex flex-col items-center p-3 md:p-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <prop.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-sm md:text-base font-semibold text-foreground font-consciousness">
                      {prop.title}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1 font-consciousness">
                      {prop.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AboutSection;