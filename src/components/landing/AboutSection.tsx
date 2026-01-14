import { Target } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import CounterAnimation from './CounterAnimation';

const AboutSection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          <div className="relative p-8 md:p-12 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-primary/30 rounded-br-2xl" />
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-6">
                What is 3EA?
              </h2>
              
              <p className="text-lg text-foreground/90 font-consciousness leading-relaxed mb-4">
                3EA (3rdeyeadvisors) is a conscious financial awareness movement focused on clarity, education, and decentralized participation.
              </p>
              
              <p className="text-base text-muted-foreground font-consciousness leading-relaxed mb-8">
                We cut through the noise to help you understand how new financial systems work. Not through hype or promises, but through genuine learning and conscious evolution.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    <CounterAnimation end={50} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Lessons</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    <CounterAnimation end={1000} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Students</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    <CounterAnimation end={24} suffix="/7" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Access</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AboutSection;
