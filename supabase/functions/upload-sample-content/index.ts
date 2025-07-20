import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create sample PDF content for DeFi eBook
    const defiEbookContent = `
# Complete DeFi Mastery eBook
## The Ultimate Guide to Decentralized Finance

### Table of Contents

1. Introduction to DeFi
2. Understanding Blockchain Fundamentals
3. Wallets and Security
4. Decentralized Exchanges (DEXs)
5. Lending and Borrowing Protocols
6. Yield Farming Strategies
7. Liquidity Mining
8. Risk Management
9. Advanced DeFi Protocols
10. Tax Considerations
11. Future of DeFi
12. Troubleshooting Common Issues

### Chapter 1: Introduction to DeFi

Decentralized Finance (DeFi) represents a paradigm shift in how we think about financial services. Unlike traditional finance, DeFi operates on blockchain networks, primarily Ethereum, without the need for traditional intermediaries like banks.

Key benefits of DeFi include:
- Permissionless access
- Transparency
- Global availability
- Programmable money
- Composability

### Chapter 2: Understanding Blockchain Fundamentals

Before diving into DeFi, it's crucial to understand the underlying blockchain technology...

[This would continue for 200+ pages with comprehensive content]

### Sample Yield Farming Strategy

1. Research protocols with high APY
2. Assess smart contract risks
3. Calculate impermanent loss potential
4. Diversify across multiple protocols
5. Monitor market conditions regularly

---

© 2024 3rdeyeadvisors - All rights reserved
This eBook contains proprietary information and strategies developed through extensive research and experience in the DeFi space.
    `.trim();

    // Create sample portfolio tracker CSV content
    const portfolioTrackerContent = `
Portfolio Tracker Template - Instructions:

This spreadsheet helps you track your DeFi positions across multiple protocols and chains.

Sheets included:
1. Dashboard - Overview of your entire portfolio
2. Positions - Individual protocol positions
3. Transactions - Historical transaction log
4. Yield Tracking - APY and rewards tracking
5. Risk Assessment - Risk scoring for each position

How to use:
1. Enter your wallet addresses in the Dashboard sheet
2. Log each DeFi position in the Positions sheet
3. Record all transactions in the Transactions sheet
4. Monitor yields in the Yield Tracking sheet
5. Assess risks using the Risk Assessment sheet

Formulas included:
- Total portfolio value calculation
- Profit/Loss tracking
- APY calculations
- Risk score calculations
- Auto-updating price feeds (requires API connection)

For support, contact: info@3rdeyeadvisors.com
    `.trim();

    // Upload sample files to storage
    const files = [
      {
        path: 'ebooks/defi-mastery-complete-guide.pdf',
        content: defiEbookContent,
        contentType: 'text/plain' // For demo purposes
      },
      {
        path: 'templates/defi-portfolio-tracker.xlsx',
        content: portfolioTrackerContent,
        contentType: 'text/plain' // For demo purposes
      },
      {
        path: 'guides/yield-farming-strategies.pdf',
        content: `
# Yield Farming Strategy Guide
## Advanced Strategies for Sustainable Yield Generation

### 10 Proven Strategies:

1. **Multi-Protocol Farming**
   - Diversify across Compound, Aave, Curve
   - Risk mitigation through protocol diversity

2. **Liquidity Provision Strategy**
   - Focus on stable pairs for lower IL risk
   - Target 15-25% APY consistently

3. **Governance Token Farming**
   - Participate in new protocol launches
   - Higher risk, higher reward potential

[Content continues with detailed strategies...]

© 2024 3rdeyeadvisors
        `.trim(),
        contentType: 'text/plain'
      }
    ];

    const uploadResults = [];

    for (const file of files) {
      const { data, error } = await supabaseClient.storage
        .from('digital-products')
        .upload(file.path, file.content, {
          contentType: file.contentType,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${file.path}:`, error);
      } else {
        uploadResults.push({ path: file.path, success: true });
        console.log(`Uploaded ${file.path} successfully`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Uploaded ${uploadResults.length} sample files`,
        files: uploadResults
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error uploading sample content:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});