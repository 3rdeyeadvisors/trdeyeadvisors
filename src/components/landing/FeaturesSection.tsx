import { Wallet, LineChart, Shield, TrendingUp, LucideIcon } from 'lucide-react';
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

const FeaturesSection = () => {
  const { containerRef, isItemVisible } = useStaggeredAnimation(features.length, 150);

  return (
    <section className="py-12 md:py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Curriculum
          </span>
          <h2 className="text-3xl md:text-5xl font-consciousness font-bold text-foreground mb-6">
            What You'll Learn
          </h2>
          <p className="text-lg text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Practical skills for navigating the decentralized future
          </p>
        </AnimatedSection>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlowCard 
              key={feature.title}
              delay={index * 100}
              isVisible={isItemVisible(index)}
            >
              <div className="p-6 flex flex-col items-center text-center h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-consciousness font-semibold text-foreground mb-3">
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
