import { Link } from 'react-router-dom';
import { Globe, Cloud, Rocket, CheckCircle2, ArrowRight, LucideIcon } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface VaultLayer {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  href: string | null;
  isLive: boolean;
  gradient: string;
}

const vaultLayers: VaultLayer[] = [
  {
    icon: Globe,
    title: "Earth Vault",
    subtitle: "Foundation Level",
    description: "Master basic concepts and track your progress. Build your knowledge base through clear, practical education.",
    features: ["Wallet setup & security", "Blockchain fundamentals", "Crypto basics"],
    href: "/vault-access",
    isLive: true,
    gradient: "from-awareness to-awareness/50"
  },
  {
    icon: Cloud,
    title: "Sky Vault",
    subtitle: "Intermediate Level",
    description: "Deepen your understanding of protocols and unlock advanced certifications for comprehension.",
    features: ["DeFi protocol deep-dives", "Yield & staking concepts", "Risk management"],
    href: null,
    isLive: false,
    gradient: "from-primary to-primary/50"
  },
  {
    icon: Rocket,
    title: "Cosmos Vault",
    subtitle: "Expert Level",
    description: "Achieve mastery of decentralized systems and unlock exclusive expert-level content.",
    features: ["Advanced concepts", "Protocol governance", "Community leadership"],
    href: null,
    isLive: false,
    gradient: "from-accent to-accent/50"
  }
];

const VaultSection = () => {
  const { containerRef, isItemVisible } = useStaggeredAnimation(vaultLayers.length, 200);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Progress Path
          </span>
          <h2 className="text-3xl md:text-5xl font-consciousness font-bold text-foreground mb-6">
            The Vault Layers
          </h2>
          <p className="text-lg text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Progress through levels as you build your knowledge
          </p>
        </AnimatedSection>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vaultLayers.map((vault, index) => {
            const CardContent = (
              <div
                className={`
                  group relative h-full rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm
                  hover:border-primary/30 transition-all duration-500 overflow-hidden
                  ${isItemVisible(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                  ${vault.isLive ? 'cursor-pointer' : ''}
                `}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${vault.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  {vault.isLive ? (
                    <span className="text-[10px] uppercase tracking-wider text-awareness bg-awareness/10 border border-awareness/30 px-2.5 py-1 rounded-full font-medium">
                      Live
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 border border-border px-2.5 py-1 rounded-full font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>

                <div className="p-6 pt-12">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${vault.gradient} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <vault.icon className="w-7 h-7 text-foreground" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-primary font-medium">
                      {vault.subtitle}
                    </span>
                    <h3 className="text-xl font-consciousness font-bold text-foreground mt-2">
                      {vault.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground font-consciousness leading-relaxed text-center mb-6">
                    {vault.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {vault.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground/80 font-consciousness bg-background/50 rounded-lg px-3 py-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {vault.isLive && (
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <span className="flex items-center justify-center text-sm text-primary font-consciousness font-medium group-hover:gap-2 transition-all">
                        Access Vault <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            return vault.isLive && vault.href ? (
              <Link key={vault.title} to={vault.href} className="h-full">
                {CardContent}
              </Link>
            ) : (
              <div key={vault.title} className="h-full">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VaultSection;
