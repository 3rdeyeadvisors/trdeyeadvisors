/**
 * RWA Overtakes DEX TVL Blog Post
 * Published: December 29, 2024
 */

import { BlogSEOAutomation } from "@/components/SEOAutomation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, TrendingUp, Shield, Zap, Building, ArrowRightLeft, BarChart3, Users, AlertTriangle, Target, CheckCircle } from "lucide-react";
import { BRAND_AUTHOR } from "@/lib/constants";

const RwaOvertakesDex2025 = () => {
  const blogPost = {
    title: "Real World Assets Just Overtook DEXs in DeFi TVL: Why This Historic Shift Matters",
    excerpt: "For the first time in DeFi history, tokenized Real World Assets have surpassed decentralized exchanges in total value locked. According to DefiLlama data from December 2024, RWA protocols now hold $17.15 billion compared to $16.88 billion in DEXs. Here's what this means for the future of decentralized finance.",
    author: BRAND_AUTHOR,
    publishedDate: "2024-12-29",
    category: "DeFi Analysis",
    tags: ["Real World Assets", "RWA", "DEX", "TVL", "Tokenization", "DeFi 2024", "BlackRock", "Treasury Tokens", "Institutional DeFi"],
    readTime: "8 min read"
  };

  return (
    <>
      {/* SEO Automation with all meta tags, structured data, and social sharing */}
      <BlogSEOAutomation
        title={blogPost.title}
        excerpt={blogPost.excerpt}
        author={blogPost.author}
        publishedDate={blogPost.publishedDate}
        category={blogPost.category}
        tags={blogPost.tags}
      />

      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Article Header */}
          <Card className="p-8 mb-8 bg-gradient-consciousness border-primary/20">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                {blogPost.category}
              </Badge>
              {blogPost.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Single H1 tag for SEO */}
            <h1 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-6">
              {blogPost.title}
            </h1>

            <p className="text-lg text-muted-foreground font-consciousness mb-6 leading-relaxed">
              {blogPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{BRAND_AUTHOR}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blogPost.publishedDate + 'T12:00:00').toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>

            {/* Key highlights */}
            <div className="mt-6 p-4 bg-background/50 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Key Data Points (DefiLlama, December 29, 2024)</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-500" />
                  <span>RWA: $17.15B TVL</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                  <span>DEX: $16.88B TVL</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>RWA: +4.85% Monthly</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <Card className="p-8">
            <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-consciousness prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground">
              
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-foreground/90 text-lg leading-relaxed mb-6">
                  <strong className="text-foreground">Something remarkable happened in DeFi this December.</strong> According to DefiLlama's category rankings, Real World Assets (RWA) have officially surpassed Decentralized Exchanges (DEXs) in Total Value Locked for the first time in the history of decentralized finance.
                </p>
                <p className="text-foreground/90 text-lg leading-relaxed">
                  This isn't just a statistical curiosity—it represents a fundamental shift in what capital is flowing into DeFi and why. For years, DEXs like Uniswap, Curve, and SushiSwap were the beating heart of DeFi activity. Now, tokenized treasuries, real estate, and other traditional assets are commanding more locked capital than the trading infrastructure that defined DeFi's first era.
                </p>
              </div>

              {/* Section 1: A Historic Moment */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">A Historic Moment in DeFi</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  <strong className="text-foreground">According to DefiLlama data accessed on December 29, 2024, Real World Asset (RWA) protocols now hold $17.152 billion in total value locked, surpassing decentralized exchanges at $16.883 billion.</strong> This is not a temporary fluctuation. RWA TVL has grown 4.85% in the past month while DEX TVL has remained essentially flat at 0.04% weekly growth.
                </p>

                <p className="text-foreground/90 leading-relaxed">
                  This crossover represents a fundamental shift in what DeFi is being used for. For years, decentralized exchanges were the backbone of DeFi, the primary use case that demonstrated why permissionless financial infrastructure mattered. Today, that narrative is evolving: DeFi is increasingly becoming a layer for tokenizing and trading traditional financial assets.
                </p>
              </div>

              {/* Section 2: The Numbers */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">The Numbers: What DefiLlama Shows</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  As of December 29, 2024, DefiLlama's category rankings show the following TVL distribution across the 83 tracked DeFi categories:
                </p>

                <div className="bg-muted/30 p-6 rounded-lg mb-6 border border-primary/10">
                  <h4 className="text-lg font-semibold mb-4">Top DeFi Categories by TVL</h4>
                  <ul className="space-y-3 text-foreground/90">
                    <li><strong className="text-foreground">1. Lending:</strong> $63.24 billion (574 protocols)</li>
                    <li><strong className="text-foreground">2. Liquid Staking:</strong> $54.85 billion (267 protocols)</li>
                    <li><strong className="text-foreground">3. Bridge:</strong> $46.39 billion (145 protocols)</li>
                    <li><strong className="text-foreground">4. Restaking:</strong> $18.86 billion (15 protocols)</li>
                    <li><strong className="text-foreground">5. RWA:</strong> $17.15 billion (129 protocols) — <span className="text-green-500">+4.85% monthly</span></li>
                    <li><strong className="text-foreground">6. DEXs:</strong> $16.88 billion (1,871 protocols) — <span className="text-muted-foreground">+0.04% weekly</span></li>
                  </ul>
                </div>

                <p className="text-foreground/90 leading-relaxed">
                  The growth trajectories tell an important story. RWA protocols are experiencing sustained momentum: +1.25% daily, +3.10% weekly, and +4.85% monthly. Meanwhile, DEXs have essentially plateaued with only +0.04% weekly growth despite having over 1,800 protocols competing for market share.
                </p>
              </div>

              {/* Section 3: What Are RWAs */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">What Are Real World Assets in DeFi?</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  <strong className="text-foreground">Real World Assets (RWAs) are traditional financial instruments that have been tokenized and brought on-chain.</strong> This includes:
                </p>

                <div className="bg-muted/30 rounded-lg p-6 mb-6">
                  <ul className="space-y-3 text-foreground/90">
                    <li><strong className="text-foreground">Tokenized U.S. Treasuries:</strong> Government bonds represented as blockchain tokens, offering on-chain yield from the world's safest assets</li>
                    <li><strong className="text-foreground">Private Credit:</strong> Corporate loans and debt instruments accessible through DeFi protocols</li>
                    <li><strong className="text-foreground">Real Estate:</strong> Fractional ownership of property through tokenization</li>
                    <li><strong className="text-foreground">Commodities:</strong> Gold-backed tokens like PAXG that represent physical precious metals</li>
                    <li><strong className="text-foreground">Corporate Bonds:</strong> Fixed-income instruments from established corporations</li>
                  </ul>
                </div>

                <p className="text-foreground/90 leading-relaxed">
                  The appeal is straightforward: RWAs bring real-world yield and asset exposure to DeFi while benefiting from blockchain's transparency, composability, and 24/7 accessibility.
                </p>
              </div>

              {/* Section 4: Why This Shift Is Happening */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Why This Shift Is Happening Now</h2>
                </div>

                <div className="space-y-8 mb-6">
                  <div className="border-l-4 border-primary/50 pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">1. Institutional Capital Demands Familiar Assets</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      As institutional investors enter DeFi, they seek assets they understand. A pension fund or corporate treasury is far more comfortable allocating to tokenized U.S. Treasuries than to volatile DeFi governance tokens. RWAs bridge this gap by offering traditional asset exposure through blockchain infrastructure.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">2. BlackRock's BUIDL Fund Changed the Game</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      BlackRock's USD Institutional Digital Liquidity Fund (BUIDL), launched in 2024, demonstrated that the world's largest asset manager sees value in on-chain tokenization. According to CoinDesk reporting, BUIDL has grown to over $2.5 billion in assets under management and has expanded to multiple blockchains including Ethereum and BNB Chain. When BlackRock moves, institutions follow.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">3. Regulatory Clarity Is Improving</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      The passage of regulatory frameworks in various jurisdictions has provided clearer guidelines for tokenized securities. This regulatory certainty reduces the compliance burden that previously deterred institutional participation in tokenized asset markets.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary/50 pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3">4. DEX Innovation Has Plateaued</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      Decentralized exchanges reached functional maturity years ago. The core innovation of automated market makers (AMMs) and on-chain order books is well-established. With over 1,800 DEX protocols competing, the category is saturated. New capital naturally flows to emerging opportunities rather than crowded markets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: What This Means */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">What RWA Growth Means for DeFi</h2>
                </div>

                <div className="space-y-6 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">DeFi Is Becoming Financial Infrastructure</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      <strong className="text-foreground">The RWA overtake signals that DeFi is transitioning from an alternative financial system to foundational financial infrastructure.</strong> Instead of competing with traditional finance, DeFi is becoming the rails upon which traditional assets move. This is significant because infrastructure persists—speculative applications come and go, but the plumbing that moves trillions of dollars becomes entrenched and difficult to displace.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Yield Sources Are Diversifying</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      DeFi yield historically came from token emissions and trading fees. RWAs introduce fundamentally different yield sources: interest from government bonds, returns from private credit, and dividends from tokenized equities. These yields are backed by real economic activity rather than inflationary token mechanics.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Composability Expands</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      Tokenized treasuries can be used as collateral in DeFi lending protocols. RWA-backed stablecoins can provide liquidity in DEX pools. The composability that makes DeFi powerful now applies to trillions of dollars in traditional assets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6: Key Players */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Key Players Driving RWA Growth</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  According to RWA.xyz analytics and industry reporting, the following protocols and issuers are driving the RWA sector:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Ondo Finance</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Leading tokenized treasury provider with products like USDY and OUSG for on-chain government bond exposure.
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-3">BlackRock BUIDL</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Institutional-grade tokenized money market fund bringing TradFi credibility to on-chain assets.
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Franklin Templeton</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      On-chain money fund with over $400 million in assets, demonstrating traditional asset manager adoption.
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Centrifuge</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Protocol for tokenizing private credit and real-world receivables, expanding RWA beyond treasuries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7: Risks */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Risks and Considerations</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  <strong className="text-foreground">RWA tokenization is not without challenges:</strong>
                </p>

                <div className="bg-muted/30 rounded-lg p-6 mb-6">
                  <ul className="space-y-3 text-foreground/90">
                    <li><strong className="text-foreground">Regulatory Uncertainty:</strong> While improving, regulations vary significantly by jurisdiction and asset type</li>
                    <li><strong className="text-foreground">Counterparty Risk:</strong> Unlike pure DeFi protocols, RWAs often require trust in off-chain custodians and legal structures</li>
                    <li><strong className="text-foreground">Liquidity Constraints:</strong> Many tokenized RWAs have limited secondary market liquidity compared to native crypto assets</li>
                    <li><strong className="text-foreground">Complexity:</strong> Legal wrappers, custody arrangements, and compliance requirements add layers of complexity</li>
                  </ul>
                </div>

                <p className="text-foreground/90 leading-relaxed">
                  Participants should understand that tokenized RWAs, while on-chain, often carry different risk profiles than native DeFi protocols.
                </p>
              </div>

              {/* Section 8: Looking Forward */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">What This Means for Long-Term Observers</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  The RWA overtake is not a trading signal. It is a structural shift that reveals where decentralized finance is heading:
                </p>

                <div className="bg-muted/30 rounded-lg p-6 mb-6">
                  <ul className="space-y-3 text-foreground/90">
                    <li><strong className="text-foreground">DeFi is becoming infrastructure,</strong> not just an alternative asset class</li>
                    <li><strong className="text-foreground">Institutional adoption is accelerating</strong> through familiar asset tokenization</li>
                    <li><strong className="text-foreground">The total addressable market is expanding</strong> from crypto-native assets to all financial assets</li>
                    <li><strong className="text-foreground">Sustainable yield from real economic activity</strong> is replacing unsustainable token emissions</li>
                  </ul>
                </div>

                <p className="text-foreground/90 leading-relaxed">
                  Understanding these trends does not require immediate action. It requires awareness of where the industry is heading and why the next decade of DeFi may look fundamentally different from the last.
                </p>
              </div>

              {/* Conclusion */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Conclusion</h2>
                </div>

                <p className="text-foreground/90 leading-relaxed mb-4">
                  <strong className="text-foreground">Real World Assets surpassing DEXs in TVL is a milestone that will likely be remembered as a turning point in DeFi history.</strong> It demonstrates that blockchain technology has moved beyond speculation and into genuine financial utility. The institutions are here. The assets are real. And the infrastructure that once seemed experimental is becoming permanent.
                </p>

                <p className="text-foreground/90 leading-relaxed">
                  The question is no longer whether traditional finance will adopt blockchain. It is how quickly the transition will occur and who will be positioned to understand it.
                </p>
              </div>

            </article>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-primary/10">
              <p className="text-sm text-muted-foreground italic">
                <strong>Disclaimer:</strong> This content is provided for educational purposes only. It does not constitute financial, investment, or legal advice. All data cited is sourced from DefiLlama (defillama.com) as of December 29, 2024, and is subject to change. Always conduct your own research and consult with qualified professionals before making investment decisions.
              </p>
            </div>

            {/* Data Sources */}
            <div className="mt-6 p-4 bg-background/50 rounded-lg border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-semibold text-sm">Data Sources</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• DefiLlama Categories (defillama.com/categories) — Accessed December 29, 2024</li>
                <li>• RWA.xyz Analytics Platform</li>
                <li>• CoinDesk reporting on BlackRock BUIDL</li>
              </ul>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-gradient-consciousness rounded-lg border border-primary/20">
              <div className="text-center">
                <h3 className="text-xl font-consciousness font-bold mb-3">Want to Understand DeFi Infrastructure?</h3>
                <p className="text-muted-foreground mb-4">
                  Explore our educational resources on how tokenization, RWAs, and DeFi protocols are reshaping financial markets.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="outline" className="px-3 py-1">DeFi Vaults Explained</Badge>
                  <Badge variant="outline" className="px-3 py-1">Stablecoin Infrastructure</Badge>
                  <Badge variant="outline" className="px-3 py-1">Institutional DeFi</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RwaOvertakesDex2025;