import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ProductManager() {
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const handleCleanupMerchandise = async () => {
    if (!confirm("This will delete ALL merchandise except the Decentralize Everything Tee. Are you sure?")) {
      return;
    }

    setIsCleaningUp(true);
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-printify-products');
      
      if (error) throw error;

      toast.success(data.message || "Merchandise cleanup complete");
      console.log("Remaining products:", data.remainingProducts);
    } catch (error: any) {
      console.error("Error cleaning up merchandise:", error);
      toast.error(error.message || "Failed to clean up merchandise");
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product & Course Management
          </CardTitle>
          <CardDescription>Manage digital products, courses, and merchandise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => window.location.href = "/admin/store"}
            variant="outline"
            className="w-full"
          >
            Open Store Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/admin/upload"}
            variant="outline"
            className="w-full"
          >
            Upload Course Content
          </Button>

          <Button 
            onClick={() => window.location.href = "/admin/upload-products"}
            variant="outline"
            className="w-full"
          >
            Upload Digital Products
          </Button>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleCleanupMerchandise}
              variant="destructive"
              className="w-full"
              disabled={isCleaningUp}
            >
              {isCleaningUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cleaning Up...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cleanup Merchandise (Keep Decentralize Tee Only)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
