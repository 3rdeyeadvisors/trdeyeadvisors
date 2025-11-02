import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PrintifyProduct {
  printify_id: string;
  title: string;
  shop_id: string;
}

interface StripeProduct {
  id: string;
  name: string;
  metadata: {
    printify_product_id?: string;
    type?: string;
  };
}

interface Mismatch {
  stripe_product_id: string;
  stripe_product_name: string;
  printify_product_id: string;
  exists_in_printify: boolean;
}

export const PrintifyProductSync = () => {
  const [loading, setLoading] = useState(false);
  const [mismatches, setMismatches] = useState<Mismatch[]>([]);
  const [printifyProducts, setPrintifyProducts] = useState<PrintifyProduct[]>([]);

  const checkSync = async () => {
    setLoading(true);
    try {
      // Get all Printify products from our database
      const { data: dbProducts, error: dbError } = await supabase
        .from('printify_products')
        .select('printify_id, title, shop_id');

      if (dbError) throw dbError;

      setPrintifyProducts(dbProducts || []);
      const printifyIds = new Set(dbProducts?.map(p => p.printify_id) || []);

      // Get all Stripe products with Printify metadata
      // We'll need to call Stripe API through an edge function
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke(
        'check-printify-sync',
        { body: {} }
      );

      if (stripeError) throw stripeError;

      const stripeProducts: StripeProduct[] = stripeData?.products || [];
      
      // Find mismatches
      const foundMismatches: Mismatch[] = [];
      for (const product of stripeProducts) {
        if (product.metadata.type === 'printify' && product.metadata.printify_product_id) {
          const exists = printifyIds.has(product.metadata.printify_product_id);
          if (!exists) {
            foundMismatches.push({
              stripe_product_id: product.id,
              stripe_product_name: product.name,
              printify_product_id: product.metadata.printify_product_id,
              exists_in_printify: false
            });
          }
        }
      }

      setMismatches(foundMismatches);

      if (foundMismatches.length === 0) {
        toast.success("All Printify products are synced correctly!");
      } else {
        toast.warning(`Found ${foundMismatches.length} mismatched product(s)`);
      }
    } catch (error: any) {
      console.error("Error checking sync:", error);
      toast.error(error.message || "Failed to check product sync");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Printify Product Sync Checker</CardTitle>
        <CardDescription>
          Check if your Stripe products have valid Printify product IDs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkSync} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Sync Status
            </>
          )}
        </Button>

        {mismatches.length > 0 && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Product ID Mismatches Found</AlertTitle>
              <AlertDescription>
                The following Stripe products have Printify IDs that don't exist in your shop:
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              {mismatches.map((mismatch) => (
                <Card key={mismatch.stripe_product_id} className="p-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Stripe Product:</span> {mismatch.stripe_product_name}
                    </div>
                    <div>
                      <span className="font-semibold">Stripe Product ID:</span>{" "}
                      <code className="text-sm bg-muted px-1 py-0.5 rounded">
                        {mismatch.stripe_product_id}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold">Invalid Printify ID:</span>{" "}
                      <code className="text-sm bg-destructive/20 px-1 py-0.5 rounded">
                        {mismatch.printify_product_id}
                      </code>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      This product needs to be re-synced from Printify or removed from Stripe
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertTitle>How to Fix</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>1. Go to Printify and verify these products exist in your shop</p>
                <p>2. Use the "Sync Printify Products" button to refresh your product list</p>
                <p>3. Update the Stripe product metadata with the correct Printify product ID</p>
                <p>4. Or delete the Stripe products that no longer have matching Printify products</p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {printifyProducts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">
              Valid Printify Products in Your Shop ({printifyProducts.length}):
            </h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {printifyProducts.map((product) => (
                <div key={product.printify_id} className="text-sm p-2 bg-muted rounded">
                  <div className="font-medium">{product.title}</div>
                  <code className="text-xs">{product.printify_id}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
