import { Card } from "@/components/ui/card";
import { Eye, Brain, Zap } from "lucide-react";
import SEO from "@/components/SEO";

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
    <>
      <SEO 
        title="Financial Consciousness & DeFi Philosophy - Money Awakening"
        description="Transform your relationship with money through financial consciousness and DeFi education. Break free from traditional banking and discover financial sovereignty through decentralized finance."
        keywords="financial consciousness, DeFi philosophy, financial sovereignty, money consciousness, decentralized finance mindset, financial awakening, crypto philosophy, financial freedom"
        url="https://www.the3rdeyeadvisors.com/philosophy"
        schema={{
          type: 'WebPage',
          data: {
            about: [
              "Financial consciousness and awareness",
              "Decentralized finance philosophy",
              "Money and wealth consciousness",
              "Financial sovereignty education"
            ]
          }
        }}
        faq={[
          {
            question: "What is financial consciousness?",
            answer: "Financial consciousness is the awareness of how money and financial systems truly work, including understanding the limitations of traditional banking and the opportunities presented by decentralized finance (DeFi)."
          },
          {
            question: "How does DeFi promote financial sovereignty?",
            answer: "DeFi promotes financial sovereignty by removing intermediaries, giving individuals direct control over their assets, and providing access to financial services without traditional banking restrictions or gatekeepers."
          },
          {
            question: "What does it mean to reprogram your relationship with money?",
            answer: "Reprogramming your relationship with money means questioning traditional financial assumptions, understanding how modern monetary systems work, and exploring alternative financial paradigms like cryptocurrency and DeFi for true financial independence."
          }
        ]}
      />
      <div className="py-12 md:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-consciousness mb-6 text-center">
              Financial awareness isn't just about making money — it's about understanding how systems work 
              so you can make choices, not just follow rules. DeFi gives individuals a chance to reclaim that control. 
              Here, we teach you how, step by step.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-consciousness text-center">
              For too long, traditional financial institutions have programmed us to believe 
              that true financial freedom is impossible. They've conditioned us to accept 
              middlemen, hidden fees, and systems designed to extract value from our labor. 
              It's time to break free from this conditioning and reprogram our understanding 
              of what money and finance truly represent.
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
            <p className="text-xl md:text-2xl font-consciousness font-bold text-primary-glow mt-2 drop-shadow-lg">
              You are here to rewrite.
            </p>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default Philosophy;