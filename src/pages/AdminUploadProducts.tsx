import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

interface UploadResult {
  fileName: string;
  success: boolean;
  error?: string;
}

const AdminUploadProducts = () => {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);

  const filesToUpload = [
    {
      localPath: "/resources/defi-portfolio-tracker.csv",
      fileName: "defi-portfolio-tracker.csv",
      contentType: "text/csv"
    },
    {
      localPath: "/resources/yield-farming-calculator.csv",
      fileName: "yield-farming-calculator.csv",
      contentType: "text/csv"
    }
  ];

  const uploadFiles = async () => {
    setUploading(true);
    setResults([]);
    const uploadResults: UploadResult[] = [];

    try {
      for (const file of filesToUpload) {
        try {
          // Fetch the file from public folder
          const response = await fetch(file.localPath);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }

          const blob = await response.blob();
          
          // Upload to Supabase Storage with correct content type
          const { data, error } = await supabase.storage
            .from('digital-products')
            .upload(file.fileName, blob, {
              contentType: file.contentType,
              upsert: true
            });

          if (error) {
            uploadResults.push({
              fileName: file.fileName,
              success: false,
              error: error.message
            });
          } else {
            uploadResults.push({
              fileName: file.fileName,
              success: true
            });
          }
        } catch (error) {
          uploadResults.push({
            fileName: file.fileName,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      setResults(uploadResults);
      
      const successCount = uploadResults.filter(r => r.success).length;
      const failCount = uploadResults.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
      }
      if (failCount > 0) {
        toast.error(`Failed to upload ${failCount} file(s)`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload process failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Admin - Upload Digital Products | 3rdeyeadvisors"
        description="Admin panel for uploading digital products to Supabase Storage"
      />
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-consciousness">
                Upload Digital Products
              </CardTitle>
              <CardDescription className="font-consciousness">
                Upload CSV files to Supabase Storage with correct MIME types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Files to Upload */}
              <div className="space-y-2">
                <h3 className="text-lg font-consciousness font-semibold">Files to Upload:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground font-consciousness">
                  {filesToUpload.map((file) => (
                    <li key={file.fileName} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {file.fileName} ({file.contentType})
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upload Button */}
              <Button
                onClick={uploadFiles}
                disabled={uploading}
                className="w-full font-consciousness"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Files to Storage
                  </>
                )}
              </Button>

              {/* Results */}
              {results.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-consciousness font-semibold">Upload Results:</h3>
                  
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <Card 
                        key={index}
                        className={`p-4 ${
                          result.success 
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-consciousness font-medium">
                              {result.fileName}
                            </p>
                            {result.error && (
                              <p className="text-sm text-red-600 dark:text-red-400 font-consciousness mt-1">
                                Error: {result.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="font-consciousness">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {results.filter(r => r.success).length} succeeded
                      </span>
                      {results.filter(r => !r.success).length > 0 && (
                        <>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-red-600 dark:text-red-400 font-semibold">
                            {results.filter(r => !r.success).length} failed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminUploadProducts;
