import { Card } from "@/components/ui/card";
import { Eye, Brain, Zap } from "lucide-react";

const Philosophy = () => {
  const philosophyPoints = [
    {
      icon: Eye,
      title: "Awareness",
      description: "See beyond the programmed financial systems that keep you trapped."
    },
    {
      icon: Brain,
      title: "Understanding", 
      description: "Decode the mechanics of decentralized finance and autonomous wealth."
    },
    {
      icon: Zap,
      title: "Evolution",
      description: "Transform your relationship with money and financial sovereignty."
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* First Strip */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-consciousness font-bold text-foreground mb-8 animate-awareness-float">
            This is not a brand.
          </h1>
          <h2 className="text-3xl md:text-5xl font-consciousness font-bold text-primary animate-cosmic-pulse">
            It's a reprogramming system.
          </h2>
        </div>

        {/* Philosophy Introduction */}
        <div className="mb-16">
          <Card className="p-8 bg-card/60 border-border backdrop-blur-sm">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-consciousness mb-6">
              Financial awareness isn't just about making money — it's about understanding how systems work 
              so you can make choices, not just follow rules. DeFi gives individuals a chance to reclaim that control. 
              Here, we teach you how, step by step.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-consciousness">
              For too long, traditional financial institutions have programmed us to believe 
              that true financial freedom is impossible. They've conditioned us to accept 
              middlemen, hidden fees, and systems designed to extract value from our labor. 
              It's time to break free from this conditioning and reprogram our understanding 
              of what money and finance can truly be.
            </p>
          </Card>
        </div>

        {/* Three Columns */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {philosophyPoints.map((point, index) => (
              <Card 
                key={point.title}
                className="p-6 bg-card/40 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <point.icon className="w-12 h-12 text-primary group-hover:text-primary-glow transition-colors" />
                  </div>
                  <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground font-consciousness">
                    {point.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Final Strip */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-consciousness border-primary/20 shadow-consciousness">
            <p className="text-xl md:text-2xl font-consciousness font-medium text-foreground">
              You are not here to follow.
            </p>
            <p className="text-xl md:text-2xl font-consciousness font-bold text-primary mt-2">
              You are here to rewrite.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Philosophy;