import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface UsePresenceTrackingOptions {
  contentType: 'course' | 'tutorial' | 'module';
  contentId: string;
  progressPercentage?: number;
  metadata?: Record<string, any>;
}

export const usePresenceTracking = ({
  contentType,
  contentId,
  progressPercentage = 0,
  metadata = {}
}: UsePresenceTrackingOptions) => {
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;

    // Function to update presence
    const updatePresence = async () => {
      try {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: user.id,
            content_type: contentType,
            content_id: contentId,
            progress_percentage: progressPercentage,
            metadata,
            last_seen: new Date().toISOString(),
          }, {
            onConflict: 'user_id,content_type,content_id',
            ignoreDuplicates: false
          });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    // Initial update
    updatePresence();

    // Update presence every 15 seconds
    intervalRef.current = setInterval(updatePresence, 15000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Final update before leaving
      updatePresence();
    };
  }, [user, contentType, contentId, progressPercentage, JSON.stringify(metadata)]);

  return null;
};
