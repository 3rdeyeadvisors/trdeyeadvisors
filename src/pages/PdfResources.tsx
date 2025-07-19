import Layout from '@/components/Layout';
import { PdfGenerator } from '@/components/course/PdfGenerator';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const PdfResources = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">DeFi Educational Resources</h1>
        <p className="text-muted-foreground">
          Generate factual, up-to-date educational materials about DeFi using AI-powered research.
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          These documents are generated using current data and research. Make sure the Perplexity API key is configured in Supabase Edge Functions for content generation.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <PdfGenerator
          type="comparison"
          title="DeFi vs Traditional Finance"
          description="Comprehensive comparison including metrics, fees, accessibility, and real-world examples."
        />

        <PdfGenerator
          type="risk-checklist"
          title="DeFi Risk Assessment Checklist"
          description="Complete checklist covering smart contract risks, security practices, and due diligence steps."
        />

        <PdfGenerator
          type="security-guide"
          title="DeFi Security Best Practices"
          description="Detailed security guide with wallet protection, phishing prevention, and emergency procedures."
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">How to Use These Resources</h2>
        <div className="space-y-3 text-sm">
          <p><strong>1. Generate Content:</strong> Click "Generate Factual Content" to create up-to-date information using AI research.</p>
          <p><strong>2. Review:</strong> Preview the generated content to ensure it meets your needs.</p>
          <p><strong>3. Download:</strong> Save the document as HTML for easy viewing and printing.</p>
          <p><strong>4. Share:</strong> Use these resources in your DeFi education or personal learning.</p>
        </div>
      </Card>
    </div>
  );
};

export default PdfResources;