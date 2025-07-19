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
            title: "Live DeFi Market Data",
            url: "/analytics",
            type: "link"
          },
          {
            title: "DeFi vs Traditional Finance Visual",
            url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
            type: "link"
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
            title: "How Blockchain Works (Ethereum.org)",
            url: "https://ethereum.org/en/developers/docs/intro-to-ethereum/",
            type: "link"
          },
          {
            title: "Blockchain Visualization",
            url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
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
            title: "DeFi Risk Assessment Tools",
            url: "/resources",
            type: "link"
          },
          {
            title: "Security Best Practices",
            url: "/resources",
            type: "link"
          },
          {
            title: "DeFi Calculators",
            url: "/resources#calculators",
            type: "link"
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
      },
      {
        id: "2-2",
        title: "Private Keys & Seed Phrases: Your Digital Life Depends on This",
        type: "text",
        duration: 25,
        content: {
          text: `# Private Keys & Seed Phrases: The Foundation of Your Security

This is **THE MOST IMPORTANT** lesson in all of DeFi. Get this wrong, and you could lose everything. Get it right, and you're safer than 99% of people.

## What is a Private Key? 🔑

Think of your private key like the **master key to your house**:
- It proves ownership of your crypto
- It's a long string of letters and numbers
- **Anyone with your private key owns your crypto**
- There's no "forgot password" button - lose it, lose everything

## What is a Seed Phrase? 📝

Your seed phrase (also called recovery phrase) is:
- **12 or 24 words** that represent your private key
- Like having your master key written in human language
- Can recreate your wallet on any device
- **The backup that saves you if your device breaks**

### Example Seed Phrase:
\`apple bicycle cat dog elephant forest garden house ice jungle king lemon\`

## The Golden Rules (Never Break These) ⚠️

### Rule #1: NEVER Share Your Seed Phrase
❌ **NEVER** type it into any website
❌ **NEVER** send it via email, text, or chat
❌ **NEVER** take a screenshot or photo
❌ **NEVER** store it in cloud storage
❌ **NEVER** tell anyone, even family

### Rule #2: Write It Down Physically
✅ **Write on paper** with pen/pencil
✅ **Use metal backup** for long-term storage
✅ **Store in multiple safe locations**
✅ **Consider a safety deposit box** for large amounts

### Rule #3: Test Your Backup
✅ **Before sending money**, test recovery
✅ **Use a small amount** first
✅ **Make sure you can restore** your wallet

## Common Mistakes That Lose Money 💸

### "I'll just keep it in my browser"
❌ Browser crashes, extensions get deleted, computers die
✅ Always have written backup

### "I'll save it in my notes app"
❌ Phone stolen = seed phrase stolen
✅ Physical paper only

### "I'll memorize it"
❌ Memory fails, especially under stress
✅ Written backup is mandatory

### "I'll store it 'safely' online"
❌ Cloud storage gets hacked constantly
✅ Offline storage only

## How to Store Your Seed Phrase Safely 🛡️

### For Beginners ($100-$5,000):
1. **Write on paper** with permanent ink
2. **Make 2-3 copies**
3. **Store in different locations** (home safe, family member's house)
4. **Laminate** to protect from water damage

### For Serious Amounts ($5,000+):
1. **Metal seed phrase backup** (fire/water resistant)
2. **Safety deposit box**
3. **Consider splitting** between locations
4. **Never store all in one place**

## Setting Up Your Seed Phrase 📋

### When Creating a New Wallet:
1. **Choose strong device** (not public computer)
2. **Ensure you're alone** (no cameras, people watching)
3. **Write down each word** in exact order
4. **Double-check spelling** of every word
5. **Test recovery** before adding funds

### Verification Process:
1. Write down all 12/24 words
2. Close wallet app
3. Restore wallet using your written phrase
4. Confirm all wallets/addresses appear
5. Only then add real money

## Red Flags: Seed Phrase Scams 🚨

### Someone asks for your seed phrase:
❌ "Customer support" asking for recovery phrase
❌ "Synchronization" or "validation" requests
❌ "Security check" requiring seed phrase
❌ Any website asking you to enter it

### Remember:
- **Legitimate services NEVER ask for seed phrases**
- **No real support team needs your recovery phrase**
- **Wallets sync automatically** without seed phrase entry

## What if I Think My Seed Phrase is Compromised? 🚨

### Immediate Actions:
1. **Create new wallet** immediately
2. **Transfer all funds** to new wallet
3. **Never use old wallet** again
4. **Consider how it was compromised**

### Investigation:
- Did you type it somewhere?
- Was it stored digitally?
- Did someone see it?
- Was your device compromised?

## Recovery Scenarios 💭

### "My phone died"
✅ Get new device → Install wallet app → Enter seed phrase → Access restored

### "I deleted the app by accident"
✅ Reinstall app → Enter seed phrase → Access restored

### "My computer crashed"
✅ New computer → Install wallet → Enter seed phrase → Access restored

### "I lost my seed phrase"
❌ **Your crypto is gone forever**
❌ **No way to recover it**
❌ **This is why backups are critical**

## Advanced Security Tips 🎯

### For Paranoid (but Smart) People:
- **Test your backups** every 6 months
- **Use passphrase protection** (25th word)
- **Consider multisig** for large amounts
- **Geographic distribution** of backups

### Inheritance Planning:
- How will family access if something happens to you?
- Consider lawyer-held instructions
- Don't just hide it - document the process

## Quick Self-Test ✅

Before moving on, ask yourself:
- [ ] Do I understand what a seed phrase is?
- [ ] Do I know the golden rules?
- [ ] Do I have a plan for physical storage?
- [ ] Can I recognize seed phrase scams?
- [ ] Do I know what to do if compromised?

## Key Takeaway

Your seed phrase is **more valuable than cash**. Treat it like you would treat a briefcase full of money:
- Don't leave it lying around
- Don't tell strangers about it
- Don't store it where thieves can find it
- Make backups in case of disaster

**Remember**: In DeFi, you are your own bank. With great power comes great responsibility.

*Next: We'll learn how to spot and avoid the most common DeFi scams.*`
        }
      },
      {
        id: "2-3", 
        title: "Spotting Scams: The Ultimate Guide to Not Getting Ripped Off",
        type: "text",
        duration: 30,
        content: {
          text: `# Spotting DeFi Scams: Your Ultimate Protection Guide

DeFi scams steal **billions** every year. But they all follow predictable patterns. Learn these patterns, and you'll be safer than 95% of users.

## The Big Picture: Why Scams Work 🎯

### Scammers Exploit:
- **FOMO** (Fear of Missing Out)
- **Greed** (too-good-to-be-true returns)  
- **Urgency** ("limited time offer")
- **Authority** (fake endorsements)
- **Trust** (impersonating legitimate projects)

### Your Defense:
- **Slow down** and think
- **Verify everything** independently  
- **Trust but verify** all claims
- **When in doubt, don't**

## Scam Category 1: Fake Tokens & Rug Pulls 🚩

### How It Works:
1. Create token with attractive name
2. Market with promises of huge returns
3. Get people to buy in
4. Developers disappear with the money

### Red Flags:
❌ **Anonymous team** with no real names/photos
❌ **No working product** despite big promises
❌ **Unrealistic returns** (1000%+ APY)
❌ **Heavy marketing** on social media
❌ **No token utility** beyond speculation
❌ **Locked liquidity** for very short periods

### Protection:
✅ **Research the team** - real names, LinkedIn profiles
✅ **Check contract** on block explorers
✅ **Look for audits** from reputable firms
✅ **Start small** - never invest more than you can lose
✅ **Verify claims** independently

## Scam Category 2: Phishing Websites 🎣

### How It Works:
1. Create fake version of popular DeFi site
2. You connect your wallet
3. Malicious contract drains your funds

### Red Flags:
❌ **Wrong URL** (uniswap.com vs umiswap.com)
❌ **HTTP instead of HTTPS**
❌ **Requests for seed phrase**
❌ **Unexpected transaction requests**
❌ **Poor grammar/spelling**

### Protection:
✅ **Bookmark real sites** and only use bookmarks
✅ **Check URLs carefully** before connecting wallet
✅ **Use official app store** versions when available
✅ **Read transaction details** before signing
✅ **Never enter seed phrase** on any website

### URL Verification Checklist:
- Is it exactly the right spelling?
- Does it use HTTPS?
- Does the SSL certificate match?
- Did you get here from a trusted source?

## Scam Category 3: Social Media & Discord Scams 💬

### Common Tactics:
- **Fake giveaways** requiring wallet connection
- **Impersonator accounts** of popular influencers
- **Discord DMs** offering "exclusive opportunities"
- **Telegram groups** with fake admins
- **"Customer support"** asking for private keys

### Red Flags:
❌ **Unsolicited DMs** about opportunities
❌ **Giveaways requiring** crypto deposits
❌ **Support asking for** private information
❌ **Too-good-to-be-true** opportunities
❌ **Pressure to act quickly**

### Protection:
✅ **Ignore unsolicited DMs**
✅ **Verify accounts** (blue checkmarks, follower count)
✅ **Check official channels** only
✅ **No legitimate giveaway** requires deposits
✅ **Real support never asks** for private keys

## Scam Category 4: Fake Apps & Browser Extensions 📱

### How It Works:
1. Create malicious wallet app/extension
2. User downloads thinking it's legitimate
3. App steals seed phrases or private keys

### Red Flags:
❌ **Download from unofficial** app stores
❌ **Poor reviews** or very few reviews
❌ **Recently published** with no history
❌ **Requests unusual permissions**
❌ **Asks for seed phrase** immediately

### Protection:
✅ **Only download from official** app stores
✅ **Verify developer** matches official project
✅ **Read reviews carefully**
✅ **Check download counts**
✅ **Use official links** from project websites

## Scam Category 5: Investment Scams 💰

### Common Types:
- **Ponzi schemes** disguised as DeFi protocols
- **Fake farming** opportunities
- **"Guaranteed returns"** programs
- **Pyramid schemes** with crypto rewards

### Red Flags:
❌ **Guaranteed profits** (nothing is guaranteed)
❌ **Recruiting bonuses** for bringing friends
❌ **No clear explanation** of how returns are generated
❌ **Pressure to invest more**
❌ **Withdrawal restrictions**

### Protection:
✅ **Understand the mechanism** behind promised returns
✅ **Start with tiny amounts**
✅ **Research team and technology**
✅ **Check for third-party audits**
✅ **If it sounds too good to be true, it probably is**

## The Scammer's Playbook: Common Tactics 📚

### Urgency:
- "Limited time offer"
- "Only 24 hours left"
- "Price going up soon"

### Authority:
- Fake endorsements from celebrities
- Impersonating official accounts
- Using similar logos/branding

### Social Proof:
- Fake testimonials
- Bot followers and engagement
- Purchased positive reviews

### Fear:
- "Your account will be closed"
- "Update required immediately"
- "Security breach - act now"

## Due Diligence Checklist ✅

### Before Using Any DeFi Protocol:

#### Team Research:
- [ ] Real names and backgrounds of team members
- [ ] LinkedIn profiles and professional history
- [ ] Previous successful projects
- [ ] Public appearances or interviews

#### Technology Check:
- [ ] Open source code available
- [ ] Third-party security audits
- [ ] Bug bounty programs
- [ ] Active development on GitHub

#### Community Verification:
- [ ] Active, organic community discussions
- [ ] Legitimate influencer endorsements
- [ ] Positive sentiment from experienced users
- [ ] No paid promotion red flags

#### Financial Logic:
- [ ] Understand how the protocol makes money
- [ ] Returns seem realistic and sustainable
- [ ] Clear tokenomics and use cases
- [ ] Transparent fee structures

## Emergency Response Plan 🚨

### If You Think You've Been Scammed:

#### Immediate Actions (First 5 Minutes):
1. **Stop all activity** - don't interact with anything
2. **Change passwords** on all accounts
3. **Revoke approvals** on platforms like Revoke.cash
4. **Move remaining funds** to a new wallet

#### Investigation (Next Hour):
1. **Document everything** - screenshots, transaction hashes
2. **Check blockchain explorer** for unauthorized transactions
3. **Report to platform** if applicable
4. **Post warnings** in community channels

#### Recovery (Following Days):
1. **Create completely new wallet**
2. **New seed phrase** (never reuse compromised one)
3. **Review security practices**
4. **Consider reporting** to authorities

## Tools for Staying Safe 🛠️

### Verification Tools:
- **Etherscan/Block Explorers** - verify contracts
- **DeFiPulse/DeFiLlama** - check protocol legitimacy
- **Revoke.cash** - manage token approvals
- **Scam database sites** - check known scams

### Security Extensions:
- **MetaMask** - shows transaction warnings
- **Pocket Universe** - transaction simulation
- **Fire** - additional security layers

## Red Flag Summary Card 🚩

Print this and keep it handy:

**STOP** if you see:
- Requests for seed phrase
- Guaranteed high returns
- Pressure to act quickly
- Anonymous teams
- No working product
- Fake social media accounts
- Unsolicited investment opportunities
- Apps from unofficial sources

**GO** when you see:
- Transparent team information
- Realistic return expectations
- Third-party audits
- Strong community consensus
- Working products
- Clear documentation
- Official channels only

## Key Takeaway

**Scammers are professionals** - they're good at what they do. But they rely on predictable psychological triggers. By understanding their playbook and taking time to verify, you can protect yourself.

**Remember**: In DeFi, taking 30 minutes to research can save you thousands of dollars. When in doubt, wait it out.

*Next: We'll cover the essential security practices for safe DeFi interactions.*`
        }
      },
      {
        id: "2-4",
        title: "Security Best Practices: Your Daily DeFi Safety Routine", 
        type: "text",
        duration: 25,
        content: {
          text: `# Security Best Practices: Your Daily DeFi Safety Routine

Security isn't a one-time setup - it's a daily practice. Here's how to build bulletproof security habits that become second nature.

## Device Security: Your First Line of Defense 💻

### Computer/Phone Basics:
✅ **Keep OS updated** - install security patches immediately
✅ **Use antivirus software** - even on Mac
✅ **Enable automatic locks** - 5-10 minute timeout
✅ **Use strong passwords** - unique for every account
✅ **Enable 2FA everywhere** - especially email and crypto accounts

### Browser Security:
✅ **Use reputable browser** (Chrome, Firefox, Safari)
✅ **Keep browser updated** 
✅ **Clear cache regularly**
✅ **Use incognito mode** for sensitive activities
✅ **Disable auto-fill** for crypto-related forms

### Network Security:
❌ **Never use public WiFi** for DeFi activities
❌ **Airport, coffee shop, hotel WiFi** = danger zone
✅ **Use your home network** or mobile hotspot
✅ **Consider VPN** for additional privacy

## Wallet Security: Advanced Protection 🔐

### Connection Habits:
✅ **Read every transaction** before signing
✅ **Verify contract addresses** on block explorer
✅ **Disconnect wallet** after each session
✅ **Use different wallets** for different purposes
✅ **Regular approval audits** (Revoke.cash)

### Multi-Wallet Strategy:
1. **Hot Wallet** (MetaMask) - small amounts, daily use
2. **Cold Wallet** (Ledger) - large amounts, rare use
3. **Burner Wallet** - experimental protocols only

### Transaction Verification:
Before signing ANY transaction:
- What contract am I interacting with?
- How much am I spending/approving?
- What permissions am I granting?
- Do I recognize this protocol?
- Does the transaction match my intention?

## Website & App Security 🌐

### Before Using Any DeFi Site:

#### URL Verification:
1. **Check spelling** character by character
2. **Verify HTTPS** and SSL certificate
3. **Use bookmarks** not search results
4. **Cross-reference** with official social media

#### Contract Verification:
1. **Check contract address** on explorer
2. **Look for verification badge**
3. **Review recent transactions**
4. **Check for audit reports**

### Safe Browsing Habits:
✅ **One tab for DeFi** - close everything else
✅ **No downloads** while using DeFi
✅ **Clear cache** after sessions
✅ **Use dedicated browser** for crypto only
✅ **Disable extensions** you don't absolutely need

## Social Engineering Defense 🛡️

### Email Security:
❌ **Never click crypto links** in emails
❌ **No legitimate service** emails seed phrases
❌ **"Urgent action required"** emails are usually scams
✅ **Manually type URLs** instead of clicking
✅ **Verify sender** through official channels

### Social Media Safety:
❌ **Ignore unsolicited DMs** about opportunities
❌ **Don't share portfolio** details publicly
❌ **No posting** about big wins or holdings
✅ **Use privacy settings** aggressively
✅ **Be skeptical** of "exclusive opportunities"

### Phone/SMS Security:
❌ **Never give crypto info** over phone
❌ **"Customer support" never calls** unsolicited
❌ **No legitimate service** asks for private keys via phone
✅ **Hang up and verify** through official channels
✅ **Use app-based 2FA** not SMS when possible

## Regular Security Maintenance 🔧

### Weekly Tasks:
- [ ] **Review wallet approvals** (Revoke.cash)
- [ ] **Check for software updates**
- [ ] **Verify backup integrity**
- [ ] **Review recent transactions**

### Monthly Tasks:
- [ ] **Password manager audit**
- [ ] **2FA backup codes check**
- [ ] **Security question updates**
- [ ] **Account access review**

### Quarterly Tasks:
- [ ] **Seed phrase test recovery**
- [ ] **Security practice review**
- [ ] **Emergency plan update**
- [ ] **Hardware wallet firmware update**

## Risk Management Strategies 📊

### Portfolio Allocation:
- **80% in established protocols** (Uniswap, Compound, Aave)
- **15% in newer but audited** protocols
- **5% in experimental** (only what you can lose)

### Interaction Limits:
- **Daily interaction limit** - don't exceed $X per day
- **New protocol limit** - max $100 first time
- **Experimental limit** - max 1% of portfolio

### Geographic/Time Diversification:
- **Don't do everything at once**
- **Spread interactions** over time
- **Different devices** for different protocols
- **Different networks** when possible

## Emergency Preparedness 🚨

### If Your Wallet is Compromised:

#### First 60 Seconds:
1. **Stop all activity** immediately
2. **Open new wallet** on different device
3. **Transfer remaining funds** to new wallet
4. **Revoke all approvals** on compromised wallet

#### Next 10 Minutes:
1. **Change all passwords** related to crypto
2. **Enable 2FA** on new accounts
3. **Scan computer** for malware
4. **Review recent transactions**

#### Following Hour:
1. **Create completely new setup** 
2. **New seed phrase** (never reuse)
3. **Different email** if needed
4. **Review what went wrong**

### Emergency Contact List:
Keep written list of:
- Hardware wallet support
- Exchange support contacts
- Trusted crypto-savvy friends
- Local cybersecurity experts

## Advanced Security Techniques 🎯

### For Power Users:

#### Air-Gapped Signing:
- Use offline device for transaction signing
- Transfer via QR codes or USB
- Ultimate security for large transactions

#### Multi-Signature Wallets:
- Require multiple approvals for transactions
- Distribute keys across devices/locations
- Excellent for business or family funds

#### Time-Locked Contracts:
- Build in delays for large withdrawals
- Gives time to detect and prevent theft
- Available on some advanced platforms

#### Decoy Wallets:
- Keep small amounts in "obvious" wallets
- Hide main funds in less obvious locations
- Psychological protection against targeted attacks

## Security Mindset 🧠

### Core Principles:
1. **Paranoia is healthy** in crypto
2. **Trust but verify** everything
3. **Slow down** when money is involved
4. **When in doubt, don't**
5. **Security is a process**, not a destination

### Daily Questions:
- Am I being careful enough?
- What could go wrong here?
- Have I verified this independently?
- Am I being pressured to move quickly?
- Does this feel too good to be true?

## Quick Security Checklist ✅

Before ANY DeFi interaction:
- [ ] Am I on the correct URL?
- [ ] Is my wallet updated?
- [ ] Do I understand this transaction?
- [ ] Have I checked the contract address?
- [ ] Am I using a secure connection?
- [ ] Is this amount acceptable to lose?

## Key Takeaway

Security in DeFi is like wearing a seatbelt - it seems unnecessary until you really need it. The difference is that in DeFi, there's no insurance company or government to bail you out.

**Remember**: Every security practice feels like overkill until the day it saves you from losing everything. Better paranoid than sorry.

*Next: We'll learn how to safely interact with DeFi protocols and avoid common mistakes.*`
        }
      },
      {
        id: "2-5",
        title: "Safe DeFi Interactions: Step-by-Step Guide to Not Losing Money",
        type: "text", 
        duration: 30,
        content: {
          text: `# Safe DeFi Interactions: Your Step-by-Step Safety Guide

This is where theory meets practice. Here's exactly how to interact with DeFi protocols safely, with real examples and step-by-step instructions.

## Pre-Interaction Checklist 📋

### Before touching ANY DeFi protocol:

#### Research Phase (20-30 minutes):
- [ ] **Protocol audit status** - check for recent audits
- [ ] **Team verification** - real names and backgrounds
- [ ] **Community sentiment** - what are users saying?
- [ ] **TVL and volume** - metrics from DeFiLlama
- [ ] **Recent incidents** - any hacks or issues?
- [ ] **Contract addresses** - verify from official sources

#### Technical Verification:
- [ ] **Contract verification** on block explorer
- [ ] **Recent transactions** look normal
- [ ] **No unusual token approvals** requested
- [ ] **Gas fees reasonable** for network conditions
- [ ] **Slippage tolerance** set appropriately

## Your First DeFi Interaction: A Safe Approach 🔄

### Scenario: Swapping ETH for USDC on Uniswap

#### Step 1: Preparation (5 minutes)
1. **Go to official site**: https://app.uniswap.org
   - Bookmark this URL for future use
   - Never use search results for crypto sites

2. **Verify SSL certificate**: 
   - Look for padlock icon
   - Certificate should be issued to uniswap.org

3. **Check network status**:
   - Is Ethereum network congested?
   - Are gas fees reasonable for your trade size?

#### Step 2: Wallet Connection (2 minutes)
1. **Click "Connect Wallet"**
2. **Choose your wallet** (MetaMask)
3. **Verify the connection request**:
   - Does the site name match what you expect?
   - Are the permissions reasonable?
4. **Accept connection**

⚠️ **Red Flag**: If the site asks for seed phrase during connection, STOP immediately.

#### Step 3: Setting Up the Swap (3 minutes)
1. **Select tokens**:
   - From: ETH
   - To: USDC
2. **Verify token contracts**:
   - ETH: Native token (no contract needed)
   - USDC: 0xA0b86a33E6...
3. **Enter amount**: Start small (0.01 ETH for first time)
4. **Check exchange rate**: Compare to other sources

#### Step 4: Transaction Review (5 minutes)
1. **Review swap details**:
   - Amount in: 0.01 ETH
   - Amount out: ~$25 USDC (depending on price)
   - Price impact: Should be <0.1% for liquid pairs
   - Gas fee: Check current network rates

2. **Set slippage tolerance**:
   - 0.5% for stablecoins
   - 1-3% for other tokens
   - Higher slippage = higher risk of loss

3. **Check for warnings**:
   - High price impact warnings
   - Unusual token warnings
   - Network congestion alerts

#### Step 5: Execute Transaction (2 minutes)
1. **Click "Swap"**
2. **Review MetaMask popup**:
   - Contract address matches Uniswap
   - Gas limit reasonable (usually 150k-300k)
   - Total fee acceptable
3. **Confirm transaction**
4. **Wait for confirmation** (1-5 minutes)

#### Step 6: Verification (2 minutes)
1. **Check transaction status** on Etherscan
2. **Verify tokens received** in wallet
3. **Disconnect wallet** from site when done

### Total time: ~20 minutes for first interaction

## Common DeFi Activities: Safety Protocols 🛡️

### Lending (Compound, Aave):

#### Before Lending:
- [ ] **Protocol audit date** - recent is better
- [ ] **Liquidation parameters** - understand the risks
- [ ] **Interest rate model** - how rates are calculated
- [ ] **Asset risk** - is the token you're lending risky?

#### Safe Lending Practice:
1. **Start with established assets** (ETH, USDC, DAI)
2. **Lend small amounts** initially
3. **Monitor health factor** if borrowing
4. **Keep liquidation buffer** (>150% collateral ratio)
5. **Withdraw rewards regularly**

### Yield Farming:

#### Risk Assessment:
- [ ] **Impermanent loss** potential
- [ ] **Smart contract risk** 
- [ ] **Token risk** (could token prices crash?)
- [ ] **Lock-up periods** and exit liquidity
- [ ] **Reward token sustainability**

#### Safe Farming Approach:
1. **Use stablecoin pairs** initially (USDC/DAI)
2. **Understand impermanent loss** calculator
3. **Diversify across protocols** (max 25% per protocol)
4. **Regular profit taking** (don't get greedy)
5. **Exit strategy planned** in advance

### Borrowing:

#### Before Borrowing:
- [ ] **Liquidation price** calculated
- [ ] **Interest rate stability** 
- [ ] **Collateral asset volatility**
- [ ] **Liquidation penalty** fees
- [ ] **Emergency repayment plan**

#### Safe Borrowing Rules:
1. **Never borrow more than 50%** of collateral value
2. **Use stable collateral** (ETH, BTC) when possible
3. **Monitor liquidation risk** daily
4. **Have repayment plan** before borrowing
5. **Keep emergency funds** for margin calls

## Gas Fee Management ⛽

### Understanding Gas:
- **Gas price**: How much you pay per unit of computation
- **Gas limit**: Maximum computation you're willing to pay for
- **Total fee**: Gas price × Gas used

### Gas Safety Rules:
✅ **Check gas tracker** before transactions (ethgasstation.info)
✅ **Use appropriate gas price** - not always fastest
✅ **Batch transactions** when possible to save fees
✅ **Avoid peak hours** (US market open/close)
✅ **Consider Layer 2** for smaller transactions

❌ **Never use default gas** without checking
❌ **Don't overpay** by 10x for "fast" when standard works
❌ **Don't under-pay** and get stuck transactions

## Token Approval Management 🔐

### Understanding Approvals:
When you interact with DeFi protocols, you often need to "approve" them to spend your tokens. This is powerful but dangerous.

### Safe Approval Practices:
1. **Limit approvals** to exact amounts needed
2. **Review approvals** monthly on Revoke.cash
3. **Revoke unused approvals** immediately
4. **Never approve unlimited** amounts for new protocols
5. **Check what you're approving** before confirming

### Approval Red Flags:
❌ **Unlimited approval** for unknown protocols
❌ **Approving more tokens** than you're using
❌ **Approval requests** for tokens you didn't select
❌ **Multiple approvals** for simple transactions

## Mistake Prevention Checklist ✅

### Before Every Transaction:
- [ ] **Double-check recipient** address
- [ ] **Verify token contracts** 
- [ ] **Confirm transaction amounts**
- [ ] **Check gas price** is reasonable
- [ ] **Understand what** you're signing
- [ ] **Have exit strategy** planned

### After Every Transaction:
- [ ] **Verify completion** on block explorer
- [ ] **Check wallet balances** match expectations
- [ ] **Disconnect wallet** from site
- [ ] **Document transaction** for taxes
- [ ] **Note any issues** for future reference

## Common Mistakes & How to Avoid Them 🚫

### Mistake 1: Sending to Wrong Address
❌ **Copy-paste malware** changes addresses
✅ **Always verify first/last 6 characters** of address
✅ **Send small test amount** first for new addresses
✅ **Use ENS names** when available

### Mistake 2: Infinite Approvals
❌ **Approving unlimited amounts** to save gas
✅ **Approve exact amounts** needed
✅ **Regular approval audits** on Revoke.cash

### Mistake 3: Not Understanding Slippage
❌ **Using default slippage** without thinking
✅ **Understand price impact** vs slippage
✅ **Adjust based on market conditions**

### Mistake 4: Overpaying Gas
❌ **Using "fast" gas** unnecessarily
✅ **Check gas tracker** before transactions
✅ **Batch multiple operations** when possible

### Mistake 5: Not Reading Transactions
❌ **Blindly clicking confirm** in MetaMask
✅ **Read every detail** before confirming
✅ **Use simulation tools** for complex transactions

## Emergency Procedures 🚨

### If Transaction is Stuck:
1. **Don't panic** - funds are safe
2. **Check gas price** vs network conditions
3. **Speed up transaction** in MetaMask (pay more gas)
4. **Or cancel transaction** (also requires gas)
5. **Wait if gas is too expensive** - transaction will eventually confirm or be dropped

### If You Made a Mistake:
1. **Stay calm** - many mistakes are recoverable
2. **Don't make more transactions** hastily
3. **Analyze what happened** using block explorer
4. **Seek help** in official protocol Discord/forums
5. **Learn from the mistake** to prevent repetition

## Risk Management Strategy 📊

### The 1% Rule:
Never risk more than 1% of your portfolio on:
- New protocols
- Experimental features
- High-risk yield farms
- Unaudited contracts

### The Testing Ladder:
1. **First interaction**: Minimum amount possible
2. **Second interaction**: 10x first amount if successful
3. **Regular use**: Up to comfort level
4. **Major amounts**: Only after extensive testing

## Key Takeaway

Safe DeFi interaction isn't about avoiding all risks - it's about understanding and managing them. Start small, verify everything, and build confidence gradually.

**Remember**: In DeFi, there's no customer service to call if you make a mistake. Prevention is your only protection.

*Next: We'll cover what to do when things go wrong and how to recover from various situations.*`
        }
      },
      {
        id: "2-6",
        title: "When Things Go Wrong: Recovery & Emergency Response",
        type: "text",
        duration: 20,
        content: {
          text: `# When Things Go Wrong: Your Emergency Response Guide

Despite your best efforts, things can still go wrong in DeFi. Here's your complete guide to handling emergencies, recovering from mistakes, and protecting yourself when the unexpected happens.

## Emergency Classification System 🚨

### Level 1: Minor Issues (Fixable)
- Stuck transactions
- Wrong slippage settings
- Small overpayment of gas fees
- Accidentally connected to wrong network

### Level 2: Moderate Issues (Recoverable with effort)
- Sent tokens to wrong address (but recoverable)
- Impermanent loss from volatile farming
- Liquidation from borrowed positions
- Lost access to one wallet (but have backup)

### Level 3: Critical Issues (Potentially permanent loss)
- Compromise of seed phrase
- Interaction with malicious contract
- Phishing attack with signed transactions
- Lost seed phrase with no backup

## Level 1 Emergencies: Quick Fixes 🔧

### Stuck Transaction Resolution:

#### What Happened:
Your transaction has been pending for hours/days without confirming.

#### Why This Happens:
- Gas price too low for network conditions
- Network congestion
- Nonce errors

#### Fix Strategy:
1. **Check transaction status** on Etherscan
2. **Look at gas price** vs current network rates
3. **Choose your response**:

**Option A: Speed Up (Recommended)**
1. Open MetaMask
2. Find pending transaction
3. Click "Speed Up"
4. Increase gas price by 10-20%
5. Confirm new transaction

**Option B: Cancel Transaction**
1. Open MetaMask
2. Find pending transaction  
3. Click "Cancel"
4. Pay cancellation fee (same as speed up)
5. Try original transaction again with higher gas

**Option C: Wait It Out**
- Transactions eventually get dropped (24-48 hours)
- Your funds remain safe during this time
- Free but requires patience

### Wrong Network Connection:

#### What Happened:
You're connected to Polygon instead of Ethereum (or vice versa).

#### Fix Strategy:
1. **Check MetaMask network** in top-right
2. **Switch to correct network**:
   - Ethereum Mainnet
   - Polygon
   - Arbitrum
   - etc.
3. **Refresh the DeFi site**
4. **Verify you see correct balances**

## Level 2 Emergencies: Recovery Operations 🛠️

### Accidental Token Send:

#### What Happened:
You sent tokens to the wrong address.

#### Assessment Questions:
- Is it an exchange address? (Often recoverable)
- Is it a smart contract? (Check if it has recovery function)
- Is it another person's wallet? (Contact them if possible)
- Is it a dead address? (Usually unrecoverable)

#### Recovery Steps:
1. **Verify transaction** on block explorer
2. **Identify recipient address type**
3. **Contact recipient** if possible:
   - Exchange: Contact customer support with transaction hash
   - Known person: Reach out directly
   - Smart contract: Check documentation for recovery
4. **Document everything** for taxes (may be deductible loss)

### Liquidation Recovery:

#### What Happened:
Your collateral was liquidated in a lending protocol.

#### Immediate Response:
1. **Stop all borrowing activity**
2. **Calculate actual loss** (liquidation penalty + debt)
3. **Review what went wrong**:
   - Market volatility?
   - Insufficient monitoring?
   - Overleveraged position?

#### Recovery Strategy:
1. **Start smaller** next time
2. **Improve monitoring** (price alerts)
3. **Lower leverage ratios**
4. **Diversify collateral types**
5. **Learn from the experience**

### Impermanent Loss Mitigation:

#### What Happened:
Your liquidity pool lost value compared to holding tokens.

#### Response Strategy:
1. **Calculate actual loss** vs holding
2. **Consider exit timing**:
   - Wait for rebalancing if temporary
   - Exit if trend is permanent
3. **Claim any rewards** to offset loss
4. **Adjust strategy** for future:
   - Use more correlated pairs
   - Consider impermanent loss protection
   - Stick to stablecoin pairs

## Level 3 Emergencies: Crisis Management 💥

### Compromised Seed Phrase:

#### Immediate Actions (First 5 Minutes):
1. **STOP** - don't panic, act systematically
2. **Create new wallet** on different device
3. **Transfer ALL funds** to new wallet immediately
4. **Work fast** - assume attacker has access

#### Emergency Transfer Protocol:
1. **Prioritize by value**: Largest amounts first
2. **Use maximum gas** to ensure fast confirmation
3. **Don't worry about fees** - speed is critical
4. **Transfer everything** - even small amounts

#### Post-Emergency Actions:
1. **Never use old wallet** again
2. **Change all related passwords**
3. **Review how compromise occurred**
4. **Implement stronger security measures**
5. **Consider how to prevent recurrence**

### Malicious Contract Interaction:

#### What Happened:
You signed a transaction that gave a malicious contract access to your funds.

#### Immediate Response:
1. **Check Revoke.cash** immediately
2. **Revoke ALL approvals** for suspicious contracts
3. **Move remaining funds** to new wallet
4. **Check for ongoing drains**

#### Approval Revocation Steps:
1. Go to https://revoke.cash
2. Connect affected wallet
3. Review all approvals
4. Revoke any:
   - Unknown contracts
   - Unlimited approvals
   - Recently granted approvals
5. Pay gas fees to revoke (worth it for security)

### Phishing Attack Recovery:

#### Assessment Phase:
1. **What information was compromised?**
   - Seed phrase: Critical emergency
   - Private key: Critical emergency  
   - Password only: Moderate issue
   - Email access: High concern

#### Recovery Based on Compromise Level:

**If Seed Phrase Compromised:**
- Follow "Compromised Seed Phrase" protocol above
- Assume total compromise
- Start completely fresh

**If Passwords Compromised:**
- Change all crypto-related passwords immediately
- Enable 2FA everywhere possible
- Monitor accounts for suspicious activity
- Consider new email address for crypto

## Prevention vs Recovery 🛡️

### Why Prevention is Better:
- **Recovery often impossible** in DeFi
- **Time pressure** during emergencies leads to mistakes
- **Emotional stress** impairs decision-making
- **No customer service** to help you

### Building Your Emergency Kit:
1. **Emergency wallet** pre-setup with small amount of ETH for gas
2. **Emergency contacts** list (experienced crypto friends)
3. **Recovery procedures** written down and tested
4. **Backup access methods** for all accounts
5. **Emergency fund** separate from DeFi investments

## Post-Emergency Analysis 📊

### Questions to Ask Yourself:
1. **What exactly went wrong?**
2. **How could this have been prevented?**
3. **What warning signs did I miss?**
4. **What security measures failed?**
5. **How can I improve my setup?**

### Learning from Mistakes:
- **Document the incident** in detail
- **Share lessons** with trusted crypto community
- **Update security practices** based on learnings
- **Test new procedures** with small amounts
- **Regular security reviews** to prevent recurrence

## Emergency Contact Resources 📞

### Technical Support:
- **MetaMask**: help.metamask.io
- **Ledger**: support.ledger.com
- **Protocol Discord**: Official community channels
- **Etherscan**: For transaction verification

### Community Help:
- **Reddit**: r/ethereum, r/DeFi (be careful of scammers)
- **Discord**: Official protocol servers only
- **Twitter**: Verified accounts only

⚠️ **Warning**: Never trust unsolicited help or DMs claiming to offer assistance.

## Insurance & Loss Mitigation 🛡️

### DeFi Insurance Options:
- **Nexus Mutual**: Smart contract coverage
- **Cover Protocol**: Various DeFi risks
- **Unslashed Finance**: Validator and protocol coverage

### Consider Insurance For:
- Large positions in newer protocols
- Experimental yield farming
- Long-term staking positions
- Business-critical DeFi operations

## Psychological Aspects of Emergencies 🧠

### Emotional Management:
- **Don't panic** - panic leads to more mistakes
- **Take deep breaths** before acting
- **Think systematically** through the problem
- **Ask for help** from experienced users
- **Learn from the experience**

### Common Emotional Traps:
❌ **Revenge trading** after losses
❌ **Over-correcting** security measures
❌ **Avoiding DeFi** completely after bad experience
❌ **Blaming technology** instead of learning

✅ **Balanced response** to incidents
✅ **Continuous improvement** mindset
✅ **Appropriate risk-taking** after recovery
✅ **Knowledge sharing** with community

## Key Takeaway

Emergencies in DeFi are often more recoverable than they initially appear. The key is staying calm, acting systematically, and learning from the experience.

**Remember**: Every experienced DeFi user has made mistakes. The difference is they learned from them and improved their security practices. Your goal isn't to never make mistakes - it's to make smaller, recoverable ones and learn continuously.

*Congratulations! You've completed the DeFi Security course. You now have the knowledge and tools to navigate DeFi safely and handle emergencies when they arise.*`
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