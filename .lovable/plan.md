

# New Course: Tokenizing Real World Assets (RWA) - Complete Guide

## Overview

Creating **Course 6: "Tokenizing Real World Assets: From Traditional Finance to Blockchain"** - a comprehensive educational course covering how blockchain technology is transforming real estate, treasuries, commodities, and other tangible assets into tradeable digital tokens. This course was requested by the community through the Platform Roadmap and has received sufficient votes for implementation.

This course explains the rapidly growing RWA sector ($30+ billion in tokenized assets), covering major players like BlackRock BUIDL, Ondo Finance, and Centrifuge, while teaching students how to evaluate RWA investment opportunities safely.

**Access Model:**
- **Premium Members** (Founding 33, Annual Subscribers, Founders, Grandfathered, Admins): Immediate access starting today
- **All Other Users**: 7-day countdown timer showing "Coming Soon" until February 7, 2026

---

## Build Error Fix (Required First)

**File**: `supabase/functions/delete-inactive-accounts/index.ts`

Update Line 3 from:
```typescript
import { Resend } from "npm:resend@2.0.0";
```
To:
```typescript
import { Resend } from "https://esm.sh/resend@2.0.0";
```

This aligns with the project's established ESM import pattern for Deno edge functions.

---

## Premium Access Logic Fix

**Files**: `src/pages/Courses.tsx` (Line 27) and `src/pages/CourseDetail.tsx` (Line 42)

Update the `isAnnualSubscriber` check to include all premium member types:

**From**:
```typescript
const isAnnualSubscriber = subscription?.plan === 'annual' || subscription?.isAdmin;
```

**To**:
```typescript
const isPremiumMember = 
  subscription?.plan === 'annual' || 
  subscription?.plan === 'founding_33' ||
  subscription?.isFounder ||
  subscription?.isAdmin ||
  subscription?.isGrandfathered;
```

Also update all references from `isAnnualSubscriber` to `isPremiumMember` in these files.

---

## Course Structure

### Course Metadata
| Field | Value |
|-------|-------|
| **ID** | 6 |
| **Title** | Tokenizing Real World Assets: From Traditional Finance to Blockchain |
| **Description** | Discover how blockchain technology is transforming real estate, treasuries, commodities, and infrastructure into tradeable digital tokens. Learn about fractional ownership, evaluate RWA protocols, and understand the regulatory landscape shaping the $30+ billion tokenization market. This course was created based on community voting through our Platform Roadmap. |
| **Category** | free |
| **Difficulty** | Intermediate |
| **Estimated Time** | 2.5 hours |
| **Early Access Date** | 2026-01-31T00:00:00.000Z |
| **Public Release Date** | 2026-02-07T00:00:00.000Z |

---

## 5-Module Curriculum

### Module 6-1: What is Asset Tokenization? (25 min)

**Learning Objectives:**
- Define tokenization and understand its core mechanics
- Distinguish between security tokens and utility tokens
- Learn essential terminology (SPV, fractionalization, on-chain settlement)
- Understand why tokenization matters for financial accessibility

**Content Highlights:**
- Simple analogy: Tokenization is like turning a painting into puzzle pieces that anyone can own
- The $30+ billion RWA market explained
- How smart contracts enable fractional ownership
- Real-world example: Tokenizing a $10 million building into 10,000 tokens

**Quiz**: 5 questions covering definitions and core concepts

---

### Module 6-2: Types of Real World Assets Being Tokenized (30 min)

**Learning Objectives:**
- Identify the major asset classes being tokenized
- Understand which assets have achieved product-market fit
- Learn about leading protocols for each asset type

**Content Sections:**

1. **U.S. Treasuries & Government Bonds**
   - BlackRock BUIDL (largest tokenized treasury fund)
   - Ondo Finance (OUSG, USDY products)
   - Franklin Templeton's BENJI
   - Why treasuries dominate: Safety + yield + liquidity

2. **Private Credit & Lending**
   - Maple Finance institutional lending
   - Centrifuge real-world credit pools
   - Tradable structured products

3. **Commodities**
   - Tokenized gold (Matrixdock XAUm - $45M+ market value)
   - Paxos Gold (PAXG)
   - Agricultural and energy tokenization emerging

4. **Real Estate**
   - RealtyX tokenized properties
   - Fractional commercial real estate
   - REIT tokenization

5. **Equities & Funds**
   - Securitize MI4 fund
   - Ondo Global Markets
   - Institutional fund tokenization (Centrifuge JAAA)

**Comparison Table**: Asset types, leading protocols, typical yields, risk levels

**Quiz**: 5 questions on asset types and protocols

---

### Module 6-3: How RWA Tokenization Works (30 min)

**Learning Objectives:**
- Understand the technical process of tokenizing assets
- Learn about the legal structures (SPVs, trusts)
- Understand how oracles bridge real-world data to blockchain
- Know how redemption and settlement work

**Content Sections:**

1. **The Tokenization Process**
   - Step 1: Asset selection and legal structuring
   - Step 2: SPV (Special Purpose Vehicle) creation
   - Step 3: Smart contract deployment
   - Step 4: Token issuance and distribution
   - Step 5: Secondary market trading
   - Step 6: Redemption for underlying asset

2. **Legal Structures Explained**
   - What is an SPV and why it matters
   - Custody arrangements and proof of reserves
   - Regulatory compliance (SEC, MiCA)

3. **Oracle Integration**
   - How Chainlink connects real-world prices
   - Proof of reserves verification
   - NAV (Net Asset Value) updates

