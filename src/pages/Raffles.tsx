import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Ticket, Trophy, Share2, Clock, CheckCircle2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import RaffleCountdown from "@/components/raffles/RaffleCountdown";
import RaffleShareButton from "@/components/raffles/RaffleShareButton";
import SocialVerificationForm from "@/components/raffles/SocialVerificationForm";

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
  winner_selected_at?: string;
}

interface TaskCompletion {
  [key: string]: boolean;
}

interface SocialTask {
  username?: string;
  verification_status?: string;
}

interface SocialTasks {
  instagram?: SocialTask;
  x?: SocialTask;
}

const AUTO_TASKS = [
  { id: 'newsletter', label: 'Subscribe to the newsletter', entries: 1 },
  { id: 'account', label: 'Have a registered user account', entries: 1 },
  { id: 'course_foundations', label: 'Complete "DeFi Foundations" course', entries: 1 },
  { id: 'course_safety', label: 'Complete "Staying Safe with DeFi" course', entries: 1 },
  { id: 'rating', label: 'Rate a course 5 stars', entries: 1 },
  { id: 'discussion', label: 'Post in course discussion section', entries: 1 },
];

const Raffles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeRaffle, setActiveRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskCompletion, setTaskCompletion] = useState<TaskCompletion>({});
  const [totalEntries, setTotalEntries] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [socialTasks, setSocialTasks] = useState<SocialTasks>({});
  const [winnerDisplayName, setWinnerDisplayName] = useState<string | null>(null);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    fetchActiveRaffle();
    if (user) {
      fetchUserProgress();
      fetchReferralCount();
    }
  }, [user]);

  useEffect(() => {
    if (activeRaffle?.winner_user_id && user) {
      setIsWinner(activeRaffle.winner_user_id === user.id);
      fetchWinnerName();
    }
  }, [activeRaffle, user]);

  const fetchActiveRaffle = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('raffles')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Filter to find the current active raffle
      const currentRaffle = data?.find(raffle => {
        const hasStarted = new Date(raffle.start_date) <= new Date(now);
        const hasNotEnded = new Date(raffle.end_date) >= new Date(now);
        const noWinner = !raffle.winner_user_id;
        return hasStarted && hasNotEnded && noWinner;
      });
      
      setActiveRaffle(currentRaffle || null);
    } catch (error) {
      console.error('Error fetching raffle:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!activeRaffle || !user) return;

    try {
      // Fetch task completion including social verification
      const { data: tasks } = await supabase
        .from('raffle_tasks')
        .select('task_type, completed, instagram_username, x_username, verification_status')
        .eq('raffle_id', activeRaffle.id)
        .eq('user_id', user.id);

      const completion: TaskCompletion = {};
      const social: SocialTasks = {};
      
      tasks?.forEach(task => {
        completion[task.task_type] = task.completed;
        
        if (task.task_type === 'instagram') {
          social.instagram = {
            username: task.instagram_username || undefined,
            verification_status: task.verification_status || 'pending',
          };
        } else if (task.task_type === 'x') {
          social.x = {
            username: task.x_username || undefined,
            verification_status: task.verification_status || 'pending',
          };
        }
      });
      
      setTaskCompletion(completion);
      setSocialTasks(social);

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

  const fetchWinnerName = async () => {
    if (!activeRaffle?.winner_user_id) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', activeRaffle.winner_user_id)
        .single();

      setWinnerDisplayName(data?.display_name || 'Anonymous');
    } catch (error) {
      console.error('Error fetching winner name:', error);
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

    const task = AUTO_TASKS.find(t => t.id === taskId);
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

      <div className="w-full mx-auto px-4 py-8 md:py-16 md:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ticket className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Learn to Earn</h1>
            <Trophy className="w-10 h-10 text-warning" />
          </div>
          <p className="text-xl text-muted-foreground mb-4">The Raffle Portal</p>
          <Link to="/raffle-history">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              View Raffle History
            </Button>
          </Link>
        </div>

        {/* Philosophy Section */}
        <Card className="mb-8 border-primary/20 w-full">
          <CardContent className="pt-6 px-4 md:px-6">
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
          <Card className="text-center py-12 w-full">
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
        ) : activeRaffle.winner_user_id ? (
          <Card className="text-center py-12 w-full">
            <CardContent>
              <Trophy className="w-20 h-20 mx-auto mb-4 text-warning" />
              <h2 className="text-3xl font-bold mb-4">
                {isWinner ? "🎉 Congratulations! You Won! 🎉" : "Winner Announced!"}
              </h2>
              {isWinner ? (
                <div className="space-y-4">
                  <p className="text-xl text-primary font-semibold">
                    You won ${activeRaffle.prize_amount} in {activeRaffle.prize}!
                  </p>
                  <p className="text-muted-foreground">
                    Check your email for instructions on claiming your prize.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    The winner of <strong>{activeRaffle.title}</strong> is:
                  </p>
                  <p className="text-2xl font-bold text-primary">{winnerDisplayName}</p>
                  <p className="text-muted-foreground mt-4">
                    Thank you for participating! Keep learning and stay tuned for the next raffle.
                  </p>
                </div>
              )}
              <div className="mt-8">
                <Badge variant="outline" className="text-sm">
                  Winner selected on {new Date(activeRaffle.winner_selected_at!).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full">
                {/* Raffle Details */}
                <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-warning" />
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
            <Card className="w-full">
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
                    {/* Social Media Verification Section */}
                    <div className="space-y-3 pb-4 border-b border-border">
                      <h3 className="text-sm font-semibold text-muted-foreground">Social Media Tasks</h3>
                      
                      <SocialVerificationForm
                        raffleId={activeRaffle.id}
                        userId={user.id}
                        taskType="instagram"
                        existingUsername={socialTasks.instagram?.username}
                        verificationStatus={socialTasks.instagram?.verification_status}
                        onSubmit={fetchUserProgress}
                      />
                      
                      <SocialVerificationForm
                        raffleId={activeRaffle.id}
                        userId={user.id}
                        taskType="x"
                        existingUsername={socialTasks.x?.username}
                        verificationStatus={socialTasks.x?.verification_status}
                        onSubmit={fetchUserProgress}
                      />
                    </div>

                    {/* Auto-Verified Tasks Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-muted-foreground">Learning Tasks</h3>
                      
                      <div className="max-h-[400px] md:max-h-none overflow-y-auto space-y-3 pr-2">
                      {AUTO_TASKS.map((task) => (
                        <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                          <Checkbox
                            id={task.id}
                            checked={taskCompletion[task.id] || false}
                            onCheckedChange={() => handleTaskToggle(task.id)}
                            disabled={true}
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={task.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {task.label}
                              <Badge variant="outline" className="ml-2 text-xs">
                                Auto-verified
                              </Badge>
                            </label>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            +{task.entries}
                          </Badge>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              </Card>
            </div>
          </>
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
