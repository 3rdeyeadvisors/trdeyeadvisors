import { BookOpen, Users, GraduationCap, Lightbulb, Repeat, LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface AwarenessStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const awarenessSteps: AwarenessStep[] = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Study decentralized systems without hype"
  },
  {
    icon: Users,
    title: "Participate",
    description: "Engage with the community"
  },
  {
    icon: GraduationCap,
    title: "Achieve",
    description: "Earn badges and certificates"
  },
  {
    icon: Lightbulb,
    title: "Grow",
    description: "Expand your understanding"
  },
  {
    icon: Repeat,
    title: "Repeat",
    description: "Continue the evolution"
  }
];

const AwarenessEngineSection = () => {
  const { containerRef, isItemVisible } = useStaggeredAnimation(awarenessSteps.length, 120);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
            The Process
          </span>
          <h2 className="text-3xl md:text-5xl font-consciousness font-bold text-foreground mb-6">
            The Awareness Engine
          </h2>
          <p className="text-lg text-muted-foreground font-consciousness max-w-2xl mx-auto">
            A continuous cycle of learning, participation, and growth
          </p>
        </AnimatedSection>

        {/* Circular flow on desktop, grid on mobile */}
        <div ref={containerRef} className="relative">
          {/* Connection lines (desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 -translate-y-1/2" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {awarenessSteps.map((step, index) => (
              <div
                key={step.title}
                className={`
                  relative group transition-all duration-500
                  ${isItemVisible(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="p-5 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 hover:bg-card/80 transition-all duration-300 h-full flex flex-col items-center text-center">
                  {/* Step number */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300 mt-2">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  <h3 className="text-base font-consciousness font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-consciousness leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwarenessEngineSection;
