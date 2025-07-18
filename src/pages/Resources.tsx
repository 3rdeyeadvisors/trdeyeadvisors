import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Wallet, BarChart3, Shield, BookOpen, Globe } from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    {
      title: "DeFi Wallets",
      icon: Wallet,
      description: "Secure, non-custodial wallets for DeFi interaction",
      resources: [
        { name: "MetaMask", description: "Most popular Ethereum wallet with DeFi integration", url: "#", verified: true },
        { name: "Rainbow Wallet", description: "User-friendly wallet with DeFi portfolio tracking", url: "#", verified: true },
        { name: "Frame", description: "Privacy-focused wallet for advanced users", url: "#", verified: false },
        { name: "Rabby Wallet", description: "Multi-chain wallet optimized for DeFi", url: "#", verified: true }
      ]
    },
    {
      title: "Exchanges & DEXs",
      icon: Globe,
      description: "Decentralized and centralized exchange platforms",
      resources: [
        { name: "Uniswap", description: "Leading decentralized exchange on Ethereum", url: "#", verified: true },
        { name: "1inch", description: "DEX aggregator for optimal swap rates", url: "#", verified: true },
        { name: "Curve Finance", description: "Stablecoin and low-slippage trading", url: "#", verified: true },
        { name: "SushiSwap", description: "Community-driven DEX with additional features", url: "#", verified: false }
      ]
    },
    {
      title: "Analytics & Trackers",
      icon: BarChart3,
      description: "Tools for tracking DeFi positions and market data",
      resources: [
        { name: "DeFi Pulse", description: "Total value locked across DeFi protocols", url: "#", verified: true },
        { name: "Zapper", description: "Portfolio tracking and DeFi position management", url: "#", verified: true },
        { name: "DeBank", description: "Multi-chain DeFi portfolio tracker", url: "#", verified: true },
        { name: "APY.Vision", description: "Liquidity pool analytics and IL tracking", url: "#", verified: false }
      ]
    },
    {
      title: "Security Tools",
      icon: Shield,
      description: "Contract auditing and security verification tools",
      resources: [
        { name: "Etherscan", description: "Ethereum blockchain explorer and contract verification", url: "#", verified: true },
        { name: "CertiK", description: "Smart contract security audits and ratings", url: "#", verified: true },
        { name: "Immunefi", description: "Bug bounty platform for DeFi protocols", url: "#", verified: true },
        { name: "OpenZeppelin", description: "Security-focused smart contract library", url: "#", verified: true }
      ]
    },
    {
      title: "Educational PDFs",
      icon: BookOpen,
      description: "Comprehensive guides and research documents",
      resources: [
        { name: "DeFi Protocol Comparison Guide", description: "Detailed analysis of major DeFi protocols", url: "#", verified: true },
        { name: "Smart Contract Security Checklist", description: "Step-by-step security verification process", url: "#", verified: true },
        { name: "Yield Farming Risk Assessment", description: "Framework for evaluating farming opportunities", url: "#", verified: true },
        { name: "Multi-Chain Strategy Guide", description: "Cross-chain DeFi opportunities and risks", url: "#", verified: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-4">
            Resource Hub
          </h1>
          <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Curated tools, platforms, and resources to navigate the DeFi ecosystem safely and effectively
          </p>
        </div>

        {/* Resource Categories */}
        <div className="space-y-12">
          {resourceCategories.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <category.icon className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-consciousness font-bold text-foreground">
                    {category.title}
                  </h2>
                  <p className="text-muted-foreground font-consciousness">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Resources Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {category.resources.map((resource, index) => (
                  <Card 
                    key={resource.name}
                    className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group"
                    style={{ animationDelay: `${(categoryIndex * 4 + index) * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-consciousness font-semibold text-foreground group-hover:text-primary transition-colors">
                        {resource.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {resource.verified && (
                          <Badge className="bg-awareness/20 text-awareness border-awareness/30">
                            Verified
                          </Badge>
                        )}
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <Button 
                      variant="system" 
                      size="sm" 
                      className="w-full font-consciousness group-hover:border-primary/40"
                    >
                      Access Resource
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-16 p-6 bg-secondary/40 border-border">
          <div className="text-center">
            <h3 className="text-lg font-consciousness font-semibold text-foreground mb-3">
              Important Disclaimer
            </h3>
            <p className="text-muted-foreground font-consciousness leading-relaxed">
              These resources are provided for educational purposes only. Always conduct your own research 
              and never invest more than you can afford to lose. DeFi protocols carry inherent risks 
              including smart contract vulnerabilities, impermanent loss, and market volatility.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Resources;