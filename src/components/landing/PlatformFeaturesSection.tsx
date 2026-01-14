import { Layers, FileText, GraduationCap, Users, LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface PlatformFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const platformFeatures: PlatformFeature[] = [
  {
    icon: Layers,
    title: "Step-by-Step Courses",
    description: "Structured learning paths from beginner to advanced"
  },
  {
    icon: FileText,
    title: "Practical Tutorials",
    description: "Hands-on guides for real DeFi actions"
  },
  {
    icon: GraduationCap,
    title: "Quizzes & Certification",
    description: "Test your knowledge and earn badges"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Learn alongside conscious investors"
  }
];

const PlatformFeaturesSection = () => {
  const { containerRef, isItemVisible } = useStaggeredAnimation(platformFeatures.length, 100);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Platform
          </span>
          <h2 className="text-3xl md:text-5xl font-consciousness font-bold text-foreground mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground font-consciousness max-w-2xl mx-auto">
            A complete learning platform designed for your success
          </p>
        </AnimatedSection>

        <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {platformFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`
                group relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm
                hover:border-primary/30 hover:bg-card/50 transition-all duration-500
                ${isItemVisible(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover gradient line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-consciousness font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-consciousness">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
