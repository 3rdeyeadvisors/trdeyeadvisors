import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Webhook, CheckCircle, AlertCircle } from "lucide-react";

export const PrintifyWebhookSetup = () => {
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const registerWebhook = async () => {
    setIsRegistering(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('register-printify-webhook');
      
      if (fnError) throw fnError;
      
      if (data?.success) {
        setWebhooks(data.webhooks || []);
        toast({
          title: "Webhooks Registered",
          description: data.message || "Printify webhooks configured successfully!",
        });
        
        if (data.errors?.length > 0) {
          console.warn('Some webhooks failed:', data.errors);
        }
      } else {
        throw new Error(data?.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error("Error registering webhook:", err);
      setError(err.message || "Failed to register webhook");
      toast({
        title: "Error",
        description: err.message || "Failed to register Printify webhook",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-primary" />
          <CardTitle>Printify Webhook Setup</CardTitle>
        </div>
        <CardDescription>
          Register webhooks to receive shipping updates and order notifications from Printify
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>This will register webhooks for:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Order created</li>
            <li>Order updated</li>
            <li>Shipment created (tracking info)</li>
            <li>Shipment delivered</li>
            <li>Order sent to production</li>
          </ul>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {webhooks.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Registered Webhooks:</p>
            <div className="flex flex-wrap gap-2">
              {webhooks.map((wh, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {wh.topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={registerWebhook} 
          disabled={isRegistering}
          className="w-full"
        >
          {isRegistering ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Registering Webhooks...
            </>
          ) : (
            <>
              <Webhook className="h-4 w-4 mr-2" />
              Register Printify Webhooks
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
