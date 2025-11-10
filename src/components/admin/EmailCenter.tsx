import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, AlertCircle, Trophy, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import NewsletterSender from "@/components/admin/NewsletterSender";

export function EmailCenter() {
  const [emailStats, setEmailStats] = useState({ total: 0, sent: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [sendingRaffleEmail, setSendingRaffleEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEmailStats();
  }, []);

  const loadEmailStats = async () => {
    try {
      const { data, error } = await supabase
        .from("email_logs")
        .select("status")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        sent: data?.filter(e => e.status === "sent").length || 0,
        failed: data?.filter(e => e.status === "failed").length || 0
      };

      setEmailStats(stats);
    } catch (error) {
      console.error("Error loading email stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendRaffleAnnouncement = async () => {
    if (!confirm("Send raffle announcement to all subscribers?")) {
      return;
    }

    setSendingRaffleEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-raffle-announcement');

      if (error) throw error;

      toast({
        title: "Raffle Announcement Sent! 🎉",
        description: `Email sent to ${data.sent} subscribers`,
      });
    } catch (error: any) {
      console.error('Error sending raffle announcement:', error);
      toast({
        title: "Send Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingRaffleEmail(false);
    }
  };

  const resendFailedEmails = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-command', {
        body: { command: "resend all failed emails" }
      });

      if (error) throw error;

      toast({
        title: "Emails Resent",
        description: data.message || "Failed emails have been queued for resending",
      });

      loadEmailStats();
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <NewsletterSender />
      
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Raffle Announcement
          </CardTitle>
          <CardDescription>
            Send the raffle announcement email to all newsletter subscribers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={sendRaffleAnnouncement}
            disabled={sendingRaffleEmail}
            className="w-full"
            size="lg"
          >
            {sendingRaffleEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Raffle Announcement
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Total Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{emailStats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="h-4 w-4 text-green-500" />
              Successfully Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{emailStats.sent}</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{emailStats.failed}</p>
            {emailStats.failed > 0 && (
              <Button 
                onClick={resendFailedEmails}
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
              >
                Resend Failed
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Email Logs</CardTitle>
          <CardDescription>View detailed email history and logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => window.location.href = "/admin/email-logs"}
            variant="outline"
            className="w-full"
          >
            View Full Email Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
