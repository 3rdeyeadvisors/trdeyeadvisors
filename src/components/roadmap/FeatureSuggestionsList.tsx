import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Loader2, ChevronRight, CheckCircle2, XCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureSuggestion } from '@/hooks/useFeatureSuggestions';

interface FeatureSuggestionsListProps {
  suggestions: FeatureSuggestion[];
  loading: boolean;
  maxItems?: number;
}

const statusConfig = {
  pending: {
    label: 'Under Review',
    icon: Clock,
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  rejected: {
    label: 'Not Selected',
    icon: XCircle,
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  promoted: {
    label: 'Now Voting',
    icon: ArrowUpRight,
    className: 'bg-primary/20 text-primary border-primary/30',
  },
};

export const FeatureSuggestionsList = ({
  suggestions,
  loading,
  maxItems = 6
export const FeatureSuggestionsList = ({ 
  suggestions, 
  loading, 
  maxItems = 6 
}: FeatureSuggestionsListProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<FeatureSuggestion | null>(null);

  const displayedSuggestions = suggestions.slice(0, maxItems);

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-10 px-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
          <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">No community ideas yet</p>
          <p className="text-xs text-muted-foreground/70">Be the first to submit one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Recent Community Ideas
          </CardTitle>
          <CardDescription className="text-sm">
            {suggestions.length} idea{suggestions.length !== 1 ? 's' : ''} submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {displayedSuggestions.map((suggestion) => {
            const status = statusConfig[suggestion.status];
            const StatusIcon = status.icon;

            return (
              <button
                key={suggestion.id}
                onClick={() => setSelectedSuggestion(suggestion)}
                className="w-full text-left p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/50 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {suggestion.title}
                  </h4>
                  <Badge variant="outline" className={`shrink-0 text-xs ${status.className}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {suggestion.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                  <span>by {suggestion.submitter_name}</span>
                  <span className="flex items-center gap-1">
                    Click to read more <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}

          {suggestions.length > maxItems && (
            <p className="text-xs text-center text-muted-foreground pt-2">
              +{suggestions.length - maxItems} more ideas
            </p>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
        <DialogContent className="max-w-lg">
          {selectedSuggestion && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <DialogTitle className="text-lg font-consciousness pr-4">
                    {selectedSuggestion.title}
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {(() => {
                    const status = statusConfig[selectedSuggestion.status];
                    const StatusIcon = status.icon;
                    return (
                      <Badge variant="outline" className={`text-xs ${status.className}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    );
                  })()}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedSuggestion.created_at), { addSuffix: true })}
                  </span>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[300px]">
                <DialogDescription className="text-sm text-foreground whitespace-pre-wrap">
                  {selectedSuggestion.description}
                </DialogDescription>
              </ScrollArea>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Submitted by {selectedSuggestion.submitter_name}
                </span>
                {selectedSuggestion.status === 'promoted' && (
                  <span className="text-xs text-primary">
                    Now available for voting on the roadmap!
                  </span>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
