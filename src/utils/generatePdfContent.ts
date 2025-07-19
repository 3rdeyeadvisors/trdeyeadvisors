import { supabase } from "@/integrations/supabase/client";

export const generateAllPdfContent = async () => {
  const types = ['comparison', 'risk-checklist', 'security-guide'] as const;
  const results = [];

  for (const type of types) {
    try {
      console.log(`Generating content for ${type}...`);
      
      const { data, error } = await supabase.functions.invoke('generate-pdf-content', {
        body: { 
          type,
          topic: type === 'comparison' ? 'DeFi vs Traditional Finance' :
                 type === 'risk-checklist' ? 'DeFi Risk Assessment' :
                 'DeFi Security Best Practices'
        }
      });

      if (error) {
        console.error(`Error generating ${type}:`, error);
        results.push({ type, error: error.message });
      } else {
        console.log(`Successfully generated ${type}`);
        results.push({ type, content: data.content });
      }
    } catch (err) {
      console.error(`Exception generating ${type}:`, err);
      results.push({ type, error: err.message });
    }
  }

  return results;
};

export const downloadPdf = (content: string, filename: string) => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      background: white;
      color: #333;
    }
    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; }
    h3 { color: #3730a3; }
    ul, ol { margin-left: 20px; }
    li { margin-bottom: 8px; }
    .checklist-item { margin: 10px 0; }
    .warning { background: #fef3cd; border: 1px solid #fde047; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .info { background: #dbeafe; border: 1px solid #60a5fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f8fafc; font-weight: bold; }
    @media print {
      body { margin: 0; padding: 15px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  ${content}
  <footer style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
    Generated on ${new Date().toLocaleDateString()} | DeFi Educational Resources
  </footer>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};