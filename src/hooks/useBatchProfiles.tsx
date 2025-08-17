import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BatchProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export const useBatchProfiles = (userIds: string[]) => {
  const [profiles, setProfiles] = useState<Record<string, BatchProfile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userIds.length === 0) return;

    const loadProfiles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.rpc('get_profiles_batch', {
          user_ids: userIds
        });

        if (error) throw error;

        const profileMap: Record<string, BatchProfile> = {};
        data?.forEach((profile: any) => {
          profileMap[profile.user_id] = profile;
        });

        setProfiles(profileMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [userIds.join(',')]);

  return { profiles, loading, error };
};