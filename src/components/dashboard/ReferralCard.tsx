import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Check, Gift, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReferralStats {
  totalReferrals: number;
  bonusEntries: number;
}

interface ActiveRaffle {
  id: string;
  title: string;
  end_date: string;
}

export const ReferralCard = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({ totalReferrals: 0, bonusEntries: 0 });
  const [loading, setLoading] = useState(true);
  const [activeRaffle, setActiveRaffle] = useState<ActiveRaffle | null>(null);

  const referralLink = user ? `${window.location.origin}/auth?ref=${user.id}&tab=signup` : "";

  useEffect(() => {
    if (user) {
      loadReferralStats();
      loadActiveRaffle();
    }
  }, [user]);

  const loadActiveRaffle = async () => {
    try {
      const { data, error } = await supabase
        .from('raffles')
        .select('id, title, end_date')
        .eq('is_active', true)
        .gt('end_date', new Date().toISOString())
        .maybeSingle();

      if (!error && data) {
        setActiveRaffle(data);
      }
    } catch (error) {
      console.error('Error loading active raffle:', error);
    }
  };

  const loadReferralStats = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Count referrals where current user is the referrer
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('id, bonus_awarded')
        .eq('referrer_id', user.id);

      if (error) throw error;

      const totalReferrals = referrals?.length || 0;
      const bonusEntries = referrals?.filter(r => r.bonus_awarded).length || 0;

      setStats({ totalReferrals, bonusEntries });
    } catch (error) {
      console.error('Error loading referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join 3rdeyeadvisors",
          text: "Learn DeFi with me! Sign up using my referral link and we both earn bonus raffle entries.",
          url: referralLink,
        });
      } catch (error) {
        // User cancelled share, not an error
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  if (!user) return null;

  return (
    <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Invite Friends & Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                {activeRaffle 
                  ? `Share your referral link and earn bonus entries for "${activeRaffle.title}"`
                  : "Share your referral link - bonus entries will be awarded when a raffle is active"
                }
              </p>
            </div>
          </div>
          
          {!loading && stats.totalReferrals > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stats.totalReferrals} referral{stats.totalReferrals !== 1 ? 's' : ''}
              </Badge>
              {stats.bonusEntries > 0 && (
                <Badge className="bg-accent text-accent-foreground">
                  +{stats.bonusEntries} bonus entries
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Mobile stats */}
        {!loading && stats.totalReferrals > 0 && (
          <div className="flex sm:hidden items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {stats.totalReferrals} referral{stats.totalReferrals !== 1 ? 's' : ''}
            </Badge>
            {stats.bonusEntries > 0 && (
              <Badge className="bg-accent text-accent-foreground">
                +{stats.bonusEntries} bonus entries
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Input
              value={referralLink}
              readOnly
              className="pr-10 bg-background/50 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="default"
              onClick={copyToClipboard}
              className="flex-1 sm:flex-none"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-awareness" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              onClick={shareLink}
              className="flex-1 sm:flex-none"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
