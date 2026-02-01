import { Link } from 'react-router-dom';
import { Map, Crown, Star, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRoadmapVotes, VoteType } from '@/hooks/useRoadmapVotes';
import { useFeatureSuggestions } from '@/hooks/useFeatureSuggestions';
import { useAuth } from '@/components/auth/AuthProvider';
import { RoadmapCard } from '@/components/roadmap/RoadmapCard';
import { FeatureSuggestionForm } from '@/components/roadmap/FeatureSuggestionForm';
import { FeatureSuggestionsList } from '@/components/roadmap/FeatureSuggestionsList';
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

  const {
    suggestions,
    loading: suggestionsLoading,
    submitting,
    submitSuggestion,
  } = useFeatureSuggestions();

  // Group items by status

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
        <section className="relative pt-8 pb-6 md:pt-12 md:pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 mt-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Map className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Platform Roadmap</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-consciousness font-bold leading-tight">
                Shape the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Future
                </span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Your voice matters. Vote on the features you want to see next.
              </p>

              {/* Voting Power Explainer */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs sm:text-sm font-medium">Founding 33 = 3x</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium">Annual = 1x</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">View Only</span>
                </div>
              </div>

              {/* User Status */}
              {!user ? (
                <div className="pt-2">
                  <Button asChild size="sm">
                    <Link to="/auth">
                      Sign In to Vote <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : !canVote ? (
                <div className="pt-2">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Upgrade to Annual or join Founding 33 to unlock voting
                  </p>
                  <Button asChild variant="outline" size="sm">
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
        <section className="py-4 md:py-6">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-10">
                <Map className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-consciousness font-medium mb-1">
                  No roadmap items yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check back soon for upcoming features to vote on.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* In Progress */}
                {inProgressItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <h2 className="text-xl md:text-2xl font-consciousness font-bold">
                        In Progress
                      </h2>
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                        {inProgressItems.length}
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {inProgressItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          votingEndsAt={item.voting_ends_at}
                          yesVotes={item.yes_votes}
                          noVotes={item.no_votes}
                          netVotes={item.net_votes}
                          userVoteType={item.user_vote_type}
                          canVote={canVote}
                          votingTier={votingTier}
                          voteWeight={voteWeight}
                          isVoting={voting === item.id}
                          isVotingOpen={isVotingOpen(item)}
                          onVote={(voteType: VoteType) => castVote(item.id, voteType)}
                          onRemoveVote={() => removeVote(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposed */}
                {proposedItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <h2 className="text-xl md:text-2xl font-consciousness font-bold">
                        Proposed Features
                      </h2>
                      <Badge variant="outline" className="text-xs">
                        {proposedItems.length}
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {proposedItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          votingEndsAt={item.voting_ends_at}
                          yesVotes={item.yes_votes}
                          noVotes={item.no_votes}
                          netVotes={item.net_votes}
                          userVoteType={item.user_vote_type}
                          canVote={canVote}
                          votingTier={votingTier}
                          voteWeight={voteWeight}
                          isVoting={voting === item.id}
                          isVotingOpen={isVotingOpen(item)}
                          onVote={(voteType: VoteType) => castVote(item.id, voteType)}
                          onRemoveVote={() => removeVote(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completedItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h2 className="text-xl md:text-2xl font-consciousness font-bold">
                        Completed
                      </h2>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        {completedItems.length}
                      </Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {completedItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          status={item.status}
                          votingEndsAt={item.voting_ends_at}
                          yesVotes={item.yes_votes}
                          noVotes={item.no_votes}
                          netVotes={item.net_votes}
                          userVoteType={item.user_vote_type}
                          canVote={canVote}
                          votingTier={votingTier}
                          voteWeight={voteWeight}
                          isVoting={voting === item.id}
                          isVotingOpen={isVotingOpen(item)}
                          onVote={(voteType: VoteType) => castVote(item.id, voteType)}
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

        {/* Feature Suggestions Section */}
        <section className="py-8 md:py-12 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-consciousness font-bold mb-2">
                  Have a Feature Idea?
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Premium members can submit ideas for consideration. Popular suggestions may be promoted to the public roadmap.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Submit Form */}
                <FeatureSuggestionForm
                  canSubmit={canVote}
                  submitting={submitting}
                  onSubmit={submitSuggestion}
                />

                {/* Recent Ideas List */}
                <FeatureSuggestionsList
                  suggestions={suggestions}
                  loading={suggestionsLoading}
                  maxItems={5}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Roadmap;
