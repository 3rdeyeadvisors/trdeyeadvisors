import { Check, Vote, Loader2, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RoadmapCardProps {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  totalVotes: number;
  userHasVoted: boolean;
  maxVotes: number;
  canVote: boolean;
  votingTier: 'founding' | 'annual' | 'none';
  voteWeight: number;
  isVoting: boolean;
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

export const RoadmapCard = ({
  id,
  title,
  description,
  status,
  totalVotes,
  userHasVoted,
  maxVotes,
  canVote,
  votingTier,
  voteWeight,
  isVoting,
  onVote,
  onRemoveVote,
}: RoadmapCardProps) => {
  const statusInfo = statusConfig[status as keyof typeof statusConfig] || statusConfig.proposed;
  const votePercentage = maxVotes > 0 ? (totalVotes / maxVotes) * 100 : 0;
  const isCompleted = status === 'completed';

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-consciousness leading-tight">
            {title}
          </CardTitle>
          <Badge variant="outline" className={statusInfo.className}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {/* Vote Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Community Support</span>
            <span className="font-medium text-primary">{totalVotes} votes</span>
          </div>
          <Progress value={votePercentage} className="h-2" />
        </div>

        {/* Vote Action */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Vote Weight Badge */}
          {votingTier !== 'none' && (
            <div className="flex items-center gap-2">
              {votingTier === 'founding' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">3x Vote Power</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <Star className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">1x Vote Power</span>
                </div>
              )}
            </div>
          )}

          {/* Vote Button */}
          <div className="ml-auto">
            {isCompleted ? (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Shipped</span>
              </div>
            ) : userHasVoted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemoveVote}
                disabled={isVoting}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                {isVoting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
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
              >
                {isVoting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Vote className="w-4 h-4 mr-1.5" />
                    Vote
                  </>
                )}
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="opacity-50">
                <Vote className="w-4 h-4 mr-1.5" />
                Annual Only
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
