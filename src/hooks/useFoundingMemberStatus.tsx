import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Cache for founding member status to avoid repeated queries
const foundingMemberCache = new Map<string, boolean>();

export const useFoundingMemberStatus = (userIds: string[]) => {
  const [foundingMembers, setFoundingMembers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userIds.length === 0) return;

    const checkFoundingStatus = async () => {
      setLoading(true);
      const results = new Set<string>();
      
      // Check cache first
      const uncachedIds = userIds.filter(id => {
        if (foundingMemberCache.has(id)) {
          if (foundingMemberCache.get(id)) results.add(id);
          return false;
        }
        return true;
      });

      // Query uncached user IDs
      if (uncachedIds.length > 0) {
        try {
          const { data } = await supabase
            .from('founding33_purchases')
            .select('user_id')
            .eq('status', 'completed')
            .in('user_id', uncachedIds);

          const foundingUserIds = new Set(data?.map(d => d.user_id) || []);
          
          // Update cache and results
          uncachedIds.forEach(id => {
            const isFounding = foundingUserIds.has(id);
            foundingMemberCache.set(id, isFounding);
            if (isFounding) results.add(id);
          });
        } catch (error) {
          console.error('Error checking founding member status:', error);
        }
      }

      setFoundingMembers(results);
      setLoading(false);
    };

    checkFoundingStatus();
  }, [userIds.join(',')]);

  return { foundingMembers, loading };
};

// Simple hook for checking a single user's founding status
export const useSingleFoundingMemberStatus = (userId: string | undefined) => {
  const [isFoundingMember, setIsFoundingMember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Check cache first
    if (foundingMemberCache.has(userId)) {
      setIsFoundingMember(foundingMemberCache.get(userId) || false);
      return;
    }

    const checkStatus = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('founding33_purchases')
          .select('user_id')
          .eq('status', 'completed')
          .eq('user_id', userId)
          .maybeSingle();

        const isFounding = !!data;
        foundingMemberCache.set(userId, isFounding);
        setIsFoundingMember(isFounding);
      } catch (error) {
        console.error('Error checking founding member status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [userId]);

  return { isFoundingMember, loading };
};
