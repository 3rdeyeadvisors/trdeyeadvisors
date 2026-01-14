import { Shield, Banknote, AlertTriangle, TrendingUp, LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import GlowCard from './GlowCard';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Shield,
    title: "Protect Your Assets",
    description: "Learn to secure wealth that no one can freeze or seize"
  },
  {
    icon: Banknote,
    title: "Escape the Middlemen",
    description: "Understand systems that cut out banks and excessive fees"
  },
  {
    icon: AlertTriangle,
    title: "Spot the Traps",
    description: "Identify scams before they take your money"
  },
  {
    icon: TrendingUp,
    title: "Read the Signals",
    description: "Make informed decisions, not gambles"
  }
];

const FeaturesSection = () => {
  const { containerRef, isItemVisible } = useStaggeredAnimation(features.length, 150);

  return (
    <section className="py-10 md:py-14 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-6 md:mb-8 lg:mb-10">
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-medium mb-3">
            What You'll Gain
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-consciousness font-bold text-foreground mb-4">
            Real Skills, Real Protection
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Practical knowledge for navigating the decentralized future
          </p>
        </AnimatedSection>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <GlowCard 
              key={feature.title}
              delay={index * 100}
              isVisible={isItemVisible(index)}
            >
              <div className="p-4 md:p-5 lg:p-6 flex flex-col items-center text-center h-full">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-consciousness font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground font-consciousness leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;