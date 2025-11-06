import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Calculator, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFile {
  id: string;
  product_id: number;
  file_name: string;
  file_type: string;
  description: string;
  file_path: string;
}

const TestDownloads = () => {
  const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const productInfo = {
    1: { title: "Complete DeFi Mastery eBook", icon: FileText, color: "bg-blue-500" },
    2: { title: "DeFi Portfolio Tracker Template", icon: Calculator, color: "bg-green-500" },
    3: { title: "Yield Farming Strategy Guide", icon: TrendingUp, color: "bg-purple-500" }
  };

  useEffect(() => {
    loadAllFiles();
  }, []);

  const loadAllFiles = async () => {
    try {
      const { data: filesData, error: filesError } = await supabase
        .from('digital_product_files')
        .select('*')
        .order('product_id');

      if (filesError) throw filesError;
      setProductFiles(filesData || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDownload = async (file: ProductFile) => {
    try {
      // First check if file exists in storage
      const { data: fileList, error: listError } = await supabase.storage
        .from('digital-products')
        .list(file.file_path.split('/').slice(0, -1).join('/'));

      if (listError) {
        toast.error(`Storage error: ${listError.message}`);
        return;
      }

      const fileName = file.file_path.split('/').pop();
      const fileExists = fileList?.some(f => f.name === fileName);

      if (!fileExists) {
        toast.error(`File ${fileName} not found in storage. Please upload content first.`);
        return;
      }

      // Generate a public URL for testing
      const { data: urlData } = await supabase.storage
        .from('digital-products')
        .createSignedUrl(file.file_path, 3600);

      if (urlData?.signedUrl) {
        // Open in new tab for testing
        window.open(urlData.signedUrl, '_blank');
        toast.success(`Opening ${file.file_name}...`);
      } else {
        toast.error('Failed to generate download URL');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('sheet') || fileType.includes('excel')) return Calculator;
    return FileText;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading files...</div>
      </div>
    );
  }

  // Group files by product
  const filesByProduct = productFiles.reduce((acc, file) => {
    if (!acc[file.product_id]) acc[file.product_id] = [];
    acc[file.product_id].push(file);
    return acc;
  }, {} as Record<number, ProductFile[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Downloads (Admin)</h1>
        <p className="text-muted-foreground">Test access to all digital product files</p>
      </div>

      <div className="grid gap-6">
        {Object.entries(filesByProduct).map(([productId, files]) => {
          const product = productInfo[parseInt(productId)];
          const IconComponent = product?.icon || FileText;

          return (
            <Card key={productId} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${product?.color || 'bg-primary'}`}>
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {product?.title || `Product ${productId}`}
                    </CardTitle>
                    <CardDescription>
                      Test downloads for this product
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.file_type);
                    
                    return (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.file_name}</p>
                            <p className="text-sm text-muted-foreground">{file.description}</p>
                            <p className="text-xs text-muted-foreground/70">Path: {file.file_path}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleTestDownload(file)}
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Test Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {productFiles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No files found in the database.</p>
          <p className="text-sm text-muted-foreground/80">Make sure the digital_product_files table has data.</p>
        </div>
      )}
    </div>
  );
};

export default TestDownloads;