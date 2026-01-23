import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSubscription } from '@/hooks/useSubscription';
import { useSingleFoundingMemberStatus } from '@/hooks/useFoundingMemberStatus';
import { useToast } from '@/hooks/use-toast';

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
  total_votes: number;
  user_has_voted: boolean;
}

interface RoadmapVote {
  id: string;
  roadmap_item_id: string;
  user_id: string;
  vote_weight: number | null;
  created_at: string | null;
}

export const useRoadmapVotes = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { isFoundingMember, loading: foundingLoading } = useSingleFoundingMemberStatus(user?.id);
  const { toast } = useToast();
  
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  // Determine vote weight based on membership
  const getVoteWeight = useCallback((): number => {
    if (isFoundingMember) return 3;
    if (subscription?.plan === 'annual') return 1;
    return 0; // Cannot vote
  }, [isFoundingMember, subscription?.plan]);

  const canVote = useCallback((): boolean => {
    return getVoteWeight() > 0;
  }, [getVoteWeight]);

  const getVotingTier = useCallback((): 'founding' | 'annual' | 'none' => {
    if (isFoundingMember) return 'founding';
    if (subscription?.plan === 'annual') return 'annual';
    return 'none';
  }, [isFoundingMember, subscription?.plan]);

  // Fetch all roadmap items with vote counts
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch roadmap items
      const { data: itemsData, error: itemsError } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      // Fetch all votes
      const { data: votesData, error: votesError } = await supabase
        .from('roadmap_votes')
        .select('*');

      if (votesError) throw votesError;

      // Process items with vote counts
      const processedItems: RoadmapItem[] = (itemsData || []).map((item) => {
        const itemVotes = (votesData || []).filter(
          (v: RoadmapVote) => v.roadmap_item_id === item.id
        );
        const totalVotes = itemVotes.reduce(
          (sum: number, v: RoadmapVote) => sum + (v.vote_weight || 1),
          0
        );
        const userHasVoted = user
          ? itemVotes.some((v: RoadmapVote) => v.user_id === user.id)
          : false;

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status,
          created_at: item.created_at,
          total_votes: totalVotes,
          user_has_voted: userHasVoted,
        };
      });

      // Sort by vote count (descending)
      processedItems.sort((a, b) => b.total_votes - a.total_votes);
      setItems(processedItems);
    } catch (error) {
      console.error('Error fetching roadmap items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load roadmap items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Cast a vote
  const castVote = useCallback(
    async (roadmapItemId: string) => {
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to vote on roadmap items',
          variant: 'destructive',
        });
        return false;
      }

      if (!canVote()) {
        toast({
          title: 'Annual subscription required',
          description:
            'Only Annual subscribers and Founding 33 members can vote on the roadmap',
          variant: 'destructive',
        });
        return false;
      }

      setVoting(roadmapItemId);
      try {
        const voteWeight = getVoteWeight();

        const { error } = await supabase.from('roadmap_votes').insert({
          roadmap_item_id: roadmapItemId,
          user_id: user.id,
          vote_weight: voteWeight,
        });

        if (error) {
          if (error.code === '23505') {
            // Unique constraint violation - already voted
            toast({
              title: 'Already voted',
              description: 'You have already voted for this feature',
              variant: 'destructive',
            });
          } else {
            throw error;
          }
          return false;
        }

        toast({
          title: 'Vote cast!',
          description: `Your vote (${voteWeight}x power) has been recorded`,
        });

        // Refresh items
        await fetchItems();
        return true;
      } catch (error) {
        console.error('Error casting vote:', error);
        toast({
          title: 'Error',
          description: 'Failed to cast vote',
          variant: 'destructive',
        });
        return false;
      } finally {
        setVoting(null);
      }
    },
    [user, canVote, getVoteWeight, fetchItems, toast]
  );

  // Remove a vote
  const removeVote = useCallback(
    async (roadmapItemId: string) => {
      if (!user) return false;

      setVoting(roadmapItemId);
      try {
        const { error } = await supabase
          .from('roadmap_votes')
          .delete()
          .eq('roadmap_item_id', roadmapItemId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: 'Vote removed',
          description: 'Your vote has been removed',
        });

        await fetchItems();
        return true;
      } catch (error) {
        console.error('Error removing vote:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove vote',
          variant: 'destructive',
        });
        return false;
      } finally {
        setVoting(null);
      }
    },
    [user, fetchItems, toast]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading: loading || foundingLoading,
    voting,
    canVote: canVote(),
    votingTier: getVotingTier(),
    voteWeight: getVoteWeight(),
    castVote,
    removeVote,
    refreshItems: fetchItems,
  };
};

// Admin hook for managing roadmap items
export const useRoadmapAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createItem = async (title: string, description: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('roadmap_items').insert({
        title,
        description,
        status: 'proposed',
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Roadmap item created',
      });
      return true;
    } catch (error) {
      console.error('Error creating roadmap item:', error);
      toast({
        title: 'Error',
        description: 'Failed to create roadmap item',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (
    itemId: string,
    status: 'proposed' | 'in_progress' | 'completed'
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ status })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Status updated',
      });
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    setLoading(true);
    try {
      // First delete all votes for this item
      await supabase.from('roadmap_votes').delete().eq('roadmap_item_id', itemId);

      // Then delete the item
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Roadmap item deleted',
      });
      return true;
    } catch (error) {
      console.error('Error deleting roadmap item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete roadmap item',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createItem,
    updateItemStatus,
    deleteItem,
  };
};
