import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminUploadContent = () => {
  
  const uploadSampleContent = async () => {
    try {
      // Create sample PDF content (as text for demo)
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
Decentralized Finance (DeFi) represents a paradigm shift in how we think about financial services...

[This would continue for 200+ pages with comprehensive content]

© 2024 3rdeyeadvisors - All rights reserved
      `;

      const portfolioTrackerContent = `
DeFi Portfolio Tracker Template - Instructions:

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

For support: info@3rdeyeadvisors.com
      `;

      // Upload files to storage
      const uploads = [
        {
          path: 'ebooks/defi-mastery-complete-guide.pdf',
          content: defiEbookContent,
          contentType: 'text/plain'
        },
        {
          path: 'ebooks/defi-quick-reference.pdf', 
          content: 'DeFi Quick Reference Card\n\nKey Terms:\n- APY: Annual Percentage Yield\n- TVL: Total Value Locked\n- IL: Impermanent Loss\n\n© 3rdeyeadvisors',
          contentType: 'text/plain'
        },
        {
          path: 'templates/defi-portfolio-tracker.xlsx',
          content: portfolioTrackerContent,
          contentType: 'text/plain'
        },
        {
          path: 'templates/portfolio-setup-guide.pdf',
          content: 'Portfolio Setup Guide\n\nStep 1: Download the template\nStep 2: Enter your wallet addresses\nStep 3: Start tracking positions\n\n© 3rdeyeadvisors',
          contentType: 'text/plain'
        },
        {
          path: 'guides/yield-farming-strategies.pdf',
          content: 'Yield Farming Strategy Guide\n\n10 Proven Strategies:\n1. Multi-Protocol Farming\n2. Liquidity Provision Strategy\n3. Governance Token Farming\n\n© 3rdeyeadvisors',
          contentType: 'text/plain'
        },
        {
          path: 'guides/roi-calculator.xlsx',
          content: 'ROI Calculator Template\n\nFormulas included for calculating:\n- Simple ROI\n- Compound returns\n- Risk-adjusted returns\n\n© 3rdeyeadvisors',
          contentType: 'text/plain'
        }
      ];

      for (const upload of uploads) {
        const { error } = await supabase.storage
          .from('digital-products')
          .upload(upload.path, upload.content, {
            contentType: upload.contentType,
            upsert: true
          });

        if (error) {
          console.error(`Error uploading ${upload.path}:`, error);
        }
      }

      toast.success('Sample content uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload content');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Upload Sample Content</h1>
      <p className="text-muted-foreground mb-4">
        This will upload sample content files to the digital-products storage bucket.
      </p>
      <Button onClick={uploadSampleContent}>
        Upload Sample Content
      </Button>
    </div>
  );
};

export default AdminUploadContent;