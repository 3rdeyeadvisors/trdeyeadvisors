import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Trophy, Users, Gift } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  prize_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  winner_user_id?: string;
}

interface Participant {
  user_id: string;
  entry_count: number;
  email: string;
  display_name: string;
}

const RaffleManager = () => {
  const { toast } = useToast();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "Bitcoin",
    prize_amount: "50",
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    is_active: false,
  });

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRaffles(data || []);
    } catch (error) {
      console.error('Error fetching raffles:', error);
      toast({
        title: "Error",
        description: "Failed to load raffles",
        variant: "destructive",
      });
    }
  };

  const fetchParticipants = async (raffleId: string) => {
    try {
      const { data, error } = await supabase
        .from('raffle_entries')
        .select(`
          user_id,
          entry_count,
          profiles!inner(display_name)
        `)
        .eq('raffle_id', raffleId);

      if (error) throw error;

      // Get emails from auth.users
      const userIds = data?.map(d => d.user_id) || [];
      const { data: emailsData } = await supabase.rpc('get_user_emails_with_profiles');

      const participantsWithEmails = data?.map(participant => {
        const userEmail = emailsData?.find((u: any) => u.user_id === participant.user_id);
        return {
          user_id: participant.user_id,
          entry_count: participant.entry_count,
          email: userEmail?.email || 'N/A',
          display_name: (participant.profiles as any)?.display_name || 'Anonymous',
        };
      }) || [];

      setParticipants(participantsWithEmails);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast({
        title: "Error",
        description: "Failed to load participants",
        variant: "destructive",
      });
    }
  };

  const handleCreateRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('raffles')
        .insert([{
          ...formData,
          prize_amount: parseFloat(formData.prize_amount),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Raffle created successfully",
      });

      fetchRaffles();
      setFormData({
        title: "",
        description: "",
        prize: "Bitcoin",
        prize_amount: "50",
        start_date: new Date().toISOString().slice(0, 16),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        is_active: false,
      });
    } catch (error) {
      console.error('Error creating raffle:', error);
      toast({
        title: "Error",
        description: "Failed to create raffle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRaffleStatus = async (raffleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('raffles')
        .update({ is_active: !currentStatus })
        .eq('id', raffleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Raffle ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchRaffles();
    } catch (error) {
      console.error('Error toggling raffle:', error);
      toast({
        title: "Error",
        description: "Failed to update raffle status",
        variant: "destructive",
      });
    }
  };

  const exportParticipants = () => {
    if (participants.length === 0) return;

    const csv = [
      ['Email', 'Display Name', 'Entry Count'],
      ...participants.map(p => [p.email, p.display_name, p.entry_count])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raffle-participants-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Raffle Manager</h2>
        <p className="text-muted-foreground">
          Manage Learn-to-Earn raffles and track participant progress
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">
            <Gift className="w-4 h-4 mr-2" />
            Create Raffle
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Trophy className="w-4 h-4 mr-2" />
            Manage Raffles
          </TabsTrigger>
          <TabsTrigger value="participants">
            <Users className="w-4 h-4 mr-2" />
            Participants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Raffle</CardTitle>
              <CardDescription>
                Set up a new Learn-to-Earn raffle campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRaffle} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Raffle Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Learn to Earn - Bitcoin Edition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the raffle and what participants need to do..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prize">Prize Type</Label>
                    <Input
                      id="prize"
                      value={formData.prize}
                      onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                      placeholder="Bitcoin, Ethereum, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prize_amount">Prize Amount ($)</Label>
                    <Input
                      id="prize_amount"
                      type="number"
                      value={formData.prize_amount}
                      onChange={(e) => setFormData({ ...formData, prize_amount: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Activate raffle immediately</Label>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Raffle"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Active & Past Raffles</CardTitle>
              <CardDescription>
                Manage raffle status and view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {raffles.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No raffles created yet
                  </p>
                ) : (
                  raffles.map((raffle) => (
                    <div key={raffle.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{raffle.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${raffle.prize_amount} {raffle.prize}
                          </p>
                        </div>
                        <Badge variant={raffle.is_active ? "default" : "secondary"}>
                          {raffle.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Ends: {new Date(raffle.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRaffleStatus(raffle.id, raffle.is_active)}
                        >
                          {raffle.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchParticipants(raffle.id)}
                        >
                          View Participants
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Raffle Participants</CardTitle>
                  <CardDescription>
                    View and export participant data
                  </CardDescription>
                </div>
                {participants.length > 0 && (
                  <Button variant="outline" onClick={exportParticipants}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Select a raffle from the Manage tab to view participants
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead className="text-right">Entries</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.user_id}>
                        <TableCell className="font-mono text-sm">
                          {participant.email}
                        </TableCell>
                        <TableCell>{participant.display_name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {participant.entry_count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RaffleManager;
