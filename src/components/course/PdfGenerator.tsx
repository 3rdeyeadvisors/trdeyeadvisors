import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PdfGeneratorProps {
  type: 'comparison' | 'risk-checklist' | 'security-guide';
  title: string;
  description: string;
}

export const PdfGenerator = ({ type, title, description }: PdfGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const { toast } = useToast();

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf-content', {
        body: { topic: 'defi', type }
      });

      if (error) {
        throw error;
      }

      setContent(data.content);
      toast({
        title: "Content Generated",
        description: "Factual content has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please check if Perplexity API key is configured.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePdf = () => {
    if (!content) return;

    // Create a simple PDF-like structure with the content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          ul, ol { margin-left: 20px; }
          .section { margin-bottom: 30px; }
          .highlight { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="content">
          ${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}
        </div>
        <div class="footer" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666;">
          <p>Generated on ${new Date().toLocaleDateString()} | DeFi Education Platform</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "The document has been downloaded as HTML (viewable in any browser).",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateContent} 
            disabled={isGenerating}
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Factual Content
              </>
            )}
          </Button>

          {content && (
            <Button onClick={generatePdf}>
              <Download className="w-4 h-4 mr-2" />
              Download Document
            </Button>
          )}
        </div>

        {content && (
          <div className="mt-4 p-4 bg-muted rounded-lg max-h-60 overflow-y-auto">
            <h4 className="font-medium mb-2">Generated Content Preview:</h4>
            <div className="text-sm whitespace-pre-wrap">{content.substring(0, 500)}...</div>
          </div>
        )}
      </div>
    </Card>
  );
};