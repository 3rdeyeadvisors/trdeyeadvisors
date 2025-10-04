import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UploadDigitalProducts() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = async () => {
    setUploading(true);
    setResults(null);
    
    try {
      toast.info("Starting file uploads to storage...");
      
      const { data, error } = await supabase.functions.invoke("upload-digital-products");
      
      if (error) {
        throw error;
      }
      
      setResults(data);
      
      if (data.summary.failed === 0) {
        toast.success(`Successfully uploaded all ${data.summary.succeeded} files!`);
      } else {
        toast.warning(
          `Uploaded ${data.summary.succeeded} files, ${data.summary.failed} failed`
        );
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Upload Digital Products
          </CardTitle>
          <CardDescription>
            Upload all digital product files to Supabase Storage bucket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              This will upload the following files to the 'digital-products' storage bucket:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>defi-mastery-complete-guide.pdf</li>
                <li>defi-portfolio-tracker.csv</li>
                <li>advanced-defi-strategies.pdf</li>
                <li>yield-farming-calculator.csv</li>
                <li>security-audit-checklist.pdf</li>
                <li>defi-comparison.pdf</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading Files...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files to Storage
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold text-lg">Upload Results</h3>
              
              <div className="grid gap-2">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Total Files:</span> {results.summary.total}
                  </p>
                  <p className="text-sm text-green-600">
                    <span className="font-medium">Succeeded:</span> {results.summary.succeeded}
                  </p>
                  <p className="text-sm text-red-600">
                    <span className="font-medium">Failed:</span> {results.summary.failed}
                  </p>
                </div>

                <div className="space-y-2">
                  {results.results.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.success
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm break-all">{result.file}</p>
                          {result.success ? (
                            <p className="text-xs text-green-700">
                              Uploaded to: {result.path}
                            </p>
                          ) : (
                            <p className="text-xs text-red-700">
                              Error: {result.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
