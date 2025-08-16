import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calculator, TrendingUp, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

interface Purchase {
  id: string;
  product_id: number;
  purchase_date: string;
  amount_paid: number;
}

interface ProductFile {
  id: string;
  product_id: number;
  file_name: string;
  file_type: string;
  description: string;
}

const Downloads = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const productInfo = {
    1: { title: "Complete DeFi Mastery eBook", icon: FileText, color: "bg-blue-500" },
    2: { title: "DeFi Portfolio Tracker Template", icon: Calculator, color: "bg-green-500" },
    3: { title: "Yield Farming Strategy Guide", icon: TrendingUp, color: "bg-purple-500" }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to access your downloads");
      navigate('/auth');
      return;
    }
    
    setUser(user);
    loadUserPurchases();
  };

  const loadUserPurchases = async () => {
    try {
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('user_purchases')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (purchasesError) throw purchasesError;

      setPurchases(purchasesData || []);

      // Get files for purchased products
      if (purchasesData && purchasesData.length > 0) {
        const productIds = [...new Set(purchasesData.map(p => p.product_id))];
        
        const { data: filesData, error: filesError } = await supabase
          .from('digital_product_files')
          .select('*')
          .in('product_id', productIds)
          .order('product_id');

        if (filesError) throw filesError;
        setProductFiles(filesData || []);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
      toast.error('Failed to load your purchases');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('download-digital-product', {
        body: { fileId }
      });

      if (error) throw error;

      // Create download link
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${fileName}...`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download file');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('sheet') || fileType.includes('excel')) return Calculator;
    return Package;
  };

  if (isLoading) {
    return (
      <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your downloads...</div>
        </div>
      </>
    );
  }

  if (purchases.length === 0) {
    return (
      <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My Downloads</h1>
            <p className="text-muted-foreground mb-8">You haven't purchased any digital products yet.</p>
            <Button onClick={() => navigate('/store')}>
              Browse Store
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Group files by product
  const filesByProduct = productFiles.reduce((acc, file) => {
    if (!acc[file.product_id]) acc[file.product_id] = [];
    acc[file.product_id].push(file);
    return acc;
  }, {} as Record<number, ProductFile[]>);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">My Downloads</h2>
        <p className="text-muted-foreground">Access your purchased digital products</p>
      </div>

      <div className="grid gap-6">
        {purchases.map((purchase) => {
          const product = productInfo[purchase.product_id];
          const files = filesByProduct[purchase.product_id] || [];
          const IconComponent = product?.icon || Package;

          return (
            <Card key={purchase.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${product?.color || 'bg-gray-500'} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      {product?.title || `Product ${purchase.product_id}`}
                    </CardTitle>
                    <CardDescription>
                      Purchased on {new Date(purchase.purchase_date).toLocaleDateString()}
                      {purchase.amount_paid && (
                        <span className="ml-2">
                          • ${(purchase.amount_paid / 100).toFixed(2)}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Owned
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.file_type);
                    
                    return (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{file.file_name}</p>
                            <p className="text-sm text-muted-foreground">{file.description}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDownload(file.id, file.file_name)}
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    );
                  })}
                  
                  {files.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Files are being prepared for this product
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default Downloads;