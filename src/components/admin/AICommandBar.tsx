import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AICommandBarProps {
  onCommandExecuted: () => void;
}

export function AICommandBar({ onCommandExecuted }: AICommandBarProps) {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExecuteCommand = async () => {
    if (!command.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-command', {
        body: { command }
      });

      if (error) throw error;

      toast({
        title: "Command Executed",
        description: data.message || "AI command processed successfully",
      });

      setCommand("");
      onCommandExecuted();
    } catch (error: any) {
      console.error("Error executing AI command:", error);
      toast({
        title: "Command Failed",
        description: error.message || "Failed to execute command",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10" />
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExecuteCommand()}
          placeholder='Ask AI: "show weekly sales" or "resend all failed emails"'
          className="pl-11 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Button 
        onClick={handleExecuteCommand} 
        disabled={loading || !command.trim()}
        className="bg-gradient-to-r from-primary to-accent"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Execute"}
      </Button>
    </div>
  );
}
