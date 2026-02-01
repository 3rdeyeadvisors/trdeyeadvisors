import { Check, Loader2, Crown, Star, Clock, AlertTriangle, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import type { VoteType } from '@/hooks/useRoadmapVotes';

interface RoadmapCardProps {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  votingEndsAt: string | null;
  yesVotes: number;
  noVotes: number;
  netVotes: number;
  userVoteType: VoteType | null;
  canVote: boolean;
  votingTier: 'founding' | 'annual' | 'none';
  voteWeight: number;
  isVoting: boolean;
  isVotingOpen: boolean;
  onVote: (voteType: VoteType) => void;
  onRemoveVote: () => void;
}

const statusConfig = {
  proposed: {
    label: 'Proposed',
    className: 'bg-muted text-muted-foreground border-muted',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
};

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
  urgent: boolean; // Less than 24 hours
}

const getTimeRemaining = (votingEndsAt: string | null): TimeRemaining | null => {
  if (!votingEndsAt) return null;
  
  const end = new Date(votingEndsAt);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true, urgent: false };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const urgent = diffMs < 24 * 60 * 60 * 1000; // Less than 24 hours
  
  return { days, hours, minutes, expired: false, urgent };
};

export const RoadmapCard = ({
  id,
  title,
  description,
  status,
  votingEndsAt,
  yesVotes,
  noVotes,
  netVotes,
  userVoteType,
  canVote,
  votingTier,
  voteWeight,
  isVoting,
  isVotingOpen,
  onVote,
  onRemoveVote,
}: RoadmapCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.proposed;
  const totalVotes = yesVotes + noVotes;
  // Calculate sentiment as percentage of yes votes out of total votes
  // If no votes yet, show neutral (50%)
  const sentimentPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 50;
  const isCompleted = status === 'completed';
  
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(() => 
    getTimeRemaining(votingEndsAt)
  );

  // Update countdown every minute
  useEffect(() => {
    if (!votingEndsAt || isCompleted) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(votingEndsAt));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [votingEndsAt, isCompleted]);

  const formatTimeRemaining = () => {
    if (!timeRemaining) return null;
    if (timeRemaining.expired) return 'Voting ended';
    
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h left`;
    }
    if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m left`;
    }
    return `${timeRemaining.minutes}m left`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open dialog if clicking on a button
    if ((e.target as HTMLElement).closest('button')) return;
    setDialogOpen(true);
  };

  const VotingButtons = ({ compact = false }: { compact?: boolean }) => {
    if (isCompleted) {
      return (
        <div className="flex items-center gap-1 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Shipped</span>
        </div>
      );
    }

    if (!isVotingOpen) {
      return (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Closed</span>
        </div>
      );
    }

    if (!canVote) {
      return (
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" disabled className="flex-1 min-h-[36px] opacity-50 text-xs">
            <ThumbsUp className="w-3.5 h-3.5 mr-1" />
            Yes
          </Button>
          <Button variant="outline" size="sm" disabled className="flex-1 min-h-[36px] opacity-50 text-xs">
            <ThumbsDown className="w-3.5 h-3.5 mr-1" />
            No
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 w-full">
        <Button
          variant={userVoteType === 'yes' ? 'default' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onVote('yes');
          }}
          disabled={isVoting}
          className={`flex-1 min-h-[36px] text-xs ${
            userVoteType === 'yes'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
          }`}
        >
          {isVoting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <ThumbsUp className="w-3.5 h-3.5 mr-1" />
              Yes {yesVotes > 0 && <span className="ml-1 opacity-75">({yesVotes})</span>}
            </>
          )}
        </Button>
        <Button
          variant={userVoteType === 'no' ? 'default' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onVote('no');
          }}
          disabled={isVoting}
          className={`flex-1 min-h-[36px] text-xs ${
            userVoteType === 'no'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
          }`}
        >
          {isVoting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <ThumbsDown className="w-3.5 h-3.5 mr-1" />
              No {noVotes > 0 && <span className="ml-1 opacity-75">({noVotes})</span>}
            </>
          )}
        </Button>
      </div>
    );
  };

  const VoteWeightBadge = () => {
    if (votingTier === 'none') return null;

    return votingTier === 'founding' ? (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
        <Crown className="w-3 h-3 text-amber-400" />
        <span className="text-xs font-medium text-amber-400">3x</span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30">
        <Star className="w-3 h-3 text-primary" />
        <span className="text-xs font-medium text-primary">1x</span>
      </div>
    );
  };

  return (
    <>
      <Card
        className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="relative p-4 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <CardTitle className="text-base md:text-lg font-consciousness leading-tight flex-1 min-w-0">
              {title}
            </CardTitle>
            <Badge variant="outline" className={`${statusInfo.className} text-[10px] sm:text-xs shrink-0 self-start`}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Countdown Timer */}
          {!isCompleted && timeRemaining && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs ${
              timeRemaining.expired
                ? 'text-muted-foreground'
                : timeRemaining.urgent
                  ? 'text-amber-400'
                  : 'text-muted-foreground'
            }`}>
              {timeRemaining.urgent && !timeRemaining.expired ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              <span className="font-medium">{formatTimeRemaining()}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="relative p-4 pt-2 space-y-3">
          {description && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
              <span className="text-xs text-primary/70 hover:text-primary cursor-pointer mt-1 inline-block">
                Click to read more
              </span>
            </div>
          )}

          {/* Vote Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Support</span>
              <span className="font-medium">
                <span className="text-emerald-400">+{yesVotes}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-red-400">-{noVotes}</span>
                <span className="text-muted-foreground ml-2">net: </span>
                <span className={netVotes >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {netVotes >= 0 ? '+' : ''}{netVotes}
                </span>
              </span>
            </div>
            <Progress value={sentimentPercentage} className="h-1.5" />
          </div>

          {/* Vote Action */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Vote Weight Badge & User Vote Status */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <VoteWeightBadge />
              {userVoteType && (
                <span className="text-xs text-muted-foreground">
                  You voted: <span className={userVoteType === 'yes' ? 'text-emerald-400' : 'text-red-400'}>
                    {userVoteType === 'yes' ? 'Yes' : 'No'}
                  </span>
                </span>
              )}
            </div>

            {/* Voting Buttons */}
            <div className="flex justify-center w-full pt-1">
              <div className="w-full max-w-[280px]">
                <VotingButtons />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-xl font-consciousness leading-tight pr-8">
                {title}
              </DialogTitle>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`${statusInfo.className} text-xs`}>
                {statusInfo.label}
              </Badge>
              {!isCompleted && timeRemaining && (
                <div className={`flex items-center gap-1 text-xs ${
                  timeRemaining.expired
                    ? 'text-muted-foreground'
                    : timeRemaining.urgent
                      ? 'text-amber-400'
                      : 'text-muted-foreground'
                }`}>
                  {timeRemaining.urgent && !timeRemaining.expired ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span className="font-medium">{formatTimeRemaining()}</span>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Full Description */}
            {description && (
              <DialogDescription className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {description}
              </DialogDescription>
            )}

            {/* Vote Progress */}
            <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Support</span>
                <span className="font-medium">
                  <span className="text-emerald-400">+{yesVotes} yes</span>
                  <span className="text-muted-foreground mx-2">|</span>
                  <span className="text-red-400">-{noVotes} no</span>
                </span>
              </div>
              <Progress value={sentimentPercentage} className="h-2" />
              <div className="flex items-center justify-center">
                <span className={`text-lg font-bold ${netVotes >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Net: {netVotes >= 0 ? '+' : ''}{netVotes}
                </span>
              </div>
            </div>

            {/* Vote Weight Badge & User Vote Status */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <VoteWeightBadge />
              {userVoteType && (
                <span className="text-sm text-muted-foreground">
                  Your vote: <span className={userVoteType === 'yes' ? 'text-emerald-400' : 'text-red-400'}>
                    {userVoteType === 'yes' ? 'Yes (Support)' : 'No (Oppose)'}
                  </span>
                </span>
              )}
            </div>

            {/* Voting Buttons */}
            <div className="pt-2 flex justify-center w-full">
              <div className="w-full max-w-[280px]">
                <VotingButtons />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
