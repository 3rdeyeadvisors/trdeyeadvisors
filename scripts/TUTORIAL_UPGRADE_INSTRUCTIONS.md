# Tutorial Upgrade Instructions - Batch Application

## Quick Upgrade Steps for Each Tutorial

### 1. FirstDexSwapTutorial.tsx

**Add after line 31 (after imports):**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { StepBlock } from "@/components/course/StepBlock";
import dexSwapHero from "@/assets/tutorials/dex-swap-hero.jpg";
```

**Add after the Back button (around line 590):**
```tsx
{/* Hero Image */}
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={dexSwapHero} 
    alt="Decentralized exchange interface showing token swap functionality" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Insert at start of each step content:**
- Step 1: `<DidYouKnow fact="Over $1.8 trillion in DEX volume was traded in 2024, with Uniswap alone processing over $600 billion." />`
- Step 2: `<KeyTakeaway>Always start with small test transactions. Even experienced DeFi users test with $10-20 before moving larger amounts.</KeyTakeaway>`
- Step 3: `<DidYouKnow fact="MetaMask's built-in swap feature uses aggregators to find you the best prices across multiple DEXs automatically." />`

### 2. SpottingScamsTutorial.tsx

**Add after imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import scamHero from "@/assets/tutorials/scam-detection-hero.jpg";
```

**Add hero image after header:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={scamHero} 
    alt="Cybersecurity shield protecting against crypto scams and phishing" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Key additions:**
- Step 1: `<KeyTakeaway title="Critical">In 2024, over $4.6 billion was stolen through crypto scams. The vast majority could have been prevented with proper verification.</KeyTakeaway>`
- Step 2: `<DidYouKnow fact="Scammers created over 500 fake MetaMask websites in 2024-2025. Always type the URL manually: metamask.io" />`

### 3. RiskAssessmentTutorial.tsx

**Add imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import riskHero from "@/assets/tutorials/risk-assessment-hero.jpg";
```

**Add hero image:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={riskHero} 
    alt="DeFi risk assessment dashboard with security metrics" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Key facts:**
- `<DidYouKnow fact="The largest DeFi hack in 2024 was $231 million from WazirX, highlighting the importance of smart contract audits." />`
- `<KeyTakeaway>Never invest more than 5-10% of your portfolio in a single DeFi protocol, no matter how attractive the yields.</KeyTakeaway>`

### 4. ChartReadingTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import chartHero from "@/assets/tutorials/chart-reading-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={chartHero} 
    alt="Trading chart with candlesticks and technical analysis indicators" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Facts:**
- `<DidYouKnow fact="Studies show that 80% of successful traders use a combination of at least 3 technical indicators for confirmation." />`

### 5. PortfolioRebalancingTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { ComparisonTable } from "@/components/course/ComparisonTable";
import portfolioHero from "@/assets/tutorials/portfolio-rebalancing-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={portfolioHero} 
    alt="Portfolio allocation pie charts showing asset rebalancing" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Facts:**
- `<DidYouKnow fact="Studies show portfolios rebalanced quarterly outperformed non-rebalanced portfolios by 0.5-1.5% annually over the past decade." />`
- `<KeyTakeaway>For 2025, most DeFi advisors recommend 40% stablecoins, 30% large-cap crypto (ETH/BTC), 20% DeFi tokens, 10% high-risk positions.</KeyTakeaway>`

### 6. DaoParticipationTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { FlipCard } from "@/components/course/FlipCard";
import daoHero from "@/assets/tutorials/dao-participation-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={daoHero} 
    alt="DAO governance interface with voting proposals and community tokens" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Facts:**
- `<DidYouKnow fact="Over $24 billion is currently controlled by DAOs in 2025, with MakerDAO, Uniswap, and Compound leading in treasury size." />`

### 7. CrossChainBridgingTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { ComparisonTable } from "@/components/course/ComparisonTable";
import bridgingHero from "@/assets/tutorials/cross-chain-bridging-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={bridgingHero} 
    alt="Cross-chain bridge connecting multiple blockchain networks" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Critical facts:**
- `<KeyTakeaway title="Security Warning">Bridges were the #1 target for hackers in 2024, with over $2 billion stolen. Always use well-audited bridges like LayerZero, Wormhole, or Stargate.</KeyTakeaway>`

### 8. DefiCalculatorsTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import calcHero from "@/assets/tutorials/defi-calculators-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={calcHero} 
    alt="DeFi calculator interface for yield farming and APY calculations" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Facts:**
- `<DidYouKnow fact="In 2025, realistic stable yields range from 3-8% APY. Anything above 15% requires careful risk assessment." />`

### 9. ReadingDefiMetricsTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { FlipCard } from "@/components/course/FlipCard";
import metricsHero from "@/assets/tutorials/defi-metrics-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={metricsHero} 
    alt="DeFi metrics dashboard with TVL, APY, and liquidity analytics" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**2025 Stats:**
- `<DidYouKnow fact="Total Value Locked (TVL) in DeFi protocols reached $95 billion in early 2025, with Ethereum dominating at 60% market share." />`

### 10. NftDefiTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { FlipCard } from "@/components/course/FlipCard";
import nftHero from "@/assets/tutorials/nft-defi-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={nftHero} 
    alt="NFT tokens integrated with DeFi smart contracts and liquidity pools" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**Facts:**
- `<DidYouKnow fact="NFT lending protocols facilitated over $600 million in loans in 2024, with Blur and Arcade leading the market." />`

### 11. AdvancedDefiProtocolsTutorial.tsx

**Imports:**
```tsx
import { KeyTakeaway } from "@/components/course/KeyTakeaway";
import { DidYouKnow } from "@/components/course/DidYouKnow";
import { ComparisonTable } from "@/components/course/ComparisonTable";
import advancedHero from "@/assets/tutorials/advanced-protocols-hero.jpg";
```

**Hero:**
```tsx
<div className="mb-8 rounded-lg overflow-hidden">
  <img 
    src={advancedHero} 
    alt="Advanced DeFi protocols with interconnected smart contracts and liquidity pools" 
    className="w-full h-48 md:h-64 object-cover"
  />
</div>
```

**2025 Data:**
- `<DidYouKnow fact="Aave V3 dominates lending with $11 billion TVL, followed by Compound ($4.2B) and MakerDAO ($5.8B) as of Q1 2025." />`

## SUMMARY CHECKLIST

For each tutorial:
- [ ] Add 3-4 import statements
- [ ] Insert hero image div after header
- [ ] Add 2-3 KeyTakeaway or DidYouKnow per tutorial
- [ ] Verify mobile responsiveness
- [ ] Update statistics to 2024-2025 data
- [ ] Test navigation and completion tracking

## ESTIMATED TIME

- Per tutorial: 10-15 minutes
- All 11 remaining: 2-2.5 hours total
- Can be done in batches: High priority first (DEX, Scams), then rest

## CURRENT COMPLETION

- ✅ WalletSetupTutorial (COMPLETE)
- 🔄 FirstDexSwapTutorial (imports added, needs hero + content)
- 🔄 SpottingScamsTutorial (imports added, needs hero + content)
- ⏳ RiskAssessmentTutorial
- ⏳ ChartReadingTutorial
- ⏳ PortfolioRebalancingTutorial
- ⏳ DaoParticipationTutorial
- ⏳ CrossChainBridgingTutorial
- ⏳ DefiCalculatorsTutorial
- ⏳ ReadingDefiMetricsTutorial
- ⏳ NftDefiTutorial
- ⏳ AdvancedDefiProtocolsTutorial
