import { Link } from 'react-router-dom';
import { Map, Crown, Star, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRoadmapVotes } from '@/hooks/useRoadmapVotes';
import { useAuth } from '@/components/auth/AuthProvider';
import { RoadmapCard } from '@/components/roadmap/RoadmapCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const Roadmap = () => {
  const { user } = useAuth();
  const {
    items,
    loading,
    voting,
    canVote,
    votingTier,
    voteWeight,
    isVotingOpen,
    castVote,
    removeVote,
  } = useRoadmapVotes();

  // Calculate max votes for progress bars
  const maxVotes = Math.max(...items.map((i) => i.total_votes), 1);

  // Group items by status
  const proposedItems = items.filter((i) => i.status === 'proposed' || !i.status);
  const inProgressItems = items.filter((i) => i.status === 'in_progress');
  const completedItems = items.filter((i) => i.status === 'completed');

  return (
    <>
      <SEO
        title="Platform Roadmap | 3rdeyeadvisors"
        description="Vote on upcoming platform features. Annual subscribers get 1 vote, Founding 33 members get 3x voting power."
        keywords="roadmap, voting, features, defi education platform"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Map className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Platform Roadmap</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-consciousness font-bold leading-tight">
                Shape the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Future
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Your voice matters. Vote on the features you want to see next.
                Premium members get weighted voting power.
              </p>

              {/* Voting Power Explainer */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-medium">Founding 33 = 3x Votes</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Annual = 1x Vote</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Monthly/Trial = View Only</span>
                </div>
              </div>

              {/* User Status */}
              {!user ? (
                <div className="pt-4">
                  <Button asChild>
                    <Link to="/auth">
                      Sign In to Vote <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : !canVote ? (
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upgrade to Annual to unlock voting
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/subscription">
                      View Plans <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="pt-4">
                  <Badge
                    variant="outline"
                    className={
                      votingTier === 'founding'
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
                        : 'bg-primary/10 border-primary/30 text-primary'
                    }
                  >
                    {votingTier === 'founding' ? (
                      <>
                        <Crown className="w-3.5 h-3.5 mr-1.5" />
                        3x Voting Power Active
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 mr-1.5" />
                        1x Voting Power Active
                      </>
                    )}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Roadmap Items */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <Map className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-consciousness font-medium mb-2">
                  No roadmap items yet
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for upcoming features to vote on.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* In Progress */}
                {inProgressItems.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                      <h2 className="text-2xl font-consciousness font-bold">
                        In Progress
                      </h2>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        {inProgressItems.length}
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {inProgressItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          votingEndsAt={item.voting_ends_at}
                          totalVotes={item.total_votes}
                          userHasVoted={item.user_has_voted}
                          maxVotes={maxVotes}
                          canVote={canVote}
                          votingTier={votingTier}
                          voteWeight={voteWeight}
                          isVoting={voting === item.id}
                          isVotingOpen={isVotingOpen(item)}
                          onVote={() => castVote(item.id)}
                          onRemoveVote={() => removeVote(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposed */}
                {proposedItems.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <h2 className="text-2xl font-consciousness font-bold">
                        Proposed Features
                      </h2>
                      <Badge variant="outline">
                        {proposedItems.length}
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {proposedItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          votingEndsAt={item.voting_ends_at}
                          totalVotes={item.total_votes}
                          userHasVoted={item.user_has_voted}
                          maxVotes={maxVotes}
                          canVote={canVote}
                          votingTier={votingTier}
                          voteWeight={voteWeight}
                          isVoting={voting === item.id}
                          isVotingOpen={isVotingOpen(item)}
                          onVote={() => castVote(item.id)}
                          onRemoveVote={() => removeVote(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completedItems.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <h2 className="text-2xl font-consciousness font-bold">
                        Shipped
                      </h2>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {completedItems.length}
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {completedItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          votingEndsAt={item.voting_ends_at}
                          totalVotes={item.total_votes}
                          userHasVoted={item.user_has_voted}
                          maxVotes={maxVotes}
                          canVote={canVote}
                          votingTier={votingTier}
                          voteWeight={voteWeight}
                          isVoting={voting === item.id}
                          isVotingOpen={isVotingOpen(item)}
                          onVote={() => castVote(item.id)}
                          onRemoveVote={() => removeVote(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-border/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-consciousness font-bold mb-4">
              Have a Feature Idea?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We're always looking for ways to improve. Reach out to share your ideas for the platform.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Roadmap;
