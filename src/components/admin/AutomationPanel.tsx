import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AutomationPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const runAutomation = async (action: string) => {
    setLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-command', {
        body: { command: action }
      });

      if (error) throw error;

      toast({
        title: "Automation Complete",
        description: data.message || `Successfully executed: ${action}`,
      });
    } catch (error: any) {
      toast({
        title: "Automation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const automations = [
    { id: "resend-failed", label: "Resend All Failed Emails", action: "resend all failed emails" },
    { id: "weekly-report", label: "Generate Weekly Report", action: "generate weekly report" },
    { id: "sync-orders", label: "Sync Orders", action: "sync all orders" },
    { id: "backup-db", label: "Backup Database", action: "backup database" },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Automations
        </CardTitle>
        <CardDescription>Execute common administrative tasks with one click</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((auto) => (
          <Button
            key={auto.id}
            onClick={() => runAutomation(auto.action)}
            disabled={loading === auto.id}
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            {loading === auto.id ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Zap className="h-5 w-5" />
            )}
            <span>{auto.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
