import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export const ProductCleanup = () => {
  const [loading, setLoading] = useState(false);

  const handleCleanup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-old-products');

      if (error) throw error;

      toast.success(`Cleaned up ${data.deactivated_count} old products`);
      console.log("Active products:", data.active_products);
    } catch (error: any) {
      console.error("Error cleaning up products:", error);
      toast.error(error.message || "Failed to clean up products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Database Cleanup</CardTitle>
        <CardDescription>
          Remove old products from previous shop connections to prevent wasted API calls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleCleanup} disabled={loading} variant="destructive">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cleaning...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Clean Up Old Products
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
