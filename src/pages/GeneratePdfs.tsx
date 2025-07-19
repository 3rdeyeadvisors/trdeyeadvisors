import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateAllPdfContent, downloadPdf } from '@/utils/generatePdfContent';
import { Loader2, Download, FileText } from 'lucide-react';

const GeneratePdfs = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    try {
      const results = await generateAllPdfContent();
      const content: {[key: string]: string} = {};
      
      results.forEach(result => {
        if (result.content) {
          content[result.type] = result.content;
        } else if (result.error) {
          toast({
            title: "Generation Error",
            description: `Failed to generate ${result.type}: ${result.error}`,
            variant: "destructive"
          });
        }
      });
      
      setGeneratedContent(content);
      
      if (Object.keys(content).length > 0) {
        toast({
          title: "Success!",
          description: `Generated ${Object.keys(content).length} PDF documents`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (type: string, content: string) => {
    const titles = {
      'comparison': 'DeFi-vs-Traditional-Finance',
      'risk-checklist': 'DeFi-Risk-Assessment-Checklist',
      'security-guide': 'DeFi-Security-Best-Practices'
    };
    downloadPdf(content, titles[type as keyof typeof titles] || type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generate DeFi Educational PDFs</h1>
        
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Generate All Documents</h2>
              <p className="text-muted-foreground">
                Create factual, up-to-date DeFi educational materials using AI research
              </p>
            </div>
            <Button 
              onClick={handleGenerateAll}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate All PDFs
                </>
              )}
            </Button>
          </div>
        </Card>

        {Object.keys(generatedContent).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Generated Documents</h2>
            
            {Object.entries(generatedContent).map(([type, content]) => {
              const titles = {
                'comparison': 'DeFi vs Traditional Finance',
                'risk-checklist': 'DeFi Risk Assessment Checklist', 
                'security-guide': 'DeFi Security Best Practices'
              };
              
              return (
                <Card key={type} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {titles[type as keyof typeof titles]}
                    </h3>
                    <Button 
                      onClick={() => handleDownload(type, content)}
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download HTML
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePdfs;