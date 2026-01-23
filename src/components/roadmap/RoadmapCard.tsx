import { Check, Vote, Loader2, Crown, Star, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface RoadmapCardProps {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  votingEndsAt: string | null;
  totalVotes: number;
  userHasVoted: boolean;
  maxVotes: number;
  canVote: boolean;
  votingTier: 'founding' | 'annual' | 'none';
  voteWeight: number;
  isVoting: boolean;
  isVotingOpen: boolean;
  onVote: () => void;
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
  totalVotes,
  userHasVoted,
  maxVotes,
  canVote,
  votingTier,
  voteWeight,
  isVoting,
  isVotingOpen,
  onVote,
  onRemoveVote,
}: RoadmapCardProps) => {
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.proposed;
  const votePercentage = maxVotes > 0 ? (totalVotes / maxVotes) * 100 : 0;
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

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="relative p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base md:text-lg font-consciousness leading-tight">
            {title}
          </CardTitle>
          <Badge variant="outline" className={`${statusInfo.className} text-xs shrink-0`}>
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
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Vote Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Support</span>
            <span className="font-medium text-primary">{totalVotes} votes</span>
          </div>
          <Progress value={votePercentage} className="h-1.5" />
        </div>

        {/* Vote Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
          {/* Vote Weight Badge */}
          {votingTier !== 'none' && (
            <div className="flex items-center">
              {votingTier === 'founding' ? (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">3x</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30">
                  <Star className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">1x</span>
                </div>
              )}
            </div>
          )}

          {/* Vote Button */}
          <div className="w-full sm:w-auto sm:ml-auto">
            {isCompleted ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Shipped</span>
              </div>
            ) : !isVotingOpen ? (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Closed</span>
              </div>
            ) : userHasVoted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemoveVote}
                disabled={isVoting}
                className="w-full sm:w-auto min-h-[36px] border-primary/30 text-primary hover:bg-primary/10 text-xs"
              >
                {isVoting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Voted
                  </>
                )}
              </Button>
            ) : canVote ? (
              <Button
                variant="default"
                size="sm"
                onClick={onVote}
                disabled={isVoting}
                className="w-full sm:w-auto min-h-[36px] text-xs"
              >
                {isVoting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Vote className="w-3.5 h-3.5 mr-1" />
                    Vote
                  </>
                )}
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="w-full sm:w-auto min-h-[36px] opacity-50 text-xs">
                <Vote className="w-3.5 h-3.5 mr-1" />
                Premium Only
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
