// Course content structure with actual content
export interface ModuleContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'interactive';
  duration: number; // in minutes
  content: {
    text?: string;
    videoUrl?: string;
    embedCode?: string;
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: number;
    };
  };
  resources?: {
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'download';
  }[];
}

export interface CourseContentData {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  modules: ModuleContent[];
}

// Mock course content - in a real app, this would come from a CMS or API
export const courseContent: CourseContentData[] = [
  {
    id: 1,
    title: "DeFi Foundations: Understanding the New Financial System",
    description: "Complete beginner's guide from zero knowledge to confident understanding.",
    category: "free",
    difficulty: "Beginner",
    estimatedTime: "2 hours",
    modules: [
      {
        id: "1-1",
        title: "What is DeFi? (Simple explanation with comparisons to traditional banking)",
        type: "text",
        duration: 25,
        content: {
          text: `# What is DeFi?

**DeFi** stands for **Decentralized Finance**. Think of it as a new way to handle money that doesn't need traditional banks or financial institutions as middlemen.

## Traditional Banking vs DeFi

### Traditional Banking 🏦
- **Centralized**: One institution controls everything
- **Gatekeepers**: Banks decide who gets loans, accounts, etc.
- **Fees**: Banks charge for most services
- **Hours**: Limited by business hours and locations
- **Trust**: You trust the bank to handle your money

### DeFi 🌐
- **Decentralized**: No single entity controls the system
- **Open Access**: Anyone with internet can participate
- **Lower Fees**: Automated systems reduce costs
- **24/7**: Always available, never closes
- **Trustless**: Smart contracts handle transactions automatically

## Why Does This Matter?

Imagine you want to:
- **Send money** to someone in another country
- **Earn interest** on your savings
- **Get a loan** without paperwork
- **Trade assets** without going through a broker

DeFi makes all of this possible **without** traditional financial institutions. It's like having a bank that's run by code instead of people.

## Key Takeaway

DeFi isn't trying to replace all of traditional finance overnight. It's creating an **alternative system** that's more accessible, transparent, and efficient for many financial services.

*Next, we'll explore WHY DeFi exists and what problems it solves.*`
        },
        resources: [
          {
            title: "DeFi vs Traditional Finance Comparison Chart",
            url: "/resources/defi-comparison.pdf",
            type: "pdf"
          }
        ]
      },
      {
        id: "1-2", 
        title: "Why DeFi Exists (The problems it solves – fees, middlemen, accessibility)",
        type: "text",
        duration: 20,
        content: {
          text: `# Why Does DeFi Exist?

DeFi wasn't created just because it could be built. It exists to solve **real problems** that people face with traditional financial systems.

## Problem 1: High Fees 💸

### Traditional Finance
- International wire transfers: $15-50+ per transaction
- Currency exchange: 2-4% markup
- Investment management: 1-2% annually
- Credit card processing: 2-3% per transaction

### DeFi Solution
- Cross-border transfers: Often under $5
- Automated investing: 0.1-0.5% fees
- Direct peer-to-peer transactions
- No hidden fees or markups

## Problem 2: Exclusion & Access 🚫

### Who Gets Left Out?
- **2 billion people** worldwide have no bank account
- People with poor credit history
- Small businesses in developing countries
- Anyone in countries with unstable currencies

### DeFi Solution
- **Only need**: Internet connection + smartphone
- No credit checks or minimum balances
- Same opportunities regardless of location
- Protection against currency devaluation

## Problem 3: Lack of Transparency 🤔

### Traditional Banking
- "Black box" - you don't know what happens to your money
- Complex fee structures
- Decisions made behind closed doors
- Limited insight into risk management

### DeFi Solution
- **Complete transparency** - all transactions visible
- Open-source code you can verify
- Clear, predictable rules
- Real-time risk assessment

## Problem 4: Speed & Efficiency ⏰

### Traditional System
- Bank transfers: 1-3 business days
- International transfers: 3-7 days
- Loan approvals: Days to weeks
- Investment settlements: 2-3 days

### DeFi System
- Most transactions: Seconds to minutes
- Global transfers: Same speed everywhere
- Automated loan approvals: Instant
- Investment settlements: Immediate

## The Big Picture

DeFi exists because the current financial system was built decades ago and hasn't kept up with technology. It's like using dial-up internet when fiber optic is available.

*Next, we'll cover the blockchain basics you need to understand how DeFi actually works.*`
        }
      },
      {
        id: "1-3",
        title: "The Blockchain Basics You Actually Need to Know (No tech overload)",
        type: "text", 
        duration: 30,
        content: {
          text: `# Blockchain Basics (Without the Tech Jargon)

You don't need to understand how a car engine works to drive a car. Similarly, you don't need to be a blockchain expert to use DeFi. But understanding the basics will help you use it confidently.

## What is a Blockchain? 🔗

Think of blockchain as a **digital ledger** (like a bank's record book) with three special properties:

### 1. Shared & Public
- Instead of one bank keeping the records, **thousands of computers** keep identical copies
- Anyone can view all transactions (but personal info stays private)
- Like having thousands of witnesses for every transaction

### 2. Unchangeable
- Once a transaction is recorded, it **cannot be deleted or modified**
- Like writing in permanent ink
- This prevents fraud and "cooking the books"

### 3. No Central Authority
- No single entity controls the ledger
- Decisions are made by **consensus** among the network
- Like a democracy instead of a dictatorship

## How Does This Enable DeFi?

### Smart Contracts = Automated Agreements
Think of smart contracts as **"if-then" statements** that execute automatically:

- **If** you deposit $100 and lock it for 1 year
- **Then** you automatically receive 5% interest
- **No human intervention needed**

### Example: Traditional Loan vs DeFi Loan

**Traditional Loan:**
1. Apply at bank → Wait for approval → Sign paperwork → Get money
2. Bank employee reviews your application
3. Multiple fees and intermediaries
4. Takes days or weeks

**DeFi Loan:**
1. Deposit collateral → Receive loan instantly
2. Smart contract automatically checks collateral value
3. No paperwork, credit checks, or waiting
4. Takes minutes

## Key Blockchain Networks for DeFi

### Ethereum 🔷
- **Most popular** for DeFi applications
- Like the "iPhone" of blockchains - lots of apps
- Higher fees but most secure and established

### Others to Know
- **Polygon**: Faster, cheaper version of Ethereum
- **Binance Smart Chain**: Lower fees, different trade-offs
- **Solana**: Very fast, growing ecosystem

## What You Need to Remember

1. **Blockchain = Shared, unchangeable database**
2. **Smart contracts = Automated agreements**
3. **No middlemen = Lower costs and faster transactions**
4. **Public but pseudonymous = Transparent but private**

## Common Misconceptions

❌ "Blockchain is just for Bitcoin"
✅ Bitcoin uses blockchain, but blockchain enables much more

❌ "It's too complicated for regular people"
✅ Using DeFi apps is often simpler than traditional banking

❌ "It's not secure"
✅ When used properly, it's often more secure than traditional systems

*Next, we'll explore the key players in the DeFi ecosystem and what they do.*`
        },
        resources: [
          {
            title: "Blockchain Explained in Simple Terms (Video)",
            url: "https://youtube.com/watch?v=example",
            type: "link"
          }
        ]
      },
      {
        id: "1-4",
        title: "The Key Players (Stablecoins, DEXs, lending protocols – explained simply)",
        type: "text",
        duration: 35,
        content: {
          text: `# Key Players in the DeFi Ecosystem

The DeFi world has several types of "players" - think of them as different types of businesses, each serving a specific purpose.

## 1. Stablecoins 💵 (The "Digital Dollars")

### What They Are
- Cryptocurrencies designed to maintain stable value
- Usually pegged to $1 USD
- The "stable money" of the DeFi world

### Popular Stablecoins
- **USDC**: Backed by real dollars in bank accounts
- **USDT (Tether)**: Most widely used globally
- **DAI**: Created through smart contracts (no central authority)

### Why They Matter
- Allow you to use DeFi without crypto price volatility
- Like having digital cash that works globally
- Essential for trading, lending, and earning yield

## 2. DEXs - Decentralized Exchanges 🔄 (The "Stock Markets")

### What They Do
- Allow you to trade one cryptocurrency for another
- No central authority or order books
- Automated trading through smart contracts

### How They Work
Think of a DEX like a **vending machine for crypto**:
- You put in one type of crypto
- The machine automatically gives you another type
- Rates determined by supply and demand

### Popular DEXs
- **Uniswap**: The most popular on Ethereum
- **PancakeSwap**: Popular on Binance Smart Chain
- **SushiSwap**: Community-owned alternative

### Benefits vs Traditional Exchanges
- **No KYC required** (no personal information)
- **Always available** (24/7 global access)
- **Lower fees** (no middleman taking cuts)
- **You control your funds** (no exchange can freeze your account)

## 3. Lending Protocols 🏦 (The "Banks")

### What They Do
- Allow people to **lend crypto and earn interest**
- Allow people to **borrow crypto by putting up collateral**
- All automated through smart contracts

### How It Works

**For Lenders:**
1. Deposit your crypto into the protocol
2. Earn interest automatically (usually 2-15% annually)
3. Withdraw anytime (in most protocols)

**For Borrowers:**
1. Deposit collateral (worth more than you want to borrow)
2. Borrow up to ~75% of collateral value
3. Use borrowed funds for trading, investments, etc.
4. Pay back loan + interest to get collateral back

### Popular Lending Protocols
- **Aave**: Most feature-rich, supports many assets
- **Compound**: Simple, established protocol
- **MakerDAO**: Creates DAI stablecoin through borrowing

## 4. Yield Farming Protocols 🌾 (The "Investment Funds")

### What They Are
- Platforms that help you **earn higher returns** on your crypto
- Automatically move your funds to the best opportunities
- Like having a financial advisor that works 24/7

### How They Work
1. You deposit stablecoins or crypto
2. Protocol automatically:
   - Lends your funds
   - Provides liquidity to DEXs
   - Stakes in various protocols
   - Compounds your earnings
3. You earn higher yields than simple lending

### Popular Yield Protocols
- **Yearn Finance**: The "grandfather" of yield farming
- **Harvest Finance**: Automated yield strategies
- **Beefy Finance**: Multi-chain yield optimization

## 5. Liquidity Pools 🌊 (The "Market Makers")

### What They Are
- Collections of funds that enable DEXs to function
- Users provide equal value of two assets (like $1000 USDC + $1000 ETH)
- Earn fees from people trading between those assets

### Benefits
- **Earn trading fees** (usually 0.1-1% of each trade)
- **Additional rewards** (many protocols give bonus tokens)
- **Help the ecosystem** (enable others to trade)

### Risks to Understand
- **Impermanent Loss**: If prices change a lot, you might have been better off just holding
- **Smart Contract Risk**: Protocol bugs could cause losses

## Putting It All Together

Think of DeFi like a **financial ecosystem**:
- **Stablecoins** = The currency everyone uses
- **DEXs** = The markets where everything trades
- **Lending Protocols** = The banks for saving and borrowing
- **Yield Farms** = The investment advisors
- **Liquidity Pools** = The market makers keeping everything liquid

Each player serves a purpose, and they all work together to create a complete financial system.

*Next, we'll address the risks and myths around DeFi so you can use it safely.*`
        }
      },
      {
        id: "1-5",
        title: "Risks and Myths (Separating facts from hype)",
        type: "text",
        duration: 25,
        content: {
          text: `# DeFi Risks and Myths: The Reality Check

Before diving into DeFi, it's crucial to understand both the **real risks** and separate them from **common myths**. Knowledge is your best protection.

## Real Risks (That You Should Take Seriously) ⚠️

### 1. Smart Contract Risk
**What it is**: Bugs in code can lead to loss of funds
**Example**: Protocol gets hacked, funds are drained
**Mitigation**: 
- Use established protocols with security audits
- Don't put more than you can afford to lose
- Start small to learn

### 2. Impermanent Loss (For Liquidity Providers)
**What it is**: When providing liquidity, price changes can reduce your total value
**Example**: You provide ETH/USDC liquidity, ETH price doubles, you end up with less total value than just holding ETH
**Mitigation**: 
- Understand the concept before providing liquidity
- Consider stable-stable pairs (USDC/USDT) to minimize risk
- Factor in trading fees that offset some losses

### 3. Regulatory Risk
**What it is**: Governments might restrict or ban certain DeFi activities
**Example**: Country bans DEXs or certain protocols
**Mitigation**:
- Stay informed about regulations in your country
- Use compliant protocols when possible
- Understand the legal implications

### 4. User Error
**What it is**: Mistakes can be costly and irreversible
**Example**: Sending funds to wrong address, approving malicious contracts
**Mitigation**:
- **Always test with small amounts first**
- Double-check addresses and transaction details
- Learn about wallet security
- Never share your private keys

### 5. Market Volatility
**What it is**: Crypto prices can be extremely volatile
**Example**: Your $1000 in ETH becomes $500 overnight
**Mitigation**:
- Use stablecoins for steady value
- Only invest what you can afford to lose
- Understand that volatility goes both ways

## Common Myths (Debunked) 🚫

### Myth 1: "DeFi is Just for Tech Experts"
**Reality**: Modern DeFi interfaces are often easier to use than traditional banking websites. You don't need to understand the underlying technology any more than you need to understand TCP/IP to use the internet.

### Myth 2: "It's All Scams and Ponzi Schemes"
**Reality**: While scams exist (like in any industry), established DeFi protocols have **billions of dollars locked** and have operated safely for years. The key is distinguishing between legitimate protocols and obvious scams.

### Myth 3: "It's Not Regulated So It's Dangerous"
**Reality**: Many DeFi protocols are actually **more transparent** than traditional finance because all transactions are public. The code is often open-source and audited by security firms.

### Myth 4: "You Need a Lot of Money to Start"
**Reality**: You can start experimenting with as little as $10-50. Many protocols have no minimum deposits.

### Myth 5: "It's Bad for the Environment"
**Reality**: While Bitcoin mining is energy-intensive, most DeFi runs on networks that use **99% less energy** than Bitcoin. Ethereum has switched to Proof-of-Stake, dramatically reducing its environmental impact.

### Myth 6: "Banks Will Shut It Down"
**Reality**: Many traditional banks are now **integrating with DeFi** and offering crypto services. The trend is toward collaboration and regulation, not elimination.

## Risk Management Best Practices 🛡️

### Start Small and Learn
1. **Begin with $10-50** to learn the interfaces
2. **Use testnets** when available (practice with fake money)
3. **Gradually increase** as you gain confidence

### Security Fundamentals
1. **Use hardware wallets** for large amounts
2. **Never share private keys** or seed phrases
3. **Bookmark official websites** to avoid phishing
4. **Enable all security features** on your wallet

### Due Diligence
1. **Research protocols** before using them
2. **Check for security audits** from reputable firms
3. **Read community discussions** on Reddit, Discord, Twitter
4. **Understand the risks** of each protocol you use

### Diversification
1. **Don't put everything in one protocol**
2. **Spread across different types** of DeFi activities
3. **Keep some funds in stable, low-risk options**

## The Bottom Line

DeFi has **real risks** that you must understand and manage. However, many of the fears are based on **myths and misunderstanding**. 

With proper education, security practices, and gradual exposure, DeFi can be a valuable addition to your financial toolkit.

**Remember**: The goal isn't to avoid all risk (that's impossible), but to **understand and manage** the risks you're taking.

*Congratulations! You've completed the DeFi Foundations course. You now have the knowledge to safely explore the DeFi ecosystem.*`
        },
        resources: [
          {
            title: "DeFi Risk Assessment Checklist",
            url: "/resources/risk-checklist.pdf", 
            type: "pdf"
          },
          {
            title: "Security Best Practices Guide",
            url: "/resources/security-guide.pdf",
            type: "pdf"
          }
        ]
      }
    ]
  },
  // Add content for other courses...
  {
    id: 2,
    title: "Staying Safe in DeFi: Wallets, Security, and Avoiding Scams",
    description: "Essential security course for beginners worried about hacks or losing funds.",
    category: "free",
    difficulty: "Beginner",
    estimatedTime: "2.5 hours",
    modules: [
      {
        id: "2-1",
        title: "Choosing the Right Wallet (MetaMask, Trust Wallet, or Ledger?)",
        type: "text",
        duration: 30,
        content: {
          text: `# Choosing the Right Wallet for DeFi

Your wallet is your gateway to DeFi - it's like choosing the right bank, but more important because **you're in complete control**. Let's break down your options.

## Types of Wallets 📱

### 1. Software Wallets (Hot Wallets)
**What they are**: Apps on your phone or browser extensions
**Pros**: Convenient, easy to use, perfect for beginners
**Cons**: Connected to internet, slightly higher risk
**Best for**: Daily DeFi activities, smaller amounts ($100-$5,000)

### 2. Hardware Wallets (Cold Wallets)  
**What they are**: Physical devices that store your keys offline
**Pros**: Maximum security, immune to online attacks
**Cons**: Less convenient, costs money upfront
**Best for**: Long-term storage, larger amounts ($5,000+)

## Popular Software Wallets 📲

### MetaMask 🦊
**Best for**: Beginners to DeFi
- **Pros**: Most widely supported, easy to use, built-in DeFi features
- **Cons**: Browser-based (less secure than mobile), can be overwhelming
- **Supports**: Ethereum, Polygon, BSC, and many other networks
- **Perfect if**: You're new to DeFi and want maximum compatibility

### Trust Wallet 📱
**Best for**: Mobile-first users
- **Pros**: Mobile-native, supports many cryptocurrencies, clean interface
- **Cons**: Less DeFi integration than MetaMask
- **Supports**: 60+ blockchains including all major DeFi networks
- **Perfect if**: You prefer mobile and want a simple experience

### Coinbase Wallet 🔵
**Best for**: Coinbase users transitioning to DeFi
- **Pros**: Integrates with Coinbase exchange, user-friendly
- **Cons**: Less features than MetaMask, newer to DeFi space
- **Supports**: Ethereum and major Layer 2 networks
- **Perfect if**: You already use Coinbase and want familiar experience

## Hardware Wallets 🔐

### Ledger Nano S Plus / Nano X
**Best for**: Security-conscious users with significant funds
- **Pros**: Industry standard, supports 5,500+ cryptocurrencies
- **Cons**: $80-150 cost, learning curve
- **DeFi Usage**: Connect to MetaMask for best DeFi experience
- **Perfect if**: You have $5,000+ in crypto or prioritize maximum security

### Trezor Model One / Model T
**Best for**: Open-source security advocates
- **Pros**: Fully open-source, excellent security track record
- **Cons**: Slightly less user-friendly than Ledger
- **DeFi Usage**: Works with MetaMask and other interfaces
- **Perfect if**: You value open-source security and transparency

## Wallet Security Levels 🛡️

### Beginner Setup (Good Security)
1. **MetaMask or Trust Wallet** on your phone
2. **Strong password** and biometric lock
3. **Backup seed phrase** written down and stored safely
4. **Start with small amounts** ($50-500)

### Intermediate Setup (Better Security)  
1. **Hardware wallet** for storage
2. **MetaMask** connected to hardware wallet for DeFi
3. **Separate phone/computer** for crypto activities
4. **Multiple backups** of seed phrases in different locations

### Advanced Setup (Best Security)
1. **Multiple hardware wallets** (one for hot use, one cold storage)
2. **Multisig wallet** for large amounts
3. **Dedicated devices** for crypto only
4. **Professional custody** for institutional amounts

## Wallet Features That Matter for DeFi 🎯

### Must-Have Features
- **Multi-chain support** (Ethereum, Polygon, etc.)
- **DApp browser** or easy connection to DeFi protocols
- **Transaction customization** (gas fees, slippage)
- **Seed phrase backup and recovery**

### Nice-to-Have Features
- **Built-in DEX** for quick swaps
- **NFT support** if you're interested
- **Staking features** for earning rewards
- **Price tracking** and portfolio overview

## Common Mistakes to Avoid ❌

### 1. Using Exchange Wallets for DeFi
- **Wrong**: Keeping funds on Coinbase/Binance for DeFi
- **Right**: Moving funds to your own wallet first

### 2. Not Backing Up Seed Phrases
- **Wrong**: Screenshotting or saving digitally
- **Right**: Writing down on paper, storing in safe place

### 3. Using Same Wallet for Everything
- **Wrong**: One wallet for trading, storing, and experimenting
- **Right**: Different wallets for different purposes and risk levels

### 4. Ignoring Network Fees
- **Wrong**: Not checking gas fees before transactions
- **Right**: Understanding and planning for transaction costs

## My Recommended Progression 📈

### Week 1-2: Start Simple
- **Download MetaMask** or Trust Wallet
- **Transfer $50-100** from an exchange
- **Try basic DeFi** activities (swapping, providing liquidity)
- **Learn the interface** and how transactions work

### Month 1-3: Build Confidence  
- **Increase amounts** gradually as you learn
- **Explore different protocols** and features
- **Consider Layer 2** solutions for lower fees
- **Start thinking about** hardware wallet

### Month 3+: Optimize Security
- **Buy hardware wallet** if you have $5,000+
- **Set up proper backup** systems
- **Consider advanced features** like multisig
- **Separate hot/cold** storage strategies

## Quick Decision Guide 🤔

**"I'm brand new and just want to try DeFi"**
→ **MetaMask browser extension + mobile app**

**"I prefer mobile and want something simple"**  
→ **Trust Wallet**

**"I have $5,000+ in crypto"**
→ **Ledger Nano X + MetaMask**

**"I'm already a Coinbase user"**
→ **Coinbase Wallet** (then consider MetaMask later)

**"I value open-source security above all"**
→ **Trezor + MetaMask**

Remember: You can always **start with one wallet and add others** as your needs grow. The most important thing is to **start safely** and **learn as you go**.

*Next: We'll cover the critical rules about private keys and seed phrases that you absolutely must understand.*`
        }
      }
      // More modules for this course...
    ]
  }
];

export const getCourseContent = (courseId: number): CourseContentData | undefined => {
  return courseContent.find(course => course.id === courseId);
};

export const getModuleContent = (courseId: number, moduleId: string): ModuleContent | undefined => {
  const course = getCourseContent(courseId);
  return course?.modules.find(module => module.id === moduleId);
};