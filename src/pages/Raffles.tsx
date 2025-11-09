import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Ticket, Trophy, Share2, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import RaffleCountdown from "@/components/raffles/RaffleCountdown";
import RaffleShareButton from "@/components/raffles/RaffleShareButton";

interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  prize_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface TaskCompletion {
  [key: string]: boolean;
}

const TASKS = [
  { id: 'instagram_follow', label: 'Follow our Instagram: @3rdeyeadvisors', link: 'https://instagram.com/3rdeyeadvisors', entries: 1 },
  { id: 'instagram_share', label: 'Share any post from Instagram', entries: 1 },
  { id: 'x_follow', label: 'Follow our X page: @3rdeyeadvisors', link: 'https://x.com/3rdeyeadvisors', entries: 1 },
  { id: 'x_retweet', label: 'Retweet any tweet from X', entries: 1 },
  { id: 'newsletter', label: 'Subscribe to the newsletter', entries: 1, auto: true },
  { id: 'account', label: 'Have a registered user account', entries: 1, auto: true },
  { id: 'course_foundations', label: 'Complete "DeFi Foundations" course', entries: 1, auto: true },
  { id: 'course_safety', label: 'Complete "Staying Safe with DeFi" course', entries: 1, auto: true },
  { id: 'rating', label: 'Rate a course 5 stars', entries: 1, auto: true },
  { id: 'discussion', label: 'Post in course discussion section', entries: 1, auto: true },
];

const Raffles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeRaffle, setActiveRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskCompletion, setTaskCompletion] = useState<TaskCompletion>({});
  const [totalEntries, setTotalEntries] = useState(0);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    fetchActiveRaffle();
    if (user) {
      fetchUserProgress();
      fetchReferralCount();
    }
  }, [user]);

  const fetchActiveRaffle = async () => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setActiveRaffle(data);
    } catch (error) {
      console.error('Error fetching raffle:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!activeRaffle || !user) return;

    try {
      // Fetch task completion
      const { data: tasks } = await supabase
        .from('raffle_tasks')
        .select('task_type, completed')
        .eq('raffle_id', activeRaffle.id)
        .eq('user_id', user.id);

      const completion: TaskCompletion = {};
      tasks?.forEach(task => {
        completion[task.task_type] = task.completed;
      });
      setTaskCompletion(completion);

      // Fetch entry count
      const { data: entry } = await supabase
        .from('raffle_entries')
        .select('entry_count')
        .eq('raffle_id', activeRaffle.id)
        .eq('user_id', user.id)
        .single();

      setTotalEntries(entry?.entry_count || 0);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchReferralCount = async () => {
    if (!user) return;

    try {
      const { count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id)
        .eq('bonus_awarded', true);

      setReferralCount(count || 0);
    } catch (error) {
      console.error('Error fetching referral count:', error);
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    if (!user || !activeRaffle) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to participate in raffles.",
        variant: "destructive",
      });
      return;
    }

    const task = TASKS.find(t => t.id === taskId);
    if (!task) return;

    const newValue = !taskCompletion[taskId];

    try {
      const { error } = await supabase
        .from('raffle_tasks')
        .upsert({
          raffle_id: activeRaffle.id,
          user_id: user.id,
          task_type: taskId,
          completed: newValue,
          verified_at: newValue ? new Date().toISOString() : null,
        }, {
          onConflict: 'raffle_id,user_id,task_type'
        });

      if (error) throw error;

      setTaskCompletion(prev => ({ ...prev, [taskId]: newValue }));

      // Update entry count
      const newEntries = totalEntries + (newValue ? task.entries : -task.entries);
      await supabase
        .from('raffle_entries')
        .upsert({
          raffle_id: activeRaffle.id,
          user_id: user.id,
          entry_count: Math.max(0, newEntries),
        }, {
          onConflict: 'raffle_id,user_id'
        });

      setTotalEntries(Math.max(0, newEntries));

      toast({
        title: newValue ? "Task Completed!" : "Task Unchecked",
        description: newValue 
          ? `You earned ${task.entries} ${task.entries === 1 ? 'entry' : 'entries'}!`
          : `${task.entries} ${task.entries === 1 ? 'entry' : 'entries'} removed.`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Learn to Earn Raffles - The3rdEyeAdvisors"
        description="Participate in our Learn-to-Earn raffles. Complete educational tasks and earn entries to win crypto rewards. Awareness = Advantage."
        keywords="defi raffles, crypto giveaway, learn to earn, bitcoin rewards, defi education"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ticket className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Learn to Earn</h1>
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-xl text-muted-foreground">The Raffle Portal</p>
        </div>

        {/* Philosophy Section */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg mb-4">
                At <span className="font-semibold text-primary">3rdeyeadvisors</span>, we believe in <span className="font-semibold">earning after learning</span> — returning that energy back to you.
              </p>
              
              <p className="text-lg mb-4">
                This isn't just another giveaway. <span className="font-semibold">It's a challenge to grow.</span>
              </p>

              <p className="text-lg mb-4">
                What we don't want are individuals afraid to take the next step in life. You lose nothing by learning — but you gain everything:
              </p>

              <ul className="space-y-2 mb-4 list-disc list-inside text-muted-foreground">
                <li>The foundation to become your own bank</li>
                <li>A financial system with no geographical discrimination</li>
                <li>The ability to invest on a larger scale</li>
                <li>Ownership of your own digital assets</li>
                <li>Access to a global community of thinkers, learners, and builders</li>
              </ul>

              <p className="text-lg font-semibold text-primary">
                Keep learning. Keep sharing. Keep growing the decentralized movement.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Raffle or Closed Message */}
        {!activeRaffle ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Raffle Entries Currently Closed</h2>
              <p className="text-muted-foreground mb-4">
                Stay tuned for the next round!
              </p>
              {!user && (
                <Link to="/auth">
                  <Button>Sign In to Get Notified</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Raffle Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Current Raffle
                </CardTitle>
                <CardDescription>{activeRaffle.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Prize:</h3>
                  <p className="text-2xl font-bold text-primary">
                    ${activeRaffle.prize_amount} worth of {activeRaffle.prize}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Time Remaining:</h3>
                  <RaffleCountdown endDate={activeRaffle.end_date} />
                </div>

                {user && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Your Entries:</h3>
                      <Badge variant="secondary" className="text-lg px-4 py-1">
                        <Ticket className="w-4 h-4 mr-2" />
                        {totalEntries}
                      </Badge>
                    </div>
                    {referralCount > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Including {referralCount} bonus {referralCount === 1 ? 'entry' : 'entries'} from referrals
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <RaffleShareButton userId={user?.id} />
                </div>
              </CardContent>
            </Card>

            {/* Task Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Entry Requirements</CardTitle>
                <CardDescription>
                  Complete tasks to earn raffle entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Sign in to participate in the raffle
                    </p>
                    <Link to="/auth">
                      <Button>Sign In</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {TASKS.map((task) => (
                      <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={task.id}
                          checked={taskCompletion[task.id] || false}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                          disabled={task.auto}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={task.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {task.label}
                            {task.auto && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Auto-verified
                              </Badge>
                            )}
                          </label>
                          {task.link && (
                            <a
                              href={task.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              Visit <Share2 className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{task.entries}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legal Disclaimer */}
        <Card className="mt-8 border-muted">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> Educational participation only — no purchase necessary. 
              Winners are selected randomly from verified participants who have completed the learning 
              and engagement requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Raffles;
