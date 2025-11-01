import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface DigitalDownload {
  id: string;
  product_name: string;
  download_token: string;
  expires_at: string;
  max_downloads: number;
  download_count: number;
  created_at: string;
}

const DownloadPortal = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [downloads, setDownloads] = useState<DigitalDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDownloads();
  }, [orderId]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user && !orderId) {
        setError("Please log in or use the link from your email");
        return;
      }

      let query = supabase
        .from('digital_downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderId) {
        query = query.eq('order_id', orderId);
      } else if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setDownloads(data || []);
    } catch (err: any) {
      console.error('Error fetching downloads:', err);
      setError(err.message);
      toast.error("Failed to load downloads");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (token: string, productName: string) => {
    const downloadUrl = `https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/download-digital-file?token=${token}`;
    window.open(downloadUrl, '_blank');
    toast.success(`Downloading ${productName}...`);
    
    // Refresh the list after download to update count
    setTimeout(() => fetchDownloads(), 2000);
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getRemainingDownloads = (download: DigitalDownload) => {
    return download.max_downloads - download.download_count;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-3">Your Digital Downloads</h1>
          <p className="text-muted-foreground text-lg">
            {orderId ? `Order #${orderId.substring(orderId.length - 8).toUpperCase()}` : 'All your digital products'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading your downloads...</p>
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : downloads.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No digital products found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check your email for the download link or contact support if you need assistance
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {downloads.map((download) => {
              const expired = isExpired(download.expires_at);
              const remaining = getRemainingDownloads(download);
              const canDownload = !expired && remaining > 0;

              return (
                <Card key={download.id} className={expired ? "opacity-60" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-4">
                      <span className="text-xl">{download.product_name}</span>
                      {canDownload && (
                        <Button
                          onClick={() => handleDownload(download.download_token, download.product_name)}
                          className="shrink-0"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Purchased on {format(new Date(download.created_at), 'PPP')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {expired ? "Expired" : "Expires"}
                          </p>
                          <p className={`text-sm ${expired ? "text-destructive" : "text-muted-foreground"}`}>
                            {format(new Date(download.expires_at), 'PPP')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Downloads Used</p>
                          <p className="text-sm text-muted-foreground">
                            {download.download_count} of {download.max_downloads}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canDownload ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-green-500">Available</p>
                              <p className="text-sm text-muted-foreground">
                                {remaining} download{remaining !== 1 ? 's' : ''} left
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            <div>
                              <p className="text-sm font-medium text-destructive">
                                {expired ? "Expired" : "Limit Reached"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {!canDownload && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {expired
                            ? "This download link has expired. Contact support@the3rdeyeadvisors.com for assistance."
                            : "You've reached the maximum number of downloads. Contact support@the3rdeyeadvisors.com if you need access again."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you're having trouble downloading your files or your download link has expired, please contact our support team:
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@the3rdeyeadvisors.com">
                Contact Support
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DownloadPortal;
