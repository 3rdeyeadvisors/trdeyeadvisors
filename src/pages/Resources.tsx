import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Wallet, BarChart3, Shield, BookOpen, Globe, TrendingUp } from "lucide-react";
import { DefiCharts } from "@/components/DefiCharts";
import DefiCalculators from "@/components/DefiCalculators";
import NewsletterSignup from "@/components/NewsletterSignup";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Trusted Wallets",
      icon: Wallet,
      description: "Secure, beginner-friendly wallets for safe DeFi interaction",
      resources: [
        { name: "MetaMask", description: "Most popular and user-friendly browser wallet for Ethereum DeFi", url: "https://metamask.io", verified: true },
        { name: "Trust Wallet", description: "Mobile-first wallet with built-in DeFi browser and staking", url: "https://trustwallet.com", verified: true },
        { name: "Ledger Hardware Wallet", description: "Ultimate security for storing larger amounts long-term", url: "https://ledger.com", verified: true }
      ]
    },
    {
      title: "Portfolio Trackers",
      icon: BarChart3,
      description: "Track your DeFi positions across multiple chains and protocols",
      resources: [
        { name: "DeBank", description: "Clean, comprehensive multi-chain portfolio tracking", url: "https://debank.com", verified: true },
        { name: "Zapper", description: "Portfolio management with DeFi position entry/exit tools", url: "https://zapper.fi", verified: true },
        { name: "DeFiLlama", description: "Best source for protocol data and TVL tracking", url: "https://defillama.com", verified: true }
      ]
    },
    {
      title: "Beginner-Friendly DEXs",
      icon: Globe,
      description: "Decentralized exchanges perfect for first-time DeFi users",
      resources: [
        { name: "Uniswap", description: "Most trusted and liquid DEX on Ethereum", url: "https://uniswap.org", verified: true },
        { name: "PancakeSwap", description: "Popular Binance Smart Chain DEX with lower fees", url: "https://pancakeswap.finance", verified: true },
        { name: "1inch", description: "DEX aggregator that finds you the best swap rates", url: "https://1inch.io", verified: true }
      ]
    },
    {
      title: "Educational PDFs (Free Downloads)",
      icon: BookOpen,
      description: "Practical templates and guides for financial planning",
      resources: [
        { name: "DeFi Security Guide", description: "Essential security steps before using any DeFi protocol", url: "/resources/security-guide.pdf", verified: true },
        { name: "DeFi Budget Template", description: "Spreadsheet template for tracking DeFi investments and profits", url: "#", verified: true },
        { name: "Credit Repair Tracker", description: "Step-by-step guide and tracker for improving credit score", url: "#", verified: true },
        { name: "Weekly Financial Planner", description: "Simple weekly budgeting template with DeFi allocation", url: "#", verified: true }
      ]
    },
    {
      title: "Learning Resources",
      icon: Shield,
      description: "Official educational resources and deeper reading",
      resources: [
        { name: "CoinGecko Learn", description: "Comprehensive crypto and DeFi educational articles", url: "https://coinmarketcap.com/academy", verified: true },
        { name: "Ethereum.org DeFi Guide", description: "Official Ethereum Foundation DeFi documentation", url: "https://ethereum.org/defi", verified: true },
        { name: "Our Blog Articles", description: "In-depth guides and analysis from our education team", url: "/blog", verified: true }
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
            Live market data, calculators, and curated resources for DeFi success
          </p>
        </div>

        {/* Live Analytics Dashboard */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-2xl font-consciousness font-bold text-foreground">
                Live DeFi Analytics
              </h2>
              <p className="text-muted-foreground font-consciousness">
                Real-time market data and insights from the DeFi ecosystem
              </p>
            </div>
          </div>
          <DefiCharts />
        </section>

        {/* DeFi Calculators */}
        <section className="mb-16">
          <DefiCalculators />
        </section>

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
                      onClick={() => window.open(resource.url, '_blank')}
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

        {/* Newsletter Signup */}
        <section className="mt-16">
          <NewsletterSignup variant="default" />
        </section>
      </div>
    </div>
  );
};

export default Resources;