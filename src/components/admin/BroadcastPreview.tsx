import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Send, CheckCircle2, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BroadcastEmail {
  id: string;
  day_type: string;
  subject_line: string;
  intro_text: string;
  market_block: string;
  cta_link: string;
  scheduled_for: string;
  sent_at: string | null;
}

export function BroadcastPreview() {
  const [broadcasts, setBroadcasts] = useState<BroadcastEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastEmail | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingBroadcasts();
  }, []);

  const loadPendingBroadcasts = async () => {
    try {
      const { data, error } = await supabase
        .from("broadcast_email_queue")
        .select("*")
        .is("sent_at", null)
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      setBroadcasts(data || []);
    } catch (error) {
      console.error("Error loading broadcasts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBroadcast = async (id: string) => {
    if (!confirm("Are you sure you want to delete this broadcast?")) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("broadcast_email_queue")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Broadcast Deleted",
        description: "The broadcast has been removed from the queue",
      });

      loadPendingBroadcasts();
    } catch (error: any) {
      console.error("Error deleting broadcast:", error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const generateEmailHTML = (broadcast: BroadcastEmail) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${broadcast.subject_line}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #e5e5e5;
          background-color: #0a0a0a;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #1a1a1a;
          border: 1px solid #2a2a2a;
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 30px;
        }
        .intro {
          font-size: 16px;
          margin-bottom: 25px;
          color: #d1d5db;
        }
        .market-block {
          background-color: #0f172a;
          border-left: 4px solid #6366f1;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .cta {
          text-align: center;
          margin: 30px 0;
        }
        .cta a {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .footer {
          background-color: #0a0a0a;
          padding: 25px 30px;
          text-align: center;
          font-size: 13px;
          color: #9ca3af;
          border-top: 1px solid #2a2a2a;
        }
        .footer a {
          color: #6366f1;
          text-decoration: none;
        }
        .disclaimer {
          margin-top: 15px;
          font-size: 12px;
          color: #6b7280;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>3rdeyeadvisors</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">DeFi Education & Insights</p>
        </div>
        
        <div class="content">
          <div class="intro">
            ${broadcast.intro_text}
          </div>
          
          <div class="market-block">
            ${broadcast.market_block}
          </div>
          
          <div class="cta">
            <a href="${broadcast.cta_link}">Learn More on 3rdeyeadvisors</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>3rdeyeadvisors</strong> | DeFi Education Platform</p>
          <p>
            <a href="https://the3rdeyeadvisors.com">Visit Website</a> | 
            <a href="https://the3rdeyeadvisors.com/courses">View Courses</a>
          </p>
          <p class="disclaimer">
            Educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const getDayTypeColor = (dayType: string) => {
    switch (dayType.toLowerCase()) {
      case 'monday':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'wednesday':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'friday':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayBroadcasts = broadcasts.filter(b => b.scheduled_for === today);
  const upcomingBroadcasts = broadcasts.filter(b => b.scheduled_for > today);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Market Data Broadcasts
        </CardTitle>
        <CardDescription>
          Preview and manage scheduled market update emails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {broadcasts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No broadcasts scheduled</p>
          </div>
        ) : (
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today">
                Today {todayBroadcasts.length > 0 && `(${todayBroadcasts.length})`}
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming {upcomingBroadcasts.length > 0 && `(${upcomingBroadcasts.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-3">
              {todayBroadcasts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No broadcasts scheduled for today
                </div>
              ) : (
                todayBroadcasts.map((broadcast) => (
                  <Card key={broadcast.id} className="border-green-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getDayTypeColor(broadcast.day_type)}>
                              {broadcast.day_type}
                            </Badge>
                            <Badge variant="outline" className="border-green-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                              Ready to Send
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-lg">{broadcast.subject_line}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Scheduled: {new Date(broadcast.scheduled_for).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setSelectedBroadcast(broadcast)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{broadcast.subject_line}</DialogTitle>
                            <DialogDescription>
                              Scheduled for {broadcast.day_type} - {new Date(broadcast.scheduled_for).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div 
                            className="border rounded-lg p-4 bg-[#0a0a0a]"
                            dangerouslySetInnerHTML={{ __html: generateEmailHTML(broadcast) }}
                          />
                        </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteBroadcast(broadcast.id)}
                          disabled={deletingId === broadcast.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-3">
              {upcomingBroadcasts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No upcoming broadcasts scheduled
                </div>
              ) : (
                upcomingBroadcasts.map((broadcast) => (
                  <Card key={broadcast.id} className="border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getDayTypeColor(broadcast.day_type)}>
                              {broadcast.day_type}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-lg">{broadcast.subject_line}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Scheduled: {new Date(broadcast.scheduled_for).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setSelectedBroadcast(broadcast)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{broadcast.subject_line}</DialogTitle>
                              <DialogDescription>
                                Scheduled for {broadcast.day_type} - {new Date(broadcast.scheduled_for).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div 
                              className="border rounded-lg p-4 bg-[#0a0a0a]"
                              dangerouslySetInnerHTML={{ __html: generateEmailHTML(broadcast) }}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteBroadcast(broadcast.id)}
                          disabled={deletingId === broadcast.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
