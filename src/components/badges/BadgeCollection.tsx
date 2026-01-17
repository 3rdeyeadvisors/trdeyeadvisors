import { useBadges } from "@/hooks/useBadges";
import { BadgeDisplay } from "./BadgeDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Loader2 } from "lucide-react";

interface BadgeCollectionProps {
  compact?: boolean;
  showLocked?: boolean;
}

export const BadgeCollection = ({ compact = false, showLocked = true }: BadgeCollectionProps) => {
  const { loading, getAllBadgesWithStatus, getBadgeCount } = useBadges();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const allBadges = getAllBadgesWithStatus();
  const earnedCount = getBadgeCount();
  const totalCount = allBadges.length;

  // Filter badges if not showing locked
  const displayBadges = showLocked ? allBadges : allBadges.filter(b => b.earned);

  if (compact) {
    // Compact view - just show earned badges in a row
    const earnedBadges = allBadges.filter(b => b.earned);
    
    if (earnedBadges.length === 0) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Award className="w-4 h-4" />
          <span>No badges earned yet</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {earnedBadges.slice(0, 5).map((badge) => (
          <BadgeDisplay
            key={badge.type}
            badgeType={badge.type}
            size="sm"
            earned={true}
            earnedAt={badge.earnedAt}
          />
        ))}
        {earnedBadges.length > 5 && (
          <Badge variant="outline" className="text-xs">
            +{earnedBadges.length - 5} more
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-consciousness flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Badges
          </CardTitle>
          <Badge variant="outline">
            {earnedCount} / {totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {displayBadges.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            Complete courses and quizzes to earn badges!
          </p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {displayBadges.map((badge) => (
              <div key={badge.type} className="flex flex-col items-center gap-1">
                <BadgeDisplay
                  badgeType={badge.type}
                  size="md"
                  earned={badge.earned}
                  earnedAt={badge.earnedAt}
                />
                <span className={`text-xs text-center ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