4. **Major RWA Platforms Deep-Dive**
   - Ondo Finance: Treasury and bond tokenization
   - Centrifuge: Credit and invoice financing
   - Maple Finance: Institutional lending
   - Securitize: Full-service tokenization platform

**Step Block**: Complete tokenization lifecycle

**Quiz**: 5 questions on technical mechanics

---

### Module 6-4: Evaluating RWA Investment Opportunities (25 min)

**Learning Objectives:**
- Develop a due diligence framework for RWA tokens
- Identify red flags and warning signs
- Understand yield sources and sustainability
- Assess regulatory and counterparty risks

**Content Sections:**

1. **Due Diligence Framework**
   - Verify underlying asset exists (proof of reserves)
   - Research the issuing entity and team
   - Understand the legal structure and jurisdiction
   - Check audit history and security practices
   - Analyze fee structure transparency

2. **Understanding Yield Sources**
   - Treasury yields (bond interest)
   - Rental income (real estate)
   - Loan interest (private credit)
   - Trading spreads (commodities)
   - Beware: Unsustainable token emission yields

3. **Risk Assessment**
   - Counterparty risk (issuer could fail)
   - Regulatory risk (changing laws)
   - Liquidity risk (can you exit easily?)
   - Smart contract risk (code vulnerabilities)
   - Oracle risk (data accuracy)

4. **Red Flags to Watch**
   - No proof of reserves or third-party audits
   - Unclear legal structure
   - Unrealistic yield promises
   - Anonymous teams
   - No regulatory clarity
   - Limited liquidity or exit options

**Key Questions Before Investing Checklist**

**Quiz**: 5 questions on due diligence and risk assessment

---

### Module 6-5: The Future of Tokenization & Getting Started (25 min)

**Learning Objectives:**
- Understand market growth projections
- Learn about institutional adoption trends
- Navigate regulatory developments
- Know how to safely get started with RWA investing

**Content Sections:**

1. **Market Size & Growth**
   - Current: $30+ billion in tokenized assets
   - 224% sector growth since 2024
   - Boston Consulting Group projection: $16 trillion by 2030
   - BlackRock CEO Larry Fink: "Tokenization is the next evolution of markets"

2. **Institutional Adoption**
   - BlackRock's BUIDL fund success
   - Goldman Sachs digital assets division
   - JPMorgan's Onyx platform
   - Singapore's Project Guardian
   - Why institutions are leading adoption

3. **Regulatory Landscape**
   - U.S. SEC approach to security tokens
   - EU MiCA regulations
   - Singapore's progressive framework
   - What regulatory clarity means for investors

4. **Getting Started Safely**
   - Start with established, audited protocols
   - Begin with tokenized treasuries (lowest risk)
   - Use small amounts while learning
   - Verify proof of reserves before investing
   - Understand your jurisdiction's regulations

5. **Course Completion Summary**
   - Key takeaways from all 5 modules
   - Resources for continued learning
   - Community discussion and Q&A

**Quiz**: 5 questions on future trends and safe practices

---

## Content Components Used

Each module will include the established course component patterns:

| Component | Purpose |
|-----------|---------|
| `KEY_TAKEAWAY` | Essential concepts to remember |
| `STEP_BLOCK` | Process explanations (tokenization lifecycle) |
| `COMPARISON_TABLE` | RWA types, Traditional vs Tokenized comparisons |
| `DID_YOU_KNOW` | Market statistics and interesting facts |
| `ALERT` (warning) | Risk disclaimers and regulatory notices |
| `ALERT` (info) | Tips and best practices |

---

## Quiz Structure (25 Total Questions)

Each module contains 5 questions following the established pattern:

| Module | Questions | Focus Areas |
|--------|-----------|-------------|
| 6-1 | 5 | Definitions, terminology, basics |
| 6-2 | 5 | Asset types, protocols, market fit |
| 6-3 | 5 | Technical mechanics, legal structures |
| 6-4 | 5 | Due diligence, risk assessment |
| 6-5 | 5 | Market trends, getting started |

**Quiz Settings:**
- Passing score: 70%
- Time limit: 10 minutes per module quiz
- Max attempts: 3
- Points: 10-15 per question
- Explanations provided for all answers

---

## Financial Disclaimers (App Store Compliant)

Every module includes appropriate disclaimers:

- "This course is for educational purposes only and does not constitute financial advice"
- "RWA investments carry risks including potential loss of principal"
- "Past performance does not guarantee future results"
- "Regulatory status of tokenized securities varies by jurisdiction"
- "Always conduct your own research before investing"

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/delete-inactive-accounts/index.ts` | Fix Resend import (Line 3) |
| `src/pages/Courses.tsx` | Add Course 6 to rawCourses array, fix premium member check |
| `src/pages/CourseDetail.tsx` | Fix premium member check to include Founding 33 |
| `src/data/courseContent.ts` | Add complete Course 6 with 5 modules and quizzes |

---

## Implementation Order

1. Fix Edge Function build error (Resend import)
2. Update premium member detection in Courses.tsx
3. Update premium member detection in CourseDetail.tsx
4. Add Course 6 metadata to Courses.tsx rawCourses array
5. Add complete Course 6 content to courseContent.ts (all 5 modules)
6. Deploy edge function and verify build success

---

## Post-Implementation

After course creation:
- The roadmap item should be updated to "completed" status
- Premium members will see immediate access
- Non-premium users will see a 7-day countdown timer
- Course will appear in the Courses page with "Early Access" badge for premium members

